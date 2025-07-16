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
      <div className="min-h-screen flex items-center justify-center p-4 ">
        <div className="w-full max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="bg-white border transition-all duration-500 ease-out border-gray-300 rounded-lg p-6 shadow-md max-w-md mx-auto animate-[slideIn_0.5s_forwards]">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="mb-8">
                  <h1 className="text-3xl font-semibold text-gray-900">
                    Create Account
                  </h1>
                  <p className="text-gray-600 mt-4 text-[15px] leading-relaxed">
                    Join our community and unlock exclusive features.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      name="name"
                      type="text"
                      className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-3 pl-4 pr-10 outline-blue-600"
                      placeholder="Enter your full name"
                      value={signUpInfo.name}
                      onChange={handleSignUp}
                    />
                    <svg
                      className="w-[18px] h-[18px] absolute right-4 top-1/2 transform -translate-y-1/2"
                      fill="#bbb"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 7.001c0 3.865-3.134 7-7 7s-7-3.135-7-7c0-3.867 3.134-7.001 7-7.001s7 3.134 7 7.001zm-1.598 7.18c-1.506 1.137-3.374 1.82-5.402 1.82-2.03 0-3.899-.685-5.407-1.822-4.072 1.793-6.593 7.376-6.593 9.821h24c0-2.423-2.6-8.006-6.598-9.819z" />
                    </svg>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      name="email"
                      type="email"
                      className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-3 pl-4 pr-10 outline-blue-600"
                      placeholder="Enter your email"
                      value={signUpInfo.email}
                      onChange={handleSignUp}
                    />
                    <svg
                      className="w-[18px] h-[18px] absolute right-4 top-1/2 transform -translate-y-1/2"
                      fill="#bbb"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type="password"
                      className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-3 pl-4 pr-10 outline-blue-600"
                      placeholder="Create password"
                      value={signUpInfo.password}
                      onChange={handleSignUp}
                    />
                    <svg
                      className="w-[18px] h-[18px] absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                      fill="#bbb"
                      viewBox="0 0 128 128"
                    >
                      <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" />
                    </svg>
                  </div>
                </div>

                <div className="!mt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? "Signing Up..." : "Sign Up"}
                  </button>
                  <p className="text-sm !mt-6 text-center text-gray-600">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-blue-600 font-medium hover:underline ml-1 whitespace-nowrap"
                    >
                      Login here
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            <div className="max-lg:mt-8">
              <img
                src="https://res.cloudinary.com/dgechlqls/image/upload/v1752122841/ljw2h2j8pqcthyhk414w.jpg"
                className="w-full aspect-[71/50] max-lg:w-4/5 mx-auto block object-cover rounded-lg"
                alt="Signup illustration"
              />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Signup;
