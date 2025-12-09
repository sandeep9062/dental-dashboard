import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Lead } from "../types/leads";
import axios from "axios";

// Import existing API services and their hooks
import { useGetContactsQuery } from "./contactApi";
import { useGetSupportsQuery } from "./supportApi";
import { getFixMyTeethCases } from "./fixMyTeethApi"; // Direct axios call
import { useGetClinicsQuery } from "./clinicApi";
import { useGetCbctOpgLabsQuery } from "./cbctOpgLabs";
import { useGetDiagnosticLabsQuery } from "./diagnosticLabApi";
import { useGetAllPatientsQuery } from "./patientsApi";

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

export const leadsApi = createApi({
  reducerPath: "leadsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }), // Base URL doesn't strictly matter for aggregation
  endpoints: (builder) => ({
    getLeads: builder.query<Lead[], void>({
      async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
        const token = getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        let allLeads: Lead[] = [];

        // Fetch Contacts (Patient Inquiries / Online Consultations)
        try {
          const contactsResponse = await baseQuery({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/contacts`, headers });
          if (contactsResponse.data) {
            const contacts = (contactsResponse.data as any)?.contacts || [];
            const contactLeads: Lead[] = contacts.map((contact: any) => ({
              _id: contact._id,
              leadType: "Patient Inquiry", // Assuming contact form submissions are patient inquiries
              source: "Website", // Assuming contacts are from the website
              status: contact.status || "New", // Assuming status might exist on contact, default to New
              createdAt: contact.createdAt,
              name: contact.name,
              email: contact.email,
              phone: contact.phone,
              message: contact.message,
            }));
            allLeads = allLeads.concat(contactLeads);
          }
        } catch (error) {
          console.error("Error fetching contacts:", error);
        }

        // Fetch Support Queries
        try {
          const supportsResponse = await baseQuery({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/support`, headers });
          if (supportsResponse.data) {
            const supports = supportsResponse.data as any[];
            const supportLeads: Lead[] = supports.map((support: any) => ({
              _id: support._id,
              leadType: "Support Query",
              source: "Website", // Assuming support queries are from the website
              status: support.status || "New",
              createdAt: support.createdAt,
              name: support.name,
              email: support.email,
              phone: support.phone,
              subject: support.subject,
              message: support.message,
            }));
            allLeads = allLeads.concat(supportLeads);
          }
        } catch (error) {
          console.error("Error fetching supports:", error);
        }

        // Fetch Fix My Teeth Cases (Direct axios call)
        try {
          const fixMyTeethResponse = await getFixMyTeethCases();
          if (fixMyTeethResponse.success) {
            const fixMyTeethCases = fixMyTeethResponse.data as any[];
            const fixMyTeethLeads: Lead[] = fixMyTeethCases.map((f: any) => ({
              _id: f._id,
              leadType: "Fix My Teeth",
              source: "Website", // Assuming from website
              status: "New", // Default status for Fix My Teeth leads
              createdAt: f.createdAt, // Assuming createdAt exists
              name: f.name,
              email: f.email,
              state: f.selectedState,
              problem: f.dentalProblem, // Assuming a field like dentalProblem
            }));
            allLeads = allLeads.concat(fixMyTeethLeads);
          }
        } catch (error) {
          console.error("Error fetching Fix My Teeth cases:", error);
        }

        // Fetch Clinics (Clinic-generated revenue leads - assuming new registrations)
        try {
          const clinicsResponse = await baseQuery({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/clinics`, headers });
          if (clinicsResponse.data) {
            const clinics = (clinicsResponse.data as any)?.data || [];
            const clinicLeads: Lead[] = clinics.map((clinic: any) => ({
              _id: clinic._id,
              leadType: "Clinic-generated Revenue",
              source: "Unknown", // Source might be internal or registration, defaulting to Unknown
              status: clinic.isActive ? "Contacted" : "New", // If active, assume contacted
              createdAt: clinic.createdAt, // Assuming createdAt exists
              name: clinic.name,
              email: clinic.user?.email, // Assuming clinic has an associated user with email
              state: clinic.state,
              clinicId: clinic._id,
            }));
            allLeads = allLeads.concat(clinicLeads);
          }
        } catch (error) {
          console.error("Error fetching clinics:", error);
        }

        // Fetch CBCT/OPG Labs (Medical Diagnostics - CBCT leads - assuming new registrations)
        try {
          const cbctOpgLabsResponse = await baseQuery({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/cbct-opg-labs`, headers });
          if (cbctOpgLabsResponse.data) {
            const cbctOpgLabs = (cbctOpgLabsResponse.data as any)?.data || [];
            const cbctOpgLeads: Lead[] = cbctOpgLabs.map((lab: any) => ({
              _id: lab._id,
              leadType: "Medical Diagnostics (CBCT)",
              source: "Unknown", // Defaulting to Unknown
              status: lab.isActive ? "Contacted" : "New",
              createdAt: lab.createdAt, // Assuming createdAt exists
              name: lab.name,
              email: lab.user?.email, // Assuming lab has an associated user with email
              state: lab.state,
            }));
            allLeads = allLeads.concat(cbctOpgLeads);
          }
        } catch (error) {
          console.error("Error fetching CBCT/OPG Labs:", error);
        }

        // Fetch Diagnostic Labs (Medical Diagnostics - Blood Test leads - assuming new registrations)
        try {
          const diagnosticLabsResponse = await baseQuery({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/diagnostic-labs`, headers });
          if (diagnosticLabsResponse.data) {
            const diagnosticLabs = (diagnosticLabsResponse.data as any)?.data || [];
            const diagnosticLeads: Lead[] = diagnosticLabs.map((lab: any) => ({
              _id: lab._id,
              leadType: "Medical Diagnostics (Blood Test)",
              source: "Unknown", // Defaulting to Unknown
              status: lab.isActive ? "Contacted" : "New",
              createdAt: lab.createdAt, // Assuming createdAt exists
              name: lab.name,
              email: lab.user?.email, // Assuming lab has an associated user with email
              state: lab.state,
            }));
            allLeads = allLeads.concat(diagnosticLeads);
          }
        } catch (error) {
          console.error("Error fetching Diagnostic Labs:", error);
        }

        // Fetch Patients (Patient Treatment Leads - assuming new registrations)
        try {
          const patientsResponse = await baseQuery({ url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/patients`, headers });
          if (patientsResponse.data) {
            const patients = patientsResponse.data as any[];
            const patientLeads: Lead[] = patients.map((patient: any) => ({
              _id: patient._id,
              leadType: "Patient Treatment",
              source: "Website", // Assuming patient registrations are from the website
              status: patient.isActive ? "Contacted" : "New",
              createdAt: patient.createdAt, // Assuming createdAt exists
              name: patient.name,
              email: patient.email,
              phone: patient.phone,
            }));
            allLeads = allLeads.concat(patientLeads);
          }
        } catch (error) {
          console.error("Error fetching Patients:", error);
        }

        // Sort all leads by date (newest first)
        allLeads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return { data: allLeads };
      },
    }),
  }),
});

export const { useGetLeadsQuery } = leadsApi;
