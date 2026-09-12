/**
 * Implementação isolada das teclas numéricas da calculadora.
 *
 * Este arquivo não é carregado pelo HTML atual. Para utilizá-lo, passe a
 * função responsável por atualizar o estado da calculadora:
 *
 * const controleNumerico = criarControleTeclasNumericas({
 *     elementoRaiz: document.querySelector(".calculadora"),
 *     aoDigitar: digitarNumero,
 * });
 *
 * O retorno possui o método `destruir`, útil para remover os listeners.
 */

function criarControleTeclasNumericas({
    elementoRaiz = document,
    aoDigitar,
}) {
    if (typeof aoDigitar !== "function") {
        throw new TypeError("aoDigitar deve ser uma função.");
    }

    const botoesNumericos = Array.from(
        elementoRaiz.querySelectorAll(".numerico"),
    );

    const entradaNumericaValida = (valor) =>
        typeof valor === "string" && (/^\d$/.test(valor) || valor === ".");

    const digitarSeValido = (valor) => {
        if (entradaNumericaValida(valor)) {
            aoDigitar(valor);
        }
    };

    const ouvintesDosBotoes = botoesNumericos.map((botao) => {
        const ouvirClique = () => digitarSeValido(botao.dataset.numero);
        botao.addEventListener("click", ouvirClique);
        return { botao, ouvirClique };
    });

    const ouvirTeclado = (evento) => {
        if (
            evento.ctrlKey ||
            evento.altKey ||
            evento.metaKey ||
            evento.shiftKey
        ) {
            return;
        }

        const teclaNumerica = evento.key === "," ? "." : evento.key;

        if (!entradaNumericaValida(teclaNumerica)) {
            return;
        }

        evento.preventDefault();
        aoDigitar(teclaNumerica);
    };

    elementoRaiz.addEventListener("keydown", ouvirTeclado);

    return {
        destruir() {
            ouvintesDosBotoes.forEach(({ botao, ouvirClique }) => {
                botao.removeEventListener("click", ouvirClique);
            });
            elementoRaiz.removeEventListener("keydown", ouvirTeclado);
        },
    };
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { criarControleTeclasNumericas };
}
