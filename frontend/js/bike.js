// ========================================
// BIKE LOGIC – SCRAMBLER
// ========================================

/**
 * Guard: Ensure user is logged in
 */
function checkAuth() {
    if (!localStorage.getItem("token")) {
        window.location.replace("login.html");
        return false;
    }
    return true;
}

// ========================================
// LOAD BIKE
// ========================================
async function loadBike() {
    try {
        const bikes = await getUserBikes();

        // If no bikes exist, show the "Add Bike" form or a placeholder
        if (!bikes || bikes.length === 0) {
            console.log("No bikes found for this user.");
            // You might want to show a 'Welcome' modal here
            return;
        }

        // For now, we default to the first bike
        // In the future, you could let users switch between bikes
        const bike = bikes[0];

        // Critical: Save bikeId so other pages can use it
        localStorage.setItem("bikeId", bike._id);

        // ===============================
        // DISPLAY BIKE DETAILS
        // ===============================
        const setText = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.innerText = value || "—";
        };

        setText("bikeName", bike.bikeName);
        setText("bikeModel", `${bike.brand || ""} ${bike.model || ""}`.trim());
        setText("bikeYear", bike.year);
        setText("engineCC", bike.engineCC ? `${bike.engineCC} cc` : "—");
        setText("regNumber", bike.registrationNumber);
        setText("currentOdo", bike.currentOdometer ? `${bike.currentOdometer.toLocaleString()} km` : "—");
        
        if (document.getElementById("purchaseDate")) {
            document.getElementById("purchaseDate").innerText = 
                bike.purchaseDate ? new Date(bike.purchaseDate).toLocaleDateString('en-IN') : "—";
        }

        if (document.getElementById("purchasePrice")) {
            document.getElementById("purchasePrice").innerText = 
                bike.purchasePrice ? `₹ ${Number(bike.purchasePrice).toLocaleString('en-IN')}` : "—";
        }

    } catch (err) {
        console.error("Bike load error:", err.message);
    }
}

// ========================================
// ADD / UPDATE BIKE
// ========================================
async function saveBike(e) {
    if (e) e.preventDefault();

    const btn = document.getElementById("saveBikeBtn");
    
    // Get values from form
    const bikeData = {
        bikeName: document.getElementById("formBikeName")?.value,
        brand: document.getElementById("brand")?.value,
        model: document.getElementById("model")?.value,
        year: Number(document.getElementById("year")?.value) || null,
        engineCC: Number(document.getElementById("engine")?.value) || null,
        registrationNumber: document.getElementById("registration")?.value,
        purchaseDate: document.getElementById("purchaseDateInput")?.value,
        purchasePrice: Number(document.getElementById("purchasePriceInput")?.value) || null,
        currentOdometer: Number(document.getElementById("currentOdometer")?.value) || null
    };

    if (!bikeData.bikeName || !bikeData.brand || !bikeData.model) {
        alert("Bike name, brand, and model are required!");
        return;
    }

    try {
        if (btn) {
            btn.disabled = true;
            btn.innerText = "Saving...";
        }

        await addBike(bikeData);
        alert("Bike added successfully!");

        // Refresh the display
        await loadBike();
        
        // Optional: If you have a modal, close it here
        // $('#bikeModal').modal('hide');

    } catch (err) {
        alert(err.message || "Failed to save bike");
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerText = "Save Bike";
        }
    }
}

// ========================================
// EVENT BINDINGS
// ========================================
document.addEventListener("DOMContentLoaded", () => {
    if (checkAuth()) {
        const btn = document.getElementById("saveBikeBtn");
        if (btn) {
            btn.addEventListener("click", saveBike);
        }

        loadBike();
    }
});