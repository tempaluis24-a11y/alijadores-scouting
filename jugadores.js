document.addEventListener("DOMContentLoaded", () => {
    const registroForm = document.getElementById("registroForm");
    const tablaBody = document.getElementById("tablaJugadoresBody");
    const scoutForm = document.getElementById("scoutingForm");
    const scoutSelect = document.getElementById("scoutJugador");
    const tablaScoutBody = document.getElementById("tablaScoutingBody");

    // --- 1. GESTIÓN DE JUGADORES ---
    function cargarJugadores() {
        if (!tablaBody) return;
        const jugadores = JSON.parse(localStorage.getItem("alijadores_jugadores")) || [];
        
        tablaBody.innerHTML = "";

        if (jugadores.length === 0) {
            tablaBody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-neutral-500">No hay jugadores registrados todavía.</td></tr>`;
            if (scoutSelect) scoutSelect.innerHTML = `<option value="">-- Elige un jugador registrado --</option>`;
            return;
        }

        jugadores.forEach((j) => {
            const fila = document.createElement("tr");
            fila.className = "hover:bg-neutral-800/50 transition";
            fila.innerHTML = `
                <td class="p-3 font-semibold text-white">${j.equipo}</td>
                <td class="p-3 text-white">${j.nombre}</td>
                <td class="p-3"><span class="bg-orange-500/10 text-orange-400 px-2 py-1 rounded text-xs font-bold border border-orange-500/20">${j.posicion}</span></td>
                <td class="p-3 text-neutral-400">${j.perfil || 'N/D'}</td>
                <td class="p-3 text-center">
                    <button onclick="window.eliminarJugador(${j.id})" class="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-2 py-1 rounded text-xs transition border border-red-500/30">
                        Eliminar
                    </button>
                </td>
            `;
            tablaBody.appendChild(fila);
        });

        // Actualizar también el select de scouting
        if (scoutSelect) {
            scoutSelect.innerHTML = `<option value="">-- Elige un jugador registrado --</option>`;
            jugadores.forEach(j => {
                const option = document.createElement("option");
                option.value = `${j.nombre} (${j.equipo})`;
                option.textContent = `${j.nombre} - [${j.equipo}] (Pos: ${j.posicion})`;
                scoutSelect.appendChild(option);
            });
        }
    }

    window.eliminarJugador = function(id) {
        let jugadores = JSON.parse(localStorage.getItem("alijadores_jugadores")) || [];
        jugadores = jugadores.filter(j => j.id !== id);
        localStorage.setItem("alijadores_jugadores", JSON.stringify(jugadores));
        cargarJugadores();
    };

    if (registroForm) {
        registroForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const equipo = document.getElementById("equipoNombre").value.trim();
            const nombre = document.getElementById("jugadorNombre").value.trim();
            const posicion = document.getElementById("jugadorPosicion").value;
            const perfil = document.getElementById("jugadorPerfil").value.trim();

            const nuevoJugador = {
                id: Date.now(),
                equipo,
                nombre,
                posicion,
                perfil
            };

            let jugadores = JSON.parse(localStorage.getItem("alijadores_jugadores")) || [];
            jugadores.push(nuevoJugador);
            localStorage.setItem("alijadores_jugadores", JSON.stringify(jugadores));

            registroForm.reset();
            cargarJugadores();
        });
    }

    // --- 2. GESTIÓN DE SCOUTING (TURNOS) ---
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
                    <button onclick="window.eliminarTurno(${t.id})" class="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-2 py-1 rounded text-xs transition border border-red-500/30">
                        Borrar
                    </button>
                </td>
            `;
            tablaScoutBody.appendChild(fila);
        });
    }

    window.eliminarTurno = function(id) {
        let turnos = JSON.parse(localStorage.getItem("alijadores_scouting_turnos")) || [];
        turnos = turnos.filter(t => t.id !== id);
        localStorage.setItem("alijadores_scouting_turnos", JSON.stringify(turnos));
        cargarTurnosScouting();
    };

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

    // Inicializar todo al cargar la página
    cargarJugadores();
    cargarTurnosScouting();
});