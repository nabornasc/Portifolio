const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const scriptPath = path.join(__dirname, "js", "script.js");
const script = fs.readFileSync(scriptPath, "utf8");

function criarElemento() {
  return {
    textContent: "",
    dataset: {},
    style: {},
    listeners: {},
    addEventListener(evento, callback) {
      this.listeners[evento] = callback;
    },
  };
}

function criarBotao(dataset) {
  const botao = criarElemento();
  botao.dataset = dataset;
  return botao;
}

function criarAmbiente() {
  const elementos = {
    resultado: criarElemento(),
    expressao: criarElemento(),
  };

  const botoesNumeros = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."]
    .map((numero) => criarBotao({ numero }));
  const botoesOperadores = ["+", "-", "*", "/"]
    .map((operador) => criarBotao({ operador }));
  const botoesFuncoes = {
    limpar: criarBotao({ acao: "limpar" }),
    apagar: criarBotao({ acao: "apagar" }),
    porcentagem: criarBotao({ acao: "porcentagem" }),
    sinal: criarBotao({ acao: "sinal" }),
    igual: criarBotao({ acao: "igual" }),
  };

  const todosOsBotoes = [
    ...botoesNumeros,
    ...botoesOperadores,
    ...Object.values(botoesFuncoes),
  ];

  const document = {
    getElementById(id) {
      return elementos[id];
    },
    querySelectorAll(seletor) {
      if (seletor === ".numerico") return botoesNumeros;
      if (seletor === ".operador") return botoesOperadores;
      return [];
    },
    querySelector(seletor) {
      const match = seletor.match(/data-acao="([^"]+)"/);
      return match ? botoesFuncoes[match[1]] : undefined;
    },
  };

  const alertas = [];
  const contexto = {
    document,
    alert: (mensagem) => alertas.push(mensagem),
  };

  vm.runInNewContext(script, contexto, { filename: scriptPath });

  return {
    ...contexto,
    displayResultado: elementos.resultado,
    displayExpressao: elementos.expressao,
    botoesNumeros,
    botoesOperadores,
    botoesFuncoes,
    alertas,
  };
}

function executarTeste(nome, teste) {
  teste();
  console.log(`PASS: ${nome}`);
}

const ambiente = criarAmbiente();
const {
  displayResultado,
  displayExpressao,
  botoesFuncoes,
  alertas,
} = ambiente;

executarTeste("atualizarDisplay inicializa resultado e expressão", () => {
  assert.equal(displayResultado.textContent, "0");
  assert.equal(displayExpressao.textContent, "0");
});

executarTeste("digitarNumero aceita números, ponto e limita repetição decimal", () => {
  ambiente.botoesNumeros.find((botao) => botao.dataset.numero === "1").listeners.click();
  ambiente.botoesNumeros.find((botao) => botao.dataset.numero === ".").listeners.click();
  ambiente.botoesNumeros.find((botao) => botao.dataset.numero === "5").listeners.click();
  ambiente.botoesNumeros.find((botao) => botao.dataset.numero === ".").listeners.click();
  assert.equal(displayResultado.textContent, "1.5");
});

executarTeste("seletorOperacao e calcularResultado executam as quatro operações", () => {
  const casos = [
    ["2", "+", "3", "5"],
    ["8", "-", "3", "5"],
    ["4", "*", "3", "12"],
    ["9", "/", "3", "3"],
  ];

  for (const [primeiro, operador, segundo, esperado] of casos) {
    botoesFuncoes.limpar.listeners.click();
    for (const digito of primeiro) {
      ambiente.botoesNumeros.find((botao) => botao.dataset.numero === digito).listeners.click();
    }
    ambiente.botoesOperadores.find((botao) => botao.dataset.operador === operador).listeners.click();
    for (const digito of segundo) {
      ambiente.botoesNumeros.find((botao) => botao.dataset.numero === digito).listeners.click();
    }
    botoesFuncoes.igual.listeners.click();
    assert.equal(displayResultado.textContent, esperado);
  }
});

executarTeste("calcularOperacao rejeita operador inválido", () => {
  assert.equal(ambiente.calcularOperacao(4, "?", 2), null);
});

executarTeste("divisão por zero alerta e preserva estado válido", () => {
  botoesFuncoes.limpar.listeners.click();
  for (const digito of "5") {
    ambiente.botoesNumeros.find((botao) => botao.dataset.numero === digito).listeners.click();
  }
  ambiente.botoesOperadores.find((botao) => botao.dataset.operador === "/").listeners.click();
  ambiente.botoesNumeros.find((botao) => botao.dataset.numero === "0").listeners.click();
  botoesFuncoes.igual.listeners.click();
  assert.equal(alertas.at(-1), "Erro: Divisão por zero não é permitida.");
});

executarTeste("alternarSinal altera e restaura o sinal", () => {
  botoesFuncoes.limpar.listeners.click();
  ambiente.botoesNumeros.find((botao) => botao.dataset.numero === "7").listeners.click();
  botoesFuncoes.sinal.listeners.click();
  assert.equal(displayResultado.textContent, "-7");
  botoesFuncoes.sinal.listeners.click();
  assert.equal(displayResultado.textContent, "7");
});

executarTeste("aplicarPorcentagem divide a entrada por 100", () => {
  botoesFuncoes.limpar.listeners.click();
  for (const digito of "25") {
    ambiente.botoesNumeros.find((botao) => botao.dataset.numero === digito).listeners.click();
  }
  botoesFuncoes.porcentagem.listeners.click();
  assert.equal(displayResultado.textContent, "0.25");
});

executarTeste("apagarUltimoDigito remove o último caractere", () => {
  botoesFuncoes.limpar.listeners.click();
  for (const digito of "123") {
    ambiente.botoesNumeros.find((botao) => botao.dataset.numero === digito).listeners.click();
  }
  botoesFuncoes.apagar.listeners.click();
  assert.equal(displayResultado.textContent, "12");
});

executarTeste("limparDisplay restaura todo o estado", () => {
  botoesFuncoes.limpar.listeners.click();
  assert.equal(displayResultado.textContent, "0");
  assert.equal(displayExpressao.textContent, "0");
});

executarTeste("iniciarNovaEntrada permite digitar após um resultado", () => {
  ambiente.botoesNumeros.find((botao) => botao.dataset.numero === "2").listeners.click();
  ambiente.botoesOperadores.find((botao) => botao.dataset.operador === "+").listeners.click();
  ambiente.botoesNumeros.find((botao) => botao.dataset.numero === "2").listeners.click();
  botoesFuncoes.igual.listeners.click();
  ambiente.botoesNumeros.find((botao) => botao.dataset.numero === "9").listeners.click();
  assert.equal(displayResultado.textContent, "9");
});

console.log("Resultado: todos os testes da calculadora passaram.");
