'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  FiMail, 
  FiMapPin, 
  FiPhone, 
  FiClock, 
  FiSend, 
  FiCheckCircle,
  FiMessageCircle,
  FiGlobe,
  FiTwitter,
  FiFacebook,
  FiLinkedin,
  FiInstagram,
  FiYoutube
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import AIChatbot from '../aisection/page';


export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: FiMapPin,
      title: "Visit Us",
      details: ["123 AgriPoa Street", "Nairobi, Kenya", "00100"],
      color: "from-red-500 to-pink-500"
    },
    {
      icon: FiPhone,
      title: "Call Us",
      details: ["+254 700 123 456", "+254 722 987 654", "Mon-Fri, 8am-6pm"],
      color: "from-green-500 to-green-600"
    },
    {
      icon: FiMail,
      title: "Email Us",
      details: ["hello@agripoa.com", "support@agripoa.com", "partners@agripoa.com"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: FiClock,
      title: "Working Hours",
      details: ["Monday - Friday: 8:00 AM - 6:00 PM", "Saturday: 9:00 AM - 1:00 PM", "Sunday: Closed"],
      color: "from-purple-500 to-indigo-500"
    }
  ];

  const faqs = [
    {
      question: "How does AgriPoa's AI disease detection work?",
      answer: "Our AI analyzes uploaded crop images using deep learning algorithms trained on millions of images to identify diseases and pests with over 98% accuracy."
    },
    {
      question: "Is AgriPoa free to use?",
      answer: "Yes! Our basic features including disease detection and farming tips are completely free. Premium features for advanced analytics are available at affordable rates."
    },
    {
      question: "Do I need internet access to use AgriPoa?",
      answer: "While internet access provides the best experience, our mobile app offers offline functionality for basic disease detection in remote areas."
    },
    {
      question: "How can I partner with AgriPoa?",
      answer: "We welcome partnerships with agricultural organizations, research institutions, and NGOs. Please reach out through our partnership email."
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="inline-block mb-6"
            >
              <span className="bg-yellow-400 text-green-600 px-4 py-2 rounded-full text-sm font-bold">
                Get in Touch
              </span>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-gray-100">
              Have questions? We'd love to hear from you. Our team is here to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <div className={`bg-gradient-to-r ${info.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}>
                  <info.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{info.title}</h3>
                <div className="space-y-1">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-3xl font-bold text-green-600 mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Partnership">Partnership Opportunity</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Bug Report">Bug Report</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : submitted ? (
                    <>
                      <FiCheckCircle size={20} />
                      Sent Successfully!
                    </>
                  ) : (
                    <>
                      <FiSend size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Map & Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Map */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="h-64 bg-gray-200 relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8197441395466!2d36.821466!3d-1.286389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d4b9c1e8b9%3A0x8b5c9e7f3a2d1f4!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2s!4v1699999999999!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="AgriPoa Location"
                  ></iframe>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-green-600 mb-4">Connect With Us</h3>
                <p className="text-gray-600 mb-6">
                  Follow us on social media for updates, farming tips, and community news.
                </p>
                <div className="flex gap-4 flex-wrap">
                  {[
                    { icon: FiTwitter, name: "Twitter", color: "bg-blue-400", link: "https://twitter.com/agripoa" },
                    { icon: FiFacebook, name: "Facebook", color: "bg-blue-600", link: "https://facebook.com/agripoa" },
                    { icon: FiLinkedin, name: "LinkedIn", color: "bg-blue-700", link: "https://linkedin.com/company/agripoa" },
                    { icon: FiInstagram, name: "Instagram", color: "bg-pink-600", link: "https://instagram.com/agripoa" },
                    { icon: FiYoutube, name: "YouTube", color: "bg-red-600", link: "https://youtube.com/agripoa" },
                    { icon: FiGlobe, name: "Blog", color: "bg-green-600", link: "https://blog.agripoa.com" }
                  ].map((social, idx) => (
                    <a
                      key={idx}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${social.color} text-white p-3 rounded-full hover:scale-110 transition-transform`}
                    >
                      <social.icon size={20} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Emergency Support */}
              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl shadow-xl p-8 border border-red-200">
                <div className="flex items-start gap-4">
                  <div className="bg-red-500 rounded-full p-3 animate-pulse">
                    <FiMessageCircle className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-red-600 mb-2">Emergency Support</h3>
                    <p className="text-gray-700 mb-3">
                      For urgent farming emergencies or disease outbreaks, contact our emergency hotline:
                    </p>
                    <p className="text-2xl font-bold text-red-600">+254 700 123 456</p>
                    <p className="text-sm text-gray-600 mt-2">Available 24/7 for emergencies</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Find quick answers to common questions about AgriPoa
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <p className="text-gray-600">
              Still have questions?{" "}
              <Link href="/help" className="text-green-600 font-semibold hover:underline">
                Visit our Help Center
              </Link>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay Updated with AgriPoa
            </h2>
            <p className="text-lg mb-8">
              Subscribe to our newsletter for farming tips, product updates, and success stories.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              <button
                type="submit"
                className="bg-yellow-400 text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-all transform hover:scale-105"
              >
                Subscribe
              </button>
            </form>
            <p className="text-sm mt-4 text-gray-200">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </section>

      <AIChatbot />
    </main>
  );
}