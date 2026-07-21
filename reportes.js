/* ==========================================
   ALIJADORES SCOUTING - Módulo de Pitcheo y Reportes
   ========================================== */

// Registro de estadísticas de pitcheo para estudiar a los lanzadores rivales o propios
let estadisticasPitcheo = [
    { pitcherId: 1, jor: 1, ip: 6.0, h: 4, c: 2, cl: 1, bb: 2, so: 8, wl: "G" }
];

function generarReporteScouting(equipoRival) {
    console.log(`Generando reporte táctico de scouting para enfrentar a: ${equipoRival}`);
    alert(`Reporte táctico preparado para el próximo encuentro contra ${equipoRival}. ¡Listos para la victoria!`);
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Módulo de pitcheo y reportes tácticos cargado correctamente.");
});