document.addEventListener('DOMContentLoaded', () => {
    const studentInfoEl = document.getElementById('student-info');
    const promedioPonderadoEl = document.getElementById('promedio-ponderado');
    const notasTableBody = document.getElementById('notas-table-body');
    const logoutBtn = document.getElementById('logout-btn');

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser || !currentUser.codigo) {
        window.location.href = 'index.html';
        return;
    }

    const { codigo, nombre } = currentUser;
    studentInfoEl.textContent = `Código: ${codigo} - ${nombre}`;

    const fetchNotas = async () => {
        try {
            const response = await fetch(`https://24a0dac0-2579-4138-985c-bec2df4bdfcc-00-3unzo70c406dl.riker.replit.dev/students/${codigo}/notas`);
            const data = await response.json();
            const notasArray = data.notas || [];

            if (notasArray.length === 0) {
                notasTableBody.innerHTML = `<tr><td colspan="7" class="text-center">No hay notas disponibles</td></tr>`;
                promedioPonderadoEl.textContent = 'Promedio Ponderado: N/A';
                return;
            }

            let sumaPonderada = 0;
            let sumaCreditos = 0;
            let tableRows = '';

            notasArray.forEach(asig => {
                // Aquí se ajustan los nombres de las variables
                const n1 = Number(asig.n1) || 0;
                const n2 = Number(asig.n2) || 0;
                const n3 = Number(asig.n3) || 0;
                const ex = Number(asig.ex) || 0;
                const creditos = Number(asig.creditos) || 0;

                const def = ((n1 + n2 + n3) / 3) * 0.7 + (ex * 0.3);
                const definitiva = def.toFixed(2);
                
                tableRows += `
                    <tr>
                        <td>${asig.asignatura}</td>
                        <td>${creditos}</td>
                        <td>${n1}</td>
                        <td>${n2}</td>
                        <td>${n3}</td>
                        <td>${ex}</td>
                        <td>${definitiva}</td>
                    </tr>
                `;

                sumaPonderada += parseFloat(definitiva) * creditos;
                sumaCreditos += creditos;
            });

            notasTableBody.innerHTML = tableRows;

            const promedioPonderado = (sumaCreditos > 0) ? (sumaPonderada / sumaCreditos).toFixed(2) : 0;
            promedioPonderadoEl.textContent = `Promedio Ponderado: ${promedioPonderado}`;

        } catch (error) {
            console.error('Error al cargar notas:', error);
            notasTableBody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error al cargar las notas.</td></tr>`;
            promedioPonderadoEl.textContent = 'Promedio Ponderado: Error';
        }
    };

    fetchNotas();

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
});