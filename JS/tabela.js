// Função para carregar o CSV e retornar o valor de uma célula
const valorantigo = 6966.5
async function carregarCSV2(valoratual) {
    try {
        const response = await fetch('../CSV/Produtos.csv'); // Altere o caminho se necessário
        const data = await response.text();
        const linhas = data.split('\n').slice(1); // Ignora a primeira linha de cabeçalhos

        const container = document.getElementById('cardContainer');
        container.innerHTML = ''; // Limpa os cards antigos
        linhas.forEach(linha => {
            let [produto, marca, valor] = linha.split(',');
            valor = valor.replace(',', '.'); // Substituir a vírgula por ponto para valor numérico
            const inter = valoratual/valorantigo
            valor = valor*inter
            //construir o caminho da imagem
            const imagemPath = `../Imagem/${produto.trim()}.jpg`;

            const card = document.createElement('div');
            card.classList.add('card');

            card.innerHTML = `
                <img src="${imagemPath}" alt="${produto.trim()}">
                <h3>${produto.trim()}</h3>
                <p>Marca: ${marca.trim()}</p>
                <p>Valor: R$ ${parseFloat(valor).toFixed(2)}</p>
            `;

            container.appendChild(card);
        });
        valorantigo = valoratual 
    } catch (error) {
        console.error('Erro ao carregar o CSV2:', error);
    }
}
async function carregarCSV() {
    const response = await fetch('../CSV/IPCA.csv');
    const data = await response.text();
    const linhas = data.split('\n'); // Divide o conteúdo em linhas
    return linhas.map(linha => linha.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)); // Usa regex para separar corretamente as colunas
}

// Função para pegar o valor de uma célula específica
async function obterValorCelula(linha, coluna) {
    const linhas = await carregarCSV(); // Carrega as linhas do CSV
    const linhaEscolhida = linhas[linha - 1]; // Acessa a linha desejada (compensação de índice)
    
    // Verifica se a linha foi corretamente carregada e existe a coluna
    if (linhaEscolhida && linhaEscolhida[coluna - 1]) {
        const valor = linhaEscolhida[coluna - 1].replace(/"/g, ''); // Remove aspas duplas se houver
        return valor;
    }
    return null;
}

// Carregar os produtos na página ao carregar
carregarCSV2(6966.5);

// Função para tratar o envio do formulário
document.getElementById('meuFormulario').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita o recarregamento da página ao submeter o formulário
    
    // Obtém o valor de mês e ano selecionados
    const mesAno = document.getElementById('mes-ano').value;
    const [ano, mesNumero] = mesAno.split('-');
    const mes = parseInt(mesNumero);

    const anoA = ano-1994
    const anoB = anoA*12



    // Pega os valores de linha e coluna inseridos no formulário
    const linha = anoB+mes;
    const coluna = 2;

    // Obtém o valor da célula correspondente
    const valor = await obterValorCelula(linha, coluna);

    // Se o valor for encontrado, converte para número (se houver vírgula, substitui por ponto) e exibe
    if (valor) {
        const valorNumerico = parseFloat(valor.replace(',', '.')); // Substitui a vírgula por ponto
        const SalarioMinimo = await obterValorCelula(linha, 2);
        document.getElementById('SalarioMinimo').innerText = `Valor: R$ ${parseFloat(SalarioMinimo).toFixed(2)`;
        carregarCSV2(valorNumerico)
    } else {
        document.getElementById('resultado').innerText = 'Célula não encontrada ou valor inválido.';
    }
});
