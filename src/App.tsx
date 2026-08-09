import { BrowserRouter, Routes, Route } from "react-router-dom"
import ScrollToTop from "./components/ScrollToTop"
import Home from "./pages/Home"
import Workshops from "./pages/Workshops"
import WorkshopDetail from "./pages/WorkshopDetail"
import Book from "./pages/Book"
import BookingOctCamp from "./pages/BookingOctCamp"
import HolidayCamps from "./pages/HolidayCamps"
import About from "./pages/About"
import Contact from "./pages/Contact"
import ChildSafetyPolicy from "./pages/ChildSafetyPolicy"
import NotFound from "./pages/NotFound"
import { SHOW_OCT_2026_CAMP } from "./content/featureFlags"

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workshops" element={<Workshops />} />
          <Route path="/workshops/:slug" element={<WorkshopDetail />} />
          <Route path="/book" element={<Book />} />
          {/* October 2026 camp is paused — see SHOW_OCT_2026_CAMP in
              content/featureFlags.ts. Flip it to `true` to restore this
              route (and the /holiday-camps route below) without touching
              any other code. */}
          {SHOW_OCT_2026_CAMP && (
            <Route path="/booking-oct-camp" element={<BookingOctCamp />} />
          )}
          {/* Standalone flyer/QR-code landing page — not linked from primary nav. */}
          {SHOW_OCT_2026_CAMP && (
            <Route path="/holiday-camps" element={<HolidayCamps />} />
          )}
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
