import Hero from "../components/Hero"
import AudienceSplit from "../components/AudienceSplit"
import IntroSection from "../components/IntroSection"
import UpcomingWorkshop from "../components/UpcomingWorkshop"
import Programs from "../components/Programs"
import SafetyFirst from "../components/SafetyFirst"
import Facilitator from "../components/Facilitator"
import GetInvolvedForm from "../components/GetInvolvedForm"
import StayInLoop from "../components/StayInLoop"
import Footer from "../components/Footer"

// WhyWeExist (loneliness stat, values list, "not a professional therapy
// practice" line) is deliberately not rendered here — the design brief
// moves it off the homepage scroll path verbatim onto the future For
// Parents page. The component itself is untouched so that page can reuse
// it; HolidayCamps.tsx also still renders it directly.
export default function Home() {
  return (
    <>
      <Hero />
      <AudienceSplit />
      <IntroSection />
      <UpcomingWorkshop />
      <Programs />
      <SafetyFirst />
      <Facilitator />
      <GetInvolvedForm />
      <StayInLoop source="stay-in-loop-block" />
      <Footer />
    </>
  )
}
