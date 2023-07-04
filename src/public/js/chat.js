let chatBox = document.getElementById("chatBox");

Swal.fire({
  title: "Authentication",
  input: "text",
  text: "Set username for the Chat",
  background: '#222',
  color: '#fff',
  inputValidator: (value) => {
    return !value.trim() && "Please write a valid username"
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
  document.getElementById("user").innerHTML = `<b>${user}: </b>`
  
  let socket = io()

  chatBox.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      if (chatBox.value.trim().length > 0) {
        let newMessage = {
          user,
          message: chatBox.value,
        };
        socket.emit("message", newMessage);

        chatBox.value = "";
      }
    }
  })

  socket.on("logs", (data) => {
    const divLogs = document.getElementById("messagesLogs");
    let messages = "";
    data.reverse().forEach((message) => {
      messages += ` <div class="gradient p-2 my-2 rounded-2">
      <p><strong><i>${message.user}</i>:</strong> ${message.message}</p>
      </div>`;
    });
    divLogs.innerHTML = messages;
  })

  socket.on("alert", () => {
    Toastify({
      text: "New user connected.",
      duration: 2000,
      newWindow: true,
      gravity: "bottom",
      position: "right",
      stopOnFocus: true,
      backgroundColor: "linear-gradient(to right, #3876a4, #00997b)",
      onClick: function () {},
    }).showToast()
  })
})