import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white ">
      <div className="container mx-auto px-6 p-10 max-w-7xl">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">CareerPro</h3>
            <p className="text-indigo-100">
              Empowering professionals to reach new heights in their careers
              through AI-driven insights and personalized development plans.
            </p>
          </div>
          <div className="flex flex-col gap-4"></div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-indigo-100 hover:text-white transition duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-indigo-100 hover:text-white transition duration-300"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie-policy"
                  className="text-indigo-100 hover:text-white transition duration-300"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-indigo-100 hover:text-white transition duration-300"
                >
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-indigo-100 hover:text-white transition duration-300"
                >
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-indigo-100 hover:text-white transition duration-300"
                >
                  Facebook
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-indigo-100 hover:text-white transition duration-300"
                >
                  Instagram
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-indigo-400 text-center text-indigo-100">
          <p>&copy; 2023 CareerPro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
