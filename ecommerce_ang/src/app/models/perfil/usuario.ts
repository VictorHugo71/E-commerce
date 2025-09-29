import { Endereco } from "../endereco/endereco";

export interface Usuario {
    idUsuario: number;
    nomeUsuario: string;
    email: string;
    telefone: string,
    cpf: string,
    avatar: string,
    endereco: Endereco[];
}
