"use client"

import { DashboardLayout } from "@/components/DashboardLayout"
import { useState } from "react"
import { IoImageOutline, IoCalendarOutline, IoChevronDown, IoCheckmark } from "react-icons/io5"

export default function AddPartner() {
  const [partnerName, setPartnerName] = useState("")
  const [logo, setLogo] = useState<File | null>(null)
  const [contactPerson, setContactPerson] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [sponsorshipTier, setSponsorshipTier] = useState("")
  const [selectedEvents, setSelectedEvents] = useState<string[]>(["AforSpook 2025", "Bass Revolution", "Summer Vibes Festival"])
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [internalNotes, setInternalNotes] = useState("")
  const [showOnWebsite, setShowOnWebsite] = useState(true)
  const [featureOnPage, setFeatureOnPage] = useState(true)

  const events = [
    "AforSpook 2025",
    "Underground Sessions Vol. 3",
    "Bass Revolution",
    "Summer Vibes Festival",
    "Jungle Takeover",
    "Others"
  ]

  const toggleEvent = (event: string) => {
    if (selectedEvents.includes(event)) {
      setSelectedEvents(selectedEvents.filter(e => e !== event))
    } else {
      setSelectedEvents([...selectedEvents, event])
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0])
    }
  }

  return (
    <DashboardLayout>
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
          onChange={(e) => setPartnerName(e.target.value)}
          placeholder="e.g. Red Bull, Pioneer DJ"
          className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
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
            accept="image/png,image/svg+xml"
            onChange={handleLogoUpload}
            className="hidden"
            id="logo-upload"
          />
          <label htmlFor="logo-upload" className="cursor-pointer text-center">
            <IoImageOutline className="text-3xl text-gray-600 mx-auto mb-2" />
            <p className="text-xs">
              <span className="text-[#CCA33A]">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-600 mt-1">PNG or SVG recommended (Max 2MB)</p>
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
            className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
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
            className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
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
            className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
          />
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
            onChange={(e) => setSponsorshipTier(e.target.value)}
            className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm appearance-none cursor-pointer focus:outline-none focus:border-gray-600"
          >
            <option value="" className="bg-gray-900">Select Tier</option>
            <option value="platinum" className="bg-gray-900">Platinum</option>
            <option value="gold" className="bg-gray-900">Gold</option>
            <option value="silver" className="bg-gray-900">Silver</option>
            <option value="bronze" className="bg-gray-900">Bronze</option>
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
              {selectedEvents.includes(event) && <IoCheckmark className="text-base" />}
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
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="13 May, 2026"
              className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
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
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="13 May, 2027"
              className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
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
          maxLength={50}
          className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">{internalNotes.length}/50</p>
      </div>

      {/* VISIBILITY CONTROLS */}
      <h2 className="text-lg sm:text-xl font-semibold mb-6">VISIBILITY CONTROLS</h2>

      <div className="space-y-4">
        {/* Show Partner on Public Website */}
        <div className="bg-gray-900/30 border border-[#2a2a2a] rounded-lg p-4 sm:p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Show Partner on Public Website</p>
            <p className="text-xs text-gray-500 mt-0.5">Display this partner in public-facing event pages</p>
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
        <div className="bg-gray-900/30 border border-[#2a2a2a] rounded-lg p-4 sm:p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Feature on Partnership Page</p>
            <p className="text-xs text-gray-500 mt-0.5">Highlight this partner on the dedicated partnerships page</p>
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
  )
}