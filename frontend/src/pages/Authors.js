// src/pages/Authors.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import api from '../api';
import AppNavbar from '../components/Navbar';
import '../styles/Custom.css'; 

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState('add');
  const [current, setCurrent] = useState({ name: '', bio: '', id: '' });

  // decode role
  const token = localStorage.getItem('token');
  let role = 'member';
  if (token) {
    try { role = JSON.parse(atob(token.split('.')[1])).role; } catch {};
  }
  const isAdmin = role === 'admin' || role === 'librarian';

  useEffect(() => {
    api.get('/authors')
      .then(res => setAuthors(res.data))
      .catch(() => setError('Failed to fetch authors'))
      .finally(() => setLoading(false));
  }, []);

  const save = async e => {
    e.preventDefault();
    try {
      const payload = { name: current.name, bio: current.bio };
      let res;
      if (mode === 'add') {
        res = await api.post('/authors', payload);
        setAuthors(a => [...a, res.data]);
      } else {
        res = await api.put(`/authors/${current.id}`, payload);
        setAuthors(a => a.map(x => x._id === current.id ? res.data : x));
      }
      setShowModal(false);
    } catch {
      setError('Operation failed');
    }
  };

  const remove = async id => {
    if (!window.confirm('Delete this author?')) return;
    try {
      await api.delete(`/authors/${id}`);
      setAuthors(a => a.filter(x => x._id !== id));
    } catch {
      setError('Delete failed');
    }
  };

  if (loading) return <div className="page-bg"><Container className="text-center mt-5"><Spinner /></Container></div>;

  return (
    <div className="page-bg">
      <AppNavbar />
      <Container className="py-5">
        <Row className="mb-3">
          <Col><h2 className="text-light">Authors</h2></Col>
          {isAdmin && (
            <Col className="text-end">
              <Button variant="primary" onClick={() => { setMode('add'); setCurrent({ name: '', bio: '', id: '' }); setShowModal(true); }}>
                Add Author
              </Button>
            </Col>
          )}
        </Row>
        {error && <Alert variant="danger">{error}</Alert>}
        <Table striped bordered hover className="bg-white bg-opacity-75">
          <thead>
            <tr>
              <th>Name</th>
              <th>Bio</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {authors.map(a => (
              <tr key={a._id}>
                <td>{a.name}</td>
                <td>{a.bio}</td>
                {isAdmin && (
                  <td>
                    <Button size="sm" onClick={() => { setMode('edit'); setCurrent({ name: a.name, bio: a.bio, id: a._id }); setShowModal(true); }}>
                      Edit
                    </Button>{' '}
                    <Button size="sm" variant="danger" onClick={() => remove(a._id)}>
                      Delete
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={save}>
          <Modal.Header closeButton>
            <Modal.Title>{mode === 'add' ? 'Add Author' : 'Edit Author'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={current.name}
                onChange={e => setCurrent({ ...current, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={current.bio}
                onChange={e => setCurrent({ ...current, bio: e.target.value })}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary">
              {mode === 'add' ? 'Create' : 'Update'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Authors;
