// ========================================
// AUTH LOGIC – SCRAMBLER APP
// ========================================

// Redirect helpers
function redirectToApp() {
    window.location.replace("app.html"); // .replace is better for auth to prevent "back" button issues
}

function redirectToLogin() {
    // Only redirect if we aren't already on the login or register page
    const path = window.location.pathname;
    if (!path.includes("login.html") && !path.includes("register.html")) {
        window.location.replace("login.html");
    }
}

// ========================================
// AUTH GATE
// ========================================
(function authGate() {
    const token = localStorage.getItem("token");
    const path = window.location.pathname;

    // If on index.html, decide where to send them
    if (path.includes("index.html") || path === "/") {
        if (token) redirectToApp();
        else redirectToLogin();
        return;
    }

    // If on app pages but no token, boot to login
    if (!token && !path.includes("login.html") && !path.includes("register.html")) {
        redirectToLogin();
    }
})();

// ========================================
// LOGIN
// ========================================
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;
    const submitBtn = e.target.querySelector('button[type="submit"]');

    if (!email || !password) {
        alert("Please fill all fields");
        return;
    }

    try {
        if (submitBtn) submitBtn.disabled = true; // Prevent double submission
        
        const data = await loginUser(email, password);

        // Save auth data
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);

        // Attempt to fetch bikes to set default bikeId
        try {
            const bikes = await getUserBikes();
            if (bikes && bikes.length > 0) {
                localStorage.setItem("bikeId", bikes[0]._id);
                redirectToApp();
            } else {
                // No bikes? Redirect to app but maybe show a "Add Bike" modal/view
                alert("Login successful! Please add your first bike.");
                localStorage.removeItem("bikeId");
                redirectToApp(); 
            }
        } catch (bikeErr) {
            console.error("Could not fetch bikes:", bikeErr);
            redirectToApp();
        }

    } catch (err) {
        alert(err.message || "Login failed");
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
}

// ========================================
// REGISTER
// ========================================
async function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById("name")?.value;
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;
    const submitBtn = e.target.querySelector('button[type="submit"]');

    if (!name || !email || !password) {
        alert("Please fill all fields");
        return;
    }

    try {
        if (submitBtn) submitBtn.disabled = true;

        await registerUser(name, email, password);
        alert("Account created successfully. Please login.");
        redirectToLogin();
    } catch (err) {
        alert(err.message || "Registration failed");
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
}

// ========================================
// LOGOUT
// ========================================
function handleLogout() {
    localStorage.clear();
    window.location.replace("login.html");
}

// ========================================
// EVENT BINDINGS
// ========================================
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", handleRegister);
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            handleLogout();
        });
    }
});