import React, { useEffect, useState, lazy, Suspense } from 'react';
import { motion, useTransform, useScroll } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ArrowDown, Download, ChevronRight, Sparkles } from 'lucide-react';
import { config } from '../data/config';
import './Hero.css';

// Lazy-load the heavy 3D scene so Three.js doesn't block initial render
const NeuralOrbit = lazy(() => import('./NeuralOrbit'));

// Typewriter effect for the label
function TypewriterLabel({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(timer);
    }, 35);
    return () => clearInterval(timer);
  }, [text]);
  return <span className="hero__label font-mono">{displayed}<span className="hero__cursor">|</span></span>;
}

export default function Hero() {
  const { scrollY } = useScroll();
  // Fade the 3D visual as the user scrolls away
  const canvasOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const canvasScale   = useTransform(scrollY, [0, 400], [1, 0.88]);

  const handleScrollToWork = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: 'easeOut' },
    },
  };

  return (
    <section id="home" className="hero">
      {/* Background elements */}
      <div className="hero__bg">
        <div className="ambient-blob ambient-blob-blue" style={{ width: 600, height: 600, top: '-20%', left: '-10%' }} />
        <div className="ambient-blob ambient-blob-violet" style={{ width: 500, height: 500, bottom: '-15%', right: '-5%' }} />
        <div className="grid-decoration" />
      </div>

      <div className="container hero__container">
        {/* Left: Text content */}
        <motion.div
          className="hero__content"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Eyebrow label */}
          <motion.div variants={itemVariants} className="hero__eyebrow">
            <div className="hero__eyebrow-inner">
              <Sparkles size={12} />
              <TypewriterLabel text="COMPUTER SCIENCE × ARTIFICIAL INTELLIGENCE" />
            </div>
          </motion.div>

          {/* Main headline */}
          <motion.h1 className="hero__headline" variants={itemVariants}>
            Engineering{' '}
            <span className="gradient-text">ideas.</span>
            <br />
            Building intelligent
            <br />
            experiences.
          </motion.h1>

          {/* Supporting text */}
          <motion.p className="hero__subtext" variants={itemVariants}>
            I'm Bhavesh Kumawat, a Computer Science Engineering student
            specializing in AI&nbsp;&amp;&nbsp;ML. I build practical software,
            explore intelligent systems,{' '}and turn ideas into working products.
          </motion.p>

          {/* CTAs */}
          <motion.div className="hero__ctas" variants={itemVariants}>
            <motion.button
              className="btn btn-primary hero__cta-primary"
              onClick={handleScrollToWork}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              aria-label="Explore My Work"
            >
              Explore My Work
              <ChevronRight size={16} />
            </motion.button>

            <motion.a
              href={config.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost hero__cta-secondary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              aria-label="Download Resume"
            >
              <Download size={15} />
              Download Resume
            </motion.a>
          </motion.div>

          {/* Metadata strip */}
          <motion.div className="hero__meta" variants={itemVariants}>
            <div className="hero__meta-item">
              <span className="hero__meta-dot hero__meta-dot--blue" />
              <span>{config.degree}</span>
            </div>
            <div className="hero__meta-sep" />
            <div className="hero__meta-item">
              <span className="hero__meta-dot hero__meta-dot--violet" />
              <span>{config.specialization}</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Neural Orbit 3D */}
        <motion.div
          className="hero__visual"
          style={{ opacity: canvasOpacity, scale: canvasScale }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          {/* 3D Canvas — lazy loaded */}
          <div className="hero__canvas-wrapper">
            <Suspense fallback={<div className="hero__canvas-placeholder" aria-hidden="true" />}>
              <NeuralOrbit />
            </Suspense>
          </div>

          {/* Floating info cards */}
          <motion.div
            className="hero__float-card hero__float-card--top"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <span className="hero__float-card-label font-mono">CURRENT FOCUS</span>
            <span className="hero__float-card-value">AI & Backend Systems</span>
          </motion.div>

          <motion.div
            className="hero__float-card hero__float-card--bottom"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            <span className="hero__float-card-label font-mono">LOCATION</span>
            <span className="hero__float-card-value">Bengaluru, India</span>
          </motion.div>

          {/* Graduation badge */}
          <motion.div
            className="hero__float-card hero__float-card--grad"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
          >
            <span className="hero__float-card-label font-mono">GRAD</span>
            <span className="hero__float-card-value">{config.graduationYear}</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="hero__scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        role="button"
        tabIndex={0}
        aria-label="Scroll to About section"
        onKeyDown={(e) => e.key === 'Enter' && document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <div className="hero__scroll-text font-mono">SCROLL</div>
        <motion.div
          className="hero__scroll-arrow"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <ArrowDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  );
}
