// "use client"

// import { DashboardLayout } from "@/components/DashboardLayout";
// import { useEffect, useState, Suspense } from "react";
// import { FaArrowLeftLong } from "react-icons/fa6";
// import { motion, AnimatePresence } from "framer-motion"

// import { LuSave } from "react-icons/lu";
// import EventDetails from "../create-event/EventDetails";
// import AboutEvent from "../create-event/AboutEvent";
// import Tickets from "../create-event/Tickets";
// import Contact from "../create-event/Contact";
// import Lineup from "../create-event/Lineup";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useSingleEventStore } from "@/store/events/SingleEvent";
// import { useLoadingStore } from "@/store/LoadingState";

// function CreateEventContent() {
//   const [step, setStep] = useState(1);
//   const [direction, setDirection] = useState(0);
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const eventId = searchParams.get('id') ?? "";
//   const { event, isLoading, error, fetchEvent, clearError } = useSingleEventStore();
//   const {startLoading, stopLoading} = useLoadingStore()

//   const tabs = [
//     { id: 1, name: "Event Details", component: <EventDetails step={step} setStep={setStep} /> },
//     { id: 2, name: "About", component: <AboutEvent step={step} setStep={setStep} /> },
//     { id: 3, name: "Tickets", component: <Tickets step={step} setStep={setStep} /> },
//     { id: 4, name: "Lineup", component: <Lineup step={step} setStep={setStep} /> },
//     { id: 5, name: "Contact", component: <Contact step={step} setStep={setStep} /> }
//   ]

//   const slideVariants = {
//     enter: (dir: number) => ({
//       x: dir > 0 ? 1000 : -1000,
//       opacity: 0
//     }),
//     center: {
//       x: 0,
//       opacity: 1
//     },
//     exit: (dir: number) => ({
//       x: dir < 0 ? 1000 : -1000,
//       opacity: 0
//     })
//   }

//   const handleTabClick = (id: number) => {
//     setDirection(id > step ? 1 : -1)
//     setStep(id)
//   }

//   useEffect(() => {
//     if(eventId){
//       fetchEvent(eventId);
//     }

//     if(isLoading){
//       startLoading()
//     }else{
//       stopLoading()
//     }
//   }, [eventId, isLoading, fetchEvent, startLoading, stopLoading]);
  

//   return (
//     <DashboardLayout>
//       {/* Heading */}
//       <section className="flex flex-col lg:flex-row justify-between gap-4 sm:gap-0">
//         <div className="flex gap-4 sm:gap-6 items-center">
//           {/* Back arrow icon */}
//           <div onClick={() => router.back()} className="cursor-pointer">
//             <FaArrowLeftLong className="text-lg sm:text-xl" />
//           </div>
//           <div>
//             <h2 className="text-xl sm:text-2xl font-semibold">Create New Event</h2>
//             <p className="text-xs sm:text-sm mt-1 text-[#b3b3b3]">Set up your event details</p>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex items-center gap-3 sm:gap-4">
//           {/* <button className="border-2 cursor-pointer flex items-center gap-2 text-[#cca33a] border-[#cca33a] rounded-full py-2 px-4 sm:px-6 text-sm sm:text-base">
//             <LuSave />
//             Save Later
//           </button> */}
//           <button onClick={() => router.back()} className="text-white hover:bg-gray-600 rounded-full py-2 px-6 w-full lg:w-fit font-semibold cursor-pointer text-sm sm:text-base">Cancel</button>
//         </div>
//       </section>

//       {/* Tab Section */}
//       <section className="mt-8 sm:mt-10 flex gap-4 sm:gap-6 items-center overflow-x-auto">
//         {tabs.map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => handleTabClick(tab.id)}
//             className={`text-sm pb-2 cursor-pointer font-semibold whitespace-nowrap ${
//               step === tab.id ? "text-[#0854A7] border-b-2 border-[#0854a7] " : "text-[#b3b3b3]"
//             }`}
//           >
//             {tab.name}
//           </button>
//         ))}
//       </section>

//       {/* Content with Slider Animation */}
//       <div className="mt-6 sm:mt-8 relative overflow-hidden">
//         <AnimatePresence initial={false} custom={direction} mode="wait">
//           <motion.div
//             key={step}
//             custom={direction}
//             variants={slideVariants}
//             initial="enter"
//             animate="center"
//             exit="exit"
//             transition={{
//               x: { type: "spring", stiffness: 300, damping: 30 },
//               opacity: { duration: 0.2 }
//             }}
//           >
//             {tabs.find(tab => tab.id === step)?.component}
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </DashboardLayout>
//   )
// }

// export default function CreateEvent() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <CreateEventContent />
//     </Suspense>
//   )
// }








// "use client"

// import { DashboardLayout } from "@/components/DashboardLayout";
// import { useEffect, useState, Suspense } from "react";
// import { FaArrowLeftLong } from "react-icons/fa6";
// import { motion, AnimatePresence } from "framer-motion"
// import EventDetails from "../create-event/EventDetails";
// import AboutEvent from "../create-event/AboutEvent";
// import Tickets from "../create-event/Tickets";
// import Contact from "../create-event/Contact";
// import Lineup from "../create-event/Lineup";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useSingleEventStore } from "@/store/events/SingleEvent";
// import { EditEventAction } from "@/app/actions/event";
// import { LuSave } from "react-icons/lu";

// function EditEventContent() {
//   const [step, setStep] = useState(1);
//   const [direction, setDirection] = useState(0);
//   const [isSaving, setIsSaving] = useState(false);
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const eventId = searchParams.get('id') ?? "";
//   const { event, isLoading, error, fetchEvent } = useSingleEventStore();

//   const tabs = [
//     { id: 1, name: "Event Details", component: <EventDetails step={step} setStep={setStep} /> },
//     { id: 2, name: "About", component: <AboutEvent step={step} setStep={setStep} /> },
//     { id: 3, name: "Tickets", component: <Tickets step={step} setStep={setStep} /> },
//     { id: 4, name: "Lineup", component: <Lineup step={step} setStep={setStep} /> },
//     { id: 5, name: "Contact", component: <Contact step={step} setStep={setStep} /> }
//   ]

//   const slideVariants = {
//     enter: (dir: number) => ({
//       x: dir > 0 ? 1000 : -1000,
//       opacity: 0
//     }),
//     center: {
//       x: 0,
//       opacity: 1
//     },
//     exit: (dir: number) => ({
//       x: dir < 0 ? 1000 : -1000,
//       opacity: 0
//     })
//   }

//   const handleTabClick = (id: number) => {
//     setDirection(id > step ? 1 : -1)
//     setStep(id)
//   }

//   useEffect(() => {
//     if(eventId){
//       fetchEvent(eventId);
//     }
//   }, [eventId, fetchEvent]);

//   const handleSaveChanges = async () => {
//     if (!event || !eventId) {
//       // alert("No event data to save");
//       return;
//     }

//     setIsSaving(true);

//     try {
//       const response = await EditEventAction(event, eventId);

//       if ("error" in response) {
//         // alert(response.error || "Failed to update event");
//         alert("Failed to update event")
//         setIsSaving(false);
//         return;
//       }

//       alert("Event updated successfully!");
      
//       // Redirect to events page after successful update
//       setTimeout(() => {
//         router.push("/events");
//       }, 500);
      
//     } catch (error: any) {
//       alert("An error occurred while updating event");
//       setIsSaving(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <DashboardLayout>
//         <div className="flex items-center justify-center h-96">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0854A7] mx-auto"></div>
//             <p className="text-gray-400 mt-4">Loading event details...</p>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   if (error) {
//     return (
//       <DashboardLayout>
//         <div className="flex items-center justify-center h-96">
//           <div className="text-center">
//             <p className="text-red-400 mb-2">Error loading event</p>
//             <p className="text-gray-400 text-sm">{error}</p>
//             <button 
//               onClick={() => router.back()} 
//               className="mt-4 text-[#0854A7] hover:underline"
//             >
//               Go back
//             </button>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   if (!event && !isLoading) {
//     return (
//       <DashboardLayout>
//         <div className="flex items-center justify-center h-96">
//           <div className="text-center">
//             <p className="text-red-400">Event not found</p>
//             <button 
//               onClick={() => router.back()} 
//               className="mt-4 text-[#0854A7] hover:underline"
//             >
//               Go back
//             </button>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }
  

//   return (
//     <DashboardLayout>
//       {/* Heading */}
//       <section className="flex flex-col lg:flex-row justify-between gap-4 sm:gap-0">
//         <div className="flex gap-4 sm:gap-6 items-center">
//           {/* Back arrow icon */}
//           <div onClick={() => router.back()} className="cursor-pointer">
//             <FaArrowLeftLong className="text-lg sm:text-xl" />
//           </div>
//           <div>
//             <h2 className="text-xl sm:text-2xl font-semibold">Edit Event</h2>
//             <p className="text-xs sm:text-sm mt-1 text-[#b3b3b3]">Update your event details</p>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex items-center gap-3 sm:gap-4">
//           {/* <button className="border border-[#CCA33A] px-4 py-2 hover:scale-105 w-full lg:w-fit flex gap-2 justify-center items-center rounded-full text-[#CCA33A]"><LuSave /> Save Changes</button> */}
//           <button 
//             onClick={handleSaveChanges}
//             disabled={isSaving}
//             className="border border-[#CCA33A] px-4 py-2 hover:scale-105 w-full lg:w-fit flex gap-2 justify-center items-center rounded-full text-[#CCA33A] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
//           >
//             {isSaving ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#CCA33A]"></div>
//                 Saving...
//               </>
//             ) : (
//               <>
//                 <LuSave /> Save Changes
//               </>
//             )}
//           </button>
//           <button onClick={() => router.back()} className="text-white hover:bg-gray-600 rounded-full py-2 px-6 w-full lg:w-fit font-semibold cursor-pointer text-sm sm:text-base">Cancel</button>
//         </div>
//       </section>

//       {/* Tab Section */}
//       <section className="mt-8 sm:mt-10 flex gap-4 sm:gap-6 items-center overflow-x-auto">
//         {tabs.map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => handleTabClick(tab.id)}
//             className={`text-sm pb-2 cursor-pointer font-semibold whitespace-nowrap ${
//               step === tab.id ? "text-[#0854A7] border-b-2 border-[#0854a7] " : "text-[#b3b3b3]"
//             }`}
//           >
//             {tab.name}
//           </button>
//         ))}
//       </section>

//       {/* Content with Slider Animation */}
//       <div className="mt-6 sm:mt-8 relative overflow-hidden">
//         <AnimatePresence initial={false} custom={direction} mode="wait">
//           <motion.div
//             key={step}
//             custom={direction}
//             variants={slideVariants}
//             initial="enter"
//             animate="center"
//             exit="exit"
//             transition={{
//               x: { type: "spring", stiffness: 300, damping: 30 },
//               opacity: { duration: 0.2 }
//             }}
//           >
//             {tabs.find(tab => tab.id === step)?.component}
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </DashboardLayout>
//   )
// }

// export default function EditEvent() {
//   return (
//     <Suspense fallback={
//       <DashboardLayout>
//         <div className="flex items-center justify-center h-96">
//           <p className="text-gray-400">Loading...</p>
//         </div>
//       </DashboardLayout>
//     }>
//       <EditEventContent />
//     </Suspense>
//   )
// }



"use client"

import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState, Suspense } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion"
import EventDetails from "../create-event/EventDetails";
import AboutEvent from "../create-event/AboutEvent";
import Tickets from "../create-event/Tickets";
import Contact from "../create-event/Contact";
import Lineup from "../create-event/Lineup";
import { useRouter, useSearchParams } from "next/navigation";
import { useSingleEventStore } from "@/store/events/SingleEvent";
import { LuSave } from "react-icons/lu";
import { EditEventAction } from "@/app/actions/event";
// import { toast } from "sonner";

// Import all the individual stores
import { useEventStore } from "@/store/create-events/EventDetails";

import { useLineupStore } from "@/store/create-events/LineUp";
import { useContactStore } from "@/store/create-events/contact";
import { useAboutEventStore } from "@/store/create-events/AboutEvent";
import { useTicketStore } from "@/store/create-events/Ticket";

function EditEventContent() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id') ?? "";
  const { event, isLoading, error, fetchEvent } = useSingleEventStore();

  // Get all individual stores
  const eventDetailsStore = useEventStore();
  const aboutEventStore = useAboutEventStore();
  const ticketStore = useTicketStore();
  const lineupStore = useLineupStore();
  const contactStore = useContactStore();

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

  // NEW useEffect - populate stores with fetched event data
useEffect(() => {
  if (event && !isLoading) {
    // Populate Event Details Store
    eventDetailsStore.setField('eventType', event.eventDetails.eventType);
    eventDetailsStore.setField('eventTitle', event.eventDetails.eventTitle);
    eventDetailsStore.setField('eventTheme', event.eventDetails.eventTheme);
    eventDetailsStore.setField('supportingText', event.eventDetails.supportingText);
    eventDetailsStore.setField('venue', event.eventDetails.venue);
    eventDetailsStore.setField('fullAddress', event.eventDetails.address || "");
    eventDetailsStore.setField('primaryColor', event.eventDetails.brandColor.primaryColor);
    eventDetailsStore.setField('secondaryColor', event.eventDetails.brandColor.secondaryColor);
    eventDetailsStore.setField('eventVisibility', event.eventDetails.eventVisibility);
    eventDetailsStore.setField('startDateTime', event.eventDetails.startDate);
    eventDetailsStore.setField('endDateTime', event.eventDetails.endDate);
    
    if (event.eventDetails.eventBanner) {
      eventDetailsStore.setField('bannerFile', {
        url: event.eventDetails.eventBanner,
      });
    }

    // Populate About Event Store
    aboutEventStore.setHeading(event.aboutEvent?.heading || "");
    aboutEventStore.setDescription(event.aboutEvent?.description || "");
    
    if (event.aboutEvent?.content && event.aboutEvent.content.length > 0) {
      aboutEventStore.initializeAboutEvent({
        heading: event.aboutEvent.heading,
        description: event.aboutEvent.description,
        sections: event.aboutEvent.content.map((section, index) => ({
          id: Date.now() + index,
          subTitle: section.subTitle,
          content: section.sectionContent,
          image: section.supportingImage ? { url: section.supportingImage } : null,
        }))
      });
    }

    // Populate Ticket Store
    if (event.tickets && event.tickets.length > 0) {
      const mappedTickets = event.tickets.map((ticket, index) => ({
        id: Date.now() + index,
        ticketName: ticket.ticketName,
        price: ticket.price.toString(),
        quantity: ticket.availableQuantity.toString(),
        salesDate: "",
        benefits: ticket.benefits.map((text, benefitIndex) => ({ 
          id: Date.now() + index + benefitIndex,
          text 
        })),
        isExpanded: false,
        status: "Active" as const,
        soldCount: 0,
      }));
      
      ticketStore.initializeTickets(mappedTickets);
    }

    // ✅ FIXED: Only populate lineup if valid artists exist
    if (event.artistLineUp && event.artistLineUp.length > 0) {
      // Check if artists have actual data (not just empty default artist)
      const validArtists = event.artistLineUp.filter(
        artist => artist.artistName && artist.artistName.trim() !== ""
      );
      
      if (validArtists.length > 0) {
        const mappedArtists = validArtists.map((artist, index) => ({
          id: Date.now() + index,
          name: artist.artistName,
          role: artist.artistGenre,
          imageUrl: artist.artistImage || null,
          isHeadliner: artist.headliner,
          instagram: artist.socials?.instgram || "",
          twitter: artist.socials?.twitter || "",
          website: artist.socials?.website || "",
        }));
        
        lineupStore.initializeLineup(mappedArtists);
      }
      // If no valid artists, don't initialize - let the default empty artist remain
    }

    // Populate Contact Store
    if (event.emergencyContact) {
      contactStore.setField('security', event.emergencyContact.security);
      contactStore.setField('medical', event.emergencyContact.medical);
      contactStore.setField('lostFound', event.emergencyContact.lostButFound);
      contactStore.setField('supportingInfo', event.emergencyContact.supportingInfo || "");
    }
  }
}, [event, isLoading]);

// const handleSaveChanges = async () => {
//   if (!event || !eventId) {
//     alert("No event data to save");
//     return;
//   }

//   setIsSaving(true);

//   try {
//     // Build complete event update payload
//     const updatedEvent = {
//       // Only include fields that have actual data
//       ...(eventDetailsStore.eventTitle && {
//         eventDetails: {
//           eventType: eventDetailsStore.eventType || event.eventDetails.eventType,
//           eventTitle: eventDetailsStore.eventTitle,
//           eventTheme: eventDetailsStore.eventTheme || event.eventDetails.eventTheme,
//           supportingText: eventDetailsStore.supportingText || event.eventDetails.supportingText,
//           eventBanner: eventDetailsStore.bannerFile?.url || event.eventDetails.eventBanner || "",
//           startDate: eventDetailsStore.startDateTime || event.eventDetails.startDate,
//           endDate: eventDetailsStore.endDateTime || event.eventDetails.endDate,
//           venue: eventDetailsStore.venue || event.eventDetails.venue,
//           address: eventDetailsStore.fullAddress || event.eventDetails.address,
//           brandColor: {
//             primaryColor: eventDetailsStore.primaryColor || event.eventDetails.brandColor?.primaryColor || "#000000",
//             secondaryColor: eventDetailsStore.secondaryColor || event.eventDetails.brandColor?.secondaryColor || "#FFFFFF",
//           },
//           eventVisibility: eventDetailsStore.eventVisibility || event.eventDetails.eventVisibility,
//         },
//       }),
      
//       ...(aboutEventStore.heading && {
//         aboutEvent: {
//           heading: aboutEventStore.heading,
//           description: aboutEventStore.description || "",
//           content: aboutEventStore.sections.map((section) => ({
//             subTitle: section.subTitle || "",
//             sectionContent: section.content || "",
//             supportingImage: section.image?.url || "",
//           })),
//         },
//       }),
      
//       ...(ticketStore.tickets.length > 0 && {
//         tickets: ticketStore.tickets.map((ticket) => ({
//           ticketName: ticket.ticketName,
//           price: parseFloat(ticket.price) || 0,
//           currency: "NGN",
//           initialQuantity: parseInt(ticket.quantity) || 0,
//           availableQuantity: parseInt(ticket.quantity) || 0,
//           benefits: ticket.benefits.map((b) => b.text).filter(Boolean),
//         })),
//       }),
      
//       ...(lineupStore.artists.length > 0 && {
//         artistLineUp: lineupStore.artists.map((artist) => ({
//           artistImage: artist.imageUrl || "",
//           artistName: artist.name,
//           artistGenre: artist.role || "",
//           headliner: artist.isHeadliner || false,
//           socials: {
//             instgram: artist.instagram || "",
//             twitter: artist.twitter || "",
//             website: artist.website || "",
//           },
//         })),
//       }),
      
//       ...(contactStore.security && {
//         emergencyContact: {
//           security: contactStore.security || "",
//           medical: contactStore.medical || "",
//           lostButFound: contactStore.lostFound || "",
//           supportingInfo: contactStore.supportingInfo || "",
//         },
//       }),
//     };

//     console.log("Saving event data:", updatedEvent);

//     // Check if we have anything to update
//     if (Object.keys(updatedEvent).length === 0) {
//       alert("No changes detected");
//       setIsSaving(false);
//       return;
//     }

//     const response = await EditEventAction(updatedEvent, eventId);

//     if ("error" in response) {
//       alert(response.error || "Failed to update event");
//       setIsSaving(false);
//       return;
//     }

//     alert("Event updated successfully!");
    
//     setTimeout(() => {
//       router.push("/events");
//     }, 500);
    
//   } catch (error: any) {
//     console.error("Caught error:", error);
//     alert(error.message || "An error occurred while updating event");
//     setIsSaving(false);
//   }
// };

const handleSaveChanges = async () => {
  if (!event || !eventId) {
    alert("No event data to save");
    return;
  }

  setIsSaving(true);

  try {
    // Filter out empty/invalid artists
    const validArtists = lineupStore.artists.filter(
      artist => artist.name && artist.name.trim() !== "" && 
                artist.role && artist.role.trim() !== "" &&
                artist.imageUrl && artist.imageUrl.trim() !== ""
    );

    const updatedEvent = {
      eventDetails: {
        eventType: eventDetailsStore.eventType,
        eventTitle: eventDetailsStore.eventTitle,
        eventTheme: eventDetailsStore.eventTheme,
        supportingText: eventDetailsStore.supportingText,
        eventBanner: eventDetailsStore.bannerFile?.url || "",
        startDate: eventDetailsStore.startDateTime || new Date(),
        endDate: eventDetailsStore.endDateTime || new Date(),
        venue: eventDetailsStore.venue,
        address: eventDetailsStore.fullAddress,
        brandColor: {
          primaryColor: eventDetailsStore.primaryColor,
          secondaryColor: eventDetailsStore.secondaryColor,
        },
        eventVisibility: eventDetailsStore.eventVisibility,
      },
      aboutEvent: {
        heading: aboutEventStore.heading,
        description: aboutEventStore.description,
        content: aboutEventStore.sections.map((section) => ({
          subTitle: section.subTitle,
          sectionContent: section.content,
          supportingImage: section.image?.url || "",
        })),
      },
      tickets: ticketStore.tickets.map((ticket) => ({
        ticketName: ticket.ticketName,
        price: parseFloat(ticket.price) || 0,
        currency: "NGN",
        initialQuantity: parseInt(ticket.quantity) || 0,
        availableQuantity: parseInt(ticket.quantity) || 0,
        benefits: ticket.benefits.map((b) => b.text).filter(Boolean),
      })),
      // ✅ Only include valid artists
      artistLineUp: validArtists.map((artist) => ({
        artistImage: artist.imageUrl || "",
        artistName: artist.name,
        artistGenre: artist.role,
        headliner: artist.isHeadliner,
        socials: {
          instgram: artist.instagram,
          twitter: artist.twitter,
          website: artist.website,
        },
      })),
      emergencyContact: {
        security: contactStore.security,
        medical: contactStore.medical,
        lostButFound: contactStore.lostFound,
        supportingInfo: contactStore.supportingInfo,
      },
    };

    console.log("=== SAVING EVENT DATA ===");
    console.log("Valid artists count:", validArtists.length);
    console.log("Artist Lineup:", updatedEvent.artistLineUp);
    console.log("=========================");

    const response = await EditEventAction(updatedEvent, eventId);

    if ("error" in response) {
      console.error("❌ Error response:", response.error);
      alert(response.error || "Failed to update event");
      setIsSaving(false);
      return;
    }

    alert("Event updated successfully!");
    
    setTimeout(() => {
      router.push("/events");
    }, 500);
    
  } catch (error: any) {
    console.error("❌ Caught error:", error);
    alert(error.message || "An error occurred while updating event");
    setIsSaving(false);
  }
};

  useEffect(() => {
    if(eventId){
      fetchEvent(eventId);
    }
  }, [eventId, fetchEvent]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cca33a] mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading event details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-400 mb-2">Error loading event</p>
            <p className="text-gray-400 text-sm">{error}</p>
            <button 
              onClick={() => router.back()} 
              className="mt-4 text-[#0854A7] hover:underline"
            >
              Go back
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!event && !isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-400">Event not found</p>
            <button 
              onClick={() => router.back()} 
              className="mt-4 text-[#0854A7] hover:underline"
            >
              Go back
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  

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
            <h2 className="text-xl sm:text-2xl font-semibold">Edit Event</h2>
            <p className="text-xs sm:text-sm mt-1 text-[#b3b3b3]">Update your event details</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="border border-[#CCA33A] px-4 py-2 hover:scale-105 w-full lg:w-fit flex gap-2 justify-center items-center rounded-full text-[#CCA33A] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#CCA33A]"></div>
                Saving...
              </>
            ) : (
              <>
                <LuSave /> Save Changes
              </>
            )}
          </button>
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

export default function EditEvent() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-400">Loading...</p>
        </div>
      </DashboardLayout>
    }>
      <EditEventContent />
    </Suspense>
  )
}