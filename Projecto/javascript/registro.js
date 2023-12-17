document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registration-form');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
  
        // Obtiene los valores del formulario
        var nombreCliente = document.getElementById('nombreCliente').value.trim();
        var apellidoCliente = document.getElementById('apellidoCliente').value.trim();
        var telefonoCliente = document.getElementById('telefonoCliente').value.trim();
        var email = document.getElementById('email').value.trim();
        var contraseña = document.getElementById('contraseña').value;
        var confirmarContraseña = document.getElementById('confirmar-contraseña').value;
        var direccion = document.getElementById('direccion').value.trim();
  
        // Validaciones
         if (!nombreCliente || !apellidoCliente || !telefonoCliente || !email || !contraseña || !confirmarContraseña || !direccion) {
            alert('Por favor, completa todos los campos.');
            return;
        }
  
        if (contraseña !== confirmarContraseña) {
            alert('Las contraseñas no coinciden.');
            return;
        }
  
        if (!(/^\d{8}$/.test(telefonoCliente))) {
            alert('El número de teléfono debe contener 8 dígitos numéricos.');
            return;
        }

        // Registra el usuario en Firebase Authentication primero
        firebase.auth().createUserWithEmailAndPassword(email, contraseña)
        .then((userCredential) => {
            const uid = userCredential.user.uid;
            return firebase.firestore().collection("usuarios").doc(uid).set({
                nombre: nombreCliente,
                apellido: apellidoCliente,
                telefono: telefonoCliente,
                email: email,
                direccion: direccion,
                rol: 'cliente'
            });
        })
        .then(() => {
            alert("Usuario registrado con éxito");
            form.reset(); 
        })
        .catch((error) => {
            console.error("Error al crear el usuario: ", error);
            alert(`Ocurrió un error al registrar el usuario: ${error.message}`);
        });
    });
});
