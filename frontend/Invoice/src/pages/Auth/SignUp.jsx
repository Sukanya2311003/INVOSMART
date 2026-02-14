import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  FileText,
  ArrowRight,
  User
} from "lucide-react";

import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
// import { validate } from "../../../../../backend/models/Invoice";
import { validateEmail, validatePassword } from "../../utils/helper";

const SignUp = () => {
  const { Login} = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
const [touched, setTouched] = useState({
  name: false,
  email: false,
  password: false,
  confirmPassword: false,
});

  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  // validating  the functions
  const validateName=(name)=>{
    if(!name) return "Name is required";

    if(name.length<2) return "Name must be at least 2 characters";
    if(name.length>50) return "Name must be less than 50 characters";
    return "";
  };

  const validateConfirmPassword=(password, confirmPassword)=>{
    if(!confirmPassword) return "Please confirm your password";

    if(password!==confirmPassword) return "Passwords do not match";
    return "";
  };

  const handleInputChange=(e)=>{
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Validate the field on change
    if(touched[name]){
      const newFieldErrors={...fieldErrors};
      if(name==="name"){
        newFieldErrors.name= validateName(value);
      }
      else if(name==="email"){
        newFieldErrors.email= validateEmail(value);
      }
      else if(name==="password"){
        newFieldErrors.password= validatePassword(value);
        // Also validate confirm password if it has been touched
        if(touched.confirmPassword){
          newFieldErrors.confirmPassword= validateConfirmPassword(value, formData.confirmPassword,
            value

          );
        }
      }
      else if(name==="confirmPassword"){
        newFieldErrors.confirmPassword= validateConfirmPassword(formData.password, value);
      }
      setFieldErrors(newFieldErrors);
    }
    if(error){
      setError("");
    }
  };

  const handleBlur=(e)=>{
    const {name}= e.target;
    setTouched((prev)=>({
      ...prev,
      [name]: true,
    }));
    // Validate the field on blur
    const newFieldErrors={...fieldErrors};
    if(name==="name"){
      newFieldErrors.name= validateName(formData.name);
    }
    else if(name==="email"){
      newFieldErrors.email= validateEmail(formData.email);
    }
    else if(name==="password"){
      newFieldErrors.password= validatePassword(formData.password);
    }
    else if(name==="confirmPassword"){
      newFieldErrors.confirmPassword = validateConfirmPassword(
        formData.confirmPassword,
        formData.password,
      );
    }
    setFieldErrors(newFieldErrors);
  };
  const  isFormValid=()=>{
    const nameError= validateName(formData.name);
    const emailError= validateEmail(formData.email);
    const passwordError= validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.confirmPassword,
      formData.password
);
return(
  !nameError &&
  !emailError &&
  !passwordError &&
  !confirmPasswordError && 
  formData.name &&
  formData.email &&
  formData.password &&
  formData.confirmPassword
);
  };

  const handleSubmit=async()=>{
    // validate all fields before submitting
    const nameError= validateName(formData.name);
    const emailError= validateEmail(formData.email);
    const passwordError= validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.confirmPassword,
      formData.password
    );
    if(nameError || emailError || passwordError || confirmPasswordError){
      setFieldErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError
      });
      setTouched({
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
      });
      return;
    }
    setIsLoading(true);
    setError("");
    setSuccess("");
    // Proceed with form submission
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      const data= response.data;
      const {token, user}= data;
      // const {token}= data;
      if(response.status===201){
        setSuccess("Registration successful! Redirecting...");
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setTouched({
          name: false,
          email: false,
          password: false,
          confirmPassword: false,
        });
        // LOGIN the user after successful registration
        Login(token, user);
        // Redirect to login page after a short delay
        navigate("/dashboard");
       
      }
    } catch (err) {
      if(err.response && err.response.data && err.response.data.message){
        setError(err.response.data.message);
      }
      else{
        setError("Registration failed. Please try again later.");

      }
      console.error("API error:", err.response || err);
    }
    finally{
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4 py-8">
      <div className="w-full max-w-sm">
        {/* header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl  flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-100 mb-2">
            Create your account
          </h2>
          <p className="text-gray-300 text-sm">Begin your journey with us ! </p>
        </div>
        {/* form */}
        <div className="space-y-4">
          {/* name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                  fieldErrors.name && touched.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="Enter your name"
              />
            </div>
            {fieldErrors.name && touched.name && (
              <p className="mt-1 text-sm text-red-500">{fieldErrors.name}</p>
            )}
          </div>
          {/* email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                  fieldErrors.email && touched.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="Enter your email"
              />
            </div>
            {fieldErrors.email && touched.email && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>
          {/* password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                  fieldErrors.password && touched.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="Create your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 hover:text-gray-500 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {fieldErrors.password && touched.password && (
              <p className="mt-1 text-sm text-red-500">
                {fieldErrors.password}
              </p>
            )}
          </div>
          {/* confirm password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                  fieldErrors.confirmPassword && touched.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {fieldErrors.confirmPassword && touched.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>
          {/* Error/ success message */}
          {error && (
            <div className="p-3 bg-red-50  border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          {/* submit button */}
          {success && (
            <div className="p-3 bg-red-50  border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{success}</p>
            </div>
          )}
          {/* Terms and conditions */}
          <div className="flex items-start pt-2">
            <input type="checkbox" id="terms" className="w-4 h-4 text-gray-100 border-gray-300 rounded focus:ring-blue-500 mt-1" required />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-100">
              I agree to the <button className="text-gray-100 hover:underline">Terms of Service</button> and{" "}
              <button className="text-gray-100 hover:underline">Privacy Policy</button>
            </label>
          </div>
          {/* sign up button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading || !isFormValid()}
            className="w-full bg-gradient-to-tr from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium flex items-center justify-center group hover:from-blue-600 hover:to-purple-700 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Creating Account...
              </>
            ) : (
              <>
              Create Account
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform mr-2" />
              </>
            )}
          </button>
        </div>
        {/* footer*/}
        <div className="mt-6 pt-4 border-t border-gray-500 text-center">
          <p className="text-gray-100 text-sm">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="text-gray-100 font-medium hover:underline">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
  }
  
export default SignUp;
