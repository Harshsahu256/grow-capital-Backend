const BankAccount = require("../models/BankAccount");

// ✅ CREATE (Admin)
exports.createAccount = async (req, res) => {
  try {
    const { accountNumber, ifscCode } = req.body;

    if (!accountNumber || !ifscCode) {
      return res.status(400).json({ message: "Account Number and IFSC Code are required!" });
    }

    const existingAccount = await BankAccount.findOne({ accountNumber });
    if (existingAccount) {
      return res.status(400).json({ message: "Account already exists!" });
    }

    const account = new BankAccount({ accountNumber, ifscCode });
    await account.save();

    res.status(201).json({ message: "Account created successfully!", account });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// ✅ READ ALL (Admin)
exports.  getAllAccounts = async (req, res) => {
  try {
    const accounts = await BankAccount.find().sort({ createdAt: -1 });
    res.json({ total: accounts.length, accounts });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// ✅ READ SINGLE (Admin)
exports.getAccountById = async (req, res) => {
  try {
    const account = await BankAccount.findById(req.params.id);
    if (!account) return res.status(404).json({ message: "Account not found!" });
    res.json(account);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// ✅ UPDATE (Admin)
exports.updateAccount = async (req, res) => {
  try {
    const { accountNumber, ifscCode } = req.body;

    const updated = await BankAccount.findByIdAndUpdate(
      req.params.id,
      { accountNumber, ifscCode },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Account not found!" });

    res.json({ message: "Account updated successfully!", updated });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// ✅ DELETE (Admin)
exports.deleteAccount = async (req, res) => {
  try {
    const deleted = await BankAccount.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Account not found!" });
    res.json({ message: "Account deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// ✅ USER GET (User — Read Only)
exports.userGetAccounts = async (req, res) => {
  try {
    const accounts = await BankAccount.find().sort({ createdAt: -1 });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
