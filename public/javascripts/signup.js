document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector('form');
  const emailInput = document.querySelector('input[name="email"]');
  const passwordInput = document.querySelector('input[name="password"]');
  const strengthBar = document.querySelector('.strength-bar');
  const strengthValue = document.getElementById('strength-value');

  const cmuEmailRegex = /^[0-9]{9}@cityofmalabonuniversity\.edu\.ph$/;

  function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    return strength;
  }

  function updateStrengthMeter(strength) {
    const strengthPercent = (strength / 5) * 100;
    strengthBar.style.width = strengthPercent + '%';

    let strengthText = 'None';
    let color = 'red';

    if (strength <= 1) {
      strengthText = 'Very Weak';
      color = 'red';
    } else if (strength === 2) {
      strengthText = 'Weak';
      color = 'orange';
    } else if (strength === 3) {
      strengthText = 'Moderate';
      color = 'yellow';
    } else if (strength === 4) {
      strengthText = 'Strong';
      color = 'lightgreen';
    } else if (strength === 5) {
      strengthText = 'Very Strong';
      color = 'green';
    }

    strengthValue.textContent = strengthText;
    strengthBar.style.backgroundColor = color;
  }

  passwordInput.addEventListener('input', () => {
    const strength = checkPasswordStrength(passwordInput.value);
    updateStrengthMeter(strength);
  });

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!cmuEmailRegex.test(email)) {
      alert('Please enter a valid CMU email (9-digit student ID followed by @cityofmalabonuniversity.edu.ph)');
      return;
    }

    const strength = checkPasswordStrength(password);
    if (strength < 3) {
      alert('Password is too weak. Please follow the password requirements.');
      return;
    }

    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const middleInitial = document.getElementById('middle-initial').value.trim();
    const birthday = document.querySelector('input[name="birthday"]').value;

    const formData = `firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&middleInitial=${encodeURIComponent(middleInitial)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&birthday=${encodeURIComponent(birthday)}`;

    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData,
    })
    .then(response => {
      if (response.ok) {
        window.location.href = '/';
      } else {
        alert('Invalid credentials or signup error');
      }
    })
    .catch(error => console.error('Error:', error));
  });

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
});
