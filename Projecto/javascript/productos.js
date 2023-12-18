/* 
    Estudiantes{nombre, apellidos, telefono, correo, direccion}
*/

"use strict"

// 2. CREAR OBJETOS HTML
const coleccionStr2 = "Productos";

const frm2 = document.querySelector("#frm2");
const dataTable2 = document.querySelector("#tblDatos2 > tbody")
var editStatus = false; 
var idSeleccionado = "";

// 3.CARGAR LOS APIS DE FIRESTORE PARA CRUD

const findAll2 = () => db.collection(coleccionStr2).get();

const findById2 = paramId => db.collection(coleccionStr2).doc(paramId).get();

const onfindAll2 = callback => db.collection(coleccionStr2).onSnapshot(callback);

const onInsert2 = newObj => db.collection(coleccionStr2).doc().set(newObj);

const onUpdate2 = (paramId, newObj) => db.collection(coleccionStr2).doc(paramId).update(newObj);

const onDelete2 = paramId => db.collection(coleccionStr2).doc(paramId).delete();

// 4. CREACION DE CRUD
window.addEventListener("load",async()=>{
    onfindAll2((query)=>{
        
        dataTable2.innerHTML = "";
        
        query.forEach((doc)=>{
            let dato =  doc.data();

            dataTable2.innerHTML += `
                                    <tr>
                                        <td>${dato.tipobebida}</td>
                                        <td>${dato.nombre}</td>
                                        <td>${dato.descripcion}</td>
                                        <td>${dato.cantidad}</td>
                                        <td><img src="${dato.imagenURL}" style="max-width: 100px; max-height: 80px;" alt="Imagen"></td>
                                        <td>${dato.precio}</td>
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
                await onDelete2(event.target.dataset.id);
            }
            
        });
    });

    const btnEditar= document.querySelectorAll(".btn-editar");    
    btnEditar.forEach ((btn)=>{
        btn.addEventListener("click", async(event)=>{
            const docSeleccionado = await findById2(event.target.dataset.id);
        const productoSeleccionado = docSeleccionado.data();
            
            frm2.txtTipoBebida.value = productoSeleccionado.tipobebida;
            frm2.txtNombre.value = productoSeleccionado.nombre;
            frm2.txtDescripcion.value = productoSeleccionado.descripcion;
            frm2.txtCantidad.value = productoSeleccionado.cantidad;
            frm2.txtPrecio.value = productoSeleccionado.precio;
            frm2.txtImagen.value = productoSeleccionado.imagen;
            frm2.btnGuardar.innerHTML = "Modificar";


            editStatus = true;
            idSeleccionado = event.target.dataset.id;
            

        });
    });

    document.getElementById('btn-limpiar').addEventListener('click', limpiar);
    });

});


frm2.addEventListener("submit",async(event) =>{
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
        tipobebida : frm2.txtTipoBebida.value,
        nombre : frm2.txtNombre.value,
        descripcion : frm2.txtDescripcion.value,
        cantidad : frm2.txtCantidad.value,
        precio : frm2.txtPrecio.value,
       
    }

    if (editStatus){

        await onUpdate2(idSeleccionado, productoTO);
    }else{
        await onInsert2(productoTO);
    }
    limpiar();

});

function limpiar(){
    frm2.reset();
    frm2.btnGuardar.innerHTML = "Guardar"
    frm2.txtTipoBebida.focus();

    editStatus = false;
    idSeleccionado = "";

}




