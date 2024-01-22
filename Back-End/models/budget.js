const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const budgetSchema = new Schema({
  // Income object with incomeName and incomeValue
  
  incomes: Schema.Types.Mixed,
  expenses: Schema.Types.Mixed,
  totalIncome: Number,
  amountLeft: Number,
  

  // Expenses object with categories and their respective expenses
  // expenses: {
  //   type: Map,
  //   of: Map,
  //   required: true,
  // },
  author: { type: String, index: true },
});

const Budget = model('Budget', budgetSchema); 

module.exports = Budget;  
  