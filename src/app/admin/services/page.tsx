// ============================================
// Admin — Services CRUD
// ============================================
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Loader2, Save } from 'lucide-react';
import type { Service } from '@/types';
import { subscribeToServices, addService, updateService, deleteService } from '@/lib/firestore';
import { uploadToCloudinary } from '@/lib/cloudinary';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    iconName: 'fa-code',
    order: 1,
    mockupType: 'search',
    imageUrl: '',
  });

  useEffect(() => {
    const unsub = subscribeToServices((data) => {
      setServices(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const openModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setForm({
        title: service.title,
        description: service.description,
        iconName: service.iconName || 'fa-code',
        order: service.order || 1,
        mockupType: service.mockupType || 'search',
        imageUrl: service.imageUrl || '',
      });
    } else {
      setEditingService(null);
      setForm({
        title: '',
        description: '',
        iconName: 'fa-code',
        order: services.length + 1,
        mockupType: 'search',
        imageUrl: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const serviceData = {
      title: form.title,
      description: form.description,
      iconName: form.iconName,
      order: Number(form.order),
      mockupType: form.mockupType,
      imageUrl: form.imageUrl,
    };

    try {
      if (editingService) {
        await updateService(editingService.id, serviceData);
      } else {
        await addService(serviceData);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Could not save service', err);
      alert('Error saving service.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await deleteService(id);
    } catch (err) {
      console.error('Could not delete service', err);
      alert('Error deleting service.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-extrabold font-display">Manage Services</h1>
          <p className="text-sm text-neutral-400 mt-1">{services.length} services configured</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-3 bg-white text-black hover:opacity-90 font-bold text-sm rounded-xl transition-all"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {/* Services Table */}
      <div className="rounded-3xl border border-white/5 bg-white/[0.01] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/[0.03] border-b border-white/5">
              <th className="text-left px-6 py-4 text-neutral-400 font-semibold uppercase tracking-wider text-xs">Order</th>
              <th className="text-left px-6 py-4 text-neutral-400 font-semibold uppercase tracking-wider text-xs">Title</th>
              <th className="text-left px-6 py-4 text-neutral-400 font-semibold uppercase tracking-wider text-xs hidden md:table-cell">Icon</th>
              <th className="text-right px-6 py-4 text-neutral-400 font-semibold uppercase tracking-wider text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
                </td>
              </tr>
            ) : services.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-neutral-400">
                  No services configured yet. Click &quot;Add Service&quot; to configure one.
                </td>
              </tr>
            ) : (
              services.map((service, idx) => (
                <motion.tr
                  key={service.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="border-b border-white/5 hover:bg-white/[0.01] transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-neutral-400">{service.order}</td>
                  <td className="px-6 py-4 font-bold text-white">{service.title}</td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/10 text-white font-mono flex items-center gap-2 w-max">
                      <i className={`fa-solid ${service.iconName}`}></i>
                      {service.iconName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => openModal(service)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                        title="Edit Service"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete Service"
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
            <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-start sm:items-center justify-center min-h-screen">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-lg bg-[#0F172A] border border-white/10 rounded-3xl p-6 md:p-8 text-white space-y-6 my-auto shadow-2xl"
                style={{ overflowY: 'auto', maxHeight: '85vh' }}
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h3 className="text-xl font-bold font-display">
                    {editingService ? 'Edit Service' : 'Add New Service'}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-8 space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Service Title</label>
                      <input
                        type="text"
                        required
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="e.g. Website Design"
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-white transition-all"
                      />
                    </div>
                    <div className="sm:col-span-4 space-y-1.5">
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
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">FontAwesome Icon Class</label>
                    <input
                      type="text"
                      required
                      value={form.iconName}
                      onChange={(e) => setForm({ ...form, iconName: e.target.value })}
                      placeholder="fa-code, fa-pen-nib, etc."
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-white transition-all"
                    />
                    <p className="text-[10px] text-neutral-400">Specify standard class prefix names like fa-code or fa-mobile-screen.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-6 space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Graphic Mockup Preset</label>
                      <select
                        value={form.mockupType}
                        onChange={(e) => setForm({ ...form, mockupType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#0F172A] text-white text-sm focus:outline-none focus:border-white transition-all"
                      >
                        <option value="search">Search Bar (Domain Lookup)</option>
                        <option value="store">Online Store (Clay Shop)</option>
                        <option value="invoice">Services UI (Invoice)</option>
                        <option value="calendar">Calendar Booking (Acuity)</option>
                        <option value="custom_image">Custom Graphic Image</option>
                      </select>
                    </div>
                    <div className="sm:col-span-6 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Custom Graphic Image</label>
                        <label className="text-[11px] font-bold text-white/80 hover:text-white cursor-pointer flex items-center gap-1">
                          <i className="fa-solid fa-cloud-arrow-up"></i> {uploading ? 'Uploading...' : 'Upload'}
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
                                setForm((prev) => ({ ...prev, imageUrl: url }));
                              } catch (err: any) {
                                alert(err.message || 'Upload failed');
                              } finally {
                                setUploading(false);
                              }
                            }}
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={form.imageUrl}
                        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                        placeholder="/images/my_graphic.png or Cloudinary URL"
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Description</label>
                    <textarea
                      required
                      rows={4}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Write a brief overview of the services you offer..."
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
                      <Save className="w-4 h-4" /> {editingService ? 'Update Service' : 'Create Service'}
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
