const Sale = require("../models/DS/sale.model");

const InsertIntoSell = async (data, session) => {
  try {
    const res = await Sale.create([data], { session });

    return res[0];
  } catch (error) {
    throw error;
  }
};

module.exports = { InsertIntoSell };
