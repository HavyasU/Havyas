// ============================================
// Admin — Works / Projects CRUD
// ============================================
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Loader2, Save } from "lucide-react";
import type { Work } from "@/types";
import {
  subscribeToWorks,
  addWork,
  updateWork,
  deleteWork,
} from "@/lib/firestore";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function AdminWorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Freelance",
    coverImageUrl: "",
    client: "",
    specs: "",
    tags: "",
    caseStudy: "",
    order: 1,
    liveUrl: "",
    githubUrl: "",
  });

  useEffect(() => {
    const unsub = subscribeToWorks((data) => {
      setWorks(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const openModal = (work?: Work) => {
    if (work) {
      setEditingWork(work);
      setForm({
        title: work.title,
        description: work.description,
        category: work.category,
        coverImageUrl: work.coverImageUrl || "",
        client: work.client || "",
        specs: work.specs || "",
        tags: work.tags ? work.tags.join(", ") : "",
        caseStudy: work.caseStudy || "",
        order: work.order || 1,
        liveUrl: work.liveUrl || "",
        githubUrl: work.githubUrl || "",
      });
    } else {
      setEditingWork(null);
      setForm({
        title: "",
        description: "",
        category: "Freelance",
        coverImageUrl: "",
        client: "",
        specs: "",
        tags: "",
        caseStudy: "",
        order: works.length + 1,
        liveUrl: "",
        githubUrl: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const workData = {
      title: form.title,
      description: form.description,
      category: form.category,
      coverImageUrl: form.coverImageUrl,
      client: form.client,
      specs: form.specs,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      caseStudy: form.caseStudy,
      order: Number(form.order),
      liveUrl: form.liveUrl,
      githubUrl: form.githubUrl,
    };

    try {
      if (editingWork) {
        await updateWork(editingWork.id, workData);
      } else {
        await addWork(workData);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Could not save work", err);
      alert("Error saving project.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteWork(id);
    } catch (err) {
      console.error("Could not delete work", err);
      alert("Error deleting project.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-extrabold font-display">
            Manage Projects
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            {works.length} total projects configured
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-3 bg-white text-black hover:opacity-90 font-bold text-sm rounded-xl transition-all"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* Projects Table */}
      <div className="rounded-3xl border border-white/5 bg-white/[0.01] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/[0.03] border-b border-white/5">
              <th className="text-left px-4 py-4 text-neutral-400 font-semibold uppercase tracking-wider text-xs w-20">
                Order
              </th>
              <th className="text-left px-6 py-4 text-neutral-400 font-semibold uppercase tracking-wider text-xs">
                Title
              </th>
              <th className="text-left px-6 py-4 text-neutral-400 font-semibold uppercase tracking-wider text-xs hidden md:table-cell">
                Category
              </th>
              <th className="text-left px-6 py-4 text-neutral-400 font-semibold uppercase tracking-wider text-xs hidden lg:table-cell">
                Client
              </th>
              <th className="text-right px-6 py-4 text-neutral-400 font-semibold uppercase tracking-wider text-xs">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
                </td>
              </tr>
            ) : works.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-neutral-400"
                >
                  No projects configured yet. Click &quot;Add Project&quot; to
                  configure one.
                </td>
              </tr>
            ) : (
              works.map((work, idx) => (
                <motion.tr
                  key={work.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="border-b border-white/5 hover:bg-white/[0.01] transition-colors"
                >
                  <td className="px-4 py-4">
                    <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-white/10 text-white border border-white/20">
                      #{work.order ?? idx + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-white">
                    {work.title}
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/10 text-white">
                      {work.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-400 hidden lg:table-cell">
                    {work.client}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => openModal(work)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                        title="Edit Project"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(work.id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm"
            />
            {/* Centered Modal Container */}
            <div className="fixed inset-0 z-50 overflow-y-auto py-8 px-4 flex items-start justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-2xl bg-[#0F172A] border border-white/10 rounded-3xl p-6 md:p-8 text-white space-y-6 shadow-2xl my-auto"
                style={{ maxHeight: "85vh", overflowY: "auto" }}
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h3 className="text-xl font-bold font-display">
                    {editingWork ? "Edit Project" : "Add New Project"}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  {/* Title & Client */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                        Project Title
                      </label>
                      <input
                        type="text"
                        required
                        value={form.title}
                        onChange={(e) =>
                          setForm({ ...form, title: e.target.value })
                        }
                        placeholder="e.g. Tomato Food Delivery"
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-white transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                        Client Name
                      </label>
                      <input
                        type="text"
                        required
                        value={form.client}
                        onChange={(e) =>
                          setForm({ ...form, client: e.target.value })
                        }
                        placeholder="e.g. Swwadishta Kitchens"
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Category, Display Order & Cover Image */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4 space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                        Category
                      </label>
                      <select
                        value={form.category}
                        onChange={(e) =>
                          setForm({ ...form, category: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-white transition-all text-white [&>option]:bg-[#0F172A]"
                      >
                        <option value="Freelance">Freelance</option>
                        <option value="Products">Products</option>
                        <option value="Personal Project">
                          Personal Project
                        </option>
                        <option value="Experiments">Experiments</option>
                      </select>
                    </div>
                    <div className="md:col-span-3 space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                        Display Order
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={form.order}
                        onChange={(e) =>
                          setForm({ ...form, order: Number(e.target.value) })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-white transition-all"
                      />
                    </div>
                    <div className="md:col-span-5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                          Cover Image Path / URL
                        </label>
                        <label className="text-[11px] font-bold text-white/80 hover:text-white cursor-pointer flex items-center gap-1">
                          <i className="fa-solid fa-cloud-arrow-up"></i>{" "}
                          {uploading ? "Uploading..." : "Upload to Cloudinary"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploading}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setUploading(true);
                              try {
                                const url = await uploadToCloudinary(file);
                                setForm((prev) => ({
                                  ...prev,
                                  coverImageUrl: url,
                                }));
                              } catch (err: any) {
                                alert(err.message || "Upload failed");
                              } finally {
                                setUploading(false);
                              }
                            }}
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        required
                        value={form.coverImageUrl}
                        onChange={(e) =>
                          setForm({ ...form, coverImageUrl: e.target.value })
                        }
                        placeholder="/images/connectimage.png or Cloudinary URL"
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Specs & Tags */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                        Technologies Specs
                      </label>
                      <input
                        type="text"
                        required
                        value={form.specs}
                        onChange={(e) =>
                          setForm({ ...form, specs: e.target.value })
                        }
                        placeholder="React, Node.js, Stripe, MongoDB"
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-white transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                        Tags (Comma-separated)
                      </label>
                      <input
                        type="text"
                        required
                        value={form.tags}
                        onChange={(e) =>
                          setForm({ ...form, tags: e.target.value })
                        }
                        placeholder="MERN, Stripe, WebSockets"
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Optional Links (Live Demo & GitHub) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                        Live Demo URL{" "}
                        <span className="text-neutral-500 font-normal lowercase">
                          (optional)
                        </span>
                      </label>
                      <input
                        type="url"
                        value={form.liveUrl}
                        onChange={(e) =>
                          setForm({ ...form, liveUrl: e.target.value })
                        }
                        placeholder="https://havyas.in"
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-white transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                        GitHub Repo URL{" "}
                        <span className="text-neutral-500 font-normal lowercase">
                          (optional)
                        </span>
                      </label>
                      <input
                        type="url"
                        value={form.githubUrl}
                        onChange={(e) =>
                          setForm({ ...form, githubUrl: e.target.value })
                        }
                        placeholder="https://github.com/HavyasU/project"
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                      Short Description
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      placeholder="Enter a brief pitch of the project..."
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-white transition-all resize-none"
                    />
                  </div>

                  {/* Case Study */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                      Case Study & Write-up (Markdown supported)
                    </label>
                    <textarea
                      rows={6}
                      value={form.caseStudy}
                      onChange={(e) =>
                        setForm({ ...form, caseStudy: e.target.value })
                      }
                      placeholder="# Tomato Integration&#10;&#10;### Challenges...&#10;- Bullet details...&#10;&#10;### Outcome..."
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-white transition-all resize-y font-mono text-xs"
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-end gap-3 border-t border-white/5 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-semibold transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:opacity-90 rounded-xl text-sm font-bold transition-all"
                    >
                      <Save className="w-4 h-4" />{" "}
                      {editingWork ? "Update Project" : "Create Project"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
