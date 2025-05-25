import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002';

const IssueCertificatePage = () => {
  const { currentUser, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [students, setStudents] = useState([]);  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    universityName: '',
    universityEmail: '',
    major: '',
    departmentName: '',
    cgpa: '',
    dateOfIssue: new Date().toISOString().split('T')[0],
    certificateId: `CERT-${Date.now().toString()}`
  });

  useEffect(() => {
    // Fetch registered students
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${API_URL}/api/university/students`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        
        if (response.ok) {
          setStudents(data.students || []);
        }
      } catch (error) {
        console.error('Error fetching students', error);
      }
    };

    // Set university information from current user
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        universityName: currentUser.name || '',
        universityEmail: currentUser.email || ''
      }));
    }

    fetchStudents();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/university/issue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to issue certificate');
      }

      setSuccess(true);
      
      // Clear form
      setFormData({
        studentName: '',
        studentEmail: '',
        universityName: currentUser ? currentUser.name : '',
        universityEmail: currentUser ? currentUser.email : '',
        major: '',
        departmentName: '',
        cgpa: '',
        dateOfIssue: new Date().toISOString().split('T')[0],
        certificateId: `CERT-${Date.now().toString()}`
      });      // Navigate to success page after 2 seconds
      setTimeout(() => {
        navigate(`/university/certificates/${data.certificate?._id || data.certificate?.certificateId || ''}`);
      }, 2000);
    } catch (error) {
      setError(error.message || 'An error occurred while issuing certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Body className="p-4">
          <h2 className="mb-4">Issue New Certificate</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">Certificate issued successfully!</Alert>}
          
          <Form onSubmit={handleSubmit}>            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Student Email</Form.Label>
                  <Form.Select
                    name="studentEmail"
                    value={formData.studentEmail}
                    onChange={(e) => {
                      const selectedStudent = students.find(s => s.email === e.target.value);
                      setFormData(prev => ({
                        ...prev,
                        studentEmail: e.target.value,
                        studentName: selectedStudent ? selectedStudent.name : ''
                      }));
                    }}
                    required
                  >
                    <option value="">Select a student</option>
                    {students.map((student) => (
                      <option key={student._id} value={student.email}>
                        {student.name} ({student.email})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Student Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    required
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Major</Form.Label>
                  <Form.Control
                    type="text"
                    name="major"
                    placeholder="e.g. Computer Science"
                    value={formData.major}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Department Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="departmentName"
                    placeholder="e.g. School of Computing"
                    value={formData.departmentName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>CGPA</Form.Label>
                  <Form.Control
                    type="text"
                    name="cgpa"
                    placeholder="e.g. 3.8/4.0"
                    value={formData.cgpa}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date of Issue</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfIssue"
                    value={formData.dateOfIssue}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
              <Form.Group className="mb-3">
              <Form.Label>Certificate ID</Form.Label>
              <Form.Control
                type="text"
                name="certificateId"
                value={formData.certificateId}
                onChange={handleChange}
                required
              />
            </Form.Group>
              {/* Removed additional notes as it's not in the backend model */}
            
            <div className="d-flex justify-content-between mt-4">
              <Button 
                variant="secondary" 
                onClick={() => navigate('/university/dashboard')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                    Issuing Certificate...
                  </>
                ) : 'Issue Certificate'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default IssueCertificatePage;
