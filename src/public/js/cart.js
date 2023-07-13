
// async function displaySingleCart(cartId) {
//     try {
//       const response = await fetch(`/api/carts/${cartId}`);
//       const data = await response.json();
//       const singleCartDiv = document.getElementById("singleCart");
//       singleCartDiv.innerHTML = ""; // Clear the previous content
  
//       // Create a table to display the cart products
//       const table = document.createElement("table");
//       const tableBody = document.createElement("tbody");
  
//       // Create a row for each product in the cart
//       data.products.forEach((product) => {
//         const row = document.createElement("tr");
  
//         // Create cells for product details
//         const nameCell = document.createElement("td");
//         nameCell.textContent = product.name;
  
//         const priceCell = document.createElement("td");
//         priceCell.textContent = product.price;
  
//         const quantityCell = document.createElement("td");
//         quantityCell.textContent = product.quantity;
  
//         const deleteCell = document.createElement("td");
//         const deleteButton = document.createElement("button");
//         deleteButton.textContent = "Delete";
//         deleteButton.addEventListener("click", () => {
//           deleteProductFromCart(cartId, product.productId);
//         });
//         deleteCell.appendChild(deleteButton);
  
//         // Append cells to the row
//         row.appendChild(nameCell);
//         row.appendChild(priceCell);
//         row.appendChild(quantityCell);
//         row.appendChild(deleteCell);
  
//         // Append the row to the table body
//         tableBody.appendChild(row);
//       });
  
//       // Append the table body to the table
//       table.appendChild(tableBody);
  
//       // Append the table to the singleCartDiv
//       singleCartDiv.appendChild(table);
  
//       // Add a button to delete the entire cart
//       const deleteCartButton = document.createElement("button");
//       deleteCartButton.textContent = "Delete Cart";
//       deleteCartButton.addEventListener("click", () => {
//         deleteCart(cartId);
//       });
//       singleCartDiv.appendChild(deleteCartButton);
//     } catch (error) {
//       console.error(error);
//     }
//   }
  
//   // Function to delete a product from the cart
//   async function deleteProductFromCart(cartId, productId) {
//     try {
//       const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
//         method: "DELETE",
//       });
//       if (response.ok) {
//         // Refresh the cart view after deleting the product
//         displaySingleCart(cartId);
//       } else {
//         console.error("Failed to delete product from cart");
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }
  
//   // Function to delete the entire cart
//   async function deleteCart(cartId) {
//     try {
//       const response = await fetch(`/api/carts/${cartId}`, {
//         method: "DELETE",
//       });
//       if (response.ok) {
//         // Do something after deleting the cart
//       } else {
//         console.error("Failed to delete the cart");
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }
  