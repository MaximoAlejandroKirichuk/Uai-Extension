import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../store/slices/user/userSlice';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { User } from '../core/entities/user.entity';




export const useAuth = () => {
  
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
      
      
    return{ 
        formData,

        //methodos
        onSubmit,
        onInputChange,
        

    }
}
