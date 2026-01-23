"use client"

import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState, Suspense } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion"

import { LuSave } from "react-icons/lu";
import EventDetails from "./EventDetails";
import AboutEvent from "./AboutEvent";
import Tickets from "./Tickets";
import Contact from "./Contact";
import Lineup from "./Lineup";
import { useRouter, useSearchParams } from "next/navigation";
import { useSingleEventStore } from "@/store/events/SingleEvent";
import { useLoadingStore } from "@/store/LoadingState";

function CreateEventContent() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id') ?? "";
  const { event, isLoading, error, fetchEvent, clearError } = useSingleEventStore();
  const {startLoading, stopLoading} = useLoadingStore()

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

  useEffect(() => {
    if(eventId){
      startLoading()
      fetchEvent(eventId).finally(() => {
        stopLoading()
      });
    }
  }, [eventId]);
  

  return (
    <DashboardLayout>
      {/* Heading */}
      <section className="flex flex-col lg:flex-row justify-between gap-4 sm:gap-0">
        <div className="flex gap-4 sm:gap-6 items-center">
          {/* Back arrow icon */}
          <div onClick={() => router.back()} className="cursor-pointer">
            <FaArrowLeftLong className="text-lg sm:text-xl" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold">Create New Event</h2>
            <p className="text-xs sm:text-sm mt-1 text-[#b3b3b3]">Set up your event details</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 sm:gap-4">
         
          <button onClick={() => router.back()} className="text-white hover:bg-gray-600 rounded-full py-2 px-6 w-full lg:w-fit font-semibold cursor-pointer text-sm sm:text-base">Cancel</button>
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

export default function CreateEvent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateEventContent />
    </Suspense>
  )
}