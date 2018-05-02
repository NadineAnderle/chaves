function geraDV(chave) {

    let multiplicadores = [4, 3, 2, 9, 8, 7, 6, 5]; //4,3,2,9,8,7,6,5 - 5, 6, 7, 8, 9, 2, 3, 4
    let i = 0;
    let soma_ponderada = 0;

    while (i <= 42) {
        for (let m = 0; m < multiplicadores.length && i <= 42; m++) {
            soma_ponderada = soma_ponderada + (chave[i] * multiplicadores[m]);
            console.log("chave",chave[i]);
            console.log("multiplicador",multiplicadores[m]);
            console.log("soma_ponderada",soma_ponderada);
            i++;
        }
    }

    let resto = soma_ponderada % 11;

    if (resto == '0' || resto == '1') {
        return 0;
    } else {
        return (11 - resto);
    }

}
let nfe = "3318040083427900010965006000050776900000020";
let dv = geraDV(nfe);

console.log(dv);
