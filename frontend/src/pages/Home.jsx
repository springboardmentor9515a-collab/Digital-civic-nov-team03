import { useEffect, useRef, useState } from 'react';
// import Globe from 'react-globe.gl';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Vote, FileText, Users, ArrowRight } from 'lucide-react';

const Home = () => {
  const globeEl = useRef();
  const [windowSize, setWindowSize] = useState({ w: window.innerWidth, h: window.innerHeight });

  // Auto-rotate the globe
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.leftGlow}></div>
      <div style={styles.rightGlow}></div>

      {/* LEFT SIDE: Content */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        style={styles.contentSection}
      >
        <h1 style={styles.title}>
          Digital Civic Participation<span style={styles.highlight}></span> <br />

        </h1>
        <p style={styles.description}>
          A platform that connects people with community initiatives,
          enabling them to raise concerns, share opinions, and take part
          in local decision-making.

        </p>

        {/* Feature List */}
        <div style={styles.featureGrid}>
          <FeatureItem icon={<FileText size={20} />} text="Submit Community Issues " />
          <FeatureItem icon={<Vote size={20} />} text="Participate in Opinion Polls" />
          <FeatureItem icon={<Users size={20} />} text="Support Collective Action
" />
        </div>

        {/* Action Buttons */}
        <div style={styles.buttonGroup}>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={styles.registerBtn}
            >
              Join the Community
            </motion.button>
          </Link>

          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.95 }}
              style={styles.loginBtn}
            >
              Sign In
            </motion.button>
          </Link>
        </div>
      </motion.div>


    </div>
  );
};

// Helper for features
const FeatureItem = ({ icon, text }) => (
  <div style={styles.featureItem}>
    <div style={styles.iconBox}>{icon}</div>
    <span style={{ fontSize: '0.9rem', color: '#ccc' }}>{text}</span>
  </div>
);

// Styles
const styles = {

  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(to right, #291e41, #321217)',
    color: 'white',
    overflow: 'hidden',
    textAlign: 'center'
  },


  leftGlow: {
    position: 'absolute',
    left: '-150px',
    top: '%',
    width: '650px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(114, 165, 245, 0.35), transparent 90%)',
    filter: 'blur(80px)'
  },

  rightGlow: {
    position: 'absolute',
    right: '-150px',
    bottom: '%',
    width: '450px',
    height: '450px',
    background: 'radial-gradient(circle, rgba(99,102,241,0.35), transparent 90%)',
    filter: 'blur(90px)'
  },


  contentSection: {
    maxWidth: '900px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem',
    zIndex: 10
  },

  title: {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    lineHeight: 1.1
  },
  highlight: {
    color: '#3b82f6', // Bright Blue
    textShadow: '0 0 50px rgba(59, 130, 246, 0.5)'
  },
  description: {
    fontSize: '1.2rem',
    color: '#94a3b8',
    maxWidth: '500px',
    marginBottom: '2rem',
    lineHeight: 1.6
  },
  featureGrid: {
    display: 'flex',
    gap: '20px',
    marginBottom: '3rem'
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  iconBox: {
    background: 'rgba(59, 130, 246, 0.2)',
    padding: '8px',
    borderRadius: '8px',
    color: '#60a5fa'
  },
  buttonGroup: {
    display: 'flex',
    gap: '20px'
  },
  registerBtn: {
    padding: '12px 30px',
    fontSize: '1rem',
    background: 'transparent', // Blue
    border: '1px solid #2b415f',
    color: 'white',
    borderRadius: '15px',
    cursor: 'pointer',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',

    boxShadow: '0 0 15px rgba(68, 71, 76, 0.5)'
  },
  loginBtn: {
    padding: '12px 30px',
    fontSize: '1rem',
    background: 'transparent',
    border: '1px solid #2b415f',
    color: 'white',
    borderRadius: '15px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  globeContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'grab'
  }
};

export default Home;