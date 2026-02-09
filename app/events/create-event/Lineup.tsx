// // import { IoAddOutline, IoLogoInstagram, IoMusicalNote } from "react-icons/io5"
// // import { FaXTwitter } from "react-icons/fa6"
// // import { IoArrowBack, IoArrowForward } from "react-icons/io5"
// // import { IoTrashOutline, IoStar, IoStarOutline } from "react-icons/io5"
// // import { useLineupStore } from "@/store/create-events/LineUp"
// // import { useSingleEventStore } from "@/store/events/SingleEvent"
// // import { useLoadingStore } from "@/store/LoadingState"
// // import ImageUpload from "@/components/Image"
// // import Spinner from "@/components/Spinner"
// // import { EditEventAction } from "@/app/actions/event"
// // import { useSearchParams } from "next/navigation"
// // import { useState, useEffect } from "react"

// // interface StepProps {
// //   step: number;
// //   setStep: React.Dispatch<React.SetStateAction<number>>;
// // }

// // interface ValidationErrors {
// //   artists?: {
// //     [key: number]: {
// //       imageUrl?: string;
// //       name?: string;
// //       role?: string;
// //     };
// //   };
// // }

// // export default function Lineup({ step, setStep }: StepProps) {
// //   const searchParams = useSearchParams();
// //   const eventId = searchParams.get('id') ?? "";

// //   const {
// //     artists,
// //     addArtist,
// //     clearAll,
// //     updateArtist,
// //     toggleHeadliner,
// //     initializeLineup,
// //   } = useLineupStore()

// //   const { event } = useSingleEventStore();
// //   const { startLoading, stopLoading } = useLoadingStore();

// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [errors, setErrors] = useState<ValidationErrors>({});
// //   const [submitError, setSubmitError] = useState<string>("");
// //   const [isInitialized, setIsInitialized] = useState(false);

// //   /** Initialize form with event data if available */
// //   useEffect(() => {
// //     if (event?.artistLineUp && event.artistLineUp.length > 0 && !isInitialized && eventId) {
// //       console.log("Initializing Lineup with:", event.artistLineUp);
      
// //       const initialArtists = event.artistLineUp.map((artist, index) => ({
// //         id: Date.now() + index,
// //         imageUrl: artist.artistImage || null,
// //         name: artist.artistName || "",
// //         role: artist.artistGenre || "",
// //         isHeadliner: artist.headliner ?? false,
// //         instagram: artist.socials?.instgram || "", // Note: typo in backend (instgram vs instagram)
// //         twitter: artist.socials?.twitter || "",
// //         website: artist.socials?.website || "",
// //       }));

// //       initializeLineup(initialArtists);
// //       setIsInitialized(true);
// //     }
// //   }, [event, initializeLineup, isInitialized, eventId]);

// //   const handleImageUploadComplete = (artistId: number, imageData: { url: string }) => {
// //     updateArtist(artistId, 'imageUrl', imageData.url)
    
// //     // Clear image error for this artist
// //     const artistIndex = artists.findIndex(a => a.id === artistId);
// //     setErrors((prev) => {
// //       const newArtists = { ...prev.artists };
// //       if (newArtists[artistIndex]) {
// //         delete newArtists[artistIndex].imageUrl;
// //         if (Object.keys(newArtists[artistIndex]).length === 0) {
// //           delete newArtists[artistIndex];
// //         }
// //       }
// //       return { ...prev, artists: newArtists };
// //     });
// //   }

// //   /** Validate all required fields */
// //   const validateForm = (): boolean => {
// //     const newErrors: ValidationErrors = {
// //       artists: {},
// //     };

// //     artists.forEach((artist, index) => {
// //       const artistErrors: {
// //         imageUrl?: string;
// //         name?: string;
// //         role?: string;
// //       } = {};

// //       // Image validation
// //       if (!artist.imageUrl || artist.imageUrl.trim() === "") {
// //         artistErrors.imageUrl = "Artist image is required";
// //       }

// //       // Name validation
// //       if (!artist.name || artist.name.trim() === "") {
// //         artistErrors.name = "Artist name is required";
// //       } else if (artist.name.trim().length < 2) {
// //         artistErrors.name = "Artist name must be at least 2 characters";
// //       }

// //       // Role/Genre validation
// //       if (!artist.role || artist.role.trim() === "") {
// //         artistErrors.role = "Role/Genre is required";
// //       } else if (artist.role.trim().length < 2) {
// //         artistErrors.role = "Role/Genre must be at least 2 characters";
// //       }

// //       if (Object.keys(artistErrors).length > 0) {
// //         newErrors.artists![index] = artistErrors;
// //       }
// //     });

// //     // Check if at least one artist exists
// //     if (artists.length === 0) {
// //       setSubmitError("Please add at least one artist to the lineup");
// //       return false;
// //     }

// //     // Clean up empty artists object
// //     if (Object.keys(newErrors.artists!).length === 0) {
// //       delete newErrors.artists;
// //     }

// //     setErrors(newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   };

// //   /** Handle form submission */
// //   const handleSaveHeadliner = async() => {
// //     startLoading();
// //     // Reset previous errors
// //     setSubmitError("");

// //     // Validate form
// //     if (!validateForm()) {
// //       setSubmitError("Please fill in all required fields correctly");
// //       // Scroll to top to show errors
// //       window.scrollTo({ top: 0, behavior: "smooth" });
// //       stopLoading();
// //       return;
// //     }

// //     // Check if eventId exists
// //     if (!eventId.trim()) {
// //       setSubmitError("Event ID not found. Please start from the beginning.");
// //       stopLoading();
// //       return;
// //     }

// //     setIsSubmitting(true);

// //     try {
// //       const data = {
// //         stage: step,
// //         artistLineUp: artists.map((artist) => ({
// //           artistImage: artist.imageUrl || "",
// //           artistName: artist.name.trim(),
// //           artistGenre: artist.role.trim(),
// //           headliner: artist.isHeadliner,
// //           socials: 
// //             {
// //               instgram: artist.instagram.trim() || "", // Note: backend has typo
// //               twitter: artist.twitter.trim() || "",
// //               website: artist.website.trim() || ""
// //             }
          
// //         }))
// //       }

// //       console.log("Saving lineup data:", data); // Debug log

// //       const res = await EditEventAction(data, eventId);

// //       if (!res.success) {
// //         setSubmitError(res.message || "Failed to save artist lineup");
// //         console.log("res", res.message);
// //         return;
// //       }

// //       setStep(step + 1);
// //     } catch (error) {
// //       const errorMessage =
// //         error instanceof Error ? error.message : "An unexpected error occurred";
// //       setSubmitError(errorMessage);
// //       console.error("Error saving lineup:", error);
// //     } finally {
// //       setIsSubmitting(false);
// //       stopLoading();
// //     }
// //   }

// //   return (
// //     <div className="text-white">
// //       {/* Header */}
// //       <div className="flex justify-between items-start mb-6">
// //         <div>
// //           <h2 className="text-lg sm:text-xl font-semibold">ARTIST LINEUP</h2>
// //           <p className="text-xs text-gray-500 mt-1">Details of Performing Artists</p>
// //         </div>
// //         <button
// //           onClick={addArtist}
// //           className="flex items-center gap-2 text-[#CCA33A] text-sm font-medium hover:text-[#b8922d] transition-colors"
// //         >
// //           <IoAddOutline className="text-lg" />
// //           Add Artist
// //         </button>
// //       </div>

// //       {/* Global Error Message */}
// //       {submitError && (
// //         <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
// //           <p className="text-red-500 text-sm">{submitError}</p>
// //         </div>
// //       )}

// //       {/* Artists List */}
// //       <div className="space-y-8">
// //         {artists.map((artist, index) => {
// //           const artistErrors = errors.artists?.[index] || {};
// //           const hasErrors = Object.keys(artistErrors).length > 0;

// //           return (
// //             <div 
// //               key={artist.id} 
// //               className={`space-y-4 p-6 rounded-lg border ${
// //                 hasErrors ? "border-red-500 bg-red-500/5" : "border-transparent"
// //               }`}
// //             >
// //               {/* Artist Number Indicator */}
// //               <div className="flex items-center gap-2 mb-4">
// //                 <span className="text-[#CCA33A] font-semibold">
// //                   Artist {index + 1}
// //                 </span>
// //                 {hasErrors && (
// //                   <span className="text-red-500 text-xs">
// //                     (Please complete all required fields)
// //                   </span>
// //                 )}
// //               </div>

// //               {/* Artist Image */}
// //               <ImageUpload
// //                 label="Artist Image"
// //                 required
// //                 maxSize={1}
// //                 onUploadComplete={(imageData) => handleImageUploadComplete(artist.id, imageData)}
// //                 helperText="JPG, JPEG, PNG"
// //                 previewClassName="h-40 w-48"
// //                 error={artistErrors.imageUrl}
// //                 initialImage={artist.imageUrl || undefined}
// //               />

// //               {/* Artist Details */}
// //               <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
// //                 {/* Artist Name */}
// //                 <div>
// //                   <label className="block text-sm mb-2">
// //                     Artist Name <span className="text-red-500">*</span>
// //                   </label>
// //                   <input
// //                     type="text"
// //                     value={artist.name}
// //                     onChange={(e) => {
// //                       updateArtist(artist.id, 'name', e.target.value);
// //                       setErrors((prev) => {
// //                         const newArtists = { ...prev.artists };
// //                         if (newArtists[index]) {
// //                           delete newArtists[index].name;
// //                           if (Object.keys(newArtists[index]).length === 0) {
// //                             delete newArtists[index];
// //                           }
// //                         }
// //                         return { ...prev, artists: newArtists };
// //                       });
// //                     }}
// //                     placeholder="e.g. John Doe"
// //                     className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 ${
// //                       artistErrors.name ? "border-red-500" : "border-[#2a2a2a]"
// //                     }`}
// //                   />
// //                   {artistErrors.name && (
// //                     <p className="text-red-500 text-xs mt-1">{artistErrors.name}</p>
// //                   )}
// //                 </div>

// //                 {/* Role/Genre */}
// //                 <div>
// //                   <label className="block text-sm mb-2">
// //                     Role/Genre <span className="text-red-500">*</span>
// //                   </label>
// //                   <input
// //                     type="text"
// //                     value={artist.role}
// //                     onChange={(e) => {
// //                       updateArtist(artist.id, 'role', e.target.value);
// //                       setErrors((prev) => {
// //                         const newArtists = { ...prev.artists };
// //                         if (newArtists[index]) {
// //                           delete newArtists[index].role;
// //                           if (Object.keys(newArtists[index]).length === 0) {
// //                             delete newArtists[index];
// //                           }
// //                         }
// //                         return { ...prev, artists: newArtists };
// //                       });
// //                     }}
// //                     placeholder="e.g. Techno DJ/Producer"
// //                     className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 ${
// //                       artistErrors.role ? "border-red-500" : "border-[#2a2a2a]"
// //                     }`}
// //                   />
// //                   {artistErrors.role && (
// //                     <p className="text-red-500 text-xs mt-1">{artistErrors.role}</p>
// //                   )}
// //                 </div>

// //                 {/* Headliner Status */}
// //                 <div>
// //                   <label className="block text-sm mb-2">
// //                     Headliner Status
// //                   </label>
// //                   <button
// //                     type="button"
// //                     onClick={() => toggleHeadliner(artist.id)}
// //                     className={`w-full border rounded-lg px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
// //                       artist.isHeadliner
// //                         ? "border-[#CCA33A] bg-[#CCA33A]/10 text-[#CCA33A]"
// //                         : "border-[#2a2a2a] text-gray-400 hover:border-gray-600"
// //                     }`}
// //                   >
// //                     {artist.isHeadliner ? <IoStar /> : <IoStarOutline />}
// //                     {artist.isHeadliner ? "Headliner" : "Supporting Artist"}
// //                   </button>
// //                 </div>
// //               </div>

// //               {/* Social Media Links */}
// //               <div>
// //                 <label className="block text-sm mb-2">
// //                   Social Media Links <span className="text-gray-500 text-xs">(Optional)</span>
// //                 </label>
// //                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
// //                   {/* Instagram */}
// //                   <div className="relative">
// //                     <IoLogoInstagram className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
// //                     <input
// //                       type="text"
// //                       value={artist.instagram}
// //                       onChange={(e) => updateArtist(artist.id, 'instagram', e.target.value)}
// //                       placeholder="@username"
// //                       className="w-full bg-transparent border border-[#2a2a2a] rounded-lg pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
// //                     />
// //                   </div>

// //                   {/* Twitter */}
// //                   <div className="relative">
// //                     <FaXTwitter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
// //                     <input
// //                       type="text"
// //                       value={artist.twitter}
// //                       onChange={(e) => updateArtist(artist.id, 'twitter', e.target.value)}
// //                       placeholder="@username"
// //                       className="w-full bg-transparent border border-[#2a2a2a] rounded-lg pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
// //                     />
// //                   </div>

// //                   {/* Website */}
// //                   <div className="relative">
// //                     <IoMusicalNote className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
// //                     <input
// //                       type="text"
// //                       value={artist.website}
// //                       onChange={(e) => updateArtist(artist.id, 'website', e.target.value)}
// //                       placeholder="website.com"
// //                       className="w-full bg-transparent border border-[#2a2a2a] rounded-lg pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
// //                     />
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Divider */}
// //               {artists.length > 1 && index < artists.length - 1 && (
// //                 <div className="border-t border-[#2a2a2a] pt-4 mt-4"></div>
// //               )}
// //             </div>
// //           );
// //         })}
// //       </div>

// //       {/* Clear All Button */}
// //       {artists.length > 1 && (
// //         <div className="flex justify-end mt-6">
// //           <button
// //             onClick={clearAll}
// //             className="flex items-center gap-2 text-red-500 text-sm font-medium hover:text-red-400 transition-colors"
// //           >
// //             <IoTrashOutline className="text-lg" />
// //             Clear all
// //           </button>
// //         </div>
// //       )}

// //       {/* Tip */}
// //       <div className="flex items-start gap-2 mt-8 p-4 bg-gray-900/50 rounded-lg border border-[#2a2a2a]">
// //         <span className="text-[#CCA33A] text-xl mt-0.5">💡</span>
// //         <p className="text-xs text-gray-400">
// //           Tip: Mark headliners to feature them prominently on your event page. Social media links are optional but help promote your artists.
// //         </p>
// //       </div>

// //       {/* Navigation Buttons */}
// //       <div className="flex justify-between items-center mt-10">
// //         <button 
// //           onClick={() => setStep(step - 1)}
// //           disabled={isSubmitting}
// //           className="flex items-center gap-2 text-white border border-[#CCA33A] px-6 py-3 rounded-full font-semibold hover:bg-[#CCA33A]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// //         >
// //           <IoArrowBack />
// //           Previous
// //         </button>
// //         <button 
// //           onClick={handleSaveHeadliner}
// //           disabled={isSubmitting}
// //           className={`px-8 py-3 rounded-full flex items-center gap-2 font-semibold transition-colors ${
// //             isSubmitting
// //               ? "bg-gray-600 cursor-not-allowed"
// //               : "bg-[#CCA33A] hover:bg-[#b8922d]"
// //           } text-white`}
// //         >
// //           {isSubmitting ? (
// //             <>
// //               <Spinner size="sm" color="border-white" />
// //               Saving...
// //             </>
// //           ) : (
// //             <>
// //               Proceed
// //               <IoArrowForward />
// //             </>
// //           )}
// //         </button>
// //       </div>
// //     </div>
// //   )
// // }


// "use client";

// import { IoAddOutline, IoLogoInstagram, IoMusicalNote } from "react-icons/io5"
// import { FaXTwitter } from "react-icons/fa6"
// import { IoArrowBack, IoArrowForward } from "react-icons/io5"
// import { IoTrashOutline, IoStar, IoStarOutline } from "react-icons/io5"
// import { useLineupStore } from "@/store/create-events/LineUp"
// import { useSingleEventStore } from "@/store/events/SingleEvent"
// import ImageUpload from "@/components/Image"
// import { EditEventAction } from "@/app/actions/event"
// import { useSearchParams } from "next/navigation"
// import { useState, useEffect } from "react"

// interface StepProps {
//   step: number;
//   setStep: React.Dispatch<React.SetStateAction<number>>;
// }

// interface ValidationErrors {
//   artists?: {
//     [key: number]: {
//       imageUrl?: string;
//       name?: string;
//       role?: string;
//     };
//   };
// }

// export default function Lineup({ step, setStep }: StepProps) {
//   const searchParams = useSearchParams();
//   const eventId = searchParams.get('id');

//   const {
//     artists,
//     addArtist,
//     clearAll,
//     updateArtist,
//     toggleHeadliner,
//     initializeLineup,
//   } = useLineupStore()

//   const { event } = useSingleEventStore();

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errors, setErrors] = useState<ValidationErrors>({});
//   const [submitError, setSubmitError] = useState<string>("");
//   const [isInitialized, setIsInitialized] = useState(false);

//   /** Initialize form with event data if available */
//   useEffect(() => {
//     if (!eventId) return;
//     if (!event?.artistLineUp) return;
//     if (event.artistLineUp.length === 0) return;
//     if (isInitialized) return;

//     try {
//       console.log("Initializing Lineup with:", event.artistLineUp);
      
//       const initialArtists = event.artistLineUp.map((artist, index) => ({
//         id: Date.now() + index,
//         imageUrl: artist.artistImage || null,
//         name: artist.artistName || "",
//         role: artist.artistGenre || "",
//         isHeadliner: artist.headliner ?? false,
//         instagram: artist.socials?.instgram || "",
//         twitter: artist.socials?.twitter || "",
//         website: artist.socials?.website || "",
//       }));

//       initializeLineup(initialArtists);
//       setIsInitialized(true);
//     } catch (error) {
//       console.error("Error initializing lineup:", error);
//       setSubmitError("Failed to load existing lineup data");
//     }
//   }, [event, initializeLineup, isInitialized, eventId]);

//   const handleImageUploadComplete = (artistId: number, imageData: { url: string }) => {
//     if (!imageData?.url) {
//       console.error("Invalid image data received");
//       return;
//     }

//     updateArtist(artistId, 'imageUrl', imageData.url);
    
//     // Clear image error for this artist
//     const artistIndex = artists.findIndex(a => a.id === artistId);
//     if (artistIndex === -1) return;

//     setErrors((prev) => {
//       const newArtists = { ...prev.artists };
//       if (newArtists[artistIndex]) {
//         delete newArtists[artistIndex].imageUrl;
//         if (Object.keys(newArtists[artistIndex]).length === 0) {
//           delete newArtists[artistIndex];
//         }
//       }
//       return { ...prev, artists: newArtists };
//     });
//   }

//   /** Validate all required fields */
//   const validateForm = (): boolean => {
//     const newErrors: ValidationErrors = {
//       artists: {},
//     };

//     // Check if at least one artist exists
//     if (artists.length === 0) {
//       setSubmitError("Please add at least one artist to the lineup");
//       return false;
//     }

//     artists.forEach((artist, index) => {
//       const artistErrors: {
//         imageUrl?: string;
//         name?: string;
//         role?: string;
//       } = {};

//       // Image validation
//       if (!artist.imageUrl || artist.imageUrl.trim() === "") {
//         artistErrors.imageUrl = "Artist image is required";
//       }

//       // Name validation
//       if (!artist.name || artist.name.trim() === "") {
//         artistErrors.name = "Artist name is required";
//       } else if (artist.name.trim().length < 2) {
//         artistErrors.name = "Artist name must be at least 2 characters";
//       }

//       // Role/Genre validation
//       if (!artist.role || artist.role.trim() === "") {
//         artistErrors.role = "Role/Genre is required";
//       } else if (artist.role.trim().length < 2) {
//         artistErrors.role = "Role/Genre must be at least 2 characters";
//       }

//       if (Object.keys(artistErrors).length > 0) {
//         newErrors.artists![index] = artistErrors;
//       }
//     });

//     // Clean up empty artists object
//     if (Object.keys(newErrors.artists!).length === 0) {
//       delete newErrors.artists;
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   /** Handle form submission */
//  // 4. SAVE HEADLINER
// const handleSaveHeadliner = async () => {
//   setSubmitError("");

//   if (!validateForm()) {
//     setSubmitError("Please fill in all required fields correctly");
//     window.scrollTo({ top: 0, behavior: "smooth" });
//     return;
//   }

//   if (!eventId || eventId.trim() === "") {
//     setSubmitError("Event ID not found. Please save basic event details first.");
//     return;
//   }

//   setIsSubmitting(true);

//   try {
//     const payload = {
//       stage: step,
//       artistLineUp: artists.map((artist) => {
//         if (!artist.imageUrl || !artist.name || !artist.role) {
//           throw new Error("Missing required artist information");
//         }

//         return {
//           artistImage: artist.imageUrl.trim(),
//           artistName: artist.name.trim(),
//           artistGenre: artist.role.trim(),
//           headliner: Boolean(artist.isHeadliner),
//           socials: {
//             instgram: (artist.instagram || "").trim(),
//             twitter: (artist.twitter || "").trim(),
//             website: (artist.website || "").trim(),
//           },
//         };
//       }),
//     };

//     console.log("Saving lineup data:", payload);

//     const res = await EditEventAction(payload, eventId);

//     // ✅ Check for error using 'in' operator
//     if ('error' in res) {
//       setSubmitError(res.error);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//       return;
//     }

//     // Success - move to next step
//     setStep(step + 1);
//   } catch (error) {
//     console.error("Error saving lineup:", error);

//     let errorMessage = "An unexpected error occurred while saving the lineup";

//     if (error instanceof Error) {
//       errorMessage = error.message;
//     } else if (typeof error === "string") {
//       errorMessage = error;
//     }

//     setSubmitError(errorMessage);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   } finally {
//     setIsSubmitting(false);
//   }
// };


//   return (
//     <div className="text-white">
//       {/* Header */}
//       <div className="flex justify-between items-start mb-6">
//         <div>
//           <h2 className="text-lg sm:text-xl font-semibold">ARTIST LINEUP</h2>
//           <p className="text-xs text-gray-500 mt-1">Details of Performing Artists</p>
//         </div>
//         <button
//           onClick={addArtist}
//           disabled={isSubmitting}
//           className="flex items-center gap-2 text-[#CCA33A] text-sm font-medium hover:text-[#b8922d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           <IoAddOutline className="text-lg" />
//           Add Artist
//         </button>
//       </div>

//       {/* Global Error Message */}
//       {submitError && (
//         <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
//           <p className="text-red-500 text-sm font-semibold mb-1">Error</p>
//           <p className="text-red-400 text-sm">{submitError}</p>
//         </div>
//       )}

//       {/* No Event ID Warning */}
//       {!eventId && (
//         <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500 rounded-lg">
//           <p className="text-yellow-500 text-sm">
//             ⚠️ Event ID not found. Please complete the basic event details first.
//           </p>
//         </div>
//       )}

//       {/* Artists List */}
//       <div className="space-y-8">
//         {artists.map((artist, index) => {
//           const artistErrors = errors.artists?.[index] || {};
//           const hasErrors = Object.keys(artistErrors).length > 0;

//           return (
//             <div 
//               key={artist.id} 
//               className={`space-y-4 p-6 rounded-lg border ${
//                 hasErrors ? "border-red-500 bg-red-500/5" : "border-transparent"
//               }`}
//             >
//               {/* Artist Number Indicator */}
//               <div className="flex items-center gap-2 mb-4">
//                 <span className="text-[#CCA33A] font-semibold">
//                   Artist {index + 1}
//                 </span>
//                 {hasErrors && (
//                   <span className="text-red-500 text-xs">
//                     (Please complete all required fields)
//                   </span>
//                 )}
//               </div>

//               {/* Artist Image */}
//               <ImageUpload
//                 label="Artist Image"
//                 required
//                 maxSize={1}
//                 onUploadComplete={(imageData) => handleImageUploadComplete(artist.id, imageData)}
//                 helperText="JPG, JPEG, PNG (Max 1MB)"
//                 previewClassName="h-40 w-48"
//                 error={artistErrors.imageUrl}
//                 initialImage={artist.imageUrl || undefined}
//               />

//               {/* Artist Details */}
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//                 {/* Artist Name */}
//                 <div>
//                   <label className="block text-sm mb-2">
//                     Artist Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={artist.name}
//                     onChange={(e) => {
//                       updateArtist(artist.id, 'name', e.target.value);
//                       setErrors((prev) => {
//                         const newArtists = { ...prev.artists };
//                         if (newArtists?.[index]) {
//                           delete newArtists[index].name;
//                           if (Object.keys(newArtists[index]).length === 0) {
//                             delete newArtists[index];
//                           }
//                         }
//                         return { ...prev, artists: newArtists };
//                       });
//                     }}
//                     placeholder="e.g. John Doe"
//                     disabled={isSubmitting}
//                     className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed ${
//                       artistErrors.name ? "border-red-500" : "border-[#2a2a2a]"
//                     }`}
//                   />
//                   {artistErrors.name && (
//                     <p className="text-red-500 text-xs mt-1">{artistErrors.name}</p>
//                   )}
//                 </div>

//                 {/* Role/Genre */}
//                 <div>
//                   <label className="block text-sm mb-2">
//                     Role/Genre <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={artist.role}
//                     onChange={(e) => {
//                       updateArtist(artist.id, 'role', e.target.value);
//                       setErrors((prev) => {
//                         const newArtists = { ...prev.artists };
//                         if (newArtists?.[index]) {
//                           delete newArtists[index].role;
//                           if (Object.keys(newArtists[index]).length === 0) {
//                             delete newArtists[index];
//                           }
//                         }
//                         return { ...prev, artists: newArtists };
//                       });
//                     }}
//                     placeholder="e.g. Techno DJ/Producer"
//                     disabled={isSubmitting}
//                     className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed ${
//                       artistErrors.role ? "border-red-500" : "border-[#2a2a2a]"
//                     }`}
//                   />
//                   {artistErrors.role && (
//                     <p className="text-red-500 text-xs mt-1">{artistErrors.role}</p>
//                   )}
//                 </div>

//                 {/* Headliner Status */}
//                 <div>
//                   <label className="block text-sm mb-2">
//                     Headliner Status
//                   </label>
//                   <button
//                     type="button"
//                     onClick={() => toggleHeadliner(artist.id)}
//                     disabled={isSubmitting}
//                     className={`w-full border rounded-lg px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
//                       artist.isHeadliner
//                         ? "border-[#CCA33A] bg-[#CCA33A]/10 text-[#CCA33A]"
//                         : "border-[#2a2a2a] text-gray-400 hover:border-gray-600"
//                     }`}
//                   >
//                     {artist.isHeadliner ? <IoStar /> : <IoStarOutline />}
//                     {artist.isHeadliner ? "Headliner" : "Supporting Artist"}
//                   </button>
//                 </div>
//               </div>

//               {/* Social Media Links */}
//               <div>
//                 <label className="block text-sm mb-2">
//                   Social Media Links <span className="text-gray-500 text-xs">(Optional)</span>
//                 </label>
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//                   {/* Instagram */}
//                   <div className="relative">
//                     <IoLogoInstagram className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
//                     <input
//                       type="text"
//                       value={artist.instagram || ""}
//                       onChange={(e) => updateArtist(artist.id, 'instagram', e.target.value)}
//                       placeholder="@username"
//                       disabled={isSubmitting}
//                       className="w-full bg-transparent border border-[#2a2a2a] rounded-lg pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
//                     />
//                   </div>

//                   {/* Twitter */}
//                   <div className="relative">
//                     <FaXTwitter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
//                     <input
//                       type="text"
//                       value={artist.twitter || ""}
//                       onChange={(e) => updateArtist(artist.id, 'twitter', e.target.value)}
//                       placeholder="@username"
//                       disabled={isSubmitting}
//                       className="w-full bg-transparent border border-[#2a2a2a] rounded-lg pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
//                     />
//                   </div>

//                   {/* Website */}
//                   <div className="relative">
//                     <IoMusicalNote className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
//                     <input
//                       type="text"
//                       value={artist.website || ""}
//                       onChange={(e) => updateArtist(artist.id, 'website', e.target.value)}
//                       placeholder="website.com"
//                       disabled={isSubmitting}
//                       className="w-full bg-transparent border border-[#2a2a2a] rounded-lg pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Divider */}
//               {artists.length > 1 && index < artists.length - 1 && (
//                 <div className="border-t border-[#2a2a2a] pt-4 mt-4"></div>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {/* Clear All Button */}
//       {artists.length > 1 && (
//         <div className="flex justify-end mt-6">
//           <button
//             onClick={clearAll}
//             disabled={isSubmitting}
//             className="flex items-center gap-2 text-red-500 text-sm font-medium hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <IoTrashOutline className="text-lg" />
//             Clear all
//           </button>
//         </div>
//       )}

//       {/* Tip */}
//       <div className="flex items-start gap-2 mt-8 p-4 bg-gray-900/50 rounded-lg border border-[#2a2a2a]">
//         <span className="text-[#CCA33A] text-xl mt-0.5">💡</span>
//         <p className="text-xs text-gray-400">
//           Tip: Mark headliners to feature them prominently on your event page. Social media links are optional but help promote your artists.
//         </p>
//       </div>

//       {/* Navigation Buttons */}
//       <div className="flex justify-between items-center mt-10">
//         <button 
//           onClick={() => setStep(step - 1)}
//           disabled={isSubmitting}
//           className="flex items-center gap-2 text-white border border-[#CCA33A] px-6 py-3 rounded-full font-semibold hover:bg-[#CCA33A]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           <IoArrowBack />
//           Previous
//         </button>
//         <button 
//           onClick={handleSaveHeadliner}
//           disabled={isSubmitting || !eventId}
//           className={`px-8 py-3 rounded-full flex items-center gap-2 font-semibold transition-colors ${
//             isSubmitting || !eventId
//               ? "bg-gray-600 cursor-not-allowed"
//               : "bg-[#CCA33A] hover:bg-[#b8922d]"
//           } text-white`}
//         >
//           {isSubmitting ? (
//             <>
//               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//               Saving...
//             </>
//           ) : (
//             <>
//               Proceed
//               <IoArrowForward />
//             </>
//           )}
//         </button>
//       </div>
//     </div>
//   )
// }




"use client";

import { IoAddOutline, IoLogoInstagram, IoMusicalNote } from "react-icons/io5"
import { FaXTwitter } from "react-icons/fa6"
import { IoArrowBack, IoArrowForward } from "react-icons/io5"
import { IoTrashOutline, IoStar, IoStarOutline } from "react-icons/io5"
import { useLineupStore } from "@/store/create-events/LineUp"
import { useSingleEventStore } from "@/store/events/SingleEvent"
import ImageUpload from "@/components/Image"
import { EditEventAction } from "@/app/actions/event"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

interface StepProps {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

interface ValidationErrors {
  artists?: {
    [key: number]: {
      imageUrl?: string;
      name?: string;
      role?: string;
    };
  };
}

export default function Lineup({ step, setStep }: StepProps) {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id');

  const {
    artists,
    addArtist,
    clearAll,
    updateArtist,
    toggleHeadliner,
  } = useLineupStore()

  const { event } = useSingleEventStore();

  useEffect(() => {
  console.log("Current artists state:", artists);
}, [artists]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitError, setSubmitError] = useState<string>("");

  // ✅ REMOVED: The duplicate initialization - the edit page handles this now

  const handleImageUploadComplete = (artistId: number, imageData: { url: string }) => {
    console.log("Image upload complete for artist:", artistId, imageData);
    
    if (!imageData?.url) {
      console.error("Invalid image data received");
      setSubmitError("Failed to upload image. Please try again.");
      return;
    }

    // Update the artist's image URL
    updateArtist(artistId, 'imageUrl', imageData.url);
    
    // Clear image error for this artist
    const artistIndex = artists.findIndex(a => a.id === artistId);
    if (artistIndex === -1) {
      console.error("Artist not found:", artistId);
      return;
    }

    setErrors((prev) => {
      const newArtists = { ...prev.artists };
      if (newArtists && newArtists[artistIndex]) {
        delete newArtists[artistIndex].imageUrl;
        if (Object.keys(newArtists[artistIndex]).length === 0) {
          delete newArtists[artistIndex];
        }
      }
      return { ...prev, artists: newArtists };
    });

    console.log("Artist updated successfully");
  }

  /** Validate all required fields */
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {
      artists: {},
    };

    // Check if at least one artist exists
    if (artists.length === 0) {
      setSubmitError("Please add at least one artist to the lineup");
      return false;
    }

    // Check if at least one artist has complete data
    const hasValidArtist = artists.some(
      artist => artist.name?.trim() && artist.role?.trim() && artist.imageUrl?.trim()
    );

    if (!hasValidArtist) {
      setSubmitError("Please complete at least one artist with name, role, and image");
      return false;
    }

    // Validate each artist that has any data entered
    artists.forEach((artist, index) => {
      // Skip completely empty artists
      const hasAnyData = artist.name?.trim() || artist.role?.trim() || artist.imageUrl?.trim();
      if (!hasAnyData) return;

      const artistErrors: {
        imageUrl?: string;
        name?: string;
        role?: string;
      } = {};

      // Image validation
      if (!artist.imageUrl || artist.imageUrl.trim() === "") {
        artistErrors.imageUrl = "Artist image is required";
      }

      // Name validation
      if (!artist.name || artist.name.trim() === "") {
        artistErrors.name = "Artist name is required";
      } else if (artist.name.trim().length < 2) {
        artistErrors.name = "Artist name must be at least 2 characters";
      }

      // Role/Genre validation
      if (!artist.role || artist.role.trim() === "") {
        artistErrors.role = "Role/Genre is required";
      } else if (artist.role.trim().length < 2) {
        artistErrors.role = "Role/Genre must be at least 2 characters";
      }

      if (Object.keys(artistErrors).length > 0) {
        newErrors.artists![index] = artistErrors;
      }
    });

    // Clean up empty artists object
    if (Object.keys(newErrors.artists!).length === 0) {
      delete newErrors.artists;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Handle form submission */
  const handleSaveHeadliner = async () => {
    setSubmitError("");

    if (!validateForm()) {
      setSubmitError("Please fill in all required fields correctly");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!eventId || eventId.trim() === "") {
      setSubmitError("Event ID not found. Please save basic event details first.");
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ Filter out empty artists - only send artists with complete data
      const validArtists = artists.filter(
        artist => artist.name?.trim() && artist.role?.trim() && artist.imageUrl?.trim()
      );

      if (validArtists.length === 0) {
        setSubmitError("Please add at least one complete artist");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        stage: step,
        artistLineUp: validArtists.map((artist) => ({
          artistImage: artist.imageUrl!.trim(),
          artistName: artist.name!.trim(),
          artistGenre: artist.role!.trim(),
          headliner: Boolean(artist.isHeadliner),
          socials: {
            instgram: (artist.instagram || "").trim(),
            twitter: (artist.twitter || "").trim(),
            website: (artist.website || "").trim(),
          },
        })),
      };

      console.log("Saving lineup data:", payload);

      const res = await EditEventAction(payload, eventId);

      if ('error' in res) {
        setSubmitError(res.error);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      // Success - move to next step
      setStep(step + 1);
    } catch (error) {
      console.error("Error saving lineup:", error);

      let errorMessage = "An unexpected error occurred while saving the lineup";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      setSubmitError(errorMessage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">ARTIST LINEUP</h2>
          <p className="text-xs text-gray-500 mt-1">Details of Performing Artists</p>
        </div>
        <button
          onClick={addArtist}
          disabled={isSubmitting}
          className="flex items-center gap-2 text-[#CCA33A] text-sm font-medium hover:text-[#b8922d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IoAddOutline className="text-lg" />
          Add Artist
        </button>
      </div>

      {/* Global Error Message */}
      {submitError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
          <p className="text-red-500 text-sm font-semibold mb-1">Error</p>
          <p className="text-red-400 text-sm">{submitError}</p>
        </div>
      )}

      {/* No Event ID Warning */}
      {!eventId && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500 rounded-lg">
          <p className="text-yellow-500 text-sm">
            ⚠️ Event ID not found. Please complete the basic event details first.
          </p>
        </div>
      )}

      {/* Debug Info - Remove this after testing */}
      <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500 rounded text-xs">
        <p className="text-blue-400">
          Artists in store: {artists.length} | 
          Valid artists: {artists.filter(a => a.name && a.role && a.imageUrl).length}
        </p>
      </div>

      {/* Artists List */}
      <div className="space-y-8">
        {artists.map((artist, index) => {
          const artistErrors = errors.artists?.[index] || {};
          const hasErrors = Object.keys(artistErrors).length > 0;

          return (
            <div 
              key={artist.id} 
              className={`space-y-4 p-6 rounded-lg border ${
                hasErrors ? "border-red-500 bg-red-500/5" : "border-transparent"
              }`}
            >
              {/* Artist Number Indicator */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[#CCA33A] font-semibold">
                  Artist {index + 1}
                </span>
                {hasErrors && (
                  <span className="text-red-500 text-xs">
                    (Please complete all required fields)
                  </span>
                )}
              </div>

              {/* Artist Image */}
              <ImageUpload
                label="Artist Image"
                required
                maxSize={1}
                onUploadComplete={(imageData) => handleImageUploadComplete(artist.id, imageData)}
                helperText="JPG, JPEG, PNG (Max 1MB)"
                previewClassName="h-40 w-48"
                error={artistErrors.imageUrl}
                initialImage={artist.imageUrl || undefined}
              />

              {/* Debug - Show current image URL */}
              {artist.imageUrl && (
                <p className="text-xs text-green-400">
                  ✓ Image uploaded: {artist.imageUrl.substring(0, 50)}...
                </p>
              )}

              {/* Artist Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Artist Name */}
                <div>
                  <label className="block text-sm mb-2">
                    Artist Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={artist.name || ""}
                    onChange={(e) => {
                      updateArtist(artist.id, 'name', e.target.value);
                      setErrors((prev) => {
                        const newArtists = { ...prev.artists };
                        if (newArtists?.[index]) {
                          delete newArtists[index].name;
                          if (Object.keys(newArtists[index]).length === 0) {
                            delete newArtists[index];
                          }
                        }
                        return { ...prev, artists: newArtists };
                      });
                    }}
                    placeholder="e.g. John Doe"
                    disabled={isSubmitting}
                    className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed ${
                      artistErrors.name ? "border-red-500" : "border-[#2a2a2a]"
                    }`}
                  />
                  {artistErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{artistErrors.name}</p>
                  )}
                </div>

                {/* Role/Genre */}
                <div>
                  <label className="block text-sm mb-2">
                    Role/Genre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={artist.role || ""}
                    onChange={(e) => {
                      updateArtist(artist.id, 'role', e.target.value);
                      setErrors((prev) => {
                        const newArtists = { ...prev.artists };
                        if (newArtists?.[index]) {
                          delete newArtists[index].role;
                          if (Object.keys(newArtists[index]).length === 0) {
                            delete newArtists[index];
                          }
                        }
                        return { ...prev, artists: newArtists };
                      });
                    }}
                    placeholder="e.g. Techno DJ/Producer"
                    disabled={isSubmitting}
                    className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed ${
                      artistErrors.role ? "border-red-500" : "border-[#2a2a2a]"
                    }`}
                  />
                  {artistErrors.role && (
                    <p className="text-red-500 text-xs mt-1">{artistErrors.role}</p>
                  )}
                </div>

                {/* Headliner Status */}
                <div>
                  <label className="block text-sm mb-2">
                    Headliner Status
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleHeadliner(artist.id)}
                    disabled={isSubmitting}
                    className={`w-full border rounded-lg px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      artist.isHeadliner
                        ? "border-[#CCA33A] bg-[#CCA33A]/10 text-[#CCA33A]"
                        : "border-[#2a2a2a] text-gray-400 hover:border-gray-600"
                    }`}
                  >
                    {artist.isHeadliner ? <IoStar /> : <IoStarOutline />}
                    {artist.isHeadliner ? "Headliner" : "Supporting Artist"}
                  </button>
                </div>
              </div>

              {/* Social Media Links */}
              <div>
                <label className="block text-sm mb-2">
                  Social Media Links <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Instagram */}
                  <div className="relative">
                    <IoLogoInstagram className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      value={artist.instagram || ""}
                      onChange={(e) => updateArtist(artist.id, 'instagram', e.target.value)}
                      placeholder="@username"
                      disabled={isSubmitting}
                      className="w-full bg-transparent border border-[#2a2a2a] rounded-lg pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Twitter */}
                  <div className="relative">
                    <FaXTwitter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      value={artist.twitter || ""}
                      onChange={(e) => updateArtist(artist.id, 'twitter', e.target.value)}
                      placeholder="@username"
                      disabled={isSubmitting}
                      className="w-full bg-transparent border border-[#2a2a2a] rounded-lg pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Website */}
                  <div className="relative">
                    <IoMusicalNote className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      value={artist.website || ""}
                      onChange={(e) => updateArtist(artist.id, 'website', e.target.value)}
                      placeholder="website.com"
                      disabled={isSubmitting}
                      className="w-full bg-transparent border border-[#2a2a2a] rounded-lg pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              {artists.length > 1 && index < artists.length - 1 && (
                <div className="border-t border-[#2a2a2a] pt-4 mt-4"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Clear All Button */}
      {artists.length > 1 && (
        <div className="flex justify-end mt-6">
          <button
            onClick={clearAll}
            disabled={isSubmitting}
            className="flex items-center gap-2 text-red-500 text-sm font-medium hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoTrashOutline className="text-lg" />
            Clear all
          </button>
        </div>
      )}

      {/* Tip */}
      <div className="flex items-start gap-2 mt-8 p-4 bg-gray-900/50 rounded-lg border border-[#2a2a2a]">
        <span className="text-[#CCA33A] text-xl mt-0.5">💡</span>
        <p className="text-xs text-gray-400">
          Tip: Mark headliners to feature them prominently on your event page. Social media links are optional but help promote your artists.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-10">
        <button 
          onClick={() => setStep(step - 1)}
          disabled={isSubmitting}
          className="flex items-center gap-2 text-white border border-[#CCA33A] px-6 py-3 rounded-full font-semibold hover:bg-[#CCA33A]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IoArrowBack />
          Previous
        </button>
        <button 
          onClick={handleSaveHeadliner}
          disabled={isSubmitting || !eventId}
          className={`px-8 py-3 rounded-full flex items-center gap-2 font-semibold transition-colors ${
            isSubmitting || !eventId
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-[#CCA33A] hover:bg-[#b8922d]"
          } text-white`}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            <>
              Proceed
              <IoArrowForward />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
