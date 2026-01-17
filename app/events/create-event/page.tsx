"use client"

import { DashboardLayout } from "@/components/DashboardLayout";
import { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion"

import { LuSave } from "react-icons/lu";
import EventDetails from "./EventDetails";
import AboutEvent from "./AboutEvent";
import Tickets from "./Tickets";
import Contact from "./Contact";
import Lineup from "./Lineup";

// export default function CreateEvent() {
//     const [step, setStep] = useState(1);

//     return (
//         <DashboardLayout>
//             {/* Heading */}
//             <section className="flex justify-between">
//                 <div className="flex gap-6 items-center">
//                     <FaArrowLeftLong />
//                     <div>
//                         <h2 className="text-2xl font-semibold">Create New Event</h2>
//                         <p className="text-sm mt-1">Set up your event details</p>
//                     </div>
//                 </div>

//                 {/* Buttons */}
//                 <div className="flex items-center gap-4">
//                     <button className="border-2 cursor-pointer flex items-center gap-2 text-[#cca33a] border-[#cca33a] rounded-full py-2 px-6">
//                         <LuSave />
//                         Save Later
//                     </button>
//                     <button className="text-white font-semibold cursor-pointer">Cancel</button>
//                 </div>
//             </section>

//             {/* Tab Section */}
//             <section className="mt-10 flex gap-6 items-center">
//                 <button onClick={() => setStep(1)} className={`text-sm pb-2 cursor-pointer font-semibold ${step === 1 ? "text-[#0854A7] border-b-2 border-[#0854A7]" : "border-0 text-[#b3b3b3]"}`}>Event Details</button>
//                 <button onClick={() => setStep(2)} className={`text-sm pb-2 cursor-pointer font-semibold ${step === 2 ? "text-[#0854A7] border-b-2 border-[#0854A7]" : "border-0 text-[#b3b3b3]"}`}>About</button>
//                 <button onClick={() => setStep(3)} className={`text-sm pb-2 cursor-pointer font-semibold ${step === 3 ? "text-[#0854A7] border-b-2 border-[#0854A7]" : "border-0 text-[#b3b3b3]"}`}>Tickets</button>
//                 <button onClick={() => setStep(4)} className={`text-sm pb-2 cursor-pointer font-semibold ${step === 4 ? "text-[#0854A7] border-b-2 border-[#0854A7]" : "border-0 text-[#b3b3b3]"}`}>Lineup</button>
//                 <button onClick={() => setStep(5)} className={`text-sm pb-2 cursor-pointer font-semibold ${step === 5 ? "text-[#0854A7] border-b-2 border-[#0854A7]" : "border-0 text-[#b3b3b3]"}`}>Contact</button>
//             </section>


//             <div className="mt-3">

//             {step === 1 && <EventDetails />}
//             {step === 2 && <AboutEvent />}
//             {step === 3 && <Tickets />}
//             {step === 4 && <Lineup />}
//             {step === 5 && <Contact />}
//             </div>

//         </DashboardLayout>
//     )
// }

export default function CreateEvent() {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(0)

  const tabs = [
    { id: 1, name: "Event Details", component: <EventDetails step={step} setStep={setStep} /> },
    { id: 2, name: "About", component: <AboutEvent step={step} setStep={setStep} /> },
    { id: 3, name: "Tickets", component: <Tickets step={step} setStep={setStep} /> },
    { id: 4, name: "Lineup", component: <Lineup step={step} setStep={setStep} /> },
    { id: 5, name: "Contact", component: <Contact step={step} setStep={setStep} /> }
  ]

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  const handleTabClick = (id: number) => {
    setDirection(id > step ? 1 : -1)
    setStep(id)
  }

  return (
    <DashboardLayout>
      {/* Heading */}
      <section className="flex justify-between gap-4 sm:gap-0">
        <div className="flex gap-4 sm:gap-6 items-center">
          <FaArrowLeftLong className="text-lg sm:text-xl" />
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold">Create New Event</h2>
            <p className="text-xs sm:text-sm mt-1 text-[#b3b3b3]">Set up your event details</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col lg:flex-row items-center gap-3 sm:gap-4">
          <button className="border-2 cursor-pointer flex items-center gap-2 text-[#cca33a] border-[#cca33a] rounded-full py-2 px-4 sm:px-6 text-sm sm:text-base">
            <LuSave />
            Save Later
          </button>
          <button className="text-white hover:bg-gray-600 rounded-full py-2 px-6 w-full lg:w-fit font-semibold cursor-pointer text-sm sm:text-base">Cancel</button>
        </div>
      </section>

      {/* Tab Section */}
      <section className="mt-8 sm:mt-10 flex gap-4 sm:gap-6 items-center overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`text-sm pb-2 cursor-pointer font-semibold whitespace-nowrap ${
              step === tab.id ? "text-[#0854A7] border-b-2 border-[#0854a7] " : "text-[#b3b3b3]"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </section>

      {/* Content with Slider Animation */}
      <div className="mt-6 sm:mt-8 relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
          >
            {tabs.find(tab => tab.id === step)?.component}
          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}