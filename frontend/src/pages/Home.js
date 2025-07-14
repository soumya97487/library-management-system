import React from 'react';
import AppNavbar from '../components/Navbar';
import { Container, Card } from 'react-bootstrap';
import '../styles/Custom.css'; 

const Home = () => {
  return (
    <div className="page-bg">
      <AppNavbar />
      <Container className="py-5">
        <Card className="p-4 shadow-sm bg-white bg-opacity-75">
          <h2 className="text-center text-primary mb-3">Welcome to The Reading Room</h2>
          <p>
            <strong>The Reading Room</strong> is a cozy physical library located in the heart of our community. We house a
            vast collection of books across genres—fiction, non-fiction, academic texts, and more. Our welcoming reading
            spaces offer a quiet sanctuary for book lovers of all ages.
          </p>
          <p>
            This <em>Library Management System</em> website enables patrons and staff to easily explore our resources:
          </p>
          <ul>
            <li><strong>Browse Authors, Books, and Categories:</strong> Discover titles and authors in our catalog.</li>
            <li><strong>Manage Borrowers and Loans:</strong> Staff can add, update, and track loans; members can view their own loan status.</li>
            <li><strong>Role-Based Access:</strong> Administrators and librarians have full CRUD controls; members have read-only access.</li>
            <li><strong>Email Verification:</strong> Secure signup with email verification to ensure valid accounts.</li>
          </ul>
          <p className="text-center mt-3">
            Use the navigation above to get started or logout when you’re done. Happy reading!
          </p>
        </Card>
      </Container>
    </div>
  );
};

export default Home;
