# Expense Tracker

Expense Tracker is a backend module designed to assist in managing finances by tracking income, expenses, and budget allocation.

## Features

- **Record Transactions:** Allows users to record income and expenses with specific details like type, title, tag, date, and amount.
- **Set Budget:** Enables users to set budgets for different time periods.
- **View Transaction Summary:** Provides insights into monthly spending patterns.
- **Export/Import Data:** Allows exporting transaction summaries to CSV files and importing transactions from CSV files.

## Usage

1. Initialize the ExpenseTracker instance:

   ```python
   from expense_tracker import ExpenseTracker

   expense_tracker = ExpenseTracker()
   ```

2. Add transactions:

   ```python
   # Add an expense transaction
   expense_tracker.add_transaction('Expense', 'Groceries', 'Food', '10-12-2023', 50.0)

   # Add an income transaction
   expense_tracker.add_transaction('Income', 'Salary', 'Income', '25-12-2023', 2500.0)

   # Set a budget for a month
   expense_tracker.add_transaction('Budget', 'Monthly Budget', 'General', '01-12-2023', 1000.0)
   ```

3. Retrieve transaction summaries:
   ```python
   summary = expense_tracker.get_summary(month=12, year=2023)
   print(summary)
   ```

## Structure

The module consists of:

- `ExpenseTracker` class: Manages transactions, budget, and provides summary information.
- File handling functions for loading and saving transactions in CSV format.

## File Structure

- **`backend/`**: Contains the backend module files.
  - **`transactions.csv`**: CSV file storing transaction data.

## Dependencies

- `os`
- `csv`
- `datetime`

## License

This project is licensed under the [MIT License](LICENSE).
