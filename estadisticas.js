document.addEventListener("DOMContentLoaded", () => {
    const scoutForm = document.getElementById("scoutingForm");
    const scoutSelect = document.getElementById("scoutJugador");
    const tablaScoutBody = document.getElementById("tablaScoutingBody");

    // Función para actualizar el menú desplegable con los jugadores registrados
    function actualizarSelectJugadores() {
        if (!scoutSelect) return;
        const jugadores = JSON.parse(localStorage.getItem("alijadores_jugadores")) || [];
        
        scoutSelect.innerHTML = `<option value="">-- Elige un jugador registrado --</option>`;
        
        jugadores.forEach(j => {
            const option = document.createElement("option");
            option.value = `${j.nombre} (${j.equipo})`;
            option.textContent = `${j.nombre} - [${j.equipo}] (Pos: ${j.posicion})`;
            scoutSelect.appendChild(option);
        });
    }

    // Función para mostrar los turnos de scouting guardados
    function cargarTurnosScouting() {
        if (!tablaScoutBody) return;
        const turnos = JSON.parse(localStorage.getItem("alijadores_scouting_turnos")) || [];
        
        tablaScoutBody.innerHTML = "";

        if (turnos.length === 0) {
            tablaScoutBody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-neutral-500">No hay turnos registrados todavía.</td></tr>`;
            return;
        }

        turnos.forEach((t) => {
            const fila = document.createElement("tr");
            fila.className = "hover:bg-neutral-800/50 transition";
            fila.innerHTML = `
                <td class="p-3 font-semibold text-white">${t.jugador}</td>
                <td class="p-3"><span class="bg-orange-500/10 text-orange-400 px-2 py-1 rounded text-xs font-bold border border-orange-500/20">${t.resultado}</span></td>
                <td class="p-3 text-neutral-300">${t.pitcheo}</td>
                <td class="p-3 text-center">
                    <button onclick="eliminarTurno(${t.id})" class="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-2 py-1 rounded text-xs transition border border-red-500/30">
                        Borrar
                    </button>
                </td>
            `;
            tablaScoutBody.appendChild(fila);
        });
    }

    // Función para eliminar un turno de scouting
    window.eliminarTurno = function(id) {
        let turnos = JSON.parse(localStorage.getItem("alijadores_scouting_turnos")) || [];
        turnos = turnos.filter(t => t.id !== id);
        localStorage.setItem("alijadores_scouting_turnos", JSON.stringify(turnos));
        cargarTurnosScouting();
    };

    // Registrar nuevo turno al enviar el formulario
    if (scoutForm) {
        scoutForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const jugador = scoutSelect.value;
            const resultado = document.getElementById("scoutResultado").value;
            const pitcheo = document.getElementById("scoutPitcheo").value;

            if (!jugador) {
                alert("Por favor selecciona un jugador.");
                return;
            }

            const nuevoTurno = {
                id: Date.now(),
                jugador,
                resultado,
                pitcheo
            };

            let turnos = JSON.parse(localStorage.getItem("alijadores_scouting_turnos")) || [];
            turnos.push(nuevoTurno);
            localStorage.setItem("alijadores_scouting_turnos", JSON.stringify(turnos));

            scoutForm.reset();
            cargarTurnosScouting();
        });
    }

    // Inicializar funciones al cargar
    actualizarSelectJugadores();
    cargarTurnosScouting();
});