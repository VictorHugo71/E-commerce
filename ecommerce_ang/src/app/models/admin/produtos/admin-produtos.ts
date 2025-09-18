export interface AdminProdutos {
    Id_Produto?: number,
    Nome_Produto: string,
    Preco: number,
    Descricao: string,
    Id_Categoria: number,
    Estoque: number,
    Status: boolean,
    Imagem_Url?: string,
    Quantidade?: number,
    selecionado?: boolean
}
