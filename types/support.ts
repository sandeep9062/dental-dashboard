export interface SupportRequest {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "new" | "in-progress" | "resolved";
  createdAt: string;
}
