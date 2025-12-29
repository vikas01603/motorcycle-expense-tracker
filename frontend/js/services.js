// ========================================
// SERVICES LOGIC – SCRAMBLER
// ========================================

/**
 * Helper to ensure we have a valid bike selected
 */
function getActiveBike() {
    return localStorage.getItem("bikeId");
}

// ========================================
// LOAD SERVICES
// ========================================
async function loadServices() {
    const table = document.getElementById("serviceTable");
    if (!table) return;

    const bikeId = getActiveBike();
    if (!bikeId) {
        table.innerHTML = `<tr><td colspan="5" style="text-align:center;">Select a bike to view service history.</td></tr>`;
        return;
    }

    try {
        table.innerHTML = `<tr><td colspan="5" style="text-align:center;">Loading history...</td></tr>`;
        
        const services = await getServices();
        table.innerHTML = "";

        let totalCostCount = 0;
        let mostRecentService = null;

        if (!services || services.length === 0) {
            table.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#888;padding:20px;">No service records found.</td></tr>`;
        } else {
            // Sort: Newest service date first
            const sortedServices = services.sort((a, b) => new Date(b.serviceDate) - new Date(a.serviceDate));
            mostRecentService = sortedServices[0];

            sortedServices.forEach(service => {
                totalCostCount += Number(service.totalCost || 0);

                const row = document.createElement("tr");
                const typeClass = String(service.serviceType).toLowerCase() === "major" ? "bg-danger" : "bg-info";

                row.innerHTML = `
                    <td>${new Date(service.serviceDate).toLocaleDateString('en-IN')}</td>
                    <td><span class="badge ${typeClass}">${service.serviceType}</span></td>
                    <td>${Number(service.odometer).toLocaleString()} km</td>
                    <td><strong>₹ ${Number(service.totalCost).toLocaleString('en-IN')}</strong></td>
                    <td class="text-muted">${service.serviceCenter || "Local Shop"}</td>
                `;
                table.appendChild(row);
            });
        }

        // ===============================
        // UPDATE UI STATS
        // ===============================
        const costEl = document.getElementById("totalServiceCost");
        const lastEl = document.getElementById("lastService");
        const nextEl = document.getElementById("nextService");

        if (costEl) costEl.innerText = `₹ ${totalCostCount.toLocaleString('en-IN')}`;
        
        if (mostRecentService) {
            if (lastEl) lastEl.innerText = new Date(mostRecentService.serviceDate).toLocaleDateString('en-IN');
            
            // Logic: Suggest next service 6 months from the last one
            const nextDate = new Date(mostRecentService.serviceDate);
            nextDate.setMonth(nextDate.getMonth() + 6);
            if (nextEl) nextEl.innerText = nextDate.toLocaleDateString('en-IN');
        } else {
            if (lastEl) lastEl.innerText = "—";
            if (nextEl) nextEl.innerText = "—";
        }

    } catch (err) {
        console.error("Service load error:", err.message);
        table.innerHTML = `<tr><td colspan="5" style="text-align:center;color:red;">Error fetching service data.</td></tr>`;
    }
}

// ========================================
// ADD SERVICE
// ========================================
async function addServiceEntry(e) {
    if (e) e.preventDefault();

    const bikeId = getActiveBike();
    if (!bikeId) {
        alert("Please add a bike before logging service.");
        return;
    }

    const dateInput = document.getElementById("serviceDate");
    const typeInput = document.getElementById("serviceType");
    const odoInput = document.getElementById("odometer");
    const costInput = document.getElementById("serviceCost");
    const centerInput = document.getElementById("serviceCenter");
    const btn = document.getElementById("addServiceBtn");

    if (!dateInput.value || !odoInput.value || !costInput.value) {
        alert("Please fill in the date, odometer reading, and total cost.");
        return;
    }

    try {
        if (btn) btn.disabled = true;

        const serviceData = {
            bikeId,
            serviceDate: dateInput.value,
            serviceType: typeInput.value,
            odometer: Number(odoInput.value),
            totalCost: Number(costInput.value),
            serviceCenter: centerInput.value
        };

        await addService(serviceData);

        // Reset fields
        dateInput.value = "";
        typeInput.value = "Minor";
        odoInput.value = "";
        costInput.value = "";
        centerInput.value = "";

        alert("Service record saved!");
        loadServices();

    } catch (err) {
        alert(err.message || "Failed to add service record");
    } finally {
        if (btn) btn.disabled = false;
    }
}

// ========================================
// INITIALIZE
// ========================================
document.addEventListener("DOMContentLoaded", () => {
    // Check auth
    if (!localStorage.getItem("token")) {
        window.location.replace("login.html");
        return;
    }

    const btn = document.getElementById("addServiceBtn");
    if (btn) {
        btn.addEventListener("click", addServiceEntry);
    }

    loadServices();
});