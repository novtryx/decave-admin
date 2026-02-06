// "use client";

// import { useEffect, useState } from "react";
// import PartnerCard from "@/components/partners/PartnerCard";
// import { getAllPartners } from "@/app/actions/partners";
// import { Partner } from "@/types/partnersType";

// type TicketType = 'platinum' | 'gold' | 'silver' | 'bronze';

// interface PartnerSponsorSectionProps {
//   searchQuery?: string;
//   selectedTier?: string;
// }

// export default function PartnerSponsorSection({ 
//   searchQuery = "", 
//   selectedTier = "all" 
// }: PartnerSponsorSectionProps) {
//   const [partners, setPartners] = useState<Partner[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//   async function fetchPartners() {
//     try {
//       setLoading(true);
//       const response = await getAllPartners();
      
//       // ✅ Check for error using 'in' operator
//       if ('error' in response) {
//         setError(response.error);
//       } else {
//         setPartners(response.data);
//       }
//     } catch (err) {
//       setError("An error occurred while fetching partners");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   fetchPartners();
// }, []);


//   // Filter partners based on search and tier
//   const filteredPartners = partners.filter((partner) => {
//     const matchesSearch = partner.partnerName
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase()) ||
//       partner.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
    
//     const matchesTier = selectedTier === "all" || 
//       partner.sponsorshipTier.toLowerCase() === selectedTier.toLowerCase();

//     return matchesSearch && matchesTier;
//   });

//   // Loading State with Yellow Spinner
//   if (loading) {
//     return (
//       <section className="flex items-center justify-center py-20 mb-20">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cca33a]"></div>
//       </section>
//     );
//   }

//   // Error State
//   if (error) {
//     return (
//       <section className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-20">
//         <p className="text-red-500">{error}</p>
//       </section>
//     );
//   }

//   // Empty State
//   if (filteredPartners.length === 0) {
//     return (
//       <section className="bg-[#18181B] border border-[#27272A] rounded-xl p-12 mb-20 text-center">
//         <p className="text-[#B3B3B3] text-lg mb-2">
//           {partners.length === 0 
//             ? "No partners found" 
//             : "No partners match your search"}
//         </p>
//         <p className="text-[#6F6F6F] text-sm">
//           {partners.length === 0
//             ? 'Click "Add Partner" to create your first partner'
//             : "Try adjusting your search or filters"}
//         </p>
//       </section>
//     );
//   }

//   // Partners Grid
//   return (
//     <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-20">
//       {filteredPartners.map((partner) => {
//         const capitalizedTier = (partner.sponsorshipTier.charAt(0) + 
//           partner.sponsorshipTier.slice(1)) as TicketType;
        
//         const partnerStatus: true | false = 
//           partner.status ? true : false;

//         return (
//           <PartnerCard
//             key={partner._id}
//             logoUrl={partner.brandLogo}
//             name={partner.partnerName}
//             ticketType={capitalizedTier}
//             status={partnerStatus}
//             contactPerson={partner.contactPerson}
//             email={partner.contactEmail}
//             phone={partner.contactPhone}
//             associatedEvents={partner.associatedEvents}
//             activationNotes={partner.internalNotes || "No notes available"}
//             onEdit={() => console.log("Edit partner:", partner._id)}
//             onDelete={() => console.log("Delete partner:", partner._id)}
//           />
//         );
//       })}
//     </section>
//   );
// }


"use client";

import { useEffect, useMemo } from "react";
import PartnerCard from "@/components/partners/PartnerCard";
import { usePartnerStore } from "@/store/partners/partnerStore";

type TicketType = 'platinum' | 'gold' | 'silver' | 'bronze';

interface PartnerSponsorSectionProps {
  searchQuery?: string;
  selectedTier?: string;
}

export default function PartnerSponsorSection({ 
  searchQuery = "", 
  selectedTier = "all" 
}: PartnerSponsorSectionProps) {
  const { partners, loading, error, fetchPartners } = usePartnerStore();

  useEffect(() => {
    // Only fetch if we don't have partners yet
    if (partners.length === 0) {
      fetchPartners();
    }
  }, [fetchPartners, partners.length]);

  // Filter partners based on search and tier using useMemo for performance
  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      const matchesSearch = partner.partnerName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        partner.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTier = selectedTier === "all" || 
        partner.sponsorshipTier.toLowerCase() === selectedTier.toLowerCase();

      return matchesSearch && matchesTier;
    });
  }, [partners, searchQuery, selectedTier]);

  // Loading State with Yellow Spinner
  if (loading) {
    return (
      <section className="flex items-center justify-center py-20 mb-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cca33a]"></div>
      </section>
    );
  }

  // Error State
  if (error) {
    return (
      <section className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-20">
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  // Empty State
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

  // Partners Grid
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-20">
      {filteredPartners.map((partner) => {
        const capitalizedTier = (partner.sponsorshipTier.charAt(0) + 
          partner.sponsorshipTier.slice(1)) as TicketType;
        
        const partnerStatus: true | false = 
          partner.status ? true : false;

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
            associatedEvents={partner.associatedEvents}
            activationNotes={partner.internalNotes || "No notes available"}
            onEdit={() => console.log("Edit partner:", partner._id)}
            onDelete={() => console.log("Delete partner:", partner._id)}
          />
        );
      })}
    </section>
  );
}