// export default function Tickets() {
//     return (
//         <div>
//             Tickets
//         </div>
//     )
// }

import { useState } from "react"
import { IoAddOutline, IoTrashOutline, IoCalendarOutline, IoChevronDown, IoPencilOutline } from "react-icons/io5"
import { IoArrowBack, IoArrowForward } from "react-icons/io5"

interface Benefit {
  id: number;
  text: string;
}

interface Ticket {
  id: number;
  ticketName: string;
  price: string;
  quantity: string;
  salesDate: string;
  benefits: Benefit[];
  isExpanded: boolean;
  status: 'Active' | 'Inactive';
  soldCount: number;
}


interface StepProps {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

export default function Tickets({ step, setStep }: StepProps) {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 1,
      ticketName: "Regular",
      price: "5000",
      quantity: "100",
      salesDate: "01/02/2026 - 12/02/2026",
      benefits: [{ id: 1, text: "" }],
      isExpanded: false,
      status: 'Active',
      soldCount: 0
    }
  ])

  const addTicket = () => {
    const newTicket: Ticket = {
      id: Date.now(),
      ticketName: "",
      price: "",
      quantity: "",
      salesDate: "",
      benefits: [{ id: Date.now(), text: "" }],
      isExpanded: true,
      status: 'Inactive',
      soldCount: 0
    }
    setTickets([...tickets, newTicket])
  }

  const deleteTicket = (id: number) => {
    setTickets(tickets.filter(ticket => ticket.id !== id))
  }

  const updateTicket = (id: number, field: keyof Ticket, value: any) => {
    setTickets(tickets.map(ticket => 
      ticket.id === id ? { ...ticket, [field]: value } : ticket
    ))
  }

  const addBenefit = (ticketId: number) => {
    setTickets(tickets.map(ticket => {
      if (ticket.id === ticketId) {
        const newBenefit: Benefit = { id: Date.now(), text: "" }
        return { ...ticket, benefits: [...ticket.benefits, newBenefit] }
      }
      return ticket
    }))
  }

  const deleteBenefit = (ticketId: number, benefitId: number) => {
    setTickets(tickets.map(ticket => {
      if (ticket.id === ticketId && ticket.benefits.length > 1) {
        return { ...ticket, benefits: ticket.benefits.filter(b => b.id !== benefitId) }
      }
      return ticket
    }))
  }

  const updateBenefit = (ticketId: number, benefitId: number, text: string) => {
    setTickets(tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          benefits: ticket.benefits.map(b => 
            b.id === benefitId ? { ...b, text } : b
          )
        }
      }
      return ticket
    }))
  }

  const toggleExpand = (id: number) => {
    setTickets(tickets.map(ticket => 
      ticket.id === id ? { ...ticket, isExpanded: !ticket.isExpanded } : ticket
    ))
  }

  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">TICKET</h2>
          <p className="text-xs text-gray-500 mt-1">Setup ticket tier for attendees</p>
        </div>
        <button
          onClick={addTicket}
          className="flex items-center gap-2 text-[#CCA33A] text-sm font-medium hover:text-[#b8922d] transition-colors"
        >
          <IoAddOutline className="text-lg" />
          Add Tier
        </button>
      </div>

      {/* Tickets */}
      <div className="space-y-6">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="border border-[#2a2a2a] rounded-lg p-6">
            {ticket.isExpanded ? (
              // Expanded Form
              <div className="space-y-6">
                {/* Ticket Name */}
                <div>
                  <label className="block text-sm mb-2">
                    Ticket Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={ticket.ticketName}
                      onChange={(e) => updateTicket(ticket.id, 'ticketName', e.target.value)}
                      className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm appearance-none cursor-pointer focus:outline-none focus:border-gray-600"
                    >
                      <option value="" className="bg-gray-900">e.g. Early Bird, Regular, VIP, Platinum</option>
                      <option value="Early Bird" className="bg-gray-900">Early Bird</option>
                      <option value="Regular" className="bg-gray-900">Regular</option>
                      <option value="VIP" className="bg-gray-900">VIP</option>
                      <option value="Platinum" className="bg-gray-900">Platinum</option>
                    </select>
                    <IoChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Price, Quantity, Sales Date */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm mb-2">
                      Price (₦) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={ticket.price}
                      onChange={(e) => updateTicket(ticket.id, 'price', e.target.value)}
                      placeholder="0"
                      className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">
                      Quantity Available <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={ticket.quantity}
                      onChange={(e) => updateTicket(ticket.id, 'quantity', e.target.value)}
                      placeholder="0"
                      className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">
                      Sales Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={ticket.salesDate}
                        onChange={(e) => updateTicket(ticket.id, 'salesDate', e.target.value)}
                        placeholder="12 May - 13 May, 2025"
                        className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
                      />
                      <IoCalendarOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Benefits Section */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="text-sm font-medium">Benefit</p>
                      <p className="text-xs text-gray-500">Exceptional benefit for this tier</p>
                    </div>
                    <button
                      onClick={() => addBenefit(ticket.id)}
                      className="flex items-center gap-1 text-[#CCA33A] text-sm font-medium hover:text-[#b8922d] transition-colors"
                    >
                      <IoAddOutline className="text-lg" />
                      Add Benefit
                    </button>
                  </div>

                  <div className="space-y-3">
                    {ticket.benefits.map((benefit, index) => (
                      <div key={benefit.id} className="flex gap-3 items-center">
                        <input
                          type="text"
                          value={benefit.text}
                          onChange={(e) => updateBenefit(ticket.id, benefit.id, e.target.value)}
                          placeholder="e.g.  Access to Main Venues"
                          className="flex-1 bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
                        />
                        {ticket.benefits.length > 1 && (
                          <button
                            onClick={() => deleteBenefit(ticket.id, benefit.id)}
                            className="text-red-500 hover:text-red-400 transition-colors"
                          >
                            <IoTrashOutline className="text-lg" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Done Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => toggleExpand(ticket.id)}
                    className="bg-white text-black font-semibold px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              // Collapsed View
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{ticket.ticketName}</h3>
                    <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded">
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-[#CCA33A] mb-1">₦{Number(ticket.price).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Sales date: {ticket.salesDate}</p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Progress Circle */}
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="#2a2a2a"
                        strokeWidth="4"
                        fill="none"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="#CCA33A"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${(ticket.soldCount / Number(ticket.quantity)) * 175.93} 175.93`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-semibold">{ticket.soldCount}/{ticket.quantity}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => toggleExpand(ticket.id)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <IoPencilOutline className="text-lg" />
                    </button>
                    <button
                      onClick={() => deleteTicket(ticket.id)}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      <IoTrashOutline className="text-lg" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Best Practices */}
      <div className="border border-[#CCA33A]/30 bg-[#CCA33A]/5 rounded-lg p-4 sm:p-6 mt-8">
        <p className="text-sm font-medium text-[#CCA33A] mb-3">Ticket tier best practices:</p>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-[#CCA33A] mt-1">•</span>
            <span>Double-check pricing before activating</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#CCA33A] mt-1">•</span>
            <span>Set realistic quantities to avoid overselling</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#CCA33A] mt-1">•</span>
            <span>Early bird tiers should end before regular sales begin</span>
          </li>
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-10">
        <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-white border border-[#CCA33A] px-6 py-3 rounded-full font-semibold hover:bg-[#CCA33A]/10 transition-colors">
          <IoArrowBack />
          Previous
        </button>
        <button onClick={() => setStep(step + 1)} className="bg-[#CCA33A] text-black font-semibold px-8 py-3 rounded-full flex items-center gap-2 hover:bg-[#b8922d] transition-colors">
          Proceed
          <IoArrowForward />
        </button>
      </div>
    </div>
  )
}