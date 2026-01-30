import PartnerCard from "@/components/partners/PartnerCard";
import Spinner from "@/components/Spinner";
import { usePartnerListStore } from "@/store/partnership/get-partners";
import { Partner } from "@/types/partnersType";

export default function PartnerSponsorSection() {

     const { 
      partners, 
      isLoading
     
    } = usePartnerListStore();
  
    
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-20">
      {partners.map((item: Partner) => (
        <PartnerCard 

        key={item._id}
          logoUrl={item.brandLogo}
          name={item.partnerName}
          ticketType={item.sponsorshipTier}
          status={item.isActive ?? false}
          contactPerson={item.contactPerson}
          email={item.contactEmail}
          phone={item.contactPhone}
          associatedEvents={item.associatedEvents}
          activationNotes={item.internalNotes ?? ""}
          onEdit={() => console.log("Edit clicked")}
          onDelete={() => console.log("Delete clicked")}
        />
      ))}
    </section>
  );
}
