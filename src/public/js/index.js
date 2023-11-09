const socket = io();

const form = document.getElementById("form");
const productsTable = document.getElementById("productsTable");
const tbody = productsTable.querySelector("#tbody");

form.addEventListener("submit", async (e) => {
  e.preventDefault()

  
//   let product = {
//     title: document.getElementById("title").value,
//     description: document.getElementById("description").value,
//     price: document.getElementById("Price").value,
//     code: document.getElementById("code").value,
//     category: document.getElementById("category").value,
//     stock: document.getElementById("Stock").value,
//     thumbnail: document.getElementById("image").value
//   };

//   console.log(product)

//   const res = await fetch("/api/products", {
//     method: "POST",
//     body: JSON.stringify(product),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })

//   try {
//     const result = await res.json();
//     if (result.status === "error") {
//       throw new Error(result.error);
//     } else {
//       const resultProducts = await fetch("/api/products");
//       const results = await resultProducts.json();
//       if (result.status === "error") {
//         throw new Error(results.error);
//       } else {
        
//         socket.emit("updatedProducts", result.payload);

//         Toastify({
//           text: "Product added Successfully",
//           duration: 1500,
//           newWindow: true,
//           gravity: "bottom",
//           position: "right",
//           stopOnFocus: true,
//           backgroundColor: "linear-gradient(to right, #99c600, #026f3e)",
          
//           onClick: function () {},
//         }).showToast();

//         document.getElementById("title").value = "";
//         document.getElementById("description").value = "";
//         document.getElementById("Price").value = "";
//         document.getElementById("code").value = "";
//         document.getElementById("category").value = "";
//         document.getElementById("Stock").value = "";
//         document.getElementById("image").value = ""
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

// let product = {
//   title: document.getElementById("title").value,
//   description: document.getElementById("description").value,
//   price: document.getElementById("Price").value,
//   code: document.getElementById("code").value,
//   category: document.getElementById("category").value,
//   stock: document.getElementById("Stock").value,
// };

// const formData = new FormData();
// formData.append("thumbnail", document.getElementById("image").files[0]);

// for (const key in product) {
//   formData.append(key, product[key]);
// }

// try {
//   const res = await fetch("/api/products", {
//       method: "POST",
//       body: formData,
//   });

//   const result = await res.json();
//   if (result.status === "success") {
//       // Handle success
//       console.log("Product added successfully");

//       // Clear form fields
//       document.getElementById("title").value = "";
//       document.getElementById("description").value = "";
//       document.getElementById("Price").value = "";
//       document.getElementById("code").value = "";
//       document.getElementById("category").value = "";
//       document.getElementById("Stock").value = "";
//       document.getElementById("image").value = "";

//   } else {
//       // Handle error
//       console.error("Error adding product:", result.error);
//   }
// } catch (error) {
//   console.error(error);
// }
// });

let product = {
  title: document.getElementById("title").value,
  description: document.getElementById("description").value,
  price: document.getElementById("Price").value,
  code: document.getElementById("code").value,
  category: document.getElementById("category").value,
  stock: document.getElementById("Stock").value,
};

const formData = new FormData();
formData.append("fileType", "product");  // Agrega el campo fileType con valor "product"

for (const key in product) {
  formData.append(key, product[key]);
}

formData.append("files", document.getElementById("image").files[0]);

try {
  const res = await fetch("/api/products", {
      method: "POST",
      body: formData,
  });

  const result = await res.json();
  if (result.status === "success") {
      // Handle success
      console.log("Product added successfully");

      // Clear form fields
      document.getElementById("title").value = "";
      document.getElementById("description").value = "";
      document.getElementById("Price").value = "";
      document.getElementById("code").value = "";
      document.getElementById("category").value = "";
      document.getElementById("Stock").value = "";
      document.getElementById("image").value = "";

  } else {
      // Handle error
      console.error("Error adding product:", result.error);
  }
} catch (error) {
  console.error(error);
}
});


const deleteProduct = async (_id) => {
  try {
    const res = await fetch(`/api/products/${_id}`, {
      method: "DELETE",
    })
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
      <td class="table-row">${item.thumbnails}</td>
      <td class="table-row">
        <button class="btn btn-danger" onclick="deleteProduct('${item._id}')" id="btnDelete"><i class="fa-sharp fa-solid fa-trash"></i></button>
        <button class="btn btn-warning"><i class="fa-solid fa-pen"></i></button>
      </td>
    `;
    tbody.appendChild(row);
  })
})


