import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Workshops from "./pages/Workshops"
import WorkshopDetail from "./pages/WorkshopDetail"
import Booking from "./pages/Booking"
import MusicianIntake from "./pages/MusicianIntake"
import About from "./pages/About"
import Contact from "./pages/Contact"
import ChildSafetyPolicy from "./pages/ChildSafetyPolicy"
import NotFound from "./pages/NotFound"

function App() {
  return (
    <BrowserRouter>
      <div className="overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workshops" element={<Workshops />} />
          <Route path="/workshops/:slug" element={<WorkshopDetail />} />
          <Route path="/booking" element={<Booking />} />
          {/* Not linked in nav — reached via the Stripe payment redirect. See Booking.tsx. */}
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
