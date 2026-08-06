import { Link } from 'react-router-dom';
import { Home, Layers, FolderOpen, MessageSquare, Star, Plus, Edit2, Trash2, X, Send, TrendingUp, CheckCircle, Clock, LogOut, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, addDoc, query, orderBy } from 'firebase/firestore';
import AdminLogin from '../components/AdminLogin';
import SiteContentAdmin from '../components/SiteContentAdmin';

type TabType = 'dashboard' | 'services' | 'projects' | 'testimonials' | 'inquiries' | 'content';

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);

  // Firestore Data State
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [uploadingImage, setUploadingImage] = useState(false);

  // 1. Auth Listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoadingAuth(false);
    });
    return () => unsub();
  }, []);

  // 2. Data Listeners
  useEffect(() => {
    if (!user) return;
    
    const unsubInq = onSnapshot(query(collection(db, 'inquiries'), orderBy('date', 'desc')), (snap) => {
      setInquiries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubSvc = onSnapshot(collection(db, 'services'), (snap) => {
      setServices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubPrj = onSnapshot(collection(db, 'projects'), (snap) => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubTst = onSnapshot(collection(db, 'testimonials'), (snap) => {
      setTestimonials(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubInq();
      unsubSvc();
      unsubPrj();
      unsubTst();
    };
  }, [user]);

  if (loadingAuth) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  if (!user) return <AdminLogin />;

  const handleLogout = () => signOut(auth);

  // Status colors for inquiries
  const statusColors: Record<string, string> = {
    new: 'bg-sky-100 text-sky-700',
    read: 'bg-slate-100 text-slate-600',
    replied: 'bg-green-100 text-green-700',
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <TrendingUp size={20} /> },
    { id: 'services', label: 'Services', icon: <Layers size={20} /> },
    { id: 'projects', label: 'Projects', icon: <FolderOpen size={20} /> },
    { id: 'testimonials', label: 'Testimonials', icon: <Star size={20} /> },
    { id: 'inquiries', label: 'Inquiries', icon: <MessageSquare size={20} />, badge: inquiries.filter(i => i.status === 'new').length },
    { id: 'content', label: 'Site Content', icon: <Settings size={20} /> },
  ];

  // --- CRUD ACTIONS ---
  const handleDelete = async (collectionName: string, id: string) => {
    if (window.confirm('Are you sure you want to delete this?')) {
      await deleteDoc(doc(db, collectionName, id));
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
    }
  };

  const handleUpdateInquiryStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, 'inquiries', id), { status });
    setSelectedInquiry({ ...selectedInquiry, status });
  };

  const openModal = (type: 'add' | 'edit', item?: any) => {
    setModalType(type);
    setEditingItem(item || null);
    setFormData(item || {});
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const collName = activeTab;
    try {
      if (modalType === 'add') {
        await addDoc(collection(db, collName), formData);
      } else {
        await updateDoc(doc(db, collName, editingItem.id), formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving document: ", error);
      alert("Failed to save.");
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert("Cloudinary configuration missing in .env!");
      return;
    }

    setUploadingImage(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (data.secure_url) {
        setFormData((prev: any) => ({ ...prev, img: data.secure_url }));
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 fixed top-0 left-0 bottom-0 flex flex-col z-50">
        <div className="px-8 h-24 flex items-center border-b border-slate-100">
          <span className="text-3xl font-black text-slate-900">AFSEC</span>
          <span className="text-cyan-500 text-3xl font-black">.</span>
          <span className="ml-3 text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">Admin</span>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                activeTab === item.id
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {item.label}
              </div>
              {item.badge ? (
                <span className="bg-sky-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-100 flex flex-col gap-1">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
            <Home size={20} /> Back to Site
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-72 flex-1 min-h-screen flex flex-col">
        <div className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-40">
          <h1 className="text-xl font-black text-slate-900 capitalize">
            {activeTab === 'dashboard' ? 'Dashboard Overview' : `${activeTab} Management`}
          </h1>
          <div className="flex items-center gap-3">
            {activeTab === 'dashboard' && services.length === 0 && (
              <button onClick={async () => {
                const svcs = [
                  { title: "Topographic Surveys", active: true, icon: "🗺️", desc: "High precision mapping." },
                  { title: "UAV & LiDAR Mapping", active: true, icon: "🚁", desc: "Aerial point clouds." },
                  { title: "Digital Twins & BIM", active: true, icon: "🏗️", desc: "LOD 500 modelling." },
                  { title: "Hydrographic Surveys", active: true, icon: "🌊", desc: "Bathymetry & port surveys." }
                ];
                const projs = [
                  { title: "Coastal Highway Corridor", category: "ROAD", year: "2023", location: "142 km", img: "https://images.unsplash.com/photo-1541888087425-ce81df8219fa?w=800&q=80" },
                  { title: "Cable-Stayed River Bridge", category: "BRIDGE", year: "2022", location: "0.8 mm acc", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80" },
                  { title: "Downtown Financial Tower", category: "COMMERCIAL", year: "2024", location: "68 floors", img: "https://images.unsplash.com/photo-1691149210746-c6bbb40f4bf6?w=800&q=80" }
                ];
                const tests = [
                  { name: "Khalid Al Mansoori", role: "Project Director, RTA", rating: 5, active: true, quote: "AFSEC delivered our 47km highway corridor survey ahead of schedule with sub-centimeter accuracy." },
                  { name: "Mohammed Al Rashidi", role: "Asset Manager, ADNOC", rating: 5, active: true, quote: "The digital twin solution AFSEC delivered for our industrial facility has become indispensable." }
                ];
                for(let s of svcs) await addDoc(collection(db, 'services'), s);
                for(let p of projs) await addDoc(collection(db, 'projects'), p);
                for(let t of tests) await addDoc(collection(db, 'testimonials'), t);
                alert("Data seeded successfully!");
              }} className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-amber-600 transition-colors">
                Feed Mock Data
              </button>
            )}
            {activeTab !== 'dashboard' && activeTab !== 'inquiries' && (
              <button onClick={() => openModal('add')} className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-sky-600 transition-colors">
                <Plus size={16} /> Add New
              </button>
            )}
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-sm uppercase">
              {user.email?.charAt(0)}
            </div>
          </div>
        </div>

        <div className="p-8 max-w-6xl">
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { label: "Total Services", val: services.length, icon: <Layers size={22} className="text-sky-500" />, bg: "bg-sky-50" },
                  { label: "Total Projects", val: projects.length, icon: <FolderOpen size={22} className="text-emerald-500" />, bg: "bg-emerald-50" },
                  { label: "New Inquiries", val: inquiries.filter(i=>i.status === 'new').length, icon: <MessageSquare size={22} className="text-amber-500" />, bg: "bg-amber-50" },
                  { label: "Testimonials", val: testimonials.length, icon: <Star size={22} className="text-purple-500" />, bg: "bg-purple-50" },
                ].map((s, idx) => (
                  <div key={idx} className="bg-white border border-slate-100 shadow-sm rounded-3xl p-7 flex items-start gap-5 hover:shadow-md transition-shadow">
                    <div className={`${s.bg} p-4 rounded-2xl`}>{s.icon}</div>
                    <div>
                      <div className="text-4xl font-black text-slate-900 mb-1">{s.val}</div>
                      <div className="text-sm font-bold text-slate-600 mb-1.5">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-lg font-black text-slate-900">Recent Inquiries</h2>
                  <button onClick={() => setActiveTab('inquiries')} className="text-sky-500 text-sm font-semibold hover:text-sky-600">View All →</button>
                </div>
                <div className="space-y-3">
                  {inquiries.slice(0, 5).map((inq) => (
                    <div key={inq.id} onClick={() => { setActiveTab('inquiries'); setSelectedInquiry(inq); }} className="flex items-center gap-5 p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-md hover:border-slate-200 transition-all cursor-pointer">
                      <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 font-bold text-lg uppercase">
                        {inq.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-900 text-sm mb-0.5">{inq.name}</div>
                        <div className="text-slate-500 text-xs truncate">{inq.service} — {inq.message?.slice(0, 60)}...</div>
                      </div>
                      <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-bold capitalize ${statusColors[inq.status] || statusColors.new}`}>
                        {inq.status || 'new'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CONTENT ADMIN */}
          {activeTab === 'content' && (
            <SiteContentAdmin />
          )}

          {/* SERVICES */}
          {activeTab === 'services' && (
            <div className="bg-white border border-slate-100 shadow-sm rounded-3xl overflow-hidden">
              <div className="divide-y divide-slate-100">
                {services.map((svc) => (
                  <div key={svc.id} className="flex items-center gap-4 px-6 py-5 hover:bg-slate-50 transition-colors">
                    <div className="text-2xl">{svc.icon || '📌'}</div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900">{svc.title}</div>
                      <div className={`text-xs font-semibold mt-0.5 ${svc.active !== false ? 'text-green-600' : 'text-slate-400'}`}>
                        {svc.active !== false ? '● Active' : '● Inactive'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openModal('edit', svc)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete('services', svc.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROJECTS */}
          {activeTab === 'projects' && (
            <div className="bg-white border border-slate-100 shadow-sm rounded-3xl overflow-hidden">
              <div className="divide-y divide-slate-100">
                {projects.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 px-6 py-5 hover:bg-slate-50 transition-colors">
                    <div className="w-16 h-10 bg-slate-100 rounded-lg overflow-hidden flex shrink-0">
                      {p.img ? <img src={p.img} alt={p.title} className="w-full h-full object-cover"/> : <div className="w-full h-full bg-slate-200"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900">{p.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{p.category} · {p.year}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openModal('edit', p)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete('projects', p.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-5">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-white border border-slate-100 shadow-sm rounded-3xl p-7 flex items-start gap-6 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600 font-bold text-lg shrink-0 uppercase">
                    {t.name?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 mb-0.5">{t.name}</div>
                    <div className="text-slate-500 text-sm mb-3">{t.role}</div>
                    <div className="flex gap-1">
                      {Array.from({ length: t.rating || 5 }).map((_, i) => (
                        <Star key={i} size={14} className="text-sky-400" fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${t.active !== false ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {t.active !== false ? 'Active' : 'Hidden'}
                    </span>
                    <button onClick={() => openModal('edit', t)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete('testimonials', t.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="flex gap-6">
              <div className="flex-1 space-y-3">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    onClick={() => { setSelectedInquiry(inq); if(inq.status==='new') handleUpdateInquiryStatus(inq.id, 'read'); }}
                    className={`bg-white border shadow-sm rounded-3xl p-6 cursor-pointer transition-all ${
                      selectedInquiry?.id === inq.id ? 'border-cyan-400 shadow-md ring-2 ring-cyan-50' : 'border-slate-100 hover:border-slate-200 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600 font-bold text-sm uppercase">
                          {inq.name?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{inq.name}</div>
                          <div className="text-slate-400 text-xs">{inq.email}</div>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${statusColors[inq.status] || statusColors.new}`}>
                        {inq.status || 'new'}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-sky-500 mb-1">{inq.service}</div>
                    <p className="text-slate-600 text-sm line-clamp-2">{inq.message}</p>
                    <div className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
                      <Clock size={11} />{new Date(inq.date?.toDate ? inq.date.toDate() : inq.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                {inquiries.length === 0 && <div className="text-slate-500 text-center py-10">No inquiries yet.</div>}
              </div>

              {selectedInquiry && (
                <div className="w-80 bg-white border border-slate-200 rounded-2xl p-6 h-fit sticky top-24">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-black text-slate-900">Inquiry Details</h3>
                    <div className="flex gap-1">
                      <button onClick={() => handleDelete('inquiries', selectedInquiry.id)} className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors">
                        <Trash2 size={16} className="text-slate-400 hover:text-red-500" />
                      </button>
                      <button onClick={() => setSelectedInquiry(null)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                        <X size={16} className="text-slate-400" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">From</div>
                      <div className="font-bold text-slate-900">{selectedInquiry.name}</div>
                      <div className="text-slate-500 text-sm">{selectedInquiry.email}</div>
                      <div className="text-slate-500 text-sm">{selectedInquiry.phone}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Company</div>
                      <div className="text-sm text-slate-700 font-medium">{selectedInquiry.company || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Service</div>
                      <div className="text-sm text-slate-700 font-medium">{selectedInquiry.service}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Message</div>
                      <p className="text-sm text-slate-600 leading-relaxed">{selectedInquiry.message}</p>
                    </div>
                    <div className="pt-4 border-t border-slate-100 space-y-2">
                      <a href={`mailto:${selectedInquiry.email}`} className="w-full flex items-center justify-center gap-2 bg-sky-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-sky-600 transition-colors">
                        <Send size={15} /> Reply via Email
                      </a>
                      <button onClick={() => handleUpdateInquiryStatus(selectedInquiry.id, 'replied')} className="w-full flex items-center justify-center gap-2 bg-green-50 text-green-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-green-100 transition-colors">
                        <CheckCircle size={15} /> Mark as Replied
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* MODAL (Add/Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-black text-slate-900 mb-6 capitalize">{modalType} {activeTab.slice(0,-1)}</h2>
            
            <form onSubmit={handleModalSubmit} className="space-y-4">
              {/* Dynamic form fields based on active tab */}
              {activeTab === 'services' && (
                <>
                  <div><label className="text-xs font-bold text-slate-500 uppercase">Title</label><input required name="title" value={formData.title||''} onChange={handleFormChange} className="w-full border p-3 rounded-xl mt-1"/></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase">Description</label><textarea required name="desc" value={formData.desc||''} onChange={handleFormChange} className="w-full border p-3 rounded-xl mt-1 h-24"/></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase">Icon Emoji</label><input name="icon" value={formData.icon||''} onChange={handleFormChange} className="w-full border p-3 rounded-xl mt-1"/></div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Image</label>
                    <div className="flex items-center gap-3 mt-1">
                      {formData.img && <img src={formData.img} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />}
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full border p-2 rounded-xl text-sm" />
                    </div>
                    {uploadingImage && <span className="text-xs text-sky-500 mt-1 block">Uploading...</span>}
                  </div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase">Active</label><input type="checkbox" name="active" checked={formData.active!==false} onChange={handleFormChange} className="ml-3"/></div>
                </>
              )}
              {activeTab === 'projects' && (
                <>
                  <div><label className="text-xs font-bold text-slate-500 uppercase">Title</label><input required name="title" value={formData.title||''} onChange={handleFormChange} className="w-full border p-3 rounded-xl mt-1"/></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase">Category</label><input required name="category" value={formData.category||''} onChange={handleFormChange} className="w-full border p-3 rounded-xl mt-1"/></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase">Year</label><input name="year" value={formData.year||''} onChange={handleFormChange} className="w-full border p-3 rounded-xl mt-1"/></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase">Location</label><input name="location" value={formData.location||''} onChange={handleFormChange} className="w-full border p-3 rounded-xl mt-1"/></div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Image</label>
                    <div className="flex items-center gap-3 mt-1">
                      {formData.img && <img src={formData.img} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />}
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full border p-2 rounded-xl text-sm" />
                    </div>
                    {uploadingImage && <span className="text-xs text-sky-500 mt-1 block">Uploading...</span>}
                  </div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase">Description</label><textarea name="desc" value={formData.desc||''} onChange={handleFormChange} className="w-full border p-3 rounded-xl mt-1"/></div>
                </>
              )}
              {activeTab === 'testimonials' && (
                <>
                  <div><label className="text-xs font-bold text-slate-500 uppercase">Name</label><input required name="name" value={formData.name||''} onChange={handleFormChange} className="w-full border p-3 rounded-xl mt-1"/></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase">Role / Company</label><input name="role" value={formData.role||''} onChange={handleFormChange} className="w-full border p-3 rounded-xl mt-1"/></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase">Quote</label><textarea required name="quote" value={formData.quote||''} onChange={handleFormChange} className="w-full border p-3 rounded-xl mt-1"/></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase">Rating (1-5)</label><input type="number" min="1" max="5" name="rating" value={formData.rating||5} onChange={handleFormChange} className="w-full border p-3 rounded-xl mt-1"/></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase">Active</label><input type="checkbox" name="active" checked={formData.active!==false} onChange={handleFormChange} className="ml-3"/></div>
                </>
              )}

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100">Cancel</button>
                <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-sky-600">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
