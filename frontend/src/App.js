// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Welcome from './pages/Welcome';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import Authors from './pages/Authors';
import Books from './pages/Books';
import Categories from './pages/Categories';
import Borrowers from './pages/Borrowers';
import Rentals from './pages/Rental';
import Checkout from './pages/Checkout';


import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Welcome />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/authors"
        element={
          <ProtectedRoute>
            <Authors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/books"
        element={
          <ProtectedRoute>
            <Books />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <Categories />
          </ProtectedRoute>
        }
      />
      <Route
        path="/borrowers"
        element={
          <ProtectedRoute>
            <Borrowers />
          </ProtectedRoute>
        }
      />

           <Route 
        path="/rentals" 
        element={
        <ProtectedRoute>
          <Rentals/>
          </ProtectedRoute>
        } 
        />
      <Route 
      path="/checkout" 
      element={
      <ProtectedRoute>
        <Checkout/>
        </ProtectedRoute>
      } 
      />

      {/* Catch-all: redirect unknown paths to home */}
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
   

    </Routes>
  );
}

export default App;
