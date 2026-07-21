/* ==========================================
   ALIJADORES SCOUTING - Motor de Estadísticas
   ========================================== */

// Función para calcular el Porcentaje de Bateo (AVG = Hits / Turnos Oficiales)
function calcularAVG(hits, turnosAlBat) {
    if (turnosAlBat === 0) return ".000";
    let promedio = hits / turnosAlBat;
    return promedio.toFixed(3).replace("0.", ".");
}

// Registro inicial de estadísticas para análisis de rivales
let estadisticasOfensivas = [
    { jugadorId: 1, jor: 1, ab: 4, h: 2, 2b: 1, 3b: 0, hr: 1, rbi: 3 }
];

document.addEventListener("DOMContentLoaded", () => {
    console.log("Motor de estadísticas ofensivas de béisbol cargado correctamente.");
});