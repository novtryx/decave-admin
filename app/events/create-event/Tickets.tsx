import { IoAddOutline, IoTrashOutline, IoPencilOutline } from "react-icons/io5"
import { IoArrowBack, IoArrowForward } from "react-icons/io5"
import { useTicketStore } from "@/store/create-events/Ticket";
import { useCocktailStore } from "@/store/create-events/Cocktail";
import { useSingleEventStore } from "@/store/events/SingleEvent";
import { useLoadingStore } from "@/store/LoadingState";
import { useSearchParams } from "next/navigation";
import { EditEventAction } from "@/app/actions/event";
import { toDateInputValue } from "@/constants/functions";
import { TICKET_TIER_CATEGORIES, getTierLabel } from "@/constants/ticketTiers";
import Spinner from "@/components/Spinner";
import { useState, useEffect } from "react";

interface StepProps {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

interface ValidationErrors {
  tickets?: {
    [key: number]: {
      ticketName?: string;
      price?: string;
      quantity?: string;
      saleDate?: string;
      benefits?: {
        [key: number]: string;
      };
    };
  };
}

export default function Tickets({ step, setStep }: StepProps) {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id') ?? "";

  const {
    tickets,
    addTicket,
    deleteTicket,
    updateTicket,
    toggleExpand,
    addBenefit,
    deleteBenefit,
    updateBenefit,
    initializeTickets,
  } = useTicketStore()

  const {
    cocktails,
    addCocktail,
    deleteCocktail,
    updateCocktail,
    toggleExpand: toggleCocktailExpand,
    initializeCocktails,
  } = useCocktailStore()

  const { event } = useSingleEventStore();
  const { startLoading, stopLoading } = useLoadingStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitError, setSubmitError] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);

  /** Initialize form with event data if available */
  useEffect(() => {
    if (event?.tickets && event.tickets.length > 0 && !isInitialized && eventId) {
      console.log("Initializing Tickets with:", event.tickets);
      
      const initialTickets = event.tickets.map((ticket, index) => ({
        id: Date.now() + index,
        ticketName: ticket.ticketName || "",
        price: ticket.price?.toString() || "",
        quantity: ticket.availableQuantity?.toString() || ticket.initialQuantity?.toString() || "",
        saleStartDate: toDateInputValue(ticket.saleStartDate),
        saleEndDate: toDateInputValue(ticket.saleEndDate),
        tierCategory: ticket.tierCategory || "standard",
        benefits: ticket.benefits?.length > 0
          ? ticket.benefits.map((benefit, benefitIndex) => ({
              id: Date.now() + index * 1000 + benefitIndex,
              text: benefit || "",
            }))
          : [{ id: Date.now() + index * 1000, text: "" }],
        isExpanded: false,
        status: "Active" as const,
        soldCount: (ticket.initialQuantity || 0) - (ticket.availableQuantity || 0),
      }));

      initializeTickets(initialTickets);
      setIsInitialized(true);
    }
  }, [event, initializeTickets, isInitialized, eventId]);

  /** Initialize cocktail menu with event data if available */
  const [isCocktailsInitialized, setIsCocktailsInitialized] = useState(false);
  useEffect(() => {
    if (event?.cocktails && event.cocktails.length > 0 && !isCocktailsInitialized && eventId) {
      const initialCocktails = event.cocktails.map((cocktail, index) => ({
        id: Date.now() + index,
        _id: cocktail._id,
        name: cocktail.name || "",
        description: cocktail.description || "",
        price: cocktail.price?.toString() || "",
        quantity:
          cocktail.availableQuantity?.toString() || cocktail.initialQuantity?.toString() || "",
        isExpanded: false,
      }));

      initializeCocktails(initialCocktails);
      setIsCocktailsInitialized(true);
    }
  }, [event, initializeCocktails, isCocktailsInitialized, eventId]);

  /** Validate all required fields */
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {
      tickets: {},
    };

    tickets.forEach((ticket, index) => {
      const ticketErrors: {
        ticketName?: string;
        price?: string;
        quantity?: string;
        saleDate?: string;
        benefits?: { [key: number]: string };
      } = {};

      // Ticket Name validation
      if (!ticket.ticketName || ticket.ticketName.trim() === "") {
        ticketErrors.ticketName = "Ticket name is required";
      }

      // Price validation
      if (!ticket.price || ticket.price.trim() === "") {
        ticketErrors.price = "Price is required";
      } else if (Number(ticket.price) <= 0) {
        ticketErrors.price = "Price must be greater than 0";
      } else if (isNaN(Number(ticket.price))) {
        ticketErrors.price = "Price must be a valid number";
      }

      // Quantity validation
      if (!ticket.quantity || ticket.quantity.trim() === "") {
        ticketErrors.quantity = "Quantity is required";
      } else if (Number(ticket.quantity) < 0) {
        ticketErrors.quantity = "Quantity must be a positive number";
      } else if (isNaN(Number(ticket.quantity))) {
        ticketErrors.quantity = "Quantity must be a valid number";
      } else if (!Number.isInteger(Number(ticket.quantity))) {
        ticketErrors.quantity = "Quantity must be a whole number";
      }

      // Sale date range validation (both optional, but if both are
      // set, end must be after start)
      if (
        ticket.saleStartDate &&
        ticket.saleEndDate &&
        new Date(ticket.saleEndDate) <= new Date(ticket.saleStartDate)
      ) {
        ticketErrors.saleDate = "Sale end date must be after sale start date";
      }

      // Benefits validation
      const benefitErrors: { [key: number]: string } = {};
      ticket.benefits.forEach((benefit, benefitIndex) => {
        if (!benefit.text || benefit.text.trim() === "") {
          benefitErrors[benefitIndex] = "Benefit description is required";
        } else if (benefit.text.trim().length < 3) {
          benefitErrors[benefitIndex] = "Benefit must be at least 3 characters";
        }
      });

      if (Object.keys(benefitErrors).length > 0) {
        ticketErrors.benefits = benefitErrors;
      }

      if (Object.keys(ticketErrors).length > 0) {
        newErrors.tickets![index] = ticketErrors;
      }
    });

    // Check if at least one ticket exists
    if (tickets.length === 0) {
      setSubmitError("Please add at least one ticket tier");
      return false;
    }

    // Clean up empty tickets object
    if (Object.keys(newErrors.tickets!).length === 0) {
      delete newErrors.tickets;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Handle form submission */
  const handleSaveTicket = async () => {
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
    const data = {
      stage: step,
      tickets: tickets.map((ticket) => ({
        ticketName: ticket.ticketName.trim(),
        price: Number(ticket.price),
        currency: "NGN",
        initialQuantity: Number(ticket.quantity),
        availableQuantity: Number(ticket.quantity),
        saleStartDate: ticket.saleStartDate || null,
        saleEndDate: ticket.saleEndDate || null,
        tierCategory: ticket.tierCategory || "standard",
        benefits: ticket.benefits
          .map((benefit) => benefit.text.trim())
          .filter((text) => text !== ""),
      })),
      cocktails: cocktails
        .filter((c) => c.name.trim() && c.price)
        .map((cocktail) => ({
          name: cocktail.name.trim(),
          description: cocktail.description.trim(),
          price: Number(cocktail.price),
          currency: "NGN",
          initialQuantity: Number(cocktail.quantity) || 0,
          availableQuantity: Number(cocktail.quantity) || 0,
        })),
    };

    console.log("Saving tickets data:", data);

    const res = await EditEventAction(data, eventId);

    // ✅ Check for error using 'in' operator
    if ('error' in res) {
      setSubmitError(res.error);
      console.log("Error:", res.error);
      return;
    }

    setStep(step + 1);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    setSubmitError(errorMessage);
    console.error("Error saving tickets:", error);
  } finally {
    setIsSubmitting(false);
    stopLoading();
  }
};


  /** Get ticket index for error handling */
  const getTicketIndex = (ticketId: number) => {
    return tickets.findIndex((t) => t.id === ticketId);
  };

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

      {/* Global Error Message */}
      {submitError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
          <p className="text-red-500 text-sm">{submitError}</p>
        </div>
      )}

      {/* Tickets */}
      <div className="space-y-6">
        {tickets.map((ticket) => {
          const ticketIndex = getTicketIndex(ticket.id);
          const ticketErrors = errors.tickets?.[ticketIndex] || {};

          return (
            <div
              key={ticket.id}
              className={`border rounded-lg p-6 ${
                Object.keys(ticketErrors).length > 0
                  ? "border-red-500"
                  : "border-[#2a2a2a]"
              }`}
            >
              {ticket.isExpanded ? (
                // Expanded Form
                <div className="space-y-6">
                  {/* Ticket Header with Error Indicator */}
                  {Object.keys(ticketErrors).length > 0 && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg">
                      <p className="text-red-500 text-sm">
                        Please complete all required fields for this ticket tier
                      </p>
                    </div>
                  )}

                  {/* Ticket Name */}
                  <div>
                    <label className="block text-sm mb-2">
                      Ticket Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      list={`ticket-name-suggestions-${ticket.id}`}
                      value={ticket.ticketName}
                      onChange={(e) => {
                        updateTicket(ticket.id, "ticketName", e.target.value);
                        setErrors((prev) => {
                          const newTickets = { ...prev.tickets };
                          if (newTickets[ticketIndex]) {
                            delete newTickets[ticketIndex].ticketName;
                            if (Object.keys(newTickets[ticketIndex]).length === 0) {
                              delete newTickets[ticketIndex];
                            }
                          }
                          return { ...prev, tickets: newTickets };
                        });
                      }}
                      placeholder="e.g. Early Bird, Regular, VIP, Table for 4"
                      className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 ${
                        ticketErrors.ticketName ? "border-red-500" : "border-[#2a2a2a]"
                      }`}
                    />
                    {/* Suggestions only — this is a free-text label, not
                        an enum. Use "Tier Category" below for the
                        canonical categorization analytics relies on. */}
                    <datalist id={`ticket-name-suggestions-${ticket.id}`}>
                      {TICKET_TIER_CATEGORIES.map((category) => (
                        <option key={category} value={getTierLabel(category)} />
                      ))}
                    </datalist>
                    {ticketErrors.ticketName && (
                      <p className="text-red-500 text-xs mt-1">
                        {ticketErrors.ticketName}
                      </p>
                    )}
                  </div>

                  {/* Price, Quantity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2">
                        Price (₦) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={ticket.price}
                        onChange={(e) => {
                          updateTicket(ticket.id, "price", e.target.value);
                          setErrors((prev) => {
                            const newTickets = { ...prev.tickets };
                            if (newTickets[ticketIndex]) {
                              delete newTickets[ticketIndex].price;
                              if (Object.keys(newTickets[ticketIndex]).length === 0) {
                                delete newTickets[ticketIndex];
                              }
                            }
                            return { ...prev, tickets: newTickets };
                          });
                        }}
                        placeholder="0"
                        className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 ${
                          ticketErrors.price ? "border-red-500" : "border-[#2a2a2a]"
                        }`}
                      />
                      {ticketErrors.price && (
                        <p className="text-red-500 text-xs mt-1">
                          {ticketErrors.price}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm mb-2">
                        Quantity Available <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={ticket.quantity}
                        onChange={(e) => {
                          updateTicket(ticket.id, "quantity", e.target.value);
                          setErrors((prev) => {
                            const newTickets = { ...prev.tickets };
                            if (newTickets[ticketIndex]) {
                              delete newTickets[ticketIndex].quantity;
                              if (Object.keys(newTickets[ticketIndex]).length === 0) {
                                delete newTickets[ticketIndex];
                              }
                            }
                            return { ...prev, tickets: newTickets };
                          });
                        }}
                        placeholder="0"
                        className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 ${
                          ticketErrors.quantity ? "border-red-500" : "border-[#2a2a2a]"
                        }`}
                      />
                      {ticketErrors.quantity && (
                        <p className="text-red-500 text-xs mt-1">
                          {ticketErrors.quantity}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Tier Category */}
                  <div className="mt-4">
                    <label className="block text-sm mb-2">
                      Tier Category
                    </label>
                    <select
                      value={ticket.tierCategory || "standard"}
                      onChange={(e) =>
                        updateTicket(ticket.id, "tierCategory", e.target.value)
                      }
                      className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600"
                    >
                      {TICKET_TIER_CATEGORIES.map((category) => (
                        <option key={category} value={category} className="bg-[#111111]">
                          {getTierLabel(category)}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Used for tier performance analytics — pick the closest match.
                    </p>
                  </div>

                  {/* Sale Start Date, Sale End Date (optional) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm mb-2">
                        Sale Start Date{" "}
                        <span className="text-gray-500 text-xs">(optional)</span>
                      </label>
                      <input
                        type="date"
                        value={ticket.saleStartDate}
                        onChange={(e) => {
                          updateTicket(ticket.id, "saleStartDate", e.target.value);
                          setErrors((prev) => {
                            const newTickets = { ...prev.tickets };
                            if (newTickets[ticketIndex]) {
                              delete newTickets[ticketIndex].saleDate;
                              if (Object.keys(newTickets[ticketIndex]).length === 0) {
                                delete newTickets[ticketIndex];
                              }
                            }
                            return { ...prev, tickets: newTickets };
                          });
                        }}
                        className="w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 border-[#2a2a2a]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">
                        Sale End Date{" "}
                        <span className="text-gray-500 text-xs">(optional)</span>
                      </label>
                      <input
                        type="date"
                        value={ticket.saleEndDate}
                        onChange={(e) => {
                          updateTicket(ticket.id, "saleEndDate", e.target.value);
                          setErrors((prev) => {
                            const newTickets = { ...prev.tickets };
                            if (newTickets[ticketIndex]) {
                              delete newTickets[ticketIndex].saleDate;
                              if (Object.keys(newTickets[ticketIndex]).length === 0) {
                                delete newTickets[ticketIndex];
                              }
                            }
                            return { ...prev, tickets: newTickets };
                          });
                        }}
                        className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 ${
                          ticketErrors.saleDate ? "border-red-500" : "border-[#2a2a2a]"
                        }`}
                      />
                    </div>
                    {ticketErrors.saleDate && (
                      <p className="text-red-500 text-xs sm:col-span-2">
                        {ticketErrors.saleDate}
                      </p>
                    )}
                  </div>

                  {/* Benefits Section */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-sm font-medium">
                          Benefit <span className="text-red-500">*</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          Exceptional benefit for this tier
                        </p>
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
                      {ticket.benefits.map((benefit, benefitIndex) => {
                        const benefitError =
                          ticketErrors.benefits?.[benefitIndex];

                        return (
                          <div key={benefit.id}>
                            <div className="flex gap-3 items-center">
                              <input
                                type="text"
                                value={benefit.text}
                                onChange={(e) => {
                                  updateBenefit(
                                    ticket.id,
                                    benefit.id,
                                    e.target.value
                                  );
                                  setErrors((prev) => {
                                    const newTickets = { ...prev.tickets };
                                    if (
                                      newTickets[ticketIndex]?.benefits?.[benefitIndex]
                                    ) {
                                      delete newTickets[ticketIndex].benefits![
                                        benefitIndex
                                      ];
                                      if (
                                        Object.keys(
                                          newTickets[ticketIndex].benefits || {}
                                        ).length === 0
                                      ) {
                                        delete newTickets[ticketIndex].benefits;
                                      }
                                      if (
                                        Object.keys(newTickets[ticketIndex]).length ===
                                        0
                                      ) {
                                        delete newTickets[ticketIndex];
                                      }
                                    }
                                    return { ...prev, tickets: newTickets };
                                  });
                                }}
                                placeholder="e.g. Access to Main Venues"
                                className={`flex-1 bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 placeholder:text-gray-600 ${
                                  benefitError ? "border-red-500" : "border-[#2a2a2a]"
                                }`}
                              />
                              {ticket.benefits.length > 1 && (
                                <button
                                  onClick={() =>
                                    deleteBenefit(ticket.id, benefit.id)
                                  }
                                  className="text-red-500 hover:text-red-400 transition-colors"
                                >
                                  <IoTrashOutline className="text-lg" />
                                </button>
                              )}
                            </div>
                            {benefitError && (
                              <p className="text-red-500 text-xs mt-1">
                                {benefitError}
                              </p>
                            )}
                          </div>
                        );
                      })}
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
                      <h3 className="text-lg font-semibold">
                        {ticket.ticketName || "Unnamed Ticket"}
                      </h3>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          ticket.status === "Active"
                            ? "text-green-500 bg-green-500/10"
                            : "text-gray-500 bg-gray-500/10"
                        }`}
                      >
                        {ticket.status}
                      </span>
                      {Object.keys(ticketErrors).length > 0 && (
                        <span className="text-xs font-medium px-2 py-1 rounded text-red-500 bg-red-500/10">
                          Incomplete
                        </span>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-[#CCA33A] mb-1">
                      ₦{Number(ticket.price || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Quantity: {ticket.quantity || 0}
                    </p>
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
                          strokeDasharray={`${
                            (ticket.soldCount / Number(ticket.quantity || 1)) *
                            175.93
                          } 175.93`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-semibold">
                          {ticket.soldCount}/{ticket.quantity || 0}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => toggleExpand(ticket.id)}
                        className="text-gray-400 hover:text-white transition-colors"
                        aria-label="Edit ticket"
                      >
                        <IoPencilOutline className="text-lg" />
                      </button>
                      <button
                        onClick={() => deleteTicket(ticket.id)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                        aria-label="Delete ticket"
                      >
                        <IoTrashOutline className="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Cocktails / Drinks Add-On Menu (optional) */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold">Cocktails & Drinks (Optional)</h3>
            <p className="text-sm text-gray-500 mt-1">
              Buyers can add these at checkout, always at 20% off the price you set here —
              that discount is applied automatically platform-wide.
            </p>
          </div>
          <button
            type="button"
            onClick={addCocktail}
            className="flex items-center gap-2 px-4 py-2 border border-[#2a2a2a] rounded-lg text-sm hover:bg-[#1a1a1a] transition-colors shrink-0"
          >
            <IoAddOutline /> Add Cocktail
          </button>
        </div>

        {cocktails.length === 0 ? (
          <p className="text-sm text-gray-600 py-6 text-center border border-dashed border-[#2a2a2a] rounded-lg">
            No cocktails added — this section is optional.
          </p>
        ) : (
          <div className="space-y-3">
            {cocktails.map((cocktail) => {
              const discountedPrice = cocktail.price
                ? (Number(cocktail.price) * 0.8).toFixed(0)
                : null;

              return (
                <div key={cocktail.id} className="border border-[#2a2a2a] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleCocktailExpand(cocktail.id)}
                      className="flex-1 flex items-center gap-2 text-left"
                    >
                      <span className="font-medium">
                        {cocktail.name || "Untitled Cocktail"}
                      </span>
                      {discountedPrice && (
                        <span className="text-xs text-gray-500">
                          ₦{Number(cocktail.price).toLocaleString()} →{" "}
                          <span className="text-[#22C55E]">₦{Number(discountedPrice).toLocaleString()}</span> after discount
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCocktail(cocktail.id)}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                      aria-label="Delete cocktail"
                    >
                      <IoTrashOutline className="text-lg" />
                    </button>
                  </div>

                  {cocktail.isExpanded && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm mb-2">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={cocktail.name}
                          onChange={(e) => updateCocktail(cocktail.id, "name", e.target.value)}
                          placeholder="e.g. Mojito, Margarita"
                          className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2">Description</label>
                        <input
                          type="text"
                          value={cocktail.description}
                          onChange={(e) =>
                            updateCocktail(cocktail.id, "description", e.target.value)
                          }
                          placeholder="Short description (optional)"
                          className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-2">
                            Price (₦) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={cocktail.price}
                            onChange={(e) => updateCocktail(cocktail.id, "price", e.target.value)}
                            placeholder="0"
                            className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600"
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-2">Quantity Available</label>
                          <input
                            type="number"
                            min="0"
                            value={cocktail.quantity}
                            onChange={(e) =>
                              updateCocktail(cocktail.id, "quantity", e.target.value)
                            }
                            placeholder="0"
                            className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Best Practices */}
      <div className="border border-[#CCA33A]/30 bg-[#CCA33A]/5 rounded-lg p-4 sm:p-6 mt-8">
        <p className="text-sm font-medium text-[#CCA33A] mb-3">
          Ticket tier best practices:
        </p>
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
        <button
          onClick={() => setStep(step - 1)}
          disabled={isSubmitting}
          className="flex items-center gap-2 text-white border border-[#CCA33A] px-6 py-3 rounded-full font-semibold hover:bg-[#CCA33A]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IoArrowBack />
          Previous
        </button>
        <button
          onClick={handleSaveTicket}
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
  );
}