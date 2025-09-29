document.addEventListener('DOMContentLoaded', () => {
    const studentInfoEl = document.getElementById('student-info');
    const promedioPonderadoEl = document.getElementById('promedio-ponderado');
    const notasTableBody = document.getElementById('notas-table-body');
    const logoutBtn = document.getElementById('logout-btn');

    // 1. Verificación de autenticación al cargar la página
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser || !currentUser.codigo) {
        window.location.href = 'index.html'; // Redirige si no está logueado
        return;
    }

    const { codigo, nombre } = currentUser;
    studentInfoEl.textContent = `Código: ${codigo} - ${nombre}`;

    // 2. Obtener las notas del estudiante
    const fetchNotas = async () => {
        try {
            const response = await fetch(`https://24a0dac0-2579-4138-985c-bec2df4bdfcc-00-3unzo70c406dl.riker.replit.dev/students/${codigo}/notas`);
            const notasData = await response.json();
            const notas = notasData.notas || []; // Accede a la propiedad 'notas' del objeto JSON

            notasTableBody.innerHTML = '';

            if (notas.length === 0) {
                notasTableBody.innerHTML = `<tr><td colspan="7" class="text-center">No hay notas disponibles</td></tr>`;
                promedioPonderadoEl.textContent = 'Promedio Ponderado: N/A';
                return;
            }

            let sumaPonderada = 0;
            let sumaCreditos = 0;

            notas.forEach(asig => {
                let p1 = Number(asig.p1);
                let p2 = Number(asig.p2);
                let p3 = Number(asig.p3);
                let ef = Number(asig.ef);
                let creditos = Number(asig.creditos);

                // Cálculo de la definitiva
                let def = ((p1 + p2 + p3) / 3) * 0.7 + (ef * 0.3);
                def = def.toFixed(2);

                notasTableBody.innerHTML += `
                    <tr>
                        <td>${asig.asignatura}</td>
                        <td>${creditos}</td>
                        <td>${p1}</td>
                        <td>${p2}</td>
                        <td>${p3}</td>
                        <td>${ef}</td>
                        <td>${def}</td>
                    </tr>
                `;

                sumaPonderada += def * creditos;
                sumaCreditos += creditos;
            });

            // Cálculo del promedio ponderado
            let pm = (sumaCreditos > 0) ? (sumaPonderada / sumaCreditos).toFixed(2) : 0;
            promedioPonderadoEl.textContent = `Promedio Ponderado: ${pm}`;

        } catch (error) {
            console.error('Error al cargar notas:', error);
            notasTableBody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error al cargar las notas.</td></tr>`;
            promedioPonderadoEl.textContent = 'Promedio Ponderado: Error';
        }
    };

    fetchNotas();

    // 3. Cerrar Sesión
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
});