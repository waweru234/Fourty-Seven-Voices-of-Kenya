import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import PartySlogan from "@/components/PartySlogan"
import Footer from "@/components/Footer"
import CallToJoin from "@/components/call-to-join"
const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <Hero />
        <div className="bg-gradient-to-br from-party-lightblue/30 via-white/80 to-party-gold/30">
          <PartySlogan />
        </div>
      </div>
      <CallToJoin />
      <Footer />
    </div>
  )
}

export default Home
