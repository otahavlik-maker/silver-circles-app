// src/App.jsx - FINAL RECONSTRUCTED AND CORRECTED VERSION

import React, { useState, useEffect, useContext, createContext } from 'react';
import { initializeApp } from 'firebase/app';
import { ErrorBoundary } from 'react-error-boundary'; 
import { useAppStore } from './store/useAppStore'; 

// CORE COMPONENTS & UI ELEMENTS
import EmergencyFallback from './components/atoms/EmergencyFallback';
import PatientMode from './components/modes/PatientMode';
import NurseMode from './components/modes/NurseMode';
import { Button, Card } from './components/atoms/LayoutComponents'; // OPRAVENÝ IMPORT
import SbarTriageModule from './components/SbarTriageModule'; 

// NEWS2 LOGIC
import { calculateNEWS2, SCORING_MATRIX } from './utils/NEWS2Score';

// Firebase Auth & Firestore
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

// Lucide Icons
import {
  Activity, Shield, Users, Bell, Menu, X, LogOut, Settings, ChevronRight,
  Heart, Phone, Calendar, Lock, User, AlertCircle, CheckCircle2, Plus,
  Camera, Syringe, Pill, ShieldAlert, Clock, AlertTriangle,
  Eye, Calculator, HeartPulse, Battery, MessageSquare,
  Wifi, WifiOff
} from 'lucide-react';

// Your Components (Complex Modules)
import HybridMailInterface from './components/HybridMailInterface';
import ExpenseLedger from './components/ExpenseLedger';
import CivicDashboard from './components/CivicDashboard';
import MemorialMode from './components/MemorialMode';
import BioRhythmicDashboard from './components/BioRhythmicDashboard'; 
import LegalVaultAccess from './components/LegalVaultAccess';
import ARMemoryWall from './components/ARMemoryWall';
import ClinicalMedicationManager from './components/ClinicalMedicationManager';
import LegacyManager from './components/LegacyManager';
import SmartDoorbellStream from './components/SmartDoorbellStream';
import CareFundingCalculator from './components/CareFundingCalculator';
import CarerBurnoutTracker from './components/CarerBurnoutTracker';


// ⚠️ YOUR FIREBASE KEYS ⚠️
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

// --- CRYPTO SERVICE ---
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

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
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

// --- DATA HOOK (Exported for component access) ---
export const useDataCollection = (collectionName, constraints = []) => {
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
            if (raw.notes) decrypted.notes = await CryptoService.decrypt(raw.notes, encryptionKey);
            if (raw.value && typeof raw.value === 'string') decrypted.value = await CryptoService.decrypt(raw.value, encryptionKey);
            if (raw.name && typeof raw.name === 'string') decrypted.name = await CryptoService.decrypt(raw.name, encryptionKey);
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
      if (docData.notes) secureData.notes = await CryptoService.encrypt(docData.notes, encryptionKey);
      if (docData.value) secureData.value = await CryptoService.encrypt(docData.value, encryptionKey);
      if (docData.name) secureData.name = await CryptoService.encrypt(docData.name, encryptionKey);
    }
    await addDoc(collection(db, `artifacts/${APP_ID}/users/${user.uid}/${collectionName}`), secureData);
  };

  const remove = async (id) => {
    if (!user || !db) return;
    await deleteDoc(doc(db, `artifacts/${APP_ID}/users/${user.uid}/${collectionName}`, id));
  };

  return { data, add, remove };
};

// --- VITAL SIGNS MODULE (NEWS2) - Exported for shared use ---
export const VitalsModule = () => {
  const { data: vitals, add, remove } = useDataCollection('news_vitals', [orderBy('createdAt', 'desc'), limit(5)]);
  
  const [inputs, setInputs] = useState({
    respiratoryRate: '',
    oxygenSaturation: '',
    systolicBP: '',
    pulseRate: '',
    temperature: '',
    consciousness: 'alert',
    oxygenScale: 1, 
    onSupplementalOxygen: false,
  });
  
  const [newsResult, setNewsResult] = useState(null);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInputs(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const InputField = ({ label, name, unit, required = true }) => (
    <div className="flex flex-col">
      <label className="text-xs font-medium text-slate-500 mb-1">{label}</label>
      <input 
        type={'text'} 
        inputMode={'decimal'}
        name={name} 
        value={inputs[name]} 
        onChange={handleInputChange} 
        placeholder={`Enter ${unit}`} 
        required={required}
        className="p-2 bg-slate-50 rounded-lg text-sm border-none focus:ring-2 focus:ring-indigo-200" 
      />
    </div>
  );

  const logVitals = () => {
    if (!inputs.respiratoryRate || !inputs.oxygenSaturation || !inputs.systolicBP || !inputs.pulseRate || !inputs.temperature) {
        alert('Please fill in all core vital signs.');
        return;
    }
      
    const vitalsData = {
        respiratoryRate: parseFloat(inputs.respiratoryRate),
        oxygenSaturation: parseFloat(inputs.oxygenSaturation),
        systolicBP: parseFloat(inputs.systolicBP),
        pulseRate: parseFloat(inputs.pulseRate),
        temperature: parseFloat(inputs.temperature),
        consciousness: inputs.consciousness,
        oxygenScale: inputs.oxygenScale,
        onSupplementalOxygen: inputs.onSupplementalOxygen,
    };

    const result = calculateNEWS2(vitalsData);
    setNewsResult(result);
    
    add({ 
        ...vitalsData, 
        newsScore: result.score, 
        newsRisk: result.riskLevel,
        value: `${vitalsData.systolicBP}/${vitalsData.pulseRate} (${result.score} NEWS2)`, 
    });
    
    setInputs({
        respiratoryRate: '', oxygenSaturation: '', systolicBP: '', pulseRate: '', temperature: '',
        consciousness: 'alert', oxygenScale: 1, onSupplementalOxygen: false,
    });
  };
  
  return (
    <Card title="NEWS2 Vital Signs Tracker" action={<HeartPulse size={20} className="text-rose-500" />}>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <InputField label="Resp. Rate (RR)" name="respiratoryRate" unit="breaths/min" />
        <InputField label="O₂ Saturation" name="oxygenSaturation" unit="%" />
        <InputField label="Systolic BP" name="systolicBP" unit="mmHg" />
        <InputField label="Pulse Rate" name="pulseRate" unit="bpm" />
        <InputField label="Temperature" name="temperature" unit="°C" />
        <div className="flex flex-col">
          <label className="text-xs font-medium text-slate-500 mb-1">Consciousness (AVPU)</label>
          <select
            name="consciousness" 
            value={inputs.consciousness} 
            onChange={handleInputChange}
            className="p-2 bg-slate-50 rounded-lg text-sm border-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="alert">Alert (A) - Score 0</option>
            <option value="confused">Confused/V/P/U - Score 3</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-4 col-span-2 mt-2 p-3 bg-indigo-50 rounded-lg">
           <div className="flex items-center">
              <input 
                type="checkbox" 
                id="supplementalO2" 
                name="onSupplementalOxygen" 
                checked={inputs.onSupplementalOxygen} 
                onChange={handleInputChange} 
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="supplementalO2" className="ml-2 text-sm font-medium text-indigo-700">O₂ Support (Adds 2 points)</label>
           </div>
           
           <div className="flex items-center">
              <label htmlFor="o2scale" className="text-sm font-medium text-indigo-700 mr-2">O₂ Scale</label>
              <select
                id="o2scale"
                name="oxygenScale" 
                value={inputs.oxygenScale} 
                onChange={handleInputChange}
                className="p-1 bg-white border border-indigo-300 rounded-lg text-xs"
              >
                <option value={1}>Standard (1)</option>
                <option value={2}>COPD/High-Risk (2)</option>
              </select>
           </div>
        </div>
      </div>
      
      <Button onClick={logVitals} className="w-full" Icon={Plus}>Calculate & Log NEWS2 Score</Button>
      
      {/* Display Result */}
      {newsResult && (
        <div className={`mt-4 p-4 rounded-xl border-l-4 ${newsResult.riskLevel === 'High' ? 'bg-red-50 border-red-500' : newsResult.riskLevel === 'Medium' ? 'bg-amber-50 border-amber-500' : 'bg-green-50 border-green-500'}`}>
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-lg">Total NEWS2 Score: {newsResult.score}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${newsResult.riskLevel === 'High' ? 'bg-red-200 text-red-800' : newsResult.riskLevel === 'Medium' ? 'bg-amber-200 text-amber-800' : 'bg-green-200 text-green-800'}`}>{newsResult.riskLevel} Risk</span>
          </div>
          <p className="text-sm text-slate-700 font-medium">{newsResult.clinicalResponse}</p>
        </div>
      )}
      
      {/* Historical Data Display */}
      <div className="mt-6 border-t pt-4 space-y-2">
        <h4 className="text-sm font-bold text-slate-700 mb-2">Recent Logs</h4>
        {vitals.map((v) => (
          <div key={v.id} className="flex justify-between items-center text-sm p-2 hover:bg-slate-50 rounded-lg group">
            <span className={`font-bold ${v.newsRisk === 'High' ? 'text-red-600' : v.newsRisk === 'Medium' ? 'text-amber-600' : 'text-green-600'}`}>{v.newsScore}</span>
            <div className="flex flex-col text-right">
              <span className="font-mono text-xs text-slate-700">{v.value}</span>
              <span className="text-xs text-slate-400">{v.createdAt?.toDate().toLocaleString()}</span>
            </div>
            <button onClick={() => remove(v.id)} className="opacity-0 group-hover:opacity-100 text-rose-400"><X size={14} /></button>
          </div>
        ))}
        {vitals.length === 0 && <div className="text-center text-xs text-slate-400 py-4">No NEWS2 logs recently.</div>}
      </div>
    </Card>
  );
};


const MedicationsModule = () => { return null; }; 


// --- AUTH & SETUP ---
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
    } catch (err) { setError(err.message); }
  };
  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-6">
      <Card>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-900">SilverCircles</h1>
          <p className="text-slate-500">Log In</p>
        </div>
        <form onSubmit={handleAuth} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-xl border bg-slate-50" required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-xl border bg-slate-50" required />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button variant="primary">{isLogin ? 'Log In' : 'Sign Up'}</Button>
        </form>
        <div className="mt-4 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-indigo-600 font-bold">{isLogin ? 'Create Account' : 'Log In'}</button>
        </div>
      </Card>
    </div>
  );
};

const SetupScreen = () => (
  <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
    <div className="max-w-md w-full bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl">
      <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mb-6 mx-auto"><Settings size={32} /></div>
      <h1 className="text-2xl font-bold text-center mb-2">Setup Required</h1>
      <p className="text-slate-400 text-center mb-6">Please add Firebase keys in App.jsx</p>
    </div>
  </div>
);

// --- CARER DASHBOARD (Family/Admin Mode) ---
const CarerDashboard = () => {
  const { unlockVault, encryptionKey, setViewMode } = useContext(AppContext);
  const [pwd, setPwd] = useState('');
  
  // Modals
  const [showMemorial, setShowMemorial] = useState(false);
  const [showAR, setShowAR] = useState(false);
  const [showLegacy, setShowLegacy] = useState(false);
  const [showDoorbell, setShowDoorbell] = useState(false);
  const [showFinance, setShowFinance] = useState(false);
  const [showBurnout, setShowBurnout] = useState(false);

  if (!encryptionKey)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <Card title="Carer Vault Locked">
          <p className="text-sm text-slate-500 mb-4">Enter password to decrypt data.</p>
          <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl mb-4" placeholder="Password" />
          <Button onClick={() => unlockVault(pwd)}>Unlock</Button>
          <button onClick={() => signOut(auth)} className="text-xs text-slate-400 mt-4 w-full">Log Out</button>
        </Card>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 pb-24 relative">
      {/* OVERLAYS */}
      {showMemorial && <MemorialMode onClose={() => setShowMemorial(false)} />}
      {showAR && <ARMemoryWall onClose={() => setShowAR(false)} />}
      {showLegacy && <LegacyManager onClose={() => setShowLegacy(false)} />}
      {showDoorbell && <SmartDoorbellStream onClose={() => setShowDoorbell(false)} />}
      {showFinance && <CareFundingCalculator onClose={() => setShowFinance(false)} />}
      {showBurnout && <CarerBurnoutTracker onClose={() => setShowBurnout(false)} />}

      <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center">
        <h1 className="font-bold text-slate-800 flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg text-white flex items-center justify-center">S</div> CareSync UK
        </h1>
      </header>
      
      <main className="max-w-2xl mx-auto p-4 space-y-6">
        <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg flex justify-between items-start">
          <div><h2 className="text-2xl font-bold">Hi, Sarah</h2><p className="text-indigo-200 text-sm">Caring for: Arthur</p></div><Shield size={24} />
        </div>
        
        <CivicDashboard />

        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => setShowDoorbell(true)} className="bg-slate-800 text-white p-3 rounded-xl flex flex-col items-center justify-center gap-2 text-xs font-bold shadow-lg hover:bg-black transition-colors"><Eye className="text-red-400 animate-pulse" /> Doorbell Cam</button>
          <button onClick={() => setShowFinance(true)} className="bg-white border border-slate-200 text-slate-700 p-3 rounded-xl flex flex-col items-center justify-center gap-2 text-xs font-bold shadow-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors"><Calculator className="text-emerald-500" /> Care Funding</button>
          <button onClick={() => setShowBurnout(true)} className="bg-white border border-slate-200 text-slate-700 p-3 rounded-xl flex flex-col items-center justify-center gap-2 text-xs font-bold shadow-sm hover:bg-rose-50 hover:text-rose-700 transition-colors"><HeartPulse className="text-rose-500" /> My Wellbeing</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ClinicalMedicationManager odtud odstraňujeme! */}
          <HybridMailInterface />
          <ExpenseLedger />
        </div>

        <div className="mt-8"><LegalVaultAccess /></div>

        <div className="pt-12 border-t border-slate-200 mt-8">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Future & Legacy Protocols</p>
          <div className="grid grid-cols-1 gap-3">
            <button onClick={() => setShowAR(true)} className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm hover:bg-slate-800 flex items-center justify-center gap-2 transition-colors shadow-lg shadow-slate-300"><Camera size={16} /> Launch AR Memory Wall</button>
            <button onClick={() => setShowLegacy(true)} className="w-full py-3 bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-sm hover:bg-amber-200 flex items-center justify-center gap-2 transition-colors"><Heart size={16} /> Manage Family Legacy</button>
            <button onClick={() => setShowMemorial(true)} className="w-full py-3 border border-slate-300 rounded-xl text-slate-500 text-sm hover:bg-slate-100 flex items-center justify-center gap-2 transition-colors"><Lock size={14} /> Access Sunset Protocol</button>
          </div>
        </div>
      </main>
    </div>
  );
};
// --- NOVÉ PRVKY (Role & Offline) ---
const RoleSelector = () => {
  const { setMode, currentMode } = useAppStore();
  return (
    <div className="fixed bottom-6 right-6 z-40 flex gap-2 bg-slate-900/90 p-2 rounded-full backdrop-blur border border-white/20 shadow-2xl">
      <button onClick={() => setMode('PATIENT')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${currentMode === 'PATIENT' ? 'bg-yellow-400 text-black shadow-lg' : 'text-white hover:bg-white/10'}`}>Elsie (Patient)</button>
      <button onClick={() => setMode('NURSE')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${currentMode === 'NURSE' ? 'bg-blue-500 text-white shadow-lg' : 'text-white hover:bg-white/10'}`}>Nurse</button>
      <button onClick={() => setMode('FAMILY')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${currentMode === 'FAMILY' ? 'bg-emerald-500 text-white shadow-lg' : 'text-white hover:bg-white/10'}`}>Family/Admin</button>
    </div>
  );
};

const OfflineIndicator = () => {
  const { isOnline, toggleNetwork, pendingSync } = useAppStore();
  return (
    <button 
      onClick={toggleNetwork}
      className={`fixed top-6 right-6 z-40 px-4 py-2 rounded-full shadow-xl border-2 font-bold flex items-center gap-2 transition-all ${isOnline ? 'bg-emerald-100 border-emerald-500 text-emerald-700' : 'bg-rose-100 border-rose-500 text-rose-700'}`}
      title="Click to toggle Network Simulation"
    >
      {isOnline ? <><Wifi size={18} /> Online</> : <><WifiOff size={18} /> Offline ({pendingSync})</>}
    </button>
  );
};

// --- HLAVNÍ LOGIKA PŘEPÍNÁNÍ (AppContent) ---
const AppContent = () => {
  const { user, loading } = useContext(AppContext);
  const { currentMode } = useAppStore();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>;
  if (!user) return <AuthScreen />;
  
  // ZDE SE ROZHODUJE podle zvolené role:
  if (currentMode === 'PATIENT') return <PatientMode />; // Grandpad
  
  // Nurse Mode: Nurse Dashboard, NEWS2 a Clinical Meds pod ním.
  if (currentMode === 'NURSE') return (
    <>
      <NurseMode /> 
      <div className="max-w-2xl mx-auto p-4 space-y-6">
          <VitalsModule /> 
          <ClinicalMedicationManager /> {/* PŘIDÁNO ZDE! */}
      </div>
    </>
  );
  
  // Family/Admin Mode: Pouze Carer Dashboard (NENÍ ZDE ŽÁDNÝ KLINICKÝ NÁSTROJ)
  return (
    <CarerDashboard />
  );
};

export default function App() {
// ... zbytek souboru (beze změny)
  if (!isConfigured) return <SetupScreen />;
  return (
    <ErrorBoundary FallbackComponent={EmergencyFallback}>
      <AppProvider>
        <RoleSelector />
        <OfflineIndicator />
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}