# Guia de implementação: modo escuro e retorno ao portfólio

Este documento descreve como implementar, na página da calculadora, um botão
de modo escuro e um botão para voltar à página principal do portfólio.

Os passos abaixo são uma especificação de implementação. Nenhum arquivo de
código foi alterado nesta etapa.

## 1. Objetivos

A implementação deve:

- permitir alternar entre os temas claro e escuro;
- preservar a preferência do visitante durante novas visitas;
- manter contraste suficiente no display, nos botões e nos textos;
- respeitar a preferência do sistema quando ainda não houver uma escolha
  salva;
- oferecer um botão de retorno para `../index.html`;
- manter o estilo neumórfico e responsivo já usado pela calculadora;
- continuar funcionando com teclado e leitores de tela.

## 2. Adicionar os controles no HTML

No arquivo `projetos/calculadora.html`, adicionar um grupo de ações próximo ao
topo da calculadora, antes do display:

```html
<nav class="acoes-pagina" aria-label="Ações da página">
    <a class="botao-navegacao" href="../index.html">
        Voltar ao portfólio
    </a>

    <button
        class="botao-navegacao"
        id="alternar-tema"
        type="button"
        aria-pressed="false"
    >
        Ativar modo escuro
    </button>
</nav>
```

### Regras do controle

- O elemento de retorno deve ser um link, pois leva para outra página.
- O alternador de tema deve ser um `button` com `type="button"`.
- O texto do botão deve indicar a ação que será executada, não apenas o estado
  atual.
- `aria-pressed` deve ser atualizado para `true` no modo escuro e `false` no
  modo claro.
- Se forem usados ícones, eles devem ter `aria-hidden="true"` e nunca substituir
  o texto acessível.

## 3. Definir as variáveis de cores

No arquivo `projetos/calculadora/css/style.css`, centralizar as cores em
variáveis no seletor `:root`:

```css
:root {
    color-scheme: light;
    --cor-fundo: #e8edf3;
    --cor-superficie: #e8edf3;
    --cor-display: #dbe2ea;
    --cor-texto: #1d2733;
    --cor-texto-secundario: #4b5b6b;
    --cor-borda: rgba(29, 39, 51, 0.16);
    --cor-destaque: #087f8c;
    --cor-destaque-hover: #066773;
    --cor-operador: #b35c00;
    --cor-resultado: #176b45;
    --sombra-clara: rgba(255, 255, 255, 0.82);
    --sombra-escura: rgba(87, 101, 116, 0.28);
}

[data-tema="escuro"] {
    color-scheme: dark;
    --cor-fundo: #151a21;
    --cor-superficie: #202731;
    --cor-display: #11161d;
    --cor-texto: #f1f5f9;
    --cor-texto-secundario: #c3ceda;
    --cor-borda: rgba(241, 245, 249, 0.16);
    --cor-destaque: #5bd6df;
    --cor-destaque-hover: #8be8ee;
    --cor-operador: #ffb45c;
    --cor-resultado: #70d49e;
    --sombra-clara: rgba(65, 78, 94, 0.72);
    --sombra-escura: rgba(0, 0, 0, 0.46);
}
```

### Critérios de contraste

As cores devem ser verificadas com uma ferramenta de contraste antes da
publicação. Como referência:

- texto normal: contraste mínimo de 4,5:1;
- texto grande: contraste mínimo de 3:1;
- ícones, bordas e controles importantes: contraste mínimo de 3:1;
- foco de teclado: deve ser claramente visível nos dois temas.

Não usar apenas sombra, brilho ou cor para comunicar um estado. O texto do
botão, o foco e `aria-pressed` também devem indicar o estado.

## 4. Aplicar as variáveis ao layout

Substituir cores fixas dos elementos principais por variáveis:

```css
body {
    background: var(--cor-fundo);
    color: var(--cor-texto);
    transition:
        background-color 180ms ease,
        color 180ms ease;
}

.calculadora {
    background: var(--cor-superficie);
    border: 1px solid var(--cor-borda);
    box-shadow:
        12px 12px 24px var(--sombra-escura),
        -12px -12px 24px var(--sombra-clara);
}

.display {
    background: var(--cor-display);
    color: var(--cor-texto);
}

.botao,
.botao-navegacao {
    color: var(--cor-texto);
    border: 1px solid var(--cor-borda);
    background: var(--cor-superficie);
    box-shadow:
        5px 5px 10px var(--sombra-escura),
        -5px -5px 10px var(--sombra-clara);
}

.botao:hover,
.botao-navegacao:hover {
    border-color: var(--cor-destaque);
}

.botao:focus-visible,
.botao-navegacao:focus-visible {
    outline: 3px solid var(--cor-destaque);
    outline-offset: 3px;
}

.operador {
    color: var(--cor-operador);
}

.resultado {
    color: var(--cor-resultado);
}

.acoes-pagina {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: space-between;
    margin-bottom: 1rem;
}
```

O CSS existente deve ser revisado para evitar que regras mais específicas
sobrescrevam as variáveis. As cores de `hover`, `active`, operador e resultado
precisam ser conferidas separadamente nos dois temas.

## 5. Implementar o estado do tema

No arquivo `projetos/calculadora/js/script.js`, obter o botão e criar funções
dedicadas:

```js
const botaoTema = document.getElementById("alternar-tema");
const chaveTema = "tema-calculadora";

function atualizarBotaoTema(modoEscuro) {
    botaoTema.setAttribute("aria-pressed", String(modoEscuro));
    botaoTema.textContent = modoEscuro
        ? "Ativar modo claro"
        : "Ativar modo escuro";
}

function aplicarTema(modoEscuro) {
    document.documentElement.dataset.tema = modoEscuro
        ? "escuro"
        : "claro";
    atualizarBotaoTema(modoEscuro);
}

function obterTemaInicial() {
    const temaSalvo = localStorage.getItem(chaveTema);

    if (temaSalvo === "escuro") {
        return true;
    }

    if (temaSalvo === "claro") {
        return false;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

botaoTema.addEventListener("click", () => {
    const modoEscuroAtual =
        document.documentElement.dataset.tema === "escuro";
    const novoModoEscuro = !modoEscuroAtual;

    aplicarTema(novoModoEscuro);
    localStorage.setItem(
        chaveTema,
        novoModoEscuro ? "escuro" : "claro",
    );
});

aplicarTema(obterTemaInicial());
```

### Cuidados com a implementação

- O código deve ser executado depois que o botão existir no DOM.
- Não usar `eval`, `Function` ou estilos inline para trocar o tema.
- A preferência salva pelo visitante deve ter prioridade sobre a preferência do
  sistema.
- Se `localStorage` estiver indisponível, a calculadora ainda deve alternar
  normalmente durante a sessão.
- O modo escuro não deve alterar o estado matemático da calculadora.

## 6. Implementar o botão de retorno

O link `../index.html` é o caminho correto a partir de
`projetos/calculadora.html`. O estilo deve reutilizar a mesma classe visual do
alternador para manter consistência.

Opcionalmente, adicionar um ícone decorativo:

```html
<a class="botao-navegacao" href="../index.html">
    <span aria-hidden="true">←</span>
    Voltar ao portfólio
</a>
```

O link deve continuar legível sem o ícone e funcionar com foco de teclado.
Evitar `onclick`, `javascript:` e manipulação manual de histórico para uma
navegação simples.

## 7. Suporte à redução de movimento

Como há transição entre temas, preservar a preferência do usuário por menos
movimento:

```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        scroll-behavior: auto !important;
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
    }
}
```

## 8. Checklist de validação

### Funcionalidade

1. Abrir `projetos/calculadora.html`.
2. Confirmar que o tema inicial acompanha a preferência do sistema quando não
   existe uma escolha salva.
3. Alternar para o modo escuro e verificar o texto, o estado
   `aria-pressed` e o contraste.
4. Recarregar a página e confirmar que o tema escolhido foi preservado.
5. Alternar de volta para o modo claro.
6. Clicar em `Voltar ao portfólio` e confirmar que a página principal abre.
7. Fazer uma operação matemática antes e depois da troca de tema.
8. Confirmar que teclado, apagar, limpar, porcentagem e sinal continuam
   funcionando.

### Acessibilidade e responsividade

1. Navegar somente com `Tab`, `Enter` e `Espaço`.
2. Confirmar que o foco é visível nos dois temas.
3. Testar zoom de 200% e telas estreitas.
4. Conferir os contrastes com uma ferramenta WCAG.
5. Testar com `prefers-reduced-motion: reduce`.
6. Verificar que o botão de retorno continua acessível em dispositivos móveis.

## 9. Arquivos envolvidos na futura implementação

| Arquivo | Responsabilidade |
| --- | --- |
| `projetos/calculadora.html` | Controles de tema e retorno |
| `projetos/calculadora/css/style.css` | Variáveis, contraste e estados visuais |
| `projetos/calculadora/js/script.js` | Estado, persistência e alternância do tema |
| `index.html` | Destino do botão de retorno |

