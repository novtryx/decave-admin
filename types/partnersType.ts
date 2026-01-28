// export interface Partner {
//   _id: string;
//   partnerName: string;
//   brandLogo: string;
//   contactPerson: string;
//   contactEmail: string;
//   contactPhone: string;
//   sponsorshipTier: "platinum" | "gold" | "silver" | "bronze";
//   associatedEvents: string[];
//   partnershipStartDate: string;
//   partnershipEndDate: string;
//   internalNotes?: string;
//   visibilityControl: {
//     publicWebsite: boolean;
//     partnershipPage: boolean;
//   };
//   createdAt?: string;
//   updatedAt?: string;
// }

export interface Partner {
  _id: string;
  partnerName: string;
  brandLogo: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  sponsorshipTier: "platinum" | "gold" | "silver" | "bronze";
  associatedEvents: string[]; // Array of event IDs
  partnershipStartDate: string;
  partnershipEndDate: string;
  internalNotes?: string;
  status: "Active" | "Inactive" | "Pending";
  visibilityControl: {
    publicWebsite: boolean;
    partnershipPage: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface PartnerStats {
  totalPartners: number;
  activePartners: number;
  totalRevenue: number;
  byTier: {
    platinum: number;
    gold: number;
    silver: number;
    bronze: number;
  };
}