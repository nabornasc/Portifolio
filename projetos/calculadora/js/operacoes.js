function calcularOperacao(numInicial,operador,numFinal) {
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
};