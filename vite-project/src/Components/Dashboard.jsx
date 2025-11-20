

import React from 'react';
import {
  FaFileInvoiceDollar,
  FaReceipt,
  FaCogs,
  FaUserCircle,
  FaHeadset,
  FaChartLine, // New icon for Sales Details
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-[90vh]">
      <h1 className="text-4xl font-extrabold text-center text-[#00668c] mb-10">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Generate Invoice Card */}
        <Link
          to="/generate-invoice"
          className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out text-center group"
        >
          <div className="bg-gradient-to-tr from-[#00c6ff] to-[#0072ff] p-4 rounded-full mb-6">
            <FaFileInvoiceDollar className="text-white text-5xl" />
          </div>
          <p className="font-bold text-xl text-[#333] group-hover:text-[#00668c]">Generate Invoice</p>
        </Link>

        {/* Bill History Card */}
        <Link
          to="/bill-history"
          className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out text-center group"
        >
          <div className="bg-gradient-to-tr from-[#ff7e5f] to-[#feb47b] p-4 rounded-full mb-6">
            <FaReceipt className="text-white text-5xl" />
          </div>
          <p className="font-bold text-xl text-[#333] group-hover:text-[#00668c]">Bills History</p>
        </Link>

        {/* Settings Card */}
        <Link
          to="/Settings"
          className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out text-center group"
        >
          <div className="bg-gradient-to-tr from-[#43cea2] to-[#185a9d] p-4 rounded-full mb-6">
            <FaCogs className="text-white text-5xl" />
          </div>
          <p className="font-bold text-xl text-[#333] group-hover:text-[#00668c]">Settings</p>
        </Link>

        {/* Edit Profile Card */}
        <Link
          to="/edit-profile"
          className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out text-center group"
        >
          <div className="bg-gradient-to-tr from-[#ff6a00] to-[#ee0979] p-4 rounded-full mb-6">
            <FaUserCircle className="text-white text-5xl" />
          </div>
          <p className="font-bold text-xl text-[#333] group-hover:text-[#00668c]">Edit Profile</p>
        </Link>

        {/* Customer Care Card */}
        <Link
          to="/CustomerCare"
          className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out text-center group"
        >
          <div className="bg-gradient-to-tr from-[#00c3ff] to-[#ffff1c] p-4 rounded-full mb-6">
            <FaHeadset className="text-white text-5xl" />
          </div>
          <p className="font-bold text-xl text-[#333] group-hover:text-[#00668c]">Customer Care</p>
        </Link>

        {/* Sales Details Card */}
        {/* <Link
          to="/Sales"
          className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out text-center group"
        >
          <div className="bg-gradient-to-tr from-[#8360c3] to-[#2ebf91] p-4 rounded-full mb-6">
            <FaChartLine className="text-white text-5xl" />
          </div>
          <p className="font-bold text-xl text-[#333] group-hover:text-[#00668c]">Sales Details</p>
        </Link> */}
      </div>
    </div>
  );
};

export default Dashboard;
// import React from 'react';
// import { FaFileInvoiceDollar, FaReceipt, FaCogs, FaUserCircle, FaHeadset } from 'react-icons/fa';
// import { Link } from 'react-router-dom';

// const Dashboard = () => {
//   return (
//     <div className="p-8 bg-gray-50 min-h-[90vh]">
//       <h1 className="text-4xl font-extrabold text-center text-[#00668c] mb-10">Dashboard</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
//         {/* Generate Invoice Card */}
//         <Link
//           to="/generate-invoice"
//           className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out text-center group"
//         >
//           <div className="bg-gradient-to-tr from-[#00c6ff] to-[#0072ff] p-4 rounded-full mb-6">
//             <FaFileInvoiceDollar className="text-white text-5xl" />
//           </div>
//           <p className="font-bold text-xl text-[#333] group-hover:text-[#00668c]">Generate Invoice</p>
//         </Link>

//         {/* Bill History Card */}
//         <Link
//           to="/bill-history"
//           className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out text-center group"
//         >
//           <div className="bg-gradient-to-tr from-[#ff7e5f] to-[#feb47b] p-4 rounded-full mb-6">
//             <FaReceipt className="text-white text-5xl" />
//           </div>
//           <p className="font-bold text-xl text-[#333] group-hover:text-[#00668c]">Bills History</p>
//         </Link>

//         {/* Settings Card */}
//         <Link
//           to="/Settings"
//           className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out text-center group"
//         >
//           <div className="bg-gradient-to-tr from-[#43cea2] to-[#185a9d] p-4 rounded-full mb-6">
//             <FaCogs className="text-white text-5xl" />
//           </div>
//           <p className="font-bold text-xl text-[#333] group-hover:text-[#00668c]">Settings</p>
//         </Link>

//         {/* Corrected Edit Profile Card */}
//         <Link
//           to="/edit-profile" // CHANGED FROM /edit-business-profile
//           className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out text-center group"
//         >
//           <div className="bg-gradient-to-tr from-[#ff6a00] to-[#ee0979] p-4 rounded-full mb-6">
//             <FaUserCircle className="text-white text-5xl" />
//           </div>
//           <p className="font-bold text-xl text-[#333] group-hover:text-[#00668c]">Edit Profile</p>
//         </Link>

//         {/* Contact Customer Care Card */}
//         <Link
//           to="/CustomerCare"
//           className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out text-center group"
//         >
//           <div className="bg-gradient-to-tr from-[#00c3ff] to-[#ffff1c] p-4 rounded-full mb-6">
//             <FaHeadset className="text-white text-5xl" />
//           </div>
//           <p className="font-bold text-xl text-[#333] group-hover:text-[#00668c]">Customer Care</p>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
// import React from 'react';
// import { FaFileInvoiceDollar, FaReceipt, FaCogs, FaUserCircle, FaHeadset } from 'react-icons/fa'; // changed icons for better style
// import { Link } from 'react-router-dom';

// const Dashboard = () => {
//   return (
//     <div className="p-8 bg-gray-50 min-h-[90vh]">
//       <h1 className="text-4xl font-extrabold text-center text-[#00668c] mb-10">Dashboard</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
//         {/* Generate Invoice Card */}
//         <Link
//           to="/generate-invoice"
//           className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out text-center group"
//         >
//           <div className="bg-gradient-to-tr from-[#00c6ff] to-[#0072ff] p-4 rounded-full mb-6">
//             <FaFileInvoiceDollar className="text-white text-5xl" />
//           </div>
//           <p className="font-bold text-xl text-[#333] group-hover:text-[#00668c]">Generate Invoice</p>
//         </Link>

//         {/* Bill History Card */}
//         <Link
//           to="/bill-history"
//           className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out text-center group"
//         >
//           <div className="bg-gradient-to-tr from-[#ff7e5f] to-[#feb47b] p-4 rounded-full mb-6">
//             <FaReceipt className="text-white text-5xl" />
//           </div>
//           <p className="font-bold text-xl text-[#333] group-hover:text-[#00668c]">Bills History</p>
//         </Link>

//         {/* Settings Card */}
//         <Link
//           to="/settings"
//           className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out text-center group"
//         >
//           <div className="bg-gradient-to-tr from-[#43cea2] to-[#185a9d] p-4 rounded-full mb-6">
//             <FaCogs className="text-white text-5xl" />
//           </div>
//           <p className="font-bold text-xl text-[#333] group-hover:text-[#00668c]">Settings</p>
//         </Link>

//         {/* Edit Business Profile Card */}
//         <Link
//           to="/edit-business-profile"
//           className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out text-center group"
//         >
//           <div className="bg-gradient-to-tr from-[#ff6a00] to-[#ee0979] p-4 rounded-full mb-6">
//             <FaUserCircle className="text-white text-5xl" />
//           </div>
//           <p className="font-bold text-xl text-[#333] group-hover:text-[#00668c]">Edit Profile</p>
//         </Link>

//         {/* Contact Customer Care Card */}
//         <Link
//           to="/contact-customer-care"
//           className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out text-center group"
//         >
//           <div className="bg-gradient-to-tr from-[#00c3ff] to-[#ffff1c] p-4 rounded-full mb-6">
//             <FaHeadset className="text-white text-5xl" />
//           </div>
//           <p className="font-bold text-xl text-[#333] group-hover:text-[#00668c]">Customer Care</p>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
// import React from 'react';
// import { FaFileInvoice, FaHistory, FaCog, FaUserEdit, FaPhoneAlt } from 'react-icons/fa';
// import { Link } from 'react-router-dom';

// const Dashboard = () => {
//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold text-center text-[#00668c] mb-8">Dashboard</h1>
      
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {/* Generate Invoice Card */}
//         <Link
//           to="/generate-invoice"
//           className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out text-center"
//         >
//           <FaFileInvoice className="text-4xl text-[#00668c] mb-4" />
//           <p className="font-semibold text-lg text-[#333]">Generate Invoice</p>
//         </Link>

//         {/* Bill History Card */}
//         <Link
//           to="/bill-history"
//           className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out text-center"
//         >
//           <FaHistory className="text-4xl text-[#00668c] mb-4" />
//           <p className="font-semibold text-lg text-[#333]">Bills History</p>
//         </Link>

//         {/* Settings Card */}
//         <Link
//           to="/settings"
//           className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out text-center"
//         >
//           <FaCog className="text-4xl text-[#00668c] mb-4" />
//           <p className="font-semibold text-lg text-[#333]">Settings</p>
//         </Link>

//         {/* Edit Business Profile Card */}
//         <Link
//           to="/edit-business-profile"
//           className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out text-center"
//         >
//           <FaUserEdit className="text-4xl text-[#00668c] mb-4" />
//           <p className="font-semibold text-lg text-[#333]">Edit Profile</p>
//         </Link>

//         {/* Contact Customer Care Card */}
//         <Link
//           to="/contact-customer-care"
//           className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out text-center"
//         >
//           <FaPhoneAlt className="text-4xl text-[#00668c] mb-4" />
//           <p className="font-semibold text-lg text-[#333]">Contact Customer Care</p>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


// import React from 'react';
// import { FaFileInvoice, FaHistory, FaCog, FaUserEdit, FaPhoneAlt } from 'react-icons/fa';
// import { Link } from 'react-router-dom';

// const Dashboard = () => {
//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold text-center text-[#00668c] mb-8">Dashboard</h1>
      
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {/* Generate Invoice Card */}
//         <Link
//           to="/generate-invoice"
//           className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out text-center"
//         >
//           <FaFileInvoice className="text-4xl text-[#00668c] mb-4" />
//           <p className="font-semibold text-lg text-[#333]">Generate Invoice</p>
//         </Link>

//         {/* Bills History Card */}
//         <Link
//           to="/bills-history"
//           className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out text-center"
//         >
//           <FaHistory className="text-4xl text-[#00668c] mb-4" />
//           <p className="font-semibold text-lg text-[#333]">Bills History</p>
//         </Link>

//         {/* Settings Card */}
//         <Link
//           to="/settings"
//           className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out text-center"
//         >
//           <FaCog className="text-4xl text-[#00668c] mb-4" />
//           <p className="font-semibold text-lg text-[#333]">Settings</p>
//         </Link>

//         {/* Edit Business Profile Card */}
//         <Link
//           to="/edit-business-profile"
//           className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out text-center"
//         >
//           <FaUserEdit className="text-4xl text-[#00668c] mb-4" />
//           <p className="font-semibold text-lg text-[#333]">Edit Profile</p>
//         </Link>

//         {/* Contact Customer Care Card */}
//         <Link
//           to="/contact-customer-care"
//           className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out text-center"
//         >
//           <FaPhoneAlt className="text-4xl text-[#00668c] mb-4" />
//           <p className="font-semibold text-lg text-[#333]">Contact Customer Care</p>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
// import React from 'react';
// import { FaFileInvoice, FaHistory, FaCog, FaUserEdit, FaPhoneAlt } from 'react-icons/fa'; // Importing icons
// import { Link } from 'react-router-dom';

// const Dashboard = () => {
//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold text-center text-[#00668c] mb-8">Dashboard</h1>
      
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {/* Generate Invoice Card */}
//         <Link
//           to="/generate-invoice"
//           className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out text-center"
//         >
//           <FaFileInvoice className="text-4xl text-[#00668c] mb-4" />
//           <p className="font-semibold text-lg text-[#333]">Generate Invoice</p>
//         </Link>

//         {/* Bills History Card */}
//         <Link
//           to="/bills-history"
//           className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out text-center"
//         >
//           <FaHistory className="text-4xl text-[#00668c] mb-4" />
//           <p className="font-semibold text-lg text-[#333]">Bills History</p>
//         </Link>

//         {/* Settings Card */}
//         <Link
//           to="/settings"
//           className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out text-center"
//         >
//           <FaCog className="text-4xl text-[#00668c] mb-4" />
//           <p className="font-semibold text-lg text-[#333]">Settings</p>
//         </Link>

//         {/* Edit Business Profile Card */}
//         <Link
//           to="/edit-business-profile"
//           className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out text-center"
//         >
//           <FaUserEdit className="text-4xl text-[#00668c] mb-4" />
//           <p className="font-semibold text-lg text-[#333]">Edit Profile</p>
//         </Link>

//         {/* Contact Customer Care Card */}
//         <Link
//           to="/contact-customer-care"
//           className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out text-center"
//         >
//           <FaPhoneAlt className="text-4xl text-[#00668c] mb-4" />
//           <p className="font-semibold text-lg text-[#333]">Contact Customer Care</p>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
