"use client";

import React, { useState } from "react";
import {
  useGetPlansQuery,
  useAddPlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  Plan,
} from "@/services/plansApi";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Trash2, Edit2, PlusCircle } from "lucide-react";
import { toast } from "sonner";

export default function PlansPage() {
  const { data: plans, isLoading, refetch } = useGetPlansQuery();
  const [addPlan] = useAddPlanMutation();
  const [updatePlan] = useUpdatePlanMutation();
  const [deletePlan] = useDeletePlanMutation();
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<Partial<Plan>>({
    defaultValues: {
      type: "",
      name: "",
      pricing: {
        monthly: 0,
        yearly: 0,
        discountPercentage: 0,
      },
      duration: "1 year",
      features: [],
      highlight: false,
    },
  });

  const onSubmit = async (data: Partial<Plan>) => {
    try {
      if (editingPlan) {
        await updatePlan({ id: editingPlan._id, data }).unwrap();
        toast.success("Plan updated successfully!");
      } else {
        await addPlan(data).unwrap();
        toast.success("Plan added successfully!");
      }
      reset();
      setEditingPlan(null);
      setIsAdding(false);
      refetch();
    } catch (error) {
      const errorMessage =
        error instanceof Object &&
        "data" in error &&
        error.data &&
        typeof error.data === "object" &&
        "message" in error.data &&
        typeof error.data.message === "string"
          ? error.data.message
          : "Failed to save plan.";
      toast.error(errorMessage);
    }
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setIsAdding(true);
    reset(plan); // Use reset to populate the form with the plan data
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    try {
      await deletePlan(id).unwrap();
      toast.success("Plan deleted successfully!");
      refetch();
    } catch (error) {
      toast.error("Failed to delete plan.");
    }
  };

  return (
    <div className="max-w-6xl p-6 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Manage Plans</h1>
        <Button
          onClick={() => {
            setIsAdding(true);
            setEditingPlan(null);
            reset();
          }}
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Add New Plan
        </Button>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingPlan ? "Edit Plan" : "Add New Plan"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 font-medium">Type</label>
                  <select
                    {...register("type", { required: true })}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#2C73D2] focus:border-transparent"
                  >
                    <option value="">Select Type</option>
                    <option value="dentist">Dentist</option>
                    <option value="clinics">Clinics</option>
                    <option value="diagnosticlabs">Diagnostic Labs</option>
                    <option value="cbctopglabs">Cbct and Opg Labs</option>
                    <option value="pharmabrands">Pharma Brands</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium">Name</label>
                  <Input
                    placeholder="Plan name"
                    {...register("name")}
                    required
                  />
                </div>
                <div>
                  <label className="font-medium">Monthly Price</label>
                  <Input
                    type="number"
                    placeholder="Monthly Price"
                    {...register("pricing.monthly", { valueAsNumber: true })}
                    required
                  />
                </div>
                <div>
                  <label className="font-medium">Yearly Price</label>
                  <Input
                    type="number"
                    placeholder="Yearly Price"
                    {...register("pricing.yearly", { valueAsNumber: true })}
                    required
                  />
                </div>
                <div>
                  <label className="font-medium">Discount Percentage</label>
                  <Input
                    type="number"
                    placeholder="e.g., 10 for 10%"
                    {...register("pricing.discountPercentage", {
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <div>
                  <label className="font-medium">Duration</label>
                  <Input
                    placeholder="e.g., 6 months or 1 year"
                    {...register("duration")}
                  />
                </div>
              </div>

              <div>
                <label className="font-medium">
                  Features (comma-separated)
                </label>
                <Textarea
                  placeholder="Feature 1, Feature 2, Feature 3"
                  {...register("features")}
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch {...register("highlight")} />
                <label>Highlight this plan</label>
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingPlan ? "Update Plan" : "Add Plan"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Plans Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Plans</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading plans...</p>
          ) : plans && plans.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead>
                  <tr className="text-sm text-left uppercase bg-gray-100">
                    <th className="p-3">Type</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Pricing (Monthly/Yearly)</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Highlight</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => (
                    <tr key={plan._id} className="border-t">
                      <td className="p-3">{plan.type}</td>
                      <td className="p-3">{plan.name}</td>
                      <td className="p-3">
                        ₹{plan.pricing.monthly} / ₹{plan.pricing.yearly}
                      </td>
                      <td className="p-3">{plan.duration}</td>
                      <td className="p-3">{plan.highlight ? "✅" : "❌"}</td>
                      <td className="flex gap-3 p-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(plan)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(plan._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No plans found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
