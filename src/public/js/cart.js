// const socket = io()


function addProductToCart(pid) {
  const cid = '64b0e821ad6550a00434e7af' // usando un solo cart
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
    })
}

  const removeProductFromCart = async (pid) => {
    try{
    const cid = '64b0e821ad6550a00434e7af' 
    
     await fetch(`/api/carts/${cid}/products/${pid}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      // const result = await res.json()
      // if (result.status === "error") throw new Error(result.error)
      //  socket.emit("updatedProducts", result.payload)

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

  // socket.on("updatedProducts", (payload) => {
  //   const tbody = document.getElementById("tbody");
  //   tbody.innerHTML = "";
  
  //   payload.forEach((item) => {
  //     const row = document.createElement("tr");
  //     row.innerHTML = `
  //       <td class="table-row">${item.product.title}</td>
  //       <td class="table-row">${item.product.description}</td>
  //       <td class="table-row">${item.product.price}</td>
  //       <td class="table-row">${item.product.code}</td>
  //       <td class="table-row">${item.product.stock}</td>
  //       <td class="table-row">${item.quantity}</td>
  //       <td class="table-row">
  //         <button class="btn btn-danger" onclick="removeProductFromCart('${item.product._id}')"><i class="fa-sharp fa-solid fa-trash"></i></button>
  //       </td>
  //     `;
  //     tbody.appendChild(row);
  //   });
  // });