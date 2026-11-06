import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import Location from "./pages/Location.jsx";
import Reviews from "./pages/Reviews.jsx";
import NotFound from "./pages/NotFound.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminMenu from "./pages/admin/AdminMenu.jsx";
import AdminReviews from "./pages/admin/AdminReviews.jsx";
import AdminSettings from "./pages/admin/AdminSettings.jsx";
import AdminQr from "./pages/admin/AdminQr.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import RequireAdmin from "./components/admin/RequireAdmin.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/location" element={<Location />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin: public navbar nahi, aur website par iska koi link nahi */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
        <Route index element={<AdminMenu />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="qr" element={<AdminQr />} />
      </Route>
    </Routes>
  );
}