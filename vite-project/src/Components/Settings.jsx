import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaLock,
  FaBell,
  FaMoon,
  FaSignOutAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import axios from "axios";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const [notifications, setNotifications] = useState(true);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivateError, setDeactivateError] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async () => {
    setMessage(null);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5000/api/auth/change-password",
        {
          currentPassword: passwords.current,
          newPassword: passwords.new,
          confirmPassword: passwords.confirm,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data.message);
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    }
  };

  const handleDeactivateAccount = async () => {
    setDeactivateError(null);
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5000/api/auth/deactivate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (err) {
      setDeactivateError(
        err.response?.data?.error || "Failed to deactivate account"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-12 px-4 md:px-0 flex justify-center">
      <div className="w-full max-w-2xl bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gap-2">
          <FaUser className="text-gray-600 dark:text-gray-300" /> Account Settings
        </h2>

        {/* Password Section */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
            <FaLock className="text-gray-600 dark:text-gray-400" /> Change Password
          </h3>
          <form className="space-y-4">
            {["current", "new", "confirm"].map((field, idx) => (
              <div key={idx}>
                <label className="block text-gray-600 dark:text-gray-400 mb-1">
                  {field === "current"
                    ? "Current Password"
                    : field === "new"
                    ? "New Password"
                    : "Confirm New Password"}
                </label>
                <input
                  type="password"
                  name={field}
                  value={passwords[field]}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-gray-800 focus:border-gray-800"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleChangePassword}
              className="mt-2 bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-md font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition"
            >
              Update Password
            </button>
            {message && <p className="text-green-600 mt-2">{message}</p>}
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </form>
        </div>

        {/* Preferences */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
            <FaBell className="text-gray-600 dark:text-gray-400" /> Preferences
          </h3>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700 dark:text-gray-300">Email Notifications</span>
            <button
              onClick={() => setNotifications((prev) => !prev)}
              className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 focus:outline-none ${
                notifications ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                  notifications ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 focus:outline-none ${
                darkMode ? "bg-black" : "bg-gray-300"
              }`}
            >
              <span
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                  darkMode ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-12 border-t pt-8 space-y-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold text-base"
          >
            <FaSignOutAlt /> Logout
          </button>
          <button
            onClick={() => setShowDeactivateModal(true)}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold text-base"
          >
            <FaExclamationTriangle /> Deactivate Account
          </button>
        </div>

        {/* Deactivation Modal */}
        {showDeactivateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <FaExclamationTriangle className="text-red-500 text-xl" />
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  Deactivate Account
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to deactivate your account? All invoices and data will be
                permanently deleted.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeactivateModal(false)}
                  className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeactivateAccount}
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                >
                  Confirm Deactivation
                </button>
              </div>
              {deactivateError && <p className="text-red-600 mt-4">{deactivateError}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
// import React, { useEffect, useState } from "react";
// import { FaUser, FaLock, FaBell, FaMoon, FaSignOutAlt, FaExclamationTriangle } from "react-icons/fa";
// import axios from "axios";

// const Settings = () => {
//   const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
//   const [notifications, setNotifications] = useState(true);
//   const [passwords, setPasswords] = useState({
//     current: "",
//     new: "",
//     confirm: "",
//   });
//   const [message, setMessage] = useState(null);
//   const [error, setError] = useState(null);
//   const [showDeactivateModal, setShowDeactivateModal] = useState(false);
//   const [deactivateError, setDeactivateError] = useState(null);
//   const [deactivateSuccess, setDeactivateSuccess] = useState(null);

//   useEffect(() => {
//     document.documentElement.classList.toggle("dark", darkMode);
//     localStorage.setItem("darkMode", darkMode);
//   }, [darkMode]);

//   const handlePasswordChange = (e) => {
//     setPasswords({ ...passwords, [e.target.name]: e.target.value });
//   };

//   const handleChangePassword = async () => {
//     setMessage(null);
//     setError(null);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.put(
//         "http://localhost:5000/api/auth/change-password",
//         {
//           currentPassword: passwords.current,
//           newPassword: passwords.new,
//           confirmPassword: passwords.confirm,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setMessage(res.data.message);
//       setPasswords({ current: "", new: "", confirm: "" });
//     } catch (err) {
//       setError(err.response?.data?.error || "Something went wrong.");
//     }
//   };

//   const handleDeactivateAccount = async () => {
//     setDeactivateError(null);
//     setDeactivateSuccess(null);
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete("http://localhost:5000/api/auth/deactivate", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setDeactivateSuccess("Account deactivated successfully");
//       // Clear user session and redirect
//       localStorage.removeItem("token");
//       window.location.href = "/";
//     } catch (err) {
//       setDeactivateError(err.response?.data?.error || "Failed to deactivate account");
//     }
//   };

//   return (
//     <div className="bg-white dark:bg-gray-900 min-h-screen py-12 px-4 md:px-0 flex justify-center">
//       <div className="w-full max-w-2xl bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg p-8">
//         <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gap-2">
//           <FaUser className="text-gray-600 dark:text-gray-300" /> Account Settings
//         </h2>

//         {/* Password Section */}
//         <div className="mb-10">
//           <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
//             <FaLock className="text-gray-600 dark:text-gray-400" /> Change Password
//           </h3>
//           <form className="space-y-4">
//             <div>
//               <label className="block text-gray-600 dark:text-gray-400 mb-1">Current Password</label>
//               <input
//                 type="password"
//                 name="current"
//                 value={passwords.current}
//                 onChange={handlePasswordChange}
//                 className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-gray-800 focus:border-gray-800"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-600 dark:text-gray-400 mb-1">New Password</label>
//               <input
//                 type="password"
//                 name="new"
//                 value={passwords.new}
//                 onChange={handlePasswordChange}
//                 className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-gray-800 focus:border-gray-800"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-600 dark:text-gray-400 mb-1">Confirm New Password</label>
//               <input
//                 type="password"
//                 name="confirm"
//                 value={passwords.confirm}
//                 onChange={handlePasswordChange}
//                 className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-gray-800 focus:border-gray-800"
//               />
//             </div>
//             <button
//               type="button"
//               onClick={handleChangePassword}
//               className="mt-2 bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-md font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition"
//             >
//               Update Password
//             </button>
//             {message && <p className="text-green-600 mt-2">{message}</p>}
//             {error && <p className="text-red-600 mt-2">{error}</p>}
//           </form>
//         </div>

//         {/* Preferences Section */}
//         <div className="mb-10">
//           <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
//             <FaBell className="text-gray-600 dark:text-gray-400" /> Preferences
//           </h3>
//           <div className="flex items-center justify-between mb-4">
//             <span className="text-gray-700 dark:text-gray-300">Email Notifications</span>
//             <button
//               onClick={() => setNotifications((prev) => !prev)}
//               className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 focus:outline-none ${
//                 notifications ? "bg-green-500" : "bg-gray-300"
//               }`}
//             >
//               <span
//                 className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
//                   notifications ? "translate-x-6" : "translate-x-1"
//                 }`}
//               />
//             </button>
//           </div>
//           <div className="flex items-center justify-between">
//             <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
//             <button
//               onClick={() => setDarkMode((prev) => !prev)}
//               className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 focus:outline-none ${
//                 darkMode ? "bg-black" : "bg-gray-300"
//               }`}
//             >
//               <span
//                 className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
//                   darkMode ? "translate-x-6" : "translate-x-1"
//                 }`}
//               />
//             </button>
//           </div>
//         </div>

//         {/* Danger Zone */}
//         <div className="mt-12 border-t pt-8 space-y-4">
//           <button className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold text-base">
//             <FaSignOutAlt /> Logout
//           </button>
//           <button 
//             onClick={() => setShowDeactivateModal(true)}
//             className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold text-base"
//           >
//             <FaExclamationTriangle /> Deactivate Account
//           </button>
//         </div>

//         {/* Deactivation Modal */}
//         {showDeactivateModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
//               <div className="flex items-center gap-3 mb-4">
//                 <FaExclamationTriangle className="text-red-500 text-xl" />
//                 <h3 className="text-lg font-bold text-gray-800 dark:text-white">Deactivate Account</h3>
//               </div>
//               <p className="text-gray-600 dark:text-gray-300 mb-6">
//                 Are you sure you want to deactivate your account? This action cannot be undone.
//               </p>
//               <div className="flex justify-end gap-4">
//                 <button
//                   onClick={() => setShowDeactivateModal(false)}
//                   className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDeactivateAccount}
//                   className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
//                 >
//                   Confirm Deactivation
//                 </button>
//               </div>
//               {deactivateError && <p className="text-red-600 mt-4">{deactivateError}</p>}
//               {deactivateSuccess && <p className="text-green-600 mt-4">{deactivateSuccess}</p>}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Settings;
// import React, { useEffect, useState } from "react";
// import { FaUser, FaLock, FaBell, FaMoon, FaSignOutAlt } from "react-icons/fa";
// import axios from "axios";

// const Settings = () => {
//   const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
//   const [notifications, setNotifications] = useState(true);
//   const [passwords, setPasswords] = useState({
//     current: "",
//     new: "",
//     confirm: "",
//   });
//   const [message, setMessage] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     document.documentElement.classList.toggle("dark", darkMode);
//     localStorage.setItem("darkMode", darkMode);
//   }, [darkMode]);

//   const handlePasswordChange = (e) => {
//     setPasswords({ ...passwords, [e.target.name]: e.target.value });
//   };

//   const handleChangePassword = async () => {
//     setMessage(null);
//     setError(null);
//     try {
//       const token = localStorage.getItem("token"); // Ensure you store token on login
//       const res = await axios.put(
//         "http://localhost:5000/api/auth/change-password",
//         {
//           currentPassword: passwords.current,
//           newPassword: passwords.new,
//           confirmPassword: passwords.confirm,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setMessage(res.data.message);
//       setPasswords({ current: "", new: "", confirm: "" });
//     } catch (err) {
//       setError(err.response?.data?.error || "Something went wrong.");
//     }
//   };

//   return (
//     <div className="bg-white dark:bg-gray-900 min-h-screen py-12 px-4 md:px-0 flex justify-center">
//       <div className="w-full max-w-2xl bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg p-8">
//         <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gap-2">
//           <FaUser className="text-gray-600 dark:text-gray-300" /> Account Settings
//         </h2>

//         {/* Password Section */}
//         <div className="mb-10">
//           <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
//             <FaLock className="text-gray-600 dark:text-gray-400" /> Change Password
//           </h3>
//           <form className="space-y-4">
//             <div>
//               <label className="block text-gray-600 dark:text-gray-400 mb-1">Current Password</label>
//               <input
//                 type="password"
//                 name="current"
//                 value={passwords.current}
//                 onChange={handlePasswordChange}
//                 className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-gray-800 focus:border-gray-800"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-600 dark:text-gray-400 mb-1">New Password</label>
//               <input
//                 type="password"
//                 name="new"
//                 value={passwords.new}
//                 onChange={handlePasswordChange}
//                 className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-gray-800 focus:border-gray-800"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-600 dark:text-gray-400 mb-1">Confirm New Password</label>
//               <input
//                 type="password"
//                 name="confirm"
//                 value={passwords.confirm}
//                 onChange={handlePasswordChange}
//                 className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-gray-800 focus:border-gray-800"
//               />
//             </div>
//             <button
//               type="button"
//               onClick={handleChangePassword}
//               className="mt-2 bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-md font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition"
//             >
//               Update Password
//             </button>
//             {message && <p className="text-green-600 mt-2">{message}</p>}
//             {error && <p className="text-red-600 mt-2">{error}</p>}
//           </form>
//         </div>

//         {/* Preferences Section */}
//         <div className="mb-10">
//           <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
//             <FaBell className="text-gray-600 dark:text-gray-400" /> Preferences
//           </h3>
//           <div className="flex items-center justify-between mb-4">
//             <span className="text-gray-700 dark:text-gray-300">Email Notifications</span>
//             <button
//               onClick={() => setNotifications((prev) => !prev)}
//               className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 focus:outline-none ${
//                 notifications ? "bg-green-500" : "bg-gray-300"
//               }`}
//             >
//               <span
//                 className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
//                   notifications ? "translate-x-6" : "translate-x-1"
//                 }`}
//               />
//             </button>
//           </div>
//           <div className="flex items-center justify-between">
//             <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
//             <button
//               onClick={() => setDarkMode((prev) => !prev)}
//               className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 focus:outline-none ${
//                 darkMode ? "bg-black" : "bg-gray-300"
//               }`}
//             >
//               <span
//                 className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
//                   darkMode ? "translate-x-6" : "translate-x-1"
//                 }`}
//               />
//             </button>
//           </div>
//         </div>

//         {/* Danger Zone */}
//         <div className="mt-12 border-t pt-8">
//           <button className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold text-base">
//             <FaSignOutAlt /> Logout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Settings;

// import React, { useState } from "react";
// import { FaUser, FaLock, FaBell, FaMoon, FaSignOutAlt } from "react-icons/fa";

// const Settings = () => {
//   // Example state for toggles and form fields
//   const [darkMode, setDarkMode] = useState(false);
//   const [notifications, setNotifications] = useState(true);
//   const [profile, setProfile] = useState({
//     name: "John Doe",
//     email: "john@example.com"
//   });
//   const [passwords, setPasswords] = useState({
//     current: "",
//     new: "",
//     confirm: ""
//   });

//   // Handlers (no real backend logic here)
//   const handleProfileChange = (e) => {
//     setProfile({ ...profile, [e.target.name]: e.target.value });
//   };
//   const handlePasswordChange = (e) => {
//     setPasswords({ ...passwords, [e.target.name]: e.target.value });
//   };

//   return (
//     <div className="bg-white dark:bg-gray-900 min-h-screen py-12 px-4 md:px-0 flex justify-center">
//       <div className="w-full max-w-2xl bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg p-8">
//         <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gap-2">
//           <FaUser className="text-gray-600 dark:text-gray-300" /> Account Settings
//         </h2>

//         {/* Profile Section */}
//         {/* <div className="mb-10">
//           <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Profile Information</h3>
//           <form className="space-y-4">
//             <div>
//               <label className="block text-gray-600 dark:text-gray-400 mb-1">Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={profile.name}
//                 onChange={handleProfileChange}
//                 className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-gray-800 focus:border-gray-800"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-600 dark:text-gray-400 mb-1">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={profile.email}
//                 onChange={handleProfileChange}
//                 className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-gray-800 focus:border-gray-800"
//               />
//             </div>
//             <button
//               type="button"
//               className="mt-2 bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-md font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition"
//             >
//               Save Changes
//             </button>
//           </form>
//         </div> */}

//         {/* Password Section */}
//         <div className="mb-10">
//           <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
//             <FaLock className="text-gray-600 dark:text-gray-400" /> Change Password
//           </h3>
//           <form className="space-y-4">
//             <div>
//               <label className="block text-gray-600 dark:text-gray-400 mb-1">Current Password</label>
//               <input
//                 type="password"
//                 name="current"
//                 value={passwords.current}
//                 onChange={handlePasswordChange}
//                 className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-gray-800 focus:border-gray-800"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-600 dark:text-gray-400 mb-1">New Password</label>
//               <input
//                 type="password"
//                 name="new"
//                 value={passwords.new}
//                 onChange={handlePasswordChange}
//                 className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-gray-800 focus:border-gray-800"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-600 dark:text-gray-400 mb-1">Confirm New Password</label>
//               <input
//                 type="password"
//                 name="confirm"
//                 value={passwords.confirm}
//                 onChange={handlePasswordChange}
//                 className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-gray-800 focus:border-gray-800"
//               />
//             </div>
//             <button
//               type="button"
//               className="mt-2 bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-md font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition"
//             >
//               Update Password
//             </button>
//           </form>
//         </div>

//         {/* Preferences Section */}
//         <div className="mb-10">
//           <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
//             <FaBell className="text-gray-600 dark:text-gray-400" /> Preferences
//           </h3>
//           <div className="flex items-center justify-between mb-4">
//             <span className="text-gray-700 dark:text-gray-300">Email Notifications</span>
//             <button
//               onClick={() => setNotifications((prev) => !prev)}
//               className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 focus:outline-none ${
//                 notifications ? "bg-green-500" : "bg-gray-300"
//               }`}
//             >
//               <span
//                 className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
//                   notifications ? "translate-x-6" : "translate-x-1"
//                 }`}
//               />
//             </button>
//           </div>
//           <div className="flex items-center justify-between">
//             <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
//             <button
//               onClick={() => setDarkMode((prev) => !prev)}
//               className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 focus:outline-none ${
//                 darkMode ? "bg-black" : "bg-gray-300"
//               }`}
//             >
//               <span
//                 className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
//                   darkMode ? "translate-x-6" : "translate-x-1"
//                 }`}
//               />
//             </button>
//           </div>
//         </div>

//         {/* Danger Zone */}
//         <div className="mt-12 border-t pt-8">
//           <button className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold text-base">
//             <FaSignOutAlt /> Logout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Settings;
