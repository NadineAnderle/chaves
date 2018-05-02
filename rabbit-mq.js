// var RabbitMQ = require('rabbitmq-node');

// var rabbitmq = new RabbitMQ('amqp://localhost');


// rabbitmq.on('message', function(channel, message) {
//   console.log(message);
// });

// rabbitmq.on('error', function(err) {
//   console.error(err);
// });

// rabbitmq.on('logs', function(print_log) {
//   console.info(print_log);
// });

// rabbitmq.pull('teste2','mensagem de teste');
// rabbitmq.unpull('teste2');

var amqp = require('amqp');
 
var connection = amqp.createConnection({url: "amqp://guest:guest@localhost:5672"},
                        {defaultExchangeName: "chaves"});

connection.on('error', function(e) {
    console.log("Error from amqp: ", e);
  });

  /*quando está pronta a conexao */
  connection.on('ready', function () {

    var q = connection.queue('chaves', {autoDelete:false,durable:true},function (queue) {
        console.log('Queue ' + queue.name + ' is open');
      });

      q.bind('chaves','chaves',function(){
        console.log('Queue bind is open');
      });
    //   var car = {type:"Fiat", model:"500", color:"white"};
    //   var exc = connection.exchange();

    //   exc.publish('chave', car, function(){});  
      q.on('ready', function(){
          console.log('fila pronta');
      });
  });
