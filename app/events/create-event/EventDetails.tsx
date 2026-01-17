// export default function EventDetails() {
//     return (
//         <div>
//             Event Details
//         </div>
//     )
// }



import { useState } from "react"
import { IoChevronDown, IoCalendarOutline, IoTimeOutline, IoImageOutline, IoEyeOffOutline } from "react-icons/io5"
import { FiArrowRight } from "react-icons/fi"

interface StepProps {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

export default function EventDetails({ step, setStep }: StepProps) {
  const [eventType, setEventType] = useState("")
  const [eventTitle, setEventTitle] = useState("")
  const [eventTheme, setEventTheme] = useState("")
  const [supportingText, setSupportingText] = useState("")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [venue, setVenue] = useState("")
  const [fullAddress, setFullAddress] = useState("")
  const [primaryColor, setPrimaryColor] = useState("#CCA33A")
  const [secondaryColor, setSecondaryColor] = useState("#001D3D")
  const [eventVisibility, setEventVisibility] = useState(false)
  const [bannerFile, setBannerFile] = useState<File | null>(null)

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBannerFile(e.target.files[0])
    }
  }

  return (
    <div className="text-white">
      {/* EVENT DETAILS Section */}
      <h2 className="text-lg sm:text-xl font-semibold mb-6">EVENT DETAILS</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Event Type */}
          <div>
            <label className="block text-sm mb-2">
              Event Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm appearance-none cursor-pointer focus:outline-none focus:border-gray-600"
              >
                <option value="" className="bg-gray-900">Select event type</option>
                <option value="concert" className="bg-gray-900">Concert</option>
                <option value="conference" className="bg-gray-900">Conference</option>
                <option value="workshop" className="bg-gray-900">Workshop</option>
                <option value="festival" className="bg-gray-900">Festival</option>
              </select>
              <IoChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Event Title */}
          <div>
            <label className="block text-sm mb-2">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="e.g. AfroSpook 2025"
              className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
            />
          </div>

          {/* Event Theme */}
          <div>
            <label className="block text-sm mb-2">
              Event Theme <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={eventTheme}
              onChange={(e) => setEventTheme(e.target.value)}
              placeholder="e.g. Dream Your Live - Live Your Dream"
              className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
            />
          </div>

          {/* Supporting Text */}
          <div>
            <label className="block text-sm mb-2">
              Supporting Text <span className="text-red-500">*</span>
            </label>
            <textarea
              value={supportingText}
              onChange={(e) => setSupportingText(e.target.value)}
              placeholder="Brief supporting text"
              rows={4}
              maxLength={100}
              className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">{supportingText.length}/100</p>
          </div>
        </div>

        {/* Right Column - Event Banner */}
        <div>
          <label className="block text-sm mb-2">
            Event Banner <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-[#2a2a2a] rounded-lg h-64 flex flex-col items-center justify-center cursor-pointer hover:border-gray-600 transition-colors">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleBannerUpload}
              className="hidden"
              id="banner-upload"
            />
            <label htmlFor="banner-upload" className="cursor-pointer text-center">
              <IoImageOutline className="text-4xl text-gray-600 mx-auto mb-3" />
              <p className="text-sm">
                <span className="text-[#CCA33A]">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-600 mt-1">JPG, JPEG, PNG less than 1MB</p>
            </label>
          </div>
        </div>
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6">
        {/* Date */}
        <div>
          <label className="block text-sm mb-2">
            Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="12 May - 13 May, 2025"
              className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
            />
            <IoCalendarOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-sm mb-2">
            Start time <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              placeholder="4:00 PM"
              className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
            />
            <IoTimeOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* End Time */}
        <div>
          <label className="block text-sm mb-2">
            End time <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              placeholder="10:00 PM"
              className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
            />
            <IoTimeOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Venue and Address */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Venue */}
        <div>
          <label className="block text-sm mb-2">
            Venue <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="e.g., The Warehouse, Berlin"
            className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
          />
        </div>

        {/* Full Address */}
        <div>
          <label className="block text-sm mb-2">Full Address</label>
          <input
            type="text"
            value={fullAddress}
            onChange={(e) => setFullAddress(e.target.value)}
            placeholder="Street address, city, postal code, country"
            className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
          />
        </div>
      </div>

      {/* BRAND COLOR Section */}
      <h2 className="text-lg sm:text-xl font-semibold mt-10 mb-6">BRAND COLOR</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Primary Color */}
        <div>
          <label className="block text-sm mb-2">
            Primary <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            <div className="relative">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-12 h-12 rounded-lg cursor-pointer border-0 outline-none"
                style={{ backgroundColor: primaryColor }}
              />
            </div>
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="flex-1 bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 uppercase"
            />
          </div>
        </div>

        {/* Secondary Color */}
        <div>
          <label className="block text-sm mb-2">
            Secondary <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            <div className="relative">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-12 h-12 rounded-lg cursor-pointer border-0 outline-none"
                style={{ backgroundColor: secondaryColor }}
              />
            </div>
            <input
              type="text"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="flex-1 bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 uppercase"
            />
          </div>
        </div>
      </div>

      {/* Event Visibility Toggle */}
      <div className="bg-[#151515] border border-gray-800 rounded-lg p-4 sm:p-6 mt-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IoEyeOffOutline className="text-xl text-gray-400" />
          <div>
            <p className="text-sm font-medium">Event Visibility</p>
            <p className="text-xs text-gray-500 mt-0.5">Event is hidden from public view</p>
          </div>
        </div>
        <button
          onClick={() => setEventVisibility(!eventVisibility)}
          className={`relative w-14 h-7 rounded-full transition-colors ${
            eventVisibility ? "bg-[#CCA33A]" : "bg-gray-700"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
              eventVisibility ? "translate-x-7" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Proceed Button */}
      <div className="flex justify-end mt-8">
        <button onClick={() => setStep(step + 1)} className="bg-[#CCA33A] text-black font-semibold px-8 py-3 rounded-full flex items-center gap-2 hover:bg-[#b8922d] transition-colors">
          Proceed
          <FiArrowRight />
        </button>
      </div>
    </div>
  )
}