import React from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowUp } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';
import { config } from '../data/config';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer__separator" />
      <div className="container footer__inner">
        {/* Logo + tagline */}
        <div className="footer__brand">
          <div className="footer__monogram">{config.monogram}</div>
          <div>
            <div className="footer__name">{config.name}</div>
            <div className="footer__tagline">
              Designed with intention. Built with curiosity.
            </div>
          </div>
        </div>

        {/* Social links */}
        <div className="footer__socials">
          <a
            href={config.github}
            target="_blank"
            rel="noopener noreferrer"
            className="footer__social-link"
            aria-label="GitHub"
          >
            <GithubIcon size={16} />
          </a>
          <a
            href={config.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="footer__social-link"
            aria-label="LinkedIn"
          >
            <LinkedinIcon size={16} />
          </a>
          <a
            href={`mailto:${config.email}`}
            className="footer__social-link"
            aria-label="Email"
          >
            <Mail size={16} />
          </a>
        </div>

        {/* Credit & year */}
        <div className="footer__credit">
          <span className="font-mono">
            © {year} {config.name} · Built with React + Vite
          </span>
        </div>

        {/* Back to top */}
        <motion.button
          className="footer__back-top"
          onClick={scrollToTop}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Back to top"
        >
          <ArrowUp size={16} />
        </motion.button>
      </div>
    </footer>
  );
}
