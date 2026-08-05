import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle, ArrowUpRight, Send } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

type FormValues = {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

const officeLocations = [
  { city: "Dubai", country: "UAE", address: "Level 14, DIFC Gate Building, Dubai", phone: "+971 4 123 4567", email: "dubai@afsec.com" },
  { city: "Abu Dhabi", country: "UAE", address: "Corniche Road, Abu Dhabi", phone: "+971 2 456 7890", email: "abudhabi@afsec.com" },
  { city: "Riyadh", country: "KSA", address: "King Fahad Road, Al Olaya, Riyadh", phone: "+966 11 234 5678", email: "ksa@afsec.com" },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      await addDoc(collection(db, 'inquiries'), {
        ...data,
        status: 'new',
        date: serverTimestamp()
      });
      setSubmitted(true);
      reset();
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Failed to send message. Please try again later.');
    }
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="pt-32 pb-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-label">Get In Touch</span>
          <h1 className="section-heading mb-6">Contact Us</h1>
          <p className="text-xl text-slate-500 max-w-2xl leading-relaxed">
            Ready to start your project? Reach out to our engineering team for a tailored proposal within 48 hours.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Left — Info */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-6">Our Offices</h2>
                <div className="space-y-6">
                  {officeLocations.map((office, idx) => (
                    <div key={idx} className="p-6 border border-slate-200 rounded-2xl hover:border-sky-200 hover:shadow-md transition-all">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center">
                          <MapPin size={16} className="text-sky-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{office.city}</h4>
                          <span className="text-xs text-slate-400">{office.country}</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 mb-3">{office.address}</p>
                      <div className="space-y-1.5">
                        <a href={`tel:${office.phone}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-sky-500 transition-colors">
                          <Phone size={13} />
                          {office.phone}
                        </a>
                        <a href={`mailto:${office.email}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-sky-500 transition-colors">
                          <Mail size={13} />
                          {office.email}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="h-full flex items-center justify-center p-16 bg-green-50 border border-green-100 rounded-3xl text-center">
                  <div>
                    <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
                    <h3 className="text-3xl font-black text-slate-900 mb-4">Inquiry Received!</h3>
                    <p className="text-slate-500 text-lg mb-8">
                      Our engineering team will respond with a tailored proposal within 48 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="btn-primary"
                    >
                      Send Another Inquiry <ArrowUpRight size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-10">
                  <h2 className="text-2xl font-black text-slate-900 mb-8">Send Us a Message</h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label>
                        <input
                          {...register("name", { required: "Name is required" })}
                          placeholder="John Smith"
                          className={`w-full bg-white border rounded-xl px-4 py-3.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all ${errors.name ? 'border-red-300' : 'border-slate-200'}`}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Company</label>
                        <input
                          {...register("company")}
                          placeholder="Company Ltd"
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address *</label>
                        <input
                          type="email"
                          {...register("email", { required: "Email is required" })}
                          placeholder="you@company.com"
                          className={`w-full bg-white border rounded-xl px-4 py-3.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all ${errors.email ? 'border-red-300' : 'border-slate-200'}`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                        <input
                          {...register("phone")}
                          placeholder="+971 50 000 0000"
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Service of Interest</label>
                      <select
                        {...register("service")}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all"
                      >
                        <option value="">Select a service...</option>
                        <option>Topographic Surveys</option>
                        <option>UAV & LiDAR Mapping</option>
                        <option>Digital Twins & BIM</option>
                        <option>Hydrographic Surveys</option>
                        <option>Utility Mapping (GPR)</option>
                        <option>Laser Scanning</option>
                        <option>Deformation Monitoring</option>
                        <option>Geospatial Data Services</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Project Details *</label>
                      <textarea
                        {...register("message", { required: "Please describe your project" })}
                        rows={5}
                        placeholder="Describe your project requirements, timeline, and any specific technical needs..."
                        className={`w-full bg-white border rounded-xl px-4 py-3.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all resize-none ${errors.message ? 'border-red-300' : 'border-slate-200'}`}
                      />
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Submit Inquiry
                        </>
                      )}
                    </button>

                    <p className="text-xs text-slate-400 text-center">
                      We'll respond within 48 hours. Your information is kept confidential.
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
