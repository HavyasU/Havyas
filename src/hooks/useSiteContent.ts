import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

export function useSiteContent(docId: string, defaultData: any) {
  const [data, setData] = useState<any>(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'site_content', docId), (snap) => {
      if (snap.exists()) {
        setData(snap.data());
      } else {
        setData(defaultData);
        // Seed initial data to firestore
        setDoc(doc(db, 'site_content', docId), defaultData).catch(err => console.error("Error seeding data:", err));
      }
      setLoading(false);
    });
    return () => unsub();
  }, [docId]);

  return [data, loading];
}
