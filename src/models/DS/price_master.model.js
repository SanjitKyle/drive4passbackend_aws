const mongoose = require("mongoose");

const PriceMasterSchema = new mongoose.Schema(
  {
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "school",

  
    },

    branch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "area",
      required: true,
      unique:true
    },

    package_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "package_master",
      required: true,
      unique:true
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model("PriceMaster", PriceMasterSchema);
