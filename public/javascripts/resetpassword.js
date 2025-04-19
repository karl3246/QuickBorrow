document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const targetInput = document.getElementById(targetId);
      if (targetInput.type === 'password') {
        targetInput.type = 'text';
        button.innerHTML = '<i class="far fa-eye-slash"></i>';
      } else {
        targetInput.type = 'password';
        button.innerHTML = '<i class="far fa-eye"></i>';
      }
    });
  });

  const successMessage = document.querySelector('.success-message');
  const errorMessage = document.querySelector('.error-message');

  if (successMessage) {
    alert(successMessage.textContent);
  }
  if (errorMessage) {
    alert(errorMessage.textContent);
  }
});
