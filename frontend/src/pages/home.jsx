import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { MdCurrencyRupee } from "react-icons/md";
import Footer from "../components/Footer";
import { FiFileText } from "react-icons/fi";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { handleError, handleSuccess } from "../utils";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "../components/Navbar";
import TransactionList from "../components/TransactionList";

//
const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const Home = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "",
    description: "",
  });
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        const headers = {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        };

        const [incomesRes, expensesRes] = await Promise.all([
          fetch(`${BASE_URL}/api/transaction/get-incomes`, {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }),
          fetch(`${BASE_URL}/api/transaction/get-expenses`, {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }),
        ]);

        if (!incomesRes.ok || !expensesRes.ok) {
          throw new Error(
            incomesRes.statusText ||
              expensesRes.statusText ||
              "Failed to fetch transactions"
          );
        }

        const incomes = await incomesRes.json();
        const expenses = await expensesRes.json();

        // Add type to each transaction
        const incomeTransactions = incomes.map((income) => ({
          ...income,
          type: "income",
        }));
        const expenseTransactions = expenses.map((expense) => ({
          ...expense,
          type: "expense",
        }));

        setTransactions([...incomeTransactions, ...expenseTransactions]);
      } catch (err) {
        setError(err.message);
        toast.error(err.message || "Failed to load transactions");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
      const endpoint =
        formData.type === "income"
          ? `${BASE_URL}/api/transaction/add-incomes`
          : `${BASE_URL}/api/transaction/add-expenses`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify({
          title: formData.title,
          amount: Number(formData.amount),
          category: formData.category,
          description: formData.description,
          date: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to add transaction");
      }

      const newTransaction = await response.json();
      setTransactions([
        ...transactions,
        {
          ...newTransaction,
          type: formData.type,
          amount:
            formData.type === "income"
              ? newTransaction.amount
              : -Math.abs(newTransaction.amount),
        },
      ]);

      // Reset form
      setFormData({
        title: "",
        amount: "",
        type: "expense",
        category: "",
        description: "",
      });

      handleSuccess("Transaction added successfully!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions
    .filter((transaction) => {
      const matchesFilter = filter === "all" || transaction.type === filter;
      const matchesSearch =
        transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.description &&
          transaction.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));
      const matchesDate =
        (!startDate || new Date(transaction.date) >= startDate) &&
        (!endDate || new Date(transaction.date) <= endDate);
      return matchesFilter && matchesSearch && matchesDate;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  const deleteTransaction = async (id, type) => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
      const endpoint =
        type === "income"
          ? `${BASE_URL}/api/transaction/delete-incomes/${id}`
          : `${BASE_URL}/api/transaction/delete-expenses/${id}`;

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete transaction");
      }

      setTransactions(transactions.filter((t) => t._id !== id));
      handleSuccess("Transaction deleted successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);

        handleSuccess("Logout Successfully");
      } else {
        throw new Error("Logout failed");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Categories with icons and colors
  const categories = {
    Food: { icon: "🍔", color: "bg-orange-100 text-orange-800" },
    Transportation: { icon: "🚗", color: "bg-blue-100 text-blue-800" },
    Housing: { icon: "🏠", color: "bg-purple-100 text-purple-800" },
    Entertainment: { icon: "🎬", color: "bg-pink-100 text-pink-800" },
    Salary: { icon: "💰", color: "bg-green-100 text-green-800" },
    Freelance: { icon: "💻", color: "bg-indigo-100 text-indigo-800" },
    Other: { icon: "🔮", color: "bg-gray-100 text-gray-800" },
  };

  return (
    <div className="min-h-screen  bg-blue-100">
      {/* Navigation */}
      <Navbar handleLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Balance Card */}

        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* Balance Section */}
              <div className="flex-1">
                <p className="text-sm font-medium opacity-80 mb-1">
                  Current Balance
                </p>
                <p className="text-3xl md:text-4xl  font-bold">
                  ₹
                  {balance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              {/* Income/Expense Breakdown - Stack on mobile, row on desktop */}
              <div className="w-full md:w-auto">
                <div className="grid grid-cols-2 gap-4 md:flex md:space-x-6">
                  {/* Income */}
                  <div className="bg-white bg-opacity-10 p-3 rounded-lg backdrop-blur-sm">
                    <p className=" opacity-100 text-black mb-1">Income</p>
                    <p className="text-lg text-green-800 font-semibold">
                      <FaArrowUp className="inline mr-1 text-green-800" />₹
                      {totalIncome.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>

                  {/* Expenses */}
                  <div className="bg-white bg-opacity-10 p-3 rounded-lg backdrop-blur-sm">
                    <p className="text-black opacity-100 mb-1">Expenses</p>
                    <p className="text-lg text-red-800 font-semibold">
                      <FaArrowDown className="inline mr-1 text-red-800" />₹
                      {totalExpenses.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Add Transaction Form - Left Side */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:sticky lg:top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                Add New Transaction
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Grocery shopping"
                  />
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Amount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdCurrencyRupee className="text-gray-500" />
                    </div>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      required
                      min="0"
                      step="0.01"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${
                        formData.type === "expense"
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value="expense"
                        checked={formData.type === "expense"}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <span
                        className={`font-medium ${
                          formData.type === "expense"
                            ? "text-red-700"
                            : "text-gray-700"
                        }`}
                      >
                        Expense
                      </span>
                    </label>
                    <label
                      className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${
                        formData.type === "income"
                          ? "border-green-300 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value="income"
                        checked={formData.type === "income"}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <span
                        className={`font-medium ${
                          formData.type === "income"
                            ? "text-green-700"
                            : "text-gray-700"
                        }`}
                      >
                        Income
                      </span>
                    </label>
                  </div>
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a category</option>
                    {Object.keys(categories).map((cat) => (
                      <option key={cat} value={cat}>
                        {categories[cat].icon} {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Description (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                      <FiFileText className="text-gray-400" />
                    </div>
                    <textarea
                      id="description"
                      name="description"
                      rows="3"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Add any additional details..."
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Add Transaction"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Transactions List - Right Side */}
          <div className="lg:w-2/3">
            <TransactionList
              transactions={filteredTransactions}
              deleteTransaction={deleteTransaction}
              categories={categories}
              filter={filter}
              setFilter={setFilter}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              dateRange={dateRange}
              setDateRange={setDateRange}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Home;
