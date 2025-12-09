"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  useGetUsersQuery,
  useToggleUserStatusMutation,
  User,
} from "../../services/userApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

const AdminUsersPage: React.FC = () => {
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");

  const {
    data: users = [],
    isLoading,
    isError,
    refetch,
  } = useGetUsersQuery();
  const [toggleUserStatus, { isLoading: isToggling }] =
    useToggleUserStatusMutation();




  // ✅ Toggle user active status
  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      await toggleUserStatus({ id, isActive: !isActive }).unwrap();
      toast.success(`User status updated successfully!`);
      refetch(); // Refetch users to get the latest data
    } catch (error) {
      toast.error("Failed to update user status. Please try again.");
      console.error("Toggle Error:", error);
    }
  };

  // ✅ Apply filters
  const filteredUsers = users.filter((user) => {
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="max-w-6xl p-6 mx-auto bg-white shadow-xl rounded-2xl">
        <div className="flex flex-col items-center justify-between gap-4 mb-6 md:flex-row">
          <h1 className="text-3xl font-bold text-[#2C73D2]">User Management</h1>
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-60"
            />
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="patient">Patient</SelectItem>
                <SelectItem value="dentist">Dentist</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="pharma&brand">Pharma & Brand</SelectItem>
                <SelectItem value="cbct&opgcenters">CBCT & OPG Centers</SelectItem>
                <SelectItem value="diagnosticlabs">Diagnostic Labs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-[#2C73D2]" />
          </div>
        ) : isError ? (
          <div className="py-6 text-center text-red-500">
            Failed to load users. Please try again.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user._id} className="hover:bg-blue-50">
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="capitalize bg-blue-50 text-[#2C73D2] border-blue-300"
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.isActive ? (
                          <Badge className="text-green-700 bg-green-100">Active</Badge>
                        ) : (
                          <Badge className="text-red-700 bg-red-100">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString("en-IN")}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant={user.isActive ? "destructive" : "default"}
                          onClick={() => handleToggle(user._id, user.isActive)}
                          disabled={isToggling}
                        >
                          {isToggling ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : null}
                          {user.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="py-6 text-center text-gray-500">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
