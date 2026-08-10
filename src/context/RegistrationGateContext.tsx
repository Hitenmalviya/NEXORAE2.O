import React, { createContext, useContext, useState, useEffect } from 'react';

interface RegistrationGateContextType {
  isOpen: boolean;
  nexoraeId: string | null;
  isAuthenticated: boolean;
  openGate: (url: string) => void;
  closeGate: () => void;
  verifyAndProceed: () => void;
  handleRegister: (eventUrl: string) => void;
  logout: () => void;
}

const RegistrationGateContext = createContext<RegistrationGateContextType | undefined>(undefined);

// Safe localStorage helper to prevent crashes in iframe/sandboxed environments (e.g. Vercel preview pane, strict browser settings)
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('[RegistrationGate] localStorage.getItem access blocked:', e);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('[RegistrationGate] localStorage.setItem access blocked:', e);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('[RegistrationGate] localStorage.removeItem access blocked:', e);
    }
  }
};

export const RegistrationGateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [nexoraeId, setNexoraeId] = useState<string | null>(null);

  // Load NEXORAE ID from localStorage on mount
  useEffect(() => {
    const storedId = safeStorage.getItem('nexorae_id');
    if (storedId) {
      setNexoraeId(storedId);
    }
  }, []);

  const openGate = (url: string) => {
    setPendingUrl(url);
    setIsOpen(true);
  };

  const closeGate = () => {
    setIsOpen(false);
    setPendingUrl(null);
  };

  const verifyAndProceed = () => {
    safeStorage.setItem('nexorae_id', 'true');
    setNexoraeId('true');
    setIsOpen(false);

    if (pendingUrl) {
      window.open(pendingUrl, '_blank', 'noopener,noreferrer');
      setPendingUrl(null);
    }
  };

  const handleRegister = (eventUrl: string) => {
    // Bypass registration gate for Global Diplomacy (GDPMUN)
    if (eventUrl.includes('gdp-mun') || eventUrl === 'https://www.ipmun.in/gdp-mun') {
      window.open(eventUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    const storedId = safeStorage.getItem('nexorae_id');
    if (storedId) {
      window.open(eventUrl, '_blank', 'noopener,noreferrer');
    } else {
      openGate(eventUrl);
    }
  };

  const logout = () => {
    safeStorage.removeItem('nexorae_id');
    setNexoraeId(null);
  };

  const isAuthenticated = !!nexoraeId;

  return (
    <RegistrationGateContext.Provider
      value={{
        isOpen,
        nexoraeId,
        isAuthenticated,
        openGate,
        closeGate,
        verifyAndProceed,
        handleRegister,
        logout,
      }}
    >
      {children}
    </RegistrationGateContext.Provider>
  );
};

export const useRegistrationGate = () => {
  const context = useContext(RegistrationGateContext);
  if (!context) {
    throw new Error('useRegistrationGate must be used within a RegistrationGateProvider');
  }
  return context;
};
