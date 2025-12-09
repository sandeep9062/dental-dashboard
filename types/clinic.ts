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
}
