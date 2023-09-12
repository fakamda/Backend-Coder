function addProductToCart(pid) {
  fetch('/api/carts/user/cart')
    .then(response => response.json())
    .then(data => {
      const cid = data.userCart

      fetch(`/api/carts/${cid}/product/${pid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(response => response.json())
        .then(data => {
          Toastify({
            text: `The product ${pid} was added successfully `,
            duration: 1500,
            newWindow: true,
            gravity: "bottom",
            position: "right",
            stopOnFocus: true,
            backgroundColor: "linear-gradient(to right, #99c600, #026f3e)",
            
            onClick: function () {},
          }).showToast();

        })
        .catch(error => {
          console.error('Error al agregar producto al carrito:', error);
        });
    })
    .catch(error => {
      console.error('Error al obtener user.cart:', error);
    });
}

  const removeProductFromCart = async (pid) => {
    try{
    const response = await fetch('/api/carts/user/cart');
    const data = await response.json();
    const cid = data.userCart;
  
     await fetch(`/api/carts/${cid}/products/${pid}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    

      Toastify({
        text: "Product removed Successfully",
        duration: 1500,
        newWindow: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: { background:"linear-gradient(to right, #d14007, #820957)"},
        onClick: function () {},
      }).showToast();

     location.reload()

    }
    catch (error) {
      console.log(error);
    }

  }
