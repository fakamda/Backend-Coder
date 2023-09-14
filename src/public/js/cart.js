function addProductToCart(pid) {
  fetch("/api/carts/user/cart")
    .then((response) => response.json())
    .then((data) => {
      const cid = data.userCart;

      fetch(`/api/carts/${cid}/product/${pid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
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
        .catch((error) => {
          console.error("Error al agregar producto al carrito:", error);
        });
    })
    .catch((error) => {
      console.error("Error al obtener user.cart:", error);
    });
}

const removeProductFromCart = async (pid) => {
  try {
    const response = await fetch("/api/carts/user/cart");
    const data = await response.json();
    const cid = data.userCart;

    await fetch(`/api/carts/${cid}/products/${pid}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    Toastify({
      text: "Product removed Successfully",
      duration: 1500,
      newWindow: true,
      gravity: "bottom",
      position: "right",
      stopOnFocus: true,
      style: { background: "linear-gradient(to right, #d14007, #820957)" },
      onClick: function () {},
    }).showToast();

    location.reload();
  } catch (error) {
    console.log(error);
  }
};

const purchaseCart = async () => {
  try {
    const response = await fetch("/api/carts/user/cart");
    const data = await response.json();
    const cid = data.userCart;

    const purchaseResponse = await fetch(`/api/carts/${cid}/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!purchaseResponse.ok) {
      // Manejar error y mostrar SweetAlert de error
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "The products you want to purchase may not have stock",
        footer: '<a href="">Why do I have this issue?</a>',
      });
    } else {
      // Mostrar SweetAlert de éxito
      await Swal.fire({
        icon: "success",
        title: "Your products were purchased successfully",
        text: "We sent you an Email with the ticket",
        footer: '<a href="/products">Purchase More</a>',
      });

      // Recargar la página después de mostrar SweetAlert
      location.reload();
    }
  } catch (err) {
    console.log(err);
  }
};
