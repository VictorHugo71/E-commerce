export interface AdminProdutos {
    id_produto: number,
    nome: string,
    preco: number,
    descricao: string,
    categoria_id: number,
    estoque: number,
    status: boolean,
    imagem_url: string
}
