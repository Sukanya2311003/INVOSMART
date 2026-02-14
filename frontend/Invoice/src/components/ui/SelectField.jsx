import React from "react";
const SelectField = ({label, name, options, ...props})=>{
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-zinc-500">{label}</label>
            <select
            id={name}
            name={name}
            {...props}
            className="w-full h-10 px-3 py-2 border bg-zinc-700 rounded-lg text-zinc-300 focus:outline-none focus:ring-indigo-500 focus:border-transparent">
                {options.map(option=>(
                    <option key={option.value || option} value= {option.value || option}>
                        {option.label || option}
                    </option>
                ))}
            </select>
        </div>
    )
}
export default SelectField;