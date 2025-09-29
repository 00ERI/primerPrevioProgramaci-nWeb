document.addEventListener('DOMContentLoaded', () => {
    const studentInfoEl = document.getElementById('student-info');
    const promedioPonderadoEl = document.getElementById('promedio-ponderado');
    const notasTableBody = document.getElementById('notas-table-body');
    const logoutBtn = document.getElementById('logout-btn');

    // Verificación de autenticación al cargar la página
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser || !currentUser.codigo) {
        window.location.href = 'index.html'; // Redirige si no está logueado
        return;
    }

    const { codigo, nombre, email } = currentUser;
    studentInfoEl.textContent = `Código: ${codigo} - ${nombre}`;

    // Obtener las notas del estudiante
    const fetchNotas = async () => {
        try {
            const response = await fetch(`https://24a0dac0-2579-4138-985c-bec2df4bdfcc-00-3unzo70c406dl.riker.replit.dev/students/${codigo}/notas`);
            const notas = await response.json();

            if (notas.length === 0) {
                notasTableBody.innerHTML = '<tr><td colspan="7" class="text-center">No se encontraron notas para este estudiante.</td></tr>';
                promedioPonderadoEl.textContent = 'Promedio Ponderado: N/A';
                return;
            }

            let totalDef = 0;
            let totalCreditos = 0;
            let tableRows = '';

            notas.forEach(asignatura => {
                // Cálculo de la definitiva
                const def = ((asignatura.p1 + asignatura.p2 + asignatura.p3) / 3 * 0.7) + (asignatura.ef * 0.3);
                const definitiva = def.toFixed(2);

                totalDef += definitiva * asignatura.creditos;
                totalCreditos += asignatura.creditos;

                tableRows += `
                    <tr>
                        <td>${asignatura.asignatura}</td>
                        <td>${asignatura.creditos}</td>
                        <td>${asignatura.p1}</td>
                        <td>${asignatura.p2}</td>
                        <td>${asignatura.p3}</td>
                        <td>${asignatura.ef}</td>
                        <td>${definitiva}</td>
                    </tr>
                `;
            });

            // Cálculo del promedio ponderado
            const promedioPonderado = totalCreditos > 0 ? (totalDef / totalCreditos).toFixed(2) : 0;
            promedioPonderadoEl.textContent = `Promedio Ponderado: ${promedioPonderado}`;
            
            // Llenar la tabla
            notasTableBody.innerHTML = tableRows;

        } catch (error) {
            console.error('Error al obtener notas:', error);
            notasTableBody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Error al cargar las notas.</td></tr>';
        }
    };

    fetchNotas();

    // Cerrar Sesión
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
});