function addProductToCart(cid, pid) {
    fetch(`/api/carts/${cid}/product/${pid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId: pid }),
    })
      .then(response => response.json())
      .then(data => {
        // Maneja la respuesta del servidor
        console.log('Producto agregado al carrito:', data);
        // Realiza acciones adicionales según sea necesario
      })
      .catch(error => {
        // Maneja errores de la solicitud
        console.error('Error al agregar el producto al carrito:', error);
        // Puedes mostrar un mensaje de error al usuario o realizar acciones adicionales según tu caso
      });
  }



  function deleteProduct(productId) {
    fetch(`/api/carts/cartId/product/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        // Maneja la respuesta del servidor
        console.log('Producto eliminado:', data);
        // Realiza acciones adicionales según sea necesario
      })
      .catch(error => {
        // Maneja errores de la solicitud
        console.error('Error al eliminar el producto:', error);
        // Puedes mostrar un mensaje de error al usuario o realizar acciones adicionales según tu caso
      });
  }