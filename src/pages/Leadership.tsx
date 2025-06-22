import Navbar from "@/components/Navbar"
import Leadership from "@/components/Leadership"
import Footer from "@/components/Footer"
import CallToJoin from "@/components/call-to-join"
const LeadershipPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <Leadership />
      </div>
      <CallToJoin />
      <Footer />
    </div>
  )
}

export default LeadershipPage
