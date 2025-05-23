"use client"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useState } from "react"

interface LeaderProps {
  name: string
  role: string
  image: string
}

const leadershipTeam: LeaderProps[] = [
  {
    name: "Wycliffe Kamanda Gichuru",
    role: "National Chairperson and Party Founder",
    image: "/lovable-uploads/0266e8af-6d34-4c02-8bc3-b5203bc131d5.png",
  },

  {
    name: "Jibril Manyasa",
    role: "Secretary General",
    image: "/lovable-uploads/bf3e08b0-1631-4d2d-8b64-849276bbee0c.png",
  },
     {
    name: "Silvanus Mbugua Gitau. Son of Africa ",
    role: "National Director of Operations & Head of ICT Department",
    image: "/lovable-uploads/silva (1).jpeg",
  },
  {
    name: "Aaron Kibet",
    role: "Chief Head of Protocol",
    image: "/lovable-uploads/e5e25e88-bd79-4dd0-a9e3-53e288db933a.png",
  },
  {
    name: "Evelynn Nzembih Ngui",
    role: "Human Resource Manager",
    image: "/lovable-uploads/d9703b7c-155e-4ecd-9fd5-6e6d13768c60.png",
  },
       {
    name: "Tony Jillo Nkaduda",
    role: "Youth Nest chairperson",
    image: "/lovable-uploads/silva (2).jpeg",
  },
        {
    name: "Mbugua Wanyoike",
    role: "Chief Head of strategies",
    image: "/lovable-uploads/silva (3).jpeg",
  },
  {
    name: "Florence Mathenge",
    role: "Head of Party Communacation",
    image: "/lovable-uploads/b7b95975-2681-472a-bdd8-41d207ae8b81.png",
  },
  {
    name: "Tom Muhanda",
    role: "National Council of Elders (Wisdom Chamber Chairperson)",
    image: "/lovable-uploads/b1cbe2a4-28ab-4a77-91f6-c8fcf29ecdb2.png",
  },
]

const teamImages = [
  {
    src: "/lovable-uploads/party1.jpeg",
    alt: "Party leadership team members in blue shirts and white caps",
    title: "Youth Leadership Team",
    description:
      "Our dedicated youth leaders representing the party's commitment to empowering the next generation of Kenyan leadership. They bring fresh perspectives and innovative ideas to our political movement.",
  },
  {
    src: "/lovable-uploads/party2.jpeg",
    alt: "Larger group of party members in various colored shirts",
    title: "County Representatives",
    description:
      "Our diverse team of county representatives from across Kenya, showcasing the party's commitment to national unity and representation from all 47 counties. Together, we stand for inclusive governance.",
  },
  {
    src: "/lovable-uploads/party3.jpeg",
    alt: "Party members in blue, white and pink shirts with party logo",
    title: "Executive Committee",
    description:
      "The Executive Committee members who guide our party's strategic direction and policy implementation. Their combined expertise ensures we remain focused on our mission to serve all Kenyans.",
  },
  {
    src: "/lovable-uploads/party4.jpeg",
    alt: "Party leadership team in formal attire",
    title: "Strategic Advisory Team",
    description:
      "Our Strategic Advisory Team brings together professionals from diverse backgrounds to provide expert guidance on policy development, community engagement, and organizational growth.",
  },
]

const Leadership = () => {
  const [activeImage, setActiveImage] = useState<number | null>(null)

  return (
    <section id="leadership" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
          >
            Our Leadership
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-1 w-32 bg-party-gold mx-auto mb-8"
          ></motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-600 max-w-3xl mx-auto text-lg"
          >
            Meet the dedicated team behind Forty Seven Voices of Kenya Party - committed to serving the Kenyan people
            and advancing our shared vision for a prosperous and united nation.
          </motion.p>
        </div>

        {/* Team Images Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
            <span className="relative inline-block">
              Our Teams
              
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {teamImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-xl overflow-hidden shadow-xl"
                onMouseEnter={() => setActiveImage(index)}
                onMouseLeave={() => setActiveImage(null)}
              >
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80"></div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-all duration-500 ease-in-out">
                  <h4 className="text-2xl font-bold mb-2">{image.title}</h4>
                  <p
                    className={`text-sm text-white/90 line-clamp-2 transition-all duration-500 ${activeImage === index ? "line-clamp-none" : ""}`}
                  >
                    {image.description}
                  </p>
                  <div className="h-1 w-16 bg-party-gold mt-4"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
          <span className="relative inline-block">
            Leadership Profiles
           
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {leadershipTeam.map((leader, index) => (
            <motion.div
              key={leader.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="group"
            >
              <Card className="overflow-hidden border-0 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2">
                <div className="h-72 relative overflow-hidden">
                  <img
                    src={leader.image || "/placeholder.svg"}
                    alt={leader.name}
                    className="w-full h-full object-center object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardContent className="p-6 bg-white relative">
                  <div className="absolute -top-6 right-6 w-12 h-12 rounded-full bg-party-gold flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{leader.name}</h3>
                  <p className="text-party-gold font-medium mb-3">{leader.role}</p>
                  <div className="h-1 w-12 bg-gradient-to-r from-party-gold to-party-hotpink"></div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Leadership
