document.addEventListener('DOMContentLoaded', function () {
    // Verificación del localStorage y mostrar el Toast
    if (localStorage.getItem('formSubmitted')) {
      const toastEl = document.querySelector('#successToast');
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
      localStorage.removeItem('formSubmitted'); // Limpiar el estado
    }
  
    // Validación del formulario y almacenamiento
    document.querySelector('#contactForm').addEventListener('submit', function (event) {
      event.preventDefault();
      if (this.checkValidity()) {
        localStorage.setItem('formSubmitted', 'true'); // Marcar como enviado
        window.location.href = 'index.html'; // Redirigir a la página de inicio
      } else {
        this.classList.add('was-validated'); // Mostrar errores de validación
      }
    });
  });
  