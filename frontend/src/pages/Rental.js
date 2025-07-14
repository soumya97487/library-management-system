// frontend/src/pages/Rentals.js
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import AppNavbar from '../components/Navbar';
import '../styles/Custom.css'; 

const Rentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  // ← add this

  // Fetch rentals on mount
  useEffect(() => {
    api.get('/rentals')
      .then(res => setRentals(res.data))
      .finally(() => setLoading(false));
  }, []);

  // Total amount
  const total = rentals.reduce((sum, r) => sum + r.rent_amount, 0);

  // Remove handler (existing)
  const removeRental = async (id) => {
    if (!window.confirm('Are you sure you want to remove this rental?')) return;
    try {
      await api.delete(`/rentals/${id}`);
      setRentals(rs => rs.filter(r => r._id !== id));
    } catch {
      alert('Failed to remove rental');
    }
  };

  if (loading) {
    return (
      <div className="page-bg">
        <Container className="text-center mt-5">
          <Spinner />
        </Container>
      </div>
    );
  }

  return (
    <div className="page-bg">
      <AppNavbar />
      <Container className="py-5">
        <h2 className="text-light mb-4">Your Rentals</h2>
        <Table striped bordered hover className="bg-white bg-opacity-75">
          <thead>
            <tr>
              <th>Book</th>
              <th>Months</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map(r => (
              <tr key={r._id}>
                <td>{r.book.title}</td>
                <td>{r.rent_months}</td>
                <td>₹{r.rent_amount}</td>
                <td>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => removeRental(r._id)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={2}><strong>Total</strong></td>
              <td><strong>₹{total}</strong></td>
              <td></td>
            </tr>
          </tbody>
        </Table>

        {/* Use navigate() instead of window.location */}
        <div className="mt-3">
          <Button onClick={() => navigate('/checkout')}>
            Proceed to Pay
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default Rentals;
