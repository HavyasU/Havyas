// ============================================
// Admin — Education CRUD
// ============================================
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Loader2, Save, GraduationCap } from 'lucide-react';
import type { Education } from '@/types';
import { subscribeToEducation, addEducation, updateEducation, deleteEducation } from '@/lib/firestore';

export default function AdminEducationPage() {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    degree: '',
    institution: '',
    year: '',
    description: '',
    order: 1,
  });

  useEffect(() => {
    const unsub = subscribeToEducation((data) => {
      setEducationList(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const openModal = (edu?: Education) => {
    if (edu) {
      setEditingEdu(edu);
      setForm({
        degree: edu.degree,
        institution: edu.institution,
        year: edu.year,
        description: edu.description || '',
        order: edu.order || 1,
      });
    } else {
      setEditingEdu(null);
      setForm({
        degree: '',
        institution: '',
        year: '',
        description: '',
        order: educationList.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const eduData = {
      degree: form.degree,
      institution: form.institution,
      year: form.year,
      description: form.description,
      order: Number(form.order),
    };

    try {
      if (editingEdu) {
        await updateEducation(editingEdu.id, eduData);
      } else {
        await addEducation(eduData);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Could not save education item', err);
      alert('Error saving education item.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return;
    try {
      await deleteEducation(id);
    } catch (err) {
      console.error('Could not delete education item', err);
      alert('Error deleting education item.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-white" /> Education Management
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Manage your academic credentials, degrees, and institutions displayed on your portfolio.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-black font-bold text-sm rounded-xl hover:bg-neutral-200 transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add Education
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      ) : educationList.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
          <p className="text-neutral-400 text-sm">No education entries found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {educationList.map((edu) => (
            <div
              key={edu.id}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold text-white">{edu.degree}</h3>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-neutral-300 font-mono">
                    Order: {edu.order || 1}
                  </span>
                </div>
                <p className="text-sm font-semibold text-neutral-300">{edu.institution}</p>
                <p className="text-xs text-neutral-400">{edu.year}</p>
                {edu.description && (
                  <p className="text-xs text-neutral-300 pt-2 border-t border-white/5 leading-relaxed">
                    {edu.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-white/5">
                <button
                  onClick={() => openModal(edu)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all text-xs flex items-center gap-1.5"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(edu.id)}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all text-xs flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
            <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-start sm:items-center justify-center min-h-screen">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-lg bg-[#0F172A] border border-white/10 rounded-3xl p-6 md:p-8 text-white space-y-6 my-auto shadow-2xl"
                style={{ overflowY: 'auto', maxHeight: '85vh' }}
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h3 className="text-xl font-bold">
                    {editingEdu ? 'Edit Education' : 'Add Education Entry'}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Degree / Course Name</label>
                    <input
                      type="text"
                      required
                      value={form.degree}
                      onChange={(e) => setForm({ ...form, degree: e.target.value })}
                      placeholder="e.g. Bachelor of Technology in Computer Science"
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Institution / College Name</label>
                    <input
                      type="text"
                      required
                      value={form.institution}
                      onChange={(e) => setForm({ ...form, institution: e.target.value })}
                      placeholder="e.g. Sahyadri College of Engineering & Management"
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-white transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Duration / Years</label>
                      <input
                        type="text"
                        required
                        value={form.year}
                        onChange={(e) => setForm({ ...form, year: e.target.value })}
                        placeholder="e.g. 2021 - 2025"
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-white transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Display Order</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={form.order}
                        onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Description / Details</label>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Specializations, courses, achievements..."
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
                      <Save className="w-4 h-4" /> Save Entry
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
