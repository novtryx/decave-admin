// import { IoArrowBack } from "react-icons/io5";
// import { useContactStore } from "@/store/create-events/contact";
// import { useSingleEventStore } from "@/store/events/SingleEvent";
// import { useLoadingStore } from "@/store/LoadingState";
// import { useRouter, useSearchParams } from "next/navigation";
// import { EditEventAction } from "@/app/actions/event";
// import Spinner from "@/components/Spinner";
// import { useState, useEffect } from "react";

// interface StepProps {
//   step: number;
//   setStep: React.Dispatch<React.SetStateAction<number>>;
// }

// interface ValidationErrors {
//   security?: string;
//   medical?: string;
//   lostFound?: string;
// }

// export default function Contact({ step, setStep }: StepProps) {
//   const searchParams = useSearchParams();
//   const eventId = searchParams.get("id") ?? "";
//   const router = useRouter();

//   const {
//     security,
//     medical,
//     lostFound,
//     supportingInfo,
//     setField,
//     initializeContact,
//   } = useContactStore();
//   const { event } = useSingleEventStore();
//   const { startLoading, stopLoading } = useLoadingStore();

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errors, setErrors] = useState<ValidationErrors>({});
//   const [submitError, setSubmitError] = useState<string>("");
//   const [isInitialized, setIsInitialized] = useState(false);

//   /** Initialize form with event data if available */
//   useEffect(() => {
//     if (event?.emergencyContact && !isInitialized && eventId) {
//       console.log("Initializing Contact with:", event.emergencyContact);

//       initializeContact({
//         security: event.emergencyContact.security || "",
//         medical: event.emergencyContact.medical || "",
//         lostFound: event.emergencyContact.lostButFound || "",
//         supportingInfo: event.emergencyContact.supportingInfo || "",
//       });

//       setIsInitialized(true);
//     }
//   }, [event, initializeContact, isInitialized, eventId]);

//   /** Phone number validation helper */
//   const isValidPhoneNumber = (phone: string): boolean => {
//     // Remove spaces and special characters for validation
//     const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
//     // Check if it's a valid phone number (10-15 digits, optionally starting with +)
//     return /^\+?\d{10,15}$/.test(cleanPhone);
//   };

//   /** Validate all required fields */
//   const validateForm = (): boolean => {
//     const newErrors: ValidationErrors = {};

//     // Security validation
//     if (!security || security.trim() === "") {
//       newErrors.security = "Security contact is required";
//     } else if (!isValidPhoneNumber(security)) {
//       newErrors.security = "Please enter a valid phone number";
//     }

//     // Medical validation
//     if (!medical || medical.trim() === "") {
//       newErrors.medical = "Medical contact is required";
//     } else if (!isValidPhoneNumber(medical)) {
//       newErrors.medical = "Please enter a valid phone number";
//     }

//     // Lost & Found validation
//     if (!lostFound || lostFound.trim() === "") {
//       newErrors.lostFound = "Lost & Found contact is required";
//     } else if (lostFound.trim().length < 5) {
//       newErrors.lostFound = "Please provide valid contact information";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   /** Handle form submission */
//   // 2. PUBLISH EVENT
//   const handlePublishEvent = async () => {
//     startLoading();
//     setSubmitError("");

//     if (!validateForm()) {
//       setSubmitError("Please fill in all required fields correctly");
//       window.scrollTo({ top: 0, behavior: "smooth" });
//       stopLoading();
//       return;
//     }

//     if (!eventId.trim()) {
//       setSubmitError("Event ID not found. Please start from the beginning.");
//       stopLoading();
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const data = {
//         stage: step,
//         emergencyContact: {
//           security: security.trim(),
//           medical: medical.trim(),
//           lostButFound: lostFound.trim(),
//           supportingInfo: supportingInfo.trim(),
//         },
//         published: true,
//       };

//       console.log("Publishing event with data:", data);

//       const res = await EditEventAction(data, eventId);

//       // ✅ Check for error using 'in' operator
//       if ("error" in res) {
//         setSubmitError(res.error);
//         console.log("Error:", res.error);
//         return;
//       }

//       // Success - navigate to events page
//       router.push("/events");
//     } catch (error) {
//       const errorMessage =
//         error instanceof Error ? error.message : "An unexpected error occurred";
//       setSubmitError(errorMessage);
//       console.error("Error publishing event:", error);
//     } finally {
//       setIsSubmitting(false);
//       stopLoading();
//     }
//   };

//   return (
//     <div className="text-white">
//       {/* Header */}
//       <div className="mb-6">
//         <h2 className="text-lg sm:text-xl font-semibold">EMERGENCY CONTACT</h2>
//         <p className="text-xs text-gray-500 mt-1">
//           Emergency contact for assistance during this event
//         </p>
//       </div>

//       {/* Global Error Message */}
//       {submitError && (
//         <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
//           <p className="text-red-500 text-sm">{submitError}</p>
//         </div>
//       )}

//       {/* Contact Fields */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
//         {/* Security */}
//         <div>
//           <label className="block text-sm mb-2">
//             Security <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="tel"
//             value={security}
//             onChange={(e) => {
//               setField("security", e.target.value);
//               setErrors((prev) => ({ ...prev, security: undefined }));
//             }}
//             placeholder="+234 901 234 5678"
//             className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 ${
//               errors.security ? "border-red-500" : "border-[#2a2a2a]"
//             }`}
//           />
//           {errors.security && (
//             <p className="text-red-500 text-xs mt-1">{errors.security}</p>
//           )}
//         </div>

//         {/* Medical */}
//         <div>
//           <label className="block text-sm mb-2">
//             Medical <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="tel"
//             value={medical}
//             onChange={(e) => {
//               setField("medical", e.target.value);
//               setErrors((prev) => ({ ...prev, medical: undefined }));
//             }}
//             placeholder="+234 901 234 5678"
//             className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 ${
//               errors.medical ? "border-red-500" : "border-[#2a2a2a]"
//             }`}
//           />
//           {errors.medical && (
//             <p className="text-red-500 text-xs mt-1">{errors.medical}</p>
//           )}
//         </div>

//         {/* Lost & Found */}
//         <div>
//           <label className="block text-sm mb-2">
//             Lost & Found <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             value={lostFound}
//             onChange={(e) => {
//               setField("lostFound", e.target.value);
//               setErrors((prev) => ({ ...prev, lostFound: undefined }));
//             }}
//             placeholder="Phone no. or location"
//             className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 ${
//               errors.lostFound ? "border-red-500" : "border-[#2a2a2a]"
//             }`}
//           />
//           {errors.lostFound && (
//             <p className="text-red-500 text-xs mt-1">{errors.lostFound}</p>
//           )}
//         </div>
//       </div>

//       {/* Supporting Information */}
//       <div className="mb-6">
//         <label className="block text-sm mb-2">
//           Supporting information{" "}
//           <span className="text-gray-500 text-xs">(Optional)</span>
//         </label>
//         <textarea
//           value={supportingInfo}
//           onChange={(e) => setField("supportingInfo", e.target.value)}
//           placeholder="Additional emergency information or instructions..."
//           rows={6}
//           maxLength={100}
//           className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 resize-none"
//         />
//         <p className="text-xs text-gray-500 mt-1">
//           {supportingInfo.length}/100
//         </p>
//       </div>

//       {/* Review Notice */}
//       <div className="flex items-start gap-2 p-4 bg-[#CCA33A]/10 rounded-lg border border-[#CCA33A]/30 mb-8">
//         <span className="text-[#CCA33A] text-lg mt-0.5">⚠️</span>
//         <div>
//           <p className="text-sm font-medium text-[#CCA33A] mb-1">
//             Ready to publish?
//           </p>
//           <p className="text-xs text-gray-400">
//             Make sure you've reviewed all sections. Once published, your event
//             will be visible to attendees.
//           </p>
//         </div>
//       </div>

//       {/* Navigation Buttons */}
//       <div className="flex justify-end items-center gap-4">
//         <button
//           onClick={() => setStep(step - 1)}
//           disabled={isSubmitting}
//           className="flex items-center gap-2 text-white border border-[#CCA33A] px-6 py-3 rounded-full font-semibold hover:bg-[#CCA33A]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           <IoArrowBack />
//           Previous
//         </button>
//         <button
//           onClick={handlePublishEvent}
//           disabled={isSubmitting}
//           className={`px-8 py-3 rounded-full font-semibold transition-colors flex items-center gap-2 ${
//             isSubmitting
//               ? "bg-gray-600 cursor-not-allowed"
//               : "bg-[#CCA33A] hover:bg-[#b8922d]"
//           } text-black`}
//         >
//           {isSubmitting ? (
//             <>
//               <Spinner size="sm" color="border-black" />
//               Publishing...
//             </>
//           ) : (
//             "Publish Event"
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }



import { IoArrowBack } from "react-icons/io5";
import { useContactStore } from "@/store/create-events/contact";
import { useSingleEventStore } from "@/store/events/SingleEvent";
import { useLoadingStore } from "@/store/LoadingState";
import { useRouter, useSearchParams } from "next/navigation";
import { EditEventAction } from "@/app/actions/event";
import Spinner from "@/components/Spinner";
import { useState, useEffect } from "react";
import { IoAdd, IoClose } from "react-icons/io5";

interface StepProps {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

interface ValidationErrors {
  security?: string;
  medical?: string;
  lostFound?: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface Code {
  title: string;
  body: string;
}

export default function Contact({ step, setStep }: StepProps) {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id") ?? "";
  const router = useRouter();

  const {
    security,
    medical,
    lostFound,
    supportingInfo,
    setField,
    initializeContact,
  } = useContactStore();
  const { event } = useSingleEventStore();
  const { startLoading, stopLoading } = useLoadingStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitError, setSubmitError] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);

  // FAQ and Code states
  const [faqs, setFaqs] = useState<FAQ[]>([{ question: "", answer: "" }]);
  const [codes, setCodes] = useState<Code[]>([{ title: "", body: "" }]);

  /** Initialize form with event data if available */
  useEffect(() => {
    if (event?.emergencyContact && !isInitialized && eventId) {
      console.log("Initializing Contact with:", event.emergencyContact);

      initializeContact({
        security: event.emergencyContact.security || "",
        medical: event.emergencyContact.medical || "",
        lostFound: event.emergencyContact.lostButFound || "",
        supportingInfo: event.emergencyContact.supportingInfo || "",
      });

      // Initialize FAQ if available
      if (event.faq && Array.isArray(event.faq) && event.faq.length > 0) {
        setFaqs(event.faq);
      }

      // Initialize Code if available
      if (event.code && Array.isArray(event.code) && event.code.length > 0) {
        setCodes(event.code);
      }

      setIsInitialized(true);
    }
  }, [event, initializeContact, isInitialized, eventId]);

  /** Phone number validation helper */
  const isValidPhoneNumber = (phone: string): boolean => {
    // Remove spaces and special characters for validation
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
    // Check if it's a valid phone number (10-15 digits, optionally starting with +)
    return /^\+?\d{10,15}$/.test(cleanPhone);
  };

  /** Validate all required fields */
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Security validation
    if (!security || security.trim() === "") {
      newErrors.security = "Security contact is required";
    } else if (!isValidPhoneNumber(security)) {
      newErrors.security = "Please enter a valid phone number";
    }

    // Medical validation
    if (!medical || medical.trim() === "") {
      newErrors.medical = "Medical contact is required";
    } else if (!isValidPhoneNumber(medical)) {
      newErrors.medical = "Please enter a valid phone number";
    }

    // Lost & Found validation
    if (!lostFound || lostFound.trim() === "") {
      newErrors.lostFound = "Lost & Found contact is required";
    } else if (lostFound.trim().length < 5) {
      newErrors.lostFound = "Please provide valid contact information";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** FAQ handlers */
  const addFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const removeFaq = (index: number) => {
    if (faqs.length > 1) {
      setFaqs(faqs.filter((_, i) => i !== index));
    }
  };

  const updateFaq = (index: number, field: keyof FAQ, value: string) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index][field] = value;
    setFaqs(updatedFaqs);
  };

  /** Code handlers */
  const addCode = () => {
    setCodes([...codes, { title: "", body: "" }]);
  };

  const removeCode = (index: number) => {
    if (codes.length > 1) {
      setCodes(codes.filter((_, i) => i !== index));
    }
  };

  const updateCode = (index: number, field: keyof Code, value: string) => {
    const updatedCodes = [...codes];
    updatedCodes[index][field] = value;
    setCodes(updatedCodes);
  };

  /** Handle form submission */
  // 2. PUBLISH EVENT
  const handlePublishEvent = async () => {
    startLoading();
    setSubmitError("");

    if (!validateForm()) {
      setSubmitError("Please fill in all required fields correctly");
      window.scrollTo({ top: 0, behavior: "smooth" });
      stopLoading();
      return;
    }

    if (!eventId.trim()) {
      setSubmitError("Event ID not found. Please start from the beginning.");
      stopLoading();
      return;
    }

    setIsSubmitting(true);

    try {
      // Filter out empty FAQs and Codes
      const filteredFaqs = faqs.filter(
        (faq) => faq.question.trim() !== "" || faq.answer.trim() !== ""
      );
      const filteredCodes = codes.filter(
        (code) => code.title.trim() !== "" || code.body.trim() !== ""
      );

      const data = {
        stage: step,
        emergencyContact: {
          security: security.trim(),
          medical: medical.trim(),
          lostButFound: lostFound.trim(),
          supportingInfo: supportingInfo.trim(),
        },
        faq: filteredFaqs,
        code: filteredCodes,
        published: true,
      };

      console.log("Publishing event with data:", data);

      const res = await EditEventAction(data, eventId);

      // ✅ Check for error using 'in' operator
      if ("error" in res) {
        setSubmitError(res.error);
        console.log("Error:", res.error);
        return;
      }

      // Success - navigate to events page
      router.push("/events");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setSubmitError(errorMessage);
      console.error("Error publishing event:", error);
    } finally {
      setIsSubmitting(false);
      stopLoading();
    }
  };

  return (
    <div className="text-white">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-semibold">EMERGENCY CONTACT</h2>
        <p className="text-xs text-gray-500 mt-1">
          Emergency contact for assistance during this event
        </p>
      </div>

      {/* Global Error Message */}
      {submitError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
          <p className="text-red-500 text-sm">{submitError}</p>
        </div>
      )}

      {/* Contact Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        {/* Security */}
        <div>
          <label className="block text-sm mb-2">
            Security <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={security}
            onChange={(e) => {
              setField("security", e.target.value);
              setErrors((prev) => ({ ...prev, security: undefined }));
            }}
            placeholder="+234 901 234 5678"
            className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 ${
              errors.security ? "border-red-500" : "border-[#2a2a2a]"
            }`}
          />
          {errors.security && (
            <p className="text-red-500 text-xs mt-1">{errors.security}</p>
          )}
        </div>

        {/* Medical */}
        <div>
          <label className="block text-sm mb-2">
            Medical <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={medical}
            onChange={(e) => {
              setField("medical", e.target.value);
              setErrors((prev) => ({ ...prev, medical: undefined }));
            }}
            placeholder="+234 901 234 5678"
            className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 ${
              errors.medical ? "border-red-500" : "border-[#2a2a2a]"
            }`}
          />
          {errors.medical && (
            <p className="text-red-500 text-xs mt-1">{errors.medical}</p>
          )}
        </div>

        {/* Lost & Found */}
        <div>
          <label className="block text-sm mb-2">
            Lost & Found <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={lostFound}
            onChange={(e) => {
              setField("lostFound", e.target.value);
              setErrors((prev) => ({ ...prev, lostFound: undefined }));
            }}
            placeholder="Phone no. or location"
            className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 ${
              errors.lostFound ? "border-red-500" : "border-[#2a2a2a]"
            }`}
          />
          {errors.lostFound && (
            <p className="text-red-500 text-xs mt-1">{errors.lostFound}</p>
          )}
        </div>
      </div>

      {/* Supporting Information */}
      <div className="mb-8">
        <label className="block text-sm mb-2">
          Supporting information{" "}
          <span className="text-gray-500 text-xs">(Optional)</span>
        </label>
        <textarea
          value={supportingInfo}
          onChange={(e) => setField("supportingInfo", e.target.value)}
          placeholder="Additional emergency information or instructions..."
          rows={6}
          maxLength={100}
          className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">
          {supportingInfo.length}/100
        </p>
      </div>

      {/* FAQ Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">FAQ</h3>
            <p className="text-xs text-gray-500 mt-1">
              Frequently asked questions about your event
            </p>
          </div>
          <button
            type="button"
            onClick={addFaq}
            className="flex items-center gap-2 px-4 py-2 bg-[#CCA33A] text-black rounded-lg hover:bg-[#b8922d] transition-colors text-sm font-medium"
          >
            <IoAdd className="text-lg" />
            Add FAQ
          </button>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-[#2a2a2a] rounded-lg p-4 relative"
            >
              {faqs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFaq(index)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remove FAQ"
                >
                  <IoClose className="text-xl" />
                </button>
              )}

              <div className="mb-4">
                <label className="block text-sm mb-2">Question</label>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => updateFaq(index, "question", e.target.value)}
                  placeholder="Enter your question..."
                  className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Answer</label>
                <textarea
                  value={faq.answer}
                  onChange={(e) => updateFaq(index, "answer", e.target.value)}
                  placeholder="Enter your answer..."
                  rows={3}
                  className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Code Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Code</h3>
            <p className="text-xs text-gray-500 mt-1">
              Event codes or special instructions
            </p>
          </div>
          <button
            type="button"
            onClick={addCode}
            className="flex items-center gap-2 px-4 py-2 bg-[#CCA33A] text-black rounded-lg hover:bg-[#b8922d] transition-colors text-sm font-medium"
          >
            <IoAdd className="text-lg" />
            Add Code
          </button>
        </div>

        <div className="space-y-4">
          {codes.map((code, index) => (
            <div
              key={index}
              className="border border-[#2a2a2a] rounded-lg p-4 relative"
            >
              {codes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCode(index)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remove Code"
                >
                  <IoClose className="text-xl" />
                </button>
              )}

              <div className="mb-4">
                <label className="block text-sm mb-2">Title</label>
                <input
                  type="text"
                  value={code.title}
                  onChange={(e) => updateCode(index, "title", e.target.value)}
                  placeholder="Enter code title..."
                  className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Body</label>
                <textarea
                  value={code.body}
                  onChange={(e) => updateCode(index, "body", e.target.value)}
                  placeholder="Enter code details..."
                  rows={3}
                  className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Notice */}
      <div className="flex items-start gap-2 p-4 bg-[#CCA33A]/10 rounded-lg border border-[#CCA33A]/30 mb-8">
        <span className="text-[#CCA33A] text-lg mt-0.5">⚠️</span>
        <div>
          <p className="text-sm font-medium text-[#CCA33A] mb-1">
            Ready to publish?
          </p>
          <p className="text-xs text-gray-400">
            Make sure you've reviewed all sections. Once published, your event
            will be visible to attendees.
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end items-center gap-4">
        <button
          onClick={() => setStep(step - 1)}
          disabled={isSubmitting}
          className="flex items-center gap-2 text-white border border-[#CCA33A] px-6 py-3 rounded-full font-semibold hover:bg-[#CCA33A]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IoArrowBack />
          Previous
        </button>
        <button
          onClick={handlePublishEvent}
          disabled={isSubmitting}
          className={`px-8 py-3 rounded-full font-semibold transition-colors flex items-center gap-2 ${
            isSubmitting
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-[#CCA33A] hover:bg-[#b8922d]"
          } text-black`}
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" color="border-black" />
              Publishing...
            </>
          ) : (
            "Publish Event"
          )}
        </button>
      </div>
    </div>
  );
}