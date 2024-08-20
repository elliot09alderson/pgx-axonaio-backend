const PayinSettlement = [
  {
    settlementDate: "2024-05-01",
    partnerId: "partner1",
    merchantName: "Merchant A",
    payeeVpa: "payee@example.com",
    cycle: "Monthly",
    timeoutCount: 10,
    timeoutVolume: 1000,
    successCount: 90,
    successVolume: 9000,
    totalCount: 100,
    totalVolume: 10000,
    charges: 50,
    chargeback: 5,
    prevDayCreditAdj: 20,
    netSettlement: 995,
    transferred: 995,
    fundReleased: 995,
    cutOff: 5,
    difference: 0,
    utrNo: "1234567890",
    remarks: "Sample remarks",
  },
  {
    settlementDate: "2024-05-02",
    partnerId: "partner2",
    merchantName: "Merchant B",
    payeeVpa: "payee2@example.com",
    cycle: "Weekly",
    timeoutCount: 5,
    timeoutVolume: 500,
    successCount: 95,
    successVolume: 9500,
    totalCount: 100,
    totalVolume: 10000,
    charges: 50,
    chargeback: 5,
    prevDayCreditAdj: 25,
    netSettlement: 995,
    transferred: 995,
    fundReleased: 995,
    cutOff: 5,
    difference: 0,
    utrNo: "1234567891",
    remarks: "Sample remarks 2",
  },
  {
    settlementDate: "2024-05-03",
    partnerId: "partner3",
    merchantName: "Merchant C",
    payeeVpa: "payee3@example.com",
    cycle: "Bi-weekly",
    timeoutCount: 15,
    timeoutVolume: 1500,
    successCount: 85,
    successVolume: 8500,
    totalCount: 100,
    totalVolume: 10000,
    charges: 60,
    chargeback: 8,
    prevDayCreditAdj: 18,
    netSettlement: 985,
    transferred: 985,
    fundReleased: 985,
    cutOff: 5,
    difference: 0,
    utrNo: "1234567892",
    remarks: "Sample remarks 3",
  },
  {
    settlementDate: "2024-05-04",
    partnerId: "partner4",
    merchantName: "Merchant D",
    payeeVpa: "payee4@example.com",
    cycle: "Monthly",
    timeoutCount: 20,
    timeoutVolume: 2000,
    successCount: 80,
    successVolume: 8000,
    totalCount: 100,
    totalVolume: 10000,
    charges: 70,
    chargeback: 10,
    prevDayCreditAdj: 15,
    netSettlement: 980,
    transferred: 980,
    fundReleased: 980,
    cutOff: 5,
    difference: 0,
    utrNo: "1234567893",
    remarks: "Sample remarks 4",
  },
  {
    settlementDate: "2024-05-05",
    partnerId: "partner5",
    merchantName: "Merchant E",
    payeeVpa: "payee5@example.com",
    cycle: "Monthly",
    timeoutCount: 25,
    timeoutVolume: 2500,
    successCount: 75,
    successVolume: 7500,
    totalCount: 100,
    totalVolume: 10000,
    charges: 80,
    chargeback: 15,
    prevDayCreditAdj: 10,
    netSettlement: 970,
    transferred: 970,
    fundReleased: 970,
    cutOff: 5,
    difference: 0,
    utrNo: "1234567894",
    remarks: "Sample remarks 5",
  },
];

module.exports = PayinSettlement;
