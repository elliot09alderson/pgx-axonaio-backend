const MerchantPricingModel = require("../../models/Payin/PayinPricing");

const createMerchantPricing = async (req, res) => {
  // const { merchant_id, UPI, NetBanking, CC, DC, Wallet, UPI_Collect } =
  //   req.body;
  const pricing = {
    merchant_id: "64ba5f322495c6d4eaad5b24",
    UPI: "2.3",
    NetBanking: "1.3",
    CC: "2.5",
    DC: "2",
    Wallet: "1.2",
    UPI_Collect: "2",
  };
  const MerchantPricing = await MerchantPricingModel.create(pricing);
  res.json({ message: 201, MerchantPricing });
};

module.exports = { createMerchantPricing };
