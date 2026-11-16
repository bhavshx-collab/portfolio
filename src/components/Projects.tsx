import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, GitBranch, ArrowUpRight, X, ChevronRight, Beaker, CheckCircle, Clock } from 'lucide-react';
import { projects, type Project, type ProjectCategory } from '../data/config';
import './Projects.css';

// ─── TiltProjectCard — wraps each card with 3D perspective tilt ────
const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

interface TiltCardProps {
  project: Project;
  index: number;
  onSelect: (p: Project) => void;
}

function TiltProjectCard({ project, index, onSelect }: TiltCardProps) {
  const ref    = useRef<HTMLElement>(null!);
  const rafRef = useRef(0);
  const status = statusConfig[project.status];

  const onMove = useCallback((e: React.PointerEvent) => {
    if (isTouchDevice) return;
    const el = ref.current; if (!el) return;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${-y * 9}deg) rotateY(${x * 9}deg) translateZ(4px)`;
      el.style.boxShadow = `0 ${10 + y * 10}px ${36 + Math.abs(y) * 14}px rgba(0,0,0,0.38), 0 0 0 1px rgba(108,140,255,0.2), inset 0 1px 0 rgba(255,255,255,0.06)`;
    });
  }, []);

  const onLeave = useCallback(() => {
    const el = ref.current; if (!el) return;
    el.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease';
    el.style.transform  = '';
    el.style.boxShadow  = '';
    setTimeout(() => { if (el) el.style.transition = ''; }, 510);
  }, []);

  return (
    <motion.article
      ref={ref as React.RefObject<HTMLElement>}
      key={project.id}
      className="project-card"
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      style={{ '--project-color': project.coverColor } as React.CSSProperties}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <ProjectCover project={project} />

      <div className="project-card__body">
        <div className="project-card__meta">
          <span className={`project-card__status project-card__status--${status.color}`}>
            {status.icon}{status.label}
          </span>
          <span className="project-card__year font-mono">{project.year}</span>
        </div>

        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__subtitle">{project.subtitle}</p>
        <p className="project-card__desc">{project.description}</p>

        <div className="project-card__stack">
          {project.stack.slice(0, 4).map((s) => (
            <span key={s} className="tag">{s}</span>
          ))}
          {project.stack.length > 4 && (
            <span className="tag">+{project.stack.length - 4}</span>
          )}
        </div>
      </div>

      <div className="project-card__footer">
        <button
          className="project-card__detail-btn"
          onClick={() => onSelect(project)}
          aria-label={`View ${project.title} details`}
        >
          View Details <ArrowUpRight size={14} />
        </button>

        <div className="project-card__links">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card__icon-link"
              aria-label={`${project.title} GitHub repository`}
              onClick={(e) => e.stopPropagation()}
            >
              <GitBranch size={16} />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card__icon-link"
              aria-label={`${project.title} live demo`}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

type FilterType = 'all' | ProjectCategory;

const filterOptions: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All Projects' },
  { id: 'backend', label: 'Backend' },
  { id: 'ai-ml', label: 'AI & ML' },
  { id: 'web', label: 'Web Apps' },
  { id: 'fullstack', label: 'Full Stack' },
];

const statusConfig = {
  complete: { label: 'Complete', icon: <CheckCircle size={12} />, color: 'green' },
  'in-progress': { label: 'In Progress', icon: <Clock size={12} />, color: 'blue' },
  experimental: { label: 'Experimental', icon: <Beaker size={12} />, color: 'amber' },
};

// Abstract project cover with gradient mesh
function ProjectCover({ project }: { project: Project }) {
  return (
    <div
      className="project-card__cover"
      style={{ '--project-color': project.coverColor, '--project-accent': project.accentColor } as React.CSSProperties}
      aria-hidden="true"
    >
      <div className="project-card__cover-mesh" />
      <div className="project-card__cover-grid" />
      <div className="project-card__cover-label font-mono">
        {project.stack.slice(0, 3).join(' · ')}
      </div>
    </div>
  );
}

// Project detail modal
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const status = statusConfig[project.status];

  return (
    <motion.div
      className="project-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="project-modal"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} project details`}
      >
        {/* Modal header */}
        <div className="project-modal__header" style={{ '--project-color': project.coverColor } as React.CSSProperties}>
          <div className="project-modal__header-mesh" />
          <div className="project-modal__header-content">
            <div className="project-modal__header-meta">
              <span className="font-mono" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>
                {project.year}
              </span>
              <div className={`project-modal__status project-modal__status--${status.color}`}>
                {status.icon}
                {status.label}
              </div>
            </div>
            <h2 className="project-modal__title">{project.title}</h2>
            <p className="project-modal__subtitle">{project.subtitle}</p>
          </div>
          <button className="project-modal__close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal body */}
        <div className="project-modal__body">
          {/* Problem statement */}
          <div className="project-modal__section">
            <h3 className="project-modal__section-title font-mono">THE PROBLEM</h3>
            <p className="project-modal__text">{project.problem}</p>
          </div>

          {/* Description */}
          <div className="project-modal__section">
            <h3 className="project-modal__section-title font-mono">OVERVIEW</h3>
            <p className="project-modal__text">{project.longDescription}</p>
          </div>

          {/* Features */}
          <div className="project-modal__section">
            <h3 className="project-modal__section-title font-mono">KEY FEATURES</h3>
            <ul className="project-modal__features">
              {project.features.map((f, i) => (
                <li key={i}>
                  <ChevronRight size={13} style={{ color: project.coverColor }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Architecture */}
          {project.architecture && (
            <div className="project-modal__section">
              <h3 className="project-modal__section-title font-mono">ARCHITECTURE</h3>
              <div className="project-modal__code-block">
                <p>{project.architecture}</p>
              </div>
            </div>
          )}

          {/* Challenges */}
          {project.challenges && project.challenges.length > 0 && (
            <div className="project-modal__section">
              <h3 className="project-modal__section-title font-mono">CHALLENGES</h3>
              <ul className="project-modal__features">
                {project.challenges.map((c, i) => (
                  <li key={i}>
                    <ChevronRight size={13} style={{ color: 'var(--accent-violet)' }} />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Lessons */}
          {project.lessons && project.lessons.length > 0 && (
            <div className="project-modal__section">
              <h3 className="project-modal__section-title font-mono">LESSONS LEARNED</h3>
              <ul className="project-modal__features">
                {project.lessons.map((l, i) => (
                  <li key={i}>
                    <ChevronRight size={13} style={{ color: 'var(--accent-green)' }} />
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Stack */}
          <div className="project-modal__section">
            <h3 className="project-modal__section-title font-mono">TECH STACK</h3>
            <div className="project-modal__tags">
              {project.stack.map((s) => (
                <span key={s} className="tag">{s}</span>
              ))}
            </div>
          </div>

          {/* Future */}
          {project.futureImprovements && project.futureImprovements.length > 0 && (
            <div className="project-modal__section">
              <h3 className="project-modal__section-title font-mono">FUTURE IMPROVEMENTS</h3>
              <ul className="project-modal__features">
                {project.futureImprovements.map((f, i) => (
                  <li key={i}>
                    <ChevronRight size={13} style={{ color: 'var(--accent-blue)' }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal footer */}
        <div className="project-modal__footer">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <GitBranch size={15} />
              View on GitHub
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <ExternalLink size={15} />
              Live Demo
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category.includes(activeFilter));

  return (
    <section id="projects" className="section projects">
      <div className="container">
        {/* Header */}
        <motion.div
          className="section-label"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          03 — SELECTED WORK
        </motion.div>

        <motion.h2
          className="projects__headline"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        >
          Built with curiosity.
          <br />
          <span className="gradient-text">Refined through practice.</span>
        </motion.h2>

        {/* Filters */}
        <motion.div
          className="projects__filters"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          role="tablist"
          aria-label="Project categories"
        >
          {filterOptions.map(opt => (
            <button
              key={opt.id}
              role="tab"
              aria-selected={activeFilter === opt.id}
              className={`projects__filter-btn ${activeFilter === opt.id ? 'projects__filter-btn--active' : ''}`}
              onClick={() => setActiveFilter(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </motion.div>

        {/* Project grid */}
        <motion.div className="projects__grid" layout>
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                className="projects__empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="empty"
              >
                <div className="projects__empty-icon">○</div>
                <p>No projects in this category yet.</p>
                <span className="font-mono">More coming soon →</span>
              </motion.div>
            ) : filtered.map((project, i) => (
              <TiltProjectCard
                key={project.id}
                project={project}
                index={i}
                onSelect={setSelectedProject}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Project detail modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
