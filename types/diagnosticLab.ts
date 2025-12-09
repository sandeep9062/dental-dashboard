export interface DiagnosticLab {
  _id: string;
  name: string;
  state: string;
  location: string;
  rating: number;
  bookUrl?: string;
  website?: string;
  whatsapp?: string;
  mapUrl?: string;
  img: string;
  isActive: boolean;
}
