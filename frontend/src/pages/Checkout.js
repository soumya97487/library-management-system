import React, { useState } from 'react';
import { Container, Card, Button, Form } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';
import '../styles/Custom.css';  

const Checkout = () => {
  const [method, setMethod] = useState('razorpay');

  const pay = () => {
    if (method === 'razorpay') {
      // integrate razorpay here
      alert('Razorpay checkout placeholder');
    } else {
      alert('Cash on Delivery selected. Rentals confirmed!');
    }
  };

  return (
    <div className="page-bg">
      <AppNavbar />
      <Container className="py-5">
        <Card className="p-4 bg-white bg-opacity-75">
          <h2 className="text-center mb-4">Checkout</h2>
          <Form>
            <Form.Check
              type="radio"
              label="Razorpay"
              name="payment"
              id="razorpay"
              checked={method==='razorpay'}
              onChange={()=>setMethod('razorpay')}
            />
            <Form.Check
              type="radio"
              label="Cash on Delivery"
              name="payment"
              id="cod"
              checked={method==='cod'}
              onChange={()=>setMethod('cod')}
            />
          </Form>
          <div className="text-center mt-4">
            <Button onClick={pay}>Pay Now</Button>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default Checkout;