export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "shortlisted"
  | "accepted"
  | "rejected";

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "draft",
  "submitted",
  "under_review",
  "shortlisted",
  "accepted",
  "rejected",
];

export const statusLabel = (status: ApplicationStatus): string =>
  status
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

export type CategoryField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "multiselect" | "file" | "url" | "number";
  required: boolean;
  options?: string[];
  order: number;
};

export type OpenCallCategory = {
  _id: string;
  slug: string;
  name: string;
  description: string;
  active: boolean;
  fields: CategoryField[];
  order: number;
};

export type ApplicationListItem = {
  _id: string;
  status: ApplicationStatus;
  createdAt: string;
  submittedAt: string | null;
  applicant: { fullName: string; email: string; phoneNumber: string; country?: string; city?: string };
  category: { name: string; slug: string };
};

export type ApplicationDetail = ApplicationListItem & {
  answers: { fieldName: string; value: any }[];
  files: {
    fieldName: string;
    url: string;
    originalName: string;
    resourceType: "image" | "video" | "raw";
  }[];
  reviewNote: string | null;
  category: OpenCallCategory;
};

export type ApplicationFilters = {
  categorySlug?: string;
  status?: ApplicationStatus;
  search?: string;
};

export type ApplicationsListResponse = {
  success: boolean;
  data: {
    applications: ApplicationListItem[];
    total: number;
    page: number;
    pages: number;
  };
};

export type OpenCallStats = {
  total: number;
  byStatus: Record<ApplicationStatus, number>;
  byCategory: { category: string; slug: string; count: number }[];
};