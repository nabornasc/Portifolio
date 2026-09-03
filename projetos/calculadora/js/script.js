// elementos do HTML

const displayResultado = document.getElementById("resultado");
const botoesNumeros = document.querySelectorAll(".numerico"); // nome da class dos botões de números
const botoesOperadores = document.querySelectorAll(".operador"); // nome da class dos botões de operadores
const botaoLimpar = document.querySelector('[data-acao="limpar"]');
const botaoApagar = document.querySelector('[data-acao="apagar"]');
const botaoCalcular = document.querySelector('[data-acao="igual"]');
const displayExpressao = document.getElementById("expressao");
const botaoPorcentagem = document.querySelector('[data-acao="porcentagem"]');
const botaoSinal = document.querySelector('[data-acao="sinal"]');

// configurações iniciais do display

const LIMITE_DIGITOS = 12;

// status da calculadora

let entradaAtual = "0";
let primeiroNumero = null;
let operador = null;
let calculoFinalizado = false;
let expressaoAtual = "";

// função para atualizar o display

function atualizarDisplay() {
    displayExpressao.textContent = entradaAtual;
    displayResultado.textContent = entradaAtual;
}

// iniviar nova entrada após o cálculo

function iniciarNovaEntrada() {
    if (calculoFinalizado) {
        entradaAtual = "0";
        expressaoAtual = "";
        calculoFinalizado = false;
    }
}

// digitação de números

function digitarNumero(numero) {
    iniciarNovaEntrada();

    if (entradaAtual.length >= LIMITE_DIGITOS) {
        return; // não permite digitar mais dígitos se atingir o limite
    }

    if (numero === "." && entradaAtual.includes(".")) {
        return; // não permite digitar mais de um ponto decimal
    }

    if (entradaAtual === "0") {
        entradaAtual = numero === "." ? "0." : numero; // permite digitar ponto decimal após o 0 inicial
    } else {
        entradaAtual += numero;
    }
    atualizarDisplay();
}

// função para realizar operações matemáticas

function seletorOperacao(operadorSelecionado) {
    if (primeiroNumero !== null && operador !== null) {
        const resultadoParcial = calcularOperacao(
            primeiroNumero,
            operador,
            Number(entradaAtual));

        if (resultadoParcial === null) {
            limparDisplay();
            return;
        }
} else {
    primeiroNumero = Number(entradaAtual);
}

operador = operadorSelecionado;
expressaoAtual = `${primeiroNumero} ${operador}`;
entradaAtual = "0";
calculoFinalizado = false;
atualizarDisplay();
}

// função para limpar o display

function limparDisplay() {
    entradaAtual = "0";
    primeiroNumero = null;
    operador = null;
    calculoFinalizado = false;
    expressaoAtual = "";
    atualizarDisplay();
}

// função para apagar o último dígito

function apagarUltimoDigito() {
    if (calculoFinalizado) {
        limparDisplay();
        return;
    }

    entradaAtual = entradaAtual.length > 1 ? entradaAtual.slice(0, -1) : "0";
    
    atualizarDisplay();
}

// função para alterar o sinal do número atual

function alterarSinal() {
    if (entradaAtual === "0") {
        return; // não altera o sinal se o número for zero
    }

    entradaAtual = entradaAtual.startsWith("-") ? entradaAtual.slice(1) : `-${entradaAtual}`;
    
    atualizarDisplay();
}

// função para calcular o resultado

function calcularOperacao(numInicial,operSelecionado,numFinal) {
    switch (operSelecionado) {
        case "+":
            return numInicial + numFinal;
        case "-":
            return numInicial - numFinal;
        case "*":
            return numInicial * numFinal;
        case "/":
            if (numFinal === 0) {
                alert("Erro: Divisão por zero não é permitida.");
                return null;
            }
            return numInicial / numFinal;
        default:
            return null; // operador inválido
    }
}

// adicionar eventos aos botões de números

botoesNumeros.forEach((botao) => {
    botao.addEventListener("click", () => {
        const numero = botao.dataset.numero; // nome do atributo data-numero do botão
        digitarNumero(numero);
    });
});

// adicionar eventos aos botões de operadores

botoesOperadores.forEach((botao) => {
    botao.addEventListener("click", () => {
        const operadorSelecionado = botao.dataset.operador; // nome do atributo data-operador do botão
        seletorOperacao(operadorSelecionado);
    });
});

// adicionar evento ao botão de limpar

// botaoLimpar.addEventListener("click", () => {
//     limparDisplay();
// });

// adicionar evento ao botão de apagar

// botaoApagar.addEventListener("click", () => {
//     apagarUltimoDigito();
// });

// adicionar evento ao botão de calcular

botaoCalcular.addEventListener("click", () => {
    calcularResultado();
});


// adicionar evento aos botões - forma simplificada

botaoLimpar.addEventListener("click", limparDisplay);
botaoApagar.addEventListener("click", apagarUltimoDigito);
botaoPorcentagem.addEventListener("click", aplicarPorcentagem);
botaoSinal.addEventListener("click", alternarSinal);
botaoCalcular.addEventListener("click", calcularResultado);

// inicializa o display

atualizarDisplay();
