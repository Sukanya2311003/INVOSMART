import React , {useState} from "react";
import {
Eye,
EyeOff,
Loader2,
Mail,
Lock,
FileText,
ArrowRight,

} from "lucide-react";

import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
// import { validate } from "../../../../../backend/models/Invoice";
import { validateEmail, validatePassword } from "../../utils/helper";

const Login=()=>{
    const {Login: authLogin}= useAuth();
    const navigate= useNavigate();
    const [formData, setFormData]= useState({
        email:"",
        password:"",
    });
    const [showPassword, setShowPassword]= useState (false);
    const [isLoading, setIsLoading]= useState(false);   
    const [error, setError]= useState("");
    const [success, setSuccess]= useState("");
    const [fieldErrors, setFieldErrors]= useState({
        email:"",
        password:"",
    });
    const [touched, setTouched]= useState({
        email:false,
        password:false,
    });

    const handleInputChange= (e)=>{
        const {name, value}= e.target;
        setFormData((prev)=>({
            ...prev,
            [name]: value,
        }));
        // real time validation
        if(!touched[name]){
            const newFieldErrors={...fieldErrors};
            if(name==="email"){
                newFieldErrors.email= validateEmail(value) ;
            }
            else if(name==="password"){
                newFieldErrors.password= validatePassword(value);
            }
            setFieldErrors(newFieldErrors);
            
        }
        if(error){
            setError("");
        }
    };
    const handleBlur= (e)=>{
        const {name}= e.target;
        setTouched((prev)=>({
            ...prev,
            [name]: true,
        }) );
        // validate on blur field
        const newFieldErrors={...fieldErrors};
        if(name==="email"){
            newFieldErrors.email= validateEmail(formData.email) ;
        }
        else if(name==="password"){
            newFieldErrors.password= validatePassword(formData.password);
        }
        setFieldErrors(newFieldErrors);
    };
    const isFormValid= ()=>{
        const emailError= validateEmail(formData.email);
        const passwordError= validatePassword(formData.password);
        return !emailError && !passwordError && formData.email && formData.password ;
    };

    const handleSubmit= async ()=>{
        // final validation before submit
        const emailError= validateEmail(formData.email);
        const passwordError= validatePassword(formData.password);
        if(emailError || passwordError){
        setFieldErrors({
            email: emailError,
            password: passwordError,
        });
        setTouched({
            email: true,
            password: true,
        });
        setTouched({
            email: true,
            password: true,
        });
        return;
        }
        setIsLoading (true);
        setError("");
        setSuccess("");

    
try {
  const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, formData);

  console.log("LOGIN RESPONSE:", response.data);

  const { token, ...userData } = response.data;

  if (!token) {
    setError("Token not received");
    return;
  }

  localStorage.setItem("token", token);

  authLogin(userData, token);


  setSuccess("Login successful! Redirecting...");
  setError("");

  navigate("/dashboard");
} catch (err) {
  console.error("LOGIN ERROR:", err);
  setError(
    err.response?.data?.message ||
      err.message ||
      "An error occurred. Please try again.",
  );
} finally {
  setIsLoading(false);
}


    
    };
        return (
          <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
              {/*header*/}
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-semibold text-shadow-white">
                  Login to Your Account
                </h1>
                <p className="text-gray-200 text-xl mt-2.5">
                  Welcome back to invoice generator
                </p>
              </div>
              {/* {form} */}
              <div className="space-y-4">
                {/* email */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-3">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/3 transform -translate-y-0.5 text-gray-100 w-5 h-5" />
                    <input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                        fieldErrors.email && touched.email
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {fieldErrors.email && touched.email && (
                    <p className="mt-1 text-sm text-red-300">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
                {/* password */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-3">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/3 transform -translate-y-0.5 text--100 w-5 h-5" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full pl-12 pr-10 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                        fieldErrors.password && touched.password
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-100 hover:text-gray-50 transition-colors w-5 h-5    "
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {fieldErrors.password && touched.password && (
                    <p className="text-red-300">{fieldErrors.password}</p>
                  )}
                </div>
                {/* error/success */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-400 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="p-3 bg-green-50 border-green-400 rounded-lg">
                    <p className="text-green-600 text-sm">{success}</p>
                  </div>
                )}
                {/* submit button */}
                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid() || isLoading}
                  //   className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-4 font-medium  rounded-lg flex items-center justify-center  space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg bg-blue-50 transition-colors"
                  className=" w-full 
                        bg-gradient-to-r from-purple-600 to-indigo-700 
                        text-white 
                        py-3 px-4 
                        font-semibold 
                        rounded-xl 
                        flex items-center justify-center 
                        space-x-2 
                        shadow-lg shadow-indigo-500/50 
                        transition-all duration-300 
                        transform 
                        
                        hover:from-purple-700 hover:to-indigo-800 
                        hover:shadow-xl hover:shadow-indigo-600/60
                        active:scale-[0.98] 
                        
                        disabled:opacity-50 
                        disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="w-4 h-4 ml-2 group-hover: translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
              {/* footer */}
              <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-50">
                  Don't have an account?{" "}
                  <button 
                   className="text-blue-400 hover:underline font-medium"
                  onClick={() => navigate("/signup")} >
                    Sign Up
                  </button>
                </p>
              </div>
            </div>
          </div>
        );

}

export default Login;