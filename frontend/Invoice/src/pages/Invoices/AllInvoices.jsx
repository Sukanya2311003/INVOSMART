import React ,{ useEffect, useState, useMemo } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { Loader2, Trash2, Edit, Search, FileText, Plus, AlertCircle, Sparkles, Mail } from 'lucide-react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import CreateWithAIModal from '../../components/invoices/CreateWithAIModal';
import ReminderModal from '../../components/invoices/ReminderModal';
const AllInvoices = () => {
const [invoices, setInvoices]= useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [statusChangeLoading, setStatusChangeLoading]= useState(null);
const [searchTerm, setSearchTerm] =useState('');
const [statusFilter, setStatusFilter] = useState('All');
const [isAiModalOpen, setIsAiModalOpen] = useState(false);
const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
const navigate =useNavigate();
useEffect(()=>{
const fetchInvoices =async () =>{
try{
const response =await axiosInstance.get(API_PATHS.INVOICE.GET_ALL);
setInvoices(response.data.sort ((a, b)=> new Date(b.invoiceDate)- new Date(a.invoiceDate)));
}
catch(err){
    setError('Failed to fetch invoices. ');
    console.error(err);
}
finally{
    setLoading(false);
}
};
fetchInvoices();
}, []);

const handleDelete= async(id)=>{
    if(window.confirm('Are you sure you want to delete this invoice?')){
        try{
            await axiosInstance.delete(API_PATHS.INVOICE.DELETE_INVOICE(id));
            setInvoices(invoices.filter(invoice => invoice._id!==id));
        }
        catch(err){
             setError('Failed to delete invoice.');
             console.error(err);
        }
    }
};
 const handleStatusChange= async( invoice)=>{
    setStatusChangeLoading(invoice._id);
    try{
        const newStatus= invoice.status==='Paid' ? 'Unpaid': 'Paid';
const updatedInvoice= {...invoice, status: newStatus};
const response = await axiosInstance.put(API_PATHS.INVOICE.UPDATE_INVOICE(invoice._id), updatedInvoice);
setInvoices(invoices.map(inv=>inv._id === invoice._id ? response.data: inv));

}catch(err){
    setError('Failed to update invoice status');
    console.error(err);
}
finally{
    setStatusChangeLoading(null);
}
    
 };

const handleOpenReminder= async(invoiceId)=>{
    setSelectedInvoiceId(invoiceId);
    setIsReminderModalOpen(true);
};
// const filteredInvoices= useMemo(()=>{
//     return invoices
//     .filter(invoice=> statusFilter ==='All' || invoice.status===statusFilter)
//     .filter(invoice=>
//         invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||  invoice.billTo.clientName.toLowerCase().includes(searchTerm.toLowerCase())
//     );
// }, [invoices, searchTerm, statusFilter]);
const filteredInvoices = useMemo(() => {
  return invoices
    .filter(
      (invoice) =>
        statusFilter === "All" ||
        invoice.status?.trim().toLowerCase() === statusFilter.toLowerCase(),
    )
    .filter(
      (invoice) =>
        invoice.invoiceNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        invoice.billTo.clientName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );
}, [invoices, searchTerm, statusFilter]);



if(loading){
    return <div className='flex justify-center itw-8 h-8 animate-spin text-blue-300  items-center  '><Loader2 className=''/></div>
}
console.log(
  "Invoice statuses:",
  invoices.map((i) => i.status),
);
console.log("Selected filter:", statusFilter);


return (
  <div className="space-y-6">
    <CreateWithAIModal
      isOpen={isAiModalOpen}
      onClose={() => setIsAiModalOpen(false)}
    />
    <ReminderModal
      isOpen={isReminderModalOpen}
      onClose={() => setIsReminderModalOpen(false)}
      invoiceId={selectedInvoiceId}
    />
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="">
        <h1 className="text-2xl font-semibold text-slate-200">All Invoices</h1>
        <p className="text-sm text-slate-200 mt-1">
          Manage all your invoices in one place !
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          onClick={() => setIsAiModalOpen(true)}
          icon={Sparkles}
        >
          Create with AI
        </Button>
        <Button onClick={() => navigate("/invoices/new")} icon={Plus}>
          {" "}
          Create Invoice
        </Button>
      </div>
    </div>
    {error && (
      <div className="p-4 rounded-lg bg-red-50 border border-red-300">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800 mb-1">Error</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    )}
    <div className="border border-slate-300 rounded-lg shadow-sm">
      <div className="p-4 sm:p-6 border-b border-slate-500">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-500" />
            </div>
            <input
              type="text"
              placeholder="Search by invoice or client"
              className="w-full h-10 pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-slate-400 placeholder-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="">
            <select
              className="w-fu;; sm:w-auto h-10 px-3 py-2 border border-slate-500 rounded-lg text-sm text-zinc-500  focus:outline-none focus:ring-2 focus:ring-blue-500 "
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-slate-400 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-medium text-zinc-400 mb-2">
            No invoices found
          </h3>
          <p className="text-sl500 mb-6 max-w-md">
            Your search or filter criteria did not match anny invoices. Try
            adjusting your search.{" "}
          </p>
          {invoices.length === 0 && (
            <Button onClick={() => navigate("/invoices/new")} icon={Plus}>
              Create First Invoice
            </Button>
          )}
        </div>
      ) : (
        // <div className="w-full overflow-x-auto block">
        //     <table className='min-w-full divide-y divide-slate-200'>
        //
        <div className="w-[90vw] md:w-auto overflow-x-auto">
          <table className="w-full min-w-[600px] divide-y divide-zinc-800">
            <thead className="bg-zinc-300">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Invoice #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Amount{" "}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-zinc-800 divide-y divide-slate-400">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice._id} className="hover:bg-blue-900">
                  <td
                    onClick={() => navigate(`/invoices/${invoice._id}`)}
                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-100 cursor-pointer"
                  >
                    {invoice.invoiceNumber}
                  </td>
                  <td
                    onClick={() => navigate(`/invoices/${invoice._id}`)}
                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200 cursor-pointer"
                  >
                    {invoice.billTo.clientName}
                  </td>
                  <td
                    onClick={() => navigate(`/invoices/${invoice._id}`)}
                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200 cursor-pointer"
                  >
                    {invoice.total.toFixed(2)}
                  </td>
                  <td
                    onClick={() => navigate(`/invoices/${invoice._id}`)}
                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200 cursor-pointer"
                  >
                    {moment(invoice.dueDate).format("MM-D-YYYY")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invoice.status === "Paid"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : invoice.status === "Pending"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div
                      className="flex items-center justify-end gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="small"
                        variant="secondary"
                        onClick={() => handleStatusChange(invoice)}
                        isLoading={statusChangeLoading === invoice._id}
                      >
                        {invoice.status === "Paid"
                          ? "Mark Unpaid"
                          : "Mark Paid"}
                      </Button>
                      <Button
                        size="small"
                        variant="ghost"
                        onClick={() => navigate(`/invoices/${invoice._id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="small"
                        variant="ghost"
                        onClick={() => handleDelete(invoice._id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                      {invoice.status !== "Paid" && (
                        <Button
                          size="small"
                          variant="ghost"
                          onClick={() => handleOpenReminder(invoice._id)}
                          title="Generate Reminder"
                        >
                          <Mail className="w-4 h-4 text-blue-500" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);
}
export default AllInvoices;