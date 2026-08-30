import { BrowserRouter, Routes, Route } from "react-router-dom"
import ScrollToTop from "./components/ScrollToTop"
import Home from "./pages/Home"
import Workshops from "./pages/Workshops"
import WorkshopDetail from "./pages/WorkshopDetail"
import Book from "./pages/Book"
import BookingConfirmed from "./pages/BookingConfirmed"
import BookingOctCamp from "./pages/BookingOctCamp"
import HolidayCamps from "./pages/HolidayCamps"
import SchoolHolidayMusicCamp from "./pages/SchoolHolidayMusicCamp"
import ForParents from "./pages/ForParents"
import About from "./pages/About"
import Contact from "./pages/Contact"
import StayInTouch from "./pages/StayInTouch"
import ChildSafetyPolicy from "./pages/ChildSafetyPolicy"
import PhotographyPolicy from "./pages/PhotographyPolicy"
import Privacy from "./pages/Privacy"
import ShootSheet from "./pages/admin/ShootSheet"
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
          <Route path="/book-2026-spring-holidays" element={<Book />} />
          {/* Standalone SEO landing page targeting "school holiday music
              camp" + variations, geo-tagged to Perth — not in primary nav,
              linked from the homepage intro and from search. */}
          <Route path="/school-holiday-music-camp-perth" element={<SchoolHolidayMusicCamp />} />
          <Route path="/booking-confirmed-2026-spring" element={<BookingConfirmed />} />
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
          {/* In-School program: moved out of the Workshops pillar page and
              off the generic /workshops/:slug route onto its own top-level
              URL, reusing WorkshopDetail's rendering against a fixed slug. */}
          <Route path="/for-schools" element={<WorkshopDetail slug="in-school-songwriting" />} />
          <Route path="/for-parents" element={<ForParents />} />
          <Route path="/stay-in-touch" element={<StayInTouch />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/child-safety-policy" element={<ChildSafetyPolicy />} />
          <Route path="/photography-policy" element={<PhotographyPolicy />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/admin/shoot-sheet" element={<ShootSheet />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
