import react from "react";
const InputField = ({ icon: Icon, label, name, className = "", ...props }) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-md font-medium text-zinc-300 mb-2"
      >
        {label}
      </label>
      <div className="relative ">
        {Icon && (
          <div className=" absolute inset-y-0 right-3 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-zinc-100" />
          </div>
        )}
        <input
          id={name}
          name={name}
          {...props}
          className={`w-full h-10 pr-3 py-2 border border-zinc-300 rounded-lg placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${Icon ? "pl-10" : "pl-3"} ${Icon ? "pl-10" : "pl-3"}
  [&::-webkit-calendar-picker-indicator]:opacity-0
[&::-webkit-calendar-picker-indicator]:absolute
[&::-webkit-calendar-picker-indicator]:right-0
[&::-webkit-calendar-picker-indicator]:w-full
[&::-webkit-calendar-picker-indicator]:cursor-pointer

          ${className}`}
        />
      </div>
    </div>
  );
};
export default InputField;
