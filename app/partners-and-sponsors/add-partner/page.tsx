"use client"

import { DashboardLayout } from "@/components/DashboardLayout"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FaArrowLeftLong } from "react-icons/fa6"
import { IoCalendarOutline, IoChevronDown, IoCheckmark } from "react-icons/io5"
import { LuSave } from "react-icons/lu"
import { createPartner } from "@/app/actions/partners"
import SuccessModal from "@/components/SuccessModal"
import { getAllEvents } from "@/app/actions/event"
import { Event } from "@/types/eventsType"
import Spinner from "@/components/Spinner"
import ImageUpload from "@/components/Image"
import { usePartnerStore } from "@/store/partnership/create-patner"

interface ValidationErrors {
  partnerName?: string;
  logoUrl?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  sponsorshipTier?: string;
  selectedEvents?: string;
  startDate?: string;
  endDate?: string;
}

export default function AddPartner() {
  const {
    partnerName,
    logoUrl,
    contactPerson,
    contactEmail,
    contactPhone,
    sponsorshipTier,
    selectedEvents,
    startDate,
    endDate,
    internalNotes,
    showOnWebsite,
    featureOnPage,
    setField,
    toggleEvent,
    toggleShowOnWebsite,
    toggleFeatureOnPage,
  } = usePartnerStore();

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const router = useRouter();

  // Fetch events
  useEffect(() => {
  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const res = await getAllEvents();
      
      // ✅ Check for error using 'in' operator
      if ('error' in res) {
        console.error("Error fetching events:", res.error);
      } else {
        setEvents(res.data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoadingEvents(false);
    }
  };

  fetchEvents();
}, []);

  const handleLogoUploadComplete = (imageData: { url: string }) => {
    setField("logoUrl", imageData.url);
    setErrors(prev => ({ ...prev, logoUrl: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Partner name validation
    if (!partnerName.trim()) {
      newErrors.partnerName = "Partner name is required";
    } else if (partnerName.trim().length < 2) {
      newErrors.partnerName = "Partner name must be at least 2 characters";
    }

    // Logo validation
    if (!logoUrl) {
      newErrors.logoUrl = "Brand logo is required";
    }

    // Contact person validation
    if (!contactPerson.trim()) {
      newErrors.contactPerson = "Contact person is required";
    }

    // Email validation
    if (!contactEmail.trim()) {
      newErrors.contactEmail = "Contact email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email address";
    }

    // Phone validation
    if (!contactPhone.trim()) {
      newErrors.contactPhone = "Contact phone is required";
    } else if (contactPhone.trim().length < 10) {
      newErrors.contactPhone = "Please enter a valid phone number";
    }

    // Sponsorship tier validation
    if (!sponsorshipTier) {
      newErrors.sponsorshipTier = "Sponsorship tier is required";
    }

    // Events validation
    if (selectedEvents.length === 0) {
      newErrors.selectedEvents = "Please select at least one event";
    }

    // Start date validation
    if (!startDate.trim()) {
      newErrors.startDate = "Partnership start date is required";
    }

    // End date validation
    if (!endDate.trim()) {
      newErrors.endDate = "Partnership end date is required";
    } else if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAndPublish = async () => {
  setSubmitError("");

  if (!validateForm()) {
    setSubmitError("Please fill in all required fields correctly");
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  setIsLoading(true);

  try {
    const partnerData = {
      partnerName: partnerName.trim(),
      brandLogo: logoUrl,
      contactPerson: contactPerson.trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim(),
      sponsorshipTier,
      associatedEvents: selectedEvents,
      partnershipStartDate: startDate,
      partnershipEndDate: endDate,
      internalNotes: internalNotes.trim() || "",
      visibilityControl: {
        publicWebsite: showOnWebsite,
        partnershipPage: featureOnPage,
      },
    };

    const response = await createPartner(partnerData);

    // ✅ Check for error using 'in' operator
    if ('error' in response) {
      setSubmitError(response.error);
    } else {
      setShowSuccessModal(true);
      setTimeout(() => {
        router.push("/dashboard/partners-and-sponsors");
      }, 3000);
    }
  } catch (error) {
    console.error("Error creating partner:", error);
    setSubmitError("An error occurred while creating the partner");
  } finally {
    setIsLoading(false);
  }
};

  const handleCancel = () => {
    router.back();
  };

  return (
    <DashboardLayout>
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={`"${partnerName}" added as sponsorship partner`}
      />

      {/* Header section */}
      <section className="mb-10 px-4 py-8 rounded-xl bg-[#151515] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 lg:gap-0">
        <div className="flex gap-6 items-center">
          <div onClick={() => router.back()} className="cursor-pointer">
            <FaArrowLeftLong />
          </div>
          <div>
            <h3 className="text-xl lg:text-2xl font-semibold mb-2">Add New Partner</h3>
            <p className="text-sm text-[#b3b3b3]">
              Create a new sponsorship partnership
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-fit items-center">
          <button
            onClick={handleSaveAndPublish}
            disabled={isLoading}
            className="border-2 border-[#cca33a] w-full lg:w-fit py-2 px-6 rounded-full text-sm text-[#cca33a] flex justify-center gap-2 items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#cca33a] hover:text-black transition-colors"
          >
            {isLoading ? (
              <>
                <Spinner size="sm" color="border-[#cca33a]" />
                Saving...
              </>
            ) : (
              <>
                <LuSave />
                Save & Publish
              </>
            )}
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="hover:bg-gray-600 py-2 px-6 w-full lg:w-fit rounded-full text-sm text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        </div>
      </section>

      {/* Global Error Message */}
      {submitError && (
        <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg px-4 py-3 text-sm text-red-500">
          {submitError}
        </div>
      )}

      {/* PARTNERSHIP INFORMATION */}
      <h2 className="text-lg sm:text-xl font-semibold mb-6">PARTNERSHIP INFORMATION</h2>

      {/* Partner/Brand Name */}
      <div className="mb-6">
        <label className="block text-sm mb-2">
          Partner/Brand Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={partnerName}
          onChange={(e) => {
            setField("partnerName", e.target.value);
            setErrors(prev => ({ ...prev, partnerName: undefined }));
          }}
          placeholder="e.g. Red Bull, Pioneer DJ"
          className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-[#6f6f6f] ${
            errors.partnerName ? "border-red-500" : "border-[#2a2a2a]"
          }`}
        />
        {errors.partnerName && (
          <p className="text-red-500 text-xs mt-1">{errors.partnerName}</p>
        )}
      </div>

      {/* Brand Logo */}
      <ImageUpload
        label="Brand Logo"
        required
        accept="image/png,image/svg+xml,image/jpeg,image/jpg"
        maxSize={2}
        onUploadComplete={handleLogoUploadComplete}
        error={errors.logoUrl}
        helperText="PNG, JPG or SVG"
        previewClassName="h-28"
        initialImage={logoUrl}
      />

      {/* Contact Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 mt-6">
        {/* Contact Person */}
        <div>
          <label className="block text-sm mb-2">
            Contact Person <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={contactPerson}
            onChange={(e) => {
              setField("contactPerson", e.target.value);
              setErrors(prev => ({ ...prev, contactPerson: undefined }));
            }}
            placeholder="John Doe"
            className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-[#6f6f6f] ${
              errors.contactPerson ? "border-red-500" : "border-[#2a2a2a]"
            }`}
          />
          {errors.contactPerson && (
            <p className="text-red-500 text-xs mt-1">{errors.contactPerson}</p>
          )}
        </div>

        {/* Contact Email */}
        <div>
          <label className="block text-sm mb-2">
            Contact Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => {
              setField("contactEmail", e.target.value);
              setErrors(prev => ({ ...prev, contactEmail: undefined }));
            }}
            placeholder="support@johndoe.com"
            className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-[#6f6f6f] ${
              errors.contactEmail ? "border-red-500" : "border-[#2a2a2a]"
            }`}
          />
          {errors.contactEmail && (
            <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>
          )}
        </div>

        {/* Contact Phone */}
        <div>
          <label className="block text-sm mb-2">
            Contact Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={contactPhone}
            onChange={(e) => {
              setField("contactPhone", e.target.value);
              setErrors(prev => ({ ...prev, contactPhone: undefined }));
            }}
            placeholder="09030203647"
            className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-[#6f6f6f] ${
              errors.contactPhone ? "border-red-500" : "border-[#2a2a2a]"
            }`}
          />
          {errors.contactPhone && (
            <p className="text-red-500 text-xs mt-1">{errors.contactPhone}</p>
          )}
        </div>
      </div>

      {/* SPONSORSHIP DETAILS */}
      <h2 className="text-lg sm:text-xl font-semibold mb-6">SPONSORSHIP DETAILS</h2>

      {/* Sponsorship Tier */}
      <div className="mb-6">
        <label className="block text-sm mb-2">
          Sponsorship Tier <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            value={sponsorshipTier}
            onChange={(e) => {
              setField("sponsorshipTier", e.target.value as any);
              setErrors(prev => ({ ...prev, sponsorshipTier: undefined }));
            }}
            className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm appearance-none cursor-pointer focus:outline-none focus:border-gray-600 ${
              errors.sponsorshipTier ? "border-red-500" : "border-[#2a2a2a]"
            }`}
          >
            <option value="" className="bg-gray-900">
              Select Tier
            </option>
            <option value="platinum" className="bg-gray-900">
              Platinum
            </option>
            <option value="gold" className="bg-gray-900">
              Gold
            </option>
            <option value="silver" className="bg-gray-900">
              Silver
            </option>
            <option value="bronze" className="bg-gray-900">
              Bronze
            </option>
          </select>
          <IoChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        {errors.sponsorshipTier && (
          <p className="text-red-500 text-xs mt-1">{errors.sponsorshipTier}</p>
        )}
      </div>

      {/* Associated Events */}
      <div className="mb-6">
        <label className="block text-sm mb-2">
          Associated Events <span className="text-red-500">*</span>
        </label>
        {loadingEvents ? (
          <div className="flex items-center justify-center py-8">
            <Spinner size="md" />
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {events.map((event) => (
              <button
                key={event._id}
                type="button"
                onClick={() => {
                  toggleEvent(event._id);
                  setErrors(prev => ({ ...prev, selectedEvents: undefined }));
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedEvents.includes(event._id)
                    ? "bg-[#CCA33A] text-black"
                    : "bg-transparent border border-[#2a2a2a] text-gray-400 hover:border-gray-600"
                }`}
              >
                {event.eventDetails.eventTitle}
                {selectedEvents.includes(event._id) && (
                  <IoCheckmark className="text-base" />
                )}
              </button>
            ))}
          </div>
        )}
        {errors.selectedEvents && (
          <p className="text-red-500 text-xs mt-1">{errors.selectedEvents}</p>
        )}
      </div>

      {/* Partnership Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {/* Start Date */}
        <div>
          <label className="block text-sm mb-2">
            Partnership Start Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setField("startDate", e.target.value);
                setErrors(prev => ({ ...prev, startDate: undefined }));
              }}
              className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 ${
                errors.startDate ? "border-red-500" : "border-[#2a2a2a]"
              }`}
            />
            <IoCalendarOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          {errors.startDate && (
            <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
          )}
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm mb-2">
            Partnership End Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setField("endDate", e.target.value);
                setErrors(prev => ({ ...prev, endDate: undefined }));
              }}
              className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 ${
                errors.endDate ? "border-red-500" : "border-[#2a2a2a]"
              }`}
            />
            <IoCalendarOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          {errors.endDate && (
            <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
          )}
        </div>
      </div>

      {/* Internal Notes */}
      <div className="mb-8">
        <label className="block text-sm mb-2">
          Internal Notes <span className="text-gray-500 text-xs">(Optional)</span>
        </label>
        <textarea
          value={internalNotes}
          onChange={(e) => setField("internalNotes", e.target.value)}
          placeholder="Add internal notes about this partnership, activation details, deliverables, etc..."
          rows={5}
          maxLength={500}
          className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-[#6f6f6f] resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">{internalNotes.length}/500</p>
      </div>

      {/* VISIBILITY CONTROLS */}
      <h2 className="text-lg sm:text-xl font-semibold mb-6">VISIBILITY CONTROLS</h2>

      <div className="space-y-4 mb-10">
        {/* Show Partner on Public Website */}
        <div className="bg-[#151515] border border-[#2a2a2a] rounded-lg p-4 sm:p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Show Partner on Public Website</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Display this partner in public-facing event pages
            </p>
          </div>
          <button
            type="button"
            onClick={toggleShowOnWebsite}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              showOnWebsite ? "bg-[#CCA33A]" : "bg-gray-700"
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                showOnWebsite ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Feature on Partnership Page */}
        <div className="bg-[#151515] border border-[#2a2a2a] rounded-lg p-4 sm:p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Feature on Partnership Page</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Highlight this partner on the dedicated partnerships page
            </p>
          </div>
          <button
            type="button"
            onClick={toggleFeatureOnPage}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              featureOnPage ? "bg-[#CCA33A]" : "bg-gray-700"
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                featureOnPage ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}