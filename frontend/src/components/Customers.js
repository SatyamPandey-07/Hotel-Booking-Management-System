import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Input, Alert, LoadingSpinner, Modal } from './ui';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [editCustomer, setEditCustomer] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/customers');
      
      // Handle both old and new API response formats
      if (response.data.customers) {
        setCustomers(response.data.customers);
      } else {
        setCustomers(response.data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      showAlert('Failed to fetch customers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (customer) => {
    const newErrors = {};
    
    if (!customer.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!customer.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Za-z0-9+_.-]+@(.+)$/.test(customer.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!customer.password || customer.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditCustomer(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm(newCustomer)) {
      return;
    }
    
    try {
      setSubmitLoading(true);
      const response = await axios.post('/api/customers', newCustomer);
      
      setNewCustomer({ name: '', email: '', password: '' });
      setShowForm(false);
      setErrors({});
      fetchCustomers();
      
      const message = response.data.message || 'Customer added successfully!';
      showAlert(message, 'success');
    } catch (error) {
      console.error('Error adding customer:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Error adding customer';
      showAlert(errorMessage, 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (customer) => {
    setEditCustomer({ ...customer });
    setShowEditModal(true);
    setErrors({});
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm(editCustomer)) {
      return;
    }
    
    try {
      setSubmitLoading(true);
      const response = await axios.put(`/api/customers/${editCustomer.id}`, editCustomer);
      
      setShowEditModal(false);
      setEditCustomer(null);
      setErrors({});
      fetchCustomers();
      
      const message = response.data.message || 'Customer updated successfully!';
      showAlert(message, 'success');
    } catch (error) {
      console.error('Error updating customer:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Error updating customer';
      showAlert(errorMessage, 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        const response = await axios.delete(`/api/customers/${id}`);
        fetchCustomers();
        
        const message = response.data.message || 'Customer deleted successfully!';
        showAlert(message, 'success');
      } catch (error) {
        console.error('Error deleting customer:', error);
        const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Error deleting customer';
        showAlert(errorMessage, 'error');
      }
    }
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="header">
        <h1>Customer Management</h1>
        <p>Manage customer profiles and information</p>
      </div>
      
      {alert && (
        <Alert type={alert.type} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}
      
      <Card
        title="Customers"
        actions={
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add New Customer'}
          </Button>
        }
      >
        <div className="flex gap-md" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div style={{ flex: 1 }}>
            <Input
              placeholder="Search customers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {showForm && (
          <div className="form-container">
            <h3>Add New Customer</h3>
            <form onSubmit={handleSubmit}>
              <Input
                label="Name"
                name="name"
                value={newCustomer.name}
                onChange={handleInputChange}
                required
                error={errors.name}
              />
              <Input
                label="Email"
                type="email"
                name="email"
                value={newCustomer.email}
                onChange={handleInputChange}
                required
                error={errors.email}
              />
              <Input
                label="Password"
                type="password"
                name="password"
                value={newCustomer.password}
                onChange={handleInputChange}
                required
                error={errors.password}
              />
              <div className="flex gap-sm">
                <Button type="submit" loading={submitLoading}>
                  Add Customer
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
        
        <div style={{ marginTop: 'var(--spacing-lg)' }}>
          {loading ? (
            <div className="flex-center" style={{ padding: 'var(--spacing-xl)' }}>
              <LoadingSpinner size="large" />
              <span style={{ marginLeft: 'var(--spacing-sm)' }}>Loading customers...</span>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center" style={{ padding: 'var(--spacing-xl)', color: 'var(--gray-500)' }}>
              {searchTerm ? 'No customers found matching your search.' : 'No customers found.'}
            </div>
          ) : (
            <div className="grid gap-md">
              {filteredCustomers.map(customer => (
                <div key={customer.id} className="list-item">
                  <div className="list-item-header">
                    <div className="list-item-content">
                      <div className="list-item-title">{customer.name}</div>
                      <div className="list-item-subtitle">{customer.email}</div>
                      <div className="list-item-subtitle">ID: {customer.id}</div>
                    </div>
                    <div className="list-item-actions">
                      <Button 
                        variant="outline" 
                        size="small"
                        onClick={() => handleEdit(customer)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="danger" 
                        size="small"
                        onClick={() => handleDelete(customer.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
      
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Customer"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSubmit} loading={submitLoading}>
              Update Customer
            </Button>
          </>
        }
      >
        {editCustomer && (
          <form onSubmit={handleUpdateSubmit}>
            <Input
              label="Name"
              name="name"
              value={editCustomer.name}
              onChange={handleEditInputChange}
              required
              error={errors.name}
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={editCustomer.email}
              onChange={handleEditInputChange}
              required
              error={errors.email}
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={editCustomer.password}
              onChange={handleEditInputChange}
              required
              error={errors.password}
            />
          </form>
        )}
      </Modal>
    </div>
  );
}

export default Customers;