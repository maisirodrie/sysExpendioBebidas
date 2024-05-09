import { createContext, useContext, useState } from "react";
import { registerRequest, loginRequest, verifyTokenRequest } from '../api/auth'
import Cookies from "js-cookie";

import { useEffect } from 'react';

export const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if(!context){
        throw new Error ("useAuth must be used within an AuhProvider")
    }
    return context
}
export const AuthProvvider =({children}) => {

    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [errors , setErrors] =useState([])
    const [loading, setLoading] = useState(true)
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        if (errors && errors.length > 0) {
          const timer = setTimeout(() => {
            setErrors([]);
          }, 5000);
          return () => clearTimeout(timer);
        }
    }, [errors]);

    const fetchUserProfile = async () => {
        try {
          const response = await axios.get('/profile');
          return response.data; // Retorna los datos del perfil del usuario
        } catch (error) {
          console.error('Error fetching user profile:', error);
          throw error; // Propaga el error para que pueda ser manejado en el código que llama a esta función
        }
      };


      const signup = async (user) => {
        try {
            const res = await registerRequest(user);
            console.log(res.data); // Esto mostrará los datos del usuario en la consola
            const userRole = res.data.role; // Accede al rol del usuario
            console.log("Rol del usuario:", userRole);
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            console.log(error);
            setErrors(error.response.data);
        }
    };

    const signin = async (user) => {
        try {
          const res = await loginRequest(user);
          console.log(res)
          setIsAuthenticated(true)
          setUser(res.data)
        } catch (error) {
            // console.log(error);
            // setErrors(error.response.data);

            if (Array.isArray(error.response.data)){
                return setErrors(error.response.data)
               }
               setErrors([error.response.data.message])
        }
      };

      const logout = () => {
        Cookies.remove("token");
        setUser(null);
        setIsAuthenticated(false);
      }; 

      useEffect (() => {
        async function checkLogin () {

            const cookies = Cookies.get();

        if (!cookies.token) {
            setIsAuthenticated(false)
            setLoading(false)
            return setUser(null)
            
        }
            try {

                const res = await verifyTokenRequest (cookies.token)
                if (!res.data){
                    setIsAuthenticated(false)
                    setLoading(false)
                    return
                }  

                
                setIsAuthenticated(true)
                setUser(res.data)
                setLoading(false)
            } catch (error) {
                console.log(error)
            setIsAuthenticated(false)
            setUser(null)
            setLoading(false)
                
            }
            
        }

        checkLogin()
        
      }, []);


    //   useEffect(() => {
    //     async function checkLogin () {
    //       const cookies = Cookies.get();
    //       if (!cookies.token) {
    //         setIsAuthenticated(false);
    //         setLoading(false);
    //         return setUser(null);
    //       }
    
    //       try {
    //         const res = await verifyTokenRequest(cookies.token);
    //         if (!res.data) {
    //         setIsAuthenticated(false);
    //         setLoading(false)
    //         return
    //         }
    //         setIsAuthenticated(true);
    //         setUser(res.data)
    //         setLoading(false);
    //       } catch (error) {
    //         console.log(error)
    //         setIsAuthenticated(false);
    //         setUser(null)
    //         setLoading(false);
            
    //       }
    //     };
    //     checkLogin();
    //   }, []);



    return (
        <AuthContext.Provider value={{
            signup,
            signin,
            logout,
            user,
            loading,
            isAuthenticated,
            errors,
            userProfile,
            fetchUserProfile
        }}>
            {children}
        </AuthContext.Provider>
    )
}