document.addEventListener("DOMContentLoaded", () => {
const form = document.getElementById("registroForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const nuevoRegistro = {
                equipo: document.getElementById("equipoNombre").value,
                jugador: document.getElementById("jugadorNombre").value,
                posicion: document.getElementById("jugadorPosicion").value,
                perfil: document.getElementById("jugadorPerfil").value
            };

            let registros = JSON.parse(localStorage.getItem("alijadoresJugadores")) || [];
            registros.push(nuevoRegistro);
            localStorage.setItem("alijadoresJugadores", JSON.stringify(registros));

            alert("¡Jugador registrado con éxito en el sistema!");
            form.reset();
        });
    }
});