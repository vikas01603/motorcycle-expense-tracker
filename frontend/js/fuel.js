// ========================================
// FUEL LOGIC – SCRAMBLER
// ========================================

/**
 * Helper to ensure user is logged in and has a bike selected
 */
function getActiveBike() {
    const bikeId = localStorage.getItem("bikeId");
    if (!bikeId) {
        alert("Please select or add a bike first!");
        return null;
    }
    return bikeId;
}

// ========================================
// LOAD FUEL LOGS
// ========================================
async function loadFuelLogs() {
    const table = document.getElementById("fuelTable");
    if (!table) return;

    const bikeId = getActiveBike();
    if (!bikeId) return;

    try {
        table.innerHTML = `<tr><td colspan="6" style="text-align:center;">Loading logs...</td></tr>`;
        
        const logs = await getFuelLogs();

        // Clear table
        table.innerHTML = "";

        if (!logs || logs.length === 0) {
            table.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center; color:#888; padding: 20px;">
                        No fuel records found. Fill up your tank to start tracking!
                    </td>
                </tr>`;
            return;
        }

        // Sort logs by date (newest first)
        const sortedLogs = logs.sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedLogs.forEach(log => {
            const row = document.createElement("tr");
            
            // Format numbers for clean display
            const qty = Number(log.fuelQuantity).toFixed(2);
            const price = Number(log.pricePerLiter).toFixed(2);
            const total = Number(log.totalCost || (qty * price)).toFixed(2);
            const mileage = log.calculatedMileage 
                ? `${Number(log.calculatedMileage).toFixed(1)} km/l` 
                : "-";

            row.innerHTML = `
                <td>${new Date(log.date).toLocaleDateString('en-IN')}</td>
                <td>${log.odometer.toLocaleString()} km</td>
                <td>${qty} L</td>
                <td>₹ ${price}</td>
                <td><strong>₹ ${total}</strong></td>
                <td><span class="badge">${mileage}</span></td>
            `;

            table.appendChild(row);
        });

    } catch (err) {
        console.error("Fuel load error:", err.message);
        table.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red;">Error loading logs.</td></tr>`;
    }
}

// ========================================
// ADD FUEL LOG
// ========================================
async function addFuel(e) {
    if (e) e.preventDefault(); // Prevent page reload if inside a form

    const bikeId = getActiveBike();
    if (!bikeId) return;

    // Get Inputs
    const dateInput = document.getElementById("fuelDate");
    const odoInput = document.getElementById("fuelOdo");
    const qtyInput = document.getElementById("fuelQty");
    const priceInput = document.getElementById("fuelPrice");
    const btn = document.getElementById("addFuelBtn");

    if (!dateInput.value || !odoInput.value || !qtyInput.value || !priceInput.value) {
        alert("Please fill all fields");
        return;
    }

    try {
        if (btn) btn.disabled = true;

        const qty = Number(qtyInput.value);
        const price = Number(priceInput.value);

        const fuelData = {
            bikeId,
            date: dateInput.value,
            odometer: Number(odoInput.value),
            fuelQuantity: qty,
            pricePerLiter: price,
            totalCost: qty * price // Calculate total automatically
        };

        await addFuelLog(fuelData);

        // Clear inputs
        dateInput.value = "";
        odoInput.value = "";
        qtyInput.value = "";
        priceInput.value = "";

        // Refresh table
        await loadFuelLogs();
        alert("Fuel log added successfully!");

    } catch (err) {
        alert(err.message || "Failed to add fuel log");
    } finally {
        if (btn) btn.disabled = false;
    }
}

// ========================================
// EVENT BINDINGS
// ========================================
document.addEventListener("DOMContentLoaded", () => {
    // Check auth first
    if (!localStorage.getItem("token")) {
        window.location.replace("login.html");
        return;
    }

    const btn = document.getElementById("addFuelBtn");
    if (btn) {
        btn.addEventListener("click", addFuel);
    }

    loadFuelLogs();
});