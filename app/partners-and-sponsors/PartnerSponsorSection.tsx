import PartnerCard from "@/components/partners/PartnerCard";

export default function PartnerSponsorSection() {
  const partnersData = [
    {
      id: 1,
      name: "Funktion-One",
      ticketType: "Platinum" as const,
      logoUrl: "/funktion-one-logo.png",
      status: "Active" as const,
      contactPerson: "Tony Andrews",
      email: "tony@funktion-one.com",
      phone: "+44 20 1234 5678",
      associatedEvents: [
        { name: "Underground Sessions Vol. 3" },
        { name: "Bass Revolution" },
        { name: "Summer Festival 2024" },
      ],
      activationNotes:
        "Sound system provider for all major events. Logo on main stage and promotional materials.",
      onEdit: () => console.log("Edit clicked"),
      onDelete: () => console.log("Delete clicked"),
    },
    {
      id: 2,
      name: "Red Bull",
      ticketType: "Bronze" as const,
      logoUrl: "/red-bull-logo.png",
      status: "Active" as const,
      contactPerson: "Sarah Johnson",
      email: "sarah.j@redbull.com",
      phone: "+1 555 234 5678",
      associatedEvents: [
        { name: "Summer Vibes Festival" },
        { name: "Bass Revolution" }
      ],
      activationNotes:
        "Beverage sponsor. Bar branding and sampling station at events.",
      onEdit: () => console.log("Edit clicked"),
      onDelete: () => console.log("Delete clicked"),
    },
    {
      id: 3,
      name: "Pioneer DJ",
      ticketType: "Gold" as const,
      logoUrl: "/pioneer-dj-logo.png",
      status: "Active" as const,
      contactPerson: "Mike Chen",
      email: "mike@pioneerdj.com",
      phone: "+81 3 1234 5678",
      associatedEvents: [
        { name: "Underground Sessions Vol. 3" },
        { name: "Jungle Takeover" }
      ],
      activationNotes:
        "Equipment sponsor. Providing CDJ-3000s and DJM-V10 mixers.",
      onEdit: () => console.log("Edit clicked"),
      onDelete: () => console.log("Delete clicked"),
    },
    {
      id: 4,
      name: "Resident Advisor",
      ticketType: "Silver" as const,
      logoUrl: "/pioneer-dj-logo.png",
      status: "Active" as const,
      contactPerson: "Emma Wilson",
      email: "emma@ra.co",
      phone: "+44 20 9876 5432",
      associatedEvents: [
        { name: "Underground Sessions Vol. 3" },
        { name: "Bass Revolution" },
        { name: "Summer Festival 2024" },
      ],
      activationNotes:
        "Media partner. Event listings and editorial coverage.",
      onEdit: () => console.log("Edit clicked"),
      onDelete: () => console.log("Delete clicked"),
    },
  ];
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-20">
      {partnersData.map((item) => (
        <PartnerCard
        key={item.id}
          logoUrl={item.logoUrl}
          name={item.name}
          ticketType={item.ticketType}
          status={item.status}
          contactPerson={item.contactPerson}
          email={item.email}
          phone={item.phone}
          associatedEvents={item.associatedEvents}
          activationNotes={item.activationNotes}
          onEdit={() => console.log("Edit clicked")}
          onDelete={() => console.log("Delete clicked")}
        />
      ))}
    </section>
  );
}
