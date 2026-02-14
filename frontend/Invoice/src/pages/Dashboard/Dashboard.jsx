import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { Loader2, FileText, DollarSign, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Button from "../../components/ui/Button";
// import AIInsightsCard from "../../components/AIInsightsCard";
import AIInsightsCard from "../../components/AIInsightsCard";

const Dashboard=()=>{

    const [stats, setStats]= useState({
        totalInvoices: 0,
        totalPaid: 0,
        totalUnpaid: 0,
    });
    const [recentInvoices, setRecentInvoices]= useState([]);
    const [loading, setLoading]= useState(true);
    const navigate= useNavigate();
    useEffect(()=>{
        const fetchDashboardData= async()=>{
            try{
                const response= await axiosInstance.get(API_PATHS.INVOICE.GET_ALL);
                const invoices= response.data;
                const totalInvoices= invoices.length;

console.log("Invoices from backend:", invoices);

                const totalPaid= invoices.filter(inv=> inv.status === "Paid").reduce((sum, inv)=> sum + inv.total, 0);
                const totalUnpaid= invoices.filter((inv)=> inv.status !== "Paid").reduce((sum, inv)=> sum + inv.total, 0);
                setStats({
                    totalInvoices,
                    totalPaid,
                    totalUnpaid,
                });
                setRecentInvoices(invoices.sort((a, b)=>new Date(b.invoiceDate) - new Date(a.invoiceDate)).slice(0, 5));
            } catch(error){
                console.error("Error fetching dashboard data:", error);
            } finally{
                setLoading(false);  
            }
        };

        fetchDashboardData();
    }, []);

    const statsData = [
      {
        icon: FileText,
        label: "Total Invoices",
        value: stats.totalInvoices,
        color: "bg-gradient-to-br from-indigo-700 to-indigo-900 text-white",
      },
      {
          icon: DollarSign,
          label: "Total Paid",
          value: stats.totalPaid,
          color: "bg-gradient-to-br from-emerald-600 to-emerald-800 text-white",
        },
        {
          icon: DollarSign,
          label: "Total Unpaid",
          value: stats.totalUnpaid,
          color: "bg-gradient-to-br from-rose-500 to-rose-800 text-white",
        },
    ];

    const colorClasses={
        paid: "bg-green-100 text-green-800",
        unpaid: "bg-red-100 text-red-800",
        overdue: "bg-yellow-100 text-yellow-800",
    };

    if(loading){
        return(
            <div className="flex items-center justify-center h-96">
                <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
            </div>
        )
    }
    // return(
        
    //     <div className=" text-amber-50 space-y-8">
    //         <div>
    //             <h2 className="text-xl fonst-semibold mb-1 text-slate-200">
    //                 Dashboard
    //             </h2>
    //             <p className=" text-sm text-slate-100">
    //                 Welcome back! Here is an overview of your invoicing activity.
    //             </p>
    //         </div>
    //         {/* Stats Cards     */}
    //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //             {statsData.map((stat, index)=>(
    //                 <div
    //                  key={index} 
    //                 className={`rounded-xl border-zinc-200 rounded-lg shadow-lg shadow-gray-400 ${stat.color}`}>
    //                     <div className="">
    //                         <div className={`flex-shrink-0 w-12 h-12 ${colorClasses[stat.color].bg}
    //                         rounded-lg flex items-center justify-center text-white`}>
    //                             <stat.icon className={`h-6 w-6 ${colorClasses[stat.color].text}`} />
    //                         </div>
    //                         <div className="">
    //                             <div className="">
    //                                 {stat.label}
    //                             </div>
    //                             <div className="">
    //                                 {stat.value}
    //                             </div>
    //                         </div>
    //                 </div>
                
    //         </div>
    //             ))}
    //         </div>
    //                      {/*insights card  */}

    //                        {/*  recent */}

    //               </div>
    // )

return (
  <div className="space-y-8 text-white pb-96 ">
    {/* Header */}
    <div>
      <h2 className="text-2xl font-semibold mb-1 text-white">Dashboard</h2>
      <p className="text-sm text-zinc-300">
        Welcome back! Here is an overview of your invoicing activity.
      </p>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <div
            key={index}
            className={`rounded-xl p-6 shadow-lg transition-all duration-300 hover:scale-105 ${stat.color}`}
          >
            <div className="flex items-center justify-between">
              {/* Left Content */}
              <div>
                <p className="text-sm opacity-80 truncate">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-2 break-words">
                  {stat.value}
                </h3>
              </div>

              {/* Icon */}
              <div className="bg-white/20 p-3 rounded-lg">
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {/* ai insights card */}
    <AIInsightsCard />

    {/* recent invoices */}
    <div className=" w-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between  px-6 py-4  border-b border-slate-300 mb-6">
        <h3 className="text-lg font-semibold text-white">Recent Invoices</h3>
        <Button
          variant="ghost"
          onClick={() => navigate("/invoices")}
          className="ml-auto"
        >
          View All
        </Button>
      </div>
      {recentInvoices.length > 0 ? (
        <div className="w-[90vw] md:w-auto overflow-x-auto">
          <table className="w-full min-w-[600px] divide-y divide-zinc-800">
            <thead className="text-left text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-50 uppercase tracking-wide">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-50 uppercase tracking-wide">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-50 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-50 uppercase tracking-wide">
                  Due Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {recentInvoices.map((invoice) => (
                <tr
                  key={invoice._id}
                  className="hover:bg-zinc-600 cursor-pointer transition-colors duration-200"
                  onClick={() => navigate(`/invoices/${invoice._id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-zinc-300">
                      {invoice.billTo.clientName}
                    </div>
                    <div className="text-sm text-zinc-100">
                      #{invoice.invoiceNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-300">
                    ${invoice.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invoice.status === "Paid"
                          ? "bg-emerald-600/20 text-emerald-400"
                          : invoice.status === "Unpaid"
                            ? "bg-rose-800/20 text-rose-600"
                            : "bg-yellow-600/20 text-yellow-400"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                    {moment(invoice.dueDate).format("MMM Do YYYY")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="tflex flex-col items-center  text-center py-12 text-zinc-400">
          <div className="w-16 h-16  bg-gradient-to-br from-gray-500 to-gray-800 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-zinc-300" />
          </div>
          <h3 className="text-lg font-medium text-zinc-300 mb-2 ">
            No recent invoices found.
          </h3>
          <p className="text-sm text-zinc-400 mb-6  ">
            You haven't created any invoices yet. Click the button below to
            create your first invoice.
          </p>
          {/* <Button
            onClick={() => navigate("/invoices/new")}
            icon={Plus }
            className="mt-4 text-gray-50 ml-2"

          >
            Create Invoice
          </Button> */}
          <Button
            onClick={() => navigate("/invoices/new")}
            className="mt-4 ml-2 text-white flex items-center bg-gradient-to-bl from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-colors duration-300 rounded-full p-2 shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>
      )}
    </div>
  </div>
);


    

}   
export default Dashboard;