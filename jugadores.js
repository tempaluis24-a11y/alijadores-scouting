document.addEventListener('DOMContentLoaded', () => {
    let jugadores = JSON.parse(localStorage.getItem('alijadores_jugadores')) || [];
    let turnos = JSON.parse(localStorage.getItem('alijadores_turnos')) || [];

    let equipoSeleccionado = null;
    let jugadorSeleccionadoId = null;

    function guardarDatos() {
        localStorage.setItem('alijadores_jugadores', JSON.stringify(jugadores));
        localStorage.setItem('alijadores_turnos', JSON.stringify(turnos));
    }

    // Registrar Jugador o Nuevo Equipo
    const registroForm = document.getElementById('registroForm');
    if (registroForm) {
        registroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const equipoInput = document.getElementById('equipoNombre').value.trim();
            const nombre = document.getElementById('jugadorNombre').value.trim();
            const posicion = document.getElementById('jugadorPosicion').value;

            // Si está dentro de un equipo y no llenó el input, usa el equipo activo; si puso uno nuevo, lo crea
            let equipoFinal = equipoInput !== '' ? equipoInput : equipoSeleccionado;

            if (!equipoFinal) {
                alert('Por favor indica el nombre del equipo.');
                return;
            }

            jugadores.push({
                id: Date.now(),
                equipo: equipoFinal.toUpperCase(),
                nombre,
                posicion
            });

            guardarDatos();
            document.getElementById('jugadorNombre').value = '';
            document.getElementById('equipoNombre').value = '';
            
            if (equipoSeleccionado) {
                abrirRoster(equipoSeleccionado);
            } else {
                renderizarEquipos();
            }
        });
    }

    // Registrar Turno de Scouting Individual
    const scoutingForm = document.getElementById('scoutingForm');
    if (scoutingForm) {
        scoutingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const jugadorId = document.getElementById('scoutJugadorId').value;
            const resultado = document.getElementById('scoutResultado').value;
            const pitcheo = document.getElementById('scoutPitcheo').value;

            const jugadorObj = jugadores.find(j => j.id == jugadorId);
            if (!jugadorObj) return;

            turnos.push({
                id: Date.now(),
                jugadorId,
                resultado,
                pitcheo
            });

            guardarDatos();
            abrirFichaJugador(jugadorId);
        });
    }

    window.renderizarEquipos = function() {
        equipoSeleccionado = null;
        jugadorSeleccionadoId = null;

        document.getElementById('seccionEquipos').classList.remove('hidden');
        document.getElementById('seccionRoster').classList.add('hidden');
        document.getElementById('seccionFichaIndividual').classList.add('hidden');

        const contenedor = document.getElementById('cuadriculaEquipos');
        if (!contenedor) return;

        contenedor.innerHTML = '';
        
        // Obtener equipos únicos
        const equiposUnicos = [...new Set(jugadores.map(j => j.equipo))];

        if (equiposUnicos.length === 0) {
            contenedor.innerHTML = '<div class="col-span-full text-neutral-500 text-sm text-center py-4">No hay equipos registrados. Escribe uno abajo para empezar.</div>';
            return;
        }

        equiposUnicos.forEach(eq => {
            const totalJugadores = jugadores.filter(j => j.equipo === eq).length;
            contenedor.innerHTML += `
                <div onclick="abrirRoster('${eq}')" class="bg-black border border-neutral-800 hover:border-orange-500 p-4 rounded-xl cursor-pointer transition shadow-md text-center group">
                    <h3 class="font-bold text-white text-lg group-hover:text-orange-400">${eq}</h3>
                    <p class="text-xs text-neutral-400 mt-1">${totalJugadores} jugadores registrados</p>
                </div>
            `;
        });
    };

    window.abrirRoster = function(nombreEquipo) {
        equipoSeleccionado = nombreEquipo;
        document.getElementById('seccionEquipos').classList.add('hidden');
        document.getElementById('seccionRoster').classList.remove('hidden');
        document.getElementById('seccionFichaIndividual').classList.add('hidden');

        document.getElementById('tituloRosterEquipo').innerText = `Plantilla del Equipo: ${nombreEquipo}`;

        const contenedor = document.getElementById('cuadriculaJugadoresEquipo');
        contenedor.innerHTML = '';

        const jugadoresEquipo = jugadores.filter(j => j.equipo === nombreEquipo);

        if (jugadoresEquipo.length === 0) {
            contenedor.innerHTML = '<div class="col-span-full text-neutral-500 text-sm">No hay jugadores en este equipo. Usa el formulario principal para agregarlos.</div>';
            return;
        }

        jugadoresEquipo.forEach(j => {
            const turnosJugador = turnos.filter(t => t.jugadorId == j.id).length;
            contenedor.innerHTML += `
                <div onclick="abrirFichaJugador(${j.id})" class="bg-black border border-neutral-800 hover:border-orange-500 p-4 rounded-xl cursor-pointer transition shadow-md">
                    <div class="flex justify-between items-start mb-2">
                        <span class="font-bold text-white text-base">${j.nombre}</span>
                        <span class="bg-orange-500/20 text-orange-400 text-xs px-2 py-0.5 rounded font-bold">${j.posicion}</span>
                    </div>
                    <p class="text-xs text-neutral-400">Turnos registrados: ${turnosJugador}</p>
                </div>
            `;
        });
    };

    window.cerrarRoster = function() {
        renderizarEquipos();
    };

    window.abrirFichaJugador = function(idJugador) {
        jugadorSeleccionadoId = idJugador;
        const jugador = jugadores.find(j => j.id == idJugador);
        if (!jugador) return;

        document.getElementById('seccionEquipos').classList.add('hidden');
        document.getElementById('seccionRoster').classList.add('hidden');
        document.getElementById('seccionFichaIndividual').classList.remove('hidden');

        document.getElementById('tituloFichaJugador').innerText = `Ficha Táctica: ${jugador.nombre} [${jugador.posicion}]`;
        document.getElementById('scoutJugadorId').value = jugador.id;

        // Renderizar gráfica de terreno, porcentajes y alertas
        renderizarFichaDetalle(idJugador);
    };

    window.cerrarFicha = function() {
        if (equipoSeleccionado) {
            abrirRoster(equipoSeleccionado);
        } else {
            renderizarEquipos();
        }
    };

    function renderizarFichaDetalle(idJugador) {
        const contenedor = document.getElementById('reporteJugadorDetalle');
        const turnosJugador = turnos.filter(t => t.jugadorId == idJugador);
        const total = turnosJugador.length;

        if (total === 0) {
            contenedor.innerHTML = `
                <div class="bg-black border border-neutral-800 p-6 rounded-xl text-center text-neutral-400">
                    <p class="text-sm">Aún no hay turnos registrados para este jugador.</p>
                    <p class="text-xs text-neutral-500 mt-1">Usa el formulario de arriba para registrar su primer batazo o acción de juego.</p>
                </div>
            `;
            return;
        }

        // Cálculos de zonas de batazo
        let izq = turnosJugador.filter(t => t.resultado.includes('Izquierdo')).length;
        let central = turnosJugador.filter(t => t.resultado.includes('Central')).length;
        let der = turnosJugador.filter(t => t.resultado.includes('Derecho')).length;
        let toques = turnosJugador.filter(t => t.resultado.includes('Toque')).length;
        let robos = turnosJugador.filter(t => t.resultado.includes('Robo')).length;

        let pIzq = Math.round((izq / total) * 100) || 0;
        let pCent = Math.round((central / total) * 100) || 0;
        let pDer = Math.round((der / total) * 100) || 0;

        // Desglose de pitcheos recibidos
        let pitcheosConteo = {};
        turnosJugador.forEach(t => {
            if (t.pitcheo && t.pitcheo !== 'No especificado') {
                pitcheosConteo[t.pitcheo] = (pitcheosConteo[t.pitcheo] || 0) + 1;
            }
        });

        let htmlPitcheos = '';
        for (let [pit, count] % of Object.entries(pitcheosConteo)) {
            let pPit = Math.round((count / total) * 100);
            htmlPitcheos += `<span class="bg-neutral-800 text-neutral-300 px-2 py-1 rounded text-xs">${pit}: ${count} (${pPit}%)</span> `;
        }
        if (htmlPitcheos === '') htmlPitcheos = '<span class="text-neutral-500 text-xs">Sin pitcheos específicos registrados</span>';

        // Consejo defensivo automático
        let consejoDefensa = "Jugar en posición estándar.";
        if (pDer > pIzq && pDer > pCent) consejoDefensa = "⚠️ Alta tendencia a jalar al jardín derecho. **Defensiva cargada al Right Field.**";
        else if (pIzq > pDer && pIzq > pCent) consejoDefensa = "⚠️ Alta tendencia a jalar al jardín izquierdo. **Defensiva cargada al Left Field.**";
        else if (pCent >= pIzq && pCent >= pDer) consejoDefensa = "⚠️ Conecta hacia el centro. **Jardín central profundo y cuadro atento.**";

        let alertaToque = toques > 0 ? `<div class="text-yellow-400 font-semibold text-xs mt-2">⚠️ ¡ALERTA DE TOQUE! Ha intentado toque de sorpresa ${toques} veces. 3era y 1era base deben jugar adelantados.</div>` : '';
        let alertaRobo = robos > 0 ? `<div class="text-orange-400 font-semibold text-xs mt-2">⚡ ¡PELIGRO EN BASES! Amenaza de robo detectada (${robos} veces). Cátcher atento a reviradas.</div>` : '';

        // Estructura visual del reporte y gráfica de campo
        contenedor.innerHTML = `
            <div class="bg-black border border-orange-500/30 p-5 rounded-xl">
                <div class="flex justify-between items-center mb-4 border-b border-neutral-800 pb-3">
                    <div>
                        <h4 class="font-bold text-orange-400 text-lg">Reporte Táctico y Gráfica de Terreno</h4>
                        <p class="text-xs text-neutral-400">Total de turnos analizados: ${total}</p>
                    </div>
                </div>

                <!-- Simulación Gráfica del Terreno de Béisbol y Porcentajes -->
                <div class="grid grid-cols-3 gap-2 bg-neutral-900 border border-neutral-800 p-4 rounded-lg text-center mb-4">
                    <div class="bg-black/60 p-3 rounded border border-neutral-800">
                        <span class="block text-xs text-neutral-400 uppercase">Jardín Izquierdo</span>
                        <span class="text-2xl font-black text-orange-400">${pIzq}%</span>
                    </div>
                    <div class="bg-black/60 p-3 rounded border border-neutral-800">
                        <span class="block text-xs text-neutral-400 uppercase">Jardín Central</span>
                        <span class="text-2xl font-black text-orange-400">${pCent}%</span>
                    </div>
                    <div class="bg-black/60 p-3 rounded border border-neutral-800">
                        <span class="block text-xs text-neutral-400 uppercase">Jardín Derecho</span>
                        <span class="text-2xl font-black text-orange-400">${pDer}%</span>
                    </div>
                </div>

                <!-- Recomendaciones y Alertas -->
                <div class="bg-neutral-900 border border-neutral-800 p-4 rounded-lg mb-4">
                    <h5 class="text-xs font-bold text-neutral-400 uppercase mb-1">Acomodo Defensivo Sugerido</h5>
                    <p class="text-sm text-white">${consejoDefensa}</p>
                    ${alertaToque}
                    ${alertaRobo}
                </div>

                <!-- Desglose de Pitcheo y Historial Individual -->
                <div class="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
                    <h5 class="text-xs font-bold text-neutral-400 uppercase mb-2">Desglose de Pitcheos Recibidos</h5>
                    <div class="flex flex-wrap gap-2 mb-4">${htmlPitcheos}</div>
                    
                    <h5 class="text-xs font-bold text-neutral-400 uppercase mb-2">Historial de Turnos de este Jugador</h5>
                    <div class="space-y-1 max-h-40 overflow-y-auto pr-2">
                        ${turnosJugador.slice().reverse().map(t => `
                            <div class="flex justify-between items-center bg-black p-2 rounded text-xs border border-neutral-800">
                                <span class="font-medium text-white">${t.resultado} <span class="text-neutral-500">(Pitcheo: ${t.pitcheo})</span></span>
                                <button onclick="eliminarTurnoIndividual(${t.id})" class="text-red-400 hover:text-red-300">Borrar</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    window.eliminarTurnoIndividual = function(idTurno) {
        turnos = turnos.filter(t => t.id != idTurno);
        guardarDatos();
        if (jugadorSeleccionadoId) {
            renderizarFichaDetalle(jugadorSeleccionadoId);
        }
    };

    // Inicializar vista general al cargar la página
    renderizarEquipos();
});