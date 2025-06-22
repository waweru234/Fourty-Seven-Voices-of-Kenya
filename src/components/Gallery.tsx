"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ZoomIn, Download, ChevronLeft, ChevronRight, Youtube, Play, Camera, Users, Calendar } from "lucide-react"

const Gallery = () => {
  const [activeTab, setActiveTab] = useState("meetings")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [autoPlay, setAutoPlay] = useState(true)
  const autoPlayInterval = useRef<NodeJS.Timeout | null>(null)
  const carouselApiRef = useRef<any>(null)
  const imagesPerPage = 6

  const images = {
    meetings: [
      {
        src: "/lovable-uploads/aa1e4633-c01b-455c-aca3-ec9041dbe0ae.png",
        description: "Party leaders discussing strategic initiatives during a formal meeting.",
        date: "March 2024",
      },
      {
        src: "/lovable-uploads/a471c6d9-0e06-4a76-bc6d-98e82d58f9c8.png",
        description: "Committee members at the annual party conference reviewing policy documents.",
        date: "February 2024",
      },
      {
        src: "/lovable-uploads/129fc8a3-d480-4909-bf31-28fc98b2c0eb.png",
        description: "Party executive committee addressing key organizational matters.",
        date: "January 2024",
      },
      {
        src: "/lovable-uploads/d443a1c0-1055-48b1-8baa-30d025fbf24b.png",
        description: "Strategy meeting with regional representatives discussing party initiatives.",
        date: "December 2023",
      },
      {
        src: "/lovable-uploads/57e9e7d1-9380-472c-9bd9-d62df27d8018.png",
        description: "Party officials during a planning meeting with administrative staff.",
        date: "November 2023",
      },
      {
        src: "/lovable-uploads/ff8de67a-6067-46cd-b95c-c47e67e2146a.png",
        description: "Delegation meeting with government officials at the Registrar's office.",
        date: "October 2023",
      },
    ],
    fieldwork: [
      {
        src: "/lovable-uploads/dc4c41dd-1199-418e-8999-426c4d88ce89.png",
        description: "Community engagement initiative in rural Kenya supporting local programs.",
        date: "March 2024",
      },
      {
        src: "/lovable-uploads/82e4df3c-cda9-4b63-9038-86adc7e28327.png",
        description: "Community outreach meeting with local leaders discussing regional needs.",
        date: "February 2024",
      },
      {
        src: "/lovable-uploads/342d6a56-76fd-4377-a45b-7f617637f1f8.png",
        description: "Party representatives visiting coastal regions to engage with local communities.",
        date: "January 2024",
      },
      {
        src: "/lovable-uploads/2e965a7a-f02b-4d28-9c32-7f89ec4c0a15.png",
        description: "Members outside the County Assembly of Tana River during official visit.",
        date: "December 2023",
      },
      {
        src: "/lovable-uploads/e75e66f7-22db-4365-9f78-c7f359f05f1b.png",
        description: "Youth engagement program with young leaders from across the country.",
        date: "November 2023",
      },
      {
        src: "/lovable-uploads/8653c7ae-af6b-4643-aae4-e386c8c44154.png",
        description: "Party delegation meeting with professional groups and local businesses.",
        date: "October 2023",
      },
    ],
    events: [
      {
        src: "/lovable-uploads/56701e77-5ba7-4ebd-b3eb-070c763c27af.png",
        description: "Certificate presentation ceremony recognizing community leadership contributions.",
        date: "March 2024",
      },
      {
        src: "/lovable-uploads/39c2690f-bb15-4aa6-815f-c41272c0fc4f.png",
        description: "Party official introducing the party manifesto at public event.",
        date: "February 2024",
      },
      {
        src: "/lovable-uploads/68aebf74-3bff-4a3e-a1ae-b9a11030cc10.png",
        description: "Partnership ceremony between party leadership and community organizations.",
        date: "January 2024",
      },
      {
        src: "/lovable-uploads/9281d5a4-3bf5-4992-bd1d-34944685c54b.png",
        description: "Document presentation ceremony during official party congress.",
        date: "December 2023",
      },
      {
        src: "/lovable-uploads/55adec5f-f3f3-476d-a314-3fb6c94c4c1b.png",
        description: "Party constitution presentation by youth leader at formal gathering.",
        date: "November 2023",
      },
      {
        src: "/lovable-uploads/2549893f-014f-413e-beeb-0b673991cafa.png",
        description: "Engagement with local businesses to discuss economic policies and initiatives.",
        date: "October 2023",
      },
    ],
  }

  const youtubeShorts = [
    { id: "1pp9EvaQHE4?si=D5Eh40NmGPQ3fvDY", title: "Community Outreach Success", views: "2.5K" },
    { id: "pJQctz7Nct0?si=A9H36WfbHKM9MIR5", title: "Interview with Party Leadership", views: "1.8K" },
  ]

  const localVideos = [
    {
      filename: "lovable-uploads/WhatsApp Video 2025-05-11 at 07.58.22.mp4",
      title: "Party Event Highlights",
      description: "Our recent gathering in Nairobi",
      thumbnail: "lovable-uploads/WhatsApp Image 2025-05-10 at 23.23.08.jpeg",
      duration: "3:45",
    },
    {
      filename: "lovable-uploads/WhatsApp Video 2025-05-10 at 20.51.43.mp4",
      title: "Party Merchandise Showcase",
      description: "Official party caps and materials",
      thumbnail: "lovable-uploads/WhatsApp Image 2025-05-10 at 20.51.50 (2).jpeg",
      duration: "2:30",
    },
  ]

  const activeImages = images[activeTab as keyof typeof images]
  const totalPages = Math.ceil(activeImages.length / imagesPerPage)
  const currentImages = activeImages.slice((currentPage - 1) * imagesPerPage, currentPage * imagesPerPage)

  // Auto-scroll functionality
  useEffect(() => {
    const startAutoPlay = () => {
      if (autoPlayInterval.current) clearInterval(autoPlayInterval.current)

      if (autoPlay) {
        autoPlayInterval.current = setInterval(() => {
          setCurrentPage((prev) => {
            if (prev < totalPages) return prev + 1
            return 1
          })
        }, 8000)
      }
    }

    startAutoPlay()
    return () => {
      if (autoPlayInterval.current) clearInterval(autoPlayInterval.current)
    }
  }, [autoPlay, totalPages, activeTab])

  const pauseAutoPlay = () => {
    setAutoPlay(false)
    setTimeout(() => setAutoPlay(true), 15000)
  }

  const openImageViewer = (imageSrc: string) => {
    pauseAutoPlay()
    setSelectedImage(imageSrc)
  }

  const closeImageViewer = () => {
    setSelectedImage(null)
    setAutoPlay(true)
  }

  const tabConfig = {
    meetings: { color: "party-hotpink", icon: Users, label: "Meetings" },
    fieldwork: { color: "party-green", icon: Camera, label: "Fieldwork" },
    events: { color: "party-lightblue", icon: Calendar, label: "Events" },
  }

  return (
    <div id="gallery" className="py-20 bg-gradient-to-br from-white via-gray-50 to-party-lightblue/5">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Party{" "}
            <span className="bg-gradient-to-r from-party-hotpink to-party-gold bg-clip-text text-transparent">
              Gallery
            </span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-party-hotpink to-party-gold mx-auto my-6 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Capturing moments of progress, unity, and dedication across Kenya - witness our journey in building a
            stronger nation
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex rounded-2xl bg-white p-2 shadow-xl border border-gray-100">
            {Object.entries(tabConfig).map(([key, config]) => {
              const IconComponent = config.icon
              return (
                <button
                  key={key}
                  onClick={() => {
                    setActiveTab(key)
                    setCurrentPage(1)
                  }}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl text-lg font-medium transition-all duration-300 ${
                    activeTab === key
                      ? `bg-${config.color} text-white shadow-lg transform scale-105`
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <IconComponent size={20} />
                  {config.label}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Main Image Gallery */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {currentImages.map((image, index) => (
            <motion.div
              key={`${activeTab}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="h-full"
            >
              <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 rounded-2xl overflow-hidden h-full bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-0 h-full flex flex-col">
                  <div className="relative overflow-hidden">
                    <div className="relative group cursor-pointer" onClick={() => openImageViewer(image.src)}>
                      <img
                        src={image.src || "/placeholder.svg"}
                        alt={`Party ${activeTab} ${index + 1}`}
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/90 p-4 rounded-full transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                          <ZoomIn className="text-gray-800" size={24} />
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                        {image.date}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3
                        className={`font-bold text-lg mb-3 text-${tabConfig[activeTab as keyof typeof tabConfig].color}`}
                      >
                        {tabConfig[activeTab as keyof typeof tabConfig].label.slice(0, -1)} Highlight
                      </h3>
                      <p className="text-gray-600 leading-relaxed">{image.description}</p>
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={14} className="mr-1" />
                        {image.date}
                      </div>
                      <button
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-${tabConfig[activeTab as keyof typeof tabConfig].color}/10 text-${tabConfig[activeTab as keyof typeof tabConfig].color} transition-all duration-300 hover:shadow-md`}
                        onClick={(e) => {
                          e.stopPropagation()
                          const link = document.createElement("a")
                          link.href = image.src
                          link.download = `party-${activeTab}-${index}.jpg`
                          document.body.appendChild(link)
                          link.click()
                          document.body.removeChild(link)
                        }}
                      >
                        <Download size={14} />
                        <span className="text-sm font-medium">Download</span>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Auto-scrolling Carousel - Party Photo Stream */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16 bg-gradient-to-r from-gray-50 to-white p-8 rounded-2xl shadow-lg border border-gray-100"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">
            <span className={`text-${tabConfig[activeTab as keyof typeof tabConfig].color}`}>Party Photo Stream</span>
          </h3>

          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${(currentPage - 1) * 100}%)` }}
              onMouseEnter={() => pauseAutoPlay()}
              onMouseLeave={() => setAutoPlay(true)}
            >
              {Array.from({ length: totalPages }, (_, pageIndex) => (
                <div key={pageIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                    {activeImages
                      .slice(pageIndex * imagesPerPage, (pageIndex + 1) * imagesPerPage)
                      .map((image, index) => (
                        <div key={`stream-${pageIndex}-${index}`} className="group">
                          <Card className="overflow-hidden border-none shadow-lg rounded-xl h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="relative group cursor-pointer" onClick={() => openImageViewer(image.src)}>
                              <img
                                src={image.src || "/placeholder.svg"}
                                alt={`Party ${activeTab} stream ${index + 1}`}
                                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="bg-white/70 p-2 rounded-full">
                                  <ZoomIn className="text-gray-800" size={20} />
                                </div>
                              </div>
                              <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                                {image.date}
                              </div>
                            </div>
                            <CardContent className="p-4 bg-gradient-to-b from-white to-gray-50">
                              <p className="text-sm text-gray-600 line-clamp-2">{image.description}</p>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stream Navigation Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => {
                  pauseAutoPlay()
                  setCurrentPage(i + 1)
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentPage === i + 1
                    ? `bg-${tabConfig[activeTab as keyof typeof tabConfig].color} shadow-lg`
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center items-center mt-8 mb-16 space-x-4"
          >
            <button
              onClick={() => {
                pauseAutoPlay()
                setCurrentPage(currentPage > 1 ? currentPage - 1 : totalPages)
              }}
              className="p-3 rounded-full bg-white text-gray-700 hover:bg-party-hotpink hover:text-white border border-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    pauseAutoPlay()
                    setCurrentPage(i + 1)
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentPage === i + 1
                      ? `bg-${tabConfig[activeTab as keyof typeof tabConfig].color} shadow-lg`
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => {
                pauseAutoPlay()
                setCurrentPage(currentPage < totalPages ? currentPage + 1 : 1)
              }}
              className="p-3 rounded-full bg-white text-gray-700 hover:bg-party-hotpink hover:text-white border border-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <ChevronRight size={20} />
            </button>
          </motion.div>
        )}

        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="p-8 md:p-12">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 text-white">
              <span className="text-party-hotpink">Featured</span> <span className="text-party-gold">Videos</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* YouTube Videos */}
              {youtubeShorts.map((video, index) => (
                <div key={`youtube-${index}`} className="group">
                  <div className="bg-gray-800 rounded-2xl p-6 hover:bg-gray-700 transition-all duration-300 border border-gray-700 hover:border-party-gold/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-red-600 rounded-lg">
                          <Youtube size={20} className="text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{video.title}</h4>
                          <p className="text-gray-400 text-sm">{video.views} views</p>
                        </div>
                      </div>
                      <Play
                        size={24}
                        className="text-party-gold group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <a
                      href={`https://www.youtube.com/shorts/${video.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-gradient-to-r from-party-hotpink to-party-gold hover:from-party-gold hover:to-party-hotpink text-white py-3 px-6 rounded-xl text-center font-medium transition-all duration-300 transform hover:scale-105"
                    >
                      Watch on YouTube
                    </a>
                  </div>
                </div>
              ))}

              {/* Local Videos */}
              {localVideos.map((video, index) => (
                <div
                  key={`local-${index}`}
                  className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-party-lightblue/50 transition-all duration-300"
                >
                  <div className="relative aspect-video">
                    <video controls className="w-full h-full object-cover" poster={video.thumbnail}>
                      <source src={video.filename} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-white font-medium mb-2">{video.title}</h4>
                    <p className="text-gray-400 text-sm">{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Image Viewer Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeImageViewer}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Enlarged view"
              className="max-w-full max-h-[90vh] object-contain rounded-2xl"
            />
            <button
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 text-white transition-all duration-300"
              onClick={closeImageViewer}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <a
              href={selectedImage}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 text-white flex items-center space-x-2 transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <Download size={20} />
              <span className="hidden sm:inline">Download</span>
            </a>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Gallery
