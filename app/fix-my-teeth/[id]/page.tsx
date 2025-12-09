"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Mail, MapPin, User } from "lucide-react";
import { getFixMyTeethCaseById } from "@/services/fixMyTeethApi";

interface FixMyTeethRecord {
  _id: string;
  name: string;
  email: string;
  selectedType: string;
  selectedState: string;
  teethProblems: Record<string, string[]> | string;
  otherProblemText?: string;
  photos: string[];
  createdAt: string;
}

export default function FixMyTeethDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [record, setRecord] = useState<FixMyTeethRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchRecord = async () => {
      try {
        const result = await getFixMyTeethCaseById(id);
        if (result.success) {
          const data = result.data;

          // Parse teethProblems if it's stringified JSON
          if (typeof data.teethProblems === "string") {
            try {
              data.teethProblems = JSON.parse(data.teethProblems);
            } catch {
              console.warn("Could not parse teethProblems JSON");
            }
          }

          setRecord(data);
        } else {
          console.error("Error fetching record:", result.message);
        }
      } catch (error) {
        console.error("Error fetching record:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <Loader2 className="w-6 h-6 mb-2 animate-spin" />
        Loading record...
      </div>
    );

  if (!record)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        <p>❌ Record not found.</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-b from-gray-50 to-gray-100">
      <button
        onClick={() => router.back()}
        className="flex items-center mb-6 text-gray-700 hover:text-blue-600"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Back
      </button>

      <div className="max-w-4xl p-8 mx-auto bg-white shadow-xl rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            🦷 {record.name}
          </h1>
          <span className="px-3 py-1 text-sm font-medium text-white capitalize bg-blue-600 rounded-full">
            {record.selectedType}
          </span>
        </div>

        {/* Basic Info */}
        <div className="grid gap-4 mb-6 md:grid-cols-2">
          <div className="flex items-center gap-2 text-gray-700">
            <User className="w-5 h-5 text-blue-600" />
            <span className="font-medium">{record.name}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Mail className="w-5 h-5 text-blue-600" />
            <span>{record.email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span>{record.selectedState}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="font-semibold">Submitted:</span>{" "}
            {new Date(record.createdAt).toLocaleString()}
          </div>
        </div>

        <hr className="my-4" />

        {/* Teeth Problems */}
        <div className="mt-6">
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            Teeth Problems
          </h2>

          {record.teethProblems &&
          typeof record.teethProblems === "object" ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {Object.entries(record.teethProblems).map(
                ([tooth, issues]) => (
                  <div
                    key={tooth}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <p className="mb-2 text-sm font-semibold text-blue-700">
                      Tooth {tooth}:
                    </p>
                    <ul className="pl-5 space-y-1 text-gray-700 list-disc">
                      {(issues as string[]).map((issue, i) => (
                        <li key={i}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
          ) : typeof record.teethProblems === "string" ? (
            <p className="text-gray-700">{record.teethProblems}</p>
          ) : null}
        </div>

        {/* Other Problem Text */}
        {record.otherProblemText && (
          <div className="p-4 mt-6 border border-yellow-200 rounded-lg bg-yellow-50">
            <h2 className="mb-2 text-lg font-semibold text-yellow-700">
              Other Problem / Notes
            </h2>
            <p className="text-gray-700">{record.otherProblemText}</p>
          </div>
        )}

        {/* Uploaded Photos */}
        {record.photos && record.photos.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-xl font-semibold text-gray-800">
              Uploaded Photos
            </h2>
            <div className="flex flex-wrap gap-4">
              {record.photos.map((photo, i) => (
                <a
                  key={i}
                  href={photo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-105"
                >
                  <img
                    src={photo}
                    alt={`photo-${i}`}
                    className="object-cover w-40 h-40 border border-gray-200 shadow-sm rounded-xl"
                  />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
