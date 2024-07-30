// app.js
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Dados em memória
let pedidos = [];
let rotas = [];

// Rota para criar um novo pedido
app.post('/pedidos', (req, res) => {
    const { endereco, latitude, longitude, produto, quantidade } = req.body;

    if (!endereco || !latitude || !longitude || !produto || !quantidade) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const novoPedido = {
        endereco,
        latitude,
        longitude,
        produto,
        quantidade,
    };

    pedidos.push(novoPedido);
    res.status(201).json(novoPedido);
});

// Rota para listar todos os pedidos
app.get('/pedidos', (req, res) => {
    res.status(200).json(pedidos);
});

// Rota para criar uma nova rota
app.post('/rotas', (req, res) => {
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
        return res.status(400).json({ error: 'Latitude e Longitude são obrigatórios' });
    }

    const novaRota = {
        id: rotas.length + 1,
        latitude,
        longitude,
    };

    rotas.push(novaRota);
    res.status(201).json(novaRota);
});

// Rota para listar todas as rotas
app.get('/rotas', (req, res) => {
    res.status(200).json(rotas);
});

// Rota para encontrar a melhor rota para os pedidos
app.get('/melhor-rota/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const rota = rotas.find(r => r.id === id);

    if (!rota) {
        return res.status(404).json({ error: 'Rota não encontrada' });
    }

    if (pedidos.length === 0) {
        return res.status(404).json({ error: 'Nenhum pedido encontrado' });
    }

    // Calcula a melhor rota com base na distância euclidiana
    let ordemPedidos = [];
    let pedidosAux = [...pedidos];

    while (pedidosAux.length > 0) {
        let menorDistancia = Infinity;
        let pedidoSelecionado;
        let indexSelecionado;

        pedidosAux.forEach((pedido, index) => {
            const distancia = Math.sqrt(
                Math.pow(pedido.latitude - rota.latitude, 2) +
                Math.pow(pedido.longitude - rota.longitude, 2)
            );

            if (distancia < menorDistancia) {
                menorDistancia = distancia;
                pedidoSelecionado = pedido;
                indexSelecionado = index;
            }
        });

        ordemPedidos.push(pedidoSelecionado);
        pedidosAux.splice(indexSelecionado, 1);
    }

    res.status(200).json(ordemPedidos);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
