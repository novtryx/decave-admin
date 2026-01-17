// export default function Contact() {
//     return (
//         <div>
//             Contact
//         </div>
//     )
// }

import { SegmentStateProvider } from "next/dist/next-devtools/userspace/app/segment-explorer-node"
import { useState } from "react"
import { IoArrowBack } from "react-icons/io5"


interface StepProps {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

export default function Contact({step, setStep}: StepProps) {
  const [security, setSecurity] = useState("")
  const [medical, setMedical] = useState("")
  const [lostFound, setLostFound] = useState("")
  const [supportingInfo, setSupportingInfo] = useState("")

  

  return (
    <div className="text-white">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-semibold">EMERGENCY CONTACT</h2>
        <p className="text-xs text-gray-500 mt-1">Emergence contact for assistance during this event</p>
      </div>

      {/* Contact Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        {/* Security */}
        <div>
          <label className="block text-sm mb-2">
            Security <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={security}
            onChange={(e) => setSecurity(e.target.value)}
            placeholder="+234 901..."
            className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
          />
        </div>

        {/* Medical */}
        <div>
          <label className="block text-sm mb-2">
            Medical <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={medical}
            onChange={(e) => setMedical(e.target.value)}
            placeholder="+234 901..."
            className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
          />
        </div>

        {/* Lost & Found */}
        <div>
          <label className="block text-sm mb-2">
            Lost & Found <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={lostFound}
            onChange={(e) => setLostFound(e.target.value)}
            placeholder="Phone no. or location"
            className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
          />
        </div>
      </div>

      {/* Supporting Information */}
      <div className="mb-6">
        <label className="block text-sm mb-2">
          Supporting information (Optional)
        </label>
        <textarea
          value={supportingInfo}
          onChange={(e) => setSupportingInfo(e.target.value)}
          placeholder="Enter info text"
          rows={6}
          maxLength={100}
          className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">{supportingInfo.length}/100</p>
      </div>

      {/* Review Notice */}
      <div className="flex items-start gap-2 p-4 bg-gray-900/50 rounded-lg border border-[#2a2a2a] mb-8">
        <span className="text-white text-sm mt-0.5">💡</span>
        <p className="text-xs text-gray-400">
          Make sure you review all sections before clicking submit
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end items-center gap-4">
        <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-white border border-[#CCA33A] px-6 py-3 rounded-full font-semibold hover:bg-[#CCA33A]/10 transition-colors">
          <IoArrowBack />
          Previous
        </button>
        <button onClick={() => setStep(step - 1)}  className="bg-[#CCA33A] text-black font-semibold px-8 py-3 rounded-full hover:bg-[#b8922d] transition-colors">
          Complete
        </button>
      </div>
    </div>
  )
}