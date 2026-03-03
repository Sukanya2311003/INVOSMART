// 19feb
const axios = require("axios");
const Invoice = require("../models/Invoice");

const calculateClientFeatures = require("../utils/riskCalculator");
//

// @desc  create new invoice
// @route    POST/api/invoices
// @access    Private

exports.createInvoice = async (req, res) => {
  try {
    const user = req.user;
    const {
      invoiceNumber,
      invoiceDate,
      dueDate,
      billFrom,
      billTo,
      items,
      notes,
      paymentTerms,
    } = req.body;
    // subtotal calculation
    let subtotal = 0;
    let taxTotal = 0;
    items.forEach((item) => {
      subtotal += item.unitPrice * item.quantity;
      taxTotal +=
        (item.unitPrice * item.quantity * (item.taxPercent || 0)) / 100;
    });
    const total = subtotal + taxTotal;

    // 19 feb

    const features = await calculateClientFeatures(billTo.clientName, user);

    console.log("Client Features:", features);
    //     // 🔥 2️⃣ Call ML service
    //     // const response = await axios.post("http://127.0.0.1:5000/predict", {
    //     const response = await axios.post(`${process.env.ML_SERVICE_URL}/predict`, {
    //       amount: total,
    //       late_count: features.lateCount,
    //       avg_delay: features.avgDelay,
    //       frequency: features.totalInvoices,
    //       new_client: features.isNewClient,
    //     });

    //     const riskScore = response.data.risk_score;
    //     const riskLevel = response.data.risk_level;

    //     //

    //     const invoice = new Invoice({
    //       user,
    //       invoiceNumber,
    //       invoiceDate,
    //       dueDate,
    //       billFrom,
    //       billTo,
    //       items,
    //       notes,
    //       paymentTerms,
    //       subtotal,
    //       taxTotal,
    //       total,
    //       //19feb
    //       riskScore,
    //       riskLevel,
    //       //
    //     });
    //     await invoice.save();
    //     res.status(201).json(invoice);
    //   } catch (error) {
    //     res
    //       .status(500)
    //       .json({ message: "Error creating invoice", error: error.message });
    //   }
    // };
    // // @desc get all invoices of loggedin user
    // // @route: GET /api/invoices
    // // @access private
    // exports.getInvoices = async (req, res) => {
    //   try {
    //     const invoices = await Invoice.find({ user: req.user.id }).populate(
    //       "user",
    //       "name email",
    //     );
    //     res.json(invoices);
    //   } catch (error) {
    //     res
    //       .status(500)
    //       .json({ message: "Error creating invoice", error: error.message });
    //   }

    // =========================
    // SAVE INVOICE FIRST
    // =========================
    const invoice = await Invoice.create({
      user,
      invoiceNumber,
      invoiceDate,
      dueDate,
      billFrom,
      billTo,
      items,
      notes,
      paymentTerms,
      subtotal,
      taxTotal,
      total,
      riskScore: null,
      riskLevel: "Processing",
    });

    // =========================
    // CALLING  ML SAFELY
    // =========================
    try {
      const response = await axios.post(
        `${process.env.ML_SERVICE_URL}/predict`,
        {
          amount: total,
          late_count: features.lateCount || 0,
          avg_delay: features.avgDelay || 0,
          frequency: features.totalInvoices || 0,
          new_client: features.isNewClient || 0,
        },
        { timeout: 60000 }, // important for cold start
      );

      if (response?.data) {
        invoice.riskScore = response.data.risk_score;
        invoice.riskLevel = response.data.risk_level;

        await invoice.save();

        console.log("ML Success:", response.data);
      }
    } catch (mlError) {
      console.error("ML Service Error:", mlError.message);
      
      // Invoice already saved.
    }

    return res.status(201).json(invoice);
  } catch (error) {
    console.error("Create Invoice Error:", error);
    return res.status(500).json({
      message: "Error creating invoice",
      error: error.message,
    });
  }
};
// @desc get single invoice by id
// @route: GET /api/invoices/:id
// @access private
//

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // 🔐 Check if invoice belongs to logged-in user
    if (invoice.user._id.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching invoice",
      error: error.message,
    });
  }
};

// @desc update invoice
// @route: PUT/api/invoices/:id
// @access private
exports.updateInvoice = async (req, res) => {
  try {
    // const {
    //     invoiceNumber,
    //     invoiceDate,
    //     dueDate,
    //     billFrom,
    //     billTo,
    //     items,
    //     notes,
    //     paymentTerms,
    //     status,
    // }= req.body;
    // let subtotal= 0;
    // let taxTotal=0;
    // if(items && items.length > 0){
    //     items.forEach(item => {
    //         subtotal+= item.unitPrice * item.quantity;
    //         taxTotal += ((item.unitPrice * item.quantity)
    //         * (item.taxPercent || 0)) / 100;
    //     });
    //     const total= subtotal + taxTotal;
    //     const updatedInvoice= await Invoice.findByIdAndUpdate(req.params.id,{
    //         invoiceNumber,
    //         invoiceDate,
    //         dueDate,
    //         billFrom,
    //         billTo,
    //         items,
    //         notes,
    //         paymentTerms,
    //         status,
    //         subtotal,
    //         taxTotal,
    //         total,
    //     }

    //     ,{new:true});
    //     if(!updatedInvoice){
    //         return res.status(404).json({message:"Invoice not found"});

    //     }

    //     res.json(updatedInvoice);

    // }

    // created new update with stoding apid logic 19feb
    const {
      invoiceNumber,
      invoiceDate,
      dueDate,
      billFrom,
      billTo,
      items,
      notes,
      paymentTerms,
      status,
    } = req.body;

    let updateData = {
      invoiceNumber,
      invoiceDate,
      dueDate,
      billFrom,
      billTo,
      notes,
      paymentTerms,
      status,
    };

    // 🔥 Recalculate only if items exist
    if (items && items.length > 0) {
      let subtotal = 0;
      let taxTotal = 0;

      items.forEach((item) => {
        subtotal += item.unitPrice * item.quantity;
        taxTotal +=
          (item.unitPrice * item.quantity * (item.taxPercent || 0)) / 100;
      });

      updateData.items = items;
      updateData.subtotal = subtotal;
      updateData.taxTotal = taxTotal;
      updateData.total = subtotal + taxTotal;
    }

    // 🔥 Paid date logic
    if (status === "Paid") {
      updateData.paidAt = new Date();
    }

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(updatedInvoice);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating invoice", error: error.message });
  }
};
// @desc delete invoice by
// @route: DELETE /api/invoices/:id
// @access private
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting invoice", error: error.message });
  }
};
