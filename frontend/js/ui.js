// ========================================
// UI ENGINE – SCRAMBLER
// ========================================

/**
 * Enhanced Number Counter
 * Handles decimals and custom formatting
 */
function animateValue(el, start, end, duration = 1000, suffix = "", isCurrency = false) {
    if (!el) return;

    let startTime = null;

    function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        // Use a power function for a "smooth out" easing effect
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = (easeOut * (end - start) + start);

        // Format the output
        let formatted = isCurrency 
            ? Math.floor(currentVal).toLocaleString('en-IN') 
            : currentVal.toFixed(1);

        el.innerText = isCurrency ? `₹ ${formatted}` : `${formatted}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

// ========================================
// DASHBOARD COUNTERS
// ========================================
function animateDashboardStats() {
    const stats = [
        { id: "totalSpent", isCurrency: true, suffix: "" },
        { id: "fuelSpent", isCurrency: true, suffix: "" },
        { id: "serviceSpent", isCurrency: true, suffix: "" },
        { id: "avgMileage", isCurrency: false, suffix: " km/l" }
    ];

    stats.forEach(stat => {
        const el = document.getElementById(stat.id);
        if (el) {
            // Extract only numbers/decimals from the current text
            const finalValue = parseFloat(el.innerText.replace(/[^0-9.]/g, "")) || 0;
            if (finalValue > 0) {
                animateValue(el, 0, finalValue, 1200, stat.suffix, stat.isCurrency);
            }
        }
    });
}

// ========================================
// SIDEBAR & NAVIGATION
// ========================================
function initNavigation() {
    const sidebar = document.querySelector(".sidebar");
    const menuBtn = document.getElementById("menuBtn");
    const navItems = document.querySelectorAll(".nav-item");

    // Toggle Sidebar
    if (menuBtn && sidebar) {
        menuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("open");
        });
    }

    // Set Active State based on current URL
    const currentPath = window.location.pathname.split("/").pop();
    navItems.forEach(item => {
        const href = item.getAttribute("href");
        if (href === currentPath) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Page Entry Animation
    const mainContent = document.querySelector("main") || document.querySelector(".page");
    if (mainContent) {
        mainContent.style.opacity = "0";
        mainContent.style.transform = "translateY(10px)";
        mainContent.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        
        // Trigger fade in
        setTimeout(() => {
            mainContent.style.opacity = "1";
            mainContent.style.transform = "translateY(0)";
        }, 50);
    }

    // 2. Setup Nav
    initNavigation();

    // 3. Animate Dashboard
    // Note: In a real app, call this AFTER your API data has loaded
    setTimeout(animateDashboardStats, 500);
});

// This function ensures that when a new page is loaded, 
// the corresponding data-load function is called.
function onPageLoad() {
    const currentPage = window.location.pathname;
    
    if (currentPage.includes("bike.html")) {
        if (typeof loadBike === "function") loadBike();
    }
    if (currentPage.includes("fuel.html")) {
        if (typeof loadFuelLogs === "function") loadFuelLogs();
    }
}

document.addEventListener("DOMContentLoaded", onPageLoad);