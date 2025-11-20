// import React, { useState, useEffect } from 'react'; 
// import axios from 'axios';

// const BillHistory = () => {
//   const [filterType, setFilterType] = useState('Name');
//   const [filterValue, setFilterValue] = useState('');
//   const [salesData, setSalesData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     console.log("Updated sales data:", salesData);
//   }, [salesData]);

//   const fetchSales = async (e) => {
//     e.preventDefault();
//     if (!filterValue.trim()) {
//       setError('Please enter a search value');
//       return;
//     }

//     try {
//       setError('');
//       setLoading(true);
//       const token = localStorage.getItem('token');

//       const { data } = await axios.get('http://localhost:5000/api/invoice/search', {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { filterType, filterValue }
//       });

//       console.log("Raw API Response:", data.sales);

//       const sortedSales = (data.sales || [])
//         .map(sale => ({
//           ...sale,
//           parsedDate: parseCustomDate(sale.date) // Store parsed date separately
//         }))
//         .filter(sale => sale.parsedDate) // Remove invalid entries
//         .sort((a, b) => b.parsedDate - a.parsedDate); // Sort by parsedDate

//       setSalesData(sortedSales);
//       if (sortedSales.length === 0) {
//         setError('No matching records found');
//       }
//     } catch (err) {
//       setError('Failed to fetch data. Please try again.');
//       console.error('Search error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to parse custom date format
//   const parseCustomDate = (dateString) => {
//     if (!dateString) return null;

//     const parts = dateString.match(/(\d{1,2})\/(\d{1,2})\/(\d{4}), (\d{1,2}:\d{2}:\d{2} [APap][Mm])/);
//     if (!parts) {
//       console.warn('Unparsable date:', dateString);
//       return null;
//     }

//     const [_, day, month, year, time] = parts;
//     const formattedDate = new Date(`${month}/${day}/${year} ${time}`);

//     if (isNaN(formattedDate.getTime())) {
//       console.warn("Invalid date conversion:", formattedDate);
//       return null;
//     }

//     return formattedDate;
//   };

//   // Function to format parsed date
//   const formatDate = (dateString) => {
//     const date = parseCustomDate(dateString);
//     if (!date || isNaN(date.getTime())) return 'Invalid Date';

//     return date.toLocaleString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: true
//     });
//   };

//   return (
//     <div className="p-8 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold mb-8">Bill History</h1>

//       {/* Search Section */}
//       <form onSubmit={fetchSales} className="flex flex-col md:flex-row items-center gap-4 mb-8">
//         <select
//           value={filterType}
//           onChange={(e) => setFilterType(e.target.value)}
//           className="p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//         >
//           <option value="Name">Name</option>
//           <option value="Date">Date</option>
//           <option value="Mobile">Mobile Number</option>
//         </select>

//         <input
//           type={filterType === 'Date' ? 'date' : 'text'}
//           placeholder={
//             filterType === 'Name' ? 'Enter customer name...' :
//             filterType === 'Mobile' ? 'Enter mobile number...' :
//             'Select date'
//           }
//           value={filterValue}
//           onChange={(e) => setFilterValue(e.target.value)}
//           className="p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />

//         <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors">
//           Search
//         </button>
//       </form>

//       {/* Error message */}
//       {error && <div className="text-red-500">{error}</div>}

//       {/* Loading indicator */}
//       {loading ? (
//         <div className="text-blue-500">Loading...</div>
//       ) : (
//         <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
//           <thead>
//             <tr>
//               <th className="py-2 px-4">Invoice #</th>
//               <th className="py-2 px-4">Customer Name</th>
//               <th className="py-2 px-4">Total</th>
//               <th className="py-2 px-4">Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {salesData.map((sale) => (
//               <tr key={sale._id}>
//                 <td className="py-2 px-4">{sale.invoiceNumber}</td>
//                 <td className="py-2 px-4">{sale.customerName}</td>
//                 <td className="py-2 px-4">{sale.totalAmount}</td>
//                 <td className="py-2 px-4">{formatDate(sale.date)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default BillHistory;


//working 
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BillHistory = () => {
  const [filterType, setFilterType] = useState('Name');
  const [filterValue, setFilterValue] = useState('');
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log("Updated sales data:", salesData);
  }, [salesData]);

  const fetchSales = async (e) => {
    e.preventDefault();
    if (!filterValue.trim()) {
      setError('Please enter a search value');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const token = localStorage.getItem('token');

      const { data } = await axios.get('http://localhost:5000/api/invoice/search', {
        headers: { Authorization: `Bearer ${token}` },
        params: { filterType, filterValue }
      });

      console.log("Raw API Response:", data.sales);

      const sortedSales = (data.sales || [])
        .map(sale => ({
          ...sale,
          parsedDate: parseCustomDate(sale.date) // Store parsed date separately
        }))
        .filter(sale => sale.parsedDate) // Remove invalid entries
        .sort((a, b) => b.parsedDate - a.parsedDate); // Sort by parsedDate

      setSalesData(sortedSales);
      if (sortedSales.length === 0) {
        setError('No matching records found');
      }
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to parse custom date format
  const parseCustomDate = (dateString) => {
    if (!dateString) return null;

    const parts = dateString.match(/(\d{1,2})\/(\d{1,2})\/(\d{4}), (\d{1,2}:\d{2}:\d{2} [APap][Mm])/);
    if (!parts) {
      console.warn('Unparsable date:', dateString);
      return null;
    }

    const [_, day, month, year, time] = parts;
    const formattedDate = new Date(`${month}/${day}/${year} ${time}`);

    if (isNaN(formattedDate.getTime())) {
      console.warn("Invalid date conversion:", formattedDate);
      return null;
    }

    return formattedDate;
  };

  // Function to format parsed date
  const formatDate = (dateString) => {
    const date = parseCustomDate(dateString);
    if (!date || isNaN(date.getTime())) return 'Invalid Date';

    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Bill History</h1>

      {/* Search Section */}
      <form onSubmit={fetchSales} className="flex flex-col md:flex-row items-center gap-4 mb-8">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="Name">Name</option>
          <option value="Date">Date</option>
          <option value="Mobile">Mobile Number</option>
        </select>

        <input
          type={filterType === 'Date' ? 'date' : 'text'}
          placeholder={
            filterType === 'Name' ? 'Enter customer name...' :
            filterType === 'Mobile' ? 'Enter mobile number...' :
            'Select date'
          }
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="p-3 rounded-xl border border-gray-300 shadow-sm w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition-all disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Error Messages */}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      {/* Results Section */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        {salesData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-3 px-6 text-left">Customer Name</th>
                  <th className="py-3 px-6 text-left">Mobile</th>
                  <th className="py-3 px-6 text-left">Amount</th>
                  <th className="py-3 px-6 text-left">Date & Time</th>
                  <th className="py-3 px-6 text-left">Items</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((sale) => (
                  <tr key={sale._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-6">{sale.customerName}</td>
                    <td className="py-3 px-6">{sale.customerMobile}</td>
                    <td className="py-3 px-6">₹{sale.totalAmount.toFixed(2)}</td>
                    <td className="py-3 px-6">{formatDate(sale.date)}</td>
                    <td className="py-3 px-6">
                      <ul className="list-disc list-inside">
                        {sale.items.map((item, index) => (
                          <li key={index}>
                            {item.description} (Qty: {item.quantity}, ₹{item.price.toFixed(2)})
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && <p className="text-gray-500">No records to display</p>
        )}
      </div>
    </div>
  );
};
export default BillHistory;



// import React, { useState } from 'react';
// import axios from 'axios';

// const BillHistory = () => {
//   const [filterType, setFilterType] = useState('Name');
//   const [filterValue, setFilterValue] = useState('');
//   const [salesData, setSalesData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const fetchSales = async (e) => {
//     e.preventDefault();
//     if (!filterValue.trim()) {
//       setError('Please enter a search value');
//       return;
//     }

//     try {
//       setError('');
//       setLoading(true);
//       const token = localStorage.getItem('token');

//       const { data } = await axios.get('http://localhost:5000/api/invoice/search', {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { filterType, filterValue }
//       });

//       const sortedSales = (data.sales || [])
//         .map(sale => ({
//           ...sale,
//           parsedDate: parseCustomDate(sale.date) // Store parsed date separately
//         }))
//         .filter(sale => sale.parsedDate) // Remove invalid entries
//         .sort((a, b) => b.parsedDate - a.parsedDate); // Sort by parsedDate

//       setSalesData(sortedSales);
//       if (sortedSales.length === 0) {
//         setError('No matching records found');
//       }
//     } catch (err) {
//       setError('Failed to fetch data. Please try again.');
//       console.error('Search error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to parse the custom date format
//   const parseCustomDate = (dateString) => {
//     if (!dateString) return null;

//     const parts = dateString.match(/(\d{1,2})\/(\d{1,2})\/(\d{4}), (\d{1,2}:\d{2}:\d{2} [APap][Mm])/);
//     if (!parts) {
//       console.warn('Unparsable date:', dateString);
//       return null;
//     }

//     const [_, day, month, year, time] = parts;
//     return new Date(`${month}/${day}/${year} ${time}`);
//   };

//   // Function to format parsed date
//   const formatDate = (dateString) => {
//     const date = parseCustomDate(dateString);
//     if (!date || isNaN(date.getTime())) return 'Invalid Date';

//     return date.toLocaleString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: true
//     });
//   };

//   return (
//     <div className="p-8 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold mb-8">Bill History</h1>

//       {/* Search Section */}
//       <form onSubmit={fetchSales} className="flex flex-col md:flex-row items-center gap-4 mb-8">
//         <select
//           value={filterType}
//           onChange={(e) => setFilterType(e.target.value)}
//           className="p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//         >
//           <option value="Name">Name</option>
//           <option value="Date">Date</option>
//           <option value="Mobile">Mobile Number</option>
//         </select>

//         <input
//           type={filterType === 'Date' ? 'date' : 'text'}
//           placeholder={
//             filterType === 'Name' ? 'Enter customer name...' :
//             filterType === 'Mobile' ? 'Enter mobile number...' :
//             'Select date'
//           }
//           value={filterValue}
//           onChange={(e) => setFilterValue(e.target.value)}
//           className="p-3 rounded-xl border border-gray-300 shadow-sm w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition-all disabled:opacity-50"
//         >
//           {loading ? 'Searching...' : 'Search'}
//         </button>
//       </form>

//       {/* Error Messages */}
//       {error && <p className="mb-4 text-red-600">{error}</p>}

//       {/* Results Section */}
//       <div className="bg-white rounded-2xl shadow-md p-6">
//         {salesData.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full table-auto">
//               <thead>
//                 <tr className="bg-gray-200 text-gray-700">
//                   <th className="py-3 px-6 text-left">Customer Name</th>
//                   <th className="py-3 px-6 text-left">Mobile</th>
//                   <th className="py-3 px-6 text-left">Amount</th>
//                   <th className="py-3 px-6 text-left">Date & Time</th>
//                   <th className="py-3 px-6 text-left">Items</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {salesData.map((sale) => (
//                   <tr key={sale._id} className="border-b hover:bg-gray-50">
//                     <td className="py-3 px-6">{sale.customerName}</td>
//                     <td className="py-3 px-6">{sale.customerMobile}</td>
//                     <td className="py-3 px-6">₹{sale.totalAmount.toFixed(2)}</td>
//                     <td className="py-3 px-6">{formatDate(sale.date)}</td>
//                     <td className="py-3 px-6">
//                       <ul className="list-disc list-inside">
//                         {sale.items.map((item, index) => (
//                           <li key={index}>
//                             {item.description} (Qty: {item.quantity}, ₹{item.price.toFixed(2)})
//                           </li>
//                         ))}
//                       </ul>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           !loading && <p className="text-gray-500">No records to display</p>
//         )}
//       </div>
//     </div>
//   );
// };
// ///export default BillHistory;
// import React, { useState } from 'react';
// import axios from 'axios';

// const BillHistory = () => {
//   const [filterType, setFilterType] = useState('Name');
//   const [filterValue, setFilterValue] = useState('');
//   const [salesData, setSalesData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const fetchSales = async (e) => {
//     e.preventDefault();
//     if (!filterValue.trim()) {
//       setError('Please enter a search value');
//       return;
//     }

//     try {
//       setError('');
//       setLoading(true);
//       const token = localStorage.getItem('token');

//       const { data } = await axios.get('http://localhost:5000/api/invoice/search', {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { filterType, filterValue }
//       });

//       const sortedSales = (data.sales || []).sort((a, b) => new Date(parseCustomDate(b.date)) - new Date(parseCustomDate(a.date)));

//       setSalesData(sortedSales);
//       if (sortedSales.length === 0) {
//         setError('No matching records found');
//       }
//     } catch (err) {
//       setError('Failed to fetch data. Please try again.');
//       console.error('Search error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to parse the custom date format
//   const parseCustomDate = (dateString) => {
//     if (!dateString) return null;

//     const parts = dateString.match(/(\d{1,2})\/(\d{1,2})\/(\d{4}), (\d{1,2}:\d{2}:\d{2} [APap][Mm])/);
//     if (!parts) {
//       console.warn('Unparsable date:', dateString);
//       return null;
//     }

//     const [_, day, month, year, time] = parts;
//     return new Date(`${month}/${day}/${year} ${time}`);
//   };

//   // Function to format parsed date
//   const formatDate = (dateString) => {
//     const date = parseCustomDate(dateString);
//     if (!date || isNaN(date.getTime())) return 'Invalid Date';

//     return date.toLocaleString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: true
//     });
//   };

//   return (
//     <div className="p-8 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold mb-8">Bill History</h1>

//       {/* Search Section */}
//       <form onSubmit={fetchSales} className="flex flex-col md:flex-row items-center gap-4 mb-8">
//         <select
//           value={filterType}
//           onChange={(e) => setFilterType(e.target.value)}
//           className="p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//         >
//           <option value="Name">Name</option>
//           <option value="Date">Date</option>
//           <option value="Mobile">Mobile Number</option>
//         </select>

//         <input
//           type={filterType === 'Date' ? 'date' : 'text'}
//           placeholder={
//             filterType === 'Name' ? 'Enter customer name...' :
//             filterType === 'Mobile' ? 'Enter mobile number...' :
//             'Select date'
//           }
//           value={filterValue}
//           onChange={(e) => setFilterValue(e.target.value)}
//           className="p-3 rounded-xl border border-gray-300 shadow-sm w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition-all disabled:opacity-50"
//         >
//           {loading ? 'Searching...' : 'Search'}
//         </button>
//       </form>

//       {/* Error Messages */}
//       {error && <p className="mb-4 text-red-600">{error}</p>}

//       {/* Results Section */}
//       <div className="bg-white rounded-2xl shadow-md p-6">
//         {salesData.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full table-auto">
//               <thead>
//                 <tr className="bg-gray-200 text-gray-700">
//                   <th className="py-3 px-6 text-left">Customer Name</th>
//                   <th className="py-3 px-6 text-left">Mobile</th>
//                   <th className="py-3 px-6 text-left">Amount</th>
//                   <th className="py-3 px-6 text-left">Date & Time</th>
//                   <th className="py-3 px-6 text-left">Items</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {salesData.map((sale) => (
//                   <tr key={sale._id} className="border-b hover:bg-gray-50">
//                     <td className="py-3 px-6">{sale.customerName}</td>
//                     <td className="py-3 px-6">{sale.customerMobile}</td>
//                     <td className="py-3 px-6">₹{sale.totalAmount.toFixed(2)}</td>
//                     <td className="py-3 px-6">{formatDate(sale.date)}</td>
//                     <td className="py-3 px-6">
//                       <ul className="list-disc list-inside">
//                         {sale.items.map((item, index) => (
//                           <li key={index}>
//                             {item.description} (Qty: {item.quantity}, ₹{item.price.toFixed(2)})
//                           </li>
//                         ))}
//                       </ul>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           !loading && <p className="text-gray-500">No records to display</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BillHistory;


// import React, { useState } from 'react';
// import axios from 'axios';

// const BillHistory = () => {
//   const [filterType, setFilterType] = useState('Name');
//   const [filterValue, setFilterValue] = useState('');
//   const [salesData, setSalesData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const fetchSales = async (e) => {
//     e.preventDefault();
//     if (!filterValue.trim()) {
//       setError('Please enter a search value');
//       return;
//     }

//     try {
//       setError('');
//       setLoading(true);
//       const token = localStorage.getItem('token');

//       const { data } = await axios.get('http://localhost:5000/api/invoice/search', {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { filterType, filterValue }
//       });

//       const sortedSales = (data.sales || []).sort((a, b) => new Date(b.date) - new Date(a.date));

//       setSalesData(sortedSales);
//       if (sortedSales.length === 0) {
//         setError('No matching records found');
//       }
//     } catch (err) {
//       setError('Failed to fetch data. Please try again.');
//       console.error('Search error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Invalid Date';
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) {
//       console.warn('Unparsable date:', dateString);
//       return 'Invalid Date';
//     }

//     return date.toLocaleString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: true
//     });
//   };

//   return (
//     <div className="p-8 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold mb-8">Bill History</h1>

//       {/* Search Section */}
//       <form onSubmit={fetchSales} className="flex flex-col md:flex-row items-center gap-4 mb-8">
//         <select
//           value={filterType}
//           onChange={(e) => setFilterType(e.target.value)}
//           className="p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//         >
//           <option value="Name">Name</option>
//           <option value="Date">Date</option>
//           <option value="Mobile">Mobile Number</option>
//         </select>

//         <input
//           type={filterType === 'Date' ? 'date' : 'text'}
//           placeholder={
//             filterType === 'Name' ? 'Enter customer name...' :
//             filterType === 'Mobile' ? 'Enter mobile number...' :
//             'Select date'
//           }
//           value={filterValue}
//           onChange={(e) => setFilterValue(e.target.value)}
//           className="p-3 rounded-xl border border-gray-300 shadow-sm w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition-all disabled:opacity-50"
//         >
//           {loading ? 'Searching...' : 'Search'}
//         </button>
//       </form>

//       {/* Error Messages */}
//       {error && <p className="mb-4 text-red-600">{error}</p>}

//       {/* Results Section */}
//       <div className="bg-white rounded-2xl shadow-md p-6">
//         {salesData.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full table-auto">
//               <thead>
//                 <tr className="bg-gray-200 text-gray-700">
//                   <th className="py-3 px-6 text-left">Customer Name</th>
//                   <th className="py-3 px-6 text-left">Mobile</th>
//                   <th className="py-3 px-6 text-left">Amount</th>
//                   <th className="py-3 px-6 text-left">Date & Time</th>
//                   <th className="py-3 px-6 text-left">Items</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {salesData.map((sale) => (
//                   <tr key={sale._id} className="border-b hover:bg-gray-50">
//                     <td className="py-3 px-6">{sale.customerName}</td>
//                     <td className="py-3 px-6">{sale.customerMobile}</td>
//                     <td className="py-3 px-6">₹{sale.totalAmount.toFixed(2)}</td>
//                     <td className="py-3 px-6">{formatDate(sale.date)}</td>
//                     <td className="py-3 px-6">
//                       <ul className="list-disc list-inside">
//                         {sale.items.map((item, index) => (
//                           <li key={index}>
//                             {item.description} (Qty: {item.quantity}, ₹{item.price.toFixed(2)})
//                           </li>
//                         ))}
//                       </ul>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           !loading && <p className="text-gray-500">No records to display</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BillHistory;


// import React, { useState } from 'react';
// import axios from 'axios';

// const BillHistory = () => {
//   const [filterType, setFilterType] = useState('Name');
//   const [filterValue, setFilterValue] = useState('');
//   const [salesData, setSalesData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const fetchSales = async (e) => {
//     e.preventDefault();
//     if (!filterValue.trim()) {
//       setError('Please enter a search value');
//       return;
//     }

//     try {
//       setError('');
//       setLoading(true);
//       const token = localStorage.getItem('token');
      
//       const { data } = await axios.get('http://localhost:5000/api/invoice/search', {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { 
//           filterType,
//           filterValue 
//         }
//       });

//       const sortedSales = (data.sales || []).sort((a, b) => new Date(b.date) - new Date(a.date));

//       setSalesData(sortedSales);
//       if (sortedSales.length === 0) {
//         setError('No matching records found');
//       }
//     } catch (err) {
//       setError('Failed to fetch data. Please try again.');
//       console.error('Search error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: true
//     });
//   };

//   return (
//     <div className="p-8 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold mb-8">Bill History</h1>

//       {/* Search Section */}
//       <form onSubmit={fetchSales} className="flex flex-col md:flex-row items-center gap-4 mb-8">
//         <select
//           value={filterType}
//           onChange={(e) => setFilterType(e.target.value)}
//           className="p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//         >
//           <option value="Name">Name</option>
//           <option value="Date">Date</option>
//           <option value="Mobile">Mobile Number</option>
//         </select>

//         <input
//           type={filterType === 'Date' ? 'date' : 'text'}
//           placeholder={
//             filterType === 'Name' ? 'Enter customer name...' :
//             filterType === 'Mobile' ? 'Enter mobile number...' :
//             'Select date'
//           }
//           value={filterValue}
//           onChange={(e) => setFilterValue(e.target.value)}
//           className="p-3 rounded-xl border border-gray-300 shadow-sm w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition-all disabled:opacity-50"
//         >
//           {loading ? 'Searching...' : 'Search'}
//         </button>
//       </form>

//       {/* Error Messages */}
//       {error && <p className="mb-4 text-red-600">{error}</p>}

//       {/* Results Section */}
//       <div className="bg-white rounded-2xl shadow-md p-6">
//         {salesData.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full table-auto">
//               <thead>
//                 <tr className="bg-gray-200 text-gray-700">
//                   <th className="py-3 px-6 text-left">Customer Name</th>
//                   <th className="py-3 px-6 text-left">Mobile</th>
//                   <th className="py-3 px-6 text-left">Amount</th>
//                   <th className="py-3 px-6 text-left">Date & Time</th>
//                   <th className="py-3 px-6 text-left">Items</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {salesData.map((sale) => (
//                   <tr key={sale._id} className="border-b hover:bg-gray-50">
//                     <td className="py-3 px-6">{sale.customerName}</td>
//                     <td className="py-3 px-6">{sale.customerMobile}</td>
//                     <td className="py-3 px-6">₹{sale.totalAmount.toFixed(2)}</td>
//                     <td className="py-3 px-6">{formatDate(sale.date)}</td>
//                     <td className="py-3 px-6">
//                       <ul className="list-disc list-inside">
//                         {sale.items.map((item, index) => (
//                           <li key={index}>
//                             {item.description} (Qty: {item.quantity}, ₹{item.price.toFixed(2)})
//                           </li>
//                         ))}
//                       </ul>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           !loading && <p className="text-gray-500">No records to display</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BillHistory;

// import React, { useState } from 'react';
// import axios from 'axios';

// const BillHistory = () => {
//   const [filterType, setFilterType] = useState('Name');
//   const [filterValue, setFilterValue] = useState('');
//   const [salesData, setSalesData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const fetchSales = async (e) => {
//     e.preventDefault();
//     if (!filterValue.trim()) {
//       setError('Please enter a search value');
//       return;
//     }

//     try {
//       setError('');
//       setLoading(true);
//       const token = localStorage.getItem('token');
      
//       const { data } = await axios.get('http://localhost:5000/api/invoice/search', {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { 
//           filterType: filterType === 'Name' ? 'Name' : 
//                     filterType === 'Mobile' ? 'Mobile' : 'Date',
//           filterValue 
//         }
//       });

//       setSalesData(data.sales || []);
//       if (data.sales.length === 0) {
//         setError('No matching records found');
//       }
//     } catch (err) {
//       setError('Failed to fetch data. Please try again.');
//       console.error('Search error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-8 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold mb-8">Bill History</h1>

//       {/* Search Section */}
//       <form onSubmit={fetchSales} className="flex flex-col md:flex-row items-center gap-4 mb-8">
//         <select
//           value={filterType}
//           onChange={(e) => setFilterType(e.target.value)}
//           className="p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//         >
//           <option value="Name">Name</option>
//           <option value="Date">Date</option>
//           <option value="Mobile">Mobile Number</option>
//         </select>

//         <input
//           type={filterType === 'Date' ? 'date' : 'text'}
//           placeholder={
//             filterType === 'Name' ? 'Enter customer name...' :
//             filterType === 'Mobile' ? 'Enter mobile number...' :
//             'Select date'
//           }
//           value={filterValue}
//           onChange={(e) => setFilterValue(e.target.value)}
//           className="p-3 rounded-xl border border-gray-300 shadow-sm w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition-all disabled:opacity-50"
//         >
//           {loading ? 'Searching...' : 'Search'}
//         </button>
//       </form>

//       {/* Error Messages */}
//       {error && <p className="mb-4 text-red-600">{error}</p>}

//       {/* Results Section */}
//       <div className="bg-white rounded-2xl shadow-md p-6">
//         {salesData.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full table-auto">
//               <thead>
//                 <tr className="bg-gray-200 text-gray-700">
//                   <th className="py-3 px-6 text-left">Customer Name</th>
//                   <th className="py-3 px-6 text-left">Mobile</th>
//                   <th className="py-3 px-6 text-left">Amount</th>
//                   <th className="py-3 px-6 text-left">Date</th>
//                   <th className="py-3 px-6 text-left">Items</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {salesData.map((sale) => (
//                   <tr key={sale._id} className="border-b hover:bg-gray-50">
//                     <td className="py-3 px-6">{sale.customerName}</td>
//                     <td className="py-3 px-6">{sale.customerMobile}</td>
//                     <td className="py-3 px-6">₹{sale.totalAmount.toFixed(2)}</td>
//                     <td className="py-3 px-6">
//                       {new Date(sale.date).toLocaleDateString('en-IN', {
//                         day: '2-digit',
//                         month: 'short',
//                         year: 'numeric'
//                       })}
//                     </td>
//                     <td className="py-3 px-6">
//                       <ul className="list-disc list-inside">
//                         {sale.items.map((item, index) => (
//                           <li key={index}>
//                             {item.description} (Qty: {item.quantity}, ₹{item.price.toFixed(2)})
//                           </li>
//                         ))}
//                       </ul>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           !loading && <p className="text-gray-500">No records to display</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BillHistory;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const BillHistory = () => {
//   const [filterType, setFilterType] = useState('Name');
//   const [filterValue, setFilterValue] = useState('');
//   const [salesData, setSalesData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const fetchSales = async (e) => {
//     e.preventDefault();
//     if (!filterValue.trim()) {
//       setError('Please enter a search value');
//       return;
//     }

//     try {
//       setError('');
//       setLoading(true);
//       const token = localStorage.getItem('token');
      
//       const { data } = await axios.get('/api/invoice/search', {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { filterType, filterValue }
//       });

//       setSalesData(data.sales || []);
//       if (data.sales?.length === 0) {
//         setError('No matching records found');
//       }
//     } catch (err) {
//       setError('Failed to fetch data. Please try again.');
//       console.error('Search error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-8 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold mb-8">Bill History</h1>

//       {/* Search Section */}
//       <form onSubmit={fetchSales} className="flex flex-col md:flex-row items-center gap-4 mb-8">
//         <select
//           value={filterType}
//           onChange={(e) => setFilterType(e.target.value)}
//           className="p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//         >
//           <option value="Name">Name</option>
//           <option value="Date">Date</option>
//           <option value="Mobile">Mobile Number</option>
//         </select>

//         <input
//           type={filterType === 'Date' ? 'date' : 'text'}
//           placeholder={
//             filterType === 'Name' ? 'Enter customer name...' :
//             filterType === 'Mobile' ? 'Enter mobile number...' :
//             'Select date'
//           }
//           value={filterValue}
//           onChange={(e) => setFilterValue(e.target.value)}
//           className="p-3 rounded-xl border border-gray-300 shadow-sm w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition-all disabled:opacity-50"
//         >
//           {loading ? 'Searching...' : 'Search'}
//         </button>
//       </form>

//       {/* Error Messages */}
//       {error && <p className="mb-4 text-red-600">{error}</p>}

//       {/* Results Section */}
//       <div className="bg-white rounded-2xl shadow-md p-6">
//         {salesData.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full table-auto">
//               <thead>
//                 <tr className="bg-gray-200 text-gray-700">
//                   <th className="py-3 px-6 text-left">Invoice #</th>
//                   <th className="py-3 px-6 text-left">Client</th>
//                   <th className="py-3 px-6 text-left">Mobile</th>
//                   <th className="py-3 px-6 text-left">Amount</th>
//                   <th className="py-3 px-6 text-left">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {salesData.map((sale) => (
//                   <tr key={sale._id} className="border-b hover:bg-gray-50">
//                     <td className="py-3 px-6">{sale.invoiceNumber}</td>
//                     <td className="py-3 px-6">{sale.clientName}</td>
//                     <td className="py-3 px-6">{sale.clientMobile}</td>
//                     <td className="py-3 px-6">₹{sale.totalAmount.toFixed(2)}</td>
//                     <td className="py-3 px-6">
//                       {new Date(sale.date).toLocaleDateString('en-IN', {
//                         day: '2-digit',
//                         month: 'short',
//                         year: 'numeric'
//                       })}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           !loading && <p className="text-gray-500">No records to display</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BillHistory;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const BillHistory = () => {
//   const [filterType, setFilterType] = useState('Name');
//   const [filterValue, setFilterValue] = useState('');
//   const [salesData, setSalesData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchSales = async () => {
//     if (!filterValue.trim()) return;

//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       const headers = { Authorization: `Bearer ${token}` };

//       const res = await axios.get('/api/invoice/search', {
//         headers,
//         params: { filterType, filterValue },
//       });

//       setSalesData(res.data.sales || []); // Handle the response data
//     } catch (error) {
//       console.error('Error fetching sales data:', error);
//       setSalesData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     fetchSales();
//   };

//   useEffect(() => {
//     setSalesData([]); // clear results if filter changes
//     setFilterValue('');
//   }, [filterType]);

//   return (
//     <div className="p-8 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold mb-8">Bill History</h1>

//       {/* Filter Section */}
//       <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-4 mb-8">
//         <select
//           value={filterType}
//           onChange={(e) => setFilterType(e.target.value)}
//           className="p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//         >
//           <option value="Name">Name</option>
//           <option value="Date">Date</option>
//           <option value="Mobile">Mobile Number</option>
//         </select>

//         <input
//           type={filterType === 'Date' ? 'date' : 'text'}
//           placeholder={filterType === 'Name' ? 'Enter name...' : filterType === 'Mobile' ? 'Enter mobile number...' : 'Enter date...'}
//           value={filterValue}
//           onChange={(e) => setFilterValue(e.target.value)}
//           className="p-3 rounded-xl border border-gray-300 shadow-sm w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />

//         <button
//           type="submit"
//           className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition-all"
//         >
//           Search
//         </button>
//       </form>

//       {/* Sales Data Section */}
//       <div className="bg-white rounded-2xl shadow-md p-6">
//         {loading ? (
//           <p className="text-gray-600">Loading...</p>
//         ) : salesData.length === 0 ? (
//           <p className="text-gray-500">No sales found. Try searching!</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full table-auto">
//               <thead>
//                 <tr className="bg-gray-200 text-gray-700">
//                   <th className="py-3 px-6 text-left">Invoice #</th>
//                   <th className="py-3 px-6 text-left">Client</th>
//                   <th className="py-3 px-6 text-left">Mobile</th>
//                   <th className="py-3 px-6 text-left">Amount</th>
//                   <th className="py-3 px-6 text-left">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {salesData.map((sale) => (
//                   <tr key={sale._id} className="border-b hover:bg-gray-50">
//                     <td className="py-3 px-6">{sale.invoiceNumber}</td>
//                     <td className="py-3 px-6">{sale.clientName}</td>
//                     <td className="py-3 px-6">{sale.clientMobile}</td>
//                     <td className="py-3 px-6">₹ {sale.totalAmount.toFixed(2)}</td>
//                     <td className="py-3 px-6">{new Date(sale.createdAt).toLocaleDateString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BillHistory;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const BillHistory = () => {
//   const [filterType, setFilterType] = useState('Name');
//   const [filterValue, setFilterValue] = useState('');
//   const [salesData, setSalesData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchSales = async () => {
//     if (!filterValue.trim()) return;

//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       const headers = { Authorization: `Bearer ${token}` };

//       const res = await axios.get('/api/invoice/search', {
//         headers,
//         params: { filterType, filterValue },
//       });

//       setSalesData(res.data.sales || []);
//     } catch (error) {
//       console.error('Error fetching sales data:', error);
//       setSalesData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     fetchSales();
//   };

//   useEffect(() => {
//     setSalesData([]); // clear results if filter changes
//     setFilterValue('');
//   }, [filterType]);

//   return (
//     <div className="p-8 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold mb-8">Bill History</h1>

//       {/* Filter Section */}
//       <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-4 mb-8">
//         <select
//           value={filterType}
//           onChange={(e) => setFilterType(e.target.value)}
//           className="p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//         >
//           <option value="Name">Name</option>
//           <option value="Date">Date</option>
//           <option value="Mobile">Mobile Number</option>
//         </select>

//         <input
//           type={filterType === 'Date' ? 'date' : 'text'}
//           placeholder={filterType === 'Name' ? 'Enter name...' : filterType === 'Mobile' ? 'Enter mobile number...' : 'Enter date...'}
//           value={filterValue}
//           onChange={(e) => setFilterValue(e.target.value)}
//           className="p-3 rounded-xl border border-gray-300 shadow-sm w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />

//         <button
//           type="submit"
//           className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition-all"
//         >
//           Search
//         </button>
//       </form>

//       {/* Sales Data Section */}
//       <div className="bg-white rounded-2xl shadow-md p-6">
//         {loading ? (
//           <p className="text-gray-600">Loading...</p>
//         ) : salesData.length === 0 ? (
//           <p className="text-gray-500">No sales found. Try searching!</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full table-auto">
//               <thead>
//                 <tr className="bg-gray-200 text-gray-700">
//                   <th className="py-3 px-6 text-left">Invoice #</th>
//                   <th className="py-3 px-6 text-left">Client</th>
//                   <th className="py-3 px-6 text-left">Mobile</th>
//                   <th className="py-3 px-6 text-left">Amount</th>
//                   <th className="py-3 px-6 text-left">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {salesData.map((sale) => (
//                   <tr key={sale._id} className="border-b hover:bg-gray-50">
//                     <td className="py-3 px-6">{sale.invoiceNumber}</td>
//                     <td className="py-3 px-6">{sale.clientName}</td>
//                     <td className="py-3 px-6">{sale.clientMobile}</td>
//                     <td className="py-3 px-6">₹ {sale.totalAmount.toFixed(2)}</td>
//                     <td className="py-3 px-6">{new Date(sale.createdAt).toLocaleDateString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BillHistory;
