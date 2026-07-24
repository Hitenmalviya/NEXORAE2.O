import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface StudentSession {
  nexoraeId?: string;
  fullName: string;
  email: string;
}

interface AuthContextType {
  studentSession: StudentSession | null;
  setStudentSession: (session: StudentSession) => void;
  setStudentToken: (token: string) => void;
  clearStudentSession: () => void;
  adminToken: string | null;
  setAdminToken: (token: string) => void;
  clearAdminToken: () => void;
  isAdminAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [studentSession, setStudentSessionState] = useState<StudentSession | null>(null);
  const [adminToken, setAdminTokenState] = useState<string | null>(null);

  useEffect(() => {
    const session = sessionStorage.getItem('nexorae-student-session');
    if (session) {
      try {
        setStudentSessionState(JSON.parse(session));
      } catch (e) {
        console.error('Failed to parse student session');
      }
    }
    const token = localStorage.getItem('nexorae-admin-token');
    if (token) {
      setAdminTokenState(token);
    }
  }, []);

  const setStudentSession = (session: StudentSession) => {
    sessionStorage.setItem('nexorae-student-session', JSON.stringify(session));
    setStudentSessionState(session);
  };

  const setStudentToken = (token: string) => {
    sessionStorage.setItem('nexorae-student-token', token);
  };

  const clearStudentSession = () => {
    sessionStorage.removeItem('nexorae-student-session');
    sessionStorage.removeItem('nexorae-student-token');
    setStudentSessionState(null);
  };

  const setAdminToken = (token: string) => {
    localStorage.setItem('nexorae-admin-token', token);
    setAdminTokenState(token);
  };

  const clearAdminToken = () => {
    localStorage.removeItem('nexorae-admin-token');
    setAdminTokenState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        studentSession,
        setStudentSession,
        setStudentToken,
        clearStudentSession,
        adminToken,
        setAdminToken,
        clearAdminToken,
        isAdminAuthenticated: !!adminToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
