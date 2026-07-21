/* ==========================================
   ALIJADORES SCOUTING - Lógica Principal (app.js)
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
    console.log("Sistema Alijadores Scouting inicializado correctamente.");
    
    // Cargar componentes iniciales del menú de navegación
    inicializarNavegacion();
});

function inicializarNavegacion() {
    const navMenu = document.getElementById("nav-menu");
    if (navMenu) {
        navMenu.innerHTML = `
            <ul class="flex flex-wrap items-center gap-4">
                <li><a href="#" class="hover:text-emerald-400 transition-colors">Inicio</a></li>
                <li><a href="#" class="hover:text-emerald-400 transition-colors">Jugadores</a></li>
                <li><a href="#" class="hover:text-emerald-400 transition-colors">Estadísticas</a></li>
                <li><a href="#" class="hover:text-emerald-400 transition-colors">Reportes</a></li>
                <li><button class="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow">Iniciar Sesión</button></li>
            </ul>
        `;
    }
}