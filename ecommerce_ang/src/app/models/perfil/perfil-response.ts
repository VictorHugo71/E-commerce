import { Usuario } from './usuario';
import { Endereco } from '../endereco/endereco'; 
import { AdminResponse } from '../admin/admin-response';

export interface PerfilResponse extends AdminResponse{
    usuario: Usuario;
    enderecos?: Endereco[];
}
