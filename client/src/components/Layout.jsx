import { Outlet } from "react-router-dom";
import FloatingHelp from "./FloatingHelp.jsx";
import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <FloatingHelp />
      <Footer />
    </div>
  );
}
