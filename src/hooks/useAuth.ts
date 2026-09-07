import { signInWithEmailAndPassword } from "firebase/auth";
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
  const loadingRef = useRef(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loadingRef.current) {
      return;
    }

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    const { email, password } = formData;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userFirebase = userCredential.user;
      // Force a token refresh so freshly assigned custom claims (e.g. `readonly`)
      // are always read from the backend instead of a stale cached ID token.
      const tokenResult = await userFirebase.getIdTokenResult(true);
      const emailUser = userFirebase.email || "";
      const claimsReadonly = tokenResult.claims.readonly === true;

      const userMapped: User = {
        emailUser,
        token: tokenResult.token,
        localId: userFirebase.uid,
        readonly: resolveReadonly(emailUser, claimsReadonly),
        canWrite: resolveCanWrite(emailUser, claimsReadonly),
      };

      dispatch(setUser(userMapped));
      navigate("/Home");
    } catch (authError) {
      console.error("Error de login:", authError);
      setError("Credenciales incorrectas. Por favor, intentá de nuevo.");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    onSubmit,
    onInputChange,
  };
};
