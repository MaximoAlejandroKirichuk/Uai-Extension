import { useState } from "react";
import { Pressable } from "../components/Pressable"
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/user/userSlice";
import { User } from "../../core/entities/user.entity";

export const Login = () => {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const dispatch = useDispatch()
  const navigate = useNavigate();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const { email, password } = formData;
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userFirebase = userCredential.user;
  
      // Obtener token de forma segura
      const token = await userFirebase.getIdToken();
  
      // Mapear a tu entidad `User`
      const userMapped: User = {
        emailUser: userFirebase.email || "",
        token,
        localId: userFirebase.uid
      };
  
      // Dispatch a Redux
      dispatch(setUser(userMapped));
  
      // Redirigir
      navigate('/Home');
    } catch (error) {
      console.error("Error de login:", error);
      alert("Credenciales incorrectas. Por favor, intentá de nuevo.");
    }
  };
  
  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">UAI extensión</h2>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <Pressable
            onClick={() => onSubmit}
            label="Login"
          />
        </form>
      </div>
    </div>
  )
}
