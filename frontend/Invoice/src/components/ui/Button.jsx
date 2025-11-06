// import { Ghost, Loader2 } from "lucide-react";
// const Button=({
//     variant='primary',
//     size='md',
//     isloading=false,
//     children,
//     icon: Icon,
//     ...props
// })=>{

//     const baseClasses="inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring- blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
//     const variantClasses={
//         primary:"bg-blue-600 text-white hover:bg-blue-700",
//         secondary:"bg-gray-200 text-gray-800 hover:bg-gray-300",
//         Ghost:"bg-transparent text-slate-700 hover:bg-slate-100",
//     };
//     const sizeClasses={
//         sm:"px-3 py-1.5 text-sm",
//         md:"px-4 py-2 h-10 text-sm",
//         lg:"px-6 py-3 text-base",
//     };
//     return(
//         <button className="`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}"  disabled={isloading }
//         {...props}>
//             {isloading ? (
//                 <Loader2 className="w-5 h-5 animate-spin"/>
//             ) :(
//                 <>
//                 Icon && <Icon className="w-5 h-5 mr-2"/>
//             {children}
//             </>
//             )}
//         </button>   
//     )
// }
// export default Button;

import Dashboard from "../../pages/Dashboard/Dashboard";
// import { Loader2 } from "lucide-react";

// const Button = ({
//   variant = "primary",
//   size = "md",
//   isloading = false,
//   children,
//   icon: Icon,
//   ...props
// }) => {
//   const baseClasses =
//     "inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ";

//   const variantClasses = {
//     primary: "bg-blue-600 text-white hover:bg-blue-700",
//     secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
//     ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
   
//   };

//   const sizeClasses = {
//     sm: "px-3 py-1.5 text-sm",
//     md: "px-4 py-2 h-10 text-sm",
//     lg: "px-6 py-3 text-base",
//   };

//   return (
//     <button
//       className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} 
//       ${props.className || "" }`}
//       disabled={isloading}
//       {...props}
//     >
//       {isloading ? (
//         <Loader2 className="w-5 h-5 animate-spin" />
//       ) : (
//         <>
//           {Icon && <Icon className="w-5 h-5 mr-2" />}
//           {children}
//         </>
//       )}
//     </button>
//   );
// };

// export default Button;

import { Loader2 } from "lucide-react";

const Button = ({
  variant = "primary",
  size = "md",
  isloading = false,
  children,
  icon: Icon,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-blue-700 to-blue-500 text-white hover:from-blue-600 hover:to-blue-400",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    ghost: "bg-transparent text-white hover:text-gray-300",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 h-10 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${
        sizeClasses[size]
      } ${props.className || ""}`}
      disabled={isloading}
      {...props}
    >
      {isloading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5 mr-2" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;













