"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  useGetAllDentistsQuery,
  useToggleDentistActiveMutation,
  useUpdateDentistProfileMutation,
} from "@/services/dentalApi";
import { DentistProfile } from "@/types/dentist";

const DentistsAdminPage: React.FC = () => {
  const { data: dentists = [], isLoading, isError, refetch } = useGetAllDentistsQuery();
  const [toggleDentistActive] = useToggleDentistActiveMutation();
  const [updateDentistProfile] = useUpdateDentistProfileMutation();

  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [selectedDentist, setSelectedDentist] = useState<DentistProfile | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await toggleDentistActive({ id, isActive: !isActive }).unwrap();
      toast.success(`Dentist ${!isActive ? "Activated" : "Deactivated"}`);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Action failed");
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedDentist) return;
    try {
      await updateDentistProfile({ id: selectedDentist._id, data: selectedDentist }).unwrap();
      toast.success("Profile updated successfully");
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update dentist profile");
    }
  };

  const filteredDentists =
    filter === "all"
      ? dentists
      : dentists.filter((d) => d.isActive === (filter === "active"));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold text-blue-600">
        Loading dentist profiles...
      </div>
    );
  }

  if (isError) {
    return (
        <div className="flex items-center justify-center h-screen text-xl font-semibold text-red-600">
            Error loading dentist profiles.
        </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-50">
      <h1 className="mb-6 text-3xl font-bold text-center text-blue-700">
        Dentist Profiles Management
      </h1>

      <div className="flex justify-center gap-4 mb-6">
        {["all", "active", "inactive"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as "all" | "active" | "inactive")}
            className={`px-4 py-2 rounded-lg border font-semibold transition ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
            }`}
          >
            {f === "all"
              ? "All Dentists"
              : f === "active"
              ? "Active"
              : "Inactive"}
          </button>
        ))}
      </div>

      <div className="p-4 overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-sm text-left text-blue-900 bg-blue-100 md:text-base">
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Specialization</th>
              <th className="p-3 border">Experience</th>
              <th className="p-3 border">Clinic Name</th>
              <th className="p-3 border">Clinic Address</th>
              <th className="p-3 border">Graduation College</th>
              <th className="p-3 border">Graduation Year</th>
              <th className="p-3 text-center border">Status</th>
              <th className="p-3 text-center border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDentists.length > 0 ? (
              filteredDentists.map((dentist) => (
                <motion.tr
                  key={dentist._id}
                  whileHover={{ scale: 1.02 }}
                  className="transition border-b hover:bg-blue-50"
                >
                  <td className="p-3">{dentist.user?.name}</td>
                  <td className="p-3">{dentist.user?.email}</td>
                  <td className="p-3">
                    {dentist.specialization?.join(", ") || "—"}
                  </td>
                  <td className="p-3 text-center">
                    {dentist.experienceYears
                      ? `${dentist.experienceYears} yrs`
                      : "N/A"}
                  </td>
                  <td className="p-3">{dentist.clinicName || "N/A"}</td>
                  <td className="p-3">{dentist.clinicAddress || "N/A"}</td>
                  <td className="p-3">{dentist.gradCollege || "N/A"}</td>
                  <td className="p-3">{dentist.gradYear || "N/A"}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        dentist.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {dentist.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="flex justify-center gap-3 p-3">
                    <button
                      onClick={() => {
                        setSelectedDentist(dentist);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        toggleActive(dentist._id, dentist.isActive)
                      }
                      className={`font-semibold ${
                        dentist.isActive
                          ? "text-red-600 hover:text-red-700"
                          : "text-green-600 hover:text-green-700"
                      }`}
                    >
                      {dentist.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="py-6 font-semibold text-center text-gray-500"
                >
                  No dentists found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedDentist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-lg w-[90%] max-w-lg p-6"
          >
            <h2 className="mb-4 text-2xl font-bold text-blue-700">
              Edit Dentist Profile
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Clinic Name"
                value={selectedDentist.clinicName || ""}
                onChange={(e) =>
                  setSelectedDentist({
                    ...selectedDentist,
                    clinicName: e.target.value,
                  })
                }
              />
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Experience (years)"
                value={selectedDentist.experienceYears || ""}
                onChange={(e) =>
                  setSelectedDentist({
                    ...selectedDentist,
                    experienceYears: Number(e.target.value),
                  })
                }
              />
              <textarea
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="About Dentist"
                value={selectedDentist.about || ""}
                onChange={(e) =>
                  setSelectedDentist({
                    ...selectedDentist,
                    about: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-5 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DentistsAdminPage;
