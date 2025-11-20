import React from 'react';
import { FaHeadset, FaEnvelope, FaPhoneAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const CustomerCare = () => {
  return (
    <section className="py-16 bg-white dark:bg-gray-900 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Customer Support</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We're here to help you 24/7. Choose your preferred support channel below.
          </p>
        </div>

        {/* Support Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Live Chat */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <FaHeadset className="text-2xl text-gray-800 dark:text-gray-200 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Live Chat</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Get instant help from our support team in real-time.
            </p>
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition">
              Start Chat
            </button>
          </div>

          {/* Email Support */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <FaEnvelope className="text-2xl text-gray-800 dark:text-gray-200 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Email Us</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Send us an email and we'll respond within 2 hours.
            </p>
            <a
              href="mailto:support@invoicegen.com"
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition inline-block"
            >
              Email Support
            </a>
          </div>

          {/* Phone Support */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <FaPhoneAlt className="text-2xl text-gray-800 dark:text-gray-200 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Call Us</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Speak directly with our support representatives.
            </p>
            <a
              href="tel:+18001234567"
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition inline-block"
            >
              +1 (800) 123-4567
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm p-8 md:p-12 mb-16">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Send us a message</h3>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-800 dark:text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-gray-800 focus:border-gray-800"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-gray-800 dark:text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-gray-800 focus:border-gray-800"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-800 dark:text-gray-300 mb-2">Subject</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-gray-800 focus:border-gray-800"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className="block text-gray-800 dark:text-gray-300 mb-2">Message</label>
              <textarea
                rows="5"
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-gray-800 focus:border-gray-800"
                placeholder="Describe your issue..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-md transition"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Company Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-600 dark:text-gray-300">
          <div className="flex items-start">
            <FaClock className="text-xl text-gray-800 dark:text-gray-200 mt-1 mr-4" />
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Working Hours</h4>
              <p>Monday - Friday: 9 AM - 8 PM</p>
              <p>Saturday: 10 AM - 6 PM</p>
              <p>Sunday: Emergency Support Only</p>
            </div>
          </div>
          <div className="flex items-start">
            <FaMapMarkerAlt className="text-xl text-gray-800 dark:text-gray-200 mt-1 mr-4" />
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Our Office</h4>
              <p>123 Invoice Street</p>
              <p>Financial District</p>
              <p>Mumbai 400001, India</p>
            </div>
          </div>
          <div className="flex items-start">
            <FaEnvelope className="text-xl text-gray-800 dark:text-gray-200 mt-1 mr-4" />
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Other Contacts</h4>
              <p>Sales: sales@invoicegen.com</p>
              <p>Careers: careers@invoicegen.com</p>
              <p>Feedback: feedback@invoicegen.com</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerCare;
// import React from 'react';
// import { FaHeadset, FaEnvelope, FaPhoneAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

// const CustomerCare = () => {
//   return (
//     <section className="py-16 bg-white dark:bg-gray-900 px-6 md:px-12">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-16">
//           <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Customer Support</h2>
//           <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
//             We're here to help you 24/7. Choose your preferred support channel below.
//           </p>
//         </div>

//         {/* Support Channels */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
//           {/* Live Chat */}
//           <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
//             <div className="flex items-center mb-4">
//               <FaHeadset className="text-2xl text-indigo-600 dark:text-indigo-400 mr-3" />
//               <h3 className="text-xl font-semibold dark:text-white">Live Chat</h3>
//             </div>
//             <p className="text-gray-600 dark:text-gray-300 mb-4">
//               Get instant help from our support team in real-time.
//             </p>
//             <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition">
//               Start Chat
//             </button>
//           </div>

//           {/* Email Support */}
//           <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
//             <div className="flex items-center mb-4">
//               <FaEnvelope className="text-2xl text-indigo-600 dark:text-indigo-400 mr-3" />
//               <h3 className="text-xl font-semibold dark:text-white">Email Us</h3>
//             </div>
//             <p className="text-gray-600 dark:text-gray-300 mb-4">
//               Send us an email and we'll respond within 2 hours.
//             </p>
//             <a
//               href="mailto:support@invoicegen.com"
//               className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition inline-block"
//             >
//               Email Support
//             </a>
//           </div>

//           {/* Phone Support */}
//           <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
//             <div className="flex items-center mb-4">
//               <FaPhoneAlt className="text-2xl text-indigo-600 dark:text-indigo-400 mr-3" />
//               <h3 className="text-xl font-semibold dark:text-white">Call Us</h3>
//             </div>
//             <p className="text-gray-600 dark:text-gray-300 mb-4">
//               Speak directly with our support representatives.
//             </p>
//             <a
//               href="tel:+18001234567"
//               className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition inline-block"
//             >
//               +1 (800) 123-4567
//             </a>
//           </div>
//         </div>

//         {/* Contact Form */}
//         <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm p-8 md:p-12 mb-16">
//           <h3 className="text-2xl font-semibold dark:text-white mb-6">Send us a message</h3>
//           <form className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
//                 <input
//                   type="text"
//                   className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Your name"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
//                 <input
//                   type="email"
//                   className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="your@email.com"
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-gray-700 dark:text-gray-300 mb-2">Subject</label>
//               <input
//                 type="text"
//                 className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="How can we help?"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700 dark:text-gray-300 mb-2">Message</label>
//               <textarea
//                 rows="5"
//                 className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="Describe your issue..."
//               ></textarea>
//             </div>
//             <button
//               type="submit"
//               className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md transition"
//             >
//               Send Message
//             </button>
//           </form>
//         </div>

//         {/* Company Info */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-600 dark:text-gray-300">
//           <div className="flex items-start">
//             <FaClock className="text-xl text-indigo-600 dark:text-indigo-400 mt-1 mr-4" />
//             <div>
//               <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Working Hours</h4>
//               <p>Monday - Friday: 9 AM - 8 PM</p>
//               <p>Saturday: 10 AM - 6 PM</p>
//               <p>Sunday: Emergency Support Only</p>
//             </div>
//           </div>
//           <div className="flex items-start">
//             <FaMapMarkerAlt className="text-xl text-indigo-600 dark:text-indigo-400 mt-1 mr-4" />
//             <div>
//               <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Our Office</h4>
//               <p>123 Invoice Street</p>
//               <p>Financial District</p>
//               <p>Mumbai 400001, India</p>
//             </div>
//           </div>
//           <div className="flex items-start">
//             <FaEnvelope className="text-xl text-indigo-600 dark:text-indigo-400 mt-1 mr-4" />
//             <div>
//               <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Other Contacts</h4>
//               <p>Sales: sales@invoicegen.com</p>
//               <p>Careers: careers@invoicegen.com</p>
//               <p>Feedback: feedback@invoicegen.com</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CustomerCare;
