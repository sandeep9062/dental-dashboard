"use client";
"use client";
import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Edit, Trash, Plus, ToggleRight, ToggleLeft } from "lucide-react";
import {
  useGetClinicsQuery,
  useAddClinicMutation,
  useUpdateClinicMutation,
  useDeleteClinicMutation,
} from "../../services/clinicApi";
import { Clinic } from "../../types/clinic";

const ClinicsAdminPage: React.FC = () => {
  const { data: clinics = [], error, isLoading } = useGetClinicsQuery();
  
  
  const [addClinic] = useAddClinicMutation();
  const [updateClinic] = useUpdateClinicMutation();
  const [deleteClinic] = useDeleteClinicMutation();

  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSearch = (val: string) => {
    setSearch(val);
  };

  const filteredClinics = clinics.filter(
    (clinic: Clinic) =>
      clinic.name.toLowerCase().includes(search.toLowerCase()) ||
      clinic.state.toLowerCase().includes(search.toLowerCase()) ||
      clinic.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleActive = async (id: string, clinic: Clinic) => {
    try {
      const updatedStatus = { isActive: !clinic.isActive };
      await updateClinic({ id, formData: updatedStatus }).unwrap();
      toast.success(
        `Clinic ${!clinic.isActive ? "activated" : "deactivated"} successfully`
      );
    } catch {
      toast.error("Failed to update clinic status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this clinic?")) return;
    try {
      await deleteClinic(id).unwrap();
      toast.success("Clinic deleted successfully");
    } catch {
      toast.error("Failed to delete clinic");
    }
  };

  const handleSave = async () => {
    if (!selectedClinic) return;
    try {
      const formData = new FormData();
      Object.entries(selectedClinic).forEach(([key, value]) => {
        if (key === "problems") {
          formData.append(key, JSON.stringify(value));
        } else if (key !== "images" && value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (isAdding) {
        await addClinic(formData).unwrap();
        toast.success("Clinic added successfully");
      } else {
        await updateClinic({ id: selectedClinic._id!, formData }).unwrap();
        toast.success("Clinic updated successfully");
      }
      setIsAdding(false);
      setIsEditing(false);
      setSelectedClinic(null);
      setImageFile(null);
    } catch {
      toast.error("Failed to save clinic");
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setImageFile(file);
        if (selectedClinic) {
          setSelectedClinic({
            ...selectedClinic,
            images: [URL.createObjectURL(file)],
          });
        }
      }
    },
    [selectedClinic]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-600">
          🏥 Clinics Management
        </h1>
        <button
          onClick={() => {
            setIsAdding(true);
            setSelectedClinic({
              images: [],
              name: "",
              location: "",
              state: "",
              problems: [],
              rating: 0,
              isActive: true,
            });
          }}
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <Plus size={20} /> Add Clinic
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by name, state, or location..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {isLoading ? (
        <p className="text-center text-gray-500">Loading clinics...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error fetching clinics</p>
      ) : filteredClinics.length === 0 ? (
        <p className="text-center text-gray-500">No clinics found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-xl">
            <thead className="text-gray-700 bg-blue-100">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">State</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Problems</th>
                <th className="p-3 text-center">Rating</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClinics.map((clinic) => (
                <tr
                  key={clinic._id}
                  className="transition duration-150 border-t hover:bg-gray-50"
                >
                  <td className="p-3">
                    {clinic.images ? (
                      <Image
                        width={20}
                        height={20}
                        src={clinic?.images?.[0]}
                        alt={clinic.name}
                        className="object-cover rounded-lg w-14 h-14"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gray-200 rounded-lg" />
                    )}
                  </td>
                  <td className="p-3 font-semibold">{clinic.name}</td>
                  <td className="p-3">{clinic.state}</td>
                  <td className="p-3">{clinic.location}</td>
                  <td className="p-3">{clinic.problems.join(", ")}</td>
                  <td className="p-3 text-center">{clinic.rating}</td>
                  <td
                    className={`p-3 text-center font-bold ${
                      clinic.isActive ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {clinic.isActive ? "Active" : "Inactive"}
                  </td>
                  <td className="flex items-center justify-center gap-3 p-3">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setSelectedClinic(clinic);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleToggleActive(clinic._id!, clinic)}
                      className="text-yellow-500 hover:text-yellow-700"
                    >
                      {clinic.isActive ? (
                        <ToggleRight size={22} />
                      ) : (
                        <ToggleLeft size={22} />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(clinic._id!)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(isEditing || isAdding) && selectedClinic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-lg p-6 bg-white shadow-xl rounded-xl">
            <h2 className="mb-4 text-2xl font-bold text-blue-600">
              {isAdding ? "Add New Clinic" : "Edit Clinic"}
            </h2>
            <div className="space-y-3">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
                  isDragActive
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300"
                }`}
              >
                <input {...getInputProps()} />
                {selectedClinic.images && selectedClinic.images.length > 0 ? (
                  <img
                    src={selectedClinic.images[0]}
                    alt="Preview"
                    className="object-contain w-full h-32 mx-auto mb-2 rounded-md"
                  />
                ) : null}
                {isDragActive ? (
                  <p>Drop the image here ...</p>
                ) : (
                  <p>Drag 'n' drop an image here, or click to select one</p>
                )}
              </div>
              {[
                "name",
                "state",
                "location",
                "website",
                "bookUrl",
                "whatsapp",
                "mapUrl",
              ].map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={
                    (selectedClinic[field as keyof Clinic] as string) || ""
                  }
                  onChange={(e) =>
                    setSelectedClinic({
                      ...selectedClinic,
                      [field]: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              ))}
              <textarea
                placeholder="Problems (comma separated)"
                value={selectedClinic.problems.join(", ")}
                onChange={(e) =>
                  setSelectedClinic({
                    ...selectedClinic,
                    problems: e.target.value.split(",").map((p) => p.trim()),
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="number"
                placeholder="Rating"
                value={selectedClinic.rating}
                onChange={(e) =>
                  setSelectedClinic({
                    ...selectedClinic,
                    rating: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
              />

              <button
                onClick={handleSave}
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setIsAdding(false);
                  setSelectedClinic(null);
                  setImageFile(null);
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

export default ClinicsAdminPage;
