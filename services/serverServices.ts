// src/services/serverServices.ts
// This is a server-side utility file for data fetching.

// Define the Service interface here as well for type safety
interface Service {
    _id?: string;
    slug: string;
    title: string;
    desc: string;
    longDesc: string;
    tags: string[];
    icon?: string;
    category?: string;
    featured?: boolean;
    duration?: string;
    pricing?: string;
    cta?: string;
    tools: string[];
    points: string[];
    valueProvide: string[];
    targetAudience?: string;
    keywords: string[];
    image?: string;
    serviceImage?: string;
}

const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/services`;

export async function getServiceBySlug(slug: string): Promise<Service | null> {
    try {
        const response = await fetch(`${baseUrl}/${slug}`);
        if (!response.ok) {
            // Return null on error so generateMetadata can handle the 404 case.
            console.error(`Error fetching service: ${response.status} ${response.statusText}`);
            return null;
        }
        const data = await response.json();
        // Assuming the API response is { service: {...} }
        return data.service;
    } catch (error) {
        console.error("Failed to fetch service data:", error);
        return null;
    }
}