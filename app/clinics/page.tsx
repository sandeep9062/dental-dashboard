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
  const [videoFile, setVideoFile] = useState<File | null>(null); // New state for video file

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
        if (key === "problems" || key === "areasServed" || key === "phoneNumbers" || key === "bestTimeToConnect" || key === "subscribedPlans" || key === "offers" || key === "socialMediaLinks" || key === "mainDoctorContact") {
          formData.append(key, JSON.stringify(value));
        } else if (key !== "images" && key !== "videos" && value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      if (imageFile) {
        formData.append("image", imageFile);
      }
      if (videoFile) {
        formData.append("video", videoFile);
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
      setVideoFile(null); // Clear video file state
    } catch (error) {
      console.error("Failed to save clinic:", error);
      toast.error("Failed to save clinic");
    }
  };

  const onDropImage = useCallback(
    (acceptedFiles: File[]) => {
      const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file.size > MAX_IMAGE_SIZE) {
          toast.error("Image size exceeds 5MB limit.");
          return;
        }
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

  const onDropVideo = useCallback(
    (acceptedFiles: File[]) => {
      const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file.size > MAX_VIDEO_SIZE) {
          toast.error("Video size exceeds 50MB limit.");
          return;
        }
        setVideoFile(file);
        if (selectedClinic) {
          setSelectedClinic({
            ...selectedClinic,
            videos: [URL.createObjectURL(file)],
          });
        }
      }
    },
    [selectedClinic]
  );

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps, isDragActive: isImageDragActive } = useDropzone({
    onDrop: onDropImage,
    accept: { "image/*": [] },
    multiple: false,
  });

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps, isDragActive: isVideoDragActive } = useDropzone({
    onDrop: onDropVideo,
    accept: { "video/*": [] },
    multiple: false, // Only one video
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
              phoneNumbers: ["", ""],
              subscribedPlans: [],
              offers: [],
              numberOfDoctors: 0,
              socialMediaLinks: { facebook: "", twitter: "", instagram: "", linkedin: "" },
              areasServed: [],
              mainDoctorContact: { name: "", email: "", phoneNumber: "" },
              bestTimeToConnect: [],
              videos: [],
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
                <th className="p-3 text-left">Phone Numbers</th>
                <th className="p-3 text-left">Drs. Count</th>
                <th className="p-3 text-left">Areas Served</th>
                <th className="p-3 text-left">Social Media</th>
                <th className="p-3 text-left">Main Doctor</th>
                <th className="p-3 text-left">Best Connect Time</th>
                <th className="p-3 text-left">Plans</th>
                <th className="p-3 text-left">Offers</th>
                <th className="p-3 text-left">Video</th>
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
                    {clinic.images && clinic.images.length > 0 ? (
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
                  <td className="p-3">{clinic.phoneNumbers?.join(", ") || "N/A"}</td>
                  <td className="p-3">{clinic.numberOfDoctors || "N/A"}</td>
                  <td className="p-3">{clinic.areasServed?.join(", ") || "N/A"}</td>
                  <td className="p-3">
                    {clinic.socialMediaLinks?.facebook && <a href={clinic.socialMediaLinks.facebook} target="_blank" rel="noopener noreferrer">FB</a>}
                    {clinic.socialMediaLinks?.twitter && <a href={clinic.socialMediaLinks.twitter} target="_blank" rel="noopener noreferrer">TW</a>}
                    {clinic.socialMediaLinks?.instagram && <a href={clinic.socialMediaLinks.instagram} target="_blank" rel="noopener noreferrer">IG</a>}
                    {clinic.socialMediaLinks?.linkedin && <a href={clinic.socialMediaLinks.linkedin} target="_blank" rel="noopener noreferrer">LI</a>}
                    {!clinic.socialMediaLinks?.facebook && !clinic.socialMediaLinks?.twitter && !clinic.socialMediaLinks?.instagram && !clinic.socialMediaLinks?.linkedin && "N/A"}
                  </td>
                  <td className="p-3">{clinic.mainDoctorContact?.name || "N/A"}</td>
                  <td className="p-3">{clinic.bestTimeToConnect?.join(", ") || "N/A"}</td>
                  <td className="p-3">{clinic.subscribedPlans?.length ? `${clinic.subscribedPlans.length} plans` : "N/A"}</td>
                  <td className="p-3">{clinic.offers?.length ? `${clinic.offers.length} offers` : "N/A"}</td>
                  <td className="p-3">
                    {clinic.videos && clinic.videos.length > 0 ? (
                      <video width="50" height="50" controls src={clinic.videos[0]} />
                    ) : (
                      "N/A"
                    )}
                  </td>
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
              {/* Image Upload */}
              <div
                {...getImageRootProps()}
                className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
                  isImageDragActive
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300"
                }`}
              >
                <input {...getImageInputProps()} />
                {selectedClinic.images && selectedClinic.images.length > 0 ? (
                  <img
                    src={selectedClinic.images[0]}
                    alt="Preview"
                    className="object-contain w-full h-32 mx-auto mb-2 rounded-md"
                  />
                ) : null}
                {isImageDragActive ? (
                  <p>Drop the image here ...</p>
                ) : (
                  <p>Drag \"n\" drop an image here, or click to select one (Max 5MB)</p>
                )}
              </div>

              {/* Video Upload */}
              <div
                {...getVideoRootProps()}
                className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
                  isVideoDragActive
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300"
                }`}
              >
                <input {...getVideoInputProps()} />
                {selectedClinic.videos && selectedClinic.videos.length > 0 ? (
                  <video
                    src={selectedClinic.videos[0]}
                    controls
                    className="object-contain w-full h-32 mx-auto mb-2 rounded-md"
                  />
                ) : null}
                {isVideoDragActive ? (
                  <p>Drop the video here ...</p>
                ) : (
                  <p>Drag \"n\" drop a video here, or click to select one (Max 50MB)</p>
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

              {/* New fields start here */}

              <input
                type="text"
                placeholder="Phone Number 1"
                value={selectedClinic.phoneNumbers?.[0] || ""}
                onChange={(e) =>
                  setSelectedClinic({
                    ...selectedClinic,
                    phoneNumbers: [e.target.value, selectedClinic.phoneNumbers?.[1] || ""],
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Phone Number 2"
                value={selectedClinic.phoneNumbers?.[1] || ""}
                onChange={(e) =>
                  setSelectedClinic({
                    ...selectedClinic,
                    phoneNumbers: [selectedClinic.phoneNumbers?.[0] || "", e.target.value],
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
              />

              <input
                type="number"
                placeholder="Number of Doctors"
                value={selectedClinic.numberOfDoctors || 0}
                onChange={(e) =>
                  setSelectedClinic({
                    ...selectedClinic,
                    numberOfDoctors: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
              />

              <textarea
                placeholder="Areas Served (comma separated)"
                value={selectedClinic.areasServed?.join(", ") || ""}
                onChange={(e) =>
                  setSelectedClinic({
                    ...selectedClinic,
                    areasServed: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
              />

              <input
                type="text"
                placeholder="Facebook Link"
                value={selectedClinic.socialMediaLinks?.facebook || ""}
                onChange={(e) =>
                  setSelectedClinic({
                    ...selectedClinic,
                    socialMediaLinks: {
                      ...selectedClinic.socialMediaLinks,
                      facebook: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Twitter Link"
                value={selectedClinic.socialMediaLinks?.twitter || ""}
                onChange={(e) =>
                  setSelectedClinic({
                    ...selectedClinic,
                    socialMediaLinks: {
                      ...selectedClinic.socialMediaLinks,
                      twitter: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Instagram Link"
                value={selectedClinic.socialMediaLinks?.instagram || ""}
                onChange={(e) =>
                  setSelectedClinic({
                    ...selectedClinic,
                    socialMediaLinks: {
                      ...selectedClinic.socialMediaLinks,
                      instagram: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="LinkedIn Link"
                value={selectedClinic.socialMediaLinks?.linkedin || ""}
                onChange={(e) =>
                  setSelectedClinic({
                    ...selectedClinic,
                    socialMediaLinks: {
                      ...selectedClinic.socialMediaLinks,
                      linkedin: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
              />

              <input
                type="text"
                placeholder="Main Doctor Name"
                value={selectedClinic.mainDoctorContact?.name || ""}
                onChange={(e) =>
                  setSelectedClinic({
                    ...selectedClinic,
                    mainDoctorContact: {
                      ...selectedClinic.mainDoctorContact,
                      name: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Main Doctor Email"
                value={selectedClinic.mainDoctorContact?.email || ""}
                onChange={(e) =>
                  setSelectedClinic({
                    ...selectedClinic,
                    mainDoctorContact: {
                      ...selectedClinic.mainDoctorContact,
                      email: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Main Doctor Phone Number"
                value={selectedClinic.mainDoctorContact?.phoneNumber || ""}
                onChange={(e) =>
                  setSelectedClinic({
                    ...selectedClinic,
                    mainDoctorContact: {
                      ...selectedClinic.mainDoctorContact,
                      phoneNumber: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
              />

              <textarea
                placeholder="Best Time to Connect (comma separated, e.g., Morning, Afternoon)"
                value={selectedClinic.bestTimeToConnect?.join(", ") || ""}
                onChange={(e) =>
                  setSelectedClinic({
                    ...selectedClinic,
                    bestTimeToConnect: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
              />

              {/* Subscribed Plans (simplified for now) */}
              <h3 className="text-lg font-semibold text-gray-700 mt-4">Subscribed Plans</h3>
              {selectedClinic.subscribedPlans?.map((plan, index) => (
                <div key={index} className="border p-2 rounded-md">
                  <input
                    type="text"
                    placeholder="Plan Name"
                    value={plan.planName}
                    onChange={(e) => {
                      const newPlans = [...selectedClinic.subscribedPlans!];
                      newPlans[index] = { ...newPlans[index], planName: e.target.value };
                      setSelectedClinic({ ...selectedClinic, subscribedPlans: newPlans });
                    }}
                    className="w-full px-3 py-2 border rounded-md mb-1"
                  />
                  <input
                    type="date"
                    placeholder="Start Date"
                    value={plan.startDate}
                    onChange={(e) => {
                      const newPlans = [...selectedClinic.subscribedPlans!];
                      newPlans[index] = { ...newPlans[index], startDate: e.target.value };
                      setSelectedClinic({ ...selectedClinic, subscribedPlans: newPlans });
                    }}
                    className="w-full px-3 py-2 border rounded-md mb-1"
                  />
                  <input
                    type="date"
                    placeholder="End Date"
                    value={plan.endDate}
                    onChange={(e) => {
                      const newPlans = [...selectedClinic.subscribedPlans!];
                      newPlans[index] = { ...newPlans[index], endDate: e.target.value };
                      setSelectedClinic({ ...selectedClinic, subscribedPlans: newPlans });
                    }}
                    className="w-full px-3 py-2 border rounded-md mb-1"
                  />
                  <select
                    value={plan.status}
                    onChange={(e) => {
                      const newPlans = [...selectedClinic.subscribedPlans!];
                      newPlans[index] = { ...newPlans[index], status: e.target.value as 'past' | 'present' };
                      setSelectedClinic({ ...selectedClinic, subscribedPlans: newPlans });
                    }}
                    className="w-full px-3 py-2 border rounded-md mb-1"
                  >
                    <option value="present">Present</option>
                    <option value="past">Past</option>
                  </select>
                  <textarea
                    placeholder="Offer Details (optional)"
                    value={plan.offerDetails || ""}
                    onChange={(e) => {
                      const newPlans = [...selectedClinic.subscribedPlans!];
                      newPlans[index] = { ...newPlans[index], offerDetails: e.target.value };
                      setSelectedClinic({ ...selectedClinic, subscribedPlans: newPlans });
                    }}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <button
                    onClick={() => {
                      const newPlans = selectedClinic.subscribedPlans!.filter((_, i) => i !== index);
                      setSelectedClinic({ ...selectedClinic, subscribedPlans: newPlans });
                    }}
                    className="mt-2 px-3 py-1 text-white bg-red-500 rounded-md hover:bg-red-600"
                  >
                    Remove Plan
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  setSelectedClinic({
                    ...selectedClinic,
                    subscribedPlans: [
                      ...(selectedClinic.subscribedPlans || []),
                      { planName: "", startDate: "", endDate: "", status: "present", offerDetails: "" },
                    ],
                  })
                }
                className="w-full px-4 py-2 mt-2 text-white bg-green-500 rounded-md hover:bg-green-600"
              >
                Add Subscribed Plan
              </button>

              {/* Offers (simplified for now) */}
              <h3 className="text-lg font-semibold text-gray-700 mt-4">Offers</h3>
              {selectedClinic.offers?.map((offer, index) => (
                <div key={index} className="border p-2 rounded-md">
                  <input
                    type="text"
                    placeholder="Offer Title"
                    value={offer.title}
                    onChange={(e) => {
                      const newOffers = [...selectedClinic.offers!];
                      newOffers[index] = { ...newOffers[index], title: e.target.value };
                      setSelectedClinic({ ...selectedClinic, offers: newOffers });
                    }}
                    className="w-full px-3 py-2 border rounded-md mb-1"
                  />
                  <textarea
                    placeholder="Offer Description"
                    value={offer.description}
                    onChange={(e) => {
                      const newOffers = [...selectedClinic.offers!];
                      newOffers[index] = { ...newOffers[index], description: e.target.value };
                      setSelectedClinic({ ...selectedClinic, offers: newOffers });
                    }}
                    className="w-full px-3 py-2 border rounded-md mb-1"
                  />
                  <input
                    type="date"
                    placeholder="Start Date"
                    value={offer.startDate}
                    onChange={(e) => {
                      const newOffers = [...selectedClinic.offers!];
                      newOffers[index] = { ...newOffers[index], startDate: e.target.value };
                      setSelectedClinic({ ...selectedClinic, offers: newOffers });
                    }}
                    className="w-full px-3 py-2 border rounded-md mb-1"
                  />
                  <input
                    type="date"
                    placeholder="End Date"
                    value={offer.endDate}
                    onChange={(e) => {
                      const newOffers = [...selectedClinic.offers!];
                      newOffers[index] = { ...newOffers[index], endDate: e.target.value };
                      setSelectedClinic({ ...selectedClinic, offers: newOffers });
                    }}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <button
                    onClick={() => {
                      const newOffers = selectedClinic.offers!.filter((_, i) => i !== index);
                      setSelectedClinic({ ...selectedClinic, offers: newOffers });
                    }}
                    className="mt-2 px-3 py-1 text-white bg-red-500 rounded-md hover:bg-red-600"
                  >
                    Remove Offer
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  setSelectedClinic({
                    ...selectedClinic,
                    offers: [
                      ...(selectedClinic.offers || []),
                      { title: "", description: "", startDate: "", endDate: "" },
                    ],
                  })
                }
                className="w-full px-4 py-2 mt-2 text-white bg-green-500 rounded-md hover:bg-green-600"
              >
                Add Offer
              </button>

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
                  setVideoFile(null);
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
