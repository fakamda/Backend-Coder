

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