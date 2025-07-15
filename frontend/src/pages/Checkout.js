// frontend/src/pages/Checkout.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';
import api from '../api';
import '../styles/Custom.css';

const Checkout = () => {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1) Fetch all rentals, compute total
  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const res = await api.get('/rentals');
        const sum = res.data.reduce((acc, r) => acc + r.rent_amount, 0);
        setTotal(sum);
      } catch (err) {
        console.error(err);
        setError('Failed to load rental total');
      }
    };
    fetchTotal();
  }, []);

  // 2) Handle Razorpay checkout
  const handleRazorpay = async () => {
    setLoading(true);
    try {
      const orderRes = await api.post('/payment/create-order', { total });
      const { orderId, key, amount, currency } = orderRes.data;

      const options = {
        key,
        amount,
        currency: currency || 'INR',
        name: 'The Reading Room',
        description: 'Book Rental Payment',
        order_id: orderId,
        handler: async (response) => {
          alert('Payment successful: ' + response.razorpay_payment_id);
          // Mark all pending rentals paid
          await api.patch('/rentals/pay-all');
          // Redirect to Books page
          window.location.href = '/books';
        },
        theme: { color: '#2c7be5' }
      };

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => new window.Razorpay(options).open();
      document.body.appendChild(script);

    } catch (err) {
      console.error(err);
      alert('Payment setup failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="page-bg">
        <AppNavbar />
        <Container className="py-5">
          <Alert variant="danger">{error}</Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-bg">
      <AppNavbar />
      <Container className="py-5">
        <Card className="p-4 bg-white bg-opacity-75 text-center">
          <h2 className="mb-3">Checkout</h2>
          <p><strong>Total: </strong>₹{total}</p>
          <Button
            onClick={handleRazorpay}
            disabled={loading || total === 0}
          >
            {loading
              ? <Spinner animation="border" size="sm" />
              : `Pay ₹${total}`}
          </Button>
        </Card>
      </Container>
    </div>
  );
};

export default Checkout;
