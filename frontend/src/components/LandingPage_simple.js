import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Card, Button } from './ui';
import {
  ChevronRightIcon,
  CpuChipIcon,
  DevicePhoneMobileIcon,
  CloudIcon,
  ShieldCheckIcon,
  StarIcon
} from '@heroicons/react/24/outline';

// 3D Background component
function ThreeBackground() {
  const mountRef = useRef(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    
    // Create floating geometric shapes
    const geometries = [
      new THREE.TetrahedronGeometry(1, 0),
      new THREE.OctahedronGeometry(1, 0),
      new THREE.IcosahedronGeometry(1, 0)
    ];
    
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x4f46e5, 
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    
    const shapes = [];
    for (let i = 0; i < 15; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const mesh = new THREE.Mesh(geometry, material);
      
      mesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      
      shapes.push(mesh);
      scene.add(mesh);
    }
    
    camera.position.z = 10;
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.005 + index * 0.001;
        shape.rotation.y += 0.005 + index * 0.001;
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);
  
  return (
    <div 
      ref={mountRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
}

function LandingPage() {
  const heroRef = useRef(null);

  const techStack = [
    {
      category: 'Frontend',
      icon: <DevicePhoneMobileIcon className="w-8 h-8" />,
      color: 'from-blue-500 to-purple-600',
      technologies: [
        { name: 'React 18', description: 'Modern UI framework' },
        { name: 'TypeScript', description: 'Type-safe development' },
        { name: 'Tailwind CSS', description: 'Utility-first styling' }
      ]
    },
    {
      category: 'Backend',
      icon: <CpuChipIcon className="w-8 h-8" />,
      color: 'from-green-500 to-teal-600',
      technologies: [
        { name: 'Spring Boot', description: 'Enterprise Java framework' },
        { name: 'PostgreSQL', description: 'Robust database' },
        { name: 'Redis', description: 'High-performance caching' }
      ]
    },
    {
      category: 'Cloud',
      icon: <CloudIcon className="w-8 h-8" />,
      color: 'from-orange-500 to-red-600',
      technologies: [
        { name: 'AWS EC2', description: 'Scalable computing' },
        { name: 'Docker', description: 'Containerization' },
        { name: 'Kubernetes', description: 'Orchestration' }
      ]
    },
    {
      category: 'Security',
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-600',
      technologies: [
        { name: 'JWT Auth', description: 'Secure authentication' },
        { name: 'SSL/TLS', description: 'Encrypted communication' },
        { name: 'OWASP', description: 'Security best practices' }
      ]
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Hotel Manager',
      company: 'Grand Plaza Hotels',
      rating: 5,
      comment: 'This system has revolutionized our booking process. The interface is intuitive and the performance is outstanding.',
      avatar: '👩‍💼'
    },
    {
      name: 'Michael Chen',
      role: 'IT Director',
      company: 'Hospitality Tech Solutions',
      rating: 5,
      comment: 'The architecture is solid and the integration capabilities are impressive. Highly recommended for enterprise use.',
      avatar: '👨‍💻'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Customer Experience Lead',
      company: 'Boutique Hotel Group',
      rating: 5,
      comment: 'Our guests love the seamless booking experience. The system is reliable and feature-rich.',
      avatar: '👩‍🎨'
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f0f23 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <ThreeBackground />
      
      {/* Navigation */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: 'rgba(15, 15, 35, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(79, 70, 229, 0.3)',
          zIndex: 1000,
          padding: '1rem 0'
        }}
      >
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            🏨 Hotel Booking System
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button
                style={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                  border: 'none',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '50px',
                  fontWeight: '600',
                  boxShadow: '0 10px 30px rgba(79, 70, 229, 0.3)'
                }}
              >
                Sign In
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.header>
      
      {/* Hero Section */}
      <section
        ref={heroRef}
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          paddingTop: '80px'
        }}
      >
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #ffffff 0%, #4f46e5 50%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '2rem',
              letterSpacing: '-0.02em',
              lineHeight: '1.1'
            }}
          >
            Next-Gen Hotel Experience
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '800px',
              margin: '0 auto 3rem auto',
              lineHeight: '1.6'
            }}
          >
            Powered by cutting-edge technology for seamless hotel booking and management.
            Experience the future of hospitality today.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              display: 'flex',
              gap: '1.5rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button
                  style={{
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    border: 'none',
                    color: 'white',
                    padding: '1rem 3rem',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    borderRadius: '50px',
                    boxShadow: '0 20px 40px rgba(79, 70, 229, 0.4)'
                  }}
                >
                  <ChevronRightIcon className="w-5 h-5 mr-2" />
                  Launch Platform
                </Button>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                style={{
                  background: 'transparent',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '1rem 3rem',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  borderRadius: '50px',
                  backdropFilter: 'blur(10px)'
                }}
                onClick={() => {
                  document.getElementById('tech-stack').scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <CpuChipIcon className="w-5 h-5 mr-2" />
                View Tech Stack
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack" style={{ padding: '6rem 0', background: 'rgba(15, 15, 35, 0.8)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #ffffff 0%, #4f46e5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1rem'
            }}>
              Cutting-Edge Technology Stack
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Built with enterprise-grade technologies for scalability, security, and performance
            </p>
          </motion.div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {techStack.map((stack, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(6, 182, 212, 0.1))',
                  borderRadius: '20px',
                  padding: '2rem',
                  border: '1px solid rgba(79, 70, 229, 0.3)',
                  backdropFilter: 'blur(20px)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{
                    background: `linear-gradient(135deg, ${stack.color.split(' ')[1]}, ${stack.color.split(' ')[3]})`,
                    borderRadius: '12px',
                    padding: '0.75rem',
                    marginRight: '1rem',
                    color: 'white'
                  }}>
                    {stack.icon}
                  </div>
                  <h3 style={{
                    color: 'white',
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    margin: 0
                  }}>
                    {stack.category}
                  </h3>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {stack.technologies.map((tech, techIndex) => (
                    <motion.div
                      key={techIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: (index * 0.2) + (techIndex * 0.1) }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${stack.color.split(' ')[1]}, ${stack.color.split(' ')[3]})`,
                        marginRight: '0.75rem',
                        flexShrink: 0
                      }} />
                      <div>
                        <div style={{
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '0.95rem'
                        }}>
                          {tech.name}
                        </div>
                        <div style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '0.85rem',
                          marginTop: '0.25rem'
                        }}>
                          {tech.description}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '6rem 0', background: 'linear-gradient(135deg, #16213e 0%, #0f0f23 100%)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #ffffff 0%, #4f46e5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1rem'
            }}>
              What Industry Leaders Say
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Trusted by tech innovators and industry professionals worldwide
            </p>
          </motion.div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03, y: -10 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15), rgba(6, 182, 212, 0.15))',
                  borderRadius: '20px',
                  padding: '2.5rem',
                  border: '1px solid rgba(79, 70, 229, 0.3)',
                  backdropFilter: 'blur(20px)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    fontSize: '3rem',
                    marginRight: '1rem'
                  }}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div style={{
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '1.1rem'
                    }}>
                      {testimonial.name}
                    </div>
                    <div style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.9rem'
                    }}>
                      {testimonial.role}
                    </div>
                    <div style={{
                      color: '#4f46e5',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      {testimonial.company}
                    </div>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  marginBottom: '1rem'
                }}>
                  {[...Array(testimonial.rating)].map((_, starIndex) => (
                    <StarIcon key={starIndex} className="w-5 h-5" style={{ color: '#fbbf24' }} />
                  ))}
                </div>
                
                <p style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  fontStyle: 'italic'
                }}>
                  "{testimonial.comment}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{
        padding: '6rem 0',
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 25%, #ec4899 50%, #06b6d4 75%, #10b981 100%)',
        textAlign: 'center',
        color: 'white'
      }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '900',
              marginBottom: '2rem'
            }}>
              Ready to Transform Your Hotel Business?
            </h2>
            
            <p style={{
              fontSize: '1.4rem',
              marginBottom: '3rem',
              opacity: 0.9,
              maxWidth: '600px',
              margin: '0 auto 3rem'
            }}>
              Join thousands of hotels already using our platform to deliver exceptional guest experiences.
            </p>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '2px solid rgba(255, 255, 255, 0.5)',
                    color: 'white',
                    padding: '1.5rem 4rem',
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    borderRadius: '50px',
                    backdropFilter: 'blur(10px)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                >
                  🚀 Get Started Now
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <style>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default LandingPage;