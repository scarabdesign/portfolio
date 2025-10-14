import React, { useState } from 'react';
import { Menu, X, FileDown, Printer } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Résumé' },
    { path: '/chess', label: 'Chess (React/Vite/NestJS)' },
    { path: '/samples', label: 'Sample Portfolio' },
  ];

  const externalLinks = [
    { href: 'https://github.com/scarabdesign', label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/sean-hankins/', label: 'LinkedIn' },
  ];

  return (
    <nav className="bg-slate-900 text-white shadow-lg print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold hover:text-slate-300 transition">
              Sean J. Hankins
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive(link.path)
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {externalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
              >
                {link.label}
              </a>
            ))}
            
            {/* Action Buttons */}
            <button
              onClick={() => window.print()}
              className="ml-2 p-2 rounded-md text-slate-300 hover:bg-slate-700 hover:text-white transition"
              title="Print"
            >
              <Printer size={20} />
            </button>
            <button
              onClick={() => window.open('/Resume_Sean_Hankins.pdf')}
              className="p-2 rounded-md text-slate-300 hover:bg-slate-700 hover:text-white transition"
              title="Download PDF"
            >
              <FileDown size={20} />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-md text-slate-300 hover:bg-slate-700 hover:text-white transition"
              title="Print"
            >
              <Printer size={20} />
            </button>
            <button
              onClick={() => window.open('/Resume_Sean_Hankins.pdf')}
              className="p-2 rounded-md text-slate-300 hover:bg-slate-700 hover:text-white transition"
              title="Download PDF"
            >
              <FileDown size={20} />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-300 hover:bg-slate-700 hover:text-white transition"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition ${
                  isActive(link.path)
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {externalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}