// public/js/auth.js
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.querySelector("form[action='/register']");
  const loginForm = document.querySelector("form[action='/login']");

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = signupForm.email.value.trim();
      const password = signupForm.password.value;

      if (!email || !password) {
        alert("Please enter both email and password.");
        return;
      }

      try {
        const res = await fetch("/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const result = await res.json();

        if (res.ok) {
          alert("Registration successful! Redirecting to login...");
          window.location.href = "/login";
        } else {
          alert(result.error || "Registration failed.");
        }
      } catch (err) {
        console.error("Error during registration:", err);
        alert("Something went wrong. Please try again.");
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = loginForm.email.value.trim();
      const password = loginForm.password.value;

      if (!email || !password) {
        alert("Please enter your email and password.");
        return;
      }

      try {
        const res = await fetch("/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const result = await res.json();

        if (res.ok) {
          alert("Login successful! Redirecting...");
          window.location.href = "/";
        } else {
          alert(result.error || "Invalid credentials.");
        }
      } catch (err) {
        console.error("Login error:", err);
        alert("Unable to log in. Please try again.");
      }
    });
  }
});