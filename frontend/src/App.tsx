import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Home from "@/Pages/Home/Page";
import Page404 from "@/Pages/404/Page";
import Auth from "@/Pages/Auth/Page";
import Dashboard from "@/Pages/Dashboard/Page";
import SecurityReport from "@/components/UIv/Rapport";
import SecurityBackground from "@/components/UIv/Background";
import useStore from "@/store/store";
import { useEffect } from "react";

// Create a wrapper component that uses useLocation
function AppContent() {
  const store = useStore();
  const location = useLocation();

  useEffect(() => {
    store.refresh().then().catch();
  }, []);

  console.log(store.user);

  return (
    <>
      {!location.pathname.includes("rapport") && <SecurityBackground />}
      {store.isHydrated ? (
        <Routes>
          <Route path="/" element={<Home />} />
          {store.user ? (
            <>
              <Route
                path="/dashboard/rapport/:id"
                element={<SecurityReport />}
              />
              <Route path="/dashboard/*" element={<Dashboard />} />
            </>
          ) : (
            <Route path="/dashboard/*" element={<Navigate to={"/login"} />} />
          )}
          {!store.user ? (
            <>
              <Route path="/login" element={<Auth Login={true} />} />
              <Route path="/create" element={<Auth Login={false} />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Navigate to="/dashboard" />} />
              <Route path="/create" element={<Navigate to="/dashboard" />} />
            </>
          )}
          <Route path="*" element={<Page404 />} />
        </Routes>
      ) : null}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
