/* 
    Estudiantes{nombre, apellidos, telefono, correo, direccion}
*/

"use strict"

// 1. CREAR OBJETO DE BASE DATOS
const db = firebase.firestore();

// 2. CREAR OBJETOS HTML
const coleccionStr = "Usuario";

const frm = document.querySelector("#frm");
const dataTable = document.querySelector("#tblDatos > tbody")

var editStatus = false; 
var idSeleccionado = "";

// 3.CARGAR LOS APIS DE FIRESTORE PARA CRUD

const findAll = () => db.collection(coleccionStr).get();

const findById = paramId => db.collection(coleccionStr).doc(paramId).get();

const onFindAll = callback => db.collection(coleccionStr).onSnapshot(callback);

const onInsert = newObj => db.collection(coleccionStr).doc().set(newObj);

const onUpdate = (paramId, newObj) => db.collection(coleccionStr).doc(paramId).update(newObj);

const onDelete = paramId => db.collection(coleccionStr).doc(paramId).delete();




frm.addEventListener("submit",async(event) =>{
    event.preventDefault();
    
    //CREAR OBJETO A INSERTAR
    const usuarioTO = {
        nombre : frm.txtNombre.value,
        apellidos : frm.txtApellidos.value,
        email : frm.txtEmail.value,
        telefono : frm.txtTelefono.value,
        role : frm.txtRole.value,
        direccion : frm.txtDireccion.value,
        password : frm.txtPassword.value
    }

    if (editStatus){

        await onUpdate(idSeleccionado, usuarioTO);
    }else{
        firebase.auth().createUserWithEmailAndPassword(usuarioTO.email, usuarioTO.password)
            .then((userCredential) => {
                return onInsert({
                    ...usuarioTO,
                    uid: userCredential.user.uid
                });
            })
            .then(() => {
                alert("Usuario registrado con éxito");
            })
            .catch((error) => {
                console.error("Error al crear el usuario en Auth: ", error);
                alert(`Error al registrar el usuario: ${error.message}`);
            });
    }
    limpiar();


});

function limpiar(){
    frm.reset();
    frm.btnGuardar.innerHTML = "Guardar"
    frm.txtNombre.focus();

    editStatus = false;
    idSeleccionado = "";

}

document.addEventListener('DOMContentLoaded', function() {
    const btnLimpiar = document.getElementById('btnLimpiar');
    btnLimpiar.addEventListener('click', function() {
        limpiar();
    });
});



