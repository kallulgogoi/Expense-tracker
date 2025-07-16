import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import { handleError, handleSuccess } from "../utils";
const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

function Signup() {
  const [signUpInfo, setSignUpInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    const { name, value } = e.target;
    setSignUpInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = signUpInfo;

    if (!name || !email || !password) {
      return handleError("All fields are required");
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(signUpInfo),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Signup failed");
      }

      if (result.success) {
        handleSuccess(result.message || "Signup successful!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        handleError(result.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      handleError(err.message || "Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg max-w-md mx-auto animate-[slideIn_0.5s_forwards]">
              <div className="flex items-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h1 className="text-2xl font-bold text-gray-800 ml-2">
                  ExpenseTracker
                </h1>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">
                    Create Your Account
                  </h1>
                  <p className="text-gray-600 mt-2 text-sm">
                    Start tracking your expenses today
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      name="name"
                      type="text"
                      className="w-full text-sm text-gray-700 border border-gray-300 rounded-lg p-3 pl-4 pr-10 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      placeholder="Enter your full name"
                      value={signUpInfo.name}
                      onChange={handleSignUp}
                    />
                    <svg
                      className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      name="email"
                      type="email"
                      className="w-full text-sm text-gray-700 border border-gray-300 rounded-lg p-3 pl-4 pr-10 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      placeholder="Enter your email"
                      value={signUpInfo.email}
                      onChange={handleSignUp}
                    />
                    <svg
                      className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type="password"
                      className="w-full text-sm text-gray-700 border border-gray-300 rounded-lg p-3 pl-4 pr-10 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      placeholder="Create password"
                      value={signUpInfo.password}
                      onChange={handleSignUp}
                    />
                    <svg
                      className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
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
                        Creating Account...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                  <p className="text-sm mt-4 text-center text-gray-600">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-green-600 font-medium hover:underline hover:text-green-700 ml-1 whitespace-nowrap transition"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            <div className="max-lg:mt-8">
              <img
                src="https://www.lystloc.com/blog/wp-content/uploads/2023/02/How-To-Manage-Field-Employee-Expenses-1.webp"
                className="w-full rounded-xl shadow-lg max-lg:w-4/5 mx-auto block object-cover"
                alt="Expense tracking illustration"
              />
              <div className="mt-4 text-center text-gray-600 text-sm">
                <p>Track every penny, save every dollar.</p>
                <p className="mt-1">Take control of your finances today.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Signup;
