// import PartnerCard from "@/components/partners/PartnerCard";

// export default function PartnerSponsorSection() {
//   const partnersData = [
//     {
//       id: 1,
//       name: "Funktion-One",
//       ticketType: "Platinum" as const,
//       logoUrl: "/funktion-one-logo.png",
//       status: "Active" as const,
//       contactPerson: "Tony Andrews",
//       email: "tony@funktion-one.com",
//       phone: "+44 20 1234 5678",
//       associatedEvents: [
//         { name: "Underground Sessions Vol. 3" },
//         { name: "Bass Revolution" },
//         { name: "Summer Festival 2024" },
//       ],
//       activationNotes:
//         "Sound system provider for all major events. Logo on main stage and promotional materials.",
//       onEdit: () => console.log("Edit clicked"),
//       onDelete: () => console.log("Delete clicked"),
//     },
//     {
//       id: 2,
//       name: "Red Bull",
//       ticketType: "Bronze" as const,
//       logoUrl: "/red-bull-logo.png",
//       status: "Active" as const,
//       contactPerson: "Sarah Johnson",
//       email: "sarah.j@redbull.com",
//       phone: "+1 555 234 5678",
//       associatedEvents: [
//         { name: "Summer Vibes Festival" },
//         { name: "Bass Revolution" }
//       ],
//       activationNotes:
//         "Beverage sponsor. Bar branding and sampling station at events.",
//       onEdit: () => console.log("Edit clicked"),
//       onDelete: () => console.log("Delete clicked"),
//     },
//     {
//       id: 3,
//       name: "Pioneer DJ",
//       ticketType: "Gold" as const,
//       logoUrl: "/pioneer-dj-logo.png",
//       status: "Active" as const,
//       contactPerson: "Mike Chen",
//       email: "mike@pioneerdj.com",
//       phone: "+81 3 1234 5678",
//       associatedEvents: [
//         { name: "Underground Sessions Vol. 3" },
//         { name: "Jungle Takeover" }
//       ],
//       activationNotes:
//         "Equipment sponsor. Providing CDJ-3000s and DJM-V10 mixers.",
//       onEdit: () => console.log("Edit clicked"),
//       onDelete: () => console.log("Delete clicked"),
//     },
//     {
//       id: 4,
//       name: "Resident Advisor",
//       ticketType: "Silver" as const,
//       logoUrl: "/pioneer-dj-logo.png",
//       status: "Active" as const,
//       contactPerson: "Emma Wilson",
//       email: "emma@ra.co",
//       phone: "+44 20 9876 5432",
//       associatedEvents: [
//         { name: "Underground Sessions Vol. 3" },
//         { name: "Bass Revolution" },
//         { name: "Summer Festival 2024" },
//       ],
//       activationNotes:
//         "Media partner. Event listings and editorial coverage.",
//       onEdit: () => console.log("Edit clicked"),
//       onDelete: () => console.log("Delete clicked"),
//     },
//   ];
//   return (
//     <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-20">
//       {partnersData.map((item) => (
//         <PartnerCard
//         key={item.id}
//           logoUrl={item.logoUrl}
//           name={item.name}
//           ticketType={item.ticketType}
//           status={item.status}
//           contactPerson={item.contactPerson}
//           email={item.email}
//           phone={item.phone}
//           associatedEvents={item.associatedEvents}
//           activationNotes={item.activationNotes}
//           onEdit={() => console.log("Edit clicked")}
//           onDelete={() => console.log("Delete clicked")}
//         />
//       ))}
//     </section>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import PartnerCard from "@/components/partners/PartnerCard";
import { getAllPartners } from "@/app/actions/partners";
import { Partner } from "@/types/partnersType";

type TicketType = 'platinum' | 'gold' | 'silver' | 'bronze';

interface PartnerSponsorSectionProps {
  searchQuery?: string;
  selectedTier?: string;
}

export default function PartnerSponsorSection({ 
  searchQuery = "", 
  selectedTier = "all" 
}: PartnerSponsorSectionProps) {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPartners() {
      try {
        setLoading(true);
        const response = await getAllPartners();
        
        if (response.success && response.data) {
          setPartners(response.data);
        } else {
          setError(response.message || "Failed to fetch partners");
        }
      } catch (err) {
        setError("An error occurred while fetching partners");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPartners();
  }, []);

  // Filter partners based on search and tier
  const filteredPartners = partners.filter((partner) => {
    const matchesSearch = partner.partnerName
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
      partner.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTier = selectedTier === "all" || 
      partner.sponsorshipTier.toLowerCase() === selectedTier.toLowerCase();

    return matchesSearch && matchesTier;
  });

  if (loading) {
    return (
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-20">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-[#18181B] border border-[#27272A] rounded-xl p-6 animate-pulse"
          >
            <div className="h-20 bg-[#27272A] rounded mb-4"></div>
            <div className="h-4 bg-[#27272A] rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-[#27272A] rounded w-1/2"></div>
          </div>
        ))}
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-20">
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  if (filteredPartners.length === 0) {
    return (
      <section className="bg-[#18181B] border border-[#27272A] rounded-xl p-12 mb-20 text-center">
        <p className="text-[#B3B3B3] text-lg mb-2">
          {partners.length === 0 
            ? "No partners found" 
            : "No partners match your search"}
        </p>
        <p className="text-[#6F6F6F] text-sm">
          {partners.length === 0
            ? 'Click "Add Partner" to create your first partner'
            : "Try adjusting your search or filters"}
        </p>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-20">
      {filteredPartners.map((partner) => {
        // Capitalize first letter and cast to correct type
        const capitalizedTier = (partner.sponsorshipTier.charAt(0) + 
          partner.sponsorshipTier.slice(1)) as TicketType;
        
        // Ensure status is either 'Active' or 'Inactive'
        const partnerStatus: true | false = 
          partner.status  ? true : false;

        return (
          <PartnerCard
            key={partner._id}
            logoUrl={partner.brandLogo}
            name={partner.partnerName}
            ticketType={capitalizedTier}
            status={partnerStatus}
            contactPerson={partner.contactPerson}
            email={partner.contactEmail}
            phone={partner.contactPhone}
            associatedEvents={
              partner.associatedEvents
          }
            activationNotes={partner.internalNotes || "No notes available"}
            onEdit={() => console.log("Edit partner:", partner._id)}
            onDelete={() => console.log("Delete partner:", partner._id)}
          />
        );
      })}
    </section>
  );
}