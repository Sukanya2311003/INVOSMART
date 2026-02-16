// const {GoogleGenAi} = require('@google/genai');
// const Invoice= require("../models/Invoice");
// const ai= new GoogleGenAi({
//     apiKey: process.env.GEMINI_API_KEY
// });
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Invoice = require("../models/Invoice");
const { parse } = require("dotenv");

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);




const parseInvoiceFromText= async (req, res)=>{
    const {text}= req.body;
    if(!text){
        return res.status(400).json({message:"Text is required"});
    }
    try{
        // const prompt= `You are an expert at extracting invoice data from unstructured text.Analyze the following text and extract relevant information to  create an invoice.The output MUST be a valid JSON object.
        // The JSON object should have following structures:
        // {
        // "clientName": "string",
        // "email": "string(if available)",
        // "address": "string(if available)",
        // "items": [
        //     {
        //         "name": "string",
        //         "quantity": number,
        //         "unitPrice": number

               

        //     }
            
        // ],  
        // }
        // Here is the text to parse:
        // ---TEXT START   ---
        // ${text}
        // ---TEXT END---
        // Extract the data and provide only JSON object.`;

const prompt = `
You are an expert at extracting invoice data from unstructured text.

Analyze the following text and extract all relevant information required to create an invoice.

The output MUST be a valid JSON object.

The JSON object should have the following structure:

{
  "clientName": "string",
  "email": "string (if available)",
  "address": "string (if available)",
  "invoiceDate": "MM-DD-YYYY (if mentioned)",
  "dueDate": "MM-DD-YYYY (if mentioned)",
  "gstPercent": number (if mentioned, otherwise 0),
  "notes": "string (any payment terms or late payment policy if mentioned)",
  "items": [
    {
      "name": "string",
      "quantity": number,
      "unitPrice": number
    }
  ]
}

Rules:
- Convert dates to MM-DD-YYYY format.
- If payment terms or late payment penalties are mentioned, include them in "notes".
- Extract any tax mentioned (GST, VAT, Sales Tax, etc.)
- If multiple taxes are mentioned, include all in "taxes" array.
- Return ONLY valid JSON.
- Do NOT include explanations.

Here is the text to parse:
---TEXT START---
${text}
---TEXT END---

Extract the data and provide only the JSON object.
`;


        // const response= await ai.models.generateContent ({
        //     model: 'gemini-1.5-flash-latest',
        //     contents: prompt,
        // });
  const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  const responseText = await result.response.text();

        // const responseText= response.text;
        if(typeof responseText !== 'string'){
            if(typeof response.text== 'function'){
                responseText= response.text();
            }
            else{
                throw new Error("Could not extract text from AI.");
            }
    }
    const cleanedJSON= responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData= JSON.parse (cleanedJSON);
    res.status(200).json({parsedData});
    }
    catch(error){
       console.error("Error parsing invoice text from AI:", error);
       res.status(500).json({message:"Failed to parse invoice data from text.", details:  error.message});
    }
    
};
module.exports={parseInvoiceFromText};

const generateReminderEmail= async (req, res)=>{
    const {invoiceId}= req.body;   
    if(!invoiceId){
        return res.status(400).json({message:"Invoice Id is required"});
    }   
    try{
        const invoice= await Invoice.findById(invoiceId);
        if(!invoice){
            return res.status(404).json({message:"Invoice not found"});
        }
//         const prompt = `You are an expert at writing professional and polite reminder emails for overdue invoices.Write a friendly reminder email to a client about an overdue or upcoming invoice payment.
//         Use the following invoice details to personalise the email:
//         -Client Name: ${invoice.billTo.clientName}
//         -Invoice Number: ${invoice.invoiceNumber}
//         -Amount Due: ${invoice.total.toFixed(2)}
//         -Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}
//         The tone should be polite and professional. Keep the email concise and to the point.
//         Start the email with "Subject: ".
//         Format:

// Subject: ...
// Body:
// <email message>`;
    //     const response= await ai.models.generateContent ({
    //         model: 'gemini-1.5-flash-latest',
    //         contents: prompt,
    // });
    //  "invoiceDate" : ""
                // "dueDate ": "",
     const prompt = `
Write a professional and polite overdue invoice reminder email. Use the exact values provided.

Sender (Bill From):
Company: ${invoice.billFrom.businessName}
Email: ${invoice.billFrom.email}
Phone: ${invoice.billFrom.phone}
Address: ${invoice.billFrom.address}

Client (Bill To):
Client Name: ${invoice.billTo.clientName}
Client Email: ${invoice.billTo.email}
Client Address: ${invoice.billTo.address}

Invoice Info:
Invoice Number: ${invoice.invoiceNumber}
Amount Due: ₹${invoice.total.toFixed(2)}
Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}
Status: ${invoice.status}

Email requirements:
✅ Subject line
✅ Mention client name, invoice no., due date, amount
✅ Professional + polite tone
✅ No placeholders like [Your Name] or [Company Name]
✅ End with sender details
❌ Do NOT add code blocks or markdown
`;



const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
const result = await model.generateContent(prompt);
const responseText = result.response.text();


    res.status(200).json({reminderText: responseText});
}
    catch(error){
         console.error("Error generating reminder email from AI:", error);
            res.status(500).json({message:"Failed to generate reminder email.", details: error.message});
    }
};
const getDashboardSummary= async (req, res)=>{
    try{
        const invoices= await Invoice.find({user: req.user.id});
        if(invoices.length==0){
            return res.status(400).json({message:"No invoice data available to generate insights ."});
        }
        // PROCESS AND SUMMARIZE INVOICE DATA
        const totalInvoices= invoices.length;
        const paidInvoices= invoices.filter((inv)=> inv.status==='Paid');
        const unpaidInvoices= invoices.filter((inv)=> inv.status!=='Paid');
        const totalRevenue= paidInvoices.reduce((acc, inv)=> acc + inv.total, 0);
        const totalOutstanding= unpaidInvoices.reduce((acc, inv)=> acc + inv.total, 0);
        const dataSummary= `
        -Total number of invoices: ${totalInvoices}
        -Total paid invoices: ${paidInvoices.length}
        -Total unpaid invoices: ${unpaidInvoices.length}
        -Total revenue from paid invoices: ₹${totalRevenue.toFixed(2)}
        -Total outstanding amount from unpaid invoices: ${totalOutstanding.toFixed(2)}
        -Recent invoices(last 5): ${invoices.slice(0,5).map((inv)=> `Invoice #${inv.invoiceNumber} for ${inv.total.toFixed(2)} with status ${inv.status}`).join('; ')}
        `;
        const prompt=`You are a freindly and insightful financial analyst for a small business owner. 
        Based on the following invoice data summary, provide a concise dashboard summary highlighting key insights and trends.
        Each insight should be a short string in a JSON array.
        The insights should be encouraging and helpful. Don't just repeat the data.
        For example, if there is a high outstanding amount, suggest sending reminders.If revenue is high be encouraging .
        Data Summary:
        ${dataSummary}
        Return your response as a valid JSON object with a singlr key "insights" which is an array of  strings.
        It shoild sound humane instead of too professional.
        Example format:
        {"insights": ["Your revenue is looking strong  this  month!", "You have 5 overfue invoices. Consider sending reminders to get paid faster."]}
        `;
        const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();

        // remove code fences if present
        const cleanedJSON = responseText
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        // parse json
        const parsedData = JSON.parse(cleanedJSON);

        res.status(200).json({ parsedData });

    }
    catch(error){
            console.error("Error generating dashboard summary from AI:", error);
            res.status(500).json({message:"Failed to generate dashboard summary.", details: error.message});
    }
};
module.exports={parseInvoiceFromText, generateReminderEmail, getDashboardSummary};