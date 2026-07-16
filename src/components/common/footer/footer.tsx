import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 text-white border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-10 md:grid-cols-3">

          {/* Brand */}
          <div>
            <h2 className="bg-gradient-to-r from-pink-500 via-rose-400 to-orange-400 bg-clip-text text-2xl font-bold text-transparent">
              Homely
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">
              Find trusted rooms, apartments, and hotels across Bangladesh.
              Homely makes booking and hosting simple, secure, and affordable.
            </p>
          </div>


          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link
                  href="/"
                  className="transition-all duration-300 hover:translate-x-1 hover:text-pink-400 inline-block"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/properties"
                  className="transition-all duration-300 hover:translate-x-1 hover:text-pink-400 inline-block"
                >
                  Properties
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="transition-all duration-300 hover:translate-x-1 hover:text-pink-400 inline-block"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="transition-all duration-300 hover:translate-x-1 hover:text-pink-400 inline-block"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>


          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              Contact
            </h3>

            <div className="space-y-4 text-sm text-slate-300">

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-pink-500" />
                support@homely.com
              </div>


              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-pink-500" />
                Dhaka, Bangladesh
              </div>


              {/* Social */}
              <div className="flex gap-4 pt-3">

                <a
                  href="#"
                  className="
                    rounded-full
                    border border-slate-700
                    bg-slate-800/70
                    p-2.5
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-pink-500
                    hover:bg-gradient-to-r
                    hover:from-pink-500
                    hover:to-rose-500
                    hover:shadow-lg
                    hover:shadow-pink-500/30
                  "
                >
                  <Facebook size={18} />
                </a>


                <a
                  href="#"
                  className="
                    rounded-full
                    border border-slate-700
                    bg-slate-800/70
                    p-2.5
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-pink-500
                    hover:bg-gradient-to-r
                    hover:from-pink-500
                    hover:to-rose-500
                    hover:shadow-lg
                    hover:shadow-pink-500/30
                  "
                >
                  <Instagram size={18} />
                </a>


                <a
                  href="#"
                  className="
                    rounded-full
                    border border-slate-700
                    bg-slate-800/70
                    p-2.5
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-pink-500
                    hover:bg-gradient-to-r
                    hover:from-pink-500
                    hover:to-rose-500
                    hover:shadow-lg
                    hover:shadow-pink-500/30
                  "
                >
                  <Twitter size={18} />
                </a>

              </div>

            </div>
          </div>

        </div>


        {/* Bottom */}
        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-sm text-slate-400">
          © {currentYear}{" "}
          <span className="bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text font-semibold text-transparent">
            Homely
          </span>
          . All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;