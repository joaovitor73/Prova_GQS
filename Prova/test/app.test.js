// app.test.js
const request = require('supertest');
const app = require('../API/app'); // Ajuste o caminho conforme necessário

describe('Testes da API', () => {
  

    test('GET /pedidos deve retornar a lista de pedidos', async () => {
        const res = await request(app).get('/pedidos');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    test('POST /pedidos deve criar um novo pedido', async () => {
        const novoPedido = {
            endereco: 'Rua Teste, 123',
            latitude: 40.7128,
            longitude: -74.0060,
            produto: 'Produto Teste',
            quantidade: 1
        };

        const res = await request(app).post('/pedidos').send(novoPedido);
        expect(res.statusCode).toBe(201);
        expect(res.body).toMatchObject(novoPedido);
    });

    test('GET /rotas deve retornar a lista de rotas', async () => {
        const res = await request(app).get('/rotas');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    test('POST /rotas deve criar uma nova rota', async () => {
        const novaRota = {
            latitude: 40.7128,
            longitude: -74.0060
        };

        const res = await request(app).post('/rotas').send(novaRota);
        expect(res.statusCode).toBe(201);
        expect(res.body).toMatchObject(novaRota);
    });

    test('GET /melhor-rota/:id deve retornar a melhor rota de entrega', async () => {
        const pedido = {
            endereco: 'Rua Teste, 123',
            latitude: 40.7128,
            longitude: -74.0060,
            produto: 'Produto Teste',
            quantidade: 1
        };

        const rota = {
            latitude: 40.7128,
            longitude: -74.0060
        };

        await request(app).post('/pedidos').send(pedido);
        const resRota = await request(app).post('/rotas').send(rota);

        const idRota = resRota.body.id;

        const res = await request(app).get(`/melhor-rota/${idRota}`);
        expect(res.statusCode).toBe(200);
        expect(res.body[0]).toMatchObject(pedido);
    });
});
