function formatDate(dateString) {
  const date = new Date(dateString);
  const formattedDay = date.getDate().toString().padStart(2, "0");
  const formattedMonth = (date.getMonth() + 1).toString().padStart(2, "0");
  const formattedYear = date.getFullYear();
  return `${formattedDay}-${formattedMonth}-${formattedYear}`;
}

async function sendTransactionToServer(type, title, tag, date, amount) {
  try {
    const formattedDate = formatDate(date);
    const response = await fetch("/add_transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
        title,
        tag,
        date: formattedDate,
        amount,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add transaction");
    }

    const data = await response.json();
    console.log(data);
    document.getElementById("transaction-form").reset();
    fetchSummary(formattedDate.split("-")[1], formattedDate.split("-")[2]);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function fetchSummary(month, year) {
  try {
    const url = `/summary?month=${month}&year=${year}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch summary");
    }

    const data = await response.json();
    renderTransactionHistory(data);
    const balance_remaining = document.getElementById("balance-remaining");
    const spending_rate = document.getElementById("spending-rate");
    const monthly_budget = document.getElementById("monthly-budget");

    balance_remaining.innerHTML = `₹${data.Balance_Remaining.toFixed(2)}`;
    spending_rate.innerHTML = `Spending Rate: ${data.Spending_Rate.toFixed(
      2
    )}%`;
    monthly_budget.innerHTML = `Monthly Budget: ₹${data.Budget.toFixed(2)}`;

    const balanceSection = document.getElementById("balance");
    balanceSection.classList.toggle(
      "income-bg",
      data.Within_Budget || data.Balance_Remaining > 0
    );
    balanceSection.classList.toggle(
      "expense-bg",
      !data.Within_Budget || data.Balance_Remaining <= 0
    );

    const summaryDateInput = document.getElementById("summary-date");
    summaryDateInput.value = `${year}-${month}`;
  } catch (error) {
    console.error("Error:", error.message);
    const summaryResult = document.getElementById("summary-content");
    summaryResult.innerHTML =
      "<center>Failed to fetch summary. Please try again.</center>";
  }
}

function createTransactionListItem(expense) {
  const {
    Date: date,
    Type: type,
    Title: title,
    Tag: tag,
    Amount: amount,
  } = expense;
  const formattedDate = date;
  const sign = type === "Income" ? "+" : "-";
  const bgColorClass = type === "Income" ? "income-bg" : "expense-bg";

  return `
    <li class="expense-item ${bgColorClass}">
      <span>
        <h4>${title}</h4>
        <p>${tag}</p>
      </span>
      <span class="expense-amount">${sign} ₹${Math.abs(amount).toFixed(2)}
        <p>${formattedDate}</p>
      </span>
    </li>
  `;
}

function renderTransactionHistory(data) {
  const summaryResult = document.getElementById("summary-content");
  if (data && data.Transaction_History && data.Transaction_History.length > 0) {
    summaryResult.innerHTML = `<ul>${data.Transaction_History.map(
      createTransactionListItem
    ).join("")}</ul>`;
  } else {
    summaryResult.innerHTML =
      "<center>No transactions found for this month</center>";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const summaryForm = document.getElementById("summary-form");
  const summaryDate = document.getElementById("summary-date");
  const transactionForm = document.getElementById("transaction-form");

  const currentDate = new Date();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const currentYear = currentDate.getFullYear().toString();

  summaryForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const [year, month] = summaryDate.value.split("-");
    fetchSummary(month, year);
  });

  transactionForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const type = document.getElementById("type").value;
    const title = document.getElementById("title").value;
    const tag = document.getElementById("tag").value;
    const date = document.getElementById("date").value;
    const amount = document.getElementById("amount").value;

    if (!type || !title || !tag || !date || !amount) {
      console.log("Please fill in all required fields.");
    } else {
      sendTransactionToServer(type, title, tag, date, amount);
    }
  });

  fetchSummary(currentMonth, currentYear);
});
