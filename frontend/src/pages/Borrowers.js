import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import api from '../api';
import AppNavbar from '../components/Navbar';
import '../styles/Custom.css'; 

const Borrowers = () => {
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode]           = useState('add');
  const [cur, setCur]             = useState({ first_name:'', last_name:'', email:'', phone_number:'', id:'' });

  const token = localStorage.getItem('token');
  let decoded = {};
  if (token) {
    try { decoded = JSON.parse(atob(token.split('.')[1])); } catch {}
  }
  const role = decoded.role || 'member';
  const userEmail = decoded.email;
  const isAdmin = role === 'admin' || role === 'librarian';

  useEffect(() => {
    api.get('/borrowers')
      .then(res => {
        const data = res.data;
        setBorrowers(isAdmin ? data : data.filter(b => b.email === userEmail));
      })
      .catch(()=>setError('Failed to fetch borrowers'))
      .finally(()=>setLoading(false));
  }, [isAdmin, userEmail]);

  const save = async e => {
    e.preventDefault();
    try {
      const payload = {
        first_name: cur.first_name,
        last_name: cur.last_name,
        email: cur.email,
        phone_number: cur.phone_number
      };
      let res;
      if (mode === 'add') {
        res = await api.post('/borrowers', payload);
        setBorrowers(bs => [...bs, res.data]);
      } else {
        res = await api.put(`/borrowers/${cur.id}`, payload);
        setBorrowers(bs => bs.map(x => x._id===cur.id ? res.data : x));
      }
      setShowModal(false);
    } catch {
      setError('Operation failed');
    }
  };

  const remove = async id => {
    if(!window.confirm('Delete this borrower?')) return;
    try {
      await api.delete(`/borrowers/${id}`);
      setBorrowers(bs => bs.filter(x => x._id!==id));
    } catch {
      setError('Delete failed');
    }
  };

  if (loading) return <Container className="text-center mt-5"><Spinner /></Container>;

  return (
     <div className="page-bg">
       <AppNavbar />
    <Container>
      <Row className="mb-3">
        <Col><h2 className="text-light">Borrowers</h2></Col>
        {isAdmin && <Col className="text-end"><Button onClick={()=>{setMode('add'); setCur({first_name:'',last_name:'',email:'',phone_number:'',id:''}); setShowModal(true);}}>Add Borrower</Button></Col>}
      </Row>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table bordered hover>
        <thead>
          <tr>
            <th>First Name</th><th>Last Name</th><th>Email</th><th>Phone</th>{isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {borrowers.map(b => (
            <tr key={b._id}>
              <td>{b.first_name}</td><td>{b.last_name}</td><td>{b.email}</td><td>{b.phone_number}</td>
              {isAdmin && (
                <td>
                  <Button size="sm" onClick={()=>{setMode('edit'); setCur({first_name:b.first_name,last_name:b.last_name,email:b.email,phone_number:b.phone_number,id:b._id}); setShowModal(true);}}>Edit</Button>{' '}
                  <Button size="sm" variant="danger" onClick={()=>remove(b._id)}>Delete</Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={()=>setShowModal(false)}>
        <Form onSubmit={save}>
          <Modal.Header closeButton>
            <Modal.Title>{mode==='add'?'Add Borrower':'Edit Borrower'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control value={cur.first_name} onChange={e=>setCur({...cur,first_name:e.target.value})} required/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control value={cur.last_name} onChange={e=>setCur({...cur,last_name:e.target.value})} required/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={cur.email} onChange={e=>setCur({...cur,email:e.target.value})} required/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control value={cur.phone_number} onChange={e=>setCur({...cur,phone_number:e.target.value})} required/>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={()=>setShowModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary">{mode==='add'?'Create':'Update'} Borrower</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
    </div>
  );
};

export default Borrowers;
