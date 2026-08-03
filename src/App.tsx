import { BrowserRouter, Routes, Route } from "react-router-dom"
import ScrollToTop from "./components/ScrollToTop"
import Home from "./pages/Home"
import Workshops from "./pages/Workshops"
import WorkshopDetail from "./pages/WorkshopDetail"
import BookingSepCamp from "./pages/BookingSepCamp"
import BookingOctCamp from "./pages/BookingOctCamp"
import HolidayCamps from "./pages/HolidayCamps"
import MusicianIntake from "./pages/MusicianIntake"
import About from "./pages/About"
import Contact from "./pages/Contact"
import ChildSafetyPolicy from "./pages/ChildSafetyPolicy"
import NotFound from "./pages/NotFound"

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workshops" element={<Workshops />} />
          <Route path="/workshops/:slug" element={<WorkshopDetail />} />
          <Route path="/booking-sep-camp" element={<BookingSepCamp />} />
          <Route path="/booking-oct-camp" element={<BookingOctCamp />} />
          {/* Standalone flyer/QR-code landing page — not linked from primary nav. */}
          <Route path="/holiday-camps" element={<HolidayCamps />} />
          {/* Not linked in nav — reached via the Stripe payment redirect. See BookingSepCamp.tsx. */}
          <Route path="/musician-intake" element={<MusicianIntake />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/child-safety-policy" element={<ChildSafetyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
