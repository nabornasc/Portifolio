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
    displayExpressao.textContent=entradaAtual;
    displayResultado.textContent = entradaAtual;
}

// digitação de números

function digitarNumero(numero) {
    if (entradaAtual.length >= LIMITE_DIGITOS) {
        return; // não permite digitar mais dígitos se atingir o limite
    }
    if (numero === "." && entradaAtual.includes(".")) {
        return; // não permite digitar mais de um ponto decimal
    }

    if (entradaAtual === "0") {
        if (numero === ".") {
            entradaAtual = "0.";
        } else {
            entradaAtual = numero; // substitui o 0 inicial pelo número digitado
        }
    } else {
        entradaAtual += numero;
    }
    atualizarDisplay();
}

// função para realizar operações matemáticas

function seletorOperacao(operadorSelecionado) {
    primeiroNumero = Number(entradaAtual);
    operador = operadorSelecionado;
    displayExpressao =`${primeiroNumero} ${operador}`;
    entradaAtual = "0";
    atualizarDisplay();
}

// função para limpar o display

function limparDisplay() {
    entradaAtual = "0";
    primeiroNumero = null;
    operador = null;
    atualizarDisplay();
}

// função para apagar o último dígito

function apagarUltimoDigito() {
    if (entradaAtual.length > 1) {
        entradaAtual = entradaAtual.slice(0, -1); // remove o último caractere da string
    } else {
        entradaAtual = "0"; // se só tiver um dígito, volta para 0
    }
    atualizarDisplay();
}

// função para calcular o resultado

function calcularResultado() {
  const segundoNumero = Number(entradaAtual);
  let resultado;
  
  switch (operador) {
    case "+":
      resultado = primeiroNumero + segundoNumero;
      break;
    case "-":
      resultado = primeiroNumero - segundoNumero;
      break;
    case "*":
      resultado = primeiroNumero * segundoNumero;
      break;
    case "/":
      if (segundoNumero === 0) {
        alert("Erro: Divisão por zero não é permitida.");
        limparDisplay();
        return;
      }
      resultado = primeiroNumero / segundoNumero;
      break;
    default:
      return; // operador inválido
  }

  entradaAtual = resultado.toString();
  atualizarDisplay();
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

botaoLimpar.addEventListener("click", () => {
    limparDisplay();
});

// adicionar evento ao botão de apagar

botaoApagar.addEventListener("click", () => {
    apagarUltimoDigito();
});

// adicionar evento ao botão de calcular

botaoCalcular.addEventListener("click", () => {
    calcularResultado();
});

// inicializa o display

atualizarDisplay();


