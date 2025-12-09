"use client";
import React, { useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  useGetPopUpFormsQuery,
  useDeletePopUpFormMutation,
} from "@/services/popUpFormApi";
import { Enquiry } from "@/types";

export default function DentalEnquiriesAdmin() {
  const { data: enquiries, isLoading } = useGetPopUpFormsQuery();
  const [deletePopUpForm] = useDeletePopUpFormMutation();
  const [selected, setSelected] = useState<Enquiry | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deletePopUpForm(id).unwrap();
      toast.success("Enquiry deleted successfully");
    } catch (error) {
      toast.error("Failed to delete enquiry");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="mb-4 text-2xl font-semibold text-gray-800">
        🦷 Dental Trip 
      </h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Country</th>
                <th className="px-4 py-2 border">Treatment</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries?.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{item.fullName}</td>
                  <td className="px-4 py-2">{item.email}</td>
                  <td className="px-4 py-2">{item.country}</td>
                  <td className="px-4 py-2">{item.treatmentRequired}</td>
                  <td className="px-4 py-2">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                  <td className="flex justify-center gap-2 px-4 py-2">
                    <button
                      onClick={() => setSelected(item)}
                      className="text-blue-500"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Modal */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        >
          <div className="relative w-full max-w-lg mx-auto bg-white rounded-lg shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Enquiry Details
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="p-1.5 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              {selected.fileUrl && (
                <div className="mb-4">
                  <h3 className="mb-2 font-semibold text-gray-700">
                    Attachment
                  </h3>
                  <img
                    src={selected.fileUrl}
                    alt="Enquiry attachment"
                    className="w-full h-auto rounded-lg shadow-sm"
                  />
                </div>
              )}
              <div className="space-y-3">
                {Object.entries(selected)
                  .filter(([key]) => key !== "fileUrl" && key !== "_id")
                  .map(([key, val]) => (
                    <div
                      key={key}
                      className="grid grid-cols-3 gap-4 text-sm"
                    >
                      <dt className="font-medium text-gray-500 capitalize">
                        {key.replace(/([A-Z])/g, " $1")}:
                      </dt>
                      <dd className="col-span-2 text-gray-800">
                        {String(val) || "N/A"}
                      </dd>
                    </div>
                  ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end p-4 border-t">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
