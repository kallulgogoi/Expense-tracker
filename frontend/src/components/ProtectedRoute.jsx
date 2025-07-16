// src/components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
function ProtectedRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/verify`, {
          method: "GET",
          credentials: "include", // ✅ send cookies
        });

        const data = await res.json();
        if (data.success) {
          setIsAuth(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading)
    return (
      <div className="min-h-full flex justify-center items-center w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="hs-XqwWvWI-8784d5b1c52hs-XqwWvWI- spinner-2 hs-XqwWvWI-8784d5b1c5hs-XqwWvWI- hs-XqwWvWI-d736ebb7782hs-XqwWvWI- w-10 hs-XqwWvWI-d736ebb778hs-XqwWvWI- hs-XqwWvWI-f5a04ff24f2hs-XqwWvWI- h-10 hs-XqwWvWI-f5a04ff24fhs-XqwWvWI- hs-XqwWvWI-419d0ec1682hs-XqwWvWI- shrink-0 hs-XqwWvWI-419d0ec168hs-XqwWvWI- hs-XqwWvWI-981a9ab78b2hs-XqwWvWI- animate-spin hs-XqwWvWI-981a9ab78bhs-XqwWvWI-"
          viewBox="0 0 256 256"
        >
          <path
            d="M128 63.04c-5.104 0-9.28-4.176-9.28-9.28V16.64c0-5.104 4.176-9.28 9.28-9.28s9.28 4.176 9.28 9.28v37.12c0 5.104-4.176 9.28-9.28 9.28zm52.548 21.692c-2.32 0-4.756-.928-6.612-2.668-3.596-3.596-3.596-9.512 0-13.108l26.216-26.216c3.596-3.596 9.512-3.596 13.108 0s3.596 9.512 0 13.108l-26.216 26.216c-1.856 1.856-4.176 2.668-6.496 2.668zm58.812 52.548h-37.12c-5.104 0-9.28-4.176-9.28-9.28s4.176-9.28 9.28-9.28h37.12c5.104 0 9.28 4.176 9.28 9.28s-4.176 9.28-9.28 9.28zm-32.596 78.764c-2.32 0-4.756-.928-6.612-2.668l-26.216-26.216c-3.596-3.596-3.596-9.512 0-13.108s9.512-3.596 13.108 0l26.216 26.216c3.596 3.596 3.596 9.512 0 13.108-1.74 1.74-4.176 2.668-6.496 2.668zM128 248.64c-5.104 0-9.28-4.176-9.28-9.28v-37.12c0-5.104 4.176-9.28 9.28-9.28s9.28 4.176 9.28 9.28v37.12c0 5.104-4.176 9.28-9.28 9.28zm-78.764-32.596c-2.32 0-4.756-.928-6.612-2.668-3.596-3.596-3.596-9.512 0-13.108l26.216-26.216c3.596-3.596 9.512-3.596 13.108 0s3.596 9.512 0 13.108l-26.216 26.216c-1.74 1.74-4.06 2.668-6.496 2.668zm4.524-78.764H16.64c-5.104 0-9.28-4.176-9.28-9.28s4.176-9.28 9.28-9.28h37.12c5.104 0 9.28 4.176 9.28 9.28s-4.176 9.28-9.28 9.28zm21.692-52.548c-2.32 0-4.756-.928-6.612-2.668l-26.1-26.216c-3.596-3.596-3.596-9.512 0-13.108s9.512-3.596 13.108 0l26.216 26.216c3.596 3.596 3.596 9.512 0 13.108-1.856 1.856-4.176 2.668-6.612 2.668z"
            data-original="#000000"
          ></path>
        </svg>
      </div>
    );

  if (!isAuth) return <Navigate to="/login" />;

  return children;
}

export default ProtectedRoute;
