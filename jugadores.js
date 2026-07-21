// Lógica para guardar jugadores del sistema de scouting
document.addEventListener("DOMContentLoaded", () => {
    const registroForm = document.getElementById("registroForm");

    if (registroForm) {
        registroForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Obtener los valores del formulario
            const equipo = document.getElementById("equipoNombre").value.trim();
            const nombre = document.getElementById("jugadorNombre").value.trim();
            const posicion = document.getElementById("jugadorPosicion").value;
            const perfil = document.getElementById("jugadorPerfil").value.trim();

            // Crear el objeto del jugador
            const nuevoJugador = {
                id: Date.now(),
                equipo,
                nombre,
                posicion,
                perfil
            };

            // Guardar en localStorage
            let jugadores = JSON.parse(localStorage.getItem("alijadores_jugadores")) || [];
            jugadores.push(nuevoJugador);
            localStorage.setItem("alijadores_jugadores", JSON.stringify(jugadores));

            // Confirmación y limpieza del formulario
            alert(`¡Jugador ${nombre} registrado con éxito para el equipo ${equipo}!`);
            registroForm.reset();
        });
    }
});