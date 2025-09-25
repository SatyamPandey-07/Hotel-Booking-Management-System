import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { 
  ChevronRightIcon, 
  StarIcon, 
  ClockIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  CpuChipIcon,
  CloudIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/solid';
import { Card, Button } from './ui';

// 3D Background Component
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
      
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
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
        shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
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

// Particle System Component
function ParticleField() {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(79, 70, 229, 0.6)';
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -2,
        pointerEvents: 'none'
      }}
    />
  );
}

function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef(null);
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  
  const springProps = useSpring({
    from: { opacity: 0, transform: 'translateY(100px)' },
    to: { opacity: isLoaded ? 1 : 0, transform: isLoaded ? 'translateY(0px)' : 'translateY(100px)' },
    config: { tension: 280, friction: 60 }
  });
  
  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // GSAP animations
    gsap.fromTo('.hero-title', 
      { y: 100, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.3 }
    );
    
    gsap.fromTo('.hero-subtitle', 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.6 }
    );
    
    gsap.fromTo('.hero-buttons', 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.9 }
    );
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  const techStack = [
    {
      category: 'Frontend Technologies',
      icon: <DevicePhoneMobileIcon className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      technologies: [
        { name: 'React 18', description: 'Modern React with Hooks & Concurrent Features' },
        { name: 'Framer Motion', description: 'Production-ready motion library' },
        { name: 'Three.js', description: '3D graphics and WebGL animations' },
        { name: 'GSAP', description: 'High-performance animations' },
        { name: 'TypeScript', description: 'Type-safe JavaScript development' }
      ]
    },
    {
      category: 'Backend Architecture',
      icon: <CpuChipIcon className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      technologies: [
        { name: 'Spring Boot', description: 'Enterprise Java framework' },
        { name: 'JWT Authentication', description: 'Secure token-based auth' },
        { name: 'RESTful APIs', description: 'Scalable API architecture' },
        { name: 'JDBC', description: 'Optimized database connectivity' },
        { name: 'Maven', description: 'Project management & build automation' }
      ]
    },
    {
      category: 'Cloud & Infrastructure',
      icon: <CloudIcon className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500',
      technologies: [
        { name: 'Docker', description: 'Containerized deployments' },
        { name: 'PostgreSQL', description: 'Advanced relational database' },
        { name: 'Redis Cache', description: 'High-performance caching' },
        { name: 'AWS/Azure', description: 'Cloud hosting & services' },
        { name: 'CI/CD Pipeline', description: 'Automated deployment' }
      ]
    },
    {
      category: 'Security & Performance',
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      color: 'from-red-500 to-orange-500',
      technologies: [
        { name: 'OAuth 2.0', description: 'Industry-standard authorization' },
        { name: 'Rate Limiting', description: 'API protection & throttling' },
        { name: 'Data Encryption', description: 'End-to-end security' },
        { name: 'Performance Monitoring', description: 'Real-time analytics' },
        { name: 'Load Balancing', description: 'High availability setup' }
      ]
    }
  ];
  
  const features = [
    {
      title: 'AI-Powered Recommendations',
      description: 'Machine learning algorithms analyze your preferences to suggest perfect accommodations.',
      icon: '🤖',
      color: 'from-blue-600 to-purple-600',
      tech: ['TensorFlow.js', 'ML APIs', 'Recommendation Engine']
    },
    {
      title: 'Real-Time Availability',
      description: 'WebSocket connections ensure instant updates on room availability and pricing.',
      icon: '⚡',
      color: 'from-yellow-500 to-orange-500',
      tech: ['WebSockets', 'Event Streaming', 'Real-time Sync']
    },
    {
      title: 'Blockchain Payments',
      description: 'Secure, transparent transactions with cryptocurrency and traditional payment support.',
      icon: '🔗',
      color: 'from-green-500 to-teal-500',
      tech: ['Web3.js', 'Smart Contracts', 'Payment Gateway']
    },
    {
      title: 'AR/VR Preview',
      description: 'Immersive room previews using augmented and virtual reality technology.',
      icon: '🥽',
      color: 'from-purple-500 to-pink-500',
      tech: ['WebXR API', '3D Modeling', 'AR.js']
    }
  ];
  
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Tech Entrepreneur',
      company: 'StartupCorp',
      comment: 'The most sophisticated booking platform I\'ve ever used. The 3D previews are game-changing.',
      rating: 5,
      avatar: '👩‍💼'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Travel Blogger',
      company: 'WanderlustTech',
      comment: 'AI recommendations are spot-on. Found hidden gems I would never have discovered.',
      rating: 5,
      avatar: '👨‍💻'
    },
    {
      name: 'Emma Thompson',
      role: 'Business Consultant',
      company: 'GlobalVentures',
      comment: 'Real-time updates and blockchain payments make business travel seamless and secure.',
      rating: 5,
      avatar: '👩‍🚀'
    }
  ];
  
  const architectureFeatures = [
    {
      title: 'Microservices Architecture',
      description: 'Scalable, maintainable services with independent deployment capabilities',
      icon: '🏗️',
      metrics: ['99.9% Uptime', '< 100ms Response', 'Auto-scaling']
    },
    {
      title: 'Event-Driven Design',
      description: 'Asynchronous processing with message queues and event streaming',
      icon: '⚙️',
      metrics: ['1M+ Events/sec', 'Real-time Processing', 'Fault Tolerant']
    },
    {
      title: 'Advanced Caching',
      description: 'Multi-layer caching strategy with Redis and CDN optimization',
      icon: '🚀',
      metrics: ['Sub-ms Access', '95% Cache Hit', 'Global CDN']
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
      <ParticleField />
      
      {/* Animated mouse follower */}
      <motion.div
        style={{
          position: 'fixed',
          top: mousePosition.y - 10,
          left: mousePosition.x - 10,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.8) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'screen'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      
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
                  boxShadow: '0 10px 30px rgba(79, 70, 229, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <span style={{ position: 'relative', zIndex: 1 }}>Sign In</span>
                <motion.div
                  style={
                    {
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      zIndex: 0
                    }
                  }
                  animate={{
                    left: ['100%', '-100%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
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
        <motion.div style={y1} className="container">
          <motion.h1
            className="hero-title"
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
            Next-Gen Hotel
            <br />
            <motion.span
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'linear'
              }}
              style={{
                background: 'linear-gradient(270deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #dda0dd)',
                backgroundSize: '400% 400%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Experience
            </motion.span>
          </motion.h1>
          
          <motion.p
            className="hero-subtitle"
            style={{
              fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '800px',
              margin: '0 auto 3rem auto',
              lineHeight: '1.6'
            }}
          >
            Powered by AI, secured by blockchain, enhanced by AR/VR.
            <br />
            Experience the future of hospitality with cutting-edge technology.
          </motion.p>
          
          <motion.div
            className="hero-buttons"
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
                    boxShadow: '0 20px 40px rgba(79, 70, 229, 0.4)',
                    position: 'relative',
                    overflow: 'hidden'
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
        </motion.div>
        
        {/* Floating elements */}
        <motion.div
          style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.3), rgba(6, 182, 212, 0.3))',
            filter: 'blur(40px)'
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        
        <motion.div
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '15%',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(236, 72, 153, 0.3))',
            filter: 'blur(50px)'
          }}
          animate={{
            y: [0, 40, 0],
            x: [0, -25, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack" style={{ padding: '6rem 0', background: 'rgba(15, 15, 35, 0.8)' }}>
        <animated.div style={springProps} className="container">
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
                  backdropFilter: 'blur(20px)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <motion.div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${stack.color.split(' ')[1]}, ${stack.color.split(' ')[3]})`
                  }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
                
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
        </animated.div>
      </section>
      
      {/* Architecture Features */}
      <section style={{ padding: '6rem 0', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
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
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1rem'
            }}>
              System Architecture
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Enterprise-grade architecture built for scale and reliability
            </p>
          </motion.div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            {architectureFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(124, 58, 237, 0.1))',
                  borderRadius: '20px',
                  padding: '2.5rem',
                  border: '1px solid rgba(79, 70, 229, 0.3)',
                  backdropFilter: 'blur(20px)',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <motion.div
                  style={{
                    fontSize: '3rem',
                    marginBottom: '1.5rem'
                  }}
                  animate={{
                    rotateY: [0, 360]
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                >
                  {feature.icon}
                </motion.div>
                
                <h3 style={{
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: '1rem'
                }}>
                  {feature.title}
                </h3>
                
                <p style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  marginBottom: '2rem'
                }}>
                  {feature.description}
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem' }}>
                  {feature.metrics.map((metric, metricIndex) => (
                    <motion.div
                      key={metricIndex}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: (index * 0.2) + (metricIndex * 0.1) }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}
                    >
                      {metric}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section style={{ padding: '6rem 0', background: 'rgba(15, 15, 35, 0.9)' }}>
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
              background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 25%, #45b7d1 50%, #96ceb4 75%, #ffeaa7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1rem'
            }}>
              Revolutionary Features
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Experience the future of hotel booking with AI, blockchain, and immersive technologies
            </p>
          </motion.div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, rotateX: -15 }}
                whileInView={{ opacity: 1, rotateX: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  boxShadow: '0 25px 50px rgba(0,0,0,0.3)' 
                }}
                style={{
                  background: `linear-gradient(135deg, ${feature.color.split(' ')[1]}, ${feature.color.split(' ')[3]})`,
                  borderRadius: '20px',
                  padding: '2.5rem',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.2)'
                }}
              >
                <motion.div
                  style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                    pointerEvents: 'none'
                  }}
                  animate={{
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
                
                <motion.div
                  style={{
                    fontSize: '4rem',
                    marginBottom: '1.5rem',
                    position: 'relative',
                    zIndex: 1
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                    rotateZ: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  {feature.icon}
                </motion.div>
                
                <h3 style={{
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: '1rem',
                  position: 'relative',
                  zIndex: 1,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}>
                  {feature.title}
                </h3>
                
                <p style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  marginBottom: '2rem',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {feature.description}
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '0.5rem', 
                  justifyContent: 'center',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {feature.tech.map((tech, techIndex) => (
                    <motion.span
                      key={techIndex}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: (index * 0.2) + (techIndex * 0.1) }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '15px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      {tech}
                    </motion.span>
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
                initial={{ opacity: 0, y: 50, rotateX: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.03, 
                  y: -10,
                  boxShadow: '0 25px 50px rgba(79, 70, 229, 0.3)'
                }}
                style={{
                  background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15), rgba(6, 182, 212, 0.15))',
                  borderRadius: '20px',
                  padding: '2.5rem',
                  border: '1px solid rgba(79, 70, 229, 0.3)',
                  backdropFilter: 'blur(20px)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <motion.div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    fontSize: '4rem',
                    opacity: 0.1,
                    color: '#4f46e5'
                  }}
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  "
                </motion.div>
                
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
                    <motion.div
                      key={starIndex}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: (index * 0.2) + (starIndex * 0.1) }}
                    >
                      <StarIcon className="w-5 h-5" style={{ color: '#fbbf24' }} />
                    </motion.div>
                  ))}
                </div>
                
                <p style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  fontStyle: 'italic',
                  position: 'relative',
                  zIndex: 1
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
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        textAlign: 'center',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            pointerEvents: 'none'
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: '900',
                marginBottom: '2rem',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
              animate={{
                textShadow: [
                  '2px 2px 4px rgba(0,0,0,0.3)',
                  '4px 4px 8px rgba(0,0,0,0.5)',
                  '2px 2px 4px rgba(0,0,0,0.3)'
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              Ready to Experience the Future?
            </motion.h2>
            
            <motion.p
              style={{
                fontSize: '1.3rem',
                marginBottom: '3rem',
                opacity: 0.95,
                maxWidth: '600px',
                margin: '0 auto 3rem auto'
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 0.95, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Join the next generation of hotel booking. Experience AI-powered recommendations,
              blockchain security, and immersive previews.
            </motion.p>
            
            <motion.div
              style={{
                display: 'flex',
                gap: '2rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Button
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      color: '#4f46e5',
                      padding: '1.2rem 3rem',
                      fontSize: '1.3rem',
                      fontWeight: '800',
                      borderRadius: '50px',
                      border: 'none',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <motion.span
                      style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <GlobeAltIcon className="w-6 h-6" />
                      Launch Platform
                    </motion.span>
                    <motion.div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(79,70,229,0.2), transparent)',
                        zIndex: 0
                      }}
                      animate={{
                        left: ['100%', '-100%']
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear'
                      }}
                    />
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  style={{
                    background: 'transparent',
                    border: '3px solid rgba(255, 255, 255, 0.8)',
                    color: 'white',
                    padding: '1.2rem 3rem',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    borderRadius: '50px',
                    backdropFilter: 'blur(20px)'
                  }}
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <ClockIcon className="w-5 h-5 mr-2" />
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer style={{
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
        color: 'white',
        padding: '4rem 0 2rem 0',
        position: 'relative'
      }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '3rem',
              marginBottom: '3rem'
            }}
          >
            <div>
              <motion.div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                whileHover={{ scale: 1.05 }}
              >
                🏨 Hotel Booking System
              </motion.div>
              <p style={{
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: '1.6'
              }}>
                Revolutionizing hospitality with cutting-edge technology.
                Experience the future of hotel booking today.
              </p>
            </div>
            
            <div>
              <h4 style={{
                color: 'white',
                marginBottom: '1rem',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                Technologies
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {['React 18', 'Spring Boot', 'Three.js', 'AI/ML', 'Blockchain'].map((tech, index) => (
                  <motion.div
                    key={index}
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      cursor: 'pointer'
                    }}
                    whileHover={{
                      color: '#4f46e5',
                      x: 5
                    }}
                  >
                    {tech}
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 style={{
                color: 'white',
                marginBottom: '1rem',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                Features
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {['AI Recommendations', 'Real-time Booking', 'AR/VR Preview', 'Blockchain Payments'].map((feature, index) => (
                  <motion.div
                    key={index}
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      cursor: 'pointer'
                    }}
                    whileHover={{
                      color: '#06b6d4',
                      x: 5
                    }}
                  >
                    {feature}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          
          <motion.div
            style={{
              textAlign: 'center',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.6)'
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p style={{ margin: 0 }}>
              © 2024 Hotel Booking System. Built with ❤️ using cutting-edge technology.
            </p>
          </motion.div>
        </div>
      </footer>
      
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .feature-card-hover:hover {
          transform: translateY(-8px) rotateX(5deg);
          box-shadow: 0 25px 50px rgba(0,0,0,0.2);
        }
        
        @media (max-width: 768px) {
          .grid-auto-fit {
            grid-template-columns: 1fr;
          }
          
          section {
            padding: 3rem 0 !important;
          }
          
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #0f0f23;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #4f46e5, #06b6d4);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #3730a3, #0891b2);
        }
      `}</style>
    </div>
  );
}

export default LandingPage;