"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Modal, ConfirmModal } from "@/components/ui/modal";
import { ROLE_COLORS, ROLE_LABELS } from "@/lib/permissions";
import { formatDate, getInitials } from "@/lib/utils";
import { Role } from "@prisma/client";

interface User {
  id: string;
  name?: string;
  email: string;
  role: Role;
  createdAt: string;
}

export default function UsersPage() {
  const { data: session, status } = useSession();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", email: "", password: "", role: "VIEWER" });
  const [createError, setCreateError] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  const [editUser, setEditUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<Role>(Role.VIEWER);
  const [editLoading, setEditLoading] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function fetchUsers() {
    setLoading(true);
    const res = await fetch("/api/users");
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users ?? []);
    }
    setLoading(false);
  }

  useEffect(() => { fetchUsers(); }, []);

  if (status === "authenticated" && session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  async function handleCreate() {
    setCreateLoading(true);
    setCreateError("");
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createForm),
    });
    setCreateLoading(false);
    if (!res.ok) {
      const err = await res.json();
      setCreateError(err.error ?? "Something went wrong");
      return;
    }
    setShowCreate(false);
    setCreateForm({ name: "", email: "", password: "", role: "VIEWER" });
    fetchUsers();
  }

  async function handleEditRole() {
    if (!editUser) return;
    setEditLoading(true);
    await fetch(`/api/users/${editUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: editRole }),
    });
    setEditLoading(false);
    setEditUser(null);
    fetchUsers();
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleteLoading(true);
    await fetch(`/api/users/${deleteId}`, { method: "DELETE" });
    setDeleteLoading(false);
    setDeleteId(null);
    fetchUsers();
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Users" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">{users.length} user(s)</p>
          <Button onClick={() => { setShowCreate(true); setCreateError(""); }}>+ Add user</Button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["User", "Email", "Role", "Joined", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>
              ) : users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-semibold">
                        {getInitials(u.name ?? u.email)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{u.name ?? "—"}</span>
                      {u.id === session?.user?.id && <span className="text-xs text-gray-400">(you)</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_COLORS[u.role]}`}>
                      {ROLE_LABELS[u.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { setEditUser(u); setEditRole(u.role); }}>Edit role</Button>
                    {u.id !== session?.user?.id && (
                      <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setDeleteId(u.id)}>Delete</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Create user modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Add user">
        <div className="space-y-4">
          <Input label="Name" value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} />
          <Input label="Email" type="email" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} required />
          <Input label="Password" type="password" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} required />
          <Select label="Role" value={createForm.role} onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}>
            <option value="VIEWER">Viewer</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Admin</option>
          </Select>
          {createError && <p className="text-sm text-red-600">{createError}</p>}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate} loading={createLoading}>Create</Button>
          </div>
        </div>
      </Modal>

      {/* Edit role modal */}
      <Modal isOpen={!!editUser} onClose={() => setEditUser(null)} title="Change role" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Update role for <strong>{editUser?.name ?? editUser?.email}</strong></p>
          <Select value={editRole} onChange={(e) => setEditRole(e.target.value as Role)}>
            <option value="VIEWER">Viewer</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Admin</option>
          </Select>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setEditUser(null)}>Cancel</Button>
            <Button onClick={handleEditRole} loading={editLoading}>Save</Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete user"
        message="This will permanently delete the user account. This action cannot be undone."
        loading={deleteLoading}
      />
    </div>
  );
}
