import React, { useState, useEffect, useContext, createContext } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  onSnapshot,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import {
  Activity,
  Shield,
  Users,
  Bell,
  Menu,
  X,
  LogOut,
  Settings,
  ChevronRight,
  Heart,
  Phone,
  Calendar,
  Lock,
  User,
  AlertCircle,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import HybridMailInterface from './components/HybridMailInterface';
import ExpenseLedger from './components/ExpenseLedger';
import CivicDashboard from './components/CivicDashboard';
import MemorialMode from './components/MemorialMode';
const CarerDashboard = () => {
  const { unlockVault, encryptionKey, setViewMode } = useContext(AppContext);
  const [pwd, setPwd] = useState('');
  const [showMemorial, setShowMemorial] = useState(false); // State for the Sunset Mode

  if (!encryptionKey)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <Card title="Carer Vault Locked">
          <p className="text-sm text-slate-500 mb-4">
            Enter password to decrypt data.
          </p>
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            className="w-full p-3 bg-slate-50 rounded-xl mb-4"
            placeholder="Password"
          />
          <Button onClick={() => unlockVault(pwd)}>Unlock</Button>
          <button
            onClick={() => signOut(auth)}
            className="text-xs text-slate-400 mt-4 w-full"
          >
            Log Out
          </button>
        </Card>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 pb-24 relative">
      {/* OVERLAY: Memorial Mode */}
      {showMemorial && <MemorialMode onClose={() => setShowMemorial(false)} />}

      <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center">
        <h1 className="font-bold text-slate-800 flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg text-white flex items-center justify-center">
            S
          </div>{' '}
          SilverCircles
        </h1>
        <Button
          variant="ghost"
          size="sm"
          icon={Settings}
          onClick={() => setViewMode('senior')}
        >
          Switch
        </Button>
      </header>
      
      <main className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header Section */}
        <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Hi, Sarah</h2>
            <p className="text-indigo-200 text-sm">Caring for: Arthur</p>
          </div>
          <Shield size={24} />
        </div>
        
        {/* Civic Radar (Full Width) */}
        <CivicDashboard />

        {/* Modules Grid (2x2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VitalsModule />
          <MedicationsModule />
          <HybridMailInterface />
          <ExpenseLedger />
        </div>

        {/* Danger Zone / Admin Footer */}
        <div className="pt-12 border-t border-slate-200 mt-8">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            Advanced Administration
          </p>
          <button 
            onClick={() => setShowMemorial(true)}
            className="w-full py-3 border border-slate-300 rounded-xl text-slate-500 text-sm hover:bg-slate-100 flex items-center justify-center gap-2 transition-colors"
          >
            <Lock size={14} />
            Access Sunset Protocol (Memorial Mode)
          </button>
        </div>
      </main>
    </div>
  );
};
// ⚠️ PASTE YOUR FIREBASE KEYS HERE ⚠️
const firebaseConfig = {
  apiKey: 'AIzaSyCtCjATLBSM6bkzt8bfGcs69FgQkfoTlZs',
  authDomain: 'silvercircles-f5e17.firebaseapp.com',
  projectId: 'silvercircles-f5e17',
  storageBucket: 'silvercircles-f5e17.firebasestorage.app',
  messagingSenderId: '620087008338',
  appId: '1:620087008338:web:599d54c1190d74119c138b',
};

let app, auth, db;
const isConfigured = firebaseConfig.apiKey && firebaseConfig.apiKey.length > 5;

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
  }
}

const APP_ID = 'silver-circles-core';

const CryptoService = {
  ENC_PREFIX: 'enc::',
  deriveKey: async (password, salt) => {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: enc.encode(salt),
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  },
  encrypt: async (text, key) => {
    if (!key || !text) return text;
    try {
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encoded = new TextEncoder().encode(text);
      const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoded
      );
      return (
        CryptoService.ENC_PREFIX +
        btoa(
          JSON.stringify({
            iv: Array.from(iv),
            data: Array.from(new Uint8Array(encrypted)),
          })
        )
      );
    } catch (e) {
      return text;
    }
  },
  decrypt: async (cipherText, key) => {
    if (!key || !cipherText || !cipherText.startsWith(CryptoService.ENC_PREFIX))
      return cipherText;
    try {
      const raw = atob(cipherText.substring(CryptoService.ENC_PREFIX.length));
      const { iv, data } = JSON.parse(raw);
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(iv) },
        key,
        new Uint8Array(data)
      );
      return new TextDecoder().decode(decrypted);
    } catch (e) {
      return '**Locked Data**';
    }
  },
};

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [encryptionKey, setEncryptionKey] = useState(null);
  const [viewMode, setViewMode] = useState('carer');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) setEncryptionKey(null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const unlockVault = async (password) => {
    if (!user) return false;
    try {
      const key = await CryptoService.deriveKey(password, user.uid);
      setEncryptionKey(key);
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        encryptionKey,
        unlockVault,
        viewMode,
        setViewMode,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useDataCollection = (collectionName, constraints = []) => {
  const { user, encryptionKey } = useContext(AppContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!user || !db) return;
    const ref = collection(
      db,
      `artifacts/${APP_ID}/users/${user.uid}/${collectionName}`
    );
    const safeConstraints = Array.isArray(constraints) ? constraints : [];
    const q = query(ref, ...safeConstraints);
    const unsub = onSnapshot(q, async (snap) => {
      const items = await Promise.all(
        snap.docs.map(async (doc) => {
          const raw = doc.data();
          const decrypted = { ...raw, id: doc.id };
          if (encryptionKey) {
            if (raw.notes)
              decrypted.notes = await CryptoService.decrypt(
                raw.notes,
                encryptionKey
              );
            if (raw.value && typeof raw.value === 'string')
              decrypted.value = await CryptoService.decrypt(
                raw.value,
                encryptionKey
              );
            if (raw.name && typeof raw.name === 'string')
              decrypted.name = await CryptoService.decrypt(
                raw.name,
                encryptionKey
              );
          }
          return decrypted;
        })
      );
      setData(items);
    });
    return () => unsub();
  }, [user, encryptionKey, collectionName]);

  const add = async (docData) => {
    if (!user || !db) return;
    const secureData = { ...docData, createdAt: serverTimestamp() };
    if (encryptionKey) {
      if (docData.notes)
        secureData.notes = await CryptoService.encrypt(
          docData.notes,
          encryptionKey
        );
      if (docData.value)
        secureData.value = await CryptoService.encrypt(
          docData.value,
          encryptionKey
        );
      if (docData.name)
        secureData.name = await CryptoService.encrypt(
          docData.name,
          encryptionKey
        );
    }
    await addDoc(
      collection(db, `artifacts/${APP_ID}/users/${user.uid}/${collectionName}`),
      secureData
    );
  };

  const remove = async (id) => {
    if (!user || !db) return;
    await deleteDoc(
      doc(db, `artifacts/${APP_ID}/users/${user.uid}/${collectionName}`, id)
    );
  };

  return { data, add, remove };
};

const Button = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  icon: Icon,
  size = 'md',
}) => {
  const baseStyle =
    'rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2';
  const sizes = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-lg',
  };
  const variants = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200',
    secondary:
      'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
    danger: 'bg-rose-100 text-rose-600 hover:bg-rose-200',
    ghost: 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50',
  };
  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={size === 'lg' ? 24 : 18} />}
      {children}
    </button>
  );
};

const Card = ({ children, title, action }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
    {(title || action) && (
      <div className="flex justify-between items-center mb-4">
        {title && <h3 className="font-bold text-slate-800">{title}</h3>}
        {action}
      </div>
    )}
    {children}
  </div>
);

const VitalsModule = () => {
  const {
    data: vitals,
    add,
    remove,
  } = useDataCollection('vitals', [orderBy('createdAt', 'desc'), limit(5)]);
  const [val, setVal] = useState('');
  return (
    <Card
      title="Vital Signs"
      action={<Activity size={20} className="text-rose-500" />}
    >
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="e.g. 120/80 BP"
          className="flex-1 p-2 bg-slate-50 rounded-lg text-sm border-none"
        />
        <Button
          size="sm"
          onClick={() => {
            add({ value: val });
            setVal('');
          }}
        >
          Log
        </Button>
      </div>
      <div className="space-y-2">
        {vitals.map((v) => (
          <div
            key={v.id}
            className="flex justify-between items-center text-sm p-2 hover:bg-slate-50 rounded-lg group"
          >
            <span className="font-mono font-medium text-slate-700">
              {v.value}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">
                {v.createdAt?.toDate().toLocaleDateString()}
              </span>
              <button
                onClick={() => remove(v.id)}
                className="opacity-0 group-hover:opacity-100 text-rose-400"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
        {vitals.length === 0 && (
          <div className="text-center text-xs text-slate-400 py-4">
            No vitals logged recently.
          </div>
        )}
      </div>
    </Card>
  );
};

const MedicationsModule = () => {
  const {
    data: meds,
    add,
    remove,
  } = useDataCollection('medications', [orderBy('time', 'asc')]);
  const [name, setName] = useState('');
  const [time, setTime] = useState('');

  const handleAdd = () => {
    if (!name || !time) return;
    add({ name: name, time: time, lastTaken: serverTimestamp() });
    setName('');
    setTime('');
  };

  return (
    <Card
      title="Medications"
      action={<Bell size={20} className="text-indigo-500" />}
    >
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Pill Name"
          className="flex-[2] p-2 bg-slate-50 rounded-lg text-sm border-none"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="flex-1 p-2 bg-slate-50 rounded-lg text-sm border-none"
        />
        <Button size="sm" onClick={handleAdd}>
          Add
        </Button>
      </div>
      <div className="space-y-2">
        {meds.map((m) => (
          <div
            key={m.id}
            className="flex justify-between items-center text-sm p-3 border-l-4 border-indigo-200 hover:bg-slate-50 rounded-lg group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 text-indigo-600 font-bold px-2 py-1 rounded text-xs">
                {m.time}
              </div>
              <span className="font-medium text-slate-700">{m.name}</span>
            </div>
            <button
              onClick={() => remove(m.id)}
              className="opacity-0 group-hover:opacity-100 text-rose-400"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {meds.length === 0 && (
          <div className="text-center text-xs text-slate-400 py-4">
            No meds scheduled.
          </div>
        )}
      </div>
    </Card>
  );
};



const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) await signInWithEmailAndPassword(auth, email, password);
      else await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-6">
      <Card>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-900">SilverCircles</h1>
          <p className="text-slate-500">Log In</p>
        </div>
        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl border bg-slate-50"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl border bg-slate-50"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button variant="primary">{isLogin ? 'Log In' : 'Sign Up'}</Button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-indigo-600 font-bold"
          >
            {isLogin ? 'Create Account' : 'Log In'}
          </button>
        </div>
      </Card>
    </div>
  );
};

const SetupScreen = () => (
  <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
    <div className="max-w-md w-full bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl">
      <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mb-6 mx-auto">
        <Settings size={32} />
      </div>
      <h1 className="text-2xl font-bold text-center mb-2">Setup Required</h1>
      <p className="text-slate-400 text-center mb-6">
        The app is running, but it's not connected to the database yet.
      </p>
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 text-sm font-mono text-indigo-300 mb-6">
        1. Open App.jsx
        <br />
        2. Find "const firebaseConfig"
        <br />
        3. Paste your keys there.
      </div>
      <button
        onClick={() => window.location.reload()}
        className="w-full bg-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-500 transition-colors"
      >
        I Added the Keys (Reload)
      </button>
    </div>
  </div>
);

// ⚠️ ADDED LOGIC: This component was missing from your snippet but is required to make it run
const AppContent = () => {
  const { user, viewMode, loading } = useContext(AppContext);
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        Loading...
      </div>
    );
  if (!user) return <AuthScreen />;
  if (viewMode === 'senior') return <SeniorInterface />;
  return <CarerDashboard />;
};

export default function App() {
  if (!isConfigured) return <SetupScreen />;
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
