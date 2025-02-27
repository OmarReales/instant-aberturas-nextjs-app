"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  AuthError,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { User, AuthContextType } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          setUser({
            logged: true,
            email: firebaseUser.email || undefined,
            uid: firebaseUser.uid,
          });
        } else {
          setUser({
            logged: false,
            email: undefined,
            uid: undefined,
          });
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const registerUser = async (email: string, password: string) => {
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const authError = error as AuthError;
      console.error("Registration error:", authError.message);
      throw new Error(authError.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const authError = error as AuthError;
      console.error("Sign in error:", authError.message);
      throw new Error(authError.message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
    } catch (error) {
      const authError = error as AuthError;
      console.error("Sign out error:", authError.message);
      throw new Error(authError.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    registerUser,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
