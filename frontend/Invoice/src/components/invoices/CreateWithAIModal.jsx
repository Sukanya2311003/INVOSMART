import { useState } from "react";
import { Sparkles } from "lucide-react";
import Button from '../ui/Button';
import TextareaField from "../ui/TextareaField";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const CreateWithAIModal= ({isOpen, onClose})=>{
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleGenerate = async () => {
    if(!text.trim()){
        toast.error('Please paste sme text to generate an invoice, ');
        return;
    }
    setIsLoading(true);
    try{
        const response= await axiosInstance.post(API_PATHS.AI.PARSE_INVOICE_TEXT, {text});
                  console.log("FULL AI RESPONSE:", response.data);

        const invoiceData= response.data.parsedData;
        toast.success('Invoice data extracted successfully !');
        onClose();
        // navigating to create invoice page with parsed data
        console.log(response.data.parsedData);

        navigate('/invoices/new', {state: {aiData: invoiceData}});
    }
    catch(error){
        toast.error('Failed to generate invoice from text. ');
        console.error('AI parsing error: ', error);
    }
    finally{
        setIsLoading(false);
    }
  };

  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-zinc-900 rounded-lg shadow-xl max-w-lg w-full p-6 z-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-blue-100" />
            Create Invoice with AI
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-slate-200">
            Paste any text that contains invoice details...
          </p>

          <TextareaField
            name="invoiceText"
            label="Paste invoice text here"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. , 'Invoice for ClientCorp: 2 hours of design work at $100/hr and 1 logo for $800"
            //                             rows={8}
            rows={8}
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} isLoading={isLoading}>
            {isLoading ? "Generating..." : "Generate Invoice"}
          </Button>
        </div>
      </div>
    </div>

  );
}

export default CreateWithAIModal;