function calcularOperacao(numInicial, operador, numFinal) {
    switch (operador) {
        case "+":
            return numInicial + numFinal;
        case "-":
            return numInicial - numFinal;
        case "*":
            return numInicial * numFinal;
        case "/":
            if (numFinal === 0) {
                return null;
            }
            return numInicial / numFinal;
        default:
            return null; // operador inválido
    }
}

function calcularPorcentagem(valor,base=null) {
    if (base === null) {
        return (valor / 100);
    }
    return (base*valor) / 100;
}