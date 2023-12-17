/* 
    Estudiantes{nombre, apellidos, telefono, correo, direccion}
*/

"use strict"

// 1. CREAR OBJETO DE BASE DATOS
const db = firebase.firestore();

// 2. CREAR OBJETOS HTML
const coleccionStr = "Productos";

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
                                        <td>${dato.tipobebida}</td>
                                        <td>${dato.nombre}</td>
                                        <td>${dato.descripcion}</td>
                                        <td>${dato.precio}</td>
                                        <td><img src="${dato.imagenURL}" style="max-width: 100px; max-height: 80px;" alt="Imagen"></td>

                                        
                                        <td class="text-center">
                                        <button class="btn btn-secondary btn-editar" data-id="${doc.id}">Editar</button>
                                        <button class="btn btn-danger btn-borrar" data-id="${doc.id}">Borrar</button>
                                        </td>
                                    </tr>            
                                    `;
        });


    const btnBorrar = document.querySelectorAll(".btn-borrar");    
    btnBorrar.forEach ((btn)=>{
        btn.addEventListener("click", async(event)=>{
            if(confirm("Desea eliminar el registro?")){
                await onDelete(event.target.dataset.id);
            }
            
        });
    });

    const btnEditar= document.querySelectorAll(".btn-editar");    
    btnEditar.forEach ((btn)=>{
        btn.addEventListener("click", async(event)=>{
            const docSelecccionado = await findById(event.target.dataset.id);
            const productoSeleccionado = docSelecccionado.data();
            
            frm.txtTipoBebida.value = productoSeleccionado.tipobebida;
            frm.txtNombre.value = productoSeleccionado.nombre;
            frm.txtDescripcion.value = productoSeleccionado.descripcion;
            frm.txtPrecio.value = productoSeleccionado.precio;
            frm.txtImagen.value = productoSeleccionado.imagen;
            frm.btnGuardar.innerHTML = "Modificar";


            editStatus = true;
            idSeleccionado = event.target.dataset.id;


        });
    });


    });

});


frm.addEventListener("submit",async(event) =>{
    event.preventDefault();
    


//FIREBASE STORAGE

// Crear una referencia al almacenamiento
//var storageRef = firebase.storage().ref();

// Obtener el archivo
const fileInput = document.getElementById('txtImagen');
    const file = fileInput.files[0];

// Crear una referencia al archivo que se va a subir
const storageRef = firebase.storage().ref(`images/${file.name}`);

// Subir la imagen
const task = storageRef.put(file);

task.then(snapshot => {
    snapshot.ref.getDownloadURL().then(url => {
        uploadedImage.src = url;
    });
});








    //CREAR OBJETO A INSERTAR
    const productoTO = {
        tipobebida : frm.txtTipoBebida.value,
        nombre : frm.txtNombre.value,
        descripcion : frm.txtDescripcion.value,
        precio : frm.txtPrecio.value,
       
    }

    if (editStatus){

        await onUpdate(idSeleccionado, productoTO);
    }else{
        await onInsert(productoTO);
    }
    limpiar();














});

function limpiar(){
    frm.reset();
    frm.btnGuardar.innerHTML = "Guardar"
    frm.txtTipoBebida.focus();

    editStatus = false;
    idSeleccionado = "";

}




