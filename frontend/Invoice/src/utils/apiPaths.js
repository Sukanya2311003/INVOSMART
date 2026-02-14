// export const BASE_URL="http://localhost:8000";
// export const API_PATHS={
//     AUTH: {
//         REGISTER:"/api/auth/register",
//         LOGIN:"/api/auth/login",
//         GET_PROFILE:"/api/auth/me",
//         UPDATE_PROFILE:"/api/auth/me",
//     },
//     INVOICE: {
//         CREATE:"/api/invoices/",
//         GET_ALL:"/api/invoices/",
//         GET_INVOICE_BY_ID:(id)=>`/api/invoices/${id}`,
//         UPDATE_INVOICE:(id)=>`/api/invoices/${id}`,
//         DELETE_INVOICE:(id)=>`/api/invoices/${id}`,
//     },
//     AI: {
//         PARSE_INVOICE_TEXT:"/api/ai/parse-text",
//         GENERATE_REMINDER: "/api/ai/generate-reminder",
//         GET_DASHBOARD_SUMMARY: "/api/ai/dashboard-summary", 
//     }
// };
export const BASE_URL = "http://localhost:8000/api";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    GET_PROFILE: "/auth/me",
    UPDATE_PROFILE: "/auth/me",
  },
  INVOICE: {
    CREATE: "/invoices",
    GET_ALL: "/invoices",
    GET_INVOICE_BY_ID: (id) => `/invoices/${id}`,
    UPDATE_INVOICE: (id) => `/invoices/${id}`,
    DELETE_INVOICE: (id) => `/invoices/${id}`,
  },
  AI: {
    PARSE_INVOICE_TEXT: "/ai/parse-text",
    GENERATE_REMINDER: "/ai/generate-reminder",
    GET_DASHBOARD_SUMMARY: "/ai/dashboard-summary",
  },
};
