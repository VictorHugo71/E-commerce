import { Endereco } from "../endereco/endereco";

export interface Usuario {
    id: number;
    nome: string;
    email: string;
    telefone: string,
    cpf: string,
    avatar: string,
    endereco: Endereco[];
}
