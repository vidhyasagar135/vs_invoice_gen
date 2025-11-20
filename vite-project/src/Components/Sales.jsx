
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const Sales = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [salesData, setSalesData] = useState({
    totalInvoices: 0,
    oneDaySales: 0,
    monthlySales: 0,
    yearlySales: 0
  });

  const fetchSalesData = async () => {
    try {
      const token = localStorage.getItem('token');
      const today = format(new Date(), 'yyyy-MM-dd');
      const month = format(new Date(), 'MM');
      const year = format(new Date(), 'yyyy');

      const requests = [
        axios.get(`/api/sales/total-invoices?date=${today}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`/api/sales/one-day?date=${today}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`/api/sales/monthly?month=${month}&year=${year}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`/api/sales/yearly?year=${year}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ];

      const [invoicesRes, dailyRes, monthlyRes, yearlyRes] = await Promise.all(requests);
      
      setSalesData({
        totalInvoices: invoicesRes.data.total || 0,
        oneDaySales: dailyRes.data.totalSales || 0,
        monthlySales: monthlyRes.data.totalSales || 0,
        yearlySales: yearlyRes.data.totalSales || 0
      });
      
    } catch (err) {
      console.error('Sales data error:', err);
      setError('Failed to load sales data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  if (loading) return <div className="text-center p-4">Loading sales data...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Sales Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm mb-1">Today's Invoices</h3>
          <p className="text-2xl font-semibold text-blue-600">{salesData.totalInvoices}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm mb-1">Daily Sales</h3>
          <p className="text-2xl font-semibold text-green-600">
            ₹{salesData.oneDaySales.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm mb-1">Monthly Sales</h3>
          <p className="text-2xl font-semibold text-purple-600">
            ₹{salesData.monthlySales.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm mb-1">Yearly Sales</h3>
          <p className="text-2xl font-semibold text-orange-600">
            ₹{salesData.yearlySales.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sales;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { format } from 'date-fns';

// const Sales = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [salesData, setSalesData] = useState({
//     totalInvoices: 0,
//     oneDaySales: 0,
//     monthlySales: 0,
//     yearlySales: 0,
//   });

//   const token = localStorage.getItem('token');
//   const headers = {
//     Authorization: `Bearer ${token}`,
//   };

//   const today = format(new Date(), 'yyyy-MM-dd');
//   const month = format(new Date(), 'MM');
//   const year = format(new Date(), 'yyyy');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [res1, res2, res3, res4] = await Promise.all([
//           axios.get(`/api/sales/total-invoices?date=${today}`, { headers }),
//           axios.get(`/api/sales/one-day?date=${today}`, { headers }),
//           axios.get(`/api/sales/monthly?month=${month}&year=${year}`, { headers }),
//           axios.get(`/api/sales/yearly?year=${year}`, { headers }),
//         ]);

//         setSalesData({
//           totalInvoices: res1.data?.total || 0,
//           oneDaySales: res2.data?.totalSales || 0,
//           monthlySales: res3.data?.totalSales || 0,
//           yearlySales: res4.data?.totalSales || 0,
//         });

//         console.log("API Responses:", {
//           totalInvoices: res1.data,
//           oneDaySales: res2.data,
//           monthlySales: res3.data,
//           yearlySales: res4.data,
//         });

//       } catch (err) {
//         console.error("Sales API error:", err);
//         setError('Failed to fetch sales data.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [today, month, year]);

//   if (loading) return <p className="text-center text-gray-600">Loading sales data...</p>;
//   if (error) return <p className="text-center text-red-500">{error}</p>;

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-4">Sales Dashboard</h2>
      

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//         <div className="bg-white p-6 shadow-md rounded-lg">
//           <h3 className="text-lg font-semibold">Today's Invoices</h3>
//           <p className="text-3xl mt-2 text-blue-600">{salesData.totalInvoices}</p>
//         </div>

//         <div className="bg-white p-6 shadow-md rounded-lg">
//           <h3 className="text-lg font-semibold">One Day Sales</h3>
//           <p className="text-3xl mt-2 text-green-600">₹{salesData.oneDaySales.toFixed(2)}</p>
//         </div>

//         <div className="bg-white p-6 shadow-md rounded-lg">
//           <h3 className="text-lg font-semibold">Monthly Sales</h3>
//           <p className="text-3xl mt-2 text-purple-600">₹{salesData.monthlySales.toFixed(2)}</p>
//         </div>

//         <div className="bg-white p-6 shadow-md rounded-lg">
//           <h3 className="text-lg font-semibold">Yearly Sales</h3>
//           <p className="text-3xl mt-2 text-orange-600">₹{salesData.yearlySales.toFixed(2)}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sales;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { format } from 'date-fns';

// const Sales = () => {
//   const [totalInvoices, setTotalInvoices] = useState(0);
//   const [oneDaySales, setOneDaySales] = useState(0);
//   const [monthlySales, setMonthlySales] = useState(0);
//   const [yearlySales, setYearlySales] = useState(0);
//   const [error, setError] = useState('');

//   const token = localStorage.getItem('token');
//   const headers = {
//     Authorization: `Bearer ${token}`,
//   };

//   const today = format(new Date(), 'yyyy-MM-dd');
//   const currentMonth = format(new Date(), 'MM');
//   const currentYear = format(new Date(), 'yyyy');

//   useEffect(() => {
//     const fetchSalesData = async () => {
//       try {
//         const [invoiceRes, oneDayRes, monthlyRes, yearlyRes] = await Promise.all([
//           axios.get(`/api/sales/total-invoices?date=${today}`, { headers }),
//           axios.get(`/api/sales/one-day?date=${today}`, { headers }),
//           axios.get(`/api/sales/monthly?month=${currentMonth}&year=${currentYear}`, { headers }),
//           axios.get(`/api/sales/yearly?year=${currentYear}`, { headers }),
//         ]);

//         setTotalInvoices(invoiceRes.data.total || 0);
//         setOneDaySales(oneDayRes.data.totalSales || 0);
//         setMonthlySales(monthlyRes.data.totalSales || 0);
//         setYearlySales(yearlyRes.data.totalSales || 0);
//       } catch (err) {
//         console.error('Error fetching sales data:', err);
//         setError('Unable to fetch sales details.');
//       }
//     };

//     fetchSalesData();
//   }, [today, currentMonth, currentYear]);

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-4">Sales Dashboard</h2>
      
//       {error && <p className="text-red-600 mb-4">{error}</p>}

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//         <div className="bg-white p-6 shadow-md rounded-lg">
//           <h3 className="text-lg font-semibold">Today’s Invoices</h3>
//           <p className="text-3xl text-blue-600 mt-2">{totalInvoices}</p>
//         </div>

//         <div className="bg-white p-6 shadow-md rounded-lg">
//           <h3 className="text-lg font-semibold">One Day Sales</h3>
//           <p className="text-3xl text-green-600 mt-2">₹{oneDaySales.toFixed(2)}</p>
//         </div>

//         <div className="bg-white p-6 shadow-md rounded-lg">
//           <h3 className="text-lg font-semibold">Monthly Sales</h3>
//           <p className="text-3xl text-purple-600 mt-2">₹{monthlySales.toFixed(2)}</p>
//         </div>

//         <div className="bg-white p-6 shadow-md rounded-lg">
//           <h3 className="text-lg font-semibold">Yearly Sales</h3>
//           <p className="text-3xl text-orange-600 mt-2">₹{yearlySales.toFixed(2)}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sales;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Sales = () => {
//   const [option, setOption] = useState('');
//   const [date, setDate] = useState('');
//   const [month, setMonth] = useState('');
//   const [year, setYear] = useState('');
//   const [result, setResult] = useState(null);
//   const [token, setToken] = useState('');

//   useEffect(() => {
//     const storedToken = localStorage.getItem('token');
//     if (storedToken) setToken(storedToken);
//   }, []);

//   const handleFetch = async () => {
//     try {
//       let url = '';
//       if (option === 'total-invoices' && date) {
//         url = `/api/sales/total-invoices?date=${date}`;
//       } else if (option === 'one-day-sales' && date) {
//         url = `/api/sales/one-day?date=${date}`;
//       } else if (option === 'monthly-sales' && month && year) {
//         url = `/api/sales/monthly?month=${month}&year=${year}`;
//       } else if (option === 'yearly-sales' && year) {
//         url = `/api/sales/yearly?year=${year}`;
//       } else return;

//       const response = await axios.get(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setResult(response.data);
//     } catch (err) {
//       console.error('Error fetching sales data:', err);
//       setResult({ error: 'Failed to fetch data. Please try again later.' });
//     }
//   };

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Sales Dashboard</h2>

//       <select
//         className="mb-4 p-2 border rounded w-full"
//         onChange={(e) => {
//           setOption(e.target.value);
//           setResult(null);
//         }}
//         value={option}
//       >
//         <option value="">Select Option</option>
//         <option value="total-invoices">1. Total Invoices (by Date)</option>
//         <option value="one-day-sales">2. One Day Sales</option>
//         <option value="monthly-sales">3. Monthly Sales</option>
//         <option value="yearly-sales">4. Yearly Sales</option>
//       </select>

//       {(option === 'total-invoices' || option === 'one-day-sales') && (
//         <input
//           type="date"
//           className="mb-4 p-2 border rounded w-full"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//         />
//       )}

//       {option === 'monthly-sales' && (
//         <div className="flex gap-4 mb-4">
//           <select
//             className="p-2 border rounded w-1/2"
//             onChange={(e) => setMonth(e.target.value)}
//           >
//             <option value="">Month</option>
//             {[...Array(12).keys()].map((i) => (
//               <option key={i + 1} value={i + 1}>
//                 {new Date(0, i).toLocaleString('default', { month: 'long' })}
//               </option>
//             ))}
//           </select>

//           <input
//             type="number"
//             placeholder="Year"
//             className="p-2 border rounded w-1/2"
//             onChange={(e) => setYear(e.target.value)}
//           />
//         </div>
//       )}

//       {option === 'yearly-sales' && (
//         <input
//           type="number"
//           placeholder="Year"
//           className="mb-4 p-2 border rounded w-full"
//           onChange={(e) => setYear(e.target.value)}
//         />
//       )}

//       <button
//         onClick={handleFetch}
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         Show Result
//       </button>

//       {result && (
//         <div className="mt-6 p-4 bg-gray-100 rounded">
//           {result.error && <p>{result.error}</p>}
//           {option === 'total-invoices' && (
//             <p>Total invoices on {date}: <strong>{result.total}</strong></p>
//           )}
//           {option === 'one-day-sales' && (
//             <p>Sales on {date}: <strong>₹{result.totalSales}</strong></p>
//           )}
//           {option === 'monthly-sales' && (
//             <p>Total monthly sales in {month}/{year}: <strong>₹{result.totalSales}</strong></p>
//           )}
//           {option === 'yearly-sales' && (
//             <p>Total yearly sales in {year}: <strong>₹{result.totalSales}</strong></p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Sales;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Sales = () => {
//   const [option, setOption] = useState('');
//   const [date, setDate] = useState('');
//   const [month, setMonth] = useState('');
//   const [year, setYear] = useState('');
//   const [result, setResult] = useState(null);
//   const [token, setToken] = useState('');

//   useEffect(() => {
//     const storedToken = localStorage.getItem('token');
//     if (storedToken) setToken(storedToken);
//   }, []);

//   const handleFetch = async () => {
//     try {
//       let url = '';
//       if (option === 'total-invoices' && date) url = `/api/sales/total-invoices?date=${date}`;
//       else if (option === 'one-day-sales' && date) url = `/api/sales/one-day?date=${date}`;
//       else if (option === 'monthly-sales' && month && year) url = `/api/sales/monthly?month=${month}&year=${year}`;
//       else if (option === 'yearly-sales' && year) url = `/api/sales/yearly?year=${year}`;
//       else return;

//       const response = await axios.get(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setResult(response.data);
//     } catch (err) {
//       console.error('Error fetching sales data:', err);
//     }
//   };

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Sales Dashboard</h2>

//       <select
//         className="mb-4 p-2 border rounded w-full"
//         onChange={(e) => {
//           setOption(e.target.value);
//           setResult(null);
//         }}
//         value={option}
//       >
//         <option value="">Select Option</option>
//         <option value="total-invoices">1. Total Invoices (by Date)</option>
//         <option value="one-day-sales">2. One Day Sales</option>
//         <option value="monthly-sales">3. Monthly Sales</option>
//         <option value="yearly-sales">4. Yearly Sales</option>
//       </select>

//       {(option === 'total-invoices' || option === 'one-day-sales') && (
//         <input
//           type="date"
//           className="mb-4 p-2 border rounded w-full"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//         />
//       )}

//       {option === 'monthly-sales' && (
//         <div className="flex gap-4 mb-4">
//           <select
//             className="p-2 border rounded w-1/2"
//             onChange={(e) => setMonth(e.target.value)}
//           >
//             <option value="">Month</option>
//             {[...Array(12).keys()].map((i) => (
//               <option key={i + 1} value={i + 1}>{
//                 new Date(0, i).toLocaleString('default', { month: 'long' })
//               }</option>
//             ))}
//           </select>

//           <input
//             type="number"
//             placeholder="Year"
//             className="p-2 border rounded w-1/2"
//             onChange={(e) => setYear(e.target.value)}
//           />
//         </div>
//       )}

//       {option === 'yearly-sales' && (
//         <input
//           type="number"
//           placeholder="Year"
//           className="mb-4 p-2 border rounded w-full"
//           onChange={(e) => setYear(e.target.value)}
//         />
//       )}

//       <button
//         onClick={handleFetch}
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         Show Result
//       </button>

//       {result && (
//         <div className="mt-6 p-4 bg-gray-100 rounded">
//           {option === 'total-invoices' && (
//             <p>Total invoices on {date}: <strong>{result.total}</strong></p>
//           )}
//           {option === 'one-day-sales' && (
//             <p>Sales on {date}: <strong>₹{result.totalSales}</strong></p>
//           )}
//           {option === 'monthly-sales' && (
//             <p>Total monthly sales in {month}/{year}: <strong>₹{result.totalSales}</strong></p>
//           )}
//           {option === 'yearly-sales' && (
//             <p>Total yearly sales in {year}: <strong>₹{result.totalSales}</strong></p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Sales;
// import React, { useState } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import axios from 'axios';

// const Sales = () => {
//   const [filterType, setFilterType] = useState('');
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedMonth, setSelectedMonth] = useState(null);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [result, setResult] = useState(null);

//   const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
//   const months = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   const handleFetch = async () => {
//     try {
//       let res;

//       if (filterType === 'totalInvoices') {
//         res = await axios.get(`/api/invoices/date/${selectedDate.toISOString().split('T')[0]}`);
//       } else if (filterType === 'oneDaySales') {
//         res = await axios.get(`/api/sales/day/${selectedDate.toISOString().split('T')[0]}`);
//       } else if (filterType === 'monthlySales') {
//         res = await axios.get(`/api/sales/month/${selectedMonth + 1}/${selectedYear}`);
//       } else if (filterType === 'yearlySales') {
//         res = await axios.get(`/api/sales/year/${selectedYear}`);
//       }

//       setResult(res.data);
//     } catch (err) {
//       console.error(err);
//       setResult({ error: 'Something went wrong.' });
//     }
//   };

//   return (
//     <div className="p-6 max-w-xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Sales & Invoices Report</h1>

//       <select
//         className="w-full mb-4 p-2 border rounded"
//         onChange={e => {
//           setFilterType(e.target.value);
//           setResult(null);
//         }}
//         value={filterType}
//       >
//         <option value="">-- Select Filter --</option>
//         <option value="totalInvoices">Total Invoices (by Date)</option>
//         <option value="oneDaySales">One Day Sales</option>
//         <option value="monthlySales">Monthly Sales</option>
//         <option value="yearlySales">Yearly Sales</option>
//       </select>

//       {['totalInvoices', 'oneDaySales'].includes(filterType) && (
//         <div className="mb-4">
//           <label className="block mb-2">Select Date:</label>
//           <DatePicker
//             selected={selectedDate}
//             onChange={date => setSelectedDate(date)}
//             className="w-full p-2 border rounded"
//             dateFormat="yyyy-MM-dd"
//             placeholderText="Pick a date"
//           />
//         </div>
//       )}

//       {filterType === 'monthlySales' && (
//         <div className="grid grid-cols-2 gap-4 mb-4">
//           <div>
//             <label className="block mb-2">Select Month:</label>
//             <select
//               className="w-full p-2 border rounded"
//               onChange={e => setSelectedMonth(Number(e.target.value))}
//               defaultValue=""
//             >
//               <option value="" disabled>-- Month --</option>
//               {months.map((month, index) => (
//                 <option key={index} value={index}>{month}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block mb-2">Select Year:</label>
//             <select
//               className="w-full p-2 border rounded"
//               onChange={e => setSelectedYear(Number(e.target.value))}
//               value={selectedYear}
//             >
//               {years.map((year, idx) => (
//                 <option key={idx} value={year}>{year}</option>
//               ))}
//             </select>
//           </div>
//         </div>
//       )}

//       {filterType === 'yearlySales' && (
//         <div className="mb-4">
//           <label className="block mb-2">Select Year:</label>
//           <select
//             className="w-full p-2 border rounded"
//             onChange={e => setSelectedYear(Number(e.target.value))}
//             value={selectedYear}
//           >
//             {years.map((year, idx) => (
//               <option key={idx} value={year}>{year}</option>
//             ))}
//           </select>
//         </div>
//       )}

//       <button
//         onClick={handleFetch}
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6"
//         disabled={
//           (['totalInvoices', 'oneDaySales'].includes(filterType) && !selectedDate) ||
//           (filterType === 'monthlySales' && (selectedMonth === null || !selectedYear)) ||
//           (filterType === 'yearlySales' && !selectedYear)
//         }
//       >
//         Show
//       </button>

//       {result && (
//         <div className="bg-gray-100 p-4 rounded">
//           {result.error ? (
//             <p className="text-red-600">{result.error}</p>
//           ) : (
//             <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(result, null, 2)}</pre>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Sales;
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Sales = () => {
//   const [totalInvoices, setTotalInvoices] = useState(0);
//   const [totalSales, setTotalSales] = useState(0);
//   const [monthlySales, setMonthlySales] = useState(0);
//   const [weeklySales, setWeeklySales] = useState(0);
//   const [yearlySales, setYearlySales] = useState(0);

//   useEffect(() => {
//     const fetchInvoices = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get("/api/invoices", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = res.data || []; // <-- FIXED: previously was res.data.invoices
//         setTotalInvoices(data.length);

//         const total = data.reduce((acc, invoice) => acc + invoice.totalAmount, 0);
//         setTotalSales(total);

//         const now = new Date();

//         // Monthly Sales
//         const monthly = data.filter((invoice) => {
//           const date = new Date(invoice.createdAt);
//           return (
//             date.getMonth() === now.getMonth() &&
//             date.getFullYear() === now.getFullYear()
//           );
//         }).reduce((acc, invoice) => acc + invoice.totalAmount, 0);
//         setMonthlySales(monthly);

//         // Weekly Sales
//         const oneWeekAgo = new Date();
//         oneWeekAgo.setDate(now.getDate() - 7);

//         const weekly = data.filter((invoice) => {
//           const date = new Date(invoice.createdAt);
//           return date >= oneWeekAgo && date <= now;
//         }).reduce((acc, invoice) => acc + invoice.totalAmount, 0);
//         setWeeklySales(weekly);

//         // Yearly Sales
//         const yearly = data.filter((invoice) => {
//           const date = new Date(invoice.createdAt);
//           return date.getFullYear() === now.getFullYear();
//         }).reduce((acc, invoice) => acc + invoice.totalAmount, 0);
//         setYearlySales(yearly);
//       } catch (error) {
//         console.error("Failed to fetch invoices", error);
//       }
//     };

//     fetchInvoices();
//   }, []);

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-semibold mb-4">Sales Dashboard</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <div className="bg-white p-4 shadow rounded-lg">
//           <h2 className="text-lg font-medium">Total Invoices</h2>
//           <p className="text-2xl font-bold">{totalInvoices}</p>
//         </div>
//         <div className="bg-white p-4 shadow rounded-lg">
//           <h2 className="text-lg font-medium">Total Sales</h2>
//           <p className="text-2xl font-bold">₹{totalSales}</p>
//         </div>
//         <div className="bg-white p-4 shadow rounded-lg">
//           <h2 className="text-lg font-medium">Monthly Sales</h2>
//           <p className="text-2xl font-bold">₹{monthlySales}</p>
//         </div>
//         <div className="bg-white p-4 shadow rounded-lg">
//           <h2 className="text-lg font-medium">Weekly Sales</h2>
//           <p className="text-2xl font-bold">₹{weeklySales}</p>
//         </div>
//         <div className="bg-white p-4 shadow rounded-lg">
//           <h2 className="text-lg font-medium">Yearly Sales</h2>
//           <p className="text-2xl font-bold">₹{yearlySales}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sales;



////fine working -> good
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaCalendarAlt, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';

// const Sales = () => {
//   const [invoices, setInvoices] = useState([]);
//   const [totalSales, setTotalSales] = useState(0);
//   const [monthlySales, setMonthlySales] = useState(0);
//   const [weeklySales, setWeeklySales] = useState(0);
//   const [yearlySales, setYearlySales] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchSales = async () => {
//       try {
//         if (!token) {
//           setError('No token found. Please log in.');
//           setLoading(false);
//           return;
//         }

//         const res = await axios.get('/api/invoices', {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const data = res.data.invoices || [];
//         setInvoices(data);

//         let total = 0, monthly = 0, weekly = 0, yearly = 0;
//         const now = new Date();

//         const startOfWeek = new Date(now);
//         const day = now.getDay();
//         const diffToMonday = day === 0 ? -6 : 1 - day;
//         startOfWeek.setDate(now.getDate() + diffToMonday);
//         startOfWeek.setHours(0, 0, 0, 0);

//         const endOfWeek = new Date(startOfWeek);
//         endOfWeek.setDate(startOfWeek.getDate() + 6);
//         endOfWeek.setHours(23, 59, 59, 999);

//         data.forEach((invoice) => {
//           if (!invoice.date || !invoice.totalAmount) return;

//           const invoiceDate = new Date(invoice.date);
//           const amount = parseFloat(invoice.totalAmount) || 0;
//           if (isNaN(invoiceDate.getTime())) return;

//           total += amount;

//           if (
//             invoiceDate.getMonth() === now.getMonth() &&
//             invoiceDate.getFullYear() === now.getFullYear()
//           ) {
//             monthly += amount;
//           }

//           if (invoiceDate >= startOfWeek && invoiceDate <= endOfWeek) {
//             weekly += amount;
//           }

//           if (invoiceDate.getFullYear() === now.getFullYear()) {
//             yearly += amount;
//           }
//         });

//         setTotalSales(total);
//         setMonthlySales(monthly);
//         setWeeklySales(weekly);
//         setYearlySales(yearly);
//         setLoading(false);
//       } catch (err) {
//         console.error('Fetch sales error:', err);
//         setError('Failed to load sales data.');
//         setLoading(false);
//       }
//     };

//     fetchSales();
//   }, [token]);

//   if (loading) return <div className="p-6 text-center text-lg text-gray-600">Loading sales data...</div>;
//   if (error) return <div className="p-6 text-center text-red-600 font-medium">{error}</div>;

//   return (
//     <div className="p-6 min-h-screen bg-gray-100">
//       <h1 className="text-3xl font-bold text-[#00668c] mb-8 text-center">Sales Dashboard</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//         <Card icon={<FaCalendarAlt />} label="Total Invoices" value={invoices.length} color="#0072ff" />
//         <Card icon={<FaMoneyBillWave />} label="Total Sales" value={`₹${totalSales.toFixed(2)}`} color="#43cea2" />
//         <Card icon={<FaChartLine />} label="Monthly Sales" value={`₹${monthlySales.toFixed(2)}`} color="#ff6a00" />
//         <Card icon={<FaChartLine />} label="Weekly Sales" value={`₹${weeklySales.toFixed(2)}`} color="#ee0979" />
//       </div>

//       <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition max-w-lg mx-auto">
//         <FaChartLine className="text-3xl text-[#00c3ff] mb-4" />
//         <h2 className="text-xl font-semibold text-gray-700">Yearly Sales</h2>
//         <p className="text-2xl font-bold text-gray-900">₹{yearlySales.toFixed(2)}</p>
//       </div>
//     </div>
//   );
// };

// const Card = ({ icon, label, value, color }) => (
//   <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
//     <div className="text-3xl mb-4" style={{ color }}>{icon}</div>
//     <h2 className="text-xl font-semibold text-gray-700">{label}</h2>
//     <p className="text-2xl font-bold text-gray-900">{value}</p>
//   </div>
// );

// export default Sales;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaCalendarAlt, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';

// const Sales = () => {
//   const [invoices, setInvoices] = useState([]);
//   const [totalSales, setTotalSales] = useState(0);
//   const [monthlySales, setMonthlySales] = useState(0);
//   const [weeklySales, setWeeklySales] = useState(0);
//   const [yearlySales, setYearlySales] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchSales = async () => {
//       try {
//         if (!token) {
//           setError('No token found. Please log in.');
//           setLoading(false);
//           return;
//         }

//         const res = await axios.get('/api/invoices', {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const data = res.data.invoices || [];
//         console.log('Fetched invoices:', data);
//         setInvoices(data);

//         let total = 0, monthly = 0, weekly = 0, yearly = 0;
//         const now = new Date();

//         const startOfWeek = new Date(now);
//         const day = now.getDay();
//         const diffToMonday = day === 0 ? -6 : 1 - day;
//         startOfWeek.setDate(now.getDate() + diffToMonday);
//         startOfWeek.setHours(0, 0, 0, 0);

//         const endOfWeek = new Date(startOfWeek);
//         endOfWeek.setDate(startOfWeek.getDate() + 6);
//         endOfWeek.setHours(23, 59, 59, 999);

//         data.forEach((invoice) => {
//           if (!invoice.date || !invoice.totalAmount) return;

//           const invoiceDate = new Date(invoice.date);
//           const amount = parseFloat(invoice.totalAmount) || 0;
//           if (isNaN(invoiceDate.getTime())) return;

//           total += amount;

//           if (
//             invoiceDate.getMonth() === now.getMonth() &&
//             invoiceDate.getFullYear() === now.getFullYear()
//           ) {
//             monthly += amount;
//           }

//           if (invoiceDate >= startOfWeek && invoiceDate <= endOfWeek) {
//             weekly += amount;
//           }

//           if (invoiceDate.getFullYear() === now.getFullYear()) {
//             yearly += amount;
//           }
//         });

//         setTotalSales(total);
//         setMonthlySales(monthly);
//         setWeeklySales(weekly);
//         setYearlySales(yearly);
//         setLoading(false);
//       } catch (err) {
//         console.error('Fetch sales error:', err);
//         setError('Failed to load sales data.');
//         setLoading(false);
//       }
//     };

//     fetchSales();
//   }, [token]);

//   if (loading) return <div className="p-6 text-center text-lg text-gray-600">Loading sales data...</div>;
//   if (error) return <div className="p-6 text-center text-red-600 font-medium">{error}</div>;

//   return (
//     <div className="p-6 min-h-screen bg-gray-100">
//       <h1 className="text-3xl font-bold text-[#00668c] mb-8 text-center">Sales Dashboard</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//         <Card icon={<FaCalendarAlt />} label="Total Invoices" value={invoices.length} color="#0072ff" />
//         <Card icon={<FaMoneyBillWave />} label="Total Sales" value={`₹${totalSales.toFixed(2)}`} color="#43cea2" />
//         <Card icon={<FaChartLine />} label="Monthly Sales" value={`₹${monthlySales.toFixed(2)}`} color="#ff6a00" />
//         <Card icon={<FaChartLine />} label="Weekly Sales" value={`₹${weeklySales.toFixed(2)}`} color="#ee0979" />
//       </div>

//       <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition max-w-lg mx-auto">
//         <FaChartLine className="text-3xl text-[#00c3ff] mb-4" />
//         <h2 className="text-xl font-semibold text-gray-700">Yearly Sales</h2>
//         <p className="text-2xl font-bold text-gray-900">₹{yearlySales.toFixed(2)}</p>
//       </div>
//     </div>
//   );
// };

// const Card = ({ icon, label, value, color }) => (
//   <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
//     <div className="text-3xl mb-4" style={{ color }}>{icon}</div>
//     <h2 className="text-xl font-semibold text-gray-700">{label}</h2>
//     <p className="text-2xl font-bold text-gray-900">{value}</p>
//   </div>
// );

// export default Sales;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaCalendarAlt, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';

// const Sales = () => {
//   const [invoices, setInvoices] = useState([]);
//   const [totalSales, setTotalSales] = useState(0);
//   const [monthlySales, setMonthlySales] = useState(0);
//   const [weeklySales, setWeeklySales] = useState(0);
//   const [yearlySales, setYearlySales] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchSales = async () => {
//       try {
//         if (!token) {
//           setError('No token found. Please log in.');
//           setLoading(false);
//           return;
//         }

//         const res = await axios.get('/api/invoices', {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const data = res.data.invoices || [];
//         console.log('Fetched invoices:', data);
//         setInvoices(data);

//         let total = 0, monthly = 0, weekly = 0, yearly = 0;
//         const now = new Date();

//         const startOfWeek = new Date(now);
//         const day = now.getDay();
//         const diffToMonday = day === 0 ? -6 : 1 - day;
//         startOfWeek.setDate(now.getDate() + diffToMonday);
//         startOfWeek.setHours(0, 0, 0, 0);

//         const endOfWeek = new Date(startOfWeek);
//         endOfWeek.setDate(startOfWeek.getDate() + 6);
//         endOfWeek.setHours(23, 59, 59, 999);

//         data.forEach((invoice) => {
//           if (!invoice.date || !invoice.totalAmount) return;

//           const invoiceDate = new Date(invoice.date);
//           const amount = parseFloat(invoice.totalAmount) || 0;
//           if (isNaN(invoiceDate.getTime())) return;

//           total += amount;

//           if (
//             invoiceDate.getMonth() === now.getMonth() &&
//             invoiceDate.getFullYear() === now.getFullYear()
//           ) {
//             monthly += amount;
//           }

//           if (invoiceDate >= startOfWeek && invoiceDate <= endOfWeek) {
//             weekly += amount;
//           }

//           if (invoiceDate.getFullYear() === now.getFullYear()) {
//             yearly += amount;
//           }
//         });

//         setTotalSales(total);
//         setMonthlySales(monthly);
//         setWeeklySales(weekly);
//         setYearlySales(yearly);
//         setLoading(false);
//       } catch (err) {
//         console.error('Fetch sales error:', err);
//         setError('Failed to load sales data.');
//         setLoading(false);
//       }
//     };

//     fetchSales();
//   }, [token]);

//   if (loading) return <div className="p-6 text-center text-lg text-gray-600">Loading sales data...</div>;
//   if (error) return <div className="p-6 text-center text-red-600 font-medium">{error}</div>;

//   return (
//     <div className="p-6 min-h-screen bg-gray-100">
//       <h1 className="text-3xl font-bold text-[#00668c] mb-8 text-center">Sales Dashboard</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//         <Card icon={<FaCalendarAlt />} label="Total Invoices" value={invoices.length} color="#0072ff" />
//         <Card icon={<FaMoneyBillWave />} label="Total Sales" value={`₹${totalSales.toFixed(2)}`} color="#43cea2" />
//         <Card icon={<FaChartLine />} label="Monthly Sales" value={`₹${monthlySales.toFixed(2)}`} color="#ff6a00" />
//         <Card icon={<FaChartLine />} label="Weekly Sales" value={`₹${weeklySales.toFixed(2)}`} color="#ee0979" />
//       </div>

//       <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition max-w-lg mx-auto">
//         <FaChartLine className="text-3xl text-[#00c3ff] mb-4" />
//         <h2 className="text-xl font-semibold text-gray-700">Yearly Sales</h2>
//         <p className="text-2xl font-bold text-gray-900">₹{yearlySales.toFixed(2)}</p>
//       </div>
//     </div>
//   );
// };

// const Card = ({ icon, label, value, color }) => (
//   <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
//     <div className="text-3xl mb-4" style={{ color }}>{icon}</div>
//     <h2 className="text-xl font-semibold text-gray-700">{label}</h2>
//     <p className="text-2xl font-bold text-gray-900">{value}</p>
//   </div>
// );

// export default Sales;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaCalendarAlt, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';

// const Sales = () => {
//   const [invoices, setInvoices] = useState([]);
//   const [totalSales, setTotalSales] = useState(0);
//   const [monthlySales, setMonthlySales] = useState(0);
//   const [weeklySales, setWeeklySales] = useState(0);
//   const [yearlySales, setYearlySales] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchSales = async () => {
//       try {
//         if (!token) {
//           setError('No token found. Please log in.');
//           setLoading(false);
//           return;
//         }

//         const res = await axios.get('/api/invoices', {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const data = res.data.invoices || [];
//         console.log('Fetched invoices:', data);
//         setInvoices(data);

//         let total = 0, monthly = 0, weekly = 0, yearly = 0;
//         const now = new Date();

//         const startOfWeek = new Date(now);
//         const day = now.getDay();
//         const diffToMonday = day === 0 ? -6 : 1 - day;
//         startOfWeek.setDate(now.getDate() + diffToMonday);
//         startOfWeek.setHours(0, 0, 0, 0);

//         const endOfWeek = new Date(startOfWeek);
//         endOfWeek.setDate(startOfWeek.getDate() + 6);
//         endOfWeek.setHours(23, 59, 59, 999);

//         data.forEach((invoice) => {
//           if (!invoice.date || !invoice.totalAmount) return;

//           const invoiceDate = new Date(invoice.date);
//           const amount = parseFloat(invoice.totalAmount) || 0;
//           if (isNaN(invoiceDate.getTime())) return;

//           total += amount;

//           if (
//             invoiceDate.getMonth() === now.getMonth() &&
//             invoiceDate.getFullYear() === now.getFullYear()
//           ) {
//             monthly += amount;
//           }

//           if (invoiceDate >= startOfWeek && invoiceDate <= endOfWeek) {
//             weekly += amount;
//           }

//           if (invoiceDate.getFullYear() === now.getFullYear()) {
//             yearly += amount;
//           }
//         });

//         setTotalSales(total);
//         setMonthlySales(monthly);
//         setWeeklySales(weekly);
//         setYearlySales(yearly);
//         setLoading(false);
//       } catch (err) {
//         console.error('Fetch sales error:', err);
//         setError('Failed to load sales data.');
//         setLoading(false);
//       }
//     };

//     fetchSales();
//   }, [token]);

//   if (loading) return <div className="p-6 text-center text-lg text-gray-600">Loading sales data...</div>;
//   if (error) return <div className="p-6 text-center text-red-600 font-medium">{error}</div>;

//   return (
//     <div className="p-6 min-h-screen bg-gray-100">
//       <h1 className="text-3xl font-bold text-[#00668c] mb-8 text-center">Sales Dashboard</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//         <Card icon={<FaCalendarAlt />} label="Total Invoices" value={invoices.length} color="#0072ff" />
//         <Card icon={<FaMoneyBillWave />} label="Total Sales" value={`₹${totalSales.toFixed(2)}`} color="#43cea2" />
//         <Card icon={<FaChartLine />} label="Monthly Sales" value={`₹${monthlySales.toFixed(2)}`} color="#ff6a00" />
//         <Card icon={<FaChartLine />} label="Weekly Sales" value={`₹${weeklySales.toFixed(2)}`} color="#ee0979" />
//       </div>

//       <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition max-w-lg mx-auto">
//         <FaChartLine className="text-3xl text-[#00c3ff] mb-4" />
//         <h2 className="text-xl font-semibold text-gray-700">Yearly Sales</h2>
//         <p className="text-2xl font-bold text-gray-900">₹{yearlySales.toFixed(2)}</p>
//       </div>
//     </div>
//   );
// };

// const Card = ({ icon, label, value, color }) => (
//   <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
//     <div className="text-3xl mb-4" style={{ color }}>{icon}</div>
//     <h2 className="text-xl font-semibold text-gray-700">{label}</h2>
//     <p className="text-2xl font-bold text-gray-900">{value}</p>
//   </div>
// );

// export default Sales;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaCalendarAlt, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';

// const Sales = () => {
//   const [invoices, setInvoices] = useState([]);
//   const [totalSales, setTotalSales] = useState(0);
//   const [monthlySales, setMonthlySales] = useState(0);
//   const [weeklySales, setWeeklySales] = useState(0);
//   const [yearlySales, setYearlySales] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchSales = async () => {
//       try {
//         const res = await axios.get('/api/invoices', {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const data = res.data.invoices || [];
//         setInvoices(data);

//         let total = 0, monthly = 0, weekly = 0, yearly = 0;
//         const now = new Date();

//         // Start of the week (Monday)
//         const startOfWeek = new Date(now);
//         const day = now.getDay();
//         const diffToMonday = day === 0 ? -6 : 1 - day;
//         startOfWeek.setDate(now.getDate() + diffToMonday);
//         startOfWeek.setHours(0, 0, 0, 0);

//         const endOfWeek = new Date(startOfWeek);
//         endOfWeek.setDate(startOfWeek.getDate() + 6);
//         endOfWeek.setHours(23, 59, 59, 999);

//         data.forEach((invoice) => {
//           if (!invoice.date || !invoice.totalAmount) return;

//           const invoiceDate = new Date(invoice.date);
//           const amount = parseFloat(invoice.totalAmount) || 0;
//           if (isNaN(invoiceDate.getTime())) return;

//           total += amount;

//           if (
//             invoiceDate.getMonth() === now.getMonth() &&
//             invoiceDate.getFullYear() === now.getFullYear()
//           ) {
//             monthly += amount;
//           }

//           if (invoiceDate >= startOfWeek && invoiceDate <= endOfWeek) {
//             weekly += amount;
//           }

//           if (invoiceDate.getFullYear() === now.getFullYear()) {
//             yearly += amount;
//           }
//         });

//         setTotalSales(total);
//         setMonthlySales(monthly);
//         setWeeklySales(weekly);
//         setYearlySales(yearly);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching sales:', err);
//         setError('Failed to load sales data. Please try again.');
//         setLoading(false);
//       }
//     };

//     fetchSales();
//   }, [token]);

//   if (loading) {
//     return <div className="p-6 text-center text-lg text-gray-600">Loading sales data...</div>;
//   }

//   if (error) {
//     return <div className="p-6 text-center text-red-600 font-medium">{error}</div>;
//   }

//   return (
//     <div className="p-6 min-h-screen bg-gray-100">
//       <h1 className="text-3xl font-bold text-[#00668c] mb-8 text-center">Sales Dashboard</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//         <Card icon={<FaCalendarAlt />} label="Total Invoices" value={invoices.length} color="#0072ff" />
//         <Card icon={<FaMoneyBillWave />} label="Total Sales" value={`₹${totalSales.toFixed(2)}`} color="#43cea2" />
//         <Card icon={<FaChartLine />} label="Monthly Sales" value={`₹${monthlySales.toFixed(2)}`} color="#ff6a00" />
//         <Card icon={<FaChartLine />} label="Weekly Sales" value={`₹${weeklySales.toFixed(2)}`} color="#ee0979" />
//       </div>

//       <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition max-w-lg mx-auto">
//         <FaChartLine className="text-3xl text-[#00c3ff] mb-4" />
//         <h2 className="text-xl font-semibold text-gray-700">Yearly Sales</h2>
//         <p className="text-2xl font-bold text-gray-900">₹{yearlySales.toFixed(2)}</p>
//       </div>
//     </div>
//   );
// };

// const Card = ({ icon, label, value, color }) => (
//   <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
//     <div className={`text-3xl mb-4`} style={{ color }}>{icon}</div>
//     <h2 className="text-xl font-semibold text-gray-700">{label}</h2>
//     <p className="text-2xl font-bold text-gray-900">{value}</p>
//   </div>
// );

// export default Sales;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaCalendarAlt, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';

// const Sales = () => {
//   const [invoices, setInvoices] = useState([]);
//   const [totalSales, setTotalSales] = useState(0);
//   const [monthlySales, setMonthlySales] = useState(0);
//   const [weeklySales, setWeeklySales] = useState(0);
//   const [yearlySales, setYearlySales] = useState(0);

//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchSales = async () => {
//       try {
//         const res = await axios.get('/api/invoices', {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const data = res.data.invoices;
//         setInvoices(data);

//         // Calculate sales statistics
//         let total = 0, monthly = 0, weekly = 0, yearly = 0;
//         const now = new Date();

//         data.forEach((invoice) => {
//           const invoiceDate = new Date(invoice.date);
//           const amount = invoice.totalAmount;
//           total += amount;

//           if (
//             invoiceDate.getMonth() === now.getMonth() &&
//             invoiceDate.getFullYear() === now.getFullYear()
//           ) {
//             monthly += amount;
//           }

//           const startOfWeek = new Date(now);
//           startOfWeek.setDate(now.getDate() - now.getDay());
//           const endOfWeek = new Date(startOfWeek);
//           endOfWeek.setDate(startOfWeek.getDate() + 6);

//           if (invoiceDate >= startOfWeek && invoiceDate <= endOfWeek) {
//             weekly += amount;
//           }

//           if (invoiceDate.getFullYear() === now.getFullYear()) {
//             yearly += amount;
//           }
//         });

//         setTotalSales(total);
//         setMonthlySales(monthly);
//         setWeeklySales(weekly);
//         setYearlySales(yearly);
//       } catch (err) {
//         console.error('Error fetching sales:', err);
//       }
//     };

//     fetchSales();
//   }, [token]);

//   return (
//     <div className="p-6 min-h-screen bg-gray-100">
//       <h1 className="text-3xl font-bold text-[#00668c] mb-8 text-center">Sales Dashboard</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//         {/* Total Invoices */}
//         <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
//           <FaCalendarAlt className="text-3xl text-[#0072ff] mb-4" />
//           <h2 className="text-xl font-semibold text-gray-700">Total Invoices</h2>
//           <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
//         </div>

//         {/* Total Sales */}
//         <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
//           <FaMoneyBillWave className="text-3xl text-[#43cea2] mb-4" />
//           <h2 className="text-xl font-semibold text-gray-700">Total Sales</h2>
//           <p className="text-2xl font-bold text-gray-900">₹{totalSales.toFixed(2)}</p>
//         </div>

//         {/* Monthly Sales */}
//         <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
//           <FaChartLine className="text-3xl text-[#ff6a00] mb-4" />
//           <h2 className="text-xl font-semibold text-gray-700">Monthly Sales</h2>
//           <p className="text-2xl font-bold text-gray-900">₹{monthlySales.toFixed(2)}</p>
//         </div>

//         {/* Weekly Sales */}
//         <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
//           <FaChartLine className="text-3xl text-[#ee0979] mb-4" />
//           <h2 className="text-xl font-semibold text-gray-700">Weekly Sales</h2>
//           <p className="text-2xl font-bold text-gray-900">₹{weeklySales.toFixed(2)}</p>
//         </div>
//       </div>

//       {/* Yearly Sales */}
//       <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition max-w-lg mx-auto">
//         <FaChartLine className="text-3xl text-[#00c3ff] mb-4" />
//         <h2 className="text-xl font-semibold text-gray-700">Yearly Sales</h2>
//         <p className="text-2xl font-bold text-gray-900">₹{yearlySales.toFixed(2)}</p>
//       </div>
//     </div>
//   );
// };

// export default Sales;
