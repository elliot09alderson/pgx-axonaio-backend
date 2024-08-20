// const {testPayinOrder, livePayinOrder} = require("../../models/payin/order");

// // FUNCTION FOR GENERATE ORDERID
// function generateOrderId() {
//   const characters =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   const minLength = 18;
//   const maxLength = 24;
//   const length =
//     Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
//   let orderId = "";

//   for (let i = 0; i < length; i++) {
//     const randomIndex = Math.floor(Math.random() * characters.length);
//     orderId += characters.charAt(randomIndex);
//   }

//   return orderId;
// }
// // Creating

// exports.createOrder = async (req, res) => {
//   try {
//     const mode = req.query.mode
//     if(!mode){return res.status(400).json({status:false, error:"Please select the Mode"})}

//     const merchantId = req.user.m_id;

//     const { order_amount, order_receipt, order_status } = req.body;

//     // Validate request body
//     if (!order_amount) {
//       return res
//         .status(400)
//         .json({ error: "All required fields must be provided" });
//     }

//     const newOrder = await testPayinOrder.create({
//       order_id: generateOrderId(),
//       order_amount,
//       order_receipt,
//       order_status,
//       m_id: merchantId,
//     });

//     return res
//       .status(201)
//       .json({ status: true, message: "created successfully", data: newOrder });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getTodaysOrders = async (req, res) => {
//   try {
//     const merchantId = req.user.m_id;

//     // Get today's date
//     const today = new Date();
//     // Set the time to the beginning of the day (00:00:00)
//     today.setHours(0, 0, 0, 0);

//     // Get tomorrow's date
//     const tomorrow = new Date(today);
//     // Set the time to the end of the day (23:59:59)
//     tomorrow.setDate(today.getDate() + 1);
//     tomorrow.setHours(23, 59, 59, 999);

//     // Find orders data for the current user within today's date range
//     const Orders = await testPayinOrder.find({
//       m_id: merchantId,
//       createdAt: { $gte: today, $lte: tomorrow },
//     }).sort({ createdAt: -1 });

//     if (Orders.length > 0) {
//       res.status(200).json({ status: true, data: Orders });
//     } else {
//       res.status(404).json({ status: false, error: "no records found" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getOrdersByDate = async (req, res) => {
//   try {
//     const merchantId = req.user.m_id;

//     // Extracting date filter parameters from the request query
//     const { startDate, endDate } = req.query;

//     // Validating the presence of startDate and endDate
//     if (!startDate || !endDate) {
//       return res.status(400).json({
//         status: false,
//         error: "Both startDate and endDate are required",
//       });
//     }

//     // Querying Orders with timestamps within the specified range
//     const Orders = await testPayinOrder.find({
//       m_id: merchantId,
//       createdAt: { $gte: startDate, $lte: endDate },
//     }).sort({ createdAt: -1 });

//     if (Orders.length === 0) {
//       return res.status(404).json({ status: false, error: "no records found" });
//     }

//     // Sending the Orders as the API response
//     res.status(200).json({ status: true, data: Orders });
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };


/* -------------------------------------------------------------------------- */
/*                  NEW CODE WITH LIVE AND TEST MODE FEATURES                 */
/* -------------------------------------------------------------------------- */

const { testPayinOrder, livePayinOrder } = require("../../models/payin/order");

// Helper function to get the correct model based on mode
function getOrderModel(mode) {
  return mode === 'live' ? livePayinOrder : testPayinOrder;
}

// FUNCTION FOR GENERATE ORDERID
function generateOrderId() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const minLength = 18;
  const maxLength = 24;
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  let orderId = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    orderId += characters.charAt(randomIndex);
  }

  return orderId;
}

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const mode = req.query.mode;
       // Check if mode is provided and valid
       if (!mode || (mode !== "test" && mode !== "live")) {
        return res.status(400).json({
          status: false,
          error: "Please select a valid Mode ('test' or 'live')",
        });
      }

    const merchantId = req.user.m_id;
    const { order_amount, order_receipt, order_status } = req.body;

    // Validate request body
    if (!order_amount) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    const OrderModel = getOrderModel(mode);

    // Create new order
    const newOrder = await OrderModel.create({
      order_id: generateOrderId(),
      order_amount,
      order_receipt,
      order_status,
      m_id: merchantId,
    });

    return res.status(201).json({ status: true, message: "Created successfully", data: newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get today's orders
exports.getTodaysOrders = async (req, res) => {
  try {
    const mode = req.query.mode;
        // Check if mode is provided and valid
        if (!mode || (mode !== "test" && mode !== "live")) {
          return res.status(400).json({
            status: false,
            error: "Please select a valid Mode ('test' or 'live')",
          });
        }

    const merchantId = req.user.m_id;
    const OrderModel = getOrderModel(mode);

    // Get today's date
    const today = new Date();
    // Set the time to the beginning of the day (00:00:00)
    today.setHours(0, 0, 0, 0);

    // Get tomorrow's date
    const tomorrow = new Date(today);
    // Set the time to the end of the day (23:59:59)
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);

    // Find orders data for the current user within today's date range
    const Orders = await OrderModel.find({
      m_id: merchantId,
      createdAt: { $gte: today, $lte: tomorrow },
    }).sort({ createdAt: -1 });

    if (Orders.length > 0) {
      res.status(200).json({ status: true, data: Orders });
    } else {
      res.status(404).json({ status: false, error: "No records found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get orders by date
exports.getOrdersByDate = async (req, res) => {
  try {
    const mode = req.query.mode;
        // Check if mode is provided and valid
        if (!mode || (mode !== "test" && mode !== "live")) {
          return res.status(400).json({
            status: false,
            error: "Please select a valid Mode ('test' or 'live')",
          });
        }

    const merchantId = req.user.m_id;
    const OrderModel = getOrderModel(mode);

    // Extracting date filter parameters from the request query
    const { startDate, endDate } = req.query;

    // Validating the presence of startDate and endDate
    if (!startDate || !endDate) {
      return res.status(400).json({
        status: false,
        error: "Both startDate and endDate are required",
      });
    }

    // Querying Orders with timestamps within the specified range
    const Orders = await OrderModel.find({
      m_id: merchantId,
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).sort({ createdAt: -1 });

    if (Orders.length === 0) {
      return res.status(404).json({ status: false, error: "No records found" });
    }

    // Sending the Orders as the API response
    res.status(200).json({ status: true, data: Orders });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
