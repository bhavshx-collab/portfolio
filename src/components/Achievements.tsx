import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ExternalLink, Award, BookMarked, Rocket } from 'lucide-react';
import { achievements, type Achievement } from '../data/config';
import './Achievements.css';

const typeIcons: Record<Achievement['type'], React.ReactNode> = {
  certification: <BookMarked size={16} />,
  academic: <Award size={16} />,
  hackathon: <Rocket size={16} />,
  milestone: <Trophy size={16} />,
};

const typeColors: Record<Achievement['type'], string> = {
  certification: 'blue',
  academic: 'green',
  hackathon: 'violet',
  milestone: 'amber',
};

function EmptyState() {
  return (
    <motion.div
      className="achievements__empty"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="achievements__empty-icon">
        <Trophy size={32} />
      </div>
      <h3>Credentials Coming Soon</h3>
      <p>
        Certifications and achievements will be listed here as they are earned.
        <br />
        No placeholder credentials — only real accomplishments.
      </p>
      <div className="achievements__empty-cta font-mono">
        Currently in progress → Completing certifications in AI/ML & Backend
      </div>
    </motion.div>
  );
}

export default function Achievements() {
  const featured = achievements.filter(a => a.featured);
  const rest = achievements.filter(a => !a.featured);

  return (
    <section id="achievements" className="section achievements">
      <div className="container">
        {/* Header */}
        <motion.div
          className="section-label"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          05 — CREDENTIALS
        </motion.div>

        <motion.h2
          className="achievements__headline"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        >
          Certifications &
          <br />
          <span className="gradient-text">achievements.</span>
        </motion.h2>

        {achievements.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="achievements__content">
            {/* Featured */}
            {featured.length > 0 && (
              <div className="achievements__featured">
                {featured.map((a, i) => (
                  <motion.div
                    key={a.id}
                    className={`achievement-card achievement-card--featured achievement-card--${typeColors[a.type]}`}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                  >
                    <div className="achievement-card__icon">
                      {typeIcons[a.type]}
                    </div>
                    <div className="achievement-card__body">
                      <div className="achievement-card__issuer font-mono">{a.issuer}</div>
                      <h3 className="achievement-card__title">{a.title}</h3>
                      <p className="achievement-card__desc">{a.description}</p>
                      {a.skills && (
                        <div className="achievement-card__skills">
                          {a.skills.map(s => <span key={s} className="tag">{s}</span>)}
                        </div>
                      )}
                    </div>
                    <div className="achievement-card__meta">
                      <span className="font-mono achievement-card__date">{a.date}</span>
                      {a.credentialUrl && (
                        <a
                          href={a.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="achievement-card__link"
                          aria-label="View credential"
                        >
                          <ExternalLink size={14} />
                          Verify
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Rest */}
            {rest.length > 0 && (
              <div className="achievements__grid">
                {rest.map((a, i) => (
                  <motion.div
                    key={a.id}
                    className={`achievement-card achievement-card--${typeColors[a.type]}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  >
                    <div className="achievement-card__icon">{typeIcons[a.type]}</div>
                    <div className="achievement-card__body">
                      <div className="achievement-card__issuer font-mono">{a.issuer}</div>
                      <h3 className="achievement-card__title">{a.title}</h3>
                      <p className="achievement-card__desc">{a.description}</p>
                    </div>
                    <div className="achievement-card__meta">
                      <span className="font-mono achievement-card__date">{a.date}</span>
                      {a.credentialUrl && (
                        <a href={a.credentialUrl} target="_blank" rel="noopener noreferrer" className="achievement-card__link">
                          <ExternalLink size={13} /> Verify
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
