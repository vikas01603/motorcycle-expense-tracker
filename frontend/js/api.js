// ========================================
// API CONFIG
// ========================================
// Tip: Use a relative path if hosting frontend/backend together, 
// or an environment variable for production.
const API_BASE = "http://localhost:5000/api";

// ========================================
// AUTH HELPERS
// ========================================
function getToken() {
    return localStorage.getItem("token");
}

function getBikeId() {
    return localStorage.getItem("bikeId");
}

function authHeaders() {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
    };
}

// ========================================
// GENERIC FETCH WRAPPER
// ========================================
async function apiRequest(url, options = {}) {
    try {
        const res = await fetch(url, options);
        
        // Handle empty responses (like 204 No Content)
        const isJson = res.headers.get('content-type')?.includes('application/json');
        const data = isJson ? await res.json() : null;

        if (!res.ok) {
            // Auto-logout on unauthorized
            if (res.status === 401) {
                logout();
            }
            throw new Error(data?.message || `Error: ${res.status}`);
        }

        return data;
    } catch (err) {
        console.error("API ERROR:", err.message);
        throw err;
    }
}

// ========================================
// AUTH APIs
// ========================================
async function loginUser(email, password) {
    return apiRequest(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
}

async function registerUser(name, email, password) {
    return apiRequest(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });
}

// ========================================
// BIKE APIs
// ========================================
async function getUserBikes() {
    return apiRequest(`${API_BASE}/bikes`, {
        headers: authHeaders()
    });
}

async function addBike(bikeData) {
    return apiRequest(`${API_BASE}/bikes`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(bikeData)
    });
}

// ========================================
// DASHBOARD API
// ========================================
async function getDashboardData() {
    const bikeId = getBikeId();
    if (!bikeId) throw new Error("No bike selected");

    return apiRequest(`${API_BASE}/dashboard/${bikeId}`, {
        headers: authHeaders()
    });
}

// ========================================
// FUEL APIs
// ========================================
async function addFuelLog(fuelData) {
    const bikeId = getBikeId();
    return apiRequest(`${API_BASE}/fuel`, {
        method: "POST",
        headers: authHeaders(),
        // Ensure bikeId is included in the body
        body: JSON.stringify({ ...fuelData, bikeId })
    });
}

async function getFuelLogs() {
    const bikeId = getBikeId();
    if (!bikeId) return [];
    
    return apiRequest(`${API_BASE}/fuel/${bikeId}`, {
        headers: authHeaders()
    });
}

// ========================================
// EXPENSE APIs
// ========================================
async function addExpense(expenseData) {
    const bikeId = getBikeId();
    return apiRequest(`${API_BASE}/expenses`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ ...expenseData, bikeId })
    });
}

async function getExpenses() {
    const bikeId = getBikeId();
    if (!bikeId) return [];

    return apiRequest(`${API_BASE}/expenses/${bikeId}`, {
        headers: authHeaders()
    });
}

// ========================================
// SERVICE APIs
// ========================================
async function addService(serviceData) {
    const bikeId = getBikeId();
    return apiRequest(`${API_BASE}/services`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ ...serviceData, bikeId })
    });
}

async function getServices() {
    const bikeId = getBikeId();
    if (!bikeId) return [];

    return apiRequest(`${API_BASE}/services/${bikeId}`, {
        headers: authHeaders()
    });
}

// ========================================
// RIDE APIs
// ========================================
async function addRide(rideData) {
    const bikeId = getBikeId();
    return apiRequest(`${API_BASE}/rides`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ ...rideData, bikeId })
    });
}

async function getRides() {
    const bikeId = getBikeId();
    if (!bikeId) return [];

    return apiRequest(`${API_BASE}/rides/${bikeId}`, {
        headers: authHeaders()
    });
}

// ========================================
// LOGOUT
// ========================================
function logout() {
    localStorage.clear();
    // Use replace to prevent users from hitting "back" to go to a logged-in state
    window.location.replace("login.html");
}