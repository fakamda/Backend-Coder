export const generateProductErrorInfo = (product) => {
    return `
    Some fields for create/update a product are invalid:
    List of required fields: 
    - title: Must be a string, but received (${product.title})
    - description: Must be a string, but received (${product.description})
    - price: Must be a number, but received (${product.price})
    - code: Must be a string, but received (${product.code})
    - category: Must be a string, but received (${product.category})
    `;
}

export const addProductToCartErrorInfo = (product) => {
    return `The product with id: ${product._id} was not found`;
  };
  
  export const generateCartErrorInfo = (cart) => {
    return `The cart with id ${cart._id} does not exist`;
  };