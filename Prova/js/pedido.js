
class pedido{
    constructor(longe, lat, endereco, preco, produto){
        this.endereco = endereco;
        this.longe = longe;
        this.lat = lat;
        this.produto = produto;
        this.preco = preco;
    }
}

module.exports = pedido;