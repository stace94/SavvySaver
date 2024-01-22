const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const purchasesSchema = new mongoose.Schema({

  // Expenses object with categories and their respective expenses
  transactionLog: Schema.Types.Mixed,
  author: { type: String, index: true },
});

const Purchases = mongoose.model('Purchases', purchasesSchema);

module.exports = Purchases; 