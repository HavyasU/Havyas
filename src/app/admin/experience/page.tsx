// ============================================
// Admin — Experiences CRUD
// ============================================
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Loader2, Save } from 'lucide-react';
import type { Experience } from '@/types';
import { subscribeToExperiences, addExperience, updateExperience, deleteExperience } from '@/lib/firestore';

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    role: '',
    company: '',
    duration: '',
    description: '',
    order: 1,
  });

  useEffect(() => {
    const unsub = subscribeToExperiences((data) => {
      setExperiences(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const openModal = (exp?: Experience) => {
    if (exp) {
      setEditingExperience(exp);
      setForm({
        role: exp.role,
        company: exp.company,
        duration: exp.duration,
        description: exp.description,
        order: exp.order || 1,
      });
    } else {
      setEditingExperience(null);
      setForm({
        role: '',
        company: '',
        duration: '',
        description: '',
        order: experiences.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const expData = {
      role: form.role,
      company: form.company,
      duration: form.duration,
      description: form.description,
      order: Number(form.order),
    };

    try {
      if (editingExperience) {
        await updateExperience(editingExperience.id, expData);
      } else {
        await addExperience(expData);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Could not save experience', err);
      alert('Error saving experience.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience timeline item?')) return;
    try {
      await deleteExperience(id);
    } catch (err) {
      console.error('Could not delete experience', err);
      alert('Error deleting experience.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-extrabold font-display">Manage Experiences</h1>
          <p className="text-sm text-neutral-400 mt-1">{experiences.length} experience milestones configured</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-3 bg-white text-black hover:opacity-90 font-bold text-sm rounded-xl transition-all"
        >
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </div>

      {/* Experience Table */}
      <div className="rounded-3xl border border-white/5 bg-white/[0.01] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/[0.03] border-b border-white/5">
              <th className="text-left px-6 py-4 text-neutral-400 font-semibold uppercase tracking-wider text-xs">Order</th>
              <th className="text-left px-6 py-4 text-neutral-400 font-semibold uppercase tracking-wider text-xs">Role</th>
              <th className="text-left px-6 py-4 text-neutral-400 font-semibold uppercase tracking-wider text-xs hidden md:table-cell">Company</th>
              <th className="text-left px-6 py-4 text-neutral-400 font-semibold uppercase tracking-wider text-xs hidden lg:table-cell">Duration</th>
              <th className="text-right px-6 py-4 text-neutral-400 font-semibold uppercase tracking-wider text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
                </td>
              </tr>
            ) : experiences.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-neutral-400">
                  No experience milestones configured yet. Click &quot;Add Experience&quot; to configure one.
                </td>
              </tr>
            ) : (
              experiences.map((exp, idx) => (
                <motion.tr
                  key={exp.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="border-b border-white/5 hover:bg-white/[0.01] transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-neutral-400">{exp.order}</td>
                  <td className="px-6 py-4 font-bold text-white">{exp.role}</td>
                  <td className="px-6 py-4 text-neutral-300 hidden md:table-cell">{exp.company}</td>
                  <td className="px-6 py-4 text-neutral-400 hidden lg:table-cell">{exp.duration}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => openModal(exp)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                        title="Edit Experience"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete Experience"
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg bg-[#0F172A] border border-white/10 rounded-3xl p-6 md:p-8 text-white space-y-6"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h3 className="text-xl font-bold font-display">
                    {editingExperience ? 'Edit Experience' : 'Add Experience'}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Role / Designation</label>
                      <input
                        type="text"
                        required
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        placeholder="e.g. Full Stack Developer"
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-white transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Company</label>
                      <input
                        type="text"
                        required
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        placeholder="e.g. Freelance / TechCorp"
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Duration</label>
                      <input
                        type="text"
                        required
                        value={form.duration}
                        onChange={(e) => setForm({ ...form, duration: e.target.value })}
                        placeholder="e.g. 2023 - Present"
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-white transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Display Order</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={form.order}
                        onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 1 })}
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Description / Responsibilities</label>
                    <textarea
                      required
                      rows={5}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="List key tasks, outcomes, or stacks used..."
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-white transition-all resize-none"
                    />
                  </div>

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
                      <Save className="w-4 h-4" /> {editingExperience ? 'Update' : 'Create'}
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
