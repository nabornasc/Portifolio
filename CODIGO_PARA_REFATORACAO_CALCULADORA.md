# Código para refatoração — calculadora

Data: 2026-09-04

## Objetivo

Este documento apresenta os trechos atuais que precisam ser refatorados antes
de qualquer implementação. Os comentários explicam, linha a linha, como cada
parte interage com o estado da calculadora, com o DOM e com outros arquivos.

Os arquivos originais não foram alterados. Os blocos abaixo são apenas cópias
anotadas para análise.

## 1. `js/operacoes.js`

### Código atual anotado

```js
function calcularOperacao(numInicial, operador, numFinal) {
// Declara uma função global usada por `script.js`.
// Interage com a camada de interface por meio da chamada feita durante a
// seleção de operadores e durante o cálculo final.

    switch (operador) {
    // Escolhe o comportamento com base no operador recebido.
    // Não valida o tipo de `numInicial` nem de `numFinal` antes da escolha.

        case "+":
        // Entra neste bloco quando o operador da interface é `+`.
        // A origem do operador é o atributo `data-operador` dos botões HTML.
            return numInicial + numFinal;
            // Soma os valores, mas permite coerção implícita do JavaScript.
            // Se um argumento for string, `+` pode concatenar texto em vez de
            // realizar uma soma numérica.

        case "-":
        // Entra neste bloco quando o botão de subtração foi selecionado.
            return numInicial - numFinal;
            // Retorna imediatamente o resultado para `script.js`.
            // A operação também depende da conversão implícita do JavaScript.

        case "*":
        // Entra neste bloco quando o botão de multiplicação foi selecionado.
            return numInicial * numFinal;
            // Retorna o produto dos operandos.
            // Não existe proteção contra `NaN`, `Infinity` ou overflow.

        case "/":
        // Entra neste bloco quando o botão de divisão foi selecionado.
            if (numFinal === 0) {
            // Impede a divisão explícita por zero.
            // A comparação é estrita e só identifica o número 0.
                return null;
                // Usa `null` como sinal de erro.
                // `script.js` interpreta esse valor e decide como limpar o
                // estado ou exibir uma mensagem.
            }
            return numInicial / numFinal;
            // Retorna o quociente.
            // Divisores inválidos ou valores não finitos ainda podem produzir
            // resultados não controlados.

        default:
        // Executado quando a interface envia um operador não reconhecido.
            return null; // operador inválido
            // Reutiliza `null` para dois erros diferentes: operador inválido e
            // divisão por zero. Isso dificulta mensagens e tratamento precisos.
    }
    // Finaliza a seleção da operação e devolve o controle ao chamador.
};
// O ponto e vírgula encerra a declaração da função, mas a função continua
// disponível globalmente para o script carregado posteriormente.
```

### Refatoração sugerida

- Validar que ambos os operandos são números finitos.
- Substituir `null` por um contrato de erro explícito e consistente.
- Separar a operação pura da apresentação de mensagens.
- Manter este módulo independente do DOM.
- Reutilizar as operações no avaliador de expressões com precedência.

## 2. `js/script.js` — estado e display

### Código atual anotado

```js
const displayResultado = document.getElementById("resultado");
// Busca o elemento em que o resultado final ou a entrada atual será exibido.
// Depende de existir um elemento HTML com `id="resultado"`.

const botoesNumeros = document.querySelectorAll(".numerico");
// Obtém todos os botões numéricos e o ponto decimal.
// Interage com os atributos `data-numero` definidos no HTML.

const botoesOperadores = document.querySelectorAll(".operador");
// Obtém os botões `+`, `-`, `*` e `/`.
// Cada botão fornece seu operador por `data-operador`.

const botaoLimpar = document.querySelector('[data-acao="limpar"]');
// Obtém o botão que deve zerar o estado completo.

const botaoApagar = document.querySelector('[data-acao="apagar"]');
// Obtém o botão que remove o último caractere da entrada atual.

const botaoCalcular = document.querySelector('[data-acao="igual"]');
// Obtém o botão `=`, responsável pelo cálculo final.

const displayExpressao = document.getElementById("expressao");
// Busca o elemento que deveria mostrar a expressão.
// Atualmente recebe `expressaoAtual`, mas começa vazio.

const botaoPorcentagem = document.querySelector('[data-acao="porcentagem"]');
// Obtém o botão `%`, que altera apenas a entrada atual.

const botaoSinal = document.querySelector('[data-acao="sinal"]');
// Obtém o botão `±`, que altera o sinal da entrada atual.

const LIMITE_DIGITOS = 12;
// Define um limite para a entrada de um número individual.
// Não limita o tamanho total de uma expressão com vários números.

let entradaAtual = "0";
// Mantém o texto que está sendo digitado.
// É convertido para número quando uma operação é calculada.

let primeiroNumero = null;
// Guarda apenas um operando.
// Esta limitação impede armazenar uma expressão longa completa.

let operador = null;
// Guarda apenas um operador pendente.
// A existência de somente um operador causa avaliação imediata da esquerda
// para a direita, sem precedência matemática.

let calculoFinalizado = false;
// Informa se o último resultado foi concluído.
// É consultado para decidir se a próxima entrada deve iniciar um novo cálculo.

let expressaoAtual = "";
// Guarda somente o texto parcial montado pelo script.
// Não representa tokens completos nem uma árvore de expressão.

function atualizarDisplay() {
// Centraliza a atualização visual dos dois elementos do display.
    displayExpressao.textContent = expressaoAtual;
    // Mostra a expressão armazenada.
    // No início, mostra vazio, enquanto o teste existente espera `0`.
    displayResultado.textContent = entradaAtual;
    // Mostra a entrada ou resultado atual.
}

function iniciarNovaEntrada() {
// Prepara a calculadora para receber um número depois de `=`.
    if (calculoFinalizado) {
    // Só entra neste bloco depois de um cálculo finalizado.
        entradaAtual = "0";
        // Descarta o resultado anterior para a nova digitação.
        expressaoAtual = "";
        // Descarta a expressão anterior do display.
        calculoFinalizado = false;
        // Permite que a próxima entrada seja tratada como um novo número.
    }
}
// Esta função não cria uma nova entrada dentro de uma expressão longa; apenas
// reinicia o cálculo após o resultado final.
```

### Refatoração sugerida

- Encapsular o estado em um objeto ou módulo.
- Substituir `primeiroNumero` e `operador` por uma lista de tokens.
- Separar estado matemático, estado de edição e renderização.
- Definir explicitamente o conteúdo inicial de `displayExpressao`.
- Criar uma função de estado previsível para cada ação da interface.

## 3. `js/script.js` — entrada e seleção de operações

### Código atual anotado

```js
function digitarNumero(numero) {
// Recebe o valor do botão numérico por meio de `botao.dataset.numero`.
    iniciarNovaEntrada();
    // Pode apagar o resultado anterior antes de inserir o novo caractere.

    if (entradaAtual.length >= LIMITE_DIGITOS) {
        return;
        // Interrompe a entrada quando o número atual possui 12 caracteres.
        // Não informa ao usuário que o limite foi atingido.
    }

    if (numero === "." && entradaAtual.includes(".")) {
        return;
        // Impede dois pontos no mesmo número.
        // Não valida outras formas de entrada inválida.
    }

    if (entradaAtual === "0") {
        entradaAtual = numero === "." ? "0." : numero;
        // Substitui o zero inicial pelo primeiro dígito ou cria um decimal.
    } else {
        entradaAtual += numero;
        // Concatena o caractere ao texto atual.
    }
    atualizarDisplay();
    // Reflete a alteração no DOM.
}

function seletorOperacao(operadorSelecionado) {
// Recebe o operador do botão HTML e decide como continuar o cálculo.
    if (primeiroNumero !== null && operador !== null) {
        // Se já existe uma operação pendente, calcula imediatamente o par
        // anterior antes de aceitar o próximo operador.
        const resultadoParcial = calcularOperacao(
            primeiroNumero,
            operador,
            Number(entradaAtual));
        // Converte somente a entrada atual e envia os valores ao módulo
        // `operacoes.js`.

        if (resultadoParcial === null) {
            limparDisplay();
            return;
            // Em caso de erro, apaga o estado sem preservar a expressão nem
            // diferenciar operador inválido de divisão por zero.
        }
        primeiroNumero = resultadoParcial;
        // Substitui o primeiro operando pelo resultado parcial.
    } else {
        primeiroNumero = Number(entradaAtual);
        // Registra a entrada como primeiro operando da operação.
    }

    operador = operadorSelecionado;
    // Guarda somente o novo operador.
    expressaoAtual = `${primeiroNumero} ${operador}`;
    // Monta apenas a expressão parcial, não toda a sequência digitada.
    entradaAtual = "0";
    // Prepara o segundo operando.
    calculoFinalizado = false;
    // Mantém a calculadora em modo de edição.
    atualizarDisplay();
    // Atualiza a expressão e o resultado no DOM.
}
```

### Falha demonstrada

Como o cálculo parcial acontece dentro de `seletorOperacao`, a sequência
`2 + 3 * 4` é reduzida assim:

```text
2 + 3 = 5
5 * 4 = 20
```

O comportamento correto pela precedência padrão seria:

```text
3 * 4 = 12
2 + 12 = 14
```

## 4. `js/script.js` — cálculo final e eventos

### Código atual anotado

```js
function calcularResultado() {
// É chamado pelo clique do botão `=`.
    if (primeiroNumero === null || operador === null) {
        return;
        // Ignora o clique quando não existe uma operação binária completa.
    }

    const segundoNumero = Number(entradaAtual);
    // Converte o texto atual para o segundo operando.

    const resultado = calcularOperacao(primeiroNumero,
        operador,
        segundoNumero);
    // Executa apenas uma operação entre dois números.
    // Não avalia uma expressão com vários operadores.

    if (resultado === null) {
        alert("Erro: Operação inválida.");
        // Exibe uma mensagem genérica, inclusive para divisão por zero.
        limparDisplay();
        // Remove o estado após o erro.
        return;
        // Impede a atualização normal do resultado.
    }

    expressaoAtual = `${primeiroNumero} ${operador} ${segundoNumero} =`;
    // Registra somente a última operação binária.

    entradaAtual = resultado.toString();
    // Converte o resultado para texto para o display.

    primeiroNumero = null;
    // Remove o primeiro operando pendente.
    operador = null;
    // Remove o operador pendente.
    calculoFinalizado = true;
    // Faz a próxima digitação iniciar uma nova entrada.
    atualizarDisplay();
    // Renderiza a expressão final e o resultado.
}

botoesNumeros.forEach((botao) => {
// Itera pelos botões numéricos encontrados no DOM.
    botao.addEventListener("click", () => {
        digitarNumero(botao.dataset.numero);
        // Liga o clique à entrada do caractere correspondente.
    });
});

botoesOperadores.forEach((botao) => {
// Itera pelos botões de operação.
    botao.addEventListener("click", () => {
        seletorOperacao(botao.dataset.operador);
        // Liga o clique à avaliação parcial atual.
    });
});

botaoLimpar.addEventListener("click", limparDisplay);
// Liga o botão `C` à limpeza completa do estado.
botaoApagar.addEventListener("click", apagarUltimoDigito);
// Liga o botão de apagar à edição da entrada atual.
botaoPorcentagem.addEventListener("click", aplicarPorcentagem);
// Liga `%` à conversão da entrada atual para uma fração.
botaoSinal.addEventListener("click", alternarSinal);
// Liga `±` à alteração do sinal da entrada atual.
botaoCalcular.addEventListener("click", calcularResultado);
// Liga `=` ao cálculo final.

atualizarDisplay();
// Executa a primeira renderização depois que as referências do DOM foram
// criadas.
```

### Refatoração sugerida

- Fazer o botão `=` avaliar todos os tokens acumulados.
- Usar um parser seguro com precedência, sem `eval` ou `Function`.
- Diferenciar erro de sintaxe, divisão por zero e resultado não finito.
- Evitar que a apresentação da expressão dependa apenas do último par.
- Garantir que cada botão tenha um único listener efetivo.

## 5. `calculadora.html` — integração com scripts

### Código atual anotado

```html
<script src="calculadora/operacoes.js" defer></script>
<!-- O navegador procura `projetos/calculadora/operacoes.js`.
     Esse arquivo não existe nesse caminho. -->

<script src="calculadora/js/script.js" defer></script>
<!-- Este caminho aponta para `projetos/calculadora/js/script.js`.
     O script depende de `calcularOperacao`, portanto a referência anterior
     precisa carregar o arquivo correto antes dele. -->
```

### Refatoração sugerida

- Corrigir a referência para o caminho real de `js/operacoes.js`.
- Validar o carregamento dos scripts no navegador.
- Manter a ordem de carregamento compatível com as dependências, ou converter
  a lógica para módulos com importações explícitas.

## Ordem recomendada para implementação futura

1. Corrigir a integração dos scripts no HTML.
2. Criar um avaliador puro de expressões com precedência.
3. Definir contratos de erro e validação numérica.
4. Adaptar o estado da interface ao novo avaliador.
5. Atualizar os testes para expressões pequenas e longas.
6. Validar display, teclado, porcentagem, sinal, apagar e recuperação após erro.

## Critérios de análise antes da implementação

As decisões ainda precisam ser confirmadas antes da refatoração:

- A calculadora terá suporte a parênteses?
- O limite de 12 caracteres será por número ou por expressão inteira?
- Como serão exibidos resultados decimais com imprecisão de ponto flutuante?
- `%` será uma conversão simples para `/ 100` ou seguirá a semântica de
  calculadoras comerciais em operações compostas?
- O usuário poderá editar qualquer parte da expressão ou somente a entrada atual?

