async function transferPi(amountInPi, productName) {
  const paymentData = {
    amount: amountInPi,
    memo: `Purchase of ${productName}`,
    metadata: { productId: "item_123" } // Internal ID for your database
  };

  const callbacks = {
    onReadyForServerApproval: function(paymentId) {
      // STEP A: Send paymentId to your BACKEND.
      // Your backend must call Pi's API to 'approve' the payment.
      console.log("Payment created. ID:", paymentId);
      fetch('/api/approve-payment', { 
        method: 'POST', 
        body: JSON.stringify({ paymentId }) 
      });
    },
    onReadyForServerCompletion: function(paymentId, txid) {
      // STEP B: Transaction is on the blockchain!
      // Send txid to your BACKEND to 'complete' the order.
      console.log("Transaction on-chain:", txid);
      fetch('/api/complete-order', { 
        method: 'POST', 
        body: JSON.stringify({ paymentId, txid }) 
      });
    },
    onCancel: function(paymentId) { console.log("User cancelled."); },
    onError: function(error, payment) { console.error("Payment Error", error); }
  };

  Pi.createPayment(paymentData, callbacks);
}
