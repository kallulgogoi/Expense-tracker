import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
            headers,
            credentials: "include",
          }),
          fetch(`${BASE_URL}/api/transaction/get-expenses`, {
            headers,
            credentials: "include",
          }),
        ]);

        if (!incomesRes.ok || !expensesRes.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const incomes = await incomesRes.json();
        const expenses = await expensesRes.json();

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

  const processMonthlyData = () => {
    const monthlyData = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthYear = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          name: new Date(date.getFullYear(), date.getMonth()).toLocaleString(
            "default",
            { month: "short", year: "numeric" }
          ),
          income: 0,
          expense: 0,
        };
      }

      if (transaction.type === "income") {
        monthlyData[monthYear].income += transaction.amount;
      } else {
        monthlyData[monthYear].expense += transaction.amount;
      }
    });

    return Object.values(monthlyData).sort(
      (a, b) => new Date(a.name) - new Date(b.name)
    );
  };

  const processCategoryData = (type) => {
    const categoryMap = {};
    transactions
      .filter((t) => t.type === type)
      .forEach((transaction) => {
        if (!categoryMap[transaction.category]) {
          categoryMap[transaction.category] = 0;
        }
        categoryMap[transaction.category] += Math.abs(transaction.amount);
      });

    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const monthlyData = processMonthlyData();
  const incomeByCategory = processCategoryData("income");
  const expenseByCategory = processCategoryData("expense");

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="min-h-screen bg-gradient-to-b bg-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back to Home */}
        <div className="mb-6">
          <Link
            to="/home"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Home
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Financial Dashboard
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Monthly Income vs Expenses */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md transition-shadow hover:shadow-lg mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Monthly Income vs Expenses
              </h2>
              <div className="h-64 w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#4ade80"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      name="Income"
                    />
                    <Line
                      type="monotone"
                      dataKey="expense"
                      stroke="#f87171"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      name="Expense"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Income & Expense Trend */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-8">
              {/* Income Trend */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md transition-shadow hover:shadow-lg">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Income Trend
                </h2>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip contentStyle={{ borderRadius: 20 }} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#4ade80"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Expense Trend */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md transition-shadow hover:shadow-lg">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Expense Trend
                </h2>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip contentStyle={{ borderRadius: 20 }} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="expense"
                        stroke="#f87171"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Pie Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
              {/* Income by Category */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md transition-shadow hover:shadow-lg">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Income by Category
                </h2>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={incomeByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {incomeByCategory.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Expenses by Category */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md transition-shadow hover:shadow-lg">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Expenses by Category
                </h2>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {expenseByCategory.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
