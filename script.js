let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let chart;

function addTransaction() {
    const description = document.getElementById("description").value;
    const amount = +document.getElementById("amount").value;
    const type = document.getElementById("type").value;

    if (!description || amount <= 0) return;

    transactions.push({ description, amount, type });
    localStorage.setItem("transactions", JSON.stringify(transactions));

    document.getElementById("description").value = "";
    document.getElementById("amount").value = "";

    renderTransactions();
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    renderTransactions();
}

function renderTransactions() {
    const list = document.getElementById("transaction-list");
    const filter = document.getElementById("filter").value;
    list.innerHTML = "";

    let income = 0, expense = 0;

    transactions.forEach((t, index) => {
        if (filter !== "all" && t.type !== filter) return;

        const li = document.createElement("li");
        li.className = t.type;

        li.innerHTML = `
            ${t.description} - ₹${t.amount}
            <span class="delete" onclick="deleteTransaction(${index})">❌</span>
        `;
        list.appendChild(li);

        t.type === "income" ? income += t.amount : expense += t.amount;
    });

    document.getElementById("income").innerText = income;
    document.getElementById("expense").innerText = expense;
    document.getElementById("balance").innerText = income - expense;

    updateChart(income, expense);
}

function updateChart(income, expense) {
    const ctx = document.getElementById("budgetChart");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Income", "Expense"],
            datasets: [{
                data: [income, expense],
                backgroundColor: ["green", "red"]
            }]
        }
    });
}

renderTransactions();
