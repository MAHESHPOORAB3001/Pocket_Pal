import os
import csv
from datetime import datetime
import calendar

TRANSACTIONS_FILE_PATH = os.getcwd() + "/backend/transactions.csv"


class ExpenseTracker:
    def __init__(self, file_path=TRANSACTIONS_FILE_PATH):
        self.transactions = []
        self._load_transactions(file_path)

    def _load_transactions(self, file_path):
        with open(file_path) as transactions_file:
            reader = csv.DictReader(transactions_file)
            self.transactions = list(reader)

    def _save_transactions(self, file_path=TRANSACTIONS_FILE_PATH):
        with open(file_path, "w", newline="") as transactions_file:
            fieldnames = ["Type", "Title", "Tag", "Date", "Amount"]
            writer = csv.DictWriter(transactions_file, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(self.transactions)

    def add_transaction(self, transaction_type, title, tag, date, amount):
        formatted_date = datetime.strptime(date, "%d-%m-%Y").strftime("%d-%m-%Y")
        new_transaction = {
            "Type": transaction_type,
            "Title": title,
            "Tag": tag,
            "Date": formatted_date,
            "Amount": amount,
        }

        if transaction_type == "Budget":
            budget_month_year = datetime.strptime(formatted_date, "%d-%m-%Y").strftime(
                "%m-%Y"
            )
            for transaction in self.transactions:
                if transaction["Type"] == "Budget":
                    current_month_year = datetime.strptime(
                        transaction["Date"], "%d-%m-%Y"
                    ).strftime("%m-%Y")
                    if current_month_year == budget_month_year:
                        transaction["Date"] = new_transaction["Date"]
                        transaction["Amount"] = new_transaction["Amount"]
                        break
            else:
                self.transactions.append(new_transaction)
        else:
            self.transactions.append(new_transaction)

        self._save_transactions()

    def get_summary(self, month, year):
        summary_info = {
            "Income": 0,
            "Expense": 0,
            "Budget": 0,
            "Spending_Rate": 0,
            "Within_Budget": True,
            "Balance_Remaining": 0,
            "Transaction_History": [],
        }

        filtered_transactions = []

        for transaction in self.transactions:
            amount = float(transaction["Amount"])
            transaction_date = datetime.strptime(transaction["Date"], "%d-%m-%Y")
            transaction_month = transaction_date.month
            transaction_year = transaction_date.year

            if int(month) == transaction_month and int(year) == transaction_year:
                summary_info[transaction["Type"]] += amount
                if transaction["Type"] == "Income" or transaction["Type"] == "Expense":
                    filtered_transactions.append(transaction)

        sorted_transactions = sorted(
            filtered_transactions,
            key=lambda x: datetime.strptime(x["Date"], "%d-%m-%Y"),
            reverse=True,
        )
        summary_info["Transaction_History"] = sorted_transactions

        if summary_info["Budget"] > 0:
            days_in_month = calendar.monthrange(int(year), int(month))[1]
            total_days_spending = summary_info["Expense"] / days_in_month
            monthly_budget_spending_rate = summary_info["Budget"] / days_in_month
            spending_rate = (total_days_spending / monthly_budget_spending_rate) * 100
            within_budget = total_days_spending <= monthly_budget_spending_rate
            summary_info["Spending_Rate"] = spending_rate
            summary_info["Within_Budget"] = within_budget

        balance_remaining = summary_info["Income"] - summary_info["Expense"]
        summary_info["Balance_Remaining"] = balance_remaining

        return summary_info


if __name__ == "__main__":
    expense_tracker = ExpenseTracker()
