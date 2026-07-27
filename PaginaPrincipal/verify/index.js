const textInfo = document.querySelector('#text-info');

(async () => {
  try {
    // 1. Extraer ID y Token de la URL (/verify/ID/TOKEN)
    const pathnameParts = window.location.pathname.split('/');
    const id = pathnameParts[2];
    const token = pathnameParts[3];

    // 2. Petición al backend
    const { data } = await axios.patch(`/api/users/${id}/${token}`);

    // 3. Mostrar mensaje de éxito si el status es 200
    textInfo.innerHTML = data.message || 'Correo verificado con éxito';

    // 4. Redirigir al login después de 2.5 segundos para que lean el mensaje
    setTimeout(() => {
      window.location.href = '/login'; // 👈 Se corrigió "windows" por "window"
    }, 2500);

  } catch (error) {
    console.error('Error durante la verificación:', error);

    // Manejo de errores devueltos por Express (ej. status 400 cuando el link expira o 404)
    if (error.response && error.response.data && error.response.data.error) {
      textInfo.innerHTML = error.response.data.error;
    } else {
      textInfo.innerHTML = 'Ocurrió un error inesperado al verificar la cuenta.';
    }
  }
})();