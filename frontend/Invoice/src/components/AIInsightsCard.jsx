import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { Lightbulb } from "lucide-react";

const AIInsightsCard = () => {
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.AI.GET_DASHBOARD_SUMMARY,
        );
        console.log("AI response:", response.data);

        // modified part
        const aiInsights = response.data?.parsedData?.insights || [];
         setInsights(Array.isArray(aiInsights) ? aiInsights : []);

        // setInsights(response.data || []);
      } catch (error) {
        console.error("Error fetching AI insights:", error);
        setInsights([]);

      } finally {
        setIsLoading(false);
      }
    };
    fetchInsights();
  }, []);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Lightbulb className="h-6 w-6 text-yellow-400 mr-3" />
        <h3 className="text-lg font-semibold text-white">AI Insights</h3>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
          <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
          <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
        </div>
      ) :  (
        <ul className="space-y-3 list-disc list-inside text-sm text-zinc-300 ml-3 ">
            
          {Array.isArray(insights) && insights.map((insight, index) => (
            <li key={index} className=" text-sm flex items-start gap-2">
           {insight}
            </li>
          ))}
        </ul>
    
      )}
    </div>
  );
};
    export default AIInsightsCard;
