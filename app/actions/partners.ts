"use server";

import { protectedFetch } from "@/lib/protectedFetch";
import { Partner } from "@/types/partnersType";

export async function getAllPartners() {
  const res = await protectedFetch<{
    message: string;
    success: boolean;
    data: Partner[];
  }>("/partners", {
    method: "GET",
  });

  return res;
}

export async function createPartner(partnerData: CreatePartnerInput) {
  const res = await protectedFetch<{
    message: string;
    success: boolean;
    data: Partner;
  }>("/partners", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: partnerData
  });

  return res;
}

// TypeScript types/interfaces
export interface CreatePartnerInput {
  partnerName: string;
  brandLogo: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  sponsorshipTier:"" | "platinum" | "gold" | "silver" | "bronze";
  associatedEvents: string[];
  partnershipStartDate: string;
  partnershipEndDate: string;
  internalNotes?: string;
  visibilityControl: {
    publicWebsite: boolean;
    partnershipPage: boolean;
  };
}