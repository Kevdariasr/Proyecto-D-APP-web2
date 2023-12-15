const firebaseConfig = {
    apiKey: "AIzaSyByj4xGEXV0VRXz5qZ2qsjQfyZKaaIb9zM",
    authDomain: "crud-brewtopia.firebaseapp.com",
    projectId: "crud-brewtopia",
    storageBucket: "crud-brewtopia.appspot.com",
    messagingSenderId: "546586968137",
    appId: "1:546586968137:web:22adf2ad900635e11abf98",
    measurementId: "G-3E7YVF2SVD"
  };
    
  
    firebase.initializeApp(firebaseConfig); 
  
  
  // Obtener referencia al almacenamiento de Firebase
  var storageRef = firebase.storage().ref();
  
  // Obtener el archivo seleccionado por el usuario
  var file = document.getElementById('fileImagen').files[0];
  
  // Crear una referencia única para el archivo en el almacenamiento
  var imageRef = storageRef.child('images/' + file.name);
  
  // Subir el archivo al almacenamiento
  imageRef.put(file).then(function(snapshot) {
      console.log('Imagen subida exitosamente');
  }).catch(function(error) {
      console.error('Error al subir la imagen:', error);
  });