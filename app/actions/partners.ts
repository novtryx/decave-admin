// "use server";

// import { protectedFetch } from "@/lib/protectedFetch";
// import { Partner } from "@/types/partnersType";

// export async function getAllPartners() {
//   const res = await protectedFetch<{
//     message: string;
//     success: boolean;
//     data: Partner[];
//   }>("/partners", {
//     method: "GET",
//   });

//   return res;
// }

// export async function createPartner(partnerData: CreatePartnerInput) {
//   const res = await protectedFetch<{
//     message: string;
//     success: boolean;
//     data: Partner;
//   }>("/partners", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: partnerData
//   });

//   return res;
// }

// // TypeScript types/interfaces
// export interface CreatePartnerInput {
//   partnerName: string;
//   brandLogo: string;
//   contactPerson: string;
//   contactEmail: string;
//   contactPhone: string;
//   sponsorshipTier:"" | "platinum" | "gold" | "silver" | "bronze";
//   associatedEvents: string[];
//   partnershipStartDate: string;
//   partnershipEndDate: string;
//   internalNotes?: string;
//   visibilityControl: {
//     publicWebsite: boolean;
//     partnershipPage: boolean;
//   };
// }



// "use server";

// import { protectedFetch } from "@/lib/protectedFetch";

// // Define types locally to avoid import issues
// export interface Partner {
//   _id: string;
//   partnerName: string;
//   brandLogo: string;
//   contactPerson: string;
//   contactEmail: string;
//   contactPhone: string;
//   sponsorshipTier: "platinum" | "gold" | "silver" | "bronze" | "";
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

// export interface CreatePartnerInput {
//   partnerName: string;
//   brandLogo: string;
//   contactPerson: string;
//   contactEmail: string;
//   contactPhone: string;
//   sponsorshipTier: "" | "platinum" | "gold" | "silver" | "bronze";
//   associatedEvents: string[];
//   partnershipStartDate: string;
//   partnershipEndDate: string;
//   internalNotes?: string;
//   visibilityControl: {
//     publicWebsite: boolean;
//     partnershipPage: boolean;
//   };
// }

// type PartnersListResponse = {
//   message: string;
//   success: boolean;
//   data: Partner[];
// };

// type PartnerCreateResponse = {
//   message: string;
//   success: boolean;
//   data: Partner;
// };

// export async function getAllPartners(): Promise<PartnersListResponse | { error: string }> {
//   const res = await protectedFetch<PartnersListResponse>("/partners", {
//     method: "GET",
//   });

//   if (!res.success) {
//     return { error: res.error };
//   }

//   return res.data;
// }

// export async function createPartner(
//   partnerData: CreatePartnerInput
// ): Promise<PartnerCreateResponse | { error: string }> {
//   const res = await protectedFetch<PartnerCreateResponse>("/partners", {
//     method: "POST",
//     body: partnerData,
//   });

//   if (!res.success) {
//     return { error: res.error };
//   }

//   return res.data;
// }



"use server";

import { protectedFetch } from "@/lib/protectedFetch";
import { Partner } from "@/types/partnersType"; // ✅ Import the correct type

export interface CreatePartnerInput {
  partnerName: string;
  brandLogo: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  sponsorshipTier: "" | "platinum" | "gold" | "silver" | "bronze";
  associatedEvents: string[];
  partnershipStartDate: string;
  partnershipEndDate: string;
  internalNotes?: string;
  visibilityControl: {
    publicWebsite: boolean;
    partnershipPage: boolean;
  };
}

type PartnersListResponse = {
  message: string;
  success: boolean;
  data: Partner[];
};

type PartnerCreateResponse = {
  message: string;
  success: boolean;
  data: Partner;
};

export async function getAllPartners(): Promise<PartnersListResponse | { error: string }> {
  const res = await protectedFetch<PartnersListResponse>("/partners", {
    method: "GET",
  });

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}

export async function createPartner(
  partnerData: CreatePartnerInput
): Promise<PartnerCreateResponse | { error: string }> {
  const res = await protectedFetch<PartnerCreateResponse>("/partners", {
    method: "POST",
    body: partnerData,
  });

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}


