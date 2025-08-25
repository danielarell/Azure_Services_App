const registerUser = async () => {
  // Validar que los campos no estén vacíos
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  
  if (!name || !email) {
    alert("Por favor, completa todos los campos");
    return;
  }

  const user = {
    id: Date.now().toString(),
    nombre: name,
    email: email,
    rol: "user"
  };

  try {
    console.log("Enviando usuario:", user);
    
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });

    console.log("Respuesta status:", response.status);
    console.log("Respuesta headers:", response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log("Usuario creado exitosamente:", data);
    alert("Usuario registrado correctamente!");
    
    // Limpiar los campos después del registro exitoso
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    
  } catch (error) {
    console.error("Error completo:", error);
    alert(`Error al registrar usuario: ${error.message}`);
  }
};

document.getElementById("registerBtn").addEventListener("click", registerUser);