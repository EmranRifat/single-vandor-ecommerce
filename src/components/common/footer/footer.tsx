import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">ShopHub</h3>
            <p className="text-gray-400 text-sm leading-6">
              Your trusted online shopping destination for quality products,
              fast delivery, and great service.
            </p>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="/contact" className="hover:text-white transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/shipping" className="hover:text-white transition">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="/returns" className="hover:text-white transition">
                  Returns
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:text-white transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-lg font-semibold mb-4">About</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="/about" className="hover:text-white transition">
                  Our Story
                </a>
              </li>
              <li>
                <a href="/careers" className="hover:text-white transition">
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  className="hover:text-white transition"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-white transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get latest offers and updates.
            </p>

            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Enter your email"
                className="w-full rounded-md bg-gray-900 border border-gray-700 px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="rounded-md bg-white text-gray-950 px-4 py-2 text-sm font-medium hover:bg-gray-200 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>&copy; {currentYear} ShopHub. All rights reserved.</p>

          <div className="flex gap-5">
            <a href="#" className="hover:text-white transition">
              Facebook
            </a>
            <a href="#" className="hover:text-white transition">
              Instagram
            </a>
            <a href="#" className="hover:text-white transition">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
