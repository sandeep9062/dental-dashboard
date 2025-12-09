"use client";

import React, { useState } from "react";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PatientProfile } from "../../types/patient";
import {
  useGetAllPatientsQuery,
  useAddPatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
  useTogglePatientActiveMutation,
} from "../../services/patientsApi";

const PatientsAdminPage: React.FC = () => {
  const { data: patients = [], isLoading, isError, refetch } = useGetAllPatientsQuery();
  const [addPatient] = useAddPatientMutation();
  const [updatePatient] = useUpdatePatientMutation();
  const [deletePatient] = useDeletePatientMutation();
  const [togglePatientActive] = useTogglePatientActiveMutation();

  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<PatientProfile>>({
    name: "",
    email: "",
    phone: "",
  });

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(search.toLowerCase()) ||
      patient.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (isAdding) {
        await addPatient(formData as FormData).unwrap();
        toast.success("Patient added successfully!");
      } else if (selectedPatient) {
        await updatePatient({ id: selectedPatient._id, data: formData }).unwrap();
        toast.success("Patient updated successfully!");
      }
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error("Failed to save patient details");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this patient?")) return;
    try {
      await deletePatient(id).unwrap();
      toast.success("Patient deleted successfully!");
      refetch();
    } catch {
      toast.error("Failed to delete patient");
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await togglePatientActive({ id, isActive: !isActive }).unwrap();
      toast.success(isActive ? "Patient deactivated" : "Patient activated");
      refetch();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const openEditDialog = (patient: PatientProfile) => {
    setSelectedPatient(patient);
    setFormData(patient);
    setIsAdding(false);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setSelectedPatient(null);
    setFormData({ name: "", email: "", phone: "" });
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
            <h2 className="text-2xl font-bold">Patients Management</h2>
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-xs"
              />
              <Button onClick={openAddDialog} className="text-white bg-blue-600 hover:bg-blue-700">
                + Add Patient
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Active</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{patient.name}</td>
                    <td className="px-4 py-2">{patient.email}</td>
                    <td className="px-4 py-2">{patient.phone}</td>
                    <td className="px-4 py-2">
                      <Switch
                        checked={patient.isActive}
                        onCheckedChange={() => toggleActive(patient._id, patient.isActive)}
                      />
                    </td>
                    <td className="flex gap-2 px-4 py-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(patient)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(patient._id)}>
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
            <DialogTitle>{isAdding ? "Add Patient" : "Edit Patient"}</DialogTitle>
          </DialogHeader>
          <div className="mt-3 space-y-3">
            <Input name="name" placeholder="Patient Name" value={formData.name} onChange={handleChange} />
            <Input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            <Input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit} className="w-full text-white bg-blue-600 hover:bg-blue-700">
              {isAdding ? "Add Patient" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientsAdminPage;
