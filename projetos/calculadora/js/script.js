// elementos do HTML

const displayResultado = document.getElementById("resultado");
const botoesNumeros = document.querySelectorAll(".numerico"); // nome da class dos botões de números

// status da calculadora

let entradaAtual = "0";

// função para atualizar o display

function atualizarDisplay() {
  displayResultado.textContent = entradaAtual;
}

// digitação de números

function digitarNumero(numero) {
  if (entradaAtual === "0") {
    entradaAtual = numero;
  } else {
    entradaAtual += numero;
  }
  atualizarDisplay();
}

// adicionar eventos aos botões de números

botoesNumeros.forEach((botao) => {
  botao.addEventListener("click", () => {
    const numero = botao.dataset.numero; // nome do atributo data-numero do botão
    digitarNumero(numero);
  });
});

atualizarDisplay();

// botao limpar

const botaoLimpar = document.querySelector('[data-acao="limpar"]');

// função para limpar o display

function limparDisplay() {
  entradaAtual = "0";
  atualizarDisplay();
}

// adicionar evento ao botão de limpar

botaoLimpar.addEventListener("click", () => {
  limparDisplay();
});

// botao apagar ultimo dígito

const botaoApagar = document.querySelector('[data-acao="apagar"]');

// função para apagar o último dígito

function apagarUltimoDigito() {
    if (entradaAtual.length > 1) {
        entradaAtual = entradaAtual.slice(0, -1); // remove o último caractere da string
    } else {
        entradaAtual = "0"; // se só tiver um dígito, volta para 0
    }
    atualizarDisplay();
}

// adicionar evento ao botão de apagar

botaoApagar.addEventListener("click", () => {
    apagarUltimoDigito();
});




















