
const express = require('express');
const port = 3000;
const app = express();
const rota = require('../js/rota');
const pedido = require('../js/pedido');
const { calcularDistancia } = require('../js/melhorRota');
app.use(express.json());

let pedidos = [];
let rotas = [];

app.post('/pedido', (req, res) => {
    pedidos.push(new pedido(req.body.longe, req.body.lat, req.body.endereco, req.body.preco, req.body.produto));
    res.status(201).send('Pedido criado com sucesso');
});

app.post('/rota', (req, res) => {
    rotas.push(new rota(rotas.length + 1,req.body.latitude, req.body.longitude));
    res.status(201).send('Rota criada com sucesso');
});

app.get('/pedidos', (req, res) => {
    res.json(pedidos).status(200).send();
});

app.get('/rotas', (req, res) => {
    res.json(rotas).status(200).send();
});

app.get('/melhorRota/:id', (req, res) => {
   let id = req.params.id;
   let rota =  rotas.find(rota => rota.id == id);
    if(rota == undefined){
         res.status(404).send('Rota não encontrada');
    }
    let ordemPedidos = [];
    let menorDistancia = Infinity;
    let pedido; 
    let distancia = 0;
    let aux = [...pedidos];
    let iAux = 0;
    for(let i = 0; i < pedidos.length; i++){
        menorDistancia = Infinity;
        for(let j = 0; j < aux.length; j++){
            console.log(aux[j] + " "  + j);
            distancia = (Math.sqrt(
                Math.pow(aux[j].lat - rota.latitude, 2) +
                Math.pow(aux[j].longe - rota.longitude, 2)
            ));
            if(distancia < menorDistancia){
                menorDistancia = distancia;
                pedido = aux[j];
                iAux = j;
            }
        }
        ordemPedidos.push(pedido);
        aux.splice(iAux, 1);
    }
    return res.json(ordemPedidos).status(200).send();
});


app.listen(port, () => {
    console.log(`app listening on, port ${port}`)
});
  
module.exports = app;  