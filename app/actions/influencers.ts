"use server"
import { publicFetch2 } from "@/lib/publicFetch";


export async function getInfluencers(page= 1): Promise<any | { error: string }> {
  const res = await publicFetch2<any>(`/influencers?page=${page}&limit=20`, {
    method: "GET",
  });

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}

export async function getInfluencersWithdraws(page= 1): Promise<any | { error: string }> {
  const res = await publicFetch2<any>(`/influencers/withdrawals?page=${page}&limit=20`, {
    method: "GET",
  });

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}

export async function updateInfluencerWithdrawal(id: string, status: string): Promise<any | { error: string }> {
  const res = await publicFetch2<any>(`/influencers/withdrawals/${id}/status`, {
    method: "PATCH",
    body: {status}
  });

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}