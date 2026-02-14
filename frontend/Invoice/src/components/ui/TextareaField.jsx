import React from "react";

const TextareaField = ({ icon: Icon, label, name, ...props }) =>{return (
  <div>
    <label htmlFor={name} className="block mb-2 text-sm text-zinc-400">
      {label}
    </label>

    <div className="relative">
      {Icon && (
        <div className="absolute left-0 pl-3 flex items-center pointer-events-none top-3 text-zinc-400">
          <Icon className="h-4 w-4 text-blue-100" />
        </div>
      )}

      <textarea
        id={name}
        name={name}
        rows={3}
        {...props}
        className={`w-full min-h-[100px] pr-3 py-2 border border-zinc-800 rounded-lg text-zinc-300 placeholder-zinc-400 resize-y focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent ${
          Icon ? "pl-10" : "pl-3"
        }`}
      />
    </div>
  </div>
)};

export default TextareaField;
