import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from './ui';

function Home() {
  const features = [
    {
      title: 'Customer Management',
      description: 'Manage customer profiles, contact information, and booking history with advanced search and filtering capabilities.',
      icon: '👥',
      link: '/customers',
      color: 'var(--primary-color)'
    },
    {
      title: 'Hotel Management',
      description: 'Add and manage hotel listings with detailed information, availability, and comprehensive management tools.',
      icon: '🏨',
      link: '/hotels',
      color: 'var(--secondary-color)'
    },
    {
      title: 'Booking Management',
      description: 'Handle reservations, view booking details, manage check-ins with real-time updates and notifications.',
      icon: '📝',
      link: '/bookings',
      color: 'var(--info-color)'
    }
  ];

  const stats = [
    { label: 'Total Features', value: '15+', color: 'var(--primary-color)' },
    { label: 'Components', value: '20+', color: 'var(--secondary-color)' },
    { label: 'API Endpoints', value: '12+', color: 'var(--info-color)' },
    { label: 'UI Components', value: '7', color: 'var(--warning-color)' }
  ];

  return (
    <div>
      <div className="header">
        <h1>Hotel Booking Management System</h1>
        <p>Welcome to our comprehensive, modern hotel booking platform with advanced features</p>
      </div>
      
      {/* Stats Section */}
      <Card>
        <h2>System Overview</h2>
        <div className="grid grid-auto-fit gap-lg" style={{ marginTop: 'var(--spacing-lg)' }}>
          {stats.map((stat, index) => (
            <div key={index} className="text-center" style={{ 
              padding: 'var(--spacing-lg)', 
              borderRadius: 'var(--radius-lg)',
              background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`,
              border: `2px solid ${stat.color}30`
            }}>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: stat.color,
                marginBottom: 'var(--spacing-sm)'
              }}>
                {stat.value}
              </div>
              <div style={{ color: 'var(--gray-600)', fontWeight: '500' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Features Section */}
      <Card>
        <h2>Core Features</h2>
        <div className="grid grid-auto-fit gap-lg" style={{ marginTop: 'var(--spacing-lg)' }}>
          {features.map((feature, index) => (
            <div key={index} style={{ 
              padding: 'var(--spacing-xl)', 
              border: '2px solid var(--gray-200)', 
              borderRadius: 'var(--radius-lg)',
              background: 'white',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            className="feature-card"
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: feature.color
              }} />
              
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: 'var(--spacing-md)',
                textAlign: 'center'
              }}>
                {feature.icon}
              </div>
              
              <h3 style={{ 
                color: feature.color,
                textAlign: 'center',
                marginBottom: 'var(--spacing-md)'
              }}>
                {feature.title}
              </h3>
              
              <p style={{ 
                color: 'var(--gray-600)',
                lineHeight: '1.6',
                marginBottom: 'var(--spacing-lg)',
                textAlign: 'center'
              }}>
                {feature.description}
              </p>
              
              <div style={{ textAlign: 'center' }}>
                <Link to={feature.link} style={{ textDecoration: 'none' }}>
                  <Button variant="outline">
                    Explore {feature.title}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Quick Start Section */}
      <Card>
        <h2>Quick Start Guide</h2>
        <div className="grid grid-cols-1" style={{ gap: 'var(--spacing-lg)', marginTop: 'var(--spacing-lg)' }}>
          <div style={{ 
            background: 'var(--gray-50)',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-md)',
            borderLeft: '4px solid var(--primary-color)'
          }}>
            <h3 style={{ color: 'var(--primary-color)', margin: '0 0 var(--spacing-sm) 0' }}>Getting Started</h3>
            <p style={{ margin: '0', color: 'var(--gray-700)' }}>Use the navigation menu above to access different sections of the hotel booking system.</p>
          </div>
          
          <div className="grid grid-cols-1" style={{ gap: 'var(--spacing-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
              <div style={{ 
                background: 'var(--primary-color)',
                color: 'white',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.875rem'
              }}>1</div>
              <div>
                <strong>Customer Management:</strong> Add, edit, and search customer profiles with validation
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
              <div style={{ 
                background: 'var(--secondary-color)',
                color: 'white',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.875rem'
              }}>2</div>
              <div>
                <strong>Hotel Management:</strong> Manage hotel listings with location and manager information
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
              <div style={{ 
                background: 'var(--info-color)',
                color: 'white',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.875rem'
              }}>3</div>
              <div>
                <strong>Booking Management:</strong> Create and track bookings with customer-hotel relationships
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Technology Stack */}
      <Card>
        <h2>Technology Stack</h2>
        <div className="grid grid-cols-2 gap-lg" style={{ marginTop: 'var(--spacing-lg)' }}>
          <div>
            <h3 style={{ color: 'var(--primary-color)' }}>Frontend</h3>
            <ul style={{ color: 'var(--gray-600)', lineHeight: '1.8' }}>
              <li>React 18 with Hooks</li>
              <li>React Router for Navigation</li>
              <li>Axios for API Communication</li>
              <li>Custom UI Component Library</li>
              <li>Modern CSS with CSS Variables</li>
              <li>Responsive Design</li>
            </ul>
          </div>
          
          <div>
            <h3 style={{ color: 'var(--secondary-color)' }}>Backend</h3>
            <ul style={{ color: 'var(--gray-600)', lineHeight: '1.8' }}>
              <li>Spring Boot Framework</li>
              <li>RESTful API Architecture</li>
              <li>JDBC for Database Operations</li>
              <li>Comprehensive Error Handling</li>
              <li>Input Validation & Security</li>
              <li>CORS Configuration</li>
            </ul>
          </div>
        </div>
      </Card>

      <style>{`
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary-color);
        }
        
        @media (max-width: 768px) {
          .grid-cols-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;