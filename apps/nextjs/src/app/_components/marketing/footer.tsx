"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Twitter, Linkedin, Github } from "lucide-react";

const footerSections = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Demo", href: "#demo" },
      { name: "API", href: "/docs/api" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Documentation", href: "/docs" },
      { name: "Help Center", href: "/help" },
      { name: "Community", href: "/community" },
      { name: "Status", href: "/status" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "GDPR", href: "/gdpr" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#0A0A0A] border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Brand section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="mb-6">
              <h2 className="font-vetski text-3xl text-white mb-2">Vetskii</h2>
              <p className="text-white/70 text-lg">
                Every vet's favourite sidekick.
              </p>
            </div>
            <p className="text-white/60 mb-6 max-w-md">
              Empowering veterinary professionals with intelligent insights, 
              real-time assistance, and automated documentation to enhance 
              patient care and practice efficiency.
            </p>
            
            {/* Contact info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white/60">
                <Mail className="h-4 w-4" />
                <span>hello@vetskii.com</span>
              </div>
              <div className="flex items-center gap-3 text-white/60">
                <Phone className="h-4 w-4" />
                <span>+61 2 6680 4200</span>
              </div>
              <div className="flex items-center gap-3 text-white/60">
                <MapPin className="h-4 w-4" />
                <span>Byron Bay, Australia</span>
              </div>
            </div>
          </motion.div>

          {/* Links sections */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-white font-semibold mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-white/10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Stay Updated
              </h3>
              <p className="text-white/60">
                Get the latest updates on our beta progress, new features, and veterinary insights.
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/70"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-lime-400 to-emerald-400 text-black font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-lime-400/25"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-white/10 flex flex-col lg:flex-row justify-between items-center gap-6"
        >
          <div className="text-white/60 text-sm">
            © 2024 Vetskii. All rights reserved.
          </div>
          
          {/* Social links */}
          <div className="flex items-center gap-4">
            <Link
              href="https://twitter.com/vetskii"
              className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <Twitter className="h-4 w-4" />
            </Link>
            <Link
              href="https://linkedin.com/company/vetskii"
              className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <Linkedin className="h-4 w-4" />
            </Link>
            <Link
              href="https://github.com/vetskii"
              className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <Github className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}