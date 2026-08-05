import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { Plus, Trash2, Save } from 'lucide-react';

export default function SiteContentAdmin() {
  const [activeSection, setActiveSection] = useState('stats');
  const [data, setData] = useState<any>({
    stats: { items: [] },
    timeline: { items: [] },
    client_logos: { items: [] },
    why_choose_us: { items: [] },
    vision_mission: { vision: {}, mission: {} }
  });

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void, loadingId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert("Cloudinary configuration missing in .env!");
      return;
    }

    setUploadingImage(loadingId);
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
        callback(data.secure_url);
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Image upload failed.");
    } finally {
      setUploadingImage(null);
    }
  };

  useEffect(() => {
    const unsubscribes = ['stats', 'timeline', 'client_logos', 'why_choose_us', 'vision_mission'].map(docId => {
      return onSnapshot(doc(db, 'site_content', docId), (snap) => {
        if (snap.exists()) {
          setData((prev: any) => ({ ...prev, [docId]: snap.data() }));
        }
      });
    });
    return () => unsubscribes.forEach(unsub => unsub());
  }, []);

  const handleSave = async (docId: string) => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'site_content', docId), data[docId]);
      alert('Saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Error saving data');
    } finally {
      setSaving(false);
    }
  };

  const updateItem = (docId: string, index: number, field: string, value: string) => {
    const newData = { ...data };
    if (docId === 'client_logos') {
      newData[docId].items[index] = value;
    } else {
      newData[docId].items[index][field] = value;
    }
    setData(newData);
  };

  const addItem = (docId: string, defaultObj: any) => {
    const newData = { ...data };
    newData[docId].items = [...(newData[docId].items || []), defaultObj];
    setData(newData);
  };

  const removeItem = (docId: string, index: number) => {
    const newData = { ...data };
    newData[docId].items.splice(index, 1);
    setData(newData);
  };

  const updateVisionMission = (type: 'vision' | 'mission', field: string, value: string) => {
    const newData = { ...data };
    if (!newData.vision_mission[type]) newData.vision_mission[type] = {};
    newData.vision_mission[type][field] = value;
    setData(newData);
  };

  return (
    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl overflow-hidden flex min-h-[600px]">
      <div className="w-64 bg-slate-50 border-r border-slate-100 p-4 space-y-1">
        {[
          { id: 'stats', label: 'Analytics & Stats' },
          { id: 'client_logos', label: 'Client Logos' },
          { id: 'why_choose_us', label: 'Why Choose Us' },
          { id: 'timeline', label: 'Company Timeline' },
          { id: 'vision_mission', label: 'Vision & Mission' },
        ].map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeSection === s.id ? 'bg-sky-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex-1 p-8 overflow-y-auto max-h-[700px]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-slate-900 capitalize">{activeSection.replace(/_/g, ' ')}</h2>
          <button
            onClick={() => handleSave(activeSection)}
            disabled={saving}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {activeSection === 'stats' && (
          <div className="space-y-4">
            {data.stats.items?.map((stat: any, i: number) => (
              <div key={i} className="flex gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <input placeholder="Metric (e.g. 25+)" value={stat.metric || ''} onChange={e => updateItem('stats', i, 'metric', e.target.value)} className="w-32 border p-2 rounded-lg" />
                <input placeholder="Label (e.g. Years)" value={stat.label || ''} onChange={e => updateItem('stats', i, 'label', e.target.value)} className="w-48 border p-2 rounded-lg" />
                <input placeholder="Description" value={stat.desc || ''} onChange={e => updateItem('stats', i, 'desc', e.target.value)} className="flex-1 border p-2 rounded-lg" />
                <button onClick={() => removeItem('stats', i)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
              </div>
            ))}
            <button onClick={() => addItem('stats', { metric: '', label: '', desc: '' })} className="flex items-center gap-2 text-sky-500 font-bold text-sm hover:text-sky-600"><Plus size={16}/> Add Stat</button>
          </div>
        )}

        {activeSection === 'client_logos' && (
          <div className="space-y-4">
            {data.client_logos.items?.map((logo: string, i: number) => (
              <div key={i} className="flex gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <input placeholder="Client Name" value={logo || ''} onChange={e => updateItem('client_logos', i, '', e.target.value)} className="flex-1 border p-2 rounded-lg" />
                <button onClick={() => removeItem('client_logos', i)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
              </div>
            ))}
            <button onClick={() => addItem('client_logos', '')} className="flex items-center gap-2 text-sky-500 font-bold text-sm hover:text-sky-600"><Plus size={16}/> Add Client Logo</button>
          </div>
        )}

        {activeSection === 'timeline' && (
          <div className="space-y-4">
            {data.timeline.items?.map((item: any, i: number) => (
              <div key={i} className="flex gap-4 items-start bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <input placeholder="Year" value={item.year || ''} onChange={e => updateItem('timeline', i, 'year', e.target.value)} className="w-32 border p-2 rounded-lg" />
                <textarea placeholder="Text" value={item.text || ''} onChange={e => updateItem('timeline', i, 'text', e.target.value)} className="flex-1 border p-2 rounded-lg h-24" />
                <button onClick={() => removeItem('timeline', i)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg mt-1"><Trash2 size={18} /></button>
              </div>
            ))}
            <button onClick={() => addItem('timeline', { year: '', text: '' })} className="flex items-center gap-2 text-sky-500 font-bold text-sm hover:text-sky-600"><Plus size={16}/> Add Timeline Event</button>
          </div>
        )}

        {activeSection === 'why_choose_us' && (
          <div className="space-y-4">
            {data.why_choose_us.items?.map((item: any, i: number) => (
              <div key={i} className="flex flex-col gap-3 bg-slate-50 p-6 rounded-2xl border border-slate-100 relative">
                <button onClick={() => removeItem('why_choose_us', i)} className="absolute top-4 right-4 text-red-500 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                <div className="flex gap-4">
                  <input placeholder="Number (e.g. 01)" value={item.number || ''} onChange={e => updateItem('why_choose_us', i, 'number', e.target.value)} className="w-24 border p-2 rounded-lg font-bold" />
                  <input placeholder="Title" value={item.title || ''} onChange={e => updateItem('why_choose_us', i, 'title', e.target.value)} className="flex-1 border p-2 rounded-lg font-bold" />
                </div>
                <textarea placeholder="Description" value={item.description || ''} onChange={e => updateItem('why_choose_us', i, 'description', e.target.value)} className="w-full border p-2 rounded-lg" />
                <div className="flex gap-2">
                  <input placeholder="Image URL" value={item.image || ''} onChange={e => updateItem('why_choose_us', i, 'image', e.target.value)} className="flex-1 border p-2 rounded-lg text-sm" />
                  <label className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg cursor-pointer text-sm font-semibold transition-colors whitespace-nowrap">
                    {uploadingImage === `why_choose_us-${i}` ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (url) => updateItem('why_choose_us', i, 'image', url), `why_choose_us-${i}`)} />
                  </label>
                </div>
              </div>
            ))}
            <button onClick={() => addItem('why_choose_us', { number: '', title: '', description: '', image: '' })} className="flex items-center gap-2 text-sky-500 font-bold text-sm hover:text-sky-600"><Plus size={16}/> Add Card</button>
          </div>
        )}

        {activeSection === 'vision_mission' && (
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-lg">Vision</h3>
              <input placeholder="Title" value={data.vision_mission.vision?.title || ''} onChange={e => updateVisionMission('vision', 'title', e.target.value)} className="w-full border p-2 rounded-lg font-bold" />
              <textarea placeholder="Description text..." value={data.vision_mission.vision?.text || ''} onChange={e => updateVisionMission('vision', 'text', e.target.value)} className="w-full border p-2 rounded-lg h-32" />
              <div className="flex gap-2">
                <input placeholder="Image URL" value={data.vision_mission.vision?.image || ''} onChange={e => updateVisionMission('vision', 'image', e.target.value)} className="flex-1 border p-2 rounded-lg text-sm" />
                <label className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg cursor-pointer text-sm font-semibold transition-colors whitespace-nowrap">
                  {uploadingImage === 'vision' ? 'Uploading...' : 'Upload Image'}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (url) => updateVisionMission('vision', 'image', url), 'vision')} />
                </label>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-lg">Mission</h3>
              <input placeholder="Title" value={data.vision_mission.mission?.title || ''} onChange={e => updateVisionMission('mission', 'title', e.target.value)} className="w-full border p-2 rounded-lg font-bold" />
              <textarea placeholder="Description text..." value={data.vision_mission.mission?.text || ''} onChange={e => updateVisionMission('mission', 'text', e.target.value)} className="w-full border p-2 rounded-lg h-32" />
              <div className="flex gap-2">
                <input placeholder="Image URL" value={data.vision_mission.mission?.image || ''} onChange={e => updateVisionMission('mission', 'image', e.target.value)} className="flex-1 border p-2 rounded-lg text-sm" />
                <label className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg cursor-pointer text-sm font-semibold transition-colors whitespace-nowrap">
                  {uploadingImage === 'mission' ? 'Uploading...' : 'Upload Image'}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (url) => updateVisionMission('mission', 'image', url), 'mission')} />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
