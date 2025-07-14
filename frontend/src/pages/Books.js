// frontend/src/pages/Books.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Spinner,
  InputGroup,
  FormControl
} from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import AppNavbar from '../components/Navbar';
import '../styles/Custom.css';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState('idle'); // 'rent', 'add', 'edit'
  const [current, setCurrent] = useState({
    bookId: '',
    title: '',
    months: 1,
    amount: 50
  });

  const navigate = useNavigate();
  const fileInputRefs = useRef({});
  const [uploading, setUploading] = useState(false);

  // Determine user role
  const token = localStorage.getItem('token');
  let role = 'member';
  if (token) {
    try { role = JSON.parse(atob(token.split('.')[1])).role; } catch {}
  }
  const isMember = role === 'member';
  const isAdmin = role === 'admin' || role === 'librarian';

  // Fetch books
  useEffect(() => {
    api.get('/books')
      .then(res => {
        setBooks(res.data);
        setFiltered(res.data);
      })
      .catch(() => setError('Failed to fetch books'))
      .finally(() => setLoading(false));
  }, []);

  // Search handler
  const handleSearch = e => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return setFiltered(books);
    setFiltered(
      books.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.categories.some(c => c.name.toLowerCase().includes(q))
      )
    );
  };

  // Rent flows
  const openRent = book => {
    setMode('rent');
    setCurrent({ bookId: book._id, title: book.title, months: 1, amount: 50 });
    setShowModal(true);
  };
  const confirmRent = async () => {
    try {
      await api.post('/rentals', { bookId: current.bookId, months: current.months });
      setShowModal(false);
      navigate('/rentals');
    } catch {
      alert('Rental failed');
    }
  };

  // PDF upload handler
  const handlePdfChange = async (bookId, file) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      await api.post(`/books/${bookId}/pdf`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('PDF uploaded successfully!');
      // Refresh list so the View button appears
      const res = await api.get('/books');
      setBooks(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
      alert('PDF upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploading(false);
    }
  };

  // PDF view handler (includes JWT in header)
  const viewPdf = async (bookId) => {
    try {
      const res = await api.get(`/books/${bookId}/pdf/download`, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      window.open(url, '_blank');
    } catch (err) {
      console.error('Failed to fetch PDF:', err);
      alert('Unable to load PDF');
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
        <Row className="align-items-center mb-3">
          <Col><h2 className="text-light">Books</h2></Col>
          {isAdmin && (
            <Col className="text-end">
              <Button onClick={() => {/* openAdd logic */}}>Add Book</Button>
            </Col>
          )}
        </Row>

        <Form onSubmit={handleSearch} className="mb-4">
          <InputGroup>
            <FormControl
              placeholder="Search by title or category..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <Button type="submit"><FaSearch /></Button>
          </InputGroup>
        </Form>

        {error && <Alert variant="danger">{error}</Alert>}

        <Table striped bordered hover className="bg-white bg-opacity-75">
          <thead>
            <tr>
              <th>Title</th>
              <th>Authors</th>
              <th>Publisher</th>
              <th>Categories</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center">No results found.</td></tr>
            ) : filtered.map(book => {
              if (!fileInputRefs.current[book._id]) {
                fileInputRefs.current[book._id] = React.createRef();
              }
              return (
                <tr key={book._id}>
                  <td>{book.title}</td>
                  <td>{book.authors.map(a => a.name).join(', ')}</td>
                  <td>{book.publisher}</td>
                  <td>{book.categories.map(c => c.name).join(', ')}</td>
                  <td className="text-center">
                    {isMember && mode === 'idle' && (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => openRent(book)}
                      >
                        Rent
                      </Button>
                    )}
                    {isAdmin && mode === 'idle' && (
                      <>
                        <Button size="sm" onClick={() => {/* edit logic */}}>Edit</Button>{' '}
                        <Button size="sm" variant="danger" onClick={() => {/* delete logic */}}>Delete</Button>{' '}

                        {book.pdf?.fileId ? (
                          <Button
                            size="sm"
                            variant="outline-success"
                            onClick={() => viewPdf(book._id)}
                          >
                            View PDF
                          </Button>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline-secondary"
                              disabled={uploading}
                              onClick={() => fileInputRefs.current[book._id].current.click()}
                            >
                              {uploading ? 'Uploading…' : 'Upload PDF'}
                            </Button>
                            <input
                              type="file"
                              accept="application/pdf"
                              ref={fileInputRefs.current[book._id]}
                              style={{ display: 'none' }}
                              onChange={e => handlePdfChange(book._id, e.target.files[0])}
                            />
                          </>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Form onSubmit={mode === 'rent' ? e => { e.preventDefault(); confirmRent(); } : null}>
          <Modal.Header closeButton>
            <Modal.Title>Rent "{current.title}"</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Months</Form.Label>
              <Form.Select
                value={current.months}
                onChange={e => {
                  const m = Number(e.target.value);
                  setCurrent({ ...current, months: m, amount: m * 50 });
                }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <p className="fw-bold">Amount: ₹{current.amount}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Confirm Rent</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Books;
