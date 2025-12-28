import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "@/Pages/Home/Page";
import Page404 from "@/Pages/404/Page";
import Auth from "@/Pages/Auth/Page";
import Dashboard from "@/Pages/Dashboard/Page";
import SecurityBackground from "@/components/UIv/Background";
import useStore from "@/store/store";
import { useEffect } from "react";
export default function App() {
  const store = useStore();
  useEffect(() => {
    store.refresh().then().catch();
  }, []);
  console.log(store.user);
  return (
    <>
      <SecurityBackground />
      {store.isHydrated ? (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            {store.user ? (
              <Route path="/dashboard/*" element={<Dashboard />} />
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
        </BrowserRouter>
      ) : null}
    </>
  );
}
