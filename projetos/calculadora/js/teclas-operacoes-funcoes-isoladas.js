/**
 * Controle isolado dos operadores e das teclas de função.
 *
 * Exemplo de integração no script principal:
 *
 * criarControleOperacoesFuncoes({
 *     elementoRaiz: document.querySelector(".calculadora"),
 *     aoSelecionarOperador: seletorOperacao,
 *     aoCalcular: calcularResultado,
 *     aoApagar: apagarUltimoDigito,
 *     aoLimpar: limparDisplay,
 *     aoPorcentagem: aplicarPorcentagem,
 *     aoAlternarSinal: alternarSinal,
 * });
 */

function criarControleOperacoesFuncoes({
    elementoRaiz = document,
    aoSelecionarOperador,
    aoCalcular,
    aoApagar,
    aoLimpar,
    aoPorcentagem,
    aoAlternarSinal,
}) {
    const callbacks = {
        aoSelecionarOperador,
        aoCalcular,
        aoApagar,
        aoLimpar,
    };

    Object.entries(callbacks).forEach(([nome, callback]) => {
        if (typeof callback !== "function") {
            throw new TypeError(`${nome} deve ser uma função.`);
        }
    });

    const botoesOperadores = Array.from(
        elementoRaiz.querySelectorAll(".operador"),
    );
    const botoesFuncoes = Array.from(
        elementoRaiz.querySelectorAll("[data-acao]"),
    );
    const ouvintes = [];
    const botaoPorcentagem = botoesFuncoes.find(
        (botao) => botao.dataset.acao === "porcentagem",
    );
    const botaoSinal = botoesFuncoes.find(
        (botao) => botao.dataset.acao === "sinal",
    );

    const executarFuncao = (callback, botao, nome) => {
        if (typeof callback === "function") {
            callback();
            return;
        }

        if (botao) {
            botao.click();
            return;
        }

        throw new Error(`Não foi possível executar a função "${nome}".`);
    };

    const registrarClique = (botao, callback) => {
        const ouvirClique = () => callback();
        botao.addEventListener("click", ouvirClique);
        ouvintes.push({ botao, ouvirClique });
    };

    botoesOperadores.forEach((botao) => {
        registrarClique(botao, () =>
            aoSelecionarOperador(botao.dataset.operador),
        );
    });

    const funcoesPorAcao = {
        igual: aoCalcular,
        apagar: aoApagar,
        limpar: aoLimpar,
    };

    botoesFuncoes.forEach((botao) => {
        const callback = funcoesPorAcao[botao.dataset.acao];
        if (callback) {
            registrarClique(botao, callback);
        }
    });

    const acoesPorTecla = {
        "+": () => aoSelecionarOperador("+"),
        "-": () => aoSelecionarOperador("-"),
        "*": () => aoSelecionarOperador("*"),
        "/": () => aoSelecionarOperador("/"),
        Add: () => aoSelecionarOperador("+"),
        Subtract: () => aoSelecionarOperador("-"),
        Multiply: () => aoSelecionarOperador("*"),
        Divide: () => aoSelecionarOperador("/"),
        Enter: aoCalcular,
        NumpadEnter: aoCalcular,
        "=": aoCalcular,
        Equal: aoCalcular,
        Backspace: aoApagar,
        Escape: aoLimpar,
        "%": () => executarFuncao(aoPorcentagem, botaoPorcentagem, "porcentagem"),
        "±": () => executarFuncao(aoAlternarSinal, botaoSinal, "sinal"),
        F9: () => executarFuncao(aoAlternarSinal, botaoSinal, "sinal"),
    };

    const ouvirTeclado = (evento) => {
        if (evento.ctrlKey || evento.altKey || evento.metaKey) {
            return;
        }

        if (evento.key === "%" && !evento.shiftKey) {
            return;
        }

        const acao = acoesPorTecla[evento.key];
        if (!acao) {
            return;
        }

        evento.preventDefault();
        acao();
    };

    elementoRaiz.addEventListener("keydown", ouvirTeclado);

    return {
        destruir() {
            ouvintes.forEach(({ botao, ouvirClique }) => {
                botao.removeEventListener("click", ouvirClique);
            });
            elementoRaiz.removeEventListener("keydown", ouvirTeclado);
        },
    };
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { criarControleOperacoesFuncoes };
}
