document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registration-form');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
  
        // Obtiene los valores del formulario
        var nombreCliente = document.getElementById('nombreCliente').value.trim();
        var apellidoCliente = document.getElementById('apellidoCliente').value.trim();
        var telefonoCliente = document.getElementById('telefonoCliente').value.trim();
        var email = document.getElementById('email').value.trim();
        var password = document.getElementById('contraseña').value;
        var confirmpassword = document.getElementById('confirmar-contraseña').value;
        var direccion = document.getElementById('direccion').value.trim();
  
        // Validaciones
        if (!nombreCliente || !apellidoCliente || !telefonoCliente || !email || !password || !confirmpassword || !direccion) {
            alert('Por favor, completa todos los campos.');
            return;
        }
  
        if (password !== confirmpassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }
  
        if (!(/^\d{8}$/.test(telefonoCliente))) {
            alert('El número de teléfono debe contener 8 dígitos numéricos.');
            return;
        }

        // Registra el usuario en Firebase Authentication
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Una vez registrado, guarda la información del usuario en Firestore
            return firebase.firestore().collection("Usuario").doc(userCredential.user.uid).set({
                nombre: nombreCliente,
                apellidos: apellidoCliente,
                telefono: telefonoCliente,
                email: email,
                direccion: direccion,
                password: password,
                role: 'cliente',
                uid: userCredential.user.uid
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
