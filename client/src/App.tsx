import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "tailwindcss/tailwind.css";
import { Home } from "./pages/home/Home";
import { Main } from "./pages/main/Main";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<Main />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="h-[100vh] select-none flex-col flex items-center justify-center">
              <h1 className="text-2xl">
                <i className="text-blue-200 fa-solid fa-beat">4Q4</i>
              </h1>
              <h2 className="font-semibold text-white mt-3">Page not found!</h2>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}
