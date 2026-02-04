// "use client";

// import { useState, useEffect } from "react";
// import {
//   IoChevronDown,
//   IoCalendarOutline,
//   IoTimeOutline,
//   IoEyeOffOutline,
// } from "react-icons/io5";
// import { FiArrowRight } from "react-icons/fi";
// import { DayPicker, DateRange } from "react-day-picker";
// import { format } from "date-fns";
// import "react-day-picker/dist/style.css";

// import ImageUpload from "@/components/Image";
// import { useEventStore } from "@/store/create-events/EventDetails";
// import { CreateEventAction, EditEventAction } from "@/app/actions/event";
// import { useRouter, useSearchParams } from "next/navigation";
// import Spinner from "@/components/Spinner";
// import { Event } from "@/types/eventsType";
// import { useSingleEventStore } from "@/store/events/SingleEvent";
// import { useLoadingStore } from "@/store/LoadingState";

// interface StepProps {
//   step: number;
//   setStep: React.Dispatch<React.SetStateAction<number>>;
// }

// interface ValidationErrors {
//   eventType?: string;
//   eventTitle?: string;
//   eventTheme?: string;
//   supportingText?: string;
//   bannerFile?: string;
//   date?: string;
//   startTime?: string;
//   endTime?: string;
//   venue?: string;
//   fullAddress?: string;
// }

// export default function EventDetails({ step, setStep }: StepProps) {
//   const {
//     eventType,
//     eventTitle,
//     eventTheme,
//     supportingText,
//     startDateTime,
//     endDateTime,
//     venue,
//     fullAddress,
//     primaryColor,
//     secondaryColor,
//     eventVisibility,
//     bannerFile,
//     setField,
//     setDateTime,
//     initializeEvent,
//   } = useEventStore();

//   /** Local state */
//   const [range, setRange] = useState<DateRange | undefined>();
//   const [startTime, setStartTime] = useState("");
//   const [endTime, setEndTime] = useState("");
//   const [open, setOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errors, setErrors] = useState<ValidationErrors>({});
//   const [submitError, setSubmitError] = useState<string>("");
//   const [isInitialized, setIsInitialized] = useState(false);
//   const searchParams = useSearchParams();
//   const eventId = searchParams.get('id') ?? "";
//   const router = useRouter();
//   const { event } = useSingleEventStore();
//   const {startLoading, stopLoading} = useLoadingStore()
  
//   /** Initialize form with event data if available */
      
  
//   useEffect(() => {
//     if (event && !isInitialized) {
//       // Initialize the event store
//       initializeEvent({
//         eventType: event.eventDetails.eventType,
//         eventTitle: event.eventDetails.eventTitle,
//         eventTheme: event.eventDetails.eventTheme,
//         supportingText: event.eventDetails.supportingText,
//         startDateTime: new Date(event.eventDetails.startDate),
//         endDateTime: new Date(event.eventDetails.endDate),
//         venue: event.eventDetails.venue,
//         fullAddress: event.eventDetails.address || "",
//         primaryColor: event.eventDetails.brandColor.primaryColor,
//         secondaryColor: event.eventDetails.brandColor.secondaryColor,
//         eventVisibility: event.eventDetails.eventVisibility,
//         bannerFile: event.eventDetails.eventBanner 
//           ? { url: event.eventDetails.eventBanner } 
//           : null,
//       });

//       // Set local date range
//       const start = new Date(event.eventDetails.startDate);
//       const end = new Date(event.eventDetails.endDate);
//       setRange({ from: start, to: end });

//       // Set local time
//       setStartTime(format(start, "HH:mm"));
//       setEndTime(format(end, "HH:mm"));

//       setIsInitialized(true);
//     }
//   }, [event, initializeEvent, isInitialized]);

//   /** Combine date + time → MongoDB Date */
//   const buildDateTime = (date: Date, time: string) => {
//     const [h, m] = time.split(":").map(Number);
//     const d = new Date(date);
//     d.setHours(h || 0, m || 0, 0, 0);
//     return d;
//   };

//   /** Handle date selection */
//   const handleDateSelect = (value?: DateRange) => {
//     setRange(value);
//     // Clear date error when user selects a date
//     if (value?.from) {
//       setErrors(prev => ({ ...prev, date: undefined }));
//     }

//     if (!value?.from) return;

//     const from = value.from;
//     const to = value.to ?? value.from;

//     if (startTime && endTime) {
//       setDateTime(buildDateTime(from, startTime), buildDateTime(to, endTime));
//     }
//   };

//   const formattedDate =
//     range?.from
//       ? range.to
//         ? `${format(range.from, "dd MMM yyyy")} - ${format(
//             range.to,
//             "dd MMM yyyy"
//           )}`
//         : format(range.from, "dd MMM yyyy")
//       : "";

//   /** Validate all required fields */
//   const validateForm = (): boolean => {
//     const newErrors: ValidationErrors = {};

//     // Event Type
//     if (!eventType || eventType.trim() === "") {
//       newErrors.eventType = "Event type is required";
//     }

//     // Event Title
//     if (!eventTitle || eventTitle.trim() === "") {
//       newErrors.eventTitle = "Event title is required";
//     } else if (eventTitle.trim().length < 3) {
//       newErrors.eventTitle = "Event title must be at least 3 characters";
//     }

//     // Event Theme
//     if (!eventTheme || eventTheme.trim() === "") {
//       newErrors.eventTheme = "Event theme is required";
//     }

//     // Supporting Text
//     if (!supportingText || supportingText.trim() === "") {
//       newErrors.supportingText = "Supporting text is required";
//     } else if (supportingText.trim().length < 10) {
//       newErrors.supportingText = "Supporting text must be at least 10 characters";
//     }

//     // Banner Image
//     if (!bannerFile || !bannerFile.url) {
//       newErrors.bannerFile = "Event banner is required";
//     }

//     // Date
//     if (!range?.from) {
//       newErrors.date = "Event date is required";
//     }

//     // Start Time
//     if (!startTime) {
//       newErrors.startTime = "Start time is required";
//     }

//     // End Time
//     if (!endTime) {
//       newErrors.endTime = "End time is required";
//     }

//     // Validate end time is after start time
//     if (startTime && endTime && range?.from) {
//       const start = buildDateTime(range.from, startTime);
//       const end = buildDateTime(range.to ?? range.from, endTime);
      
//       if (end <= start) {
//         newErrors.endTime = "End time must be after start time";
//       }
//     }

//     // Venue
//     if (!venue || venue.trim() === "") {
//       newErrors.venue = "Venue is required";
//     }

//     // Full Address
//     if (!fullAddress || fullAddress.trim() === "") {
//       newErrors.fullAddress = "Full address is required";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   /** Handle form submission */
//   const handleCreateEvent = async () => {
   
//     // Reset previous errors
//     setSubmitError("");

//     // Validate form
//     if (!validateForm()) {
//       setSubmitError("Please fill in all required fields correctly");
//       // Scroll to top to show errors
//       window.scrollTo({ top: 0, behavior: "smooth" });
//       return;
//     }
//      startLoading()
//     setIsSubmitting(true);

//     try {
//       let res;
//       if(eventId.trim()){
//        const data= {
//           stage: step,
//           eventDetails:{
//             eventBanner: bannerFile?.url,
//         eventType: eventType,
//         eventTitle: eventTitle,
//         eventTheme: eventTheme,
//         supportingText: supportingText,
//         startDate: startDateTime,
//         endDate: endDateTime,
//         venue: venue,
//         address: fullAddress,
//         brandColor: {
//           primaryColor: primaryColor,
//           secondaryColor: secondaryColor,
//         },
//         eventVisibility: eventVisibility,
//           }
//         }
//         res = await EditEventAction(data, eventId)
//         stopLoading()
//       }else{
//         res = await CreateEventAction({
//         eventBanner: bannerFile?.url,
//         eventType: eventType,
//         eventTitle: eventTitle,
//         eventTheme: eventTheme,
//         supportingText: supportingText,
//         startDate: startDateTime,
//         endDate: endDateTime,
//         venue: venue,
//         address: fullAddress,
//         brandColor: {
//           primaryColor: primaryColor,
//           secondaryColor: secondaryColor,
//         },
//         eventVisibility: eventVisibility,
//       });
//       }

      

//       if (!res?.success) {
//         setSubmitError(res?.message || "Failed to create event");
//         console.log("message==", res?.message);
//         return;
//       }

//       console.log("res==", res);
//       router.push(`?id=${res?.data?._id}`);
//       setStep(step + 1);
//       stopLoading()
//     } catch (error) {
//       const errorMessage =
//         error instanceof Error ? error.message : "An unexpected error occurred";
//       setSubmitError(errorMessage);
//       console.error("Error creating event:", error);
//     } finally {
//       setIsSubmitting(false);
//       stopLoading()
//     }
//   };

//   /** Clear specific field error when user starts typing */
//   const handleFieldChange = <K extends keyof ValidationErrors>(
//     field: K,
//     value: any
//   ) => {
//     // Type assertion to match store's setField signature
//     setField(field as Parameters<typeof setField>[0], value);
//     // Clear the error for this field
//     setErrors(prev => ({ ...prev, [field]: undefined }));
//   };

  

//   return (
//     <div className="text-white">
//       <h2 className="text-lg sm:text-xl font-semibold mb-6">EVENT DETAILS</h2>

//       {/* Global Error Message */}
//       {submitError && (
//         <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
//           <p className="text-red-500 text-sm">{submitError}</p>
//         </div>
//       )}

//       {/* DETAILS */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <div className="space-y-6">
//           {/* Event Type */}
//           <div>
//             <label className="block text-sm mb-2">
//               Event Type <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <select
//                 value={eventType}
//                 onChange={(e) => handleFieldChange("eventType", e.target.value)}
//                 className={`w-full bg-transparent border rounded-lg px-4 py-3 appearance-none ${
//                   errors.eventType ? "border-red-500" : "border-[#2a2a2a]"
//                 }`}
//               >
//                 <option className="text-black" value="">
//                   Select event type
//                 </option>
//                 <option className="text-black" value="concert">
//                   Concert
//                 </option>
//                 <option className="text-black" value="conference">
//                   Conference
//                 </option>
//                 <option className="text-black" value="workshop">
//                   Workshop
//                 </option>
//                 <option className="text-black" value="festival">
//                   Festival
//                 </option>
//               </select>
//               <IoChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//             </div>
//             {errors.eventType && (
//               <p className="text-red-500 text-xs mt-1">{errors.eventType}</p>
//             )}
//           </div>

//           {/* Event Title */}
//           <div>
//             <label className="block text-sm mb-2">
//               Event Title <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               value={eventTitle}
//               onChange={(e) => handleFieldChange("eventTitle", e.target.value)}
//               placeholder="Event title"
//               className={`w-full bg-transparent border rounded-lg px-4 py-3 ${
//                 errors.eventTitle ? "border-red-500" : "border-[#2a2a2a]"
//               }`}
//             />
//             {errors.eventTitle && (
//               <p className="text-red-500 text-xs mt-1">{errors.eventTitle}</p>
//             )}
//           </div>

//           {/* Theme */}
//           <div>
//             <label className="block text-sm mb-2">
//               Event Theme <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               value={eventTheme}
//               onChange={(e) => handleFieldChange("eventTheme", e.target.value)}
//               placeholder="Event theme"
//               className={`w-full bg-transparent border rounded-lg px-4 py-3 ${
//                 errors.eventTheme ? "border-red-500" : "border-[#2a2a2a]"
//               }`}
//             />
//             {errors.eventTheme && (
//               <p className="text-red-500 text-xs mt-1">{errors.eventTheme}</p>
//             )}
//           </div>

//           {/* Supporting */}
//           <div>
//             <label className="block text-sm mb-2">
//               Supporting Text <span className="text-red-500">*</span>
//             </label>
//             <textarea
//               value={supportingText}
//               onChange={(e) =>
//                 handleFieldChange("supportingText", e.target.value)
//               }
//               rows={4}
//               maxLength={100}
//               placeholder="Enter supporting text..."
//               className={`w-full bg-transparent border rounded-lg px-4 py-3 resize-none ${
//                 errors.supportingText ? "border-red-500" : "border-[#2a2a2a]"
//               }`}
//             />
//             <div className="flex justify-between items-center mt-1">
//               {errors.supportingText && (
//                 <p className="text-red-500 text-xs">{errors.supportingText}</p>
//               )}
//               <p className="text-xs text-gray-500 ml-auto">
//                 {supportingText.length}/100
//               </p>
//             </div>
//           </div>
//         </div>

//         <div>
//           <ImageUpload
//             label="Event Banner"
            
//             onUploadComplete={(image) => {
//               handleFieldChange("bannerFile", image);
//             }}
//             required
//             error={errors.bannerFile}
//             initialImage={bannerFile?.url}
//           />
//         </div>
//       </div>

//       {/* DATE & TIME */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
//         {/* DATE */}
//         <div className="relative">
//           <label className="block text-sm mb-2">
//             Date <span className="text-red-500">*</span>
//           </label>
//           <div
//             onClick={() => setOpen(!open)}
//             className="relative cursor-pointer"
//           >
//             <input
//               readOnly
//               value={formattedDate}
//               placeholder="Select date or range"
//               className={`w-full bg-transparent border rounded-lg px-4 py-3 cursor-pointer ${
//                 errors.date ? "border-red-500" : "border-[#2a2a2a]"
//               }`}
//             />
//             <IoCalendarOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//           </div>
//           {errors.date && (
//             <p className="text-red-500 text-xs mt-1">{errors.date}</p>
//           )}

//           {open && (
//             <div className="absolute z-20 mt-2 bg-[#151515] border border-gray-800 rounded-lg p-3">
//               <DayPicker
//                 mode="range"
//                 selected={range}
//                 onSelect={handleDateSelect}
//                 numberOfMonths={2}
//               />
//             </div>
//           )}
//         </div>

//         {/* START TIME */}
//         <div>
//           <label className="block text-sm mb-2">
//             Start time <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="time"
//             value={startTime}
//             onChange={(e) => {
//               setStartTime(e.target.value);
//               setErrors(prev => ({ ...prev, startTime: undefined }));
//               if (range?.from && endTime) {
//                 setDateTime(
//                   buildDateTime(range.from, e.target.value),
//                   buildDateTime(range.to ?? range.from, endTime)
//                 );
//               }
//             }}
//             className={`w-full bg-transparent border rounded-lg px-4 py-3 ${
//               errors.startTime ? "border-red-500" : "border-[#2a2a2a]"
//             }`}
//           />
//           {errors.startTime && (
//             <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>
//           )}
//         </div>

//         {/* END TIME */}
//         <div>
//           <label className="block text-sm mb-2">
//             End time <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="time"
//             value={endTime}
//             onChange={(e) => {
//               setEndTime(e.target.value);
//               setErrors(prev => ({ ...prev, endTime: undefined }));
//               if (range?.from && startTime) {
//                 setDateTime(
//                   buildDateTime(range.from, startTime),
//                   buildDateTime(range.to ?? range.from, e.target.value)
//                 );
//               }
//             }}
//             className={`w-full bg-transparent border rounded-lg px-4 py-3 ${
//               errors.endTime ? "border-red-500" : "border-[#2a2a2a]"
//             }`}
//           />
//           {errors.endTime && (
//             <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>
//           )}
//         </div>
//       </div>

//       {/* VENUE */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
//         <div>
//           <label className="block text-sm mb-2">
//             Venue <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={venue}
//             onChange={(e) => handleFieldChange("venue", e.target.value)}
//             placeholder="Venue"
//             className={`w-full bg-transparent border rounded-lg px-4 py-3 ${
//               errors.venue ? "border-red-500" : "border-[#2a2a2a]"
//             }`}
//           />
//           {errors.venue && (
//             <p className="text-red-500 text-xs mt-1">{errors.venue}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm mb-2">
//             Full Address <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={fullAddress}
//             onChange={(e) => handleFieldChange("fullAddress", e.target.value)}
//             placeholder="Full address"
//             className={`w-full bg-transparent border rounded-lg px-4 py-3 ${
//               errors.fullAddress ? "border-red-500" : "border-[#2a2a2a]"
//             }`}
//           />
//           {errors.fullAddress && (
//             <p className="text-red-500 text-xs mt-1">{errors.fullAddress}</p>
//           )}
//         </div>
//       </div>

//       {/* BRAND COLOR */}
//       <h2 className="text-lg font-semibold mt-10 mb-6">BRAND COLOR</h2>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//         <div>
//           <label className="block text-sm mb-2">Primary Color</label>
//           <div className="flex gap-3">
//             <input
//               type="color"
//               value={primaryColor}
//               onChange={(e) => setField("primaryColor", e.target.value)}
//               className="w-12 h-12 rounded-lg cursor-pointer"
//             />
//             <input
//               value={primaryColor}
//               onChange={(e) => setField("primaryColor", e.target.value)}
//               className="flex-1 bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 uppercase"
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm mb-2">Secondary Color</label>
//           <div className="flex gap-3">
//             <input
//               type="color"
//               value={secondaryColor}
//               onChange={(e) => setField("secondaryColor", e.target.value)}
//               className="w-12 h-12 rounded-lg cursor-pointer"
//             />
//             <input
//               value={secondaryColor}
//               onChange={(e) => setField("secondaryColor", e.target.value)}
//               className="flex-1 bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 uppercase"
//             />
//           </div>
//         </div>
//       </div>

//       {/* VISIBILITY */}
//       <div className="bg-[#151515] border border-gray-800 rounded-lg p-6 mt-8 flex justify-between items-center">
//         <div className="flex items-center gap-3">
//           <IoEyeOffOutline className="text-xl text-gray-400" />
//           <div>
//             <p className="text-sm font-medium">Event Visibility</p>
//             <p className="text-xs text-gray-500">
//               {eventVisibility ? "Event is public" : "Event is private"}
//             </p>
//           </div>
//         </div>
//         <button
//           type="button"
//           onClick={() => setField("eventVisibility", !eventVisibility)}
//           className={`relative w-14 h-7 rounded-full transition-colors ${
//             eventVisibility ? "bg-[#CCA33A]" : "bg-gray-700"
//           }`}
//         >
//           <span
//             className={`block w-5 h-5 bg-white rounded-full transition-transform ${
//               eventVisibility ? "translate-x-7" : "translate-x-1"
//             }`}
//           />
//         </button>
//       </div>

//       {/* NEXT */}
//       <div className="flex justify-end mt-8">
//         <button
//           onClick={handleCreateEvent}
//           disabled={isSubmitting}
//           className={`px-8 py-3 rounded-full flex items-center gap-2 font-semibold transition-colors ${
//             isSubmitting
//               ? "bg-gray-600 cursor-not-allowed"
//               : "bg-[#CCA33A] hover:bg-[#b8922d]"
//           } text-white`}
//         >
//           {isSubmitting ? (
//             <>
//               <Spinner size="sm" color="border-white" />
//               Creating...
//             </>
//           ) : (
//             <>
//               Proceed <FiArrowRight />
//             </>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import {
  IoChevronDown,
  IoCalendarOutline,
  IoTimeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";
import { FiArrowRight } from "react-icons/fi";
import { DayPicker, DateRange } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";

import ImageUpload from "@/components/Image";
import { useEventStore } from "@/store/create-events/EventDetails";
import { CreateEventAction, EditEventAction } from "@/app/actions/event";
import { useRouter, useSearchParams } from "next/navigation";
import Spinner from "@/components/Spinner";
import { Event } from "@/types/eventsType";
import { useSingleEventStore } from "@/store/events/SingleEvent";
import { useLoadingStore } from "@/store/LoadingState";

interface StepProps {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

interface ValidationErrors {
  eventType?: string;
  eventTitle?: string;
  eventTheme?: string;
  supportingText?: string;
  bannerFile?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  venue?: string;
  fullAddress?: string;
}

export default function EventDetails({ step, setStep }: StepProps) {
  const {
    eventType,
    eventTitle,
    eventTheme,
    supportingText,
    startDateTime,
    endDateTime,
    venue,
    fullAddress,
    primaryColor,
    secondaryColor,
    eventVisibility,
    bannerFile,
    setField,
    setDateTime,
    initializeEvent,
  } = useEventStore();

  /** Local state */
  const [range, setRange] = useState<DateRange | undefined>();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitError, setSubmitError] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id') ?? "";
  const router = useRouter();
  const { event } = useSingleEventStore();
  const {startLoading, stopLoading} = useLoadingStore()
  
  /** Initialize form with event data if available */
      
  
  useEffect(() => {
    if (event && !isInitialized) {
      // Initialize the event store
      initializeEvent({
        eventType: event.eventDetails.eventType,
        eventTitle: event.eventDetails.eventTitle,
        eventTheme: event.eventDetails.eventTheme,
        supportingText: event.eventDetails.supportingText,
        startDateTime: new Date(event.eventDetails.startDate),
        endDateTime: new Date(event.eventDetails.endDate),
        venue: event.eventDetails.venue,
        fullAddress: event.eventDetails.address || "",
        primaryColor: event.eventDetails.brandColor.primaryColor,
        secondaryColor: event.eventDetails.brandColor.secondaryColor,
        eventVisibility: event.eventDetails.eventVisibility,
        bannerFile: event.eventDetails.eventBanner 
          ? { url: event.eventDetails.eventBanner } 
          : null,
      });

      // Set local date range
      const start = new Date(event.eventDetails.startDate);
      const end = new Date(event.eventDetails.endDate);
      setRange({ from: start, to: end });

      // Set local time
      setStartTime(format(start, "HH:mm"));
      setEndTime(format(end, "HH:mm"));

      setIsInitialized(true);
    }
  }, [event, initializeEvent, isInitialized]);

  /** Combine date + time → MongoDB Date */
  const buildDateTime = (date: Date, time: string) => {
    const [h, m] = time.split(":").map(Number);
    const d = new Date(date);
    d.setHours(h || 0, m || 0, 0, 0);
    return d;
  };

  /** Handle date selection */
  const handleDateSelect = (value?: DateRange) => {
    setRange(value);
    // Clear date error when user selects a date
    if (value?.from) {
      setErrors(prev => ({ ...prev, date: undefined }));
    }

    if (!value?.from) return;

    const from = value.from;
    const to = value.to ?? value.from;

    if (startTime && endTime) {
      setDateTime(buildDateTime(from, startTime), buildDateTime(to, endTime));
    }
  };

  const formattedDate =
    range?.from
      ? range.to
        ? `${format(range.from, "dd MMM yyyy")} - ${format(
            range.to,
            "dd MMM yyyy"
          )}`
        : format(range.from, "dd MMM yyyy")
      : "";

  /** Validate all required fields */
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Event Type
    if (!eventType || eventType.trim() === "") {
      newErrors.eventType = "Event type is required";
    }

    // Event Title
    if (!eventTitle || eventTitle.trim() === "") {
      newErrors.eventTitle = "Event title is required";
    }

    // Event Theme
    if (!eventTheme || eventTheme.trim() === "") {
      newErrors.eventTheme = "Event theme is required";
    }

    // Supporting Text
    if (!supportingText || supportingText.trim() === "") {
      newErrors.supportingText = "Supporting text is required";
    }

    // Banner Image
    if (!bannerFile || !bannerFile.url) {
      newErrors.bannerFile = "Event banner is required";
    }

    // Date
    if (!range?.from) {
      newErrors.date = "Event date is required";
    }

    // Start Time
    if (!startTime) {
      newErrors.startTime = "Start time is required";
    }

    // End Time
    if (!endTime) {
      newErrors.endTime = "End time is required";
    }

    // Validate end time is after start time
    if (startTime && endTime && range?.from) {
      const start = buildDateTime(range.from, startTime);
      const end = buildDateTime(range.to ?? range.from, endTime);
      
      if (end <= start) {
        newErrors.endTime = "End time must be after start time";
      }
    }

    // Venue
    if (!venue || venue.trim() === "") {
      newErrors.venue = "Venue is required";
    }

    // Full Address
    if (!fullAddress || fullAddress.trim() === "") {
      newErrors.fullAddress = "Full address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Handle form submission */
  const handleCreateEvent = async () => {
  setSubmitError("");

  if (!validateForm()) {
    setSubmitError("Please fill in all required fields correctly");
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  startLoading();
  setIsSubmitting(true);

  try {
    let res;
    
    if (eventId.trim()) {
      const data = {
        stage: step,
        eventDetails: {
          eventBanner: bannerFile?.url,
          eventType: eventType,
          eventTitle: eventTitle,
          eventTheme: eventTheme,
          supportingText: supportingText,
          startDate: startDateTime,
          endDate: endDateTime,
          venue: venue,
          address: fullAddress,
          brandColor: {
            primaryColor: primaryColor,
            secondaryColor: secondaryColor,
          },
          eventVisibility: eventVisibility,
        },
      };
      res = await EditEventAction(data, eventId);
    } else {
      res = await CreateEventAction({
        eventBanner: bannerFile?.url,
        eventType: eventType,
        eventTitle: eventTitle,
        eventTheme: eventTheme,
        supportingText: supportingText,
        startDate: startDateTime,
        endDate: endDateTime,
        venue: venue,
        address: fullAddress,
        brandColor: {
          primaryColor: primaryColor,
          secondaryColor: secondaryColor,
        },
        eventVisibility: eventVisibility,
      });
    }

    // ✅ Check for error using 'in' operator
    if ('error' in res) {
      setSubmitError(res.error);
      console.log("Error:", res.error);
      return;
    }

    console.log("Success:", res);
    router.push(`?id=${res.data._id}`);
    setStep(step + 1);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    setSubmitError(errorMessage);
    console.error("Error creating event:", error);
  } finally {
    setIsSubmitting(false);
    stopLoading();
  }
};


  /** Clear specific field error when user starts typing */
  const handleFieldChange = <K extends keyof ValidationErrors>(
    field: K,
    value: any
  ) => {
    // Type assertion to match store's setField signature
    setField(field as Parameters<typeof setField>[0], value);
    // Clear the error for this field
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  

  return (
    <div className="text-white">
      <h2 className="text-lg sm:text-xl font-semibold mb-6">EVENT DETAILS</h2>

      {/* Global Error Message */}
      {submitError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
          <p className="text-red-500 text-sm">{submitError}</p>
        </div>
      )}

      {/* DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Event Type */}
          <div>
            <label className="block text-sm mb-2">
              Event Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={eventType}
                onChange={(e) => handleFieldChange("eventType", e.target.value)}
                className={`w-full bg-transparent border rounded-lg px-4 py-3 appearance-none ${
                  errors.eventType ? "border-red-500" : "border-[#2a2a2a]"
                }`}
              >
                <option className="text-black" value="">
                  Select event type
                </option>
                <option className="text-black" value="concert">
                  Concert
                </option>
                <option className="text-black" value="conference">
                  Conference
                </option>
                <option className="text-black" value="workshop">
                  Workshop
                </option>
                <option className="text-black" value="festival">
                  Festival
                </option>
              </select>
              <IoChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {errors.eventType && (
              <p className="text-red-500 text-xs mt-1">{errors.eventType}</p>
            )}
          </div>

          {/* Event Title */}
          <div>
            <label className="block text-sm mb-2">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => handleFieldChange("eventTitle", e.target.value)}
              placeholder="Event title"
              className={`w-full bg-transparent border rounded-lg px-4 py-3 ${
                errors.eventTitle ? "border-red-500" : "border-[#2a2a2a]"
              }`}
            />
            {errors.eventTitle && (
              <p className="text-red-500 text-xs mt-1">{errors.eventTitle}</p>
            )}
          </div>

          {/* Theme */}
          <div>
            <label className="block text-sm mb-2">
              Event Theme <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={eventTheme}
              onChange={(e) => handleFieldChange("eventTheme", e.target.value)}
              placeholder="Event theme"
              className={`w-full bg-transparent border rounded-lg px-4 py-3 ${
                errors.eventTheme ? "border-red-500" : "border-[#2a2a2a]"
              }`}
            />
            {errors.eventTheme && (
              <p className="text-red-500 text-xs mt-1">{errors.eventTheme}</p>
            )}
          </div>

          {/* Supporting */}
          <div>
            <label className="block text-sm mb-2">
              Supporting Text <span className="text-red-500">*</span>
            </label>
            <textarea
              value={supportingText}
              onChange={(e) =>
                handleFieldChange("supportingText", e.target.value)
              }
              rows={4}
              placeholder="Enter supporting text..."
              className={`w-full bg-transparent border rounded-lg px-4 py-3 resize-none ${
                errors.supportingText ? "border-red-500" : "border-[#2a2a2a]"
              }`}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.supportingText && (
                <p className="text-red-500 text-xs">{errors.supportingText}</p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {supportingText.length}
              </p>
            </div>
          </div>
        </div>

        <div>
          <ImageUpload
            label="Event Banner"
            
            onUploadComplete={(image) => {
              handleFieldChange("bannerFile", image);
            }}
            required
            error={errors.bannerFile}
            initialImage={bannerFile?.url}
          />
        </div>
      </div>

      {/* DATE & TIME */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
        {/* DATE */}
        <div className="relative">
          <label className="block text-sm mb-2">
            Date <span className="text-red-500">*</span>
          </label>
          <div
            onClick={() => setOpen(!open)}
            className="relative cursor-pointer"
          >
            <input
              readOnly
              value={formattedDate}
              placeholder="Select date or range"
              className={`w-full bg-transparent border rounded-lg px-4 py-3 cursor-pointer ${
                errors.date ? "border-red-500" : "border-[#2a2a2a]"
              }`}
            />
            <IoCalendarOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          {errors.date && (
            <p className="text-red-500 text-xs mt-1">{errors.date}</p>
          )}

          {open && (
            <div className="absolute z-20 mt-2 bg-[#151515] border border-gray-800 rounded-lg p-3">
              <DayPicker
                mode="range"
                selected={range}
                onSelect={handleDateSelect}
                numberOfMonths={2}
              />
            </div>
          )}
        </div>

        {/* START TIME */}
        <div>
          <label className="block text-sm mb-2">
            Start time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => {
              setStartTime(e.target.value);
              setErrors(prev => ({ ...prev, startTime: undefined }));
              if (range?.from && endTime) {
                setDateTime(
                  buildDateTime(range.from, e.target.value),
                  buildDateTime(range.to ?? range.from, endTime)
                );
              }
            }}
            className={`w-full bg-transparent border rounded-lg px-4 py-3 ${
              errors.startTime ? "border-red-500" : "border-[#2a2a2a]"
            }`}
          />
          {errors.startTime && (
            <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>
          )}
        </div>

        {/* END TIME */}
        <div>
          <label className="block text-sm mb-2">
            End time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => {
              setEndTime(e.target.value);
              setErrors(prev => ({ ...prev, endTime: undefined }));
              if (range?.from && startTime) {
                setDateTime(
                  buildDateTime(range.from, startTime),
                  buildDateTime(range.to ?? range.from, e.target.value)
                );
              }
            }}
            className={`w-full bg-transparent border rounded-lg px-4 py-3 ${
              errors.endTime ? "border-red-500" : "border-[#2a2a2a]"
            }`}
          />
          {errors.endTime && (
            <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>
          )}
        </div>
      </div>

      {/* VENUE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block text-sm mb-2">
            Venue <span className="text-red-500">*</span>
          </label>
          <input
            value={venue}
            onChange={(e) => handleFieldChange("venue", e.target.value)}
            placeholder="Venue"
            className={`w-full bg-transparent border rounded-lg px-4 py-3 ${
              errors.venue ? "border-red-500" : "border-[#2a2a2a]"
            }`}
          />
          {errors.venue && (
            <p className="text-red-500 text-xs mt-1">{errors.venue}</p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-2">
            Full Address <span className="text-red-500">*</span>
          </label>
          <input
            value={fullAddress}
            onChange={(e) => handleFieldChange("fullAddress", e.target.value)}
            placeholder="Full address"
            className={`w-full bg-transparent border rounded-lg px-4 py-3 ${
              errors.fullAddress ? "border-red-500" : "border-[#2a2a2a]"
            }`}
          />
          {errors.fullAddress && (
            <p className="text-red-500 text-xs mt-1">{errors.fullAddress}</p>
          )}
        </div>
      </div>

      {/* BRAND COLOR */}
      <h2 className="text-lg font-semibold mt-10 mb-6">BRAND COLOR</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm mb-2">Primary Color</label>
          <div className="flex gap-3">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setField("primaryColor", e.target.value)}
              className="w-12 h-12 rounded-lg cursor-pointer"
            />
            <input
              value={primaryColor}
              onChange={(e) => setField("primaryColor", e.target.value)}
              className="flex-1 bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 uppercase"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2">Secondary Color</label>
          <div className="flex gap-3">
            <input
              type="color"
              value={secondaryColor}
              onChange={(e) => setField("secondaryColor", e.target.value)}
              className="w-12 h-12 rounded-lg cursor-pointer"
            />
            <input
              value={secondaryColor}
              onChange={(e) => setField("secondaryColor", e.target.value)}
              className="flex-1 bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 uppercase"
            />
          </div>
        </div>
      </div>

      {/* VISIBILITY */}
      <div className="bg-[#151515] border border-gray-800 rounded-lg p-6 mt-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <IoEyeOffOutline className="text-xl text-gray-400" />
          <div>
            <p className="text-sm font-medium">Event Visibility</p>
            <p className="text-xs text-gray-500">
              {eventVisibility ? "Event is public" : "Event is private"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setField("eventVisibility", !eventVisibility)}
          className={`relative w-14 h-7 rounded-full transition-colors ${
            eventVisibility ? "bg-[#CCA33A]" : "bg-gray-700"
          }`}
        >
          <span
            className={`block w-5 h-5 bg-white rounded-full transition-transform ${
              eventVisibility ? "translate-x-7" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* NEXT */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleCreateEvent}
          disabled={isSubmitting}
          className={`px-8 py-3 rounded-full flex items-center gap-2 font-semibold transition-colors ${
            isSubmitting
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-[#CCA33A] hover:bg-[#b8922d]"
          } text-white`}
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" color="border-white" />
              Creating...
            </>
          ) : (
            <>
              Proceed <FiArrowRight />
            </>
          )}
        </button>
      </div>
    </div>
  );
}