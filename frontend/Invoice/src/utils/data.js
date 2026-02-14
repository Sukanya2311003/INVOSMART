import { BarChart2, FileText, LayoutDashboard, Mail, Plus, Sparkles, Users } from "lucide-react";

export const FEATURES = [
  {
    icon: Sparkles,
    title: "AI-Powered Invoice Generation",
    description:
      "Transform plain text into professional invoices with just a few clicks using our advanced AI technology.",
  },
  {
    icon: BarChart2,
    title: "AI-Powered Dashboard",
    description:
      "Get smart financial insights and analytics to help you make informed business decisions.",
  },
  {
    icon: Mail,
    title: "Smart reminders & Follow-ups",
    description:
      "Automatically send payment reminders and follow-ups to clients, reducing late payments and improving cash flow",
  },
  {
    icon: FileText,
    title: "Easy Invoice Management",
    description:"Create, send, and track invoices effortlessly. Automate payment reminders and follow-ups to ensure timely payments."
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "This invoicing app has transformed the way I manage my business finances. The AI-powered invoice generation saves me so much time",
    author: "Rohit Sharma",
    title: "Freelancer",
    avatar: "https://cdn-icons-png.flaticon.com/128/3135/3135715.png",
  },
  {
    quote:
      "This is the best invoicing app I've ever used. The AI-powered features are incredibly accurate and make creating invoices a breeze.",
    author: "Anjali Verma",
    title: "Small Business Owner",
    avatar: "https://cdn-icons-png.flaticon.com/128/6997/6997662.png",
  },
  {
    quote:
      "The AI-powered dashboard provides valuable insights into my business finances, helping me make better decisions.",
    author: "Vikram Singh",
    title: "Entrepreneur",
    avatar: "https://cdn-icons-png.flaticon.com/128/3135/3135715.png",
  },
];
export const FAQS = [
  {
    question: "How does the AI-powered invoice generation work?",
    answer:"Simply input your invoice details in plain text like an email, a list of payments, and our AI will generate a professional invoice for you.",
    },  
    {
    question: "Is my data secure with this app?",
    answer:"Yes, we prioritize your data security and use industry-standard encryption to protect your information.",
    },  
    {
    question: "Is there a free trial available?",
    answer:"Yes, you can sign up for a free account and explore the basic features of the app for 30 days.",
    },
    {
    question: "What is your cancellation policy?",
    answer:"You can cancel your subscription at any time from your account settings. There are no cancellation fees.",
    },
    {
    question: "Can other details be added to the invoice?",
    answer:"Yes, you can customize the invoice by adding notes, payment terms and even attach files to your invoices.",
    },
    {
    question: "What payment methods do you accept?",
    answer:"We accept all major credit cards, PayPal, and bank transfers.",         
    },
    {
    question: "How can I change my account settings?",
    answer:"You can update your account settings, including your email, password, and billing information, from the account dashboard.",
    }
];
// Navigation items for Dashboard Layout
export const NAVIGATION_MENU=[
  { id: "dashboard", name:"Dashboard", icon: LayoutDashboard},
  { id: "invoices", name:"Invoices", icon: FileText},
  { id: "invoices/new", name:"Create New Invoice", icon: Plus},
  {id: "profile", name:"Profile", icon: Users},
];
