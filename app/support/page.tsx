"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  useGetSupportsQuery,
  useUpdateSupportStatusMutation,
  useDeleteSupportMutation,
} from "../../services/supportApi";
import { SupportRequest } from "@/types/support";

export default function SupportRequestsPage() {
  const [filter, setFilter] = useState("all");
  const {
    data: requests,
    isLoading,
    isError,
    refetch,
  } = useGetSupportsQuery();
  const [updateStatus] = useUpdateSupportStatusMutation();
  const [deleteRequest] = useDeleteSupportMutation();

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success("Status updated");
    } catch {
      toast.error("Error updating status");
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!confirm("Delete this request?")) return;
    try {
      await deleteRequest(id).unwrap();
      toast.success("Request deleted");
    } catch {
      toast.error("Error deleting request");
    }
  };

  if (isError) {
    toast.error("Failed to load support requests");
  }

  const filtered =
    filter === "all"
      ? requests
      : requests?.filter((r) => r.status === filter);

  return (
    <div className="p-6">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 text-2xl font-semibold"
      >
        Support Requests
      </motion.h1>

      <div className="flex items-center justify-between mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="in-progress">In-progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <button
          onClick={refetch}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {isLoading ? (
        <p>Loading…</p>
      ) : !filtered || filtered.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Message</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((req: SupportRequest) => (
                <tr key={req._id} className="border-t">
                  <td className="p-3">{req.name}</td>
                  <td className="p-3">{req.email}</td>
                  <td className="p-3">{req.subject}</td>
                  <td className="p-3">{req.message}</td>
                  <td className="p-3 capitalize">{req.status}</td>
                  <td className="p-3 space-x-2">
                    {req.status !== "resolved" && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(req._id, "resolved")
                        }
                        className="text-green-600 hover:underline"
                      >
                        Resolve
                      </button>
                    )}
                    {req.status === "new" && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(req._id, "in-progress")
                        }
                        className="text-blue-600 hover:underline"
                      >
                        In-Progress
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteRequest(req._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
