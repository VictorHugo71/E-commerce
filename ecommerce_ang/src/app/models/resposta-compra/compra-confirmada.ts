//Dados de resposta da compra
export interface DadosConfimacaoCompra { 
    //Dados Transação
    idTransacao: string;
    status: 'aprovado' | 'pendente' | 'rejtada';
    mensagem: string;
    dataHora: string;

    //Dados Pagamento
    metodoPagamento: 'pix' | 'cartão_credito ' | 'boleto';
    valorTotal: number;
    parcelas?: number;

    //Dados Cliente
    nomeCliente: string;
    emailCliente: string;

    //Opcional para pix/boleto
    codigoPix: string;
    dataVencimento: string;
}
