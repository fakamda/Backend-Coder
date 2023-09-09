export const generateProductErrorInfo = product => {
    return `
    Uno o mas parametros estan incompletos o no son validos.
    Lista de properties obligatorios: 
    - title: Must be a string (${product.title}})
    - description: Must be a string (${product.description}})
    - price: Must be a Number. (${product.price})
    `
}