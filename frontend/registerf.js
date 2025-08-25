const registerUser = async (event) => {
    event.preventDefault(); // Prevenir el submit del form
    
    const registerBtn = document.getElementById("registerBtn");
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    
    // Validación básica
    if (!name || !email) {
        alert("Por favor, completa todos los campos");
        return;
    }
    
    // Cambiar estado del botón
    registerBtn.textContent = "Registrando...";
    registerBtn.disabled = true;
    registerBtn.classList.add("loading");
    
    const user = {
        id: Date.now().toString(),
        nombre: name,
        email: email,
        rol: "user",
        fechaRegistro: new Date().toISOString()
    };

    try {
        console.log("=== INICIANDO REGISTRO ===");
        console.log("Datos del usuario:", JSON.stringify(user));
        
        const response = await fetch("/api/register", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        console.log("Status de respuesta:", response.status);
        console.log("Headers de respuesta:", response.headers);

        // Leer la respuesta
        const responseText = await response.text();
        console.log("Respuesta cruda:", responseText);
        
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error("Error parseando JSON:", parseError);
            throw new Error(`Respuesta no válida del servidor: ${responseText}`);
        }

        if (!response.ok) {
            console.error("Error en la respuesta:", data);
            throw new Error(data.error || `Error HTTP ${response.status}`);
        }

        console.log("=== REGISTRO EXITOSO ===");
        console.log("Datos del usuario creado:", data);
        
        alert("¡Usuario registrado correctamente!");
        
        // Limpiar el formulario
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        
    } catch (error) {
        console.error("=== ERROR EN REGISTRO ===");
        console.error("Error completo:", error);
        alert(`Error al registrar usuario: ${error.message}`);
    } finally {
        // Restaurar botón
        registerBtn.textContent = "Registrar Usuario";
        registerBtn.disabled = false;
        registerBtn.classList.remove("loading");
    }
};

// Event listeners
document.getElementById("userForm").addEventListener("submit", registerUser);
document.getElementById("registerBtn").addEventListener("click", registerUser);