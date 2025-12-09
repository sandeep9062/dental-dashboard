export interface DentistProfile {
  _id: string;
  user: { name: string; email: string };
  specialization: string[];
  problems: string[];
  clinicName?: string;
  experienceYears?: number;
  clinicAddress?: string;
  about?: string;
  image?: string;
  isActive: boolean;
  gradCollege: string;
  gradYear: string;
  gradReg: string;
  postCollege?: string;
  postYear?: string;
  postSpec?: string;
  otherQual?: string;
  hasClinic?: boolean;
  agreeDisclaimer?: boolean;
}
