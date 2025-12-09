export interface PharmaBrandPayload {
  _id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  contact?: {
    email?: string;
    phone?: string;
  };
  isActive: boolean;
}
