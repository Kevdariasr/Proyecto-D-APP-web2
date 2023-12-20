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

// 4. CREACION DE CRUD
window.addEventListener("load",async()=>{
    onFindAll((query)=>{
        
        dataTable.innerHTML = "";
        
        query.forEach((doc)=>{
            let dato =  doc.data();

            dataTable.innerHTML += `
                                    <tr>
                                        <td>${dato.nombre}</td>
                                        <td>${dato.apellidos}</td>
                                        <td>${dato.email}</td>
                                        <td>${dato.telefono}</td>
                                        <td>${dato.role}</td>
                                        <td>${dato.direccion}</td>
                                        <td>${dato.password}</td>
                                        <td class="text-center">
                                        <button class="btn btn-secondary btn-editar" data-id="${doc.id}">Editar</button>
                                        <button class="btn btn-danger btn-borrar" data-id="${doc.id}">Borrar</button>
                                        </td>
                                    </tr>            
                                    `;
        });


        const btnBorrar = document.querySelectorAll(".btn-borrar");    
        btnBorrar.forEach ((btn) => {
            btn.addEventListener("click", async(event) => {
                if(confirm("Desea eliminar el registro?")) {
                    const userId = event.target.dataset.id;
        
                    await onDelete(userId);
        
                    var user = firebase.auth().currentUser;
        
                    if (user && user.uid === userId) {
                        user.delete().then(() => {
                            console.log("Usuario eliminado de Firebase Authentication");
                        }).catch((error) => {
                            console.error("Error al eliminar el usuario de Firebase Authentication: ", error);
                        });
                    } else {
                        console.error("No se puede eliminar un usuario de Firebase Authentication que no sea el usuario actual");
                    }
                }
            });
        });
        

    const btnEditar= document.querySelectorAll(".btn-editar");    
    btnEditar.forEach ((btn)=>{
        btn.addEventListener("click", async(event)=>{
            const docSelecccionado = await findById(event.target.dataset.id);
            const usuarioSeleccionado = docSelecccionado.data();
            
            frm.txtNombre.value = usuarioSeleccionado.nombre;
            frm.txtApellidos.value = usuarioSeleccionado.apellidos;
            frm.txtEmail.value = usuarioSeleccionado.email;
            frm.txtTelefono.value = usuarioSeleccionado.telefono;
            frm.txtRole.value = usuarioSeleccionado.role;
            frm.txtDireccion.value = usuarioSeleccionado.direccion;
            frm.txtPassword.value = usuarioSeleccionado.password;
            frm.btnGuardar.innerHTML = "Modificar";


            editStatus = true;
            idSeleccionado = event.target.dataset.id;


        });
        document.getElementById('btnlimpiarUsuario').addEventListener('click', limpiarUsuario);
    });

});

});


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
    limpiarUsuario();
});

function limpiarUsuario(){
    frm.reset();
    document.getElementById("btnGuardarUsuario").innerHTML = "Guardar";
    frm.txtNombre.focus();

    editStatus = false;
    idSeleccionado = "";

}

