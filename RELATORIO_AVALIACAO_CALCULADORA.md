# Relatório de avaliação do projeto

## Escopo analisado

O projeto é um portfólio estático composto por:

- `index.html`: página principal do portfólio.
- `css/style.css`: layout, slideshow e tema claro/escuro.
- `js/main.js`: troca automática de slides e alternância de tema.
- `projetos/index.html`: página da calculadora.
- `projetos/calculadora/css/style.css`: aparência e responsividade da calculadora.
- `projetos/calculadora/js/script.js`: estado, entrada, operações e eventos da calculadora.
- `projetos/calculadora/script-refatorado.md`: proposta de refatoração documentada, sem integração ao script principal.

Não foram alterados arquivos existentes. Foi adicionado somente
`projetos/calculadora/teste-calculadora.js`.

## Testes realizados

Comando executado na raiz `Site_Ptf`:

```text
node .\Portifolio\projetos\calculadora\teste-calculadora.js
```

Resultado: **10 testes passaram**.

| Função/comportamento | Resultado |
| --- | --- |
| `atualizarDisplay` | PASS |
| `iniciarNovaEntrada` | PASS |
| `digitarNumero` | PASS |
| `seletorOperacao` | PASS |
| `limparDisplay` | PASS |
| `apagarUltimoDigito` | PASS |
| `alternarSinal` | PASS |
| `aplicarPorcentagem` | PASS |
| `calcularOperacao` | PASS |
| `calcularResultado` | PASS |

Também foram verificadas soma, subtração, multiplicação, divisão, ponto
decimal repetido, limite de entrada, divisão por zero e sequência de nova
entrada após um resultado.

## Avaliação técnica

### Pontos positivos

- Implementação simples, sem dependências externas.
- Separação básica entre HTML, CSS e JavaScript.
- Operações matemáticas principais e controles da interface estão presentes.
- Tratamento explícito para divisão por zero.
- Layout responsivo da calculadora para telas estreitas.
- O teste usa um DOM mínimo simulado e não exige alteração no código de produção.

### Riscos e oportunidades identificados

- `atualizarDisplay` escreve `entradaAtual` tanto na expressão quanto no
  resultado; a expressão armazenada em `expressaoAtual` não é apresentada.
- O botão de igualdade recebe dois listeners no script original, causando
  execução duplicada desnecessária.
- O script depende de variáveis globais e de elementos DOM existentes, o que
  dificulta testes unitários e manutenção.
- Não há fluxo de execução documentado no README atual.
- Não há `package.json`, automação de testes ou lint configurados.
- Acessibilidade pode ser melhorada com `aria-label`, foco visível e textos
  alternativos mais descritivos para imagens.
- O slideshow usa valores fixos (`totalSlides = 2` e intervalo fixo), o que
  exige alteração manual quando novos slides são adicionados.

Esses pontos foram apenas registrados; nenhum arquivo de produção foi alterado.

## Plano estruturado do projeto

### Fase 1 — Documentação

1. Descrever objetivo, estrutura de pastas e como abrir o portfólio.
2. Documentar a calculadora, seus controles e limitações atuais.
3. Documentar o comando de teste e o resultado esperado.

### Fase 2 — Qualidade da calculadora

1. Separar lógica de cálculo da camada de DOM.
2. Corrigir a apresentação da expressão no display.
3. Remover listeners duplicados.
4. Definir comportamento para entradas inválidas, arredondamento e overflow.
5. Manter os testes para cada função e adicionar casos de borda.

### Fase 3 — Interface e acessibilidade

1. Adicionar nomes acessíveis aos botões.
2. Garantir foco de teclado e operação por teclado.
3. Revisar contraste, feedback de erro e responsividade.
4. Tornar o slideshow orientado pela quantidade real de slides.

### Fase 4 — Automação

1. Adicionar uma configuração mínima de execução de testes.
2. Integrar os testes ao fluxo de validação do projeto.
3. Adicionar validação de HTML, CSS e JavaScript quando houver ferramentas
   escolhidas para isso.

## Próximo passo pendente

O pedido de atualizar `README.md` conflita com a instrução de não alterar nenhum
arquivo existente. Este relatório pode servir como base para a atualização,
mas é necessária autorização explícita para modificar o README existente ou a
indicação de um novo nome para uma cópia documentada.
