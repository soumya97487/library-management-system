import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import '../styles/Custom.css'; 

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <Container className="vh-100 d-flex align-items-center justify-content-center">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={5}>
          <Card className="text-center p-4 shadow rounded-4">
            <Card.Body>
              <h1 className="mb-4 text-primary">The Reading Room</h1>
              <p className="mb-4 text-muted">Welcome to our Library Management System</p>
              <div className="d-grid gap-3">
                <Button variant="primary" size="lg" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button variant="outline-primary" size="lg" onClick={() => navigate('/signup')}>
                  Signup
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Welcome;
