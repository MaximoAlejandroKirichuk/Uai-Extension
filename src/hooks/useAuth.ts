import { signInAnonymously, signInWithEmailAndPassword } from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { User } from "../core/entities/user.entity";
import {
  resolveCanWrite,
  resolveReadonly,
} from "../core/entities/session-access";
import { setUser } from "../store/slices/user/userSlice";

export const useAuth = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestError, setGuestError] = useState<string | null>(null);
  const authPendingRef = useRef(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const mapFirebaseUser = async (userFirebase: FirebaseUser): Promise<User> => {
    // Force a token refresh so freshly assigned custom claims (e.g. `readonly`)
    // are always read from the backend instead of a stale cached ID token.
    const tokenResult = await userFirebase.getIdTokenResult(true);
    const emailUser = userFirebase.email || "";
    const claimsReadonly = tokenResult.claims.readonly === true;
    const isAnonymous = userFirebase.isAnonymous === true;

    return {
      emailUser,
      token: tokenResult.token,
      localId: userFirebase.uid,
      readonly: resolveReadonly(emailUser, claimsReadonly, isAnonymous),
      canWrite: resolveCanWrite(emailUser, claimsReadonly, isAnonymous),
      isAnonymous,
    };
  };

  const completeSignIn = async (userFirebase: FirebaseUser) => {
    const userMapped = await mapFirebaseUser(userFirebase);
    dispatch(setUser(userMapped));
    navigate("/Home");
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (authPendingRef.current) {
      return;
    }

    authPendingRef.current = true;
    setLoading(true);
    setError(null);
    setGuestError(null);

    const { email, password } = formData;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await completeSignIn(userCredential.user);
    } catch (authError) {
      console.error("Error de login:", authError);
      setError("Credenciales incorrectas. Por favor, intentá de nuevo.");
    } finally {
      authPendingRef.current = false;
      setLoading(false);
    }
  };

  const onGuestSignIn = async () => {
    if (authPendingRef.current) {
      return;
    }

    authPendingRef.current = true;
    setGuestLoading(true);
    setError(null);
    setGuestError(null);

    try {
      const userCredential = await signInAnonymously(auth);
      await completeSignIn(userCredential.user);
    } catch (authError) {
      console.error("Error de acceso invitado:", authError);
      setGuestError("No pudimos iniciar el acceso invitado. Por favor, intentá de nuevo.");
    } finally {
      authPendingRef.current = false;
      setGuestLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    guestLoading,
    guestError,
    onSubmit,
    onGuestSignIn,
    onInputChange,
  };
};
