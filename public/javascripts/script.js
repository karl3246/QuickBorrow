document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector('form');
  const emailInput = document.querySelector('input[name="email"]');
  const passwordInput = document.querySelector('input[name="password"]');
  const togglePasswordBtn = document.querySelector('.toggle-password');

  togglePasswordBtn.addEventListener('click', () => {
    const targetId = togglePasswordBtn.getAttribute('data-target');
    const targetInput = document.getElementById(targetId);
    if (targetInput.type === 'password') {
      targetInput.type = 'text';
      togglePasswordBtn.innerHTML = '<i class="far fa-eye-slash"></i>';
    } else {
      targetInput.type = 'password';
      togglePasswordBtn.innerHTML = '<i class="far fa-eye"></i>';
    }
  });

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const cmuEmailRegex = /^[0-9]{9}@cityofmalabonuniversity\.edu\.ph$/;
    if (!cmuEmailRegex.test(email)) {
      alert('Please enter a valid CMU email (9-digit student ID followed by @cityofmalabonuniversity.edu.ph)');
      return;
    }

    fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Invalid credentials');
      }
    })
    .then(data => {
      localStorage.setItem('userFullName', data.fullName);
      localStorage.setItem('userEmail', data.email);
      window.location.href = '/welcome';
    })
    .catch(error => {
      alert(error.message);
      console.error('Error:', error);
    });
  });
});
