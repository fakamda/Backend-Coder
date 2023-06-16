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


  const res = await fetch("/api/products", {
    method: "post",
    body: JSON.stringify(product),
    headers: {
      "Content-Type": "application/json",
    },
  });
  try {
    const result = await res.json();
    if (result.status === "error") {
      throw new Error(result.error);
    } else {
      const resultProducts = await fetch("/api/products");
      const results = await resultProducts.json();
      if (results.status === "error") {
        throw new Error(results.error);
      } else {
        socket.emit("productList", results.products);

        alert("Product added successfully")

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


const deleteProduct = async (id) => {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });
    const result = await res.json();
    if (result.status === "error") throw new Error(result.error);
    else socket.emit("productList", result.products);

    alert("Product removed successfully")

  } catch (error) {
    console.log(error);
  }
};

socket.on("updatedProducts", (products) => {

  tbody.innerHTML = "";

  products.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td class="table-row">${item.title}</td>
        <td class="table-row">${item.description}</td>
        <td class="table-row">${item.price}</td>
        <td class="table-row">${item.code}</td>
        <td class="table-row">${item.category}</td>
        <td class="table-row">${item.stock}</td>
        <td class="table-row">
          <button class="btn-delete" onclick="deleteProduct(${item.id})" id="btnDelete">Eliminar</button>
        </td>
      `;
    tbody.appendChild(row);
  });
});
