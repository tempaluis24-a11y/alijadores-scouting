document.addEventListener('DOMContentLoaded', () => {
    const registroForm = document.getElementById('registroForm');
    const scoutingForm = document.getElementById('scoutingForm');
    const tablaJugadoresBody = document.getElementById('tablaJugadoresBody');
    const tablaScoutingBody = document.getElementById('tablaScoutingBody');
    const scoutJugadorSelect = document.getElementById('scoutJugador');
    const panelRecomendaciones = document.getElementById('panelRecomendaciones');

    let jugadores = JSON.parse(localStorage.getItem('alijadores_jugadores')) || [];
    let turnos = JSON.parse(localStorage.getItem('alijadores_turnos')) || [];

    function guardarDatos() {
        localStorage.setItem('alijadores_jugadores', JSON.stringify(jugadores));
        localStorage.setItem('alijadores_turnos', JSON.stringify(turnos));
    }

    // Registrar Jugador o Plantilla
    if (registroForm) {
        registroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const equipoSelect = document.getElementById('equipoSelect').value;
            const equipoInput = document.getElementById('equipoNombre').value.trim();
            const equipo = equipoInput !== '' ? equipoInput : equipoSelect;
            
            const nombre = document.getElementById('jugadorNombre').value.trim();
            const posicion = document.getElementById('jugadorPosicion').value;
            const perfil = document.getElementById('jugadorPerfil').value.trim();

            if (!equipo) {
                alert('Por favor selecciona o escribe un equipo.');
                return;
            }

            jugadores.push({ id: Date.now(), equipo, nombre, posicion, perfil });
            guardarDatos();
            renderizarTodo();
            registroForm.reset();
        });
    }

    // Registrar Turno de Scouting
    if (scoutingForm) {
        scoutingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const jugadorId = scoutJugadorSelect.value;
            const resultado = document.getElementById('scoutResultado').value;
            const pitcheo = document.getElementById('scoutPitcheo').value;

            if (!jugadorId) return;

            const jugadorObj = jugadores.find(j => j.id == jugadorId);
            if (!jugadorObj) return;

            turnos.push({
                id: Date.now(),
                jugadorId,
                nombreJugador: jugadorObj.nombre,
                equipoJugador: jugadorObj.equipo,
                resultado,
                pitcheo
            });

            guardarDatos();
            renderizarTodo();
            scoutingForm.reset();
        });
    }

    window.eliminarJugador = function(id) {
        jugadores = jugadores.filter(j => j.id != id);
        turnos = turnos.filter(t => t.jugadorId != id);
        guardarDatos();
        renderizarTodo();
    };

    window.eliminarTurno = function(id) {
        turnos = turnos.filter(t => t.id != id);
        guardarDatos();
        renderizarTodo();
    };

    function renderizarTodo() {
        // Renderizar Tabla de Jugadores
        if (tablaJugadoresBody) {
            tablaJugadoresBody.innerHTML = '';
            jugadores.forEach(j => {
                tablaJugadoresBody.innerHTML += `
                    <tr class="hover:bg-neutral-800/50">
                        <td class="p-3 font-semibold text-orange-400">${j.equipo}</td>
                        <td class="p-3 text-white">${j.nombre}</td>
                        <td class="p-3">${j.posicion}</td>
                        <td class="p-3">${j.perfil || 'N/D'}</td>
                        <td class="p-3 text-center">
                            <button onclick="eliminarJugador(${j.id})" class="bg-red-900/60 hover:bg-red-700 text-red-200 px-3 py-1 rounded text-xs transition">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        }

        // Renderizar Selector de Turnos
        if (scoutJugadorSelect) {
            scoutJugadorSelect.innerHTML = '<option value="">-- Elige un jugador registrado --</option>';
            jugadores.forEach(j => {
                scoutJugadorSelect.innerHTML += `<option value="${j.id}">${j.nombre} - [${j.equipo}] (Pos: ${j.posicion})</option>`;
            });
        }

        // Renderizar Historial de Turnos
        if (tablaScoutingBody) {
            tablaScoutingBody.innerHTML = '';
            turnos.slice().reverse().forEach(t => {
                tablaScoutingBody.innerHTML += `
                    <tr class="hover:bg-neutral-800/50">
                        <td class="p-3 text-white">${t.nombreJugador} <span class="text-xs text-orange-400">(${t.equipoJugador})</span></td>
                        <td class="p-3 font-medium">${t.resultado}</td>
                        <td class="p-3 text-neutral-400">${t.pitcheo}</td>
                        <td class="p-3 text-center">
                            <button onclick="eliminarTurno(${t.id})" class="bg-red-900/60 hover:bg-red-700 text-red-200 px-3 py-1 rounded text-xs transition">Borrar</button>
                        </td>
                    </tr>
                `;
            });
        }

        // Generar Análisis Táctico y Alertas Defensivas Automáticas
        generarReporteInteligente();
    }

    function generarReporteInteligente() {
        if (!panelRecomendaciones) return;

        if (turnos.length === 0) {
            panelRecomendaciones.innerHTML = '<div class="text-neutral-500 text-sm">Registra turnos de bateo para ver el reporte defensivo inteligente y alertas de toque/robo.</div>';
            return;
        }

        panelRecomendaciones.innerHTML = '';
        
        // Agrupar turnos por jugador
        const turnosPorJugador = {};
        turnos.forEach(t => {
            if (!turnosPorJugador[t.jugadorId]) {
                turnosPorJugador[t.jugadorId] = { nombre: t.nombreJugador, equipo: t.equipoJugador, lista: [] };
            }
            turnosPorJugador[t.jugadorId].lista.push(t.resultado);
        });

        Object.values(turnosPorJugador.forEach || Object.keys(turnosPorJugador)).forEach(id => {
            const datos = turnosPorJugador[id];
            const total = datos.lista.length;
            
            // Conteo de tendencias
            let izq = datos.lista.filter(r => r.includes('Izquierdo')).length;
            let central = datos.lista.filter(r => r.includes('Central')).length;
            let der = datos.lista.filter(r => r.includes('Derecho')).length;
            let toques = datos.lista.filter(r => r.includes('Toque')).length;
            let robos = datos.lista.filter(r => r.includes('Robo')).length;

            let pIzq = Math.round((izq / total) * 100);
            let pCent = Math.round((central / total) * 100);
            let pDer = Math.round((der / total) * 100);

            // Generar consejo defensivo automático
            let consejo = "Jugar en posición estándar.";
            if (pDer > pIzq && pDer > pCent) consejo = "⚠️ Batea hacia el jardín derecho. **Defensiva debe cargarse hacia el Right Field.**";
            else if (pIzq > pDer && pIzq > pCent) consejo = "⚠️ Batea hacia el jardín izquierdo. **Defensiva debe cargarse hacia el Left Field.**";
            else if (pCent >= pIzq && pCent >= pDer) consejo = "⚠️ Tiende a batear al centro. **Jardín central profundo y cuadro atento.**";

            let alertaToque = toques > 0 ? `<div class="text-yellow-400 font-semibold mt-1">⚠️ ¡Alerta! Registra toque de sorpresa (${toques} veces). 3era y 1era base deben jugar adelantados.</div>` : '';
            let alertaRobo = robos > 0 ? `<div class="text-orange-400 font-semibold mt-1">⚡ ¡Peligro en bases! Amenaza de robo detectada (${robos} veces). Cátcher atento a reviradas y pitchout.</div>` : '';

            panelRecomendaciones.innerHTML += `
                <div class="bg-neutral-900 border border-neutral-800 p-4 rounded-lg mb-3">
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-bold text-white text-base">${datos.nombre} <span class="text-xs text-orange-400">[${datos.equipo}]</span></span>
                        <span class="text-xs bg-neutral-800 text-neutral-300 px-2 py-1 rounded">Turnos analizados: ${total}</span>
                    </div>
                    <div class="text-xs text-neutral-300 mb-2">
                        Tendencia de batazos: 
                        <span class="text-orange-400">Izq: ${pIzq}%</span> | 
                        <span class="text-orange-400">Centro: ${pCent}%</span> | 
                        <span class="text-orange-400">Der: ${pDer}%</span>
                    </div>
                    <div class="text-sm text-neutral-200 bg-black/40 p-2 rounded border border-neutral-800">
                        ${consejo}
                        ${alertaToque}
                        ${alertaRobo}
                    </div>
                </div>
            `;
        });
    }

    renderizarTodo();
});