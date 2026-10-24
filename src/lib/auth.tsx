// ============================================
// Firebase Auth Helpers & Context for Admin
// ============================================
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  updatePassword,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { auth } from './firebase';

export const ADMIN_EMAIL = 'admin@havyas.in';
export const ADMIN_PASSWORD = 'havyas2005';

// ── Auth Functions ───────────────────────────────────────────────
export async function signIn(email: string, password: string) {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  const mockEmail =
    (typeof window !== 'undefined'
      ? localStorage.getItem('mock_admin_email')
      : null) || ADMIN_EMAIL;
  const mockPass =
    (typeof window !== 'undefined'
      ? localStorage.getItem('mock_admin_password')
      : null) || ADMIN_PASSWORD;

  const isConfiguredAdmin =
    (cleanEmail === ADMIN_EMAIL && cleanPass === ADMIN_PASSWORD) ||
    (cleanEmail === mockEmail.toLowerCase() && cleanPass === mockPass);

  console.log('[Portfolio Auth] signIn attempt:', {
    inputEmail: cleanEmail,
    firebaseAuthExists: !!auth,
    isConfiguredAdmin,
  });

  // 1. If Firebase is configured, authenticate via Firebase Auth
  if (auth) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
      console.log('[Portfolio Auth] Firebase signIn success:', userCredential.user.email);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('demo_admin_user');
      }
      return userCredential.user;
    } catch (e: any) {
      console.warn('[Portfolio Auth] Firebase signIn error:', e.code, e.message);

      // If credentials match master admin, attempt to auto-create user in Firebase Auth if missing
      if (isConfiguredAdmin) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPass);
          console.log('[Portfolio Auth] Firebase auto-created master admin user:', userCredential.user.email);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('demo_admin_user');
          }
          return userCredential.user;
        } catch (createErr: any) {
          console.log('[Portfolio Auth] Auto-create note:', createErr.code, createErr.message);
        }

        // Master credentials verified: log in successfully
        console.log('[Portfolio Auth] Master credentials verified. Logging in as admin.');
        const adminUser = { uid: 'master-admin-uid', email: ADMIN_EMAIL, displayName: 'Havyas U' };
        if (typeof window !== 'undefined') {
          localStorage.setItem('demo_admin_user', JSON.stringify(adminUser));
          window.dispatchEvent(new Event('auth-state-change'));
        }
        return adminUser;
      }

      throw new Error(e.message || 'Invalid email or password.');
    }
  }

  // 2. Local admin credentials fallback (offline or Firebase unconfigured)
  if (isConfiguredAdmin) {
    console.log('[Portfolio Auth] Fallback login success.');
    const adminUser = { uid: 'master-admin-uid', email: ADMIN_EMAIL, displayName: 'Havyas U' };
    if (typeof window !== 'undefined') {
      localStorage.setItem('demo_admin_user', JSON.stringify(adminUser));
      window.dispatchEvent(new Event('auth-state-change'));
    }
    return adminUser;
  }

  console.error('[Portfolio Auth] Credentials do not match admin values.');
  throw new Error('Invalid email or password.');
}

export async function signOut() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('demo_admin_user');
    window.dispatchEvent(new Event('auth-state-change'));
  }
  if (!auth) return;
  const res = await firebaseSignOut(auth);
  return res;
}

// ── Auth Context ─────────────────────────────────────────────────
interface AuthContextType {
  user: any | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeFirebase: (() => void) | undefined;

    const checkSession = () => {
      const localUser = typeof window !== 'undefined' ? localStorage.getItem('demo_admin_user') : null;
      if (localUser) {
        setUser(JSON.parse(localUser));
        setLoading(false);
      } else {
        if (auth) {
          unsubscribeFirebase = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
          });
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    };

    checkSession();

    const handleAuthChange = () => {
      checkSession();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('auth-state-change', handleAuthChange);
    }

    return () => {
      if (unsubscribeFirebase) unsubscribeFirebase();
      if (typeof window !== 'undefined') {
        window.removeEventListener('auth-state-change', handleAuthChange);
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export async function updateAdminAccount(
  currentPass: string,
  newEmail?: string,
  newPass?: string
): Promise<void> {
  const localUser = typeof window !== 'undefined' ? localStorage.getItem('demo_admin_user') : null;

  if (localUser) {
    // Local fallback mode
    const storedPass = typeof window !== 'undefined' ? localStorage.getItem('mock_admin_password') || ADMIN_PASSWORD : ADMIN_PASSWORD;
    if (currentPass !== storedPass && currentPass !== ADMIN_PASSWORD) {
      throw new Error('Incorrect current password.');
    }
    if (typeof window !== 'undefined') {
      if (newEmail) {
        localStorage.setItem('mock_admin_email', newEmail);
        const userObj = JSON.parse(localUser);
        userObj.email = newEmail;
        localStorage.setItem('demo_admin_user', JSON.stringify(userObj));
        window.dispatchEvent(new Event('auth-state-change'));
      }
      if (newPass) {
        localStorage.setItem('mock_admin_password', newPass);
      }
    }
    return;
  }

  if (auth && auth.currentUser) {
    const user = auth.currentUser;
    if (!user.email) {
      throw new Error('No user email found.');
    }
    // Reauthenticate user
    const credential = EmailAuthProvider.credential(user.email, currentPass);
    await reauthenticateWithCredential(user, credential);
    
    // Update email if provided
    if (newEmail && newEmail !== user.email) {
      await updateEmail(user, newEmail);
      if (typeof window !== 'undefined') {
        localStorage.setItem('mock_admin_email', newEmail);
      }
    }
    
    // Update password if provided
    if (newPass) {
      await updatePassword(user, newPass);
      if (typeof window !== 'undefined') {
        localStorage.setItem('mock_admin_password', newPass);
      }
    }
    return;
  }

  throw new Error('You must be signed in to update settings.');
}
