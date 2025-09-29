document.addEventListener('DOMContentLoaded', () => {
    // Redirección si el usuario ya está autenticado
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        window.location.href = 'notas.html';
        return;
    }

    const loginForm = document.getElementById('login-form');
    const codigoEstudianteInput = document.getElementById('codigoEstudiante');
    const passwordInput = document.getElementById('password');
    const alertMessage = document.getElementById('alert-message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const codigo = codigoEstudianteInput.value;
        const password = passwordInput.value;

        // Validación de la contraseña (por seguridad)
        if (password !== '1234') {
            alertMessage.textContent = 'Credenciales no válidas.';
            alertMessage.style.display = 'block';
            codigoEstudianteInput.value = '';
            passwordInput.value = '';
            return;
        }

        const data = {
            codigo,
            clave: password
        };

        try {
            const response = await fetch('https://api-parcial.crangarita.repl.co/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const user = await response.json();

            if (user && user.codigo) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                alertMessage.style.display = 'none';
                window.location.href = 'notas.html';
            } else {
                alertMessage.textContent = 'Credenciales no válidas.';
                alertMessage.style.display = 'block';
                codigoEstudianteInput.value = '';
                passwordInput.value = '';
            }
        } catch (error) {
            console.error('Error:', error);
            alertMessage.textContent = 'Ocurrió un error. Inténtalo de nuevo más tarde.';
            alertMessage.style.display = 'block';
        }
    });
});