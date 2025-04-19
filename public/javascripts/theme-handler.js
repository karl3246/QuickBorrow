document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("selectedTheme") || "white";
  applyTheme(savedTheme);

  document.querySelectorAll(".theme-option").forEach(option => {
    option.addEventListener("click", () => {
      const theme = option.getAttribute("data-theme");
      applyTheme(theme);
      localStorage.setItem("selectedTheme", theme);
    });
  });

  const colorButton = document.getElementById("colorButton");
  if (colorButton) {
    colorButton.addEventListener("click", () => {
      const currentTheme = localStorage.getItem("selectedTheme") || "white";
      const newTheme = (currentTheme === "white") ? "dark" : "white";
      applyTheme(newTheme);
      localStorage.setItem("selectedTheme", newTheme);
    });
  }
});

function applyTheme(theme) {
  document.body.classList.remove("white", "dark", "ash", "onyx");
  document.body.classList.add(theme);
}
