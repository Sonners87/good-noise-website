import Hero from "../components/Hero"
import IntroSection from "../components/IntroSection"
import UpcomingWorkshop from "../components/UpcomingWorkshop"
import WhyWeExist from "../components/WhyWeExist"
import Programs from "../components/Programs"
import SafetyFirst from "../components/SafetyFirst"
import Facilitator from "../components/Facilitator"
import GetInvolvedForm from "../components/GetInvolvedForm"
import Footer from "../components/Footer"

export default function Home() {
  return (
    <>
      <Hero />
      <IntroSection />
      <UpcomingWorkshop />
      <WhyWeExist />
      <Programs />
      <SafetyFirst />
      <Facilitator />
      <GetInvolvedForm />
      <Footer />
    </>
  )
}
