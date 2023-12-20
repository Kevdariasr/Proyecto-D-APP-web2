function openPanel(panelId) {
    var panels = document.querySelectorAll('.panel-content');
    for (var i = 0; i < panels.length; i++) {
        panels[i].style.display = 'none';
    }
    var links = document.querySelectorAll('.sidebar-menu li a');
    for (var j = 0; j < links.length; j++) {
        links[j].classList.remove('active');
    }
    document.getElementById(panelId).style.display = 'block';
  
    event.currentTarget.classList.add('active');
};


// Función para cerrar sesión
function cerrarSesion() {
    window.location.href = 'index.html'; 
}

