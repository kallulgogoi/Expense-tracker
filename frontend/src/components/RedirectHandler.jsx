import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
function RedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/verify`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        // Only redirect from auth pages if logged in
        if (
          data.success &&
          ["/login", "/signup", "/"].includes(location.pathname)
        ) {
          navigate("/home");
        }
        setInitialCheckDone(true);
      } catch (err) {
        console.error("Auth check failed:", err);
        setInitialCheckDone(true);
      }
    };

    // Only run check if on auth-related pages
    if (["/login", "/signup", "/"].includes(location.pathname)) {
      checkAuth();
    } else {
      setInitialCheckDone(true);
    }
  }, [navigate, location.pathname]);

  return initialCheckDone ? null : <div>Checking authentication...</div>;
}

export default RedirectHandler;
