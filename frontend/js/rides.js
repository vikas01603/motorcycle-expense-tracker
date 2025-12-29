// ========================================
// RIDES LOGIC – SCRAMBLER
// ========================================

/**
 * Helper to ensure we have a valid bike selected
 */
function getActiveBike() {
    return localStorage.getItem("bikeId");
}

// ========================================
// LOAD RIDES
// ========================================
async function loadRides() {
    const rideList = document.getElementById("rideList");
    if (!rideList) return;

    const bikeId = getActiveBike();
    if (!bikeId) {
        rideList.innerHTML = `<p style="text-align:center;">Select a bike to see your rides.</p>`;
        return;
    }

    try {
        rideList.innerHTML = `<p style="text-align:center;">Fetching your adventures...</p>`;
        
        const rides = await getRides();
        rideList.innerHTML = "";

        let totalDistance = 0;
        let longestRide = 0;

        if (!rides || rides.length === 0) {
            rideList.innerHTML = `
                <div style="color:#888; text-align:center; padding: 20px;">
                    No rides logged yet. Time to hit the road!
                </div>`;
        } else {
            // Sort: Newest rides at the top
            const sortedRides = rides.sort((a, b) => new Date(b.date) - new Date(a.date));

            sortedRides.forEach(ride => {
                // Calculate distance if missing from backend
                const distance = ride.distance || (Number(ride.endOdometer) - Number(ride.startOdometer));
                
                totalDistance += distance;
                longestRide = Math.max(longestRide, distance);

                const card = document.createElement("div");
                card.className = "ride-card lift"; // Ensure 'lift' class exists in CSS for hover effect

                // Map ride types to specific CSS classes
                const typeClass = (ride.rideType || "City").toLowerCase();

                card.innerHTML = `
                    <div class="ride-header">
                        <h4>${ride.rideName || "Unnamed Adventure"}</h4>
                        <span class="tag tag-${typeClass}">${ride.rideType || "City"}</span>
                    </div>
                    <div class="ride-meta">
                        <i class="icon-calendar"></i> ${new Date(ride.date).toLocaleDateString('en-IN')}
                    </div>
                    <hr>
                    <div class="ride-stats">
                        <div class="stat-item">
                            <small>Distance</small>
                            <p>${distance.toLocaleString()} km</p>
                        </div>
                        <div class="stat-item">
                            <small>Odometer</small>
                            <p>${ride.startOdometer} ➔ ${ride.endOdometer}</p>
                        </div>
                    </div>
                    ${ride.notes ? `<p class="ride-notes">"${ride.notes}"</p>` : ""}
                `;

                rideList.appendChild(card);
            });
        }

        // ===============================
        // UPDATE UI STATS
        // ===============================
        const distEl = document.getElementById("totalDistance");
        const countEl = document.getElementById("totalRides");
        const longEl = document.getElementById("longestRide");

        if (distEl) distEl.innerText = `${totalDistance.toLocaleString()} km`;
        if (countEl) countEl.innerText = rides.length;
        if (longEl) longEl.innerText = `${longestRide.toLocaleString()} km`;

    } catch (err) {
        console.error("Ride load error:", err.message);
        rideList.innerHTML = `<p style="color:red; text-align:center;">Failed to load rides.</p>`;
    }
}

// ========================================
// ADD RIDE
// ========================================
async function addRideEntry(e) {
    if (e) e.preventDefault();

    const bikeId = getActiveBike();
    if (!bikeId) {
        alert("Please add a bike first!");
        return;
    }

    const nameInput = document.getElementById("rideName");
    const dateInput = document.getElementById("rideDate");
    const startInput = document.getElementById("startOdo");
    const endInput = document.getElementById("endOdo");
    const typeInput = document.getElementById("rideType");
    const noteInput = document.getElementById("notes");
    const btn = document.getElementById("addRideBtn");

    const startVal = Number(startInput.value);
    const endVal = Number(endInput.value);

    // Validation
    if (!dateInput.value || !startInput.value || !endInput.value) {
        alert("Date and Odometer readings are required.");
        return;
    }

    if (endVal <= startVal) {
        alert("End odometer must be greater than start odometer.");
        return;
    }

    try {
        if (btn) btn.disabled = true;

        const rideData = {
            bikeId,
            rideName: nameInput.value || "Morning Ride",
            date: dateInput.value,
            startOdometer: startVal,
            endOdometer: endVal,
            distance: endVal - startVal,
            rideType: typeInput.value,
            notes: noteInput.value
        };

        await addRide(rideData);

        // Reset fields
        [nameInput, dateInput, startInput, endInput, noteInput].forEach(el => el.value = "");
        typeInput.value = "City";

        alert("Ride logged successfully!");
        loadRides();

    } catch (err) {
        alert(err.message || "Failed to save ride");
    } finally {
        if (btn) btn.disabled = false;
    }
}

// ========================================
// INITIALIZE
// ========================================
document.addEventListener("DOMContentLoaded", () => {
    // Basic Auth Check
    if (!localStorage.getItem("token")) {
        window.location.replace("login.html");
        return;
    }

    const btn = document.getElementById("addRideBtn");
    if (btn) {
        btn.addEventListener("click", addRideEntry);
    }

    loadRides();
});