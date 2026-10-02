# Guia de integração do teclado numérico

Este guia descreve como permitir que o teclado numérico físico controle a
calculadora. Nenhum arquivo existente foi alterado; os trechos abaixo devem ser
aplicados manualmente quando a implementação for aprovada.

## 1. Como a calculadora está organizada

A calculadora já possui funções para todas as ações necessárias:

- `digitarNumero(numero)` recebe números e o ponto decimal;
- `seletorOperacao(operadorSelecionado)` recebe `+`, `-`, `*` ou `/`;
- `calcularResultado()` finaliza a operação;
- `limparDisplay()` limpa o estado;
- `apagarUltimoDigito()` remove o último caractere.

Os botões visuais já chamam essas funções por meio dos atributos `data-*`.
Portanto, a integração do teclado não deve duplicar a lógica matemática:
ela deve apenas traduzir cada tecla em uma chamada existente.

## 2. Criar o mapa das teclas

No arquivo `projetos/calculadora/js/script.js`, depois das constantes dos
elementos do HTML e antes dos listeners dos botões, adicionar:

```js
const teclasNumericas = {
    Numpad0: "0",
    Numpad1: "1",
    Numpad2: "2",
    Numpad3: "3",
    Numpad4: "4",
    Numpad5: "5",
    Numpad6: "6",
    Numpad7: "7",
    Numpad8: "8",
    Numpad9: "9",
    NumpadDecimal: ".",
};

const teclasOperadores = {
    NumpadAdd: "+",
    NumpadSubtract: "-",
    NumpadMultiply: "*",
    NumpadDivide: "/",
};
```

### Por que usar `event.code`

`event.code` identifica a tecla física, como `Numpad1` e `NumpadAdd`.
Isso é mais previsível que `event.key`, que pode variar conforme o idioma e o
layout do teclado.

## 3. Criar o manipulador do teclado

Ainda no `script.js`, adicionar a função abaixo:

```js
function lidarComTecladoNumerico(evento) {
    const codigo = evento.code;
    const numero = teclasNumericas[codigo];
    const operadorTecla = teclasOperadores[codigo];
    const teclaNumerica = codigo in teclasNumericas;

    // Com Num Lock desligado, números e ponto devem continuar funcionando
    // como teclas de navegação do sistema operacional.
    if (teclaNumerica && !evento.getModifierState("NumLock")) {
        return;
    }

    if (numero !== undefined) {
        evento.preventDefault();
        digitarNumero(numero);
        return;
    }

    if (operadorTecla !== undefined) {
        evento.preventDefault();
        seletorOperacao(operadorTecla);
        return;
    }

    switch (codigo) {
        case "NumpadEnter":
        case "Enter":
            evento.preventDefault();
            calcularResultado();
            break;
        case "Delete":
            evento.preventDefault();
            apagarUltimoDigito();
            break;
        case "Escape":
            evento.preventDefault();
            limparDisplay();
            break;
        default:
            break;
    }
}
```

## 4. Registrar o listener global

Depois dos listeners dos botões e antes da chamada final de
`atualizarDisplay()`, adicionar:

```js
document.addEventListener("keydown", lidarComTecladoNumerico);
```

O listener deve ser registrado no `document` porque o foco pode estar em
qualquer parte da página. O `preventDefault()` evita efeitos indesejados, como
o navegador rolar a página ao receber algumas teclas.

Assim, o comportamento fica:

| Tecla | Ação |
| --- | --- |
| `Numpad0` a `Numpad9` | Digita o número |
| `NumpadDecimal` | Digita `.` |
| `NumpadAdd` | Soma |
| `NumpadSubtract` | Subtração |
| `NumpadMultiply` | Multiplicação |
| `NumpadDivide` | Divisão |
| `NumpadEnter` ou `Enter` | Calcula |
| `Delete` | Apaga o último dígito |
| `Escape` | Limpa a calculadora |

O `Backspace` pode ser incluído como alternativa ao `Delete`:

```js
case "Backspace":
case "Delete":
    evento.preventDefault();
    apagarUltimoDigito();
    break;
```

## 5. Ordem final recomendada no `script.js`

A ordem dos novos trechos deve ser:

1. constantes e estado já existentes;
2. mapas `teclasNumericas` e `teclasOperadores`;
3. funções da calculadora já existentes;
4. função `lidarComTecladoNumerico`;
5. listeners dos botões;
6. `document.addEventListener("keydown", lidarComTecladoNumerico);`;
7. `atualizarDisplay();`.

Não é necessário alterar o HTML, adicionar botões ou criar outro arquivo
JavaScript. Os scripts atuais já são carregados com `defer`, então o registro
do listener ocorrerá depois que o documento estiver disponível.

## 6. Validação manual

Após aplicar os trechos:

1. Abra `projetos/calculadora.html` no navegador.
2. Ative o `Num Lock`.
3. Digite `12` no teclado numérico e confirme que o display mostra `12`.
4. Teste `12`, `NumpadAdd`, `3` e `NumpadEnter`; o resultado esperado é `15`.
5. Teste `NumpadDivide` com zero e confirme que o tratamento existente de erro
   continua sendo exibido.
6. Pressione `Delete`, `Backspace`, `Escape` e `NumpadDecimal`.
7. Desative o `Num Lock` e confirme que as teclas numéricas não são
   interceptadas como números.
8. Teste também o teclado alfanumérico para garantir que essa mudança não
   alterou os botões visuais nem outras teclas.

## 7. Observação sobre testes automatizados

O arquivo `projetos/calculadora/teste-calculadora.js` simula cliques e não
possui um objeto `KeyboardEvent`. Depois da implementação, os testes podem ser
ampliados criando um evento com `code`, `getModifierState()` e
`preventDefault()`. Isso é opcional para a integração, mas recomendado para
garantir os casos de `Num Lock`, operadores e `NumpadEnter`.
