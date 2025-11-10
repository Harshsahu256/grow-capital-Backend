// controllers/withdrawController.js

const User = require("../models/User");
const WithdrawRequest = require("../models/WithdrawRequest");

// ✅ User submits a withdraw request
exports.createWithdrawRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, amount } = req.body;

    if (!date || !amount) {
      return res.status(400).json({ message: "Date and Amount are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newRequest = await  WithdrawRequest.create({
      user: userId,
      userName: user.fullName,
      accountNumber: user.accountNumber,
      ifscCode: user.ifscCode,
      date,
      amount,
    });

    res.status(201).json({
      message: "Withdrawal request submitted successfully!",
      data: newRequest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Admin: get all withdraw requests
exports.getAllWithdrawRequests = async (req, res) => {
  try {
    const requests = await WithdrawRequest.find()
      .populate("user", "fullName email accountNumber ifscCode")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Withdraw requests fetched",
      total: requests.length,
      requests,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Admin: approve or reject a request
exports.updateWithdrawRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await  WithdrawRequest.findById(id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = status;
    await request.save();

    // ✅ If approved, reduce totalAmount from user
    if (status === "approved") {
      const user = await User.findById(request.user);
      if (user) {
        user.totalAmount -= request.amount;
        await user.save();
      }
    }

    res.status(200).json({ message: `Request ${status} successfully`, request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};






exports.getUserTransactionHistory = async (req, res) => {
  try {
    const userId = req.user._id; // req.user comes from verifyUser middleware

    // ✅ Fetch withdraw requests of the user
    const withdrawRequests = await WithdrawRequest.find({ user: userId }).sort({ createdAt: -1 });

    // ✅ Fetch user details
    const user = await User.findById(userId).select("fullName email totalAmount token");

    // ✅ Prepare transaction summary
    const totalWithdrawn = withdrawRequests
      .filter(req => req.status === "approved")
      .reduce((sum, req) => sum + req.amount, 0);

    const pendingWithdraw = withdrawRequests
      .filter(req => req.status === "pending")
      .reduce((sum, req) => sum + req.amount, 0);

    res.status(200).json({
      user: {
        fullName: user.fullName,
        email: user.email,
        totalAmount: user.totalAmount,
        token: user.token || null,
      },
      summary: {
        totalWithdrawn,
        pendingWithdraw,
        totalRequests: withdrawRequests.length
      },
      transactions: withdrawRequests // includes date, amount, status, etc.
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};