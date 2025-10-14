//Dados enviado para o Mercdado Pago/Livre
import { ItemCarrinhoMP } from "../carrinho/item-carrinhoMP"
import { Endereco } from "../endereco/endereco"

export interface PayloadMP {
    //ID recebido do banco de dados
    idPedidoInterno: number,

    //Dados do comprador
    emailCliente: string,
    idCliente: number,

    itens: ItemCarrinhoMP[],

    //Dados do envio
    enderecoEnvio: Endereco[],
}
