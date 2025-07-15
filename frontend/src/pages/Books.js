// frontend/src/pages/Books.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Row, Col, Table, Button,
  Modal, Form, Alert, Spinner,
  InputGroup, FormControl
} from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import AppNavbar from '../components/Navbar';
import '../styles/Custom.css';

const Books = () => {
  const [books, setBooks]       = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent]   = useState({ bookId:'', title:'', months:1, amount:50 });
  const [uploading, setUploading] = useState(false);
  const fileRefs = useRef({});
  const navigate = useNavigate();

  // Role decode
  const token = localStorage.getItem('token');
  let role='member';
  if(token) {
    try { role = JSON.parse(atob(token.split('.')[1])).role; } catch{}
  }
  const isMember = role==='member';
  const isAdmin  = role==='admin'||role==='librarian';

  // Fetch books
  useEffect(()=>{
    api.get('/books')
      .then(r=>{ setBooks(r.data); setFiltered(r.data); })
      .catch(()=>setError('Failed to fetch books'))
      .finally(()=>setLoading(false));
  },[]);

  // Search
  const [q, setQ] = useState('');
  const onSearch = e => {
    e.preventDefault();
    const t = q.trim().toLowerCase();
    setFiltered(t
      ? books.filter(b=>
          b.title.toLowerCase().includes(t) ||
          b.categories.some(c=>c.name.toLowerCase().includes(t))
        )
      : books
    );
  };

  // Rent
  const openRent = book => {
    setCurrent({ bookId:book._id, title:book.title, months:1, amount:50 });
    setShowModal(true);
  };
  const confirmRent = async() => {
    await api.post('/rentals',{ bookId:current.bookId, months:current.months });
    setShowModal(false); navigate('/rentals');
  };

  // Upload PDF
  const onPdf = async (id,file) => {
    setUploading(true);
    const fd=new FormData(); fd.append('pdf',file);
    await api.post(`/books/${id}/pdf`,fd,{ headers:{'Content-Type':'multipart/form-data'} });
    const r=await api.get('/books'); setBooks(r.data); setFiltered(r.data);
    setUploading(false);
  };

  // View PDF
  const viewPdf = async id => {
    const res = await api.get(`/books/${id}/pdf/download`,{ responseType:'blob' });
    const url = URL.createObjectURL(new Blob([res.data],{ type:'application/pdf' }));
    window.open(url,'_blank');
  };

  if(loading) return <Container className="text-center mt-5"><Spinner/></Container>;

  return (
    <div className="page-bg">
      <AppNavbar/>
      <Container className="py-5">
        <Row className="mb-3 align-items-center">
          <Col><h2 className="text-light">Books</h2></Col>
          {isAdmin&&<Col className="text-end"><Button>Add Book</Button></Col>}
        </Row>
        <Form onSubmit={onSearch} className="mb-4">
          <InputGroup>
            <FormControl placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)}/>
            <Button type="submit"><FaSearch/></Button>
          </InputGroup>
        </Form>
        {error&&<Alert variant="danger">{error}</Alert>}
        <Table striped bordered hover className="bg-white bg-opacity-75">
          <thead><tr>
            <th>Title</th><th>Authors</th><th>Publisher</th><th>Categories</th><th className="text-center">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map(b=>{
              if(!fileRefs.current[b._id]) fileRefs.current[b._id]=React.createRef();
              const rent = b.rental?.[0];
              const paid = rent?.status==='paid';
              return (
                <tr key={b._id}>
                  <td>{b.title}</td>
                  <td>{b.authors.map(a=>a.name).join(', ')}</td>
                  <td>{b.publisher}</td>
                  <td>{b.categories.map(c=>c.name).join(', ')}</td>
                  <td className="text-center">
                    {isMember && 
                      (paid
                        ? <Button size="sm" variant="outline-success" onClick={()=>viewPdf(b._id)}>View PDF</Button>
                        : <Button size="sm" variant="outline-primary" onClick={()=>openRent(b)}>Rent</Button>
                      )
                    }
                    {isAdmin &&
                      <>
                        <Button size="sm">Edit</Button>{' '}
                        <Button size="sm" variant="danger">Delete</Button>{' '}
                        {b.pdf?.fileId
                          ? <Button size="sm" variant="outline-success" onClick={()=>viewPdf(b._id)}>View PDF</Button>
                          : <>
                              <Button
                                size="sm"
                                variant="outline-secondary"
                                disabled={uploading}
                                onClick={()=>fileRefs.current[b._id].current.click()}
                              >
                                {uploading?'Uploading…':'Upload PDF'}
                              </Button>
                              <input
                                type="file" accept="application/pdf"
                                ref={fileRefs.current[b._id]} style={{display:'none'}}
                                onChange={e=>onPdf(b._id,e.target.files[0])}
                              />
                            </>
                        }
                      </>
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>

      <Modal show={showModal} onHide={()=>setShowModal(false)} centered>
        <Form onSubmit={e=>{e.preventDefault();confirmRent();}}>
          <Modal.Header closeButton>
            <Modal.Title>Rent "{current.title}"</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Months</Form.Label>
              <Form.Select
                value={current.months}
                onChange={e=>setCurrent({...current,months:+e.target.value,amount:+e.target.value*50})}
              >
                {Array.from({length:12},(_,i)=>i+1).map(m=>(
                  <option key={m} value={m}>{m}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <p className="fw-bold">Amount: ₹{current.amount}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={()=>setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Confirm Rent</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Books;
