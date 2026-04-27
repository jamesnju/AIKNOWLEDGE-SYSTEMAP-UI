'use client';

import Link from 'next/link';
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import Image from 'next/image';
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div >
                <Link href="/" className="flex items-center space-x-2 col-2">
                      <div className="relative w-8 h-8">
                        <Image
                          src="/logos.png"
                          alt="AgriPoa"
                          fill
                          className="object-contain"
                        />
                      </div>
            <h3 className="text-2xl font-bold text-primary mb-4 pt-2">AgriPoa</h3>
                     
                    </Link>
            <p className="text-gray-400">
              Empowering African farmers with expert knowledge and sustainable farming solutions.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-gray-400 hover:text-primary transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  Farming Guides
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  Pest Control
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  Crop Management
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <FiMapPin className="text-primary" />
                <span>Nairobi, Kenya</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <FiPhone className="text-primary" />
                <span>+254 123 456 789</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <FiMail className="text-primary" />
                <span>info@agripoa.com</span>
              </div>
            </div>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <FiInstagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} AgriPoa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}