//Dados enviado para o Mercdado Pago/Livre
import { ItemCarrinhoMP } from "../carrinho/item-carrinhoMP"
import { Endereco } from "../endereco/endereco"

export interface PayloadMP {
    //ID do pedido recebido do banco de dados
    idPedidoInterno?: number,

    //Dados do comprador
    idCliente: number,
    emailCliente: string,
    telefoneCliente: string,

    //dados de pagamento
    metodoPagamento: 'pix' | 'cartao_credito' | 'boleto' | null;
    valorTotal: number;

    itens: ItemCarrinhoMP[],

    //Dados do envio
    enderecoEnvio: Endereco,
}
