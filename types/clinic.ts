export interface Clinic {
  _id?: string;
  user?: string;
  images: string[];
  name: string;
  location: string;
  state: string;
  problems: string[];
  rating: number;
  bookUrl?: string;
  website?: string;
  whatsapp?: string;
  mapUrl?: string;
  isActive: boolean;
  phoneNumbers?: string[];
  subscribedPlans?: { planName: string; startDate: string; endDate: string; status: 'past' | 'present'; offerDetails?: string }[];
  offers?: { title: string; description: string; startDate: string; endDate: string }[];
  numberOfDoctors?: number;
  socialMediaLinks?: { facebook?: string; twitter?: string; instagram?: string; linkedin?: string };
  areasServed?: string[];
  mainDoctorContact?: { name?: string; email?: string; phoneNumber?: string };
  bestTimeToConnect?: string[];
  videos?: string[];
}
