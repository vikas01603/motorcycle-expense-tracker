// ========================================
// EXPENSES LOGIC – SCRAMBLER
// ========================================

/**
 * Helper to get the current bikeId from storage
 */
function getActiveBike() {
    return localStorage.getItem("bikeId");
}

// ========================================
// LOAD EXPENSES
// ========================================
async function loadExpenses() {
    const table = document.getElementById("expenseTable");
    if (!table) return;

    const bikeId = getActiveBike();
    if (!bikeId) {
        table.innerHTML = `<tr><td colspan="6" style="text-align:center;">Please select a bike first.</td></tr>`;
        return;
    }

    try {
        table.innerHTML = `<tr><td colspan="6" style="text-align:center;">Loading expenses...</td></tr>`;
        
        const expenses = await getExpenses(); // API call
        table.innerHTML = "";

        if (!expenses || expenses.length === 0) {
            table.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;color:#888;padding:20px;">
                        No expenses recorded yet.
                    </td>
                </tr>`;
            return;
        }

        // Sort: Newest expenses at the top
        const sortedExpenses = expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedExpenses.forEach(exp => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${new Date(exp.date).toLocaleDateString('en-IN')}</td>
                <td><span class="category-tag">${exp.category}</span></td>
                <td>${exp.subCategory || "—"}</td>
                <td>${exp.odometer ? exp.odometer.toLocaleString() + " km" : "—"}</td>
                <td><strong>₹ ${Number(exp.amount).toLocaleString('en-IN')}</strong></td>
                <td class="text-muted small">${exp.description || "—"}</td>
            `;

            table.appendChild(row);
        });

    } catch (err) {
        console.error("Expense load error:", err.message);
        table.innerHTML = `<tr><td colspan="6" style="text-align:center;color:red;">Failed to load data.</td></tr>`;
    }
}

// ========================================
// ADD EXPENSE
// ========================================
async function addExpenseEntry(e) {
    if (e) e.preventDefault();

    const bikeId = getActiveBike();
    if (!bikeId) {
        alert("Please add or select a bike first!");
        return;
    }

    // Input elements
    const dateEl = document.getElementById("expenseDate");
    // match IDs defined in pages/expenses.html
    const catEl = document.getElementById("category");
    const subCatEl = document.getElementById("description");
    const amountEl = document.getElementById("amount");
    const odoEl = document.getElementById("odometer");
    const descEl = document.getElementById("description");
    const btn = document.getElementById("addExpenseBtn");

    // Validation
    if (!dateEl.value || !catEl.value || !amountEl.value) {
        alert("Please fill in Date, Category, and Amount.");
        return;
    }

    try {
        if (btn) btn.disabled = true;

        const payload = {
            bikeId,
            date: dateEl.value,
            category: catEl.value,
            subCategory: subCatEl.value,
            amount: Number(amountEl.value),
            odometer: odoEl.value ? Number(odoEl.value) : null,
            description: descEl.value
        };

        await addExpense(payload); // API call

        // Reset form fields
        [dateEl, catEl, subCatEl, amountEl, odoEl, descEl].forEach(el => {
            if (el) el.value = "";
        });

        alert("Expense added!");
        loadExpenses(); // Refresh table

    } catch (err) {
        alert(err.message || "Failed to add expense");
    } finally {
        if (btn) btn.disabled = false;
    }
}

// ========================================
// EVENT BINDINGS
// ========================================
document.addEventListener("DOMContentLoaded", () => {
    // Basic Auth Check
    if (!localStorage.getItem("token")) {
        window.location.replace("login.html");
        return;
    }

    const btn = document.getElementById("addExpenseBtn");
    if (btn) {
        btn.addEventListener("click", addExpenseEntry);
    }

    loadExpenses();
});