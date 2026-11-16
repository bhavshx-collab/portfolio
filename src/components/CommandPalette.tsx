import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Code2, User, Briefcase, Mail, Download, BookOpen, Award } from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import { config } from '../data/config';
import './CommandPalette.css';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  group: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollTo = (id: string) => {
    onClose();
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 120);
  };

  const commands: Command[] = [
    { id: 'home', label: 'Go to Home', icon: <Code2 size={16} />, action: () => scrollTo('home'), group: 'Navigate' },
    { id: 'about', label: 'View About', description: 'Learn about Bhavesh', icon: <User size={16} />, action: () => scrollTo('about'), group: 'Navigate' },
    { id: 'skills', label: 'View Skills', description: 'See the tech toolkit', icon: <Code2 size={16} />, action: () => scrollTo('skills'), group: 'Navigate' },
    { id: 'projects', label: 'View Projects', description: 'Explore selected work', icon: <Briefcase size={16} />, action: () => scrollTo('projects'), group: 'Navigate' },
    { id: 'journey', label: 'View Journey', description: 'Education & milestones', icon: <BookOpen size={16} />, action: () => scrollTo('journey'), group: 'Navigate' },
    { id: 'achievements', label: 'View Achievements', description: 'Credentials & certifications', icon: <Award size={16} />, action: () => scrollTo('achievements'), group: 'Navigate' },
    { id: 'contact', label: 'Contact Me', description: "Let's connect", icon: <Mail size={16} />, action: () => scrollTo('contact'), group: 'Navigate' },
    {
      id: 'resume', label: 'Download Resume', icon: <Download size={16} />,
      action: () => { onClose(); window.open(config.resumeUrl, '_blank'); },
      group: 'Actions'
    },
    {
      id: 'github', label: 'Open GitHub', icon: <GithubIcon size={16} />,
      action: () => { onClose(); window.open(config.github, '_blank'); },
      group: 'Actions'
    },
    {
      id: 'email', label: 'Send Email', icon: <Mail size={16} />,
      action: () => { onClose(); window.open(`mailto:${config.email}`); },
      group: 'Actions'
    },
  ];

  const filtered = query.trim()
    ? commands.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.description?.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      if (e.key === 'Enter' && filtered[selected]) { filtered[selected].action(); }
      if (e.key === 'Escape') { onClose(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, selected, filtered, onClose]);

  const groups = [...new Set(filtered.map(c => c.group))];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="cmd-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="cmd-palette"
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Command palette"
            aria-modal="true"
          >
            <div className="cmd-input-wrapper">
              <Search size={16} className="cmd-search-icon" />
              <input
                ref={inputRef}
                type="text"
                className="cmd-input"
                placeholder="Type a command or search..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                aria-label="Search commands"
              />
              <kbd className="cmd-esc-hint">ESC</kbd>
            </div>

            <div className="cmd-results">
              {filtered.length === 0 ? (
                <div className="cmd-empty">No commands found for "{query}"</div>
              ) : (
                groups.map(group => {
                  const groupCmds = filtered.filter(c => c.group === group);
                  let globalIndex = 0;
                  return (
                    <div key={group} className="cmd-group">
                      <div className="cmd-group-label font-mono">{group}</div>
                      {groupCmds.map((cmd) => {
                        const idx = filtered.indexOf(cmd);
                        return (
                          <button
                            key={cmd.id}
                            className={`cmd-item ${idx === selected ? 'cmd-item--selected' : ''}`}
                            onClick={cmd.action}
                            onMouseEnter={() => setSelected(idx)}
                          >
                            <span className="cmd-item-icon">{cmd.icon}</span>
                            <span className="cmd-item-label">{cmd.label}</span>
                            {cmd.description && (
                              <span className="cmd-item-desc">{cmd.description}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            <div className="cmd-footer font-mono">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span>esc close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
