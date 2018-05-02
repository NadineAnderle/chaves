const RabbitMQ = require('rabbitmq-node');
const redis = require('redis');

let rabbitmq = new RabbitMQ('amqp://localhost');
let client = redis.createClient(6379, "10.0.0.86", {});

console.time('#forEach');

let chaves = [];
chaves.push({
    UF: 33,
    Cnpj: '00834279000109',
    Modelo: 65,
    Serie: '6',
    Numero: '50776',
    ChaveDeAcesso: []
});

/*parametros que o usuário deve informar para blocos*/
let divisor = 10;
let max = 20;
/*parametros que o usuário deve informar para blocos*/

/*parametros para montar os blocos*/
let x = Math.round(max / divisor);
let m = Math.round(max / 2);
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
    chaves.forEach(function (chave) {
        for (let i = bloco.ini; i <= bloco.fim; i++) {
            //normal  
            chaveaux = chave.UF + '1804' + chave.Cnpj.padStart(14, "0") + chave.Modelo + chave.Serie.padStart(3, "0") +
                chave.Numero.padStart(9, "0") + '1' + i.toString().padStart(8, "0");
            dv = geraDV(chaveaux);
            // chave.ChaveDeAcesso.push(chaveaux + dv);
            client.lpush("ChavesAcesso",chaveaux+dv,function(err,ret){
                err =>{
                    console.error(err);
                },
                ret =>{
                    console.log(ret);
                }
            });
            //contingencia
            chaveaux = chave.UF + '1804' + chave.Cnpj.padStart(14, "0") + chave.Modelo + chave.Serie.padStart(3, "0") +
                chave.Numero.padStart(9, "0") + '9' + i.toString().padStart(8, "0");
            dv = geraDV(chaveaux);
            // chave.ChaveDeAcesso.push(chaveaux + dv);
            client.lpush("ChavesAcesso",chaveaux+dv,function(err,ret){
                err =>{
                    console.error(err);
                },
                ret =>{
                    console.log(ret);
                }
            });
        }
    });
});

chaves.forEach(function (chave) {
    rabbitMQ(chave);
});
/* monta os cNFs de acordo com a logica de blocos informada*/
// console.log(chaves);

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



function rabbitMQ(message) {

    console.log(message);

    rabbitmq.on('message', function (channel, message) {
        console.log(message);
    });

    rabbitmq.on('error', function (err) {
        console.error(err);
    });

    rabbitmq.on('logs', function (print_log) {
        console.info(print_log);
    });

    rabbitmq.subscribe('fil2',{type:'direct'});
    rabbitmq.publish('fil2', 'message');
    // rabbitmq.pull('Chaves', 'message');

    //   rabbitmq.unpull('Chaves');
}
console.timeEnd('#forEach');    