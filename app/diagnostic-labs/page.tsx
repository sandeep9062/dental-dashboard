"use client";

import React, { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DiagnosticLab } from "../../types/diagnosticLab";
import {
  useGetDiagnosticLabsQuery,
  useAddDiagnosticLabMutation,
  useUpdateDiagnosticLabMutation,
  useDeleteDiagnosticLabMutation,
} from "../../services/diagnosticLabApi";

const DiagnosticLabsAdminPage: React.FC = () => {
  const { data: labs = [], isLoading, isError, refetch } = useGetDiagnosticLabsQuery();
  const [addDiagnosticLab] = useAddDiagnosticLabMutation();
  const [updateDiagnosticLab] = useUpdateDiagnosticLabMutation();
  const [deleteDiagnosticLab] = useDeleteDiagnosticLabMutation();

  const [search, setSearch] = useState("");
  const [selectedLab, setSelectedLab] = useState<DiagnosticLab | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [labToDelete, setLabToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<DiagnosticLab>>({
    name: "",
    state: "",
    location: "",
    img: "",
  });

  const filteredLabs = labs.filter(
    (lab) =>
      lab.name.toLowerCase().includes(search.toLowerCase()) ||
      lab.state.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (isAdding) {
        await addDiagnosticLab(formData).unwrap();
        toast.success("Lab added successfully!");
      } else if (selectedLab) {
        await updateDiagnosticLab({ id: selectedLab._id, body: formData }).unwrap();
        toast.success("Lab updated successfully!");
      }
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error("Failed to save lab details");
    }
  };

  const openDeleteDialog = (id: string) => {
    setLabToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!labToDelete) return;
    try {
      await deleteDiagnosticLab(labToDelete).unwrap();
      toast.success("Lab deleted successfully!");
      refetch();
    } catch {
      toast.error("Failed to delete lab");
    } finally {
      setIsDeleteDialogOpen(false);
      setLabToDelete(null);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await updateDiagnosticLab({ id, body: { isActive: !isActive } }).unwrap();
      toast.success(isActive ? "Lab deactivated" : "Lab activated");
      refetch();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const openEditDialog = (lab: DiagnosticLab) => {
    setSelectedLab(lab);
    setFormData(lab);
    setIsAdding(false);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setSelectedLab(null);
    setFormData({ name: "", state: "", location: "", img: "" });
    setIsAdding(true);
    setIsDialogOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data.</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <Toaster />
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-between gap-4 mb-4 sm:flex-row">
            <h2 className="text-2xl font-bold">Diagnostic Labs Management</h2>
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="Search by name or state..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-xs"
              />
              <Button onClick={openAddDialog} className="text-white bg-blue-600 hover:bg-blue-700">
                + Add Lab
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-2">Image</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">State</th>
                  <th className="px-4 py-2">Location</th>
                  <th className="px-4 py-2">Rating</th>
                  <th className="px-4 py-2">Active</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLabs.map((lab) => (
                  <tr key={lab._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <img src={lab.img} alt={lab.name} className="object-cover w-12 h-12 rounded-lg" />
                    </td>
                    <td className="px-4 py-2">{lab.name}</td>
                    <td className="px-4 py-2">{lab.state}</td>
                    <td className="px-4 py-2">{lab.location}</td>
                    <td className="px-4 py-2">{lab.rating}</td>
                    <td className="px-4 py-2">
                      <Switch checked={lab.isActive} onCheckedChange={() => toggleActive(lab._id, lab.isActive)} />
                    </td>
                    <td className="flex gap-2 px-4 py-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(lab)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(lab._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isAdding ? "Add Diagnostic Lab" : "Edit Lab"}</DialogTitle>
          </DialogHeader>
          <div className="mt-3 space-y-3">
            <Input name="name" placeholder="Lab Name" value={formData.name} onChange={handleChange} />
            <Input name="state" placeholder="State" value={formData.state} onChange={handleChange} />
            <Input name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
            <Input name="img" placeholder="Image URL" value={formData.img} onChange={handleChange} />
            <Input name="rating" type="number" placeholder="Rating" value={formData.rating} onChange={handleChange} />
            <Textarea name="website" placeholder="Website URL" value={formData.website} onChange={handleChange} />
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit} className="w-full text-white bg-blue-600 hover:bg-blue-700">
              {isAdding ? "Add Lab" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              lab.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DiagnosticLabsAdminPage;
