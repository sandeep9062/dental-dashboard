"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, Edit2, Loader2, Eye } from "lucide-react";
import Link from "next/link";
import {
  getFixMyTeethCases,
  updateFixMyTeethCase,
  deleteFixMyTeethCase,
} from "@/services/fixMyTeethApi";

interface FixMyTeethRecord {
  _id: string;
  name: string;
  email: string;
  selectedType: string;
  selectedState: string;
  teethProblems: string[];
  otherProblemText: string;
  photos: string[];
}

export default function FixMyTeethAdminPage() {
  const [records, setRecords] = useState<FixMyTeethRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    selectedState: "",
  });

  const fetchRecords = async () => {
    setLoading(true);
    const result = await getFixMyTeethCases();
    if (result.success) {
      const recordsData = Array.isArray(result.data)
        ? result.data
        : result.data?.cases || [];
      setRecords(recordsData);
    }
    else toast.error(result.message);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = async (id: string) => {
    const result = await deleteFixMyTeethCase(id);
    if (result.success) {
      toast.success("Record deleted successfully");
      fetchRecords();
    } else toast.error(result.message);
  };

  const handleEdit = (record: FixMyTeethRecord) => {
    setEditing(record._id);
    setEditData({
      name: record.name,
      email: record.email,
      selectedState: record.selectedState,
    });
  };

  const handleUpdate = async () => {
    if (!editing) return;
    const result = await updateFixMyTeethCase(editing, editData);
    if (result.success) {
      toast.success("Record updated successfully");
      setEditing(null);
      fetchRecords();
    } else toast.error(result.message);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        <Loader2 className="mr-2 animate-spin" /> Loading records...
      </div>
    );

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">🦷 Fix My Teeth</h1>

      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr className="text-left text-gray-700">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Type</th>
              <th className="p-3">State</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{rec.name}</td>
                <td className="p-3">{rec.email}</td>
                <td className="p-3 capitalize">{rec.selectedType}</td>
                <td className="p-3">{rec.selectedState}</td>
                <td className="flex gap-3 p-3">
                  <Link
                    href={`/fix-my-teeth/${rec._id}`}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Eye size={18} />
                  </Link>

                  <button
                    onClick={() => handleEdit(rec)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(rec._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">Edit Record</h2>

            <input
              className="w-full p-2 mb-3 border rounded"
              placeholder="Name"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
            />
            <input
              className="w-full p-2 mb-3 border rounded"
              placeholder="Email"
              value={editData.email}
              onChange={(e) =>
                setEditData({ ...editData, email: e.target.value })
              }
            />
            <input
              className="w-full p-2 mb-3 border rounded"
              placeholder="State"
              value={editData.selectedState}
              onChange={(e) =>
                setEditData({ ...editData, selectedState: e.target.value })
              }
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 text-gray-700 bg-gray-300 rounded"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-white bg-blue-600 rounded"
                onClick={handleUpdate}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
