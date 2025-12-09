"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { Edit, ToggleLeft, ToggleRight } from "lucide-react";
import {
  useGetCbctOpgLabsQuery,
  useUpdateCbctOpgLabMutation,
} from "@/services/cbctOpgLabs";
import { CbctOpgLab } from "@/types/cbctOpgLab";

const CbctOpgLabsAdminPage: React.FC = () => {
  const { data: labs = [], isLoading } = useGetCbctOpgLabsQuery();
  const [updateCbctOpgLab] = useUpdateCbctOpgLabMutation();

  const [selectedLab, setSelectedLab] = useState<CbctOpgLab | null>(null);
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const filteredLabs =
    labs.filter(
      (lab: CbctOpgLab) =>
        lab.name.toLowerCase().includes(search.toLowerCase()) ||
        lab.state.toLowerCase().includes(search.toLowerCase())
    ) || [];

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const lab = labs.find((lab) => lab._id === id);
      if (!lab) return;

      const formData = new FormData();
      formData.append("isActive", String(!isActive));

      await updateCbctOpgLab({ id, formData }).unwrap();
      toast.success(`Lab ${!isActive ? "activated" : "deactivated"} successfully`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const handleEdit = (lab: CbctOpgLab) => {
    setSelectedLab(lab);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!selectedLab) return;
    try {
      const formData = new FormData();
      Object.entries(selectedLab).forEach(([key, value]) => {
        if (key !== "user" && key !== "_id") {
          formData.append(key, value);
        }
      });

      await updateCbctOpgLab({ id: selectedLab._id, formData }).unwrap();
      toast.success("Lab details updated successfully");
      setIsEditing(false);
      setSelectedLab(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update lab");
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold text-blue-600">
        🏥 CBCT & OPG Labs Management
      </h1>

      {/* Search Filter */}
      <input
        type="text"
        placeholder="Search by name or state..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full px-4 py-2 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Table */}
      {isLoading ? (
        <p className="text-center text-gray-500">Loading labs...</p>
      ) : filteredLabs.length === 0 ? (
        <p className="text-center text-gray-500">No labs found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-xl">
            <thead className="text-gray-700 bg-blue-100">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">State</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-center">Rating</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLabs.map((lab) => (
                <tr
                  key={lab._id}
                  className="transition duration-150 border-t hover:bg-gray-50"
                >
                  <td className="p-3">
                    {lab.img ? (
                      <img
                        src={lab.img}
                        alt={lab.name}
                        className="object-cover rounded-lg w-14 h-14"
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="p-3 font-semibold">{lab.name}</td>
                  <td className="p-3">{lab.state}</td>
                  <td className="p-3">{lab.location}</td>
                  <td className="p-3 text-center">{lab.rating}</td>
                  <td
                    className={`p-3 text-center font-bold ${
                      lab.isActive ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {lab.isActive ? "Active" : "Inactive"}
                  </td>
                  <td className="flex items-center justify-center gap-3 p-3">
                    <button
                      onClick={() => handleEdit(lab)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleToggleActive(lab._id, lab.isActive)}
                      className="text-yellow-500 hover:text-yellow-700"
                    >
                      {lab.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && selectedLab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-lg p-6 bg-white shadow-xl rounded-xl">
            <h2 className="mb-4 text-2xl font-bold text-blue-600">Edit Lab Details</h2>
            <div className="space-y-3">
              {["name", "state", "location", "rating", "bookUrl", "website", "whatsapp", "mapUrl", "img"].map(
                (field) => (
                  <input
                    key={field}
                    type="text"
                    placeholder={field}
                    value={(selectedLab as any)[field] || ""}
                    onChange={(e) =>
                      setSelectedLab({
                        ...selectedLab,
                        [field]: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  />
                )
              )}
              <button
                onClick={handleSave}
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setSelectedLab(null);
                }}
                className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CbctOpgLabsAdminPage;
