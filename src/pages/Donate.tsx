import Navbar from "@/components/Navbar"
import Donate from "@/components/Donate"
import Footer from "@/components/Footer"
import CallToJoin from "@/components/call-to-join"

const DonatePage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <Donate />
      </div>
      <CallToJoin />
      <Footer />
    </div>
  )
}

export default DonatePage
