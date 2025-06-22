import Navbar from "@/components/Navbar"
import Vision from "@/components/Vision"
import Objectives from "@/components/Objectives"
import Ideology from "@/components/Ideology"
import Footer from "@/components/Footer"
import CallToJoin from "@/components/call-to-join"

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <Vision />
        <Objectives />
        <Ideology />
      </div>
      <CallToJoin />
      <Footer />
    </div>
  )
}

export default About
