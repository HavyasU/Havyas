// ============================================
// Firestore CRUD Helpers & Local Storage Fallback
// ============================================
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
  DocumentData,
  Firestore,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Service, Work, Experience, Testimonial, Education, Inquiry } from '@/types';
import { seedServices, seedWorks, seedExperiences, seedTestimonials, seedEducation } from './seedData';

// ── LocalStorage Fallback Helper for Offline Mock CRUD ────────────
const getMockCollection = (name: string): any[] => {
  if (typeof window === 'undefined') return [];
  const key = `mock_db_${name}`;
  let raw = localStorage.getItem(key);
  if (raw && (raw.includes('Maktoum') || raw.includes('NEOM') || raw.includes('PROFORCE') || raw.includes('Al-Rashid') || raw.includes('3D Surface Modelling'))) {
    localStorage.removeItem(key);
    raw = null;
  }
  if (!raw) {
    // Seed default data if not initialized
    let defaultData: any[] = [];
    if (name === 'services') {
      defaultData = seedServices;
    } else if (name === 'works') {
      defaultData = seedWorks;
    } else if (name === 'experience') {
      defaultData = seedExperiences;
    } else if (name === 'testimonials') {
      defaultData = seedTestimonials;
    } else if (name === 'inquiries') {
      defaultData = [
        { id: "1", name: "Example Contact", email: "hello@havyas.in", message: "Hi Havyas, let's build something!", status: "new", createdAt: new Date().toISOString() }
      ];
    }
    // Set auto-generated IDs
    defaultData = defaultData.map((item, index) => ({
      id: (index + 1).toString(),
      ...item,
      createdAt: item.createdAt || new Date().toISOString()
    }));
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  }
  
  const parsed = JSON.parse(raw);
  return parsed.map((item: any) => {
    if (item.createdAt && typeof item.createdAt === 'string') {
      item.createdAt = new Date(item.createdAt);
    }
    return item;
  });
};

const saveMockCollection = (name: string, data: any[]) => {
  if (typeof window === 'undefined') return;
  const key = `mock_db_${name}`;
  localStorage.setItem(key, JSON.stringify(data));
  window.dispatchEvent(new Event('mock-db-update'));
};

const addMockDocument = (name: string, data: any) => {
  const list = getMockCollection(name);
  const newId = Math.random().toString(36).substring(2, 9);
  const newItem = {
    ...data,
    id: newId,
    createdAt: new Date().toISOString(),
  };
  list.push(newItem);
  saveMockCollection(name, list);
  return newId;
};

const updateMockDocument = (name: string, id: string, data: any) => {
  const list = getMockCollection(name);
  const index = list.findIndex((item) => item.id === id);
  if (index !== -1) {
    list[index] = { ...list[index], ...data };
    saveMockCollection(name, list);
  }
};

const deleteMockDocument = (name: string, id: string) => {
  let list = getMockCollection(name);
  list = list.filter((item) => item.id !== id);
  saveMockCollection(name, list);
};

// ── Db Guard ────────────────────────────────────────────────────────
function getDb(): Firestore {
  if (!db) throw new Error('Firebase not configured. Setup .env.local with credentials.');
  return db;
}

// ── Timestamp Conversion ──────────────────────────────────────────
function convertTimestamps(data: DocumentData) {
  const result: Record<string, unknown> = { ...data };
  for (const key of Object.keys(result)) {
    if (result[key] instanceof Timestamp) {
      result[key] = (result[key] as Timestamp).toDate();
    }
  }
  return result;
}

// ── Services CRUD ──────────────────────────────────────────────────
export async function getServices(): Promise<Service[]> {
  if (!db) {
    const list = getMockCollection('services');
    return list.sort((a, b) => (a.order || 0) - (b.order || 0));
  }
  const d = getDb();
  const ref = collection(d, 'services');
  const snapshot = await getDocs(ref);
  const list = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamps(doc.data()),
  })) as Service[];
  return list.sort((a, b) => (a.order || 0) - (b.order || 0));
}

export async function addService(data: Omit<Service, 'id' | 'createdAt'>) {
  if (!db) {
    const list = getMockCollection('services');
    const newItem = {
      ...data,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date()
    };
    list.push(newItem);
    saveMockCollection('services', list);
    return newItem;
  }
  const d = getDb();
  return addDoc(collection(d, 'services'), { ...data, createdAt: Timestamp.now() });
}

export async function updateService(id: string, data: Partial<Service>) {
  if (!db) {
    const list = getMockCollection('services');
    const idx = list.findIndex(item => item.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      saveMockCollection('services', list);
    }
    return;
  }
  const d = getDb();
  return updateDoc(doc(d, 'services', id), data as DocumentData);
}

export async function deleteService(id: string) {
  if (!db) {
    const list = getMockCollection('services');
    const filtered = list.filter(item => item.id !== id);
    saveMockCollection('services', filtered);
    return;
  }
  const d = getDb();
  return deleteDoc(doc(d, 'services', id));
}

// ── Works / Projects CRUD ──────────────────────────────────────────
function sortWorksByOrder(works: Work[]): Work[] {
  return works.sort((a, b) => {
    const orderA = a.order !== undefined && a.order !== null ? Number(a.order) : 999;
    const orderB = b.order !== undefined && b.order !== null ? Number(b.order) : 999;
    if (orderA !== orderB) return orderA - orderB;
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA;
  });
}

export async function getWorks(): Promise<Work[]> {
  if (!db) {
    const list = getMockCollection('works');
    return sortWorksByOrder(list);
  }
  const d = getDb();
  const ref = collection(d, 'works');
  const snapshot = await getDocs(ref);
  const list = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamps(doc.data()),
  })) as Work[];
  return sortWorksByOrder(list);
}

export async function addWork(data: Omit<Work, 'id' | 'createdAt'>) {
  if (!db) {
    const list = getMockCollection('works');
    const newItem = {
      ...data,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date()
    };
    list.push(newItem);
    saveMockCollection('works', list);
    return newItem;
  }
  const d = getDb();
  return addDoc(collection(d, 'works'), { ...data, createdAt: Timestamp.now() });
}

export async function updateWork(id: string, data: Partial<Work>) {
  if (!db) {
    const list = getMockCollection('works');
    const idx = list.findIndex(item => item.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      saveMockCollection('works', list);
    }
    return;
  }
  const d = getDb();
  return updateDoc(doc(d, 'works', id), data as DocumentData);
}

export async function deleteWork(id: string) {
  if (!db) {
    const list = getMockCollection('works');
    const filtered = list.filter(item => item.id !== id);
    saveMockCollection('works', filtered);
    return;
  }
  const d = getDb();
  return deleteDoc(doc(d, 'works', id));
}

// ── Experience CRUD ───────────────────────────────────────────────
export async function getExperiences(): Promise<Experience[]> {
  if (!db) {
    const list = getMockCollection('experience');
    return list.sort((a, b) => (a.order || 0) - (b.order || 0));
  }
  const d = getDb();
  const ref = collection(d, 'experience');
  const snapshot = await getDocs(ref);
  const list = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamps(doc.data()),
  })) as Experience[];
  return list.sort((a, b) => (a.order || 0) - (b.order || 0));
}

export async function addExperience(data: Omit<Experience, 'id' | 'createdAt'>) {
  if (!db) {
    const list = getMockCollection('experience');
    const newItem = {
      ...data,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date()
    };
    list.push(newItem);
    saveMockCollection('experience', list);
    return newItem;
  }
  const d = getDb();
  return addDoc(collection(d, 'experience'), { ...data, createdAt: Timestamp.now() });
}

export async function updateExperience(id: string, data: Partial<Experience>) {
  if (!db) {
    const list = getMockCollection('experience');
    const idx = list.findIndex(item => item.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      saveMockCollection('experience', list);
    }
    return;
  }
  const d = getDb();
  return updateDoc(doc(d, 'experience', id), data as DocumentData);
}

export async function deleteExperience(id: string) {
  if (!db) {
    const list = getMockCollection('experience');
    const filtered = list.filter(item => item.id !== id);
    saveMockCollection('experience', filtered);
    return;
  }
  const d = getDb();
  return deleteDoc(doc(d, 'experience', id));
}

// ── Testimonials CRUD ─────────────────────────────────────────────
export async function getTestimonials(): Promise<Testimonial[]> {
  if (!db) {
    const list = getMockCollection('testimonials');
    return list.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
  }
  const d = getDb();
  const ref = collection(d, 'testimonials');
  const snapshot = await getDocs(ref);
  const list = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamps(doc.data()),
  })) as Testimonial[];
  return list.sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA;
  });
}

export async function addTestimonial(data: Omit<Testimonial, 'id' | 'createdAt'>) {
  if (!db) {
    const list = getMockCollection('testimonials');
    const newItem = {
      ...data,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date()
    };
    list.push(newItem);
    saveMockCollection('testimonials', list);
    return newItem;
  }
  const d = getDb();
  return addDoc(collection(d, 'testimonials'), { ...data, createdAt: Timestamp.now() });
}

export async function updateTestimonial(id: string, data: Partial<Testimonial>) {
  if (!db) {
    const list = getMockCollection('testimonials');
    const idx = list.findIndex(item => item.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      saveMockCollection('testimonials', list);
    }
    return;
  }
  const d = getDb();
  return updateDoc(doc(d, 'testimonials', id), data as DocumentData);
}

export async function deleteTestimonial(id: string) {
  if (!db) {
    const list = getMockCollection('testimonials');
    const filtered = list.filter(item => item.id !== id);
    saveMockCollection('testimonials', filtered);
    return;
  }
  const d = getDb();
  return deleteDoc(doc(d, 'testimonials', id));
}

// ── Inquiries CRUD ────────────────────────────────────────────────
export async function getInquiries(): Promise<Inquiry[]> {
  if (!db) {
    const list = getMockCollection('inquiries');
    return list.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
  }
  const d = getDb();
  const ref = collection(d, 'inquiries');
  const snapshot = await getDocs(ref);
  const list = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamps(doc.data()),
  })) as Inquiry[];
  return list.sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA;
  });
}

export async function addInquiry(data: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) {
  if (!db) {
    const list = getMockCollection('inquiries');
    const newItem = {
      ...data,
      id: Math.random().toString(36).substring(2, 9),
      status: 'new' as const,
      createdAt: new Date()
    };
    list.push(newItem);
    saveMockCollection('inquiries', list);
    return newItem;
  }
  const d = getDb();
  return addDoc(collection(d, 'inquiries'), { ...data, status: 'new', createdAt: Timestamp.now() });
}

export async function updateInquiryStatus(id: string, status: Inquiry['status']) {
  if (!db) {
    const list = getMockCollection('inquiries');
    const idx = list.findIndex(item => item.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      saveMockCollection('inquiries', list);
    }
    return;
  }
  const d = getDb();
  return updateDoc(doc(d, 'inquiries', id), { status });
}

export async function deleteInquiry(id: string) {
  if (!db) {
    const list = getMockCollection('inquiries');
    const filtered = list.filter(item => item.id !== id);
    saveMockCollection('inquiries', filtered);
    return;
  }
  const d = getDb();
  return deleteDoc(doc(d, 'inquiries', id));
}

// ── Dashboard Stats ──────────────────────────────────────────────
export async function getDashboardStats() {
  if (!db) {
    const services = getMockCollection('services');
    const works = getMockCollection('works');
    const experience = getMockCollection('experience');
    const testimonials = getMockCollection('testimonials');
    const inquiries = getMockCollection('inquiries');
    const newInquiries = inquiries.filter(item => item.status === 'new').length;

    return {
      totalServices: services.length,
      totalWorks: works.length,
      totalExperience: experience.length,
      totalTestimonials: testimonials.length,
      totalInquiries: inquiries.length,
      newInquiries,
    };
  }
  const d = getDb();
  const [services, works, experience, testimonials, inquiries] = await Promise.all([
    getDocs(collection(d, 'services')),
    getDocs(collection(d, 'works')),
    getDocs(collection(d, 'experience')),
    getDocs(collection(d, 'testimonials')),
    getDocs(collection(d, 'inquiries')),
  ]);

  const newInquiries = inquiries.docs.filter(
    (doc) => doc.data().status === 'new'
  ).length;

  return {
    totalServices: services.size,
    totalWorks: works.size,
    totalExperience: experience.size,
    totalTestimonials: testimonials.size,
    totalInquiries: inquiries.size,
    newInquiries,
  };
}

// ── Seeding ──────────────────────────────────────────────────────
export async function seedFirestore() {
  if (!db) {
    throw new Error('Firebase is not configured. Setup environment variables.');
  }

  const d = getDb();

  // 1. Seed Services - Clear existing and seed new ones to ensure database updates
  const servicesSnap = await getDocs(collection(d, 'services'));
  for (const docSnap of servicesSnap.docs) {
    await deleteDoc(doc(d, 'services', docSnap.id));
  }
  for (const service of seedServices) {
    await addDoc(collection(d, 'services'), { ...service, createdAt: Timestamp.now() });
  }

  // 2. Seed Works - Clear existing and seed new ones to ensure database updates
  const worksSnap = await getDocs(collection(d, 'works'));
  for (const docSnap of worksSnap.docs) {
    await deleteDoc(doc(d, 'works', docSnap.id));
  }
  for (const work of seedWorks) {
    await addDoc(collection(d, 'works'), { ...work, createdAt: Timestamp.now() });
  }

  // 3. Seed Experiences
  const expSnap = await getDocs(collection(d, 'experience'));
  if (expSnap.empty) {
    for (const exp of seedExperiences) {
      await addDoc(collection(d, 'experience'), { ...exp, createdAt: Timestamp.now() });
    }
  }

  // 4. Seed Testimonials
  const testSnap = await getDocs(collection(d, 'testimonials'));
  if (testSnap.empty) {
    for (const test of seedTestimonials) {
      await addDoc(collection(d, 'testimonials'), { ...test, createdAt: Timestamp.now() });
    }
  }
}

// ── Live Subscriptions (Admin Panel Real-time Sync) ───────────────
export function subscribeToWorks(callback: (works: Work[]) => void) {
  if (!db) {
    callback(sortWorksByOrder(getMockCollection('works')));
    const listener = () => {
      callback(sortWorksByOrder(getMockCollection('works')));
    };
    window.addEventListener('mock-db-update', listener);
    return () => window.removeEventListener('mock-db-update', listener);
  }
  const d = getDb();
  const ref = collection(d, 'works');
  return onSnapshot(ref, async (snapshot) => {
    const list = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...convertTimestamps(docSnap.data()),
    })) as Work[];

    // Auto-sync client database if old seed works or missing order fields are detected
    const isOldData = list.length === 0 || list.some((w) => w.title.includes('Connect - Social Media') || w.order === undefined);
    if (isOldData && typeof window !== 'undefined') {
      try {
        for (const docSnap of snapshot.docs) {
          await deleteDoc(doc(d, 'works', docSnap.id));
        }
        for (const work of seedWorks) {
          await addDoc(collection(d, 'works'), { ...work, createdAt: Timestamp.now() });
        }
        return;
      } catch (e) {
        console.warn('Auto sync works skipped:', e);
      }
    }

    callback(sortWorksByOrder(list));
  }, (error) => {
    console.error("subscribeToWorks failed:", error);
  });
}

export function subscribeToWork(id: string, callback: (work: Work | null) => void) {
  if (!db) {
    const list = getMockCollection('works');
    const item = list.find(w => w.id === id) || null;
    callback(item);
    const listener = () => {
      const updatedList = getMockCollection('works');
      const updatedItem = updatedList.find(w => w.id === id) || null;
      callback(updatedItem);
    };
    window.addEventListener('mock-db-update', listener);
    return () => window.removeEventListener('mock-db-update', listener);
  }
  const d = getDb();
  return onSnapshot(doc(d, 'works', id), (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...convertTimestamps(docSnap.data()) } as Work);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error("subscribeToWork failed:", error);
  });
}

// ── Education CRUD ───────────────────────────────────────────────
export async function getEducation(): Promise<Education[]> {
  if (!db) return getMockCollection('education').sort((a, b) => (a.order || 0) - (b.order || 0));
  const d = getDb();
  const snap = await getDocs(collection(d, 'education'));
  const list = snap.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) })) as Education[];
  return list.sort((a, b) => (a.order || 0) - (b.order || 0));
}

export async function addEducation(data: Omit<Education, 'id'>) {
  if (!db) return addMockDocument('education', data);
  const d = getDb();
  const ref = await addDoc(collection(d, 'education'), { ...data, createdAt: Timestamp.now() });
  return ref.id;
}

export async function updateEducation(id: string, data: Partial<Education>) {
  if (!db) return updateMockDocument('education', id, data);
  const d = getDb();
  await updateDoc(doc(d, 'education', id), data);
}

export async function deleteEducation(id: string) {
  if (!db) return deleteMockDocument('education', id);
  const d = getDb();
  await deleteDoc(doc(d, 'education', id));
}

export function subscribeToEducation(callback: (education: Education[]) => void) {
  if (!db) {
    callback(getMockCollection('education').sort((a, b) => (a.order || 0) - (b.order || 0)));
    const listener = () => {
      callback(getMockCollection('education').sort((a, b) => (a.order || 0) - (b.order || 0)));
    };
    window.addEventListener('mock-db-update', listener);
    return () => window.removeEventListener('mock-db-update', listener);
  }
  const d = getDb();
  const ref = collection(d, 'education');
  return onSnapshot(ref, async (snapshot) => {
    const list = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...convertTimestamps(docSnap.data()),
    })) as Education[];

    // Auto-sync seedEducation if collection is empty
    if (list.length === 0 && typeof window !== 'undefined') {
      try {
        for (const edu of seedEducation) {
          await addDoc(collection(d, 'education'), { ...edu, createdAt: Timestamp.now() });
        }
        return;
      } catch (e) {
        console.warn('Auto sync education skipped:', e);
      }
    }

    list.sort((a, b) => (a.order || 0) - (b.order || 0));
    callback(list);
  }, (error) => {
    console.error("subscribeToEducation failed:", error);
  });
}

export function subscribeToServices(callback: (services: Service[]) => void) {
  if (!db) {
    callback(getMockCollection('services').sort((a, b) => (a.order || 0) - (b.order || 0)));
    const listener = () => {
      callback(getMockCollection('services').sort((a, b) => (a.order || 0) - (b.order || 0)));
    };
    window.addEventListener('mock-db-update', listener);
    return () => window.removeEventListener('mock-db-update', listener);
  }
  const d = getDb();
  const ref = collection(d, 'services');
  return onSnapshot(ref, async (snapshot) => {
    const list = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...convertTimestamps(docSnap.data()),
    })) as Service[];

    // Auto-seed initial services only if collection is completely empty
    if (list.length === 0 && typeof window !== 'undefined') {
      try {
        for (const service of seedServices) {
          await addDoc(collection(d, 'services'), { ...service, createdAt: Timestamp.now() });
        }
        return;
      } catch (e) {
        console.warn('Auto sync services skipped:', e);
      }
    }

    list.sort((a, b) => (a.order || 0) - (b.order || 0));
    callback(list);
  }, (error) => {
    console.error("subscribeToServices failed:", error);
  });
}

export function subscribeToExperiences(callback: (experiences: Experience[]) => void) {
  if (!db) {
    callback(getMockCollection('experience').sort((a, b) => (a.order || 0) - (b.order || 0)));
    const listener = () => {
      callback(getMockCollection('experience').sort((a, b) => (a.order || 0) - (b.order || 0)));
    };
    window.addEventListener('mock-db-update', listener);
    return () => window.removeEventListener('mock-db-update', listener);
  }
  const d = getDb();
  const ref = collection(d, 'experience');
  return onSnapshot(ref, (snapshot) => {
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...convertTimestamps(doc.data()),
    })) as Experience[];
    list.sort((a, b) => (a.order || 0) - (b.order || 0));
    callback(list);
  }, (error) => {
    console.error("subscribeToExperiences failed:", error);
  });
}

export function subscribeToTestimonials(callback: (testimonials: Testimonial[]) => void) {
  if (!db) {
    callback(getMockCollection('testimonials').sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    }));
    const listener = () => {
      callback(getMockCollection('testimonials').sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      }));
    };
    window.addEventListener('mock-db-update', listener);
    return () => window.removeEventListener('mock-db-update', listener);
  }
  const d = getDb();
  const ref = collection(d, 'testimonials');
  return onSnapshot(ref, (snapshot) => {
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...convertTimestamps(doc.data()),
    })) as Testimonial[];
    list.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
    callback(list);
  }, (error) => {
    console.error("subscribeToTestimonials failed:", error);
  });
}

export function subscribeToInquiries(callback: (inquiries: Inquiry[]) => void) {
  if (!db) {
    callback(getMockCollection('inquiries').sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    }));
    const listener = () => {
      callback(getMockCollection('inquiries').sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      }));
    };
    window.addEventListener('mock-db-update', listener);
    return () => window.removeEventListener('mock-db-update', listener);
  }
  const d = getDb();
  const ref = collection(d, 'inquiries');
  return onSnapshot(ref, (snapshot) => {
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...convertTimestamps(doc.data()),
    })) as Inquiry[];
    list.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
    callback(list);
  }, (error) => {
    console.error("subscribeToInquiries failed:", error);
  });
}

// ── Dynamic Resume Settings CRUD ────────────────────────────────────────
export function subscribeToResumeUrl(callback: (url: string) => void) {
  const getFallback = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('resume_url') || '/havyasU_Resume.pdf';
    }
    return '/havyasU_Resume.pdf';
  };

  callback(getFallback());

  if (typeof window !== 'undefined') {
    const listener = () => {
      callback(getFallback());
    };
    window.addEventListener('mock-db-update', listener);
  }

  if (!db) return () => {};

  try {
    const d = getDb();
    const ref = doc(d, 'settings', 'profile');
    return onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists() && snapshot.data().resumeUrl) {
          callback(snapshot.data().resumeUrl);
        } else {
          callback(getFallback());
        }
      },
      (_error) => {
        // Fallback silently if Firestore permission is denied for settings collection
        callback(getFallback());
      }
    );
  } catch (_e) {
    callback(getFallback());
    return () => {};
  }
}

export async function updateResumeUrl(url: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('resume_url', url);
    window.dispatchEvent(new Event('mock-db-update'));
  }
  if (!db) return;
  try {
    const d = getDb();
    const ref = doc(d, 'settings', 'profile');
    await setDoc(ref, { resumeUrl: url, updatedAt: Timestamp.now() }, { merge: true });
  } catch (err) {
    console.warn("Firestore resume sync skipped (local storage updated):", err);
  }
}
