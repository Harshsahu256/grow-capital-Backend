
// const mongoose = require("mongoose");

// const positionSchema = new mongoose.Schema({
//   companyName: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   buy: {
//     type: Number,
//     required: true, // per share buy price
//   },
//   sell: {
//     type: Number,
//     required: true, // per share sell price
//   },
//   totalPrice: {
//     type: Number,
//     required: true, // total invested amount
//   },
//   quantity: {
//     type: Number,
//     default: 0, // auto calculated
//   },
//   totalProfit: {
//     type: Number,
//     default: 0, // auto calculated
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // 🧮 Auto calculate quantity & profit before save
// positionSchema.pre("save", function (next) {
//   const buyValue = this.buy || 0;
//   const sellValue = this.sell || 0;
//   const totalValue = this.totalPrice || 0;

//   // 🧾 Quantity calculation (total investment ÷ per share buy price)
//   const quantity = buyValue > 0 ? totalValue / buyValue : 0;

//   // 💰 Profit = (Sell - Buy) × Quantity
//   const profit = (sellValue - buyValue) * quantity;

//   this.quantity = quantity;
//   this.totalProfit = profit;

//   next();
// });

// module.exports = mongoose.model("Position", positionSchema);


const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // 👈 linked to User collection
    required: true,
  },
  companyName: { type: String, required: true, trim: true },
  buy: { type: Number, required: true },
  sell: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  quantity: { type: Number, default: 0 },
  totalProfit: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

positionSchema.pre("save", function (next) {
  const buyValue = this.buy || 0;
  const sellValue = this.sell || 0;
  const totalValue = this.totalPrice || 0;
  const quantity = buyValue > 0 ? totalValue / buyValue : 0;
  const profit = (sellValue - buyValue) * quantity;

  this.quantity = quantity;
  this.totalProfit = profit;
  next();
});

module.exports = mongoose.model("Position", positionSchema);
