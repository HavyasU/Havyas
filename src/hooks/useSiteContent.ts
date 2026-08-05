import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export function useSiteContent(docId: string, defaultData: any) {
  const [data, setData] = useState<any>(defaultData);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'site_content', docId), (snap) => {
      if (snap.exists()) {
        setData(snap.data());
      } else {
        setData(defaultData);
      }
    });
    return () => unsub();
  }, [docId]);

  return data;
}
