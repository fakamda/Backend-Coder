const socket = io();

const form = document.getElementById("form");
const productsTable = document.getElementById("productsTable");
const tbody = productsTable.querySelector("#tbody");

form.addEventListener("submit", async (e) => {
  e.preventDefault()

  
  let product = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("Price").value,
    code: document.getElementById("code").value,
    category: document.getElementById("category").value,
    stock: document.getElementById("Stock").value,
  };

  console.log(product)

  const res = await fetch("/api/products", {
    method: "POST",
    body: JSON.stringify(product),
    headers: {
      "Content-Type": "application/json",
    },
  })

  try {
    const result = await res.json();
    if (result.status === "error") {
      throw new Error(result.error);
    } else {
      const resultProducts = await fetch("/api/products");
      const results = await resultProducts.json();
      if (result.status === "error") {
        throw new Error(results.error);
      } else {
        socket.emit("updatedProducts", result.payload);

        Toastify({
          text: "Product added Successfully",
          duration: 1500,
          newWindow: true,
          gravity: "bottom",
          position: "right",
          stopOnFocus: true,
          backgroundColor: "linear-gradient(to right, #99c600, #026f3e)",
          
          onClick: function () {},
        }).showToast();

        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("Price").value = "";
        document.getElementById("code").value = "";
        document.getElementById("category").value = "";
        document.getElementById("Stock").value = "";
      }
    }
  } catch (error) {
    console.log(error);
  }
});

const deleteProduct = async (_id) => {
  try {
    const res = await fetch(`/api/products/${_id}`, {
      method: "DELETE",
    });
    const result = await res.json()
    if (result.status === "error") throw new Error(result.error)
    else socket.emit("updatedProducts", result.payload)

    Toastify({
      text: "Product removed Successfully",
      duration: 1500,
      newWindow: true,
      gravity: "bottom",
      position: "right",
      stopOnFocus: true,
      style: { background: "linear-gradient(to right, #d14007, #820957)"},
      onClick: function () {},
    }).showToast();

  } catch (error) {
    console.log(error);
  }
}

// function addProductToCart(cid, pid) {
//   fetch(`/api/carts/${cid}/product/${pid}`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ productId: pid }),
//   })
//     .then(response => response.json())
//     .then(data => {
//       // Maneja la respuesta del servidor
//       console.log('Producto agregado al carrito:', data);
//       // Realiza acciones adicionales según sea necesario
//     })
//     .catch(error => {
//       // Maneja errores de la solicitud
//       console.error('Error al agregar el producto al carrito:', error);
//       // Puedes mostrar un mensaje de error al usuario o realizar acciones adicionales según tu caso
//     });
// }


socket.on("updatedProducts", (payload) => {
  tbody.innerHTML = "";

  payload.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="table-row">${item.title}</td>
      <td class="table-row">${item.description}</td>
      <td class="table-row">${item.price}</td>
      <td class="table-row">${item.code}</td>
      <td class="table-row">${item.category}</td>
      <td class="table-row">${item.stock}</td>
      <td class="table-row">
        <button class="btn btn-danger" onclick="deleteProduct('${item._id}')" id="btnDelete"><i class="fa-sharp fa-solid fa-trash"></i></button>
        <button class="btn btn-success"><i class="fa-solid fa-cart-shopping"></i></button>
      </td>
    `;
    tbody.appendChild(row);
  })
})


