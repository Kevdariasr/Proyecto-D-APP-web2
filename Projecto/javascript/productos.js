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

    const btnEditar = document.querySelectorAll(".btn-editar");
btnEditar.forEach((btn) => {
    btn.addEventListener("click", async (event) => {
        const docSeleccionado = await findById2(event.target.dataset.id);
        const productoSeleccionado = docSeleccionado.data();
        
        frm2.txtTipoBebida.value = productoSeleccionado.tipobebida;
        frm2.txtNombre.value = productoSeleccionado.nombre;
        frm2.txtDescripcion.value = productoSeleccionado.descripcion;
        frm2.txtCantidad.value = productoSeleccionado.cantidad;
        frm2.txtPrecio.value = productoSeleccionado.precio;
        
        const imagenActual = document.getElementById('imagenActual');
        if (productoSeleccionado.imagenURL) {
            imagenActual.src = productoSeleccionado.imagenURL;
            imagenActual.style.display = 'block'; 
        } else {
            imagenActual.style.display = 'none'; 
        
        frm2.btnGuardar.innerHTML = "Modificar";
        
        editStatus = true;
        idSeleccionado = event.target.dataset.id;
    });
    });
    

    document.getElementById('btnLimpiarProducto').addEventListener('click', limpiarProducto);

    });

});


frm2.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fileInput = document.getElementById('fileInput');
    if (editStatus) {
        const productoTO = {
            tipobebida: frm2.txtTipoBebida.value,
            nombre: frm2.txtNombre.value,
            descripcion: frm2.txtDescripcion.value,
            cantidad: frm2.txtCantidad.value,
            precio: frm2.txtPrecio.value,
        };
        
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const storageRef = firebase.storage().ref(`images/${file.name}`);
            try {
                const snapshot = await storageRef.put(file);
                productoTO.imagenURL = await snapshot.ref.getDownloadURL();
            } catch (error) {
                console.error("Error al subir nueva imagen: ", error);
                alert(`Error al subir nueva imagen: ${error.message}`);
                return;
            }
        }

        try {
            await onUpdate2(idSeleccionado, productoTO);
            alert("Producto actualizado con éxito");
        } catch (error) {
            console.error("Error al actualizar el producto: ", error);
            alert(`Error al actualizar el producto: ${error.message}`);
        }
    } else {
    }

    limpiarProducto();
});


function limpiarProducto(){
    frm2.reset();
    document.getElementById("btnGuardar").innerHTML = "Guardar";
    frm2.txtTipoBebida.focus();

    editStatus = false;
    idSeleccionado = "";

}





