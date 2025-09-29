export interface Endereco {
    idEndereco?: number;
    idCliente: number;
    
    estado: string;
    cidade: string;
    bairro: string;
    logradouro: string;
    complemento: string;
    numero: number;
    cep: string;
    principal?: boolean;
}
