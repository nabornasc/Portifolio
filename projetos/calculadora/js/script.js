// elementos do HTML
const calculadora = document.querySelector(".calculadora");
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
let porcentagemAtual = null;

// função para atualizar o display

function atualizarDisplay() {
    displayExpressao.textContent = expressaoAtual;
    displayResultado.textContent = entradaAtual;
}

// iniviar nova entrada após o cálculo

function iniciarNovaEntrada() {
    if (calculoFinalizado) {
        entradaAtual = "0";
        expressaoAtual = "";
        porcentagemAtual = null;
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
            Number(entradaAtual),
        );

        if (resultadoParcial === null) {
            limparDisplay();
            return;
        }
        primeiroNumero = resultadoParcial;
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
    porcentagemAtual = null;
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

function alternarSinal() {
    if (entradaAtual === "0") {
        return; // não altera o sinal se o número for zero
    }

    entradaAtual = entradaAtual.startsWith("-")
        ? entradaAtual.slice(1)
        : `-${entradaAtual}`;

    atualizarDisplay();
}

// função para aplicar porcentagem ao número atual

function aplicarPorcentagem() {

    const valorAtual = Number(entradaAtual);

    if (primeiroNumero !== null && operador !== null) {
        const resultado=calcularPorcentagem(
            valorAtual,
            primeiroNumero);

        porcentagemAtual = valorAtual;
        
        entradaAtual = resultado.toString();
        
        expressaoAtual = `${primeiroNumero} ${operador} ${valorAtual}%`;

    } else {
        const resultado=calcularPorcentagem(valorAtual);

        entradaAtual = resultado.toString();

        porcentagemAtual = null;
    }
    
    atualizarDisplay();
}

// função para calcular o resultado final

function calcularResultado() {

    if (primeiroNumero === null || operador === null) {
        return; // não há operação a ser realizada
    }

    const segundoNumero = Number(entradaAtual);
    let resultado;
    
    if (porcentagemAtual !== null) {
        const percentual = porcentagemAtual/100;

        switch (operador) {
            case "+":
                resultado = primeiroNumero + (primeiroNumero * percentual);
                break;
            case "-":
                resultado = primeiroNumero - (primeiroNumero * percentual);
                break;
            case "*":
                resultado = primeiroNumero * percentual;
                break;
            case "/":
                if (percentual === 0) {
                    resultado = null;
                } else {
                    resultado = primeiroNumero / percentual;
                }
                break;
            default:
                resultado = null;
            
        }
    } else {
        resultado = calcularOperacao(
            primeiroNumero,
            operador,
            segundoNumero);
    }

    if (resultado === null) {
        alert("Erro: Operação inválida (divisão por zero ou operador inválido).");
        limparDisplay();
        return;
    }

    if (porcentagemAtual !== null) {
        expressaoAtual = `${primeiroNumero} ${operador} ${porcentagemAtual}% = ${resultado}`;
    } else {
        expressaoAtual = `${primeiroNumero} ${operador} ${segundoNumero} = ${resultado}`;
    }

    entradaAtual = resultado.toString();
    primeiroNumero = null;
    operador = null;
    porcentagemAtual = null;
    calculoFinalizado = true;

    atualizarDisplay();
}

// adicionar eventos aos botões de números

botoesNumeros.forEach((botao) => {
    botao.addEventListener("click", () => {
        digitarNumero(botao.dataset.numero); // nome do atributo data-numero do botão
    });
});

// adicionar eventos aos botões de operadores

botoesOperadores.forEach((botao) => {
    botao.addEventListener("click", () => {
        seletorOperacao(botao.dataset.operador); // nome do atributo data-operador do botão
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

// botaoCalcular.addEventListener("click", () => {
//     calcularResultado();
// });

// adicionar evento aos botões - forma simplificada

botaoLimpar.addEventListener("click", limparDisplay);
botaoApagar.addEventListener("click", apagarUltimoDigito);
botaoPorcentagem.addEventListener("click", aplicarPorcentagem);
botaoSinal.addEventListener("click", alternarSinal);
botaoCalcular.addEventListener("click", calcularResultado);

// inicializa o display

atualizarDisplay();
