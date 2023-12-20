document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            // Buscar el usuario por email
            return firebase.firestore().collection('Usuario').where('email', '==', email).get();
        })
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                if (userData.role === 'admin') {
                    window.location.href = '../html/adminPanel.html';
                } else if (userData.role === 'cliente') {
                    window.location.href = '/paginaCliente.html'; 
                } else {
                    throw new Error('Rol no reconocido');
                }
            } else {
                throw new Error('No se encontró el documento del usuario');
            }
        })
        .catch((error) => {
            console.error("Error al iniciar sesión o al obtener los datos del usuario: ", error);
            alert(`Ocurrió un error: ${error.message}`);
        });
    });

    const resetPasswordLink = document.getElementById('reset-password');
    resetPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        var email = document.getElementById('email').value;

        // Verificar que el campo de email no esté vacío
        if (email) {
            firebase.auth().sendPasswordResetEmail(email)
            .then(function() {
                alert('Se ha enviado un correo electrónico para restablecer tu contraseña.');
            }).catch(function(error) {
                console.error("Error: ", error);
                alert(`Ocurrió un error: ${error.message}`);
            });
        } else {
            alert('Por favor, ingresa tu correo electrónico en el campo de email.');
        }
    });
});

