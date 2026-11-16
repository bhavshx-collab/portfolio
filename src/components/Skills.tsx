import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skillCategories, type SkillLevel } from '../data/config';
import './Skills.css';

const levelConfig: Record<SkillLevel, { label: string; color: string; bg: string }> = {
  experienced: { label: 'Experienced', color: '#7EE0B8', bg: 'rgba(126,224,184,0.1)' },
  learning: { label: 'Learning', color: '#6C8CFF', bg: 'rgba(108,140,255,0.1)' },
  familiar: { label: 'Familiar', color: '#A78BFA', bg: 'rgba(167,139,250,0.1)' },
};

// Skill icons (text-based, using mono font)
const skillIcons: Record<string, string> = {
  Python: 'PY', C: 'C', JavaScript: 'JS', TypeScript: 'TS', SQL: 'DB',
  Flask: 'FL', 'REST APIs': 'API', SQLAlchemy: 'ORM', 'Authentication & Auth': 'AUTH', 'CRUD Systems': 'CRD',
  HTML: '<>', CSS: '{}', React: '⚛', 'Responsive Design': 'RWD',
  NumPy: 'NP', Pandas: 'PD', 'scikit-learn': 'SK', 'ML Fundamentals': 'ML', 'Generative AI': 'AI',
  Git: 'GIT', GitHub: 'GH', 'VS Code': 'VSC', SQLite: 'SQ', MySQL: 'MY', Vercel: 'VCL',
};

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const allCategories = [{ id: 'all', label: 'All' }, ...skillCategories];

  const visibleSkills = activeCategory === 'all'
    ? skillCategories.flatMap(cat => cat.skills.map(s => ({ ...s, category: cat.label })))
    : skillCategories
        .filter(cat => cat.id === activeCategory)
        .flatMap(cat => cat.skills.map(s => ({ ...s, category: cat.label })));

  return (
    <section id="skills" className="section skills">
      <div className="skills__bg-accent" aria-hidden="true" />
      <div className="container">
        {/* Header */}
        <motion.div
          className="section-label"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          02 — THE TOOLKIT
        </motion.div>

        <motion.h2
          className="skills__headline"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        >
          Tools I use.
          <br />
          <span className="gradient-text">Systems I build.</span>
        </motion.h2>

        {/* Level legend */}
        <motion.div
          className="skills__legend"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          {(Object.entries(levelConfig) as [SkillLevel, typeof levelConfig[SkillLevel]][]).map(([key, val]) => (
            <div key={key} className="skills__legend-item">
              <span className="skills__legend-dot" style={{ background: val.color }} />
              <span className="font-mono">{val.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Category filter tabs */}
        <motion.div
          className="skills__filters"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          role="tablist"
          aria-label="Skill categories"
        >
          {allCategories.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeCategory === cat.id}
              className={`skills__filter-btn ${activeCategory === cat.id ? 'skills__filter-btn--active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Skills grid */}
        <motion.div
          className="skills__grid"
          layout
        >
          <AnimatePresence mode="popLayout">
            {visibleSkills.map((skill, i) => {
              const level = levelConfig[skill.level];
              const icon = skillIcons[skill.name] || skill.name.slice(0, 2).toUpperCase();
              const isHovered = hoveredSkill === skill.name;

              return (
                <motion.div
                  key={skill.name}
                  className="skill-card"
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.3, delay: i * 0.035 }}
                  onHoverStart={() => setHoveredSkill(skill.name)}
                  onHoverEnd={() => setHoveredSkill(null)}
                  style={{
                    '--skill-accent': level.color,
                  } as React.CSSProperties}
                >
                  <div className="skill-card__icon font-mono">{icon}</div>
                  <div className="skill-card__name">{skill.name}</div>
                  <div
                    className="skill-card__level"
                    style={{ color: level.color, background: level.bg }}
                  >
                    {level.label}
                  </div>
                  {activeCategory === 'all' && (
                    <div className="skill-card__category font-mono">{skill.category}</div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Footer note */}
        <motion.p
          className="skills__note font-mono"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          * Levels reflect honest self-assessment. Always learning, always building.
        </motion.p>
      </div>
    </section>
  );
}
