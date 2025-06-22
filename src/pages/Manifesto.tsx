import Navbar from "@/components/Navbar"
import Message from "@/components/Message"
import Footer from "@/components/Footer"
import CallToJoin from "@/components/call-to-join"

const Manifesto = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <Message />
      </div>
      <CallToJoin />
      <Footer />
    </div>
  )
}

export default Manifesto
