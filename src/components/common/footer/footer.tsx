import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-pink-500">Homely</h2>

            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
              Find trusted rooms, apartments, and hotels across Bangladesh.
              Homely makes booking and hosting simple, secure, and affordable.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>

            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-pink-400 transition">
                  Home
                </Link>
              </li>

              <li>
                <Link href="/properties" className="hover:text-pink-400 transition">
                  Properties
                </Link>
              </li>

              <li>
                <Link href="/about" className="hover:text-pink-400 transition">
                  About Us
                </Link>
              </li>

              <li>
                <Link href="/contact" className="hover:text-pink-400 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact</h3>

            <div className="space-y-4 text-sm text-slate-400">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-pink-500" />
                support@homely.com
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-pink-500" />
                Dhaka, Bangladesh
              </div>

              <div className="flex gap-4 pt-2">
                <a
                  href="#"
                  className="rounded-full bg-slate-800 p-2 hover:bg-pink-500 transition"
                >
                  <Facebook size={18} />
                </a>

                <a
                  href="#"
                  className="rounded-full bg-slate-800 p-2 hover:bg-pink-500 transition"
                >
                  <Instagram size={18} />
                </a>

                <a
                  href="#"
                  className="rounded-full bg-slate-800 p-2 hover:bg-pink-500 transition"
                >
                  <Twitter size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          © {currentYear} <span className="text-pink-500">Homely</span>. All
          rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;