import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Globe } from "lucide-react";

// Data
const courses = [
  { name: "Data Scientist", slug: "data-scientist" },
  { name: "Full Stack Web Developer", slug: "full-stack-web-developer" },
  { name: "Cloud Engineer", slug: "cloud-engineer" },
  { name: "Project Manager", slug: "project-manager" },
  { name: "Game Developer", slug: "game-developer" },
];

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com" },
  { icon: Twitter, href: "https://twitter.com" },
  { icon: Instagram, href: "https://instagram.com" },
  { icon: Linkedin, href: "https://linkedin.com" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1c1d1f] text-gray-300 pt-12 pb-6 px-6">
      
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto border-b border-gray-600 pb-8">
        <h2 className="text-sm font-semibold mb-6">
          Top companies choose <span className="text-white font-bold">Learnify Business</span> to build in-demand career skills.
        </h2>
        <div className="flex flex-wrap gap-8 text-gray-400 text-xs uppercase tracking-wider">
          <span>Nasdaq</span> <span>Volkswagen</span> <span>NetApp</span> <span>Eventbrite</span>
        </div>
      </div>

      {/* Main Grid Links */}
      <div className="max-w-7xl mx-auto py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        {/* Use a helper function for consistent link lists */}
        {[
          { title: "In-demand Careers", items: courses },
          { title: "Web Development", items: courses.slice(0, 3) },
          { title: "IT Certifications", items: courses.slice(0, 3) },
          { title: "Leadership", items: courses.slice(0, 3) },
        ].map((section, idx) => (
          <div key={idx}>
            <h3 className="text-white font-bold mb-4">{section.title}</h3>
            <ul className="space-y-2">
              {section.items.map((item) => (
                <li key={item.slug}>
                  <Link to={`/course/${item.slug}`} className="hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto border-t border-gray-600 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-black text-white">Learnify</h1>
          <p className="text-xs text-gray-400">© 2026 Learnify, Inc.</p>
        </div>

        {/* Social Links */}
        <div className="flex gap-4">
          {socialLinks.map((social, idx) => (
            <a 
              key={idx} 
              href={social.href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition"
            >
              <social.icon size={16} className="text-white" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}