document.addEventListener("DOMContentLoaded", () => {
  const accountBtn = document.querySelector('.account-btn');
  const dropdown = document.querySelector('.dropdown-content');

  const profileLink = document.getElementById("profile-settings-link");
  const appearanceLink = document.getElementById("appearance-settings-link");
  const supportLink = document.getElementById("support-link");
  const logoutLink = document.getElementById("logout-link");

  const profileModal = document.getElementById("profile-modal");
  const appearanceModal = document.getElementById("appearance-modal");
  const supportModal = document.getElementById("support-modal");

  const closeBtns = document.querySelectorAll(".close-btn, .close-btn-support, .close-btn-appearance");

  const profileForm = document.getElementById("profile-form");
  const usernameDisplay = document.getElementById("username-display");
  const emailDisplay = document.getElementById("email-display");
  const usernameInput = document.getElementById("username-input");
  const emailInput = document.getElementById("email-input");

  const sendSupportBtn = document.getElementById("send-support-btn");
  const supportMessage = document.getElementById("support-message");
  const supportConfirmation = document.getElementById("support-confirmation");

  const themeOptions = document.querySelectorAll(".theme-option");

  const savedTheme = localStorage.getItem("selectedTheme") || "light";
  document.body.classList.remove("light-theme", "dark-theme", "ash-theme", "onyx-theme");
  document.body.classList.add(savedTheme + "-theme");

  const fullName = localStorage.getItem("userFullName") || "Unknown User";
  const email = localStorage.getItem("userEmail") || "unknown@example.com";

  if (usernameDisplay) usernameDisplay.textContent = fullName;
  if (emailDisplay) emailDisplay.textContent = email;
  if (usernameInput) usernameInput.value = fullName;
  if (emailInput) emailInput.value = email;

  accountBtn?.addEventListener("click", () => {
    dropdown.classList.toggle("show");
  });

  profileLink?.addEventListener("click", (e) => {
    e.preventDefault();
    profileModal.style.display = "block";
    dropdown.classList.remove("show");
  });

  appearanceLink?.addEventListener("click", (e) => {
    e.preventDefault();
    appearanceModal.style.display = "block";
    dropdown.classList.remove("show");
  });

  supportLink?.addEventListener("click", (e) => {
    e.preventDefault();
    supportModal.style.display = "block";
    dropdown.classList.remove("show");
    supportConfirmation.style.display = "none";
    supportMessage.value = "";
  });

  if (logoutLink) {
    logoutLink.addEventListener('click', function(event) {
      event.preventDefault(); 
      fetch('/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.redirected) {
          localStorage.removeItem('userFullName');
          localStorage.removeItem('userEmail');
          window.location.href = response.url;
        }
      });
    });
  }

  closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      profileModal.style.display = "none";
      appearanceModal.style.display = "none";
      supportModal.style.display = "none";
    });
  });

  window.addEventListener("click", (e) => {
    if (!e.target.closest(".my-account-dropdown") && !e.target.closest(".modal-content") && !e.target.closest(".account-btn")) {
      dropdown.classList.remove("show");
      profileModal.style.display = "none";
      appearanceModal.style.display = "none";
      supportModal.style.display = "none";
    }
  });

  profileForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fullName = usernameInput.value.trim();

    const nameParts = fullName.split(' ');
    let firstName = '';
    let middleInitial = '';
    let lastName = '';

    if (nameParts.length === 1) {
      firstName = nameParts[0];
    } else if (nameParts.length === 2) {
      firstName = nameParts[0];
      lastName = nameParts[1];
    } else if (nameParts.length === 3) {
      firstName = nameParts[0];
      middleInitial = nameParts[1].replace('.', '');
      lastName = nameParts[2];
    } else if (nameParts.length > 3) {
      firstName = nameParts[0];
      middleInitial = nameParts[1].replace('.', '');
      lastName = nameParts.slice(2).join(' ');
    }

    try {
      const response = await fetch('/welcome/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          middleInitial: middleInitial
        })
      });

      if (response.ok) {
        localStorage.setItem("userFullName", fullName);
        usernameDisplay.textContent = fullName;
        profileModal.style.display = "none";
        alert('Profile updated successfully');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating profile');
    }
  });

  themeOptions.forEach(option => {
    option.addEventListener("click", function () {
      const theme = this.dataset.theme;
      document.body.classList.remove("light-theme", "dark-theme", "ash-theme", "onyx-theme");
      document.body.classList.add(theme + "-theme");
      localStorage.setItem("selectedTheme", theme);
      appearanceModal.style.display = "none";
    });
  });

  sendSupportBtn?.addEventListener("click", () => {
    if (supportMessage.value.trim() === "") {
      alert("Please enter a message.");
      return;
    }

    fetch('/welcome/support', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: supportMessage.value.trim() })
    })
    .then(response => {
      if (response.ok) {
        supportConfirmation.style.display = "block";
        supportMessage.value = "";
        setTimeout(() => {
          supportConfirmation.style.display = "none";
        }, 3000);
      } else {
        alert('Failed to send support message.');
      }
    })
    .catch(error => {
      console.error('Error sending support message:', error);
      alert('An error occurred while sending support message.');
    });
  });

  const boxes = document.querySelectorAll('.box');
  boxes.forEach(box => {
    box.addEventListener('click', () => {
      box.classList.toggle('flipped');
    });
  });
});