/* ==========================================
   ALIJADORES SCOUTING - Módulo de Autenticación
   ========================================== */

function mostrarModalLogin() {
    console.log("Abriendo módulo de inicio de sesión...");
    alert("Próximamente: Sistema de autenticación seguro para el cuerpo técnico de Alijadores.");
}

// Escuchar clics globales para activar funciones de botones
document.addEventListener("click", (e) => {
    if (e.target.textContent.includes("Iniciar Sesión")) {
        mostrarModalLogin();
    }
});