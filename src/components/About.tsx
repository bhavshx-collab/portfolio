import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { MapPin, GraduationCap, Code2, Brain, Layers, Cpu } from 'lucide-react';
import { config } from '../data/config';
import './About.css';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};

const interests = [
  { icon: <Layers size={16} />, label: 'Backend Engineering', color: 'blue' },
  { icon: <Brain size={16} />, label: 'Artificial Intelligence', color: 'violet' },
  { icon: <Cpu size={16} />, label: 'Generative AI', color: 'green' },
  { icon: <Code2 size={16} />, label: 'Software Architecture', color: 'blue' },
];

export default function About() {
  return (
    <section id="about" className="section about">
      <div className="container">
        {/* Section header */}
        <motion.div
          className="section-label"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          01 — THE PERSON BEHIND THE CODE
        </motion.div>

        <motion.h2
          className="about__headline"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          Curious by nature.
          <br />
          <span className="gradient-text">An engineer in progress.</span>
        </motion.h2>

        <div className="about__grid">
          {/* Left: Portrait card */}
          <motion.div
            className="about__portrait-col"
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="about__portrait-card">
              <div className="about__portrait-frame">
                {/* Portrait placeholder with elegant treatment */}
                <div className="about__portrait-placeholder">
                  <div className="about__portrait-monogram">{config.monogram}</div>
                  <div className="about__portrait-gradient" />
                </div>

                {/* Replace with actual image:
                <img src="/portrait.jpg" alt="Bhavesh Kumar" className="about__portrait-img" />
                */}
              </div>

              {/* Metadata */}
              <div className="about__meta-card">
                <div className="about__meta-row">
                  <MapPin size={13} className="about__meta-icon" />
                  <span className="font-mono">{config.location}</span>
                </div>
                <div className="about__meta-row">
                  <GraduationCap size={13} className="about__meta-icon" />
                  <span className="font-mono">{config.graduationYear} Graduate</span>
                </div>
                <div className="about__meta-divider" />
                <div className="about__meta-row">
                  <span className="about__meta-label font-mono">SPECIALIZATION</span>
                </div>
                <div className="about__meta-value">AI & ML</div>
                {config.availability && (
                  <>
                    <div className="about__meta-divider" />
                    <div className="about__availability-badge">
                      <span className="about__avail-dot" />
                      {config.availabilityText}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="about__stats-grid">
              {config.stats.map((stat, i) => (
                <motion.div
                  key={i}
                  className="about__stat-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.3, duration: 0.5 }}
                >
                  <div className="about__stat-value gradient-text">{stat.value}</div>
                  <div className="about__stat-label font-mono">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Bio */}
          <motion.div
            className="about__bio-col"
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <div className="about__bio-header">
              <div className="about__degree-badge font-mono">
                {config.degree}
              </div>
              <div className="about__college font-mono">{config.college} · {config.studyPeriod}</div>
            </div>

            <div className="about__bio-text">
              {config.longBio.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Interest chips */}
            <div className="about__interests">
              <div className="about__interests-label font-mono">INTERESTS</div>
              <div className="about__interest-chips">
                {interests.map((interest, i) => (
                  <motion.div
                    key={i}
                    className={`about__interest-chip about__interest-chip--${interest.color}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 + 0.2 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    {interest.icon}
                    <span>{interest.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Philosophy quote */}
            <div className="about__quote">
              <div className="about__quote-mark">"</div>
              <p>I enjoy learning through implementation — picking up a new technology means building something with it, not just reading the docs.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
