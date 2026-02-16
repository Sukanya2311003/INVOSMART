import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { Loader2, AlertCircle, Edit, Printer , Mail} from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import moment from "moment";
import ReminderModal from "../../components/invoices/ReminderModal";
const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const invoiceRef = useRef(null);


  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);


  useEffect(() => {
    const fetchInvoice = async () => {
      try {
console.log("API URL:", API_PATHS.INVOICE.GET_INVOICE_BY_ID(id));

        const response = await axiosInstance.get(
          API_PATHS.INVOICE.GET_INVOICE_BY_ID(id),
          
        );
        console.log("Response data:", response.data);

        setInvoice(response.data);
      } catch (error) {
        //  console.log("ERROR OBJECT:", error);
        //  console.log("ERROR RESPONSE:", error.response);
        //  console.log("ERROR STATUS:", error.response?.status);
        //  console.log("ERROR DATA:", error.response?.data);
        console.error("Error fetching invoice:", error);
        toast.error("Failed to load invoice");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInvoice();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-red-500 mb-2">
          Invoice not found
        </h3>
        <Button onClick={() => navigate("/invoices")}>Back to Invoices</Button>
      </div>
    );
  }
  

return (
  <div className="space-y-6">
    {/* 🔹 Reminder Modal */}
    <ReminderModal
      isOpen={isReminderModalOpen}
      onClose={() => setIsReminderModalOpen(false)}
      invoiceId={invoice._id}
    />

    {/* 🔹 Buttons (Hidden in Print) */}
    <div className="flex justify-between items-center no-print">
      <h2 className="text-2xl font-semibold text-slate-200">
        Invoice {invoice.invoiceNumber}
      </h2>

      <div className="flex gap-3">
        {invoice.status !== "Paid" && (
          <Button
            variant="secondary"
            icon={Mail}
            onClick={() => setIsReminderModalOpen(true)}
          >
            Generate Reminder
          </Button>
        )}

        <Button
          variant="secondary"
          icon={Edit}
          onClick={() =>
            navigate("/invoices/new", {
              state: { invoice },
            })
          }
        >
          Edit
        </Button>

        <Button
          variant="secondary"
          icon={Printer}
          onClick={() => window.print()}
        >
          Print
        </Button>
      </div>
    </div>

    {/* 🔹 PRINT AREA (A4 Professional Layout) */}
    <div
      ref={invoiceRef}
      className="print-area bg-white text-black p-12 rounded-lg shadow-md max-w-4xl mx-auto"
    >
      {/* Company Header */}
      <div className="flex justify-between border-b pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-bold">INVOICE</h1>
          <p className="text-gray-600">#{invoice.invoiceNumber}</p>
        </div>

        <div className="text-right">
          <p className="font-semibold">{invoice.billFrom?.businessName}</p>
          <p>{invoice.billFrom?.email}</p>
          <p>{invoice.billFrom?.address}</p>
          <p>{invoice.billFrom?.phone}</p>
        </div>
      </div>

      {/* Bill To & Dates */}
      <div className="flex justify-between mb-8">
        <div>
          <h3 className="font-semibold mb-2">Bill To:</h3>
          <p>{invoice.billTo?.clientName}</p>
          <p>{invoice.billTo?.email}</p>
          <p>{invoice.billTo?.address}</p>
          <p>{invoice.billTo?.phone}</p>
        </div>

        <div className="text-right">
          <p>
            <strong>Invoice Date:</strong>{" "}
            {moment(invoice.invoiceDate).format("DD MMM YYYY")}
          </p>
          <p>
            <strong>Due Date:</strong>{" "}
            {moment(invoice.dueDate).format("DD MMM YYYY")}
          </p>
          <p>
            <strong>Status:</strong> {invoice.status}
          </p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full border-collapse mb-8">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Item</th>
            <th className="p-3">Qty</th>
            <th className="p-3">Price</th>
            <th className="p-3">Tax %</th>
            <th className="p-3 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items?.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="p-3">{item.name}</td>
              <td className="p-3">{item.quantity}</td>
              <td className="p-3">₹{item.unitPrice}</td>
              <td className="p-3">{item.taxPercent || 0}%</td>
              <td className="p-3 text-right">₹{item.total?.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-1/3 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{invoice.subtotal?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>₹{invoice.taxTotal?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span>₹{invoice.total?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Notes:</h3>
          <p>{invoice.notes}</p>
        </div>
      )}

      {/* Signature Section */}
      <div className="mt-16 flex justify-between">
        <div>
          <p className="border-t w-48 pt-2">Authorized Signature</p>
        </div>
        <div>
          <p className="border-t w-48 pt-2">Client Signature</p>
        </div>
      </div>
    </div>
  </div>
);
};

export default InvoiceDetail;
