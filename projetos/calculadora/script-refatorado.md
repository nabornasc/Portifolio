# JavaScript refatorado da calculadora

Este arquivo contém uma versão refatorada do `script.js`. Os arquivos originais não foram alterados.

```js
const displayResultado = document.getElementById("resultado");
const displayExpressao = document.getElementById("expressao");
const botoesNumeros = document.querySelectorAll(".numerico");
const botoesOperadores = document.querySelectorAll(".operador");
const botaoLimpar = document.querySelector('[data-acao="limpar"]');
const botaoApagar = document.querySelector('[data-acao="apagar"]');
const botaoPorcentagem = document.querySelector('[data-acao="porcentagem"]');
const botaoSinal = document.querySelector('[data-acao="sinal"]');
const botaoCalcular = document.querySelector('[data-acao="igual"]');

const LIMITE_DIGITOS = 12;

let entradaAtual = "0";
let primeiroNumero = null;
let operador = null;
let calculoFinalizado = false;
let expressaoAtual = "";

function atualizarDisplay() {
  displayExpressao.textContent = expressaoAtual;
  displayResultado.textContent = entradaAtual;
}

function iniciarNovaEntrada() {
  if (calculoFinalizado) {
    entradaAtual = "0";
    expressaoAtual = "";
    calculoFinalizado = false;
  }
}

function digitarNumero(numero) {
  iniciarNovaEntrada();

  if (entradaAtual.length >= LIMITE_DIGITOS) {
    return;
  }

  if (numero === "." && entradaAtual.includes(".")) {
    return;
  }

  if (entradaAtual === "0") {
    entradaAtual = numero === "." ? "0." : numero;
  } else {
    entradaAtual += numero;
  }

  atualizarDisplay();
}

function calcularOperacao(numeroInicial, operadorSelecionado, numeroFinal) {
  switch (operadorSelecionado) {
    case "+":
      return numeroInicial + numeroFinal;
    case "-":
      return numeroInicial - numeroFinal;
    case "*":
      return numeroInicial * numeroFinal;
    case "/":
      if (numeroFinal === 0) {
        alert("Erro: Divisão por zero não é permitida.");
        return null;
      }
      return numeroInicial / numeroFinal;
    default:
      return null;
  }
}

function selecionarOperacao(operadorSelecionado) {
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

function limparDisplay() {
  entradaAtual = "0";
  primeiroNumero = null;
  operador = null;
  calculoFinalizado = false;
  expressaoAtual = "";
  atualizarDisplay();
}

function apagarUltimoDigito() {
  if (calculoFinalizado) {
    limparDisplay();
    return;
  }

  entradaAtual = entradaAtual.length > 1 ? entradaAtual.slice(0, -1) : "0";

  atualizarDisplay();
}

function alternarSinal() {
  if (entradaAtual === "0") {
    return;
  }

  entradaAtual = entradaAtual.startsWith("-")
    ? entradaAtual.slice(1)
    : `-${entradaAtual}`;

  atualizarDisplay();
}

function aplicarPorcentagem() {
  entradaAtual = (Number(entradaAtual) / 100).toString();
  atualizarDisplay();
}

function calcularResultado() {
  if (primeiroNumero === null || operador === null) {
    return;
  }

  const segundoNumero = Number(entradaAtual);
  const resultado = calcularOperacao(primeiroNumero, operador, segundoNumero);

  if (resultado === null) {
    limparDisplay();
    return;
  }

  expressaoAtual = `${primeiroNumero} ${operador} ${segundoNumero} =`;
  entradaAtual = resultado.toString();
  primeiroNumero = null;
  operador = null;
  calculoFinalizado = true;
  atualizarDisplay();
}

botoesNumeros.forEach((botao) => {
  botao.addEventListener("click", () => {
    digitarNumero(botao.dataset.numero);
  });
});

botoesOperadores.forEach((botao) => {
  botao.addEventListener("click", () => {
    selecionarOperacao(botao.dataset.operador);
  });
});

botaoLimpar.addEventListener("click", limparDisplay);
botaoApagar.addEventListener("click", apagarUltimoDigito);
botaoPorcentagem.addEventListener("click", aplicarPorcentagem);
botaoSinal.addEventListener("click", alternarSinal);
botaoCalcular.addEventListener("click", calcularResultado);

atualizarDisplay();
```

## Testes executados

O código acima foi extraído deste arquivo e validado com testes de comportamento em um DOM simulado:

- Entrada de números e ponto decimal.
- Soma, subtração, multiplicação e divisão.
- Sequência de operações, como `2 + 3 * 4`.
- Divisão por zero.
- Limpeza do estado.
- Apagar o último dígito.
- Alteração de sinal com `±`.
- Conversão para porcentagem com `%`.
- Início de uma nova entrada depois de um resultado.

Resultado: todos os testes passaram.
