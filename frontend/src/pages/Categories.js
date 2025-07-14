import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import api from '../api';
import AppNavbar from '../components/Navbar';
import '../styles/Custom.css'; 

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode]           = useState('add');
  const [cur, setCur]             = useState({ name: '', description: '', id: '' });

  const token = localStorage.getItem('token');
  let role = 'member';
  if (token) {
    try { role = JSON.parse(atob(token.split('.')[1])).role; } catch {}
  }
  const isAdmin = role === 'admin' || role === 'librarian';

  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(() => setError('Failed to fetch categories'))
      .finally(() => setLoading(false));
  }, []);

  const save = async e => {
    e.preventDefault();
    try {
      const payload = { name: cur.name, description: cur.description };
      let res;
      if (mode === 'add') {
        res = await api.post('/categories', payload);
        setCategories(cs => [...cs, res.data]);
      } else {
        res = await api.put(`/categories/${cur.id}`, payload);
        setCategories(cs => cs.map(x => x._id === cur.id ? res.data : x));
      }
      setShowModal(false);
    } catch {
      setError('Operation failed');
    }
  };

  const remove = async id => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories(cs => cs.filter(x => x._id !== id));
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
        <Col><h2 className="text-light">Categories</h2></Col>
        {isAdmin && <Col className="text-end"><Button onClick={()=>{setMode('add'); setCur({name:'',description:'',id:''}); setShowModal(true);}}>Add Category</Button></Col>}
      </Row>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table bordered hover>
        <thead>
          <tr><th>Name</th><th>Description</th>{isAdmin && <th>Actions</th>}</tr>
        </thead>
        <tbody>
          {categories.map(c => (
            <tr key={c._id}>
              <td>{c.name}</td><td>{c.description}</td>
              {isAdmin && (
                <td>
                  <Button size="sm" onClick={()=>{setMode('edit'); setCur({name:c.name,description:c.description,id:c._id}); setShowModal(true);}}>Edit</Button>{' '}
                  <Button size="sm" variant="danger" onClick={()=>remove(c._id)}>Delete</Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={()=>setShowModal(false)}>
        <Form onSubmit={save}>
          <Modal.Header closeButton>
            <Modal.Title>{mode === 'add' ? 'Add Category' : 'Edit Category'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control value={cur.name} onChange={e=>setCur({...cur,name:e.target.value})} required/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={cur.description} onChange={e=>setCur({...cur,description:e.target.value})} required/>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={()=>setShowModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary">{mode === 'add' ? 'Create' : 'Update'} Category</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
    </div>
  );
};

export default Categories;
