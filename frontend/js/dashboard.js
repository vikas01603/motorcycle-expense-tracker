// ========================================
// DASHBOARD LOGIC – SCRAMBLER
// ========================================

/**
 * Helper to ensure the user is logged in.
 * If not, redirects to login immediately.
 */
function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.replace("login.html");
        return false;
    }
    return true;
}

// ========================================
// LOAD DASHBOARD
// ========================================
async function loadDashboard() {
    // 1. Always check for the latest bikeId from storage
    const bikeId = localStorage.getItem("bikeId");
    
    // UI Elements
    const totalEl = document.getElementById("totalSpent");
    const fuelEl = document.getElementById("fuelSpent");
    const serviceEl = document.getElementById("serviceSpent");
    const mileageEl = document.getElementById("avgMileage");

    try {
        // 2. If no bike is selected, show empty states
        if (!bikeId) {
            console.warn("No bike selected. Dashboard stats set to default.");
            if (totalEl) totalEl.innerText = "₹ 0";
            if (fuelEl) fuelEl.innerText = "₹ 0";
            if (serviceEl) serviceEl.innerText = "₹ 0";
            if (mileageEl) mileageEl.innerText = "0 km/l";
            return;
        }

        // 3. Fetch data from API (uses getDashboardData from your API wrapper)
        const data = await getDashboardData();

        // 4. Update Stats with safe number conversion
        const totalSpent = Number(data.totalSpent ?? 0);
        const fuelSpent = Number(data.fuelSpent ?? 0);
        const serviceSpent = Number(data.serviceSpent ?? 0);
        const avgMileageVal = data.avgMileage != null ? Number(data.avgMileage) : 0;

        if (totalEl) totalEl.innerText = `₹ ${totalSpent.toLocaleString()}`;
        if (fuelEl) fuelEl.innerText = `₹ ${fuelSpent.toLocaleString()}`;
        if (serviceEl) serviceEl.innerText = `₹ ${serviceSpent.toLocaleString()}`;
        if (mileageEl) mileageEl.innerText = `${avgMileageVal.toFixed(1)} km/l`;

    } catch (err) {
        console.error("Dashboard error:", err.message);
        // Only alert if the error isn't a 401 (handled by API wrapper)
        if (err.message !== "Unauthorized") {
            alert("Failed to load dashboard data. Please try again later.");
        }
    }
}

// ========================================
// INITIAL LOAD
// ========================================
document.addEventListener("DOMContentLoaded", () => {
    if (checkAuth()) {
        loadDashboard();
    }
});