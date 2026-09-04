# Reavaliação técnica e bateria pesada da calculadora

Data da reavaliação: 2026-09-04

## Escopo

Foram reavaliados:

- `projetos/calculadora/js/operacoes.js`
- `projetos/calculadora/js/script.js`
- `projetos/calculadora/teste-calculadora.js`
- `projetos/calculadora.html`
- `projetos/calculadora/script-refatorado.md`

Nenhum arquivo de código, HTML, CSS ou teste original foi alterado nesta
reavaliação. Este documento é somente um relatório.

## Validação executada

### Suíte existente

Comando:

```powershell
node .\Portifolio\projetos\calculadora\teste-calculadora.js
```

Resultado: falhou imediatamente no teste de inicialização. O teste espera
`expressao.textContent === "0"`, mas o código inicializa esse campo como uma
string vazia (`""`).

### Bateria adicional externa

Foi executada uma bateria em memória, sem criar ou modificar arquivos do
projeto, cobrindo:

- soma, subtração, multiplicação e divisão;
- decimais e números negativos;
- divisão por zero;
- operador inválido;
- propagação de `NaN` e `Infinity`;
- limite de 12 caracteres;
- ponto decimal repetido;
- expressões com múltiplos operadores;
- precedência matemática padrão.

Resultado das verificações isoladas: **15 passaram e 9 falharam**.

Os quatro casos de expressão complexa falharam:

| Expressão | Esperado pela matemática padrão | Resultado atual |
| --- | ---: | ---: |
| `2 + 3 * 4` | 14 | 20 |
| `12 + 34 * 5 - 6 / 2` | 179 | 112 |
| `100 - 20 / 5 + 3 * 4` | 108 | 76 |
| `9 / 3 + 2 * 7 - 1` | 16 | 34 |

O resultado adicional corrigido confirma: **0 de 4 expressões complexas
passaram**.

## Diagnóstico principal

### 1. Não existe avaliação de expressão

`script.js` mantém apenas `primeiroNumero` e `operador`. Ao selecionar um novo
operador, o cálculo anterior é executado imediatamente. Isso implementa
avaliação estritamente da esquerda para a direita, e não a precedência padrão:

1. parênteses, se forem suportados;
2. multiplicação e divisão;
3. soma e subtração;
4. associação da mesma prioridade da esquerda para a direita.

Para aceitar expressões maiores, é necessário armazenar tokens ou uma expressão
completa e avaliá-la por um parser seguro. Encadear chamadas de
`calcularOperacao` não resolve esse requisito.

### 2. O módulo de operações não valida tipos nem resultados

`operacoes.js` aceita coerção implícita do JavaScript. Por exemplo,
`calcularOperacao("7", "+", 2)` produz `"72"` em vez de rejeitar uma entrada
não numérica. Também não há política explícita para `NaN`, `Infinity`,
overflow, precisão decimal ou números muito grandes.

### 3. Divisão por zero tem contrato inconsistente

`calcularOperacao` retorna `null`, enquanto a camada de interface decide como
exibir o erro. A função de seleção de operador limpa silenciosamente o estado,
mas o cálculo final mostra um alerta genérico. O comportamento deve ser
centralizado e ter mensagens/estados consistentes.

### 4. Inicialização da expressão é inconsistente com o teste

`expressaoAtual` começa como `""`, mas o teste existente espera `"0"`. Deve ser
definido um contrato único: expressão vazia ou exibição explícita de `0`.

### 5. Referência de script quebrada no HTML

Em `projetos/calculadora.html`, a referência:

```html
<script src="calculadora/operacoes.js" defer></script>
```

aponta para um arquivo inexistente. O arquivo real está em
`calculadora/js/operacoes.js`. Em um navegador, isso impede o carregamento da
função de operações.

### 6. Acoplamento elevado ao DOM

O estado e a lógica estão em variáveis globais e são inicializados diretamente
no carregamento do script. Isso dificulta testes unitários, suporte a
expressões longas e tratamento de estados inválidos.

## Código que precisa ser refatorado

### Prioridade alta — motor de expressão

- Separar tokenização, validação e avaliação.
- Implementar precedência padrão para `+`, `-`, `*` e `/`.
- Definir associação à esquerda para operadores de mesma prioridade.
- Rejeitar expressões incompletas, operadores consecutivos inválidos e tokens
  não numéricos.
- Tratar divisão por zero com um erro tipado ou resultado explícito.
- Não usar `eval` ou `Function` para interpretar a entrada.

### Prioridade alta — estado da interface

- Substituir o modelo de `primeiroNumero`/`operador` por uma expressão/token
  atual.
- Separar estado da calculadora da renderização do DOM.
- Definir como `±`, `%`, `apagar`, `C` e `=` funcionam dentro de expressões
  maiores.
- Preservar a expressão completa no display e mostrar o resultado separadamente.

### Prioridade média — validação numérica

- Validar entradas antes de chamar as operações.
- Definir limites para tamanho da expressão e magnitude dos números.
- Definir arredondamento/formatação para evitar exibir artefatos de ponto
  flutuante.
- Cobrir números negativos, decimais, zeros à esquerda e entradas vazias.

### Prioridade média — testes

- Corrigir o contrato do teste de inicialização.
- Adicionar casos parametrizados de precedência e associação.
- Testar sequências de botões equivalentes às expressões textuais.
- Testar estado após erro, limpeza, apagar e novo cálculo.
- Validar o carregamento dos scripts referenciados pelo HTML.

### Prioridade baixa — organização

- Remover código comentado duplicado de listeners em `script.js`.
- Exportar a lógica pura em uma unidade testável, mantendo a adaptação ao DOM
  em outra camada.
- Adicionar uma forma reproduzível de executar os testes, caso o projeto passe
  a adotar automação.

## Critérios de aceite recomendados para a próxima refatoração

Os casos abaixo devem produzir exatamente os resultados indicados:

```text
2 + 3 * 4                  = 14
12 + 34 * 5 - 6 / 2       = 179
100 - 20 / 5 + 3 * 4      = 108
9 / 3 + 2 * 7 - 1         = 16
8 / 4 * 2                 = 4
10 - 2 - 3                = 5
2 * 3 + 4 * 5             = 26
50 - 6 / 2 + 3            = 50
```

Até que esses critérios sejam atendidos, a calculadora não deve ser
considerada compatível com expressões maiores e precedência matemática padrão.
