const registerUser = async () => {
  const user = {
    id: Date.now().toString(),
    nombre: document.getElementById("name").value,
    email: document.getElementById("email").value,
    rol: "user"
  };

  const response = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });

  const data = await response.json();
  console.log("Usuario creado:", data);
  alert("Usuario registrado correctamente!");
};

document.getElementById("registerBtn").addEventListener("click", registerUser);