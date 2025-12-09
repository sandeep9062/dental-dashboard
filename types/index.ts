export interface Enquiry {
  _id: string;
  fullName: string;
  email: string;
  country: string;
  treatmentRequired: string;
  expectedTravelDate?: string;
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
}
