import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialPets } from '../data/initialPets';
import { DEFAULT_LOGO_URL, DEFAULT_QR_URL } from '../data/defaultAssets';

const PawsContext = createContext();

const STORAGE_KEYS = {
  PETS: 'pawsfinder_pets_v2',
  CONFIG: 'pawsfinder_config_v2',
  ADMIN: 'pawsfinder_admin_v2',
  CURRENCY: 'pawsfinder_currency_v2'
};

export const SUPPORTED_CURRENCIES = [
  { code: 'NPR', symbol: 'Rs.', label: 'Nepali Rupee (NPR Rs.)' },
  { code: 'USD', symbol: '$', label: 'US Dollar (USD $)' },
  { code: 'EUR', symbol: '€', label: 'Euro (EUR €)' },
  { code: 'GBP', symbol: '£', label: 'British Pound (GBP £)' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee (INR ₹)' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar (AUD A$)' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar (CAD C$)' }
];

const DEFAULT_CONFIG = {
  appTitle: "PawsFinder",
  subtitle: "Nepal & International Lost Pet Recovery Network",
  alertTickerText: "Community Notice: Active lost pet searches in progress. Report sightings or missing pets immediately via hotline or WhatsApp.",
  emergencyPhone: "+977 (984) 123-4567",
  whatsappNumber: "+9779841234567",
  logoUrl: DEFAULT_LOGO_URL,
  donationQrUrl: DEFAULT_QR_URL
};

// Centralized social link configuration
const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/pawsfinder0_0/",
  tiktok: "https://www.tiktok.com/@pawsfinder00",
  youtube: "https://www.youtube.com/@Pawsfinder0_0",
  whatsapp: "https://api.whatsapp.com/send?phone=9779768903634",
  linktree: "https://linktr.ee/pawsfinder0_0?utm_source=linktree_profile_share&ltsid=bd8af591-369a-445b-a0d9-03bcbc398c61",
  // LinkedIn will be set from existing config if present; placeholder for now
  linkedin: null
};

// Poster specific QR codes
const POSTER_QR = {
  instagram: "/qrcodes/instagram.png",
  linktree: "/qrcodes/linktree.png"
};

export const PawsProvider = ({ children }) => {
  // 1. Pet Listings State
  const [pets, setPets] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PETS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse saved pets:", e);
    }
    return initialPets;
  });

  // 2. Site Configuration State
  const [siteConfig, setSiteConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_CONFIG, ...parsed };
      }
    } catch (e) {
      console.error("Failed to parse saved config:", e);
    }
    return DEFAULT_CONFIG;
  });

  // 3. Global Currency Selector State
  const [currency, setCurrencyState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENCY);
      if (saved) {
        const found = SUPPORTED_CURRENCIES.find(c => c.code === saved);
        if (found) return found;
      }
    } catch (e) {
      console.error("Failed to parse currency:", e);
    }
    return SUPPORTED_CURRENCIES[0]; // Default: NPR (Rs.)
  });

  // 4. Admin Authentication State
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEYS.ADMIN);
      return saved === 'true';
    } catch (e) {
      return false;
    }
  });

  // Sync Pets to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(pets));
    } catch (e) {
      console.error("Failed to save pets:", e);
    }
  }, [pets]);

  // Sync Site Config to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(siteConfig));
    } catch (e) {
      console.error("Failed to save config:", e);
    }
  }, [siteConfig]);

  // Sync Currency to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENCY, currency.code);
    } catch (e) {
      console.error("Failed to save currency:", e);
    }
  }, [currency]);

  // Actions
  const changeCurrency = (code) => {
    const found = SUPPORTED_CURRENCIES.find(c => c.code === code);
    if (found) {
      setCurrencyState(found);
    }
  };

  const addPet = (newPetData) => {
    const idNumber = Math.floor(100 + Math.random() * 900);
    const newPet = {
      ...newPetData,
      id: `PF-2026-${idNumber}`,
      createdAt: new Date().toISOString(),
      approved: true,
      status: newPetData.status || 'missing',
      currency: newPetData.currency || currency.code,
      currencySymbol: newPetData.currencySymbol || currency.symbol
    };
    setPets(prev => [newPet, ...prev]);
    return newPet;
  };

  const updatePetStatus = (petId, newStatus) => {
    setPets(prev => prev.map(p => p.id === petId ? { ...p, status: newStatus } : p));
  };

  const approvePet = (petId, approvedState = true) => {
    setPets(prev => prev.map(p => p.id === petId ? { ...p, approved: approvedState } : p));
  };

  const deletePet = (petId) => {
    setPets(prev => prev.filter(p => p.id !== petId));
  };

  const updateSiteConfig = (updatedFields) => {
    setSiteConfig(prev => ({ ...prev, ...updatedFields }));
  };

  const updateLogo = (newLogoUrl) => {
    setSiteConfig(prev => ({ ...prev, logoUrl: newLogoUrl }));
  };

  const updateQrCode = (newQrUrl) => {
    setSiteConfig(prev => ({ ...prev, donationQrUrl: newQrUrl }));
  };

  const loginAdmin = (password) => {
    if (password === 'PAWS_Admin@2026!') {
      setIsAdmin(true);
      sessionStorage.setItem(STORAGE_KEYS.ADMIN, 'true');
      return { success: true };
    }
    return { success: false, message: 'Invalid Admin Password' };
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN);
  };

  const resetToDefault = () => {
    setPets(initialPets);
    setSiteConfig(DEFAULT_CONFIG);
    setCurrencyState(SUPPORTED_CURRENCIES[0]);
    localStorage.removeItem(STORAGE_KEYS.PETS);
    localStorage.removeItem(STORAGE_KEYS.CONFIG);
    localStorage.removeItem(STORAGE_KEYS.CURRENCY);
  };

  return (
    <PawsContext.Provider value={{
      pets,
      siteConfig,
      currency,
      currencies: SUPPORTED_CURRENCIES,
      changeCurrency,
      isAdmin,
      addPet,
      updatePetStatus,
      approvePet,
      deletePet,
      updateSiteConfig,
      updateLogo,
      updateQrCode,
      loginAdmin,
      logoutAdmin,
      resetToDefault
    }}>
      {children}
    </PawsContext.Provider>
  );
};

export const usePaws = () => {
  const context = useContext(PawsContext);
  if (!context) {
    throw new Error('usePaws must be used within a PawsProvider');
  }
  return context;
};
