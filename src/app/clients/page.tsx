"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  X,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { useAppStore } from "@/lib/app-store";
import { Client } from "@/types";
import Pagination from "@/components/ui/Pagination";
import ClientsLoading from "./loading";

const emptyForm = { name: "", email: "", phone: "", address: "" };
const ITEMS_PER_PAGE = 8;

export default function ClientsPage() {
  const { loading, clients: clientsList, addClient, updateClient, deleteClient } = useAppStore();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = clientsList.filter(
    (c) =>
      search === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (client: Client) => {
    setEditingId(client.id);
    setForm({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email) return;

    if (editingId) {
      await updateClient(editingId, form);
    } else {
      await addClient(form);
    }
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    await deleteClient(id);
    setDeleteConfirm(null);
  };

  if (loading) return <ClientsLoading />;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-heading">Clients</h1>
          <p className="text-sm text-muted mt-1">
            Gérez votre répertoire de clients.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors"
        >
          <Plus size={18} />
          Ajouter un client
        </button>
      </div>

      <div className="bg-card rounded-2xl shadow-card">
        <div className="p-6 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              placeholder="Rechercher un client..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {paginated.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-muted">
              Aucun client trouvé.
            </div>
          ) : (
            paginated.map((client) => (
              <div
                key={client.id}
                className="p-6 hover:bg-gray-50/60 transition-colors duration-150"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center text-sm font-semibold shrink-0">
                    {client.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-heading">
                      {client.name}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                      <span className="inline-flex items-center gap-1 text-xs text-muted">
                        <Mail size={12} />
                        {client.email}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted">
                        <Phone size={12} />
                        {client.phone}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted">
                        <MapPin size={12} />
                        {client.address}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => openEdit(client)}
                      className="p-2 rounded-lg text-muted hover:text-brand-500 hover:bg-brand-50 transition-colors"
                      aria-label="Modifier"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(client.id)}
                      className="p-2 rounded-lg text-muted hover:text-status-overdue hover:bg-status-overdue-bg transition-colors"
                      aria-label="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-2xl shadow-lg max-w-lg w-full p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-heading">
                {editingId ? "Modifier le client" : "Ajouter un client"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-muted transition-colors duration-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">Nom *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nom de l'entreprise ou du client"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="client@exemple.com"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">Téléphone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+228 90 00 00 00"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">Adresse</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Adresse complète"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-200 bg-card"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-body hover:bg-gray-50 transition-all duration-200"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-all duration-200"
              >
                {editingId ? "Enregistrer" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-2xl shadow-lg max-w-md w-full p-6 animate-fade-in-up">
            <h3 className="text-lg font-semibold text-heading mb-2">
              Confirmer la suppression
            </h3>
            <p className="text-sm text-body mb-6">
              Êtes-vous sûr de vouloir supprimer ce client ? Cette action est
              irréversible.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-body hover:bg-gray-50 transition-all duration-200"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2.5 bg-status-overdue text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all duration-200"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
