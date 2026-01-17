// import { DashboardLayout } from "@/components/DashboardLayout";

// export default function Settings() {
//     return (
//         <DashboardLayout>
//             Settings Page
//         </DashboardLayout>
//     )
// }

"use client"

import { useState } from "react"
import { IoPencilOutline, IoLogoFacebook, IoLogoInstagram, IoLogoYoutube } from "react-icons/io5"
import { FaXTwitter } from "react-icons/fa6"
import { DashboardLayout } from "@/components/DashboardLayout"

export default function GeneralSettings() {
  const [brandName, setBrandName] = useState("De Cave")
  const [contactEmail, setContactEmail] = useState("support@decave.com")
  const [contactPhone, setContactPhone] = useState("09030203647")
  
  const [facebook, setFacebook] = useState("")
  const [twitter, setTwitter] = useState("")
  const [instagram, setInstagram] = useState("")
  const [youtube, setYoutube] = useState("")
  const [physicalAddress, setPhysicalAddress] = useState("")
  
  const [orderConfirmation, setOrderConfirmation] = useState(false)
  const [eventReminders, setEventReminders] = useState(false)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [lowStockAlerts, setLowStockAlerts] = useState(false)
  const [dailyReports, setDailyReports] = useState(false)
  const [systemAlerts, setSystemAlerts] = useState(false)

  return (
    <DashboardLayout>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl text-[#F9F7F4] font-bold">General Settings</h1>
          <p className="text-sm text-gray-400 mt-1">Configure system-wide settings</p>
        </div>

        {/* BRAND INFORMATION */}
        <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-base font-semibold">BRAND INFORMATION</h2>
              <p className="text-xs text-gray-500 mt-1">Manage your brand identity and contact details</p>
            </div>
            <button className="flex items-center gap-2 text-[#CCA33A] text-sm hover:text-[#b8922d] transition-colors">
              <IoPencilOutline />
              Edit
            </button>
          </div>

          {/* Brand Name */}
          <div className="mb-4">
            <label className="block text-sm mb-2">Brand Name</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600"
            />
          </div>

          {/* Contact Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">Public contact for sponsor/partners</p>
            </div>
            <div>
              <label className="block text-sm mb-2">
                Contact Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">Public contact for sponsor/partners</p>
            </div>
          </div>
        </div>

        {/* CONTACT */}
        <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-base font-semibold">CONTACT</h2>
              <p className="text-xs text-gray-500 mt-1">Manage your brand social and physical location</p>
            </div>
            <button className="flex items-center gap-2 text-[#CCA33A] text-sm hover:text-[#b8922d] transition-colors">
              <IoPencilOutline />
              Update
            </button>
          </div>

          {/* Social Media Links */}
          <div className="mb-4">
            <label className="block text-sm mb-3">Social Media Links</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <IoLogoFacebook className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="Facebook handle"
                  className="w-full bg-transparent border border-[#2a2a2a] rounded-lg pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
                />
              </div>
              <div className="relative">
                <FaXTwitter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="Twitter handle"
                  className="w-full bg-transparent border border-[#2a2a2a] rounded-lg pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
                />
              </div>
              <div className="relative">
                <IoLogoInstagram className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="Instagram handle"
                  className="w-full bg-transparent border border-[#2a2a2a] rounded-lg pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
                />
              </div>
              <div className="relative">
                <IoLogoYoutube className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  placeholder="Youtube handle"
                  className="w-full bg-transparent border border-[#2a2a2a] rounded-lg pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Physical Address */}
          <div>
            <label className="block text-sm mb-2">Physical Address</label>
            <textarea
              value={physicalAddress}
              onChange={(e) => setPhysicalAddress(e.target.value)}
              placeholder="Enter physical address"
              rows={4}
              className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">Leave space blank if there's no physical address</p>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-base font-semibold">NOTIFICATIONS</h2>
              <p className="text-xs text-gray-500 mt-1">Configure alert notifications</p>
            </div>
            <button className="flex items-center gap-2 text-[#CCA33A] text-sm hover:text-[#b8922d] transition-colors">
              <IoPencilOutline />
              Edit
            </button>
          </div>

          <div className="space-y-4">
            {/* Order Confirmation */}
            <div className="flex items-center justify-between py-3 border-b border-[#2a2a2a]">
              <div>
                <p className="text-sm font-medium">Order Confirmation</p>
                <p className="text-xs text-gray-500 mt-0.5">Send confirmation emails for ticket purchases</p>
              </div>
              <button
                onClick={() => setOrderConfirmation(!orderConfirmation)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  orderConfirmation ? "bg-[#CCA33A]" : "bg-gray-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    orderConfirmation ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Event Reminders */}
            <div className="flex items-center justify-between py-3 border-b border-[#2a2a2a]">
              <div>
                <p className="text-sm font-medium">Event Reminders</p>
                <p className="text-xs text-gray-500 mt-0.5">Remind attendees about upcoming events</p>
              </div>
              <button
                onClick={() => setEventReminders(!eventReminders)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  eventReminders ? "bg-[#CCA33A]" : "bg-gray-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    eventReminders ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Marketing Emails */}
            <div className="flex items-center justify-between py-3 border-b border-[#2a2a2a]">
              <div>
                <p className="text-sm font-medium">Marketing Emails</p>
                <p className="text-xs text-gray-500 mt-0.5">Promotional and marketing communications</p>
              </div>
              <button
                onClick={() => setMarketingEmails(!marketingEmails)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  marketingEmails ? "bg-[#CCA33A]" : "bg-gray-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    marketingEmails ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Low Stock Alerts */}
            <div className="flex items-center justify-between py-3 border-b border-[#2a2a2a]">
              <div>
                <p className="text-sm font-medium">Low Stock Alerts</p>
                <p className="text-xs text-gray-500 mt-0.5">Alert when ticket inventory is low</p>
              </div>
              <button
                onClick={() => setLowStockAlerts(!lowStockAlerts)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  lowStockAlerts ? "bg-[#CCA33A]" : "bg-gray-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    lowStockAlerts ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Daily Reports */}
            <div className="flex items-center justify-between py-3 border-b border-[#2a2a2a]">
              <div>
                <p className="text-sm font-medium">Daily Reports</p>
                <p className="text-xs text-gray-500 mt-0.5">Daily sales and activity summaries</p>
              </div>
              <button
                onClick={() => setDailyReports(!dailyReports)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  dailyReports ? "bg-[#CCA33A]" : "bg-gray-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    dailyReports ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* System Alerts */}
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">System Alerts (Critical Events)</p>
                <p className="text-xs text-gray-500 mt-0.5">Receive alerts for critical system events and issues</p>
              </div>
              <button
                onClick={() => setSystemAlerts(!systemAlerts)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  systemAlerts ? "bg-[#CCA33A]" : "bg-gray-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    systemAlerts ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* LEGAL */}
        <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-base font-semibold">LEGAL</h2>
              <p className="text-xs text-gray-500 mt-1">Manage legal documents and policies</p>
            </div>
            <button className="flex items-center gap-2 text-[#CCA33A] text-sm hover:text-[#b8922d] transition-colors">
              <IoPencilOutline />
              Update
            </button>
          </div>

          {/* Terms & Conditions */}
          <div className="mb-4">
            <label className="block text-sm mb-2">Terms & Conditions</label>
            <div className="bg-[#0F0F0F] border border-[#2a2a2a] rounded-lg p-4">
              <p className="text-sm text-gray-300 mb-2">Terms & Conditions</p>
              <p className="text-xs text-gray-500">Last updated: May, 28, 2024</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">Displayed to public users</p>
          </div>

          {/* Privacy Policy */}
          <div>
            <label className="block text-sm mb-2">Privacy Policy</label>
            <div className="bg-[#0F0F0F] border border-[#2a2a2a] rounded-lg p-4">
              <p className="text-sm text-gray-300 mb-2">Privacy Policy</p>
              <p className="text-xs text-gray-500">Last updated: May, 28, 2024</p>
            </div>
          </div>
        </div>
    </DashboardLayout>
  )
}