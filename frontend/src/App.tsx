import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/Pages/Home/Page";
import Page404 from "@/Pages/404/Page";
import Auth from "@/Pages/Auth/Page";
import SecurityBackground from "@/components/UIv/Background";
export default function App() {
  return (
    <>
      <SecurityBackground />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth Login={true} />} />
          <Route path="/create" element={<Auth Login={false} />} />

          <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
