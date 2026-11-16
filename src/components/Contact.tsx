import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Copy, Check, Loader2 } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from './SocialIcons';
import emailjs from '@emailjs/browser';
import { config } from '../data/config';
import './Contact.css';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim() || data.name.trim().length < 2) errors.name = 'Name must be at least 2 characters.';
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Please enter a valid email address.';
  if (!data.subject.trim() || data.subject.trim().length < 3) errors.subject = 'Subject must be at least 3 characters.';
  if (!data.message.trim() || data.message.trim().length < 10) errors.message = 'Message must be at least 10 characters.';
  return errors;
}

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const newErrors = validateForm({ ...formData, [name]: value });
      setErrors(prev => ({ ...prev, [name]: newErrors[name as keyof FormErrors] }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const newErrors = validateForm(formData);
    setErrors(prev => ({ ...prev, [name]: newErrors[name as keyof FormErrors] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = { name: true, email: true, subject: true, message: true };
    setTouched(allTouched);
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setStatus('loading');

    // Check if EmailJS is configured
    const { serviceId, templateId, publicKey } = config.emailjs;
    const isEmailJSConfigured = serviceId && templateId && publicKey;

    if (isEmailJSConfigured) {
      try {
        await emailjs.send(serviceId, templateId, {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_email: config.email,
        }, publicKey);
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTouched({});
      } catch {
        setStatus('error');
      }
    } else {
      // Fallback: open mailto link
      const mailto = `mailto:${config.email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`From: ${formData.name} <${formData.email}>\n\n${formData.message}`)}`;
      window.open(mailto);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTouched({});
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(config.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const socialLinks = [
    { icon: <Mail size={18} />, label: 'Email', href: `mailto:${config.email}`, text: config.emailDisplay },
    { icon: <LinkedinIcon size={18} />, label: 'LinkedIn', href: config.linkedin, text: 'linkedin.com/in/bhaveshkumar' },
    { icon: <GithubIcon size={18} />, label: 'GitHub', href: config.github, text: 'github.com/bhaveshkumar' },
  ];

  return (
    <section id="contact" className="section contact">
      <div className="contact__bg" aria-hidden="true" />
      <div className="container">
        {/* Header */}
        <motion.div
          className="section-label"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          05 — LET'S CONNECT
        </motion.div>

        <motion.h2
          className="contact__headline"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        >
          Have an idea?
          <br />
          <span className="gradient-text">Let's build something meaningful.</span>
        </motion.h2>

        <motion.p
          className="contact__subtext"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          I'm interested in learning from ambitious teams, contributing to meaningful projects,
          and connecting with people who enjoy building great technology.
        </motion.p>

        <div className="contact__grid">
          {/* Left: Social & info */}
          <motion.div
            className="contact__info"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <div className="contact__social-links">
              {socialLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  className="contact__social-item"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                >
                  <a
                    href={link.href}
                    target={link.href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="contact__social-link"
                    aria-label={link.label}
                  >
                    <div className="contact__social-icon">{link.icon}</div>
                    <div className="contact__social-text">
                      <span className="contact__social-label font-mono">{link.label}</span>
                      <span className="contact__social-value">{link.text}</span>
                    </div>
                  </a>
                  {link.label === 'Email' && (
                    <button
                      className="contact__copy-btn"
                      onClick={copyEmail}
                      aria-label="Copy email to clipboard"
                      title="Copy email"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="contact__info-card">
              <div className="contact__info-card-title font-mono">RESPONSE TIME</div>
              <p>I typically respond within 24–48 hours. For urgent matters, email is the fastest way to reach me.</p>
            </div>
          </motion.div>

          {/* Right: Contact form */}
          <motion.div
            className="contact__form-wrapper"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            {status === 'success' ? (
              <motion.div
                className="contact__success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="contact__success-icon">
                  <Check size={28} />
                </div>
                <h3>Message sent!</h3>
                <p>Thanks for reaching out. I'll get back to you soon.</p>
                <button
                  className="btn btn-ghost"
                  onClick={() => setStatus('idle')}
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form
                ref={formRef}
                className="contact__form"
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="contact__form-row">
                  <div className="contact__field">
                    <label className="contact__label" htmlFor="contact-name">Name *</label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      className={`contact__input ${errors.name && touched.name ? 'contact__input--error' : ''}`}
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
                      aria-invalid={!!(errors.name && touched.name)}
                    />
                    {errors.name && touched.name && (
                      <span id="name-error" className="contact__error" role="alert">{errors.name}</span>
                    )}
                  </div>

                  <div className="contact__field">
                    <label className="contact__label" htmlFor="contact-email">Email *</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      className={`contact__input ${errors.email && touched.email ? 'contact__input--error' : ''}`}
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
                      aria-invalid={!!(errors.email && touched.email)}
                    />
                    {errors.email && touched.email && (
                      <span id="email-error" className="contact__error" role="alert">{errors.email}</span>
                    )}
                  </div>
                </div>

                <div className="contact__field">
                  <label className="contact__label" htmlFor="contact-subject">Subject *</label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    className={`contact__input ${errors.subject && touched.subject ? 'contact__input--error' : ''}`}
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-describedby={errors.subject && touched.subject ? 'subject-error' : undefined}
                    aria-invalid={!!(errors.subject && touched.subject)}
                  />
                  {errors.subject && touched.subject && (
                    <span id="subject-error" className="contact__error" role="alert">{errors.subject}</span>
                  )}
                </div>

                <div className="contact__field">
                  <label className="contact__label" htmlFor="contact-message">Message *</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    className={`contact__input contact__textarea ${errors.message && touched.message ? 'contact__input--error' : ''}`}
                    placeholder="Tell me about your project, idea, or just say hi..."
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-describedby={errors.message && touched.message ? 'message-error' : undefined}
                    aria-invalid={!!(errors.message && touched.message)}
                  />
                  {errors.message && touched.message && (
                    <span id="message-error" className="contact__error" role="alert">{errors.message}</span>
                  )}
                </div>

                {status === 'error' && (
                  <div className="contact__form-error" role="alert">
                    Something went wrong. Please try emailing me directly at{' '}
                    <a href={`mailto:${config.email}`}>{config.email}</a>
                  </div>
                )}

                <motion.button
                  type="submit"
                  className="btn btn-primary contact__submit"
                  disabled={status === 'loading'}
                  whileHover={{ scale: status === 'loading' ? 1 : 1.02 }}
                  whileTap={{ scale: status === 'loading' ? 1 : 0.97 }}
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 size={16} className="contact__spinner" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
