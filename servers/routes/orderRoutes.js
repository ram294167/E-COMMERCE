const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db'); // Shared DB connection

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});
const upload = multer({ storage });

// API endpoint for creating an order
router.post('/api/orders', upload.single('paymentProof'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No payment proof file uploaded.' });
    }

const { address, items, totalPrice, transactionId, userId } = req.body;
if (!userId) {
  return res.status(400).json({ error: 'User ID is required.' });
}



    // Validate & parse JSON data
    let addressObj, itemsArray;
    try {
      addressObj = JSON.parse(address);
      itemsArray = JSON.parse(items);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid JSON data in address or items.' });
    }

    // Ensure items are present
    if (!itemsArray.length) {
      return res.status(400).json({ error: 'No items provided for the order.' });
    }

    const paymentProofUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    

    // **Log Data Before Inserting**
    console.log('Order Data Before Insertion:', {
      userId,
      address: addressObj,
      transactionId,
      paymentProofUrl,
      totalPrice
    });

    // Insert order into `orders` table
    const orderQuery = `
      INSERT INTO orders (user_id, address, transaction_id, payment_proof_url, total_amount)
      VALUES (?, ?, ?, ?, ?) RETURNING id
    `;

    db.query(orderQuery, [
      userId, JSON.stringify(addressObj), transactionId, paymentProofUrl, totalPrice
    ], (err, orderResult) => {
      if (err) {
        console.error('❌ Error inserting order:', err);
        return res.status(500).json({ error: 'Server error while creating order.' });
      }

      const orderId = orderResult[0].id;

      // Prepare order items data
      const orderItemsValues = itemsArray.flatMap(item => [
        orderId, item.id, item.quantity, item.cost
      ]);

      // **Log Order Items Before Inserting**
      console.log('Order Items Before Insertion:', orderItemsValues);

      // Insert order items into `order_items` table
      const itemsQuery = `
        INSERT INTO order_items (order_id, item_id, quantity, price)
        VALUES ${itemsArray.map(() => '(?, ?, ?, ?)').join(', ')}
      `;

      db.query(itemsQuery, orderItemsValues, (err) => {
        if (err) {
          console.error('❌ Error inserting order items:', err);
          return res.status(500).json({ error: 'Server error while inserting order items.' });
        }

        console.log('Final Order ID to return:', orderId);
        res.json({ orderId: orderId, message: 'Order placed successfully!' });
      });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while processing order.' });
  }
});

module.exports = router;
