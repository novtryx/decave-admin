"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import {
  IoImageOutline,
  IoCalendarOutline,
  IoChevronDown,
  IoCheckmark,
} from "react-icons/io5";
import { LuSave } from "react-icons/lu";
import { createPartner } from "@/app/actions/partners";
import SuccessModal from "@/components/SuccessModal";
// import { uploadImage } from "@/app/actions/image-upload"
import { uploadImageClient } from "@/utils/upload-image";

export default function EditPartner() {
  const [partnerName, setPartnerName] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [sponsorshipTier, setSponsorshipTier] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [showOnWebsite, setShowOnWebsite] = useState(true);
  const [featureOnPage, setFeatureOnPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const events = [
    "AfroSpook 2025",
    "Underground Sessions Vol. 3",
    "Bass Revolution",
    "Summer Vibes Festival",
    "Jungle Takeover",
    "Others",
  ];

  const toggleEvent = (event: string) => {
    if (selectedEvents.includes(event)) {
      setSelectedEvents(selectedEvents.filter((e) => e !== event));
    } else {
      setSelectedEvents([...selectedEvents, event]);
    }
  };
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];

    setIsUploadingLogo(true);
    try {
      const url = await uploadImageClient(file); // client-side fetch
      setLogoUrl(url);
      console.log("Logo uploaded:", url);
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const validateForm = () => {
    if (!partnerName.trim()) {
      setErrorMessage("Partner name is required");
      return false;
    }
    if (!logoUrl) {
      setErrorMessage("Brand logo is required");
      return false;
    }
    if (!contactPerson.trim()) {
      setErrorMessage("Contact person is required");
      return false;
    }
    if (!contactEmail.trim()) {
      setErrorMessage("Contact email is required");
      return false;
    }
    if (!contactPhone.trim()) {
      setErrorMessage("Contact phone is required");
      return false;
    }
    if (!sponsorshipTier) {
      setErrorMessage("Sponsorship tier is required");
      return false;
    }
    if (selectedEvents.length === 0) {
      setErrorMessage("Please select at least one event");
      return false;
    }
    if (!startDate.trim()) {
      setErrorMessage("Partnership start date is required");
      return false;
    }
    if (!endDate.trim()) {
      setErrorMessage("Partnership end date is required");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleSaveAndPublish = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Prepare partner data with the uploaded logo URL
      const partnerData = {
        partnerName,
        brandLogo: logoUrl,
        contactPerson,
        contactEmail,
        contactPhone,
        sponsorshipTier: sponsorshipTier as
          | "platinum"
          | "gold"
          | "silver"
          | "bronze",
        associatedEvents: selectedEvents,
        partnershipStartDate: startDate,
        partnershipEndDate: endDate,
        internalNotes: internalNotes || undefined,
        visibilityControl: {
          publicWebsite: showOnWebsite,
          partnershipPage: featureOnPage,
        },
      };

      // Create partner
      const response = await createPartner(partnerData);

      // ✅ Check for error using 'in' operator
      if ("error" in response) {
        setErrorMessage(response.error);
      } else {
        setShowSuccessModal(true);
        // Redirect after modal closes
        setTimeout(() => {
          router.push("/dashboard/partners");
        }, 3000);
      }
    } catch (error) {
      console.error("Error creating partner:", error);
      setErrorMessage("An error occurred while creating the partner");
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
            <h3 className="text-xl lg:text-2xl font-semibold mb-2">Edit</h3>
            <p className="text-sm text-[#b3b3b3]">
              Configure partnership details
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-fit items-center">
          <button
            onClick={handleSaveAndPublish}
            disabled={isLoading || isUploadingLogo}
            className="border-2 border-[#cca33a] w-full lg:w-fit py-2 px-6 rounded-full text-sm text-[#cca33a] flex justify-center gap-2 items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#cca33a] hover:text-black transition-colors"
          >
            <LuSave />
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="hover:bg-red-50 py-2 px-6 w-full lg:w-fit rounded-full text-sm text-red-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            End Partnership
          </button>
        </div>
      </section>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg px-4 py-3 text-sm text-red-500">
          {errorMessage}
        </div>
      )}

      {/* PARTNERSHIP INFORMATION */}
      <h2 className="text-lg sm:text-xl font-semibold mb-6">
        PARTNERSHIP INFORMATION
      </h2>

      {/* Partner/Brand Name */}
      <div className="mb-6">
        <label className="block text-sm mb-2">
          Partner/Brand Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={partnerName}
          onChange={(e) => setPartnerName(e.target.value)}
          placeholder="e.g. Red Bull, Pioneer DJ"
          className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-[#6f6f6f]"
        />
      </div>

      {/* Brand Logo */}
      <div className="mb-6">
        <label className="block text-sm mb-2">
          Brand Logo <span className="text-red-500">*</span>
        </label>
        <div className="border-2 border-dashed border-[#2a2a2a] rounded-lg h-28 flex flex-col items-center justify-center cursor-pointer hover:border-gray-600 transition-colors">
          <input
            type="file"
            accept="image/png,image/svg+xml,image/jpeg,image/jpg"
            onChange={handleLogoUpload}
            className="hidden"
            id="logo-upload"
            disabled={isUploadingLogo}
          />
          <label
            htmlFor="logo-upload"
            className="cursor-pointer text-center w-full h-full flex items-center justify-center"
          >
            {isUploadingLogo ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CCA33A] mb-2"></div>
                <p className="text-xs text-gray-400">Uploading...</p>
              </div>
            ) : logoPreview ? (
              <div className="flex flex-col items-center">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="h-20 object-contain mx-auto"
                />
                <p className="text-xs text-green-500 mt-1">
                  ✓ Uploaded successfully
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <IoImageOutline className="text-3xl text-gray-600 mb-2" />
                <p className="text-xs">
                  <span className="text-[#CCA33A]">Click to upload</span> or
                  drag and drop
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  PNG, JPG or SVG (Max 2MB)
                </p>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Contact Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {/* Contact Person */}
        <div>
          <label className="block text-sm mb-2">
            Contact Person <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            placeholder="John Doe"
            className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-[#6f6f6f]"
          />
        </div>

        {/* Contact Email */}
        <div>
          <label className="block text-sm mb-2">
            Contact Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="support@johndoe.com"
            className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-[#6f6f6f]"
          />
        </div>

        {/* Contact Phone */}
        <div>
          <label className="block text-sm mb-2">
            Contact Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            placeholder="09030203647"
            className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-[#6f6f6f]"
          />
        </div>
      </div>

      {/* SPONSORSHIP DETAILS */}
      <h2 className="text-lg sm:text-xl font-semibold mb-6">
        SPONSORSHIP DETAILS
      </h2>

      {/* Sponsorship Tier */}
      <div className="mb-6">
        <label className="block text-sm mb-2">
          Sponsorship Tier <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            value={sponsorshipTier}
            onChange={(e) => setSponsorshipTier(e.target.value)}
            className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm appearance-none cursor-pointer focus:outline-none focus:border-gray-600"
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
      </div>

      {/* Associated Events */}
      <div className="mb-6">
        <label className="block text-sm mb-2">
          Associated Events <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {events.map((event) => (
            <button
              key={event}
              onClick={() => toggleEvent(event)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                selectedEvents.includes(event)
                  ? "bg-[#CCA33A] text-black"
                  : "bg-transparent border border-[#2a2a2a] text-gray-400 hover:border-gray-600"
              }`}
            >
              {event}
              {selectedEvents.includes(event) && (
                <IoCheckmark className="text-base" />
              )}
            </button>
          ))}
        </div>
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
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-[#6f6f6f]"
            />
            <IoCalendarOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
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
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-[#6f6f6f]"
            />
            <IoCalendarOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Internal Notes */}
      <div className="mb-8">
        <label className="block text-sm mb-2">Internal Notes</label>
        <textarea
          value={internalNotes}
          onChange={(e) => setInternalNotes(e.target.value)}
          placeholder="Add internal notes about this partnership, activation details, deliverables, etc..."
          rows={5}
          maxLength={500}
          className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-[#6f6f6f] resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">{internalNotes.length}/500</p>
      </div>

      {/* VISIBILITY CONTROLS */}
      <h2 className="text-lg sm:text-xl font-semibold mb-6">
        VISIBILITY CONTROLS
      </h2>

      <div className="space-y-4">
        {/* Show Partner on Public Website */}
        <div className="bg-[#151515] border border-[#2a2a2a] rounded-lg p-4 sm:p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">
              Show Partner on Public Website
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Display this partner in public-facing event pages
            </p>
          </div>
          <button
            onClick={() => setShowOnWebsite(!showOnWebsite)}
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
            onClick={() => setFeatureOnPage(!featureOnPage)}
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
