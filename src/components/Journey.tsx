import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Trophy, BookOpen, Milestone } from 'lucide-react';
import { journey, type JourneyItem } from '../data/config';
import './Journey.css';

const typeConfig: Record<JourneyItem['type'], { icon: React.ReactNode; color: string }> = {
  education: { icon: <GraduationCap size={16} />, color: 'blue' },
  milestone: { icon: <Milestone size={16} />, color: 'violet' },
  certification: { icon: <Trophy size={16} />, color: 'green' },
  project: { icon: <BookOpen size={16} />, color: 'amber' },
};

export default function Journey() {
  return (
    <section id="journey" className="section journey">
      <div className="journey__bg" aria-hidden="true" />
      <div className="container">
        {/* Header */}
        <motion.div
          className="section-label"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          04 — THE JOURNEY
        </motion.div>

        <motion.h2
          className="journey__headline"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        >
          Learning by doing.
          <br />
          <span className="gradient-text">Growing through building.</span>
        </motion.h2>

        {/* Timeline */}
        <div className="journey__timeline">
          {journey.map((item, i) => {
            const typeInfo = typeConfig[item.type];
            return (
              <motion.div
                key={item.id}
                className="timeline-item"
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
              >
                {/* Timeline line */}
                <div className="timeline-item__line">
                  <div className={`timeline-item__dot timeline-item__dot--${typeInfo.color}`}>
                    {typeInfo.icon}
                  </div>
                  {i < journey.length - 1 && (
                    <motion.div
                      className="timeline-item__connector"
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.1 + 0.3 }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="timeline-item__content">
                  <div className="timeline-item__header">
                    <div>
                      <h3 className="timeline-item__title">{item.title}</h3>
                      <div className="timeline-item__org">{item.organization}</div>
                    </div>
                    <div className={`timeline-item__period timeline-item__period--${typeInfo.color} font-mono`}>
                      {item.period}
                    </div>
                  </div>

                  <p className="timeline-item__desc">{item.description}</p>

                  {item.tags && item.tags.length > 0 && (
                    <div className="timeline-item__tags">
                      {item.tags.map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}

                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="timeline-item__link"
                    >
                      View credential →
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
