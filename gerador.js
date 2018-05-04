
const redis = require('redis');
const fs = require('fs');
// const cluster = require('cluster');

// const numCPUs = require('os').cpus().length;

let item = process.argv[2];

let client = redis.createClient(6379, "10.142.0.2", {});
let file = 'json/json.json';

console.time('#forEach');

let chaves = [];
chaves = JSON.parse(fs.readFileSync(file));

// publicar no redis o numero dos documentos
client.lpush("ChavesNumeracao", chave[item].Numero.toString());

/*parametros que o usuário deve informar para blocos*/
let divisor = 20;
let max = 20;
/*parametros que o usuário deve informar para blocos*/

/*parametros para montar os blocos*/
let x = Math.round(max / divisor);
let m = Math.round(max / 2);

// let bloco = {ini:5000000,fim:5100000};
let blocos = [];
let ini = 0;
let fim = 0;
/*parametros para montar os blocos*/

/* inicio da geracao dos blocos*/

for (let j = 1; fim < max; j++) {
    ini = m - (j * x) + 1;
    fim = m - ((j - 1) * x);
    blocos.push({
        ini,
        fim
    });
    ini = m + 1 + ((j - 1) * x);
    fim = m + (j * x);
    blocos.push({
        ini,
        fim
    });
}
/* fim da geracao dos blocos*/

/* monta os cNFs de acordo com a logica de blocos informada*/
let chaveaux;
let dv;

blocos.forEach(function (bloco) {
    montaChaves(chaves[item],bloco);
});

/* monta os cNFs de acordo com a logica de blocos informada*/

function montaChaves(chave, bloco) {
    for (let i = bloco.ini; i <= bloco.fim; i++) {
        //normal  
        chaveaux = chave.UF + '1804' + chave.Cnpj + chave.Modelo + chave.Serie.padStart(3, "0") +
            chave.Numero.padStart(9, "0") + '1' + i.toString().padStart(8, "0");
        dv = geraDV(chaveaux);
        // console.log(chaveaux + dv);
        client.lpush("ChavesAcesso:" + chave.Numero, chaveaux + dv, function (err, ret) {
            if (err) console.error(err);
            // console.log("nromal",ret);
        });

        //contingencia
        chaveaux = chave.UF + '1804' + chave.Cnpj + chave.Modelo + chave.Serie.padStart(3, "0") +
            chave.Numero.padStart(9, "0") + '9' + i.toString().padStart(8, "0");
        dv = geraDV(chaveaux);

        client.lpush("ChavesAcesso:" + chave.Numero, chaveaux + dv, function (err, ret) {
            if (err) console.error(err);
            // console.log("contingencia",ret);
        });
        // console.log(chaveaux + dv);
    }


}

function geraDV(chave) {

    let multiplicadores = [4, 3, 2, 9, 8, 7, 6, 5]; //4,3,2,9,8,7,6,5 - 5, 6, 7, 8, 9, 2, 3, 4
    let i = 0;
    let soma_ponderada = 0;

    while (i <= 42) {
        for (let m = 0; m < multiplicadores.length && i <= 42; m++) {
            soma_ponderada = soma_ponderada + (chave[i] * multiplicadores[m]);
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

console.timeEnd('#forEach');    