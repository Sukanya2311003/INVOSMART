import React, {useState} from "react";
import { ChevronDown } from "lucide-react";
import {FAQS} from "../../utils/data";
// import { ChevronDown, Import } from "lucide-react";

const FaqItem=({faq,isOpen,onClick})=>{
    return (
      <div className="border border-gray-700 rounded-xl p-4 overflow-hidden">
        <button
          onClick={onClick}
          className="w-full flex items-center justify-between p-6  hover:bg-gray-800 cursor-pointer hover:shadow-blue-900/50 relative hover:-translate-y-1 transition-colors duration-300 shadow-md"
        >
          <span className="text-lg font-medium text-gray-100 pr-4 text-left">
            {faq.question}
          </span>
          <ChevronDown
            className={`w-6 h-6 text-gray-400 transition-transform duration-400 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </button>
        {isOpen && (
          <div className="px-6 pb-6 pt-6 text-gray-200 leading-relaxed border-gray-100">
            {faq.answer}
          </div>
        )}
      </div>
    );
  };
    const Faqs=()=>{

        const [openIndex, setOpenIndex]=useState(null);
        const handleClick=(index)=>{
            setOpenIndex(openIndex===index ? null : index);
        }   ;

        return(
            <section id="faq" className="py-20 lg:py-28 bg-[#06000a]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <div  className="text-center">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-50  mb-4">Frequently Asked Questions</h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">Everything you need to know about the product and billing</p>
                    </div>
                    <div className="space-y-4">
                        {FAQS.map((faq, index)=>(
                            <FaqItem
                            key={index}
                            faq={faq}
                            isOpen={openIndex===index}
                            onClick={()=>handleClick(index)}
                            />
                        ))}
                    </div>
                </div>
            </section>
        )

    }
    export default Faqs;