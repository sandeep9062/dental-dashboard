export interface Lead {
  _id: string;
  leadType:
    | "Patient Treatment"
    | "Medical Diagnostics (CBCT)"
    | "Medical Diagnostics (Blood Test)"
    | "Online Consultation"
    | "Patient Inquiry"
    | "Support Query"
    | "Clinic-generated Revenue"
    | "Fix My Teeth";
  source:
    | "Website"
    | "App"
    | "WhatsApp"
    | "Instagram"
    | "Ads Campaigns"
    | "Referral"
    | "Partner Clinic Referral"
    | "Email"
    | "Phone Call"
    | "Unknown";
  status:
    | "New"
    | "Contacted"
    | "Scheduled"
    | "Diagnostics completed"
    | "Consultation completed"
    | "Lost / No response"
    | "Follow-up required"
    | "Treatment plan given"
    | "Treatment plan approved"
    | "Travel confirmed"
    | "Treatment started"
    | "Treatment completed";
  createdAt: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  subject?: string;
  problem?: string;
  state?: string;
  clinicId?: string;
  diagnosticType?: "CBCT" | "Blood Test";
}
