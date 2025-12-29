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

        // Reset UI to safe defaults (no junk values)
        const resetText = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.innerText = value;
        };
        resetText("bikeName", "—");
        resetText("bikeModel", "—");
        resetText("bikeYear", "0");
        resetText("engineCC", "0 cc");
        resetText("regNumber", "—");
        resetText("currentOdo", "0 km");
        resetText("purchaseDate", "—");
        resetText("purchasePrice", "₹ 0");

        // Also reset form fields so user always sees clean defaults
        const setValue = (id, value) => {
            const input = document.getElementById(id);
            if (input) input.value = value ?? "";
        };
        setValue("formBikeName", "");
        setValue("brand", "");
        setValue("model", "");
        setValue("year", "0");
        setValue("engine", "0");
        setValue("registration", "");
        setValue("purchaseDateInput", "");
        setValue("purchasePriceInput", "0");
        setValue("currentOdometer", "0");
n        // If no bikes exist yet, keep defaults and let user fill the form
        if (!bikes || bikes.length === 0) {
            console.log("No bikes found for this user.");
            return;
        }

        // For now, we default to the first bike
        // In the future, you could let users switch between bikes
        const bike = bikes[0];

        // Critical: Save bikeId so other pages can use it
        localStorage.setItem("bikeId", bike._id);

        // ===============================
        // DISPLAY BIKE DETAILS (SUMMARY CARD)
        // ===============================
        const name = bike.bikeName || "My Bike";
        const modelLabel = `${bike.brand || ""} ${bike.model || ""}`.trim() || "—";
        const yearVal = bike.year ?? 0;
        const engineVal = bike.engineCC ?? 0;
        const odoVal = typeof bike.currentOdometer === "number" ? bike.currentOdometer : 0;
        const purchasePriceVal = typeof bike.purchasePrice === "number" ? bike.purchasePrice : 0;

        resetText("bikeName", name);
        resetText("bikeModel", modelLabel);
        resetText("bikeYear", String(yearVal));
        resetText("engineCC", `${engineVal} cc`);
        resetText("regNumber", bike.registrationNumber || "—");
        resetText("currentOdo", `${odoVal.toLocaleString()} km`);

        const purchaseDateEl = document.getElementById("purchaseDate");
        if (purchaseDateEl) {
            if (bike.purchaseDate) {
                purchaseDateEl.innerText = new Date(bike.purchaseDate).toLocaleDateString("en-IN");
            } else {
                purchaseDateEl.innerText = "—";
            }
        }

        const purchasePriceEl = document.getElementById("purchasePrice");
        if (purchasePriceEl) {
            purchasePriceEl.innerText = `₹ ${Number(purchasePriceVal).toLocaleString("en-IN")}`;
        }

        // ===============================
        // FILL EDIT FORM WITH SAME DATA
        // ===============================
        setValue("formBikeName", bike.bikeName || "");
        setValue("brand", bike.brand || "");
        setValue("model", bike.model || "");
        setValue("year", yearVal || "0");
        setValue("engine", engineVal || "0");
        setValue("registration", bike.registrationNumber || "");
        setValue("purchaseDateInput", bike.purchaseDate ? new Date(bike.purchaseDate).toISOString().slice(0, 10) : "");
        setValue("purchasePriceInput", purchasePriceVal || "0");
        setValue("currentOdometer", odoVal || "0");

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