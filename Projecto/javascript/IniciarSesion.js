document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const uid = userCredential.user.uid;
            return firebase.firestore().collection('usuarios').doc(uid).get();
        })
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                // verificacion del rol
                if (userData.rol === 'admin') {
                    window.location.href = '../html/adminPanel.html'; 
                } else if (userData.rol === 'cliente') {
                    window.location.href = '/paginaCliente.html'; // aqui deben meter la pagina del home de clientes
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
});
