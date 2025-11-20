import React, { useEffect, useState } from 'react';

const GenerateBills = () => {
  const [businessDetails, setBusinessDetails] = useState({});
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [items, setItems] = useState([{ description: '', quantity: 1, price: 0 }]);
  const [gstRate] = useState(18);
  const [gstAmount, setGstAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) setBusinessDetails(data);
        else console.error('Failed to fetch business details');
      } catch (err) {
        console.error(err);
      }
    };

    fetchBusinessDetails();
  }, []);

  const handleItemChange = (index, event) => {
    const { name, value } = event.target;
    const newItems = [...items];
    newItems[index][name] = name === 'quantity' || name === 'price' ? Number(value) : value;
    setItems(newItems);
    calculateTotal(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    calculateTotal(newItems);
  };

  const calculateTotal = (items) => {
    const totalInclusive = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const gst = (totalInclusive * gstRate) / (100 + gstRate);
    setGstAmount(gst);
    setTotalAmount(totalInclusive);
  };

  const generateInvoiceNumber = () => {
    const now = new Date();
    return `INV-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now
      .getDate()
      .toString()
      .padStart(2, '0')}-${now.getTime().toString().slice(-5)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const billData = {
      businessDetails,
      customerName,
      customerMobile,
      items,
      totalAmount,
      gstAmount,
      gstRate,
      date: new Date().toLocaleString(),
      invoiceNumber: generateInvoiceNumber(),
    };

    const invoiceWindow = window.open('', 'PRINT', 'height=800,width=600');
    invoiceWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; color: #333; }
            .header { text-align: center; margin-bottom: 20px; }
            .header img { max-width: 120px; margin-bottom: 10px; }
            h1 { font-size: 2em; margin-bottom: 5px; }
            .details, .customer { margin-bottom: 20px; }
            .details p, .customer p { margin: 2px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            table, th, td { border: 1px solid #ccc; }
            th, td { padding: 12px; text-align: center; }
            th { background-color: #f0f0f0; }
            .total { text-align: right; font-size: 1.2em; margin-top: 20px; font-weight: bold; }
            hr { margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            ${billData.businessDetails.logo ? `<img src="http://localhost:5000${billData.businessDetails.logo}" alt="Business Logo"/>` : ''}
            <h1>${billData.businessDetails.businessName || ''}</h1>
            <div class="details">
              <p>${billData.businessDetails.address || ''}</p>
              <p>Phone: ${billData.businessDetails.phone || ''}</p>
              <p>Email: ${billData.businessDetails.email || ''}</p>
              <p>GST No: ${billData.businessDetails.gstNo || ''}</p>
            </div>
          </div>

          <hr/>

          <div class="customer">
            <h2>Invoice</h2>
            <p><strong>Invoice No:</strong> ${billData.invoiceNumber}</p>
            <p><strong>Date:</strong> ${billData.date}</p>
            <p><strong>Customer Name:</strong> ${billData.customerName}</p>
            <p><strong>Customer Mobile:</strong> ${billData.customerMobile}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price (incl. GST)</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${billData.items.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total">
            GST (${billData.gstRate}%): ₹${billData.gstAmount.toFixed(2)}<br/>
            Grand Total (incl. GST): ₹${billData.totalAmount.toFixed(2)}
          </div>

          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              }
            }
          </script>
        </body>
      </html>
    `);
    invoiceWindow.document.close();
    invoiceWindow.focus();

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerName: billData.customerName,
          customerMobile: billData.customerMobile,
          items: billData.items,
          totalAmount: billData.totalAmount,
          gstAmount: billData.gstAmount,
          gstRate: billData.gstRate,
          date: billData.date,
          invoiceNumber: billData.invoiceNumber,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage('Successfully saved to database');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        console.error('Failed to save invoice:', result.error);
        setSuccessMessage('');
      }
    } catch (err) {
      console.error('Error saving invoice:', err);
      setSuccessMessage('');
    }

    setCustomerName('');
    setCustomerMobile('');
    setItems([{ description: '', quantity: 1, price: 0 }]);
    setGstAmount(0);
    setTotalAmount(0);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center mb-8 space-x-6 bg-white p-6 rounded-lg shadow-md">
        {businessDetails.logo && (
          <img
            src={`http://localhost:5000${businessDetails.logo}`}
            alt="Business Logo"
            className="w-24 h-24 object-contain rounded"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold text-[#00668c]">{businessDetails.businessName}</h1>
          <p className="text-gray-700">{businessDetails.address}</p>
          <p className="text-gray-700">Phone: {businessDetails.phone}</p>
          <p className="text-gray-700">Email: {businessDetails.email}</p>
          <p className="text-gray-700">GST No: {businessDetails.gstNo}</p>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-center text-[#00668c] mb-8">Generate Bill</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="customerName" className="block text-sm font-bold text-gray-700 mb-2">Customer Name</label>
          <input
            type="text"
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer name"
            className="border rounded w-full py-2 px-3 shadow text-gray-700"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="customerMobile" className="block text-sm font-bold text-gray-700 mb-2">Customer Mobile Number</label>
          <input
            type="tel"
            id="customerMobile"
            value={customerMobile}
            onChange={(e) => setCustomerMobile(e.target.value)}
            placeholder="Enter customer mobile number"
            pattern="^\+?[0-9\s\-]{7,15}$"
            title="Enter a valid phone number"
            className="border rounded w-full py-2 px-3 shadow text-gray-700"
            required
          />
        </div>

        <h3 className="text-xl font-bold mb-4">Items</h3>
        {items.map((item, index) => (
          <div key={index} className="flex mb-4">
            <input
              type="text"
              name="description"
              value={item.description}
              onChange={(e) => handleItemChange(index, e)}
              placeholder="Item Description"
              className="border rounded w-1/2 py-2 px-3 mr-2 text-gray-700 shadow"
              required
            />
            <input
              type="number"
              name="quantity"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, e)}
              placeholder="Quantity"
              min="1"
              className="border rounded w-1/4 py-2 px-3 mr-2 text-gray-700 shadow"
              required
            />
            <input
              type="number"
              name="price"
              value={item.price}
              onChange={(e) => handleItemChange(index, e)}
              placeholder="Price (incl. GST)"
              min="0"
              step="0.01"
              className="border rounded w-1/4 py-2 px-3 text-gray-700 shadow"
              required
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="ml-2 bg-red-500 text-white px-4 rounded"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="bg-blue-500 text-white rounded px-4 py-2 mb-4"
        >
          Add Item
        </button>

        <div className="mb-4">
          <p className="text-md font-semibold">GST ({gstRate}%): ₹{gstAmount.toFixed(2)}</p>
          <h3 className="text-lg font-bold">Grand Total: ₹{totalAmount.toFixed(2)}</h3>
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white rounded px-6 py-2 hover:bg-green-600"
        >
          Generate Bill
        </button>

        {successMessage && (
          <div className="text-green-600 font-semibold mt-4">
            {successMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default GenerateBills;
// import React, { useEffect, useState } from 'react';

// const GenerateBills = () => {
//   const [businessDetails, setBusinessDetails] = useState({});
//   const [customerName, setCustomerName] = useState('');
//   const [customerMobile, setCustomerMobile] = useState('');
//   const [items, setItems] = useState([{ description: '', quantity: 1, price: 0 }]);
//   const [gstRate] = useState(18);
//   const [gstAmount, setGstAmount] = useState(0);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [successMessage, setSuccessMessage] = useState('');

//   useEffect(() => {
//     const fetchBusinessDetails = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       try {
//         const response = await fetch('http://localhost:5000/api/auth/profile', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await response.json();
//         if (response.ok) setBusinessDetails(data);
//         else console.error('Failed to fetch business details');
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchBusinessDetails();
//   }, []);

//   const handleItemChange = (index, event) => {
//     const { name, value } = event.target;
//     const newItems = [...items];
//     newItems[index][name] = name === 'quantity' || name === 'price' ? Number(value) : value;
//     setItems(newItems);
//     calculateTotal(newItems);
//   };

//   const addItem = () => {
//     setItems([...items, { description: '', quantity: 1, price: 0 }]);
//   };

//   const removeItem = (index) => {
//     const newItems = items.filter((_, i) => i !== index);
//     setItems(newItems);
//     calculateTotal(newItems);
//   };

//   const calculateTotal = (items) => {
//     const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
//     const gst = (subtotal * gstRate) / 100;
//     setGstAmount(gst);
//     setTotalAmount(subtotal + gst);
//   };

//   const generateInvoiceNumber = () => {
//     const now = new Date();
//     return `INV-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now
//       .getDate()
//       .toString()
//       .padStart(2, '0')}-${now.getTime().toString().slice(-5)}`;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const billData = {
//       businessDetails,
//       customerName,
//       customerMobile,
//       items,
//       totalAmount,
//       gstAmount,
//       gstRate,
//       date: new Date().toLocaleString(),
//       invoiceNumber: generateInvoiceNumber(),
//     };

//     const invoiceWindow = window.open('', 'PRINT', 'height=800,width=600');
//     invoiceWindow.document.write(`
//       <html>
//         <head>
//           <title>Invoice</title>
//           <style>
//             body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; color: #333; }
//             .header { text-align: center; margin-bottom: 20px; }
//             .header img { max-width: 120px; margin-bottom: 10px; }
//             h1 { font-size: 2em; margin-bottom: 5px; }
//             .details, .customer { margin-bottom: 20px; }
//             .details p, .customer p { margin: 2px 0; }
//             table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//             table, th, td { border: 1px solid #ccc; }
//             th, td { padding: 12px; text-align: center; }
//             th { background-color: #f0f0f0; }
//             .total { text-align: right; font-size: 1.2em; margin-top: 20px; font-weight: bold; }
//             hr { margin: 20px 0; }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             ${billData.businessDetails.logo ? `<img src="http://localhost:5000${billData.businessDetails.logo}" alt="Business Logo"/>` : ''}
//             <h1>${billData.businessDetails.businessName || ''}</h1>
//             <div class="details">
//               <p>${billData.businessDetails.address || ''}</p>
//               <p>Phone: ${billData.businessDetails.phone || ''}</p>
//               <p>Email: ${billData.businessDetails.email || ''}</p>
//               <p>GST No: ${billData.businessDetails.gstNo || ''}</p>
//             </div>
//           </div>

//           <hr/>

//           <div class="customer">
//             <h2>Invoice</h2>
//             <p><strong>Invoice No:</strong> ${billData.invoiceNumber}</p>
//             <p><strong>Date:</strong> ${billData.date}</p>
//             <p><strong>Customer Name:</strong> ${billData.customerName}</p>
//             <p><strong>Customer Mobile:</strong> ${billData.customerMobile}</p>
//           </div>

//           <table>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Description</th>
//                 <th>Quantity</th>
//                 <th>Price (₹)</th>
//                 <th>Total (₹)</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${billData.items.map((item, index) => `
//                 <tr>
//                   <td>${index + 1}</td>
//                   <td>${item.description}</td>
//                   <td>${item.quantity}</td>
//                   <td>${item.price.toFixed(2)}</td>
//                   <td>${(item.price * item.quantity).toFixed(2)}</td>
//                 </tr>
//               `).join('')}
//             </tbody>
//           </table>

//           <div class="total">
//             Subtotal: ₹${(billData.totalAmount - billData.gstAmount).toFixed(2)}<br/>
//             GST (${billData.gstRate}%): ₹${billData.gstAmount.toFixed(2)}<br/>
//             Grand Total: ₹${billData.totalAmount.toFixed(2)}
//           </div>

//           <script>
//             window.onload = function() {
//               window.print();
//               window.onafterprint = function() {
//                 window.close();
//               }
//             }
//           </script>
//         </body>
//       </html>
//     `);
//     invoiceWindow.document.close();
//     invoiceWindow.focus();

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       const response = await fetch('http://localhost:5000/api/invoices', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           customerName: billData.customerName,
//           customerMobile: billData.customerMobile,
//           items: billData.items,
//           totalAmount: billData.totalAmount,
//           gstAmount: billData.gstAmount,
//           gstRate: billData.gstRate,
//           date: billData.date,
//           invoiceNumber: billData.invoiceNumber,
//         }),
//       });

//       const result = await response.json();
//       if (response.ok) {
//         console.log('Invoice saved:', result.message);
//         setSuccessMessage('Successfully saved to database');
//         setTimeout(() => setSuccessMessage(''), 3000);
//       } else {
//         console.error('Failed to save invoice:', result.error);
//         setSuccessMessage('');
//       }
//     } catch (err) {
//       console.error('Error saving invoice:', err);
//       setSuccessMessage('');
//     }

//     setCustomerName('');
//     setCustomerMobile('');
//     setItems([{ description: '', quantity: 1, price: 0 }]);
//     setGstAmount(0);
//     setTotalAmount(0);
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <div className="flex items-center mb-8 space-x-6 bg-white p-6 rounded-lg shadow-md">
//         {businessDetails.logo && (
//           <img
//             src={`http://localhost:5000${businessDetails.logo}`}
//             alt="Business Logo"
//             className="w-24 h-24 object-contain rounded"
//           />
//         )}
//         <div>
//           <h1 className="text-3xl font-bold text-[#00668c]">{businessDetails.businessName}</h1>
//           <p className="text-gray-700">{businessDetails.address}</p>
//           <p className="text-gray-700">Phone: {businessDetails.phone}</p>
//           <p className="text-gray-700">Email: {businessDetails.email}</p>
//           <p className="text-gray-700">GST No: {businessDetails.gstNo}</p>
//         </div>
//       </div>

//       <h2 className="text-3xl font-bold text-center text-[#00668c] mb-8">Generate Bill</h2>

//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
//         <div className="mb-4">
//           <label htmlFor="customerName" className="block text-sm font-bold text-gray-700 mb-2">Customer Name</label>
//           <input
//             type="text"
//             id="customerName"
//             value={customerName}
//             onChange={(e) => setCustomerName(e.target.value)}
//             placeholder="Enter customer name"
//             className="border rounded w-full py-2 px-3 shadow text-gray-700"
//             required
//           />
//         </div>

//         <div className="mb-6">
//           <label htmlFor="customerMobile" className="block text-sm font-bold text-gray-700 mb-2">Customer Mobile Number</label>
//           <input
//             type="tel"
//             id="customerMobile"
//             value={customerMobile}
//             onChange={(e) => setCustomerMobile(e.target.value)}
//             placeholder="Enter customer mobile number"
//             pattern="^\+?[0-9\s\-]{7,15}$"
//             title="Enter a valid phone number"
//             className="border rounded w-full py-2 px-3 shadow text-gray-700"
//             required
//           />
//         </div>

//         <h3 className="text-xl font-bold mb-4">Items</h3>
//         {items.map((item, index) => (
//           <div key={index} className="flex mb-4">
//             <input
//               type="text"
//               name="description"
//               value={item.description}
//               onChange={(e) => handleItemChange(index, e)}
//               placeholder="Item Description"
//               className="border rounded w-1/2 py-2 px-3 mr-2 text-gray-700 shadow"
//               required
//             />
//             <input
//               type="number"
//               name="quantity"
//               value={item.quantity}
//               onChange={(e) => handleItemChange(index, e)}
//               placeholder="Quantity"
//               min="1"
//               className="border rounded w-1/4 py-2 px-3 mr-2 text-gray-700 shadow"
//               required
//             />
//             <input
//               type="number"
//               name="price"
//               value={item.price}
//               onChange={(e) => handleItemChange(index, e)}
//               placeholder="Price"
//               min="0"
//               step="0.01"
//               className="border rounded w-1/4 py-2 px-3 text-gray-700 shadow"
//               required
//             />
//             <button
//               type="button"
//               onClick={() => removeItem(index)}
//               className="ml-2 bg-red-500 text-white px-4 rounded"
//             >
//               Remove
//             </button>
//           </div>
//         ))}

//         <button
//           type="button"
//           onClick={addItem}
//           className="bg-blue-500 text-white rounded px-4 py-2 mb-4"
//         >
//           Add Item
//         </button>

//         <div className="mb-4">
//           <p className="text-md font-semibold">Subtotal: ₹{(totalAmount - gstAmount).toFixed(2)}</p>
//           <p className="text-md font-semibold">GST ({gstRate}%): ₹{gstAmount.toFixed(2)}</p>
//           <h3 className="text-lg font-bold">Grand Total: ₹{totalAmount.toFixed(2)}</h3>
//         </div>

//         <button
//           type="submit"
//           className="bg-green-500 text-white rounded px-6 py-2 hover:bg-green-600"
//         >
//           Generate Bill
//         </button>

//         {successMessage && (
//           <div className="text-green-600 font-semibold mt-4">
//             {successMessage}
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default GenerateBills;


// import React, { useEffect, useState } from 'react';

// const GenerateBills = () => {
//   const [businessDetails, setBusinessDetails] = useState({});
//   const [customerName, setCustomerName] = useState('');
//   const [customerMobile, setCustomerMobile] = useState('');
//   const [items, setItems] = useState([{ description: '', quantity: 1, price: 0 }]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [successMessage, setSuccessMessage] = useState('');

//   useEffect(() => {
//     const fetchBusinessDetails = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       try {
//         const response = await fetch('http://localhost:5000/api/auth/profile', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await response.json();
//         if (response.ok) setBusinessDetails(data);
//         else console.error('Failed to fetch business details');
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchBusinessDetails();
//   }, []);

//   const handleItemChange = (index, event) => {
//     const { name, value } = event.target;
//     const newItems = [...items];
//     newItems[index][name] = name === 'quantity' || name === 'price' ? Number(value) : value;
//     setItems(newItems);
//     calculateTotal(newItems);
//   };

//   const addItem = () => {
//     setItems([...items, { description: '', quantity: 1, price: 0 }]);
//   };

//   const removeItem = (index) => {
//     const newItems = items.filter((_, i) => i !== index);
//     setItems(newItems);
//     calculateTotal(newItems);
//   };

//   const calculateTotal = (items) => {
//     const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
//     setTotalAmount(total);
//   };

//   const generateInvoiceNumber = () => {
//     const now = new Date();
//     return `INV-${now.getFullYear()}${(now.getMonth() + 1)
//       .toString()
//       .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${now.getTime().toString().slice(-5)}`;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const billData = {
//       businessDetails,
//       customerName,
//       customerMobile,
//       items,
//       totalAmount,
//       date: new Date().toLocaleString(),
//       invoiceNumber: generateInvoiceNumber(),
//     };

//     console.log('Bill generated:', billData);

//     const invoiceWindow = window.open('', 'PRINT', 'height=800,width=600');
//     invoiceWindow.document.write(`
//       <html>
//         <head>
//           <title>Invoice</title>
//           <style>
//             body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; color: #333; }
//             .header { text-align: center; margin-bottom: 20px; }
//             .header img { max-width: 120px; margin-bottom: 10px; }
//             h1 { font-size: 2em; margin-bottom: 5px; }
//             .details, .customer { margin-bottom: 20px; }
//             .details p, .customer p { margin: 2px 0; }
//             table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//             table, th, td { border: 1px solid #ccc; }
//             th, td { padding: 12px; text-align: center; }
//             th { background-color: #f0f0f0; }
//             .total { text-align: right; font-size: 1.2em; margin-top: 20px; font-weight: bold; }
//             hr { margin: 20px 0; }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             ${billData.businessDetails.logo ? `<img src="http://localhost:5000${billData.businessDetails.logo}" alt="Business Logo"/>` : ''}
//             <h1>${billData.businessDetails.businessName || ''}</h1>
//             <div class="details">
//               <p>${billData.businessDetails.address || ''}</p>
//               <p>Phone: ${billData.businessDetails.phone || ''}</p>
//               <p>Email: ${billData.businessDetails.email || ''}</p>
//               <p>GST No: ${billData.businessDetails.gstNo || ''}</p>
//             </div>
//           </div>

//           <hr/>

//           <div class="customer">
//             <h2>Invoice</h2>
//             <p><strong>Invoice No:</strong> ${billData.invoiceNumber}</p>
//             <p><strong>Date:</strong> ${billData.date}</p>
//             <p><strong>Customer Name:</strong> ${billData.customerName}</p>
//             <p><strong>Customer Mobile:</strong> ${billData.customerMobile}</p>
//           </div>

//           <table>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Description</th>
//                 <th>Quantity</th>
//                 <th>Price (₹)</th>
//                 <th>Total (₹)</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${billData.items.map((item, index) => `
//                 <tr>
//                   <td>${index + 1}</td>
//                   <td>${item.description}</td>
//                   <td>${item.quantity}</td>
//                   <td>${item.price.toFixed(2)}</td>
//                   <td>${(item.price * item.quantity).toFixed(2)}</td>
//                 </tr>
//               `).join('')}
//             </tbody>
//           </table>

//           <div class="total">
//             Grand Total: ₹${billData.totalAmount.toFixed(2)}
//           </div>

//           <script>
//             window.onload = function() {
//               window.print();
//               window.onafterprint = function() {
//                 window.close();
//               }
//             }
//           </script>
//         </body>
//       </html>
//     `);
//     invoiceWindow.document.close();
//     invoiceWindow.focus();

//     // Save to database
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       const response = await fetch('http://localhost:5000/api/invoices', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           customerName: billData.customerName,
//           customerMobile: billData.customerMobile,
//           items: billData.items,
//           totalAmount: billData.totalAmount,
//           date: billData.date,
//           invoiceNumber: billData.invoiceNumber,
//         }),
//       });

//       const result = await response.json();
//       if (response.ok) {
//         console.log('Invoice saved to database:', result.message);
//         setSuccessMessage('Successfully saved to database');
//         setTimeout(() => setSuccessMessage(''), 3000);
//       } else {
//         console.error('Failed to save invoice:', result.error);
//         setSuccessMessage('');
//       }
//     } catch (err) {
//       console.error('Error saving invoice:', err);
//       setSuccessMessage('');
//     }

//     // Reset form
//     setCustomerName('');
//     setCustomerMobile('');
//     setItems([{ description: '', quantity: 1, price: 0 }]);
//     setTotalAmount(0);
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       {/* Business Details */}
//       <div className="flex items-center mb-8 space-x-6 bg-white p-6 rounded-lg shadow-md">
//         {businessDetails.logo && (
//           <img
//             src={`http://localhost:5000${businessDetails.logo}`}
//             alt="Business Logo"
//             className="w-24 h-24 object-contain rounded"
//           />
//         )}
//         <div>
//           <h1 className="text-3xl font-bold text-[#00668c]">{businessDetails.businessName}</h1>
//           <p className="text-gray-700">{businessDetails.address}</p>
//           <p className="text-gray-700">Phone: {businessDetails.phone}</p>
//           <p className="text-gray-700">Email: {businessDetails.email}</p>
//           <p className="text-gray-700">GST No: {businessDetails.gstNo}</p>
//         </div>
//       </div>

//       {/* Form */}
//       <h2 className="text-3xl font-bold text-center text-[#00668c] mb-8">Generate Bill</h2>

//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
//         {/* Customer Info */}
//         <div className="mb-4">
//           <label htmlFor="customerName" className="block text-sm font-bold text-gray-700 mb-2">Customer Name</label>
//           <input
//             type="text"
//             id="customerName"
//             value={customerName}
//             onChange={(e) => setCustomerName(e.target.value)}
//             placeholder="Enter customer name"
//             className="border rounded w-full py-2 px-3 shadow text-gray-700"
//             required
//           />
//         </div>

//         <div className="mb-6">
//           <label htmlFor="customerMobile" className="block text-sm font-bold text-gray-700 mb-2">Customer Mobile Number</label>
//           <input
//             type="tel"
//             id="customerMobile"
//             value={customerMobile}
//             onChange={(e) => setCustomerMobile(e.target.value)}
//             placeholder="Enter customer mobile number"
//             pattern="^\+?[0-9\s\-]{7,15}$"
//             title="Enter a valid phone number"
//             className="border rounded w-full py-2 px-3 shadow text-gray-700"
//             required
//           />
//         </div>

//         {/* Items */}
//         <h3 className="text-xl font-bold mb-4">Items</h3>
//         {items.map((item, index) => (
//           <div key={index} className="flex mb-4">
//             <input
//               type="text"
//               name="description"
//               value={item.description}
//               onChange={(e) => handleItemChange(index, e)}
//               placeholder="Item Description"
//               className="border rounded w-1/2 py-2 px-3 mr-2 text-gray-700 shadow"
//               required
//             />
//             <input
//               type="number"
//               name="quantity"
//               value={item.quantity}
//               onChange={(e) => handleItemChange(index, e)}
//               placeholder="Quantity"
//               min="1"
//               className="border rounded w-1/4 py-2 px-3 mr-2 text-gray-700 shadow"
//               required
//             />
//             <input
//               type="number"
//               name="price"
//               value={item.price}
//               onChange={(e) => handleItemChange(index, e)}
//               placeholder="Price"
//               min="0"
//               step="0.01"
//               className="border rounded w-1/4 py-2 px-3 text-gray-700 shadow"
//               required
//             />
//             <button
//               type="button"
//               onClick={() => removeItem(index)}
//               className="ml-2 bg-red-500 text-white px-4 rounded"
//             >
//               Remove
//             </button>
//           </div>
//         ))}

//         {/* Add Item */}
//         <button
//           type="button"
//           onClick={addItem}
//           className="bg-blue-500 text-white rounded px-4 py-2 mb-4"
//         >
//           Add Item
//         </button>

//         {/* Total */}
//         <div className="mb-4">
//           <h3 className="text-lg font-bold">Total Amount: ₹{totalAmount.toFixed(2)}</h3>
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           className="bg-green-500 text-white rounded px-6 py-2 hover:bg-green-600"
//         >
//           Generate Bill
//         </button>

//         {/* Success Message */}
//         {successMessage && (
//           <div className="text-green-600 font-semibold mt-4">
//             {successMessage}
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default GenerateBills;
// import React, { useEffect, useState } from 'react';

// const GenerateBills = () => {
//   const [businessDetails, setBusinessDetails] = useState({});
//   const [customerName, setCustomerName] = useState('');
//   const [customerMobile, setCustomerMobile] = useState('');
//   const [items, setItems] = useState([{ description: '', quantity: 1, price: 0 }]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [successMessage, setSuccessMessage] = useState('');

//   useEffect(() => {
//     const fetchBusinessDetails = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       try {
//         const response = await fetch('http://localhost:5000/api/auth/profile', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await response.json();
//         if (response.ok) setBusinessDetails(data);
//         else console.error('Failed to fetch business details');
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchBusinessDetails();
//   }, []);

//   const handleItemChange = (index, event) => {
//     const { name, value } = event.target;
//     const newItems = [...items];
//     newItems[index][name] = name === 'quantity' || name === 'price' ? Number(value) : value;
//     setItems(newItems);
//     calculateTotal(newItems);
//   };

//   const addItem = () => {
//     setItems([...items, { description: '', quantity: 1, price: 0 }]);
//   };

//   const removeItem = (index) => {
//     const newItems = items.filter((_, i) => i !== index);
//     setItems(newItems);
//     calculateTotal(newItems);
//   };

//   const calculateTotal = (items) => {
//     const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
//     setTotalAmount(total);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Generate and Save Invoice Logic
//     // (same as your previous logic, skipped here for brevity)
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       {/* Business Details */}
//       <div className="flex flex-col md:flex-row items-center md:items-start mb-10 bg-white p-6 rounded-2xl shadow-lg space-y-4 md:space-y-0 md:space-x-6">
//         {businessDetails.logo && (
//           <img
//             src={`http://localhost:5000${businessDetails.logo}`}
//             alt="Business Logo"
//             className="w-28 h-28 object-contain rounded-xl shadow"
//           />
//         )}
//         <div>
//           <h1 className="text-3xl font-bold text-[#00668c]">{businessDetails.businessName}</h1>
//           <p className="text-gray-600">{businessDetails.address}</p>
//           <p className="text-gray-600">Phone: {businessDetails.phone}</p>
//           <p className="text-gray-600">Email: {businessDetails.email}</p>
//           <p className="text-gray-600">GST No: {businessDetails.gstNo}</p>
//         </div>
//       </div>

//       {/* Form */}
//       <h2 className="text-3xl font-bold text-center text-[#00668c] mb-8">Generate Invoice</h2>

//       <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
//         {/* Customer Info */}
//         <div className="space-y-4">
//           <div>
//             <label htmlFor="customerName" className="block text-sm font-semibold text-gray-700 mb-1">Customer Name</label>
//             <input
//               type="text"
//               id="customerName"
//               value={customerName}
//               onChange={(e) => setCustomerName(e.target.value)}
//               placeholder="Enter customer name"
//               className="border border-gray-300 rounded-xl w-full py-2 px-4 text-gray-700 focus:ring-2 focus:ring-[#00668c] shadow-sm"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="customerMobile" className="block text-sm font-semibold text-gray-700 mb-1">Customer Mobile</label>
//             <input
//               type="tel"
//               id="customerMobile"
//               value={customerMobile}
//               onChange={(e) => setCustomerMobile(e.target.value)}
//               placeholder="Enter mobile number"
//               pattern="^\+?[0-9\s\-]{7,15}$"
//               title="Enter a valid phone number"
//               className="border border-gray-300 rounded-xl w-full py-2 px-4 text-gray-700 focus:ring-2 focus:ring-[#00668c] shadow-sm"
//               required
//             />
//           </div>
//         </div>

//         {/* Items Section */}
//         <h3 className="text-xl font-bold text-[#333]">Items</h3>

//         <div className="space-y-4">
//           {items.map((item, index) => (
//             <div key={index} className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-3 bg-gray-50 p-4 rounded-xl shadow-sm">
//               <input
//                 type="text"
//                 name="description"
//                 value={item.description}
//                 onChange={(e) => handleItemChange(index, e)}
//                 placeholder="Description"
//                 className="border border-gray-300 rounded-xl w-full py-2 px-3 text-gray-700 focus:ring-2 focus:ring-[#00668c]"
//                 required
//               />
//               <input
//                 type="number"
//                 name="quantity"
//                 value={item.quantity}
//                 onChange={(e) => handleItemChange(index, e)}
//                 placeholder="Qty"
//                 min="1"
//                 className="border border-gray-300 rounded-xl w-24 py-2 px-3 text-gray-700 focus:ring-2 focus:ring-[#00668c]"
//                 required
//               />
//               <input
//                 type="number"
//                 name="price"
//                 value={item.price}
//                 onChange={(e) => handleItemChange(index, e)}
//                 placeholder="Price"
//                 min="0"
//                 step="0.01"
//                 className="border border-gray-300 rounded-xl w-32 py-2 px-3 text-gray-700 focus:ring-2 focus:ring-[#00668c]"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => removeItem(index)}
//                 className="text-red-500 font-bold hover:text-red-600"
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//         </div>

//         <button
//           type="button"
//           onClick={addItem}
//           className="bg-[#00668c] hover:bg-[#005377] text-white py-2 px-6 rounded-xl shadow-md transition duration-300"
//         >
//           + Add Item
//         </button>

//         {/* Total */}
//         <div className="text-right text-lg font-semibold text-gray-700">
//           Total: ₹{totalAmount.toFixed(2)}
//         </div>

//         {/* Submit */}
//         <div className="text-center">
//           <button
//             type="submit"
//             className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition duration-300"
//           >
//             Generate Bill
//           </button>
//         </div>

//         {/* Success Message */}
//         {successMessage && (
//           <div className="text-green-600 font-semibold text-center mt-4">
//             {successMessage}
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default GenerateBills;

// ////fine working
// import React, { useEffect, useState } from 'react';

// const GenerateBills = () => {
//   const [businessDetails, setBusinessDetails] = useState({});
//   const [customerName, setCustomerName] = useState('');
//   const [customerMobile, setCustomerMobile] = useState('');
//   const [items, setItems] = useState([{ description: '', quantity: 1, price: 0 }]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [successMessage, setSuccessMessage] = useState('');

//   useEffect(() => {
//     const fetchBusinessDetails = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       try {
//         const response = await fetch('http://localhost:5000/api/auth/profile', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await response.json();
//         if (response.ok) setBusinessDetails(data);
//         else console.error('Failed to fetch business details');
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchBusinessDetails();
//   }, []);

//   const handleItemChange = (index, event) => {
//     const { name, value } = event.target;
//     const newItems = [...items];
//     newItems[index][name] = name === 'quantity' || name === 'price' ? Number(value) : value;
//     setItems(newItems);
//     calculateTotal(newItems);
//   };

//   const addItem = () => {
//     setItems([...items, { description: '', quantity: 1, price: 0 }]);
//   };

//   const removeItem = (index) => {
//     const newItems = items.filter((_, i) => i !== index);
//     setItems(newItems);
//     calculateTotal(newItems);
//   };

//   const calculateTotal = (items) => {
//     const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
//     setTotalAmount(total);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const billData = {
//       businessDetails,
//       customerName,
//       customerMobile,
//       items,
//       totalAmount,
//       date: new Date().toLocaleString(),
//     };

//     console.log('Bill generated:', billData);

//     // Open printable invoice
//     const invoiceWindow = window.open('', 'PRINT', 'height=800,width=600');
//     invoiceWindow.document.write(`
//       <html>
//         <head>
//           <title>Invoice</title>
//           <style>
//             body { font-family: Arial, sans-serif; padding: 20px; }
//             h1, h2, h3 { color: #00668c; }
//             table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//             table, th, td { border: 1px solid black; }
//             th, td { padding: 10px; text-align: left; }
//             .total { text-align: right; font-weight: bold; }
//             .logo { max-width: 150px; max-height: 150px; margin-bottom: 20px; }
//           </style>
//         </head>
//         <body>
//           ${billData.businessDetails.logo ? `
//             <img src="http://localhost:5000${billData.businessDetails.logo}" alt="Business Logo" class="logo"/>
//           ` : ''}
//           <h1>${billData.businessDetails.businessName || ''}</h1>
//           <p>${billData.businessDetails.address || ''}</p>
//           <p>Phone: ${billData.businessDetails.phone || ''}</p>
//           <p>Email: ${billData.businessDetails.email || ''}</p>
//           <p>GST No: ${billData.businessDetails.gstNo || ''}</p>
//           <hr/>
//           <h2>Invoice</h2>
//           <p><strong>Date:</strong> ${billData.date}</p>
//           <p><strong>Customer Name:</strong> ${billData.customerName}</p>
//           <p><strong>Customer Mobile:</strong> ${billData.customerMobile}</p>

//           <table>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Description</th>
//                 <th>Quantity</th>
//                 <th>Price (₹)</th>
//                 <th>Total (₹)</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${billData.items.map((item, index) => `
//                 <tr>
//                   <td>${index + 1}</td>
//                   <td>${item.description}</td>
//                   <td>${item.quantity}</td>
//                   <td>${item.price.toFixed(2)}</td>
//                   <td>${(item.price * item.quantity).toFixed(2)}</td>
//                 </tr>
//               `).join('')}
//             </tbody>
//           </table>

//           <h3 class="total">Grand Total: ₹${billData.totalAmount.toFixed(2)}</h3>

//           <script>
//             window.onload = function() {
//               window.print();
//               window.onafterprint = function() {
//                 window.close();
//               }
//             }
//           </script>
//         </body>
//       </html>
//     `);
//     invoiceWindow.document.close();
//     invoiceWindow.focus();

//     // Save to database
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       const response = await fetch('http://localhost:5000/api/invoices', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           customerName: billData.customerName,
//           customerMobile: billData.customerMobile,
//           items: billData.items,
//           totalAmount: billData.totalAmount,
//           date: billData.date,
//         }),
//       });

//       const result = await response.json();
//       if (response.ok) {
//         console.log('Invoice saved to database:', result.message);
//         setSuccessMessage('Successfully saved to database');
//         setTimeout(() => setSuccessMessage(''), 3000);
//       } else {
//         console.error('Failed to save invoice:', result.error);
//         setSuccessMessage('');
//       }
//     } catch (err) {
//       console.error('Error saving invoice:', err);
//       setSuccessMessage('');
//     }

//     // Reset form
//     setCustomerName('');
//     setCustomerMobile('');
//     setItems([{ description: '', quantity: 1, price: 0 }]);
//     setTotalAmount(0);
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       {/* Business Details */}
//       <div className="flex items-center mb-8 space-x-6 bg-white p-6 rounded-lg shadow-md">
//         {businessDetails.logo && (
//           <img
//             src={`http://localhost:5000${businessDetails.logo}`}
//             alt="Business Logo"
//             className="w-24 h-24 object-contain rounded"
//           />
//         )}
//         <div>
//           <h1 className="text-3xl font-bold text-[#00668c]">{businessDetails.businessName}</h1>
//           <p className="text-gray-700">{businessDetails.address}</p>
//           <p className="text-gray-700">Phone: {businessDetails.phone}</p>
//           <p className="text-gray-700">Email: {businessDetails.email}</p>
//           <p className="text-gray-700">GST No: {businessDetails.gstNo}</p>
//         </div>
//       </div>

//       {/* Form */}
//       <h2 className="text-3xl font-bold text-center text-[#00668c] mb-8">Generate Bill</h2>

//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
//         {/* Customer Info */}
//         <div className="mb-4">
//           <label htmlFor="customerName" className="block text-sm font-bold text-gray-700 mb-2">Customer Name</label>
//           <input
//             type="text"
//             id="customerName"
//             value={customerName}
//             onChange={(e) => setCustomerName(e.target.value)}
//             placeholder="Enter customer name"
//             className="border rounded w-full py-2 px-3 shadow text-gray-700"
//             required
//           />
//         </div>

//         <div className="mb-6">
//           <label htmlFor="customerMobile" className="block text-sm font-bold text-gray-700 mb-2">Customer Mobile Number</label>
//           <input
//             type="tel"
//             id="customerMobile"
//             value={customerMobile}
//             onChange={(e) => setCustomerMobile(e.target.value)}
//             placeholder="Enter customer mobile number"
//             pattern="^\+?[0-9\s\-]{7,15}$"
//             title="Enter a valid phone number"
//             className="border rounded w-full py-2 px-3 shadow text-gray-700"
//             required
//           />
//         </div>

//         {/* Items */}
//         <h3 className="text-xl font-bold mb-4">Items</h3>
//         {items.map((item, index) => (
//           <div key={index} className="flex mb-4">
//             <input
//               type="text"
//               name="description"
//               value={item.description}
//               onChange={(e) => handleItemChange(index, e)}
//               placeholder="Item Description"
//               className="border rounded w-1/2 py-2 px-3 mr-2 text-gray-700 shadow"
//               required
//             />
//             <input
//               type="number"
//               name="quantity"
//               value={item.quantity}
//               onChange={(e) => handleItemChange(index, e)}
//               placeholder="Quantity"
//               min="1"
//               className="border rounded w-1/4 py-2 px-3 mr-2 text-gray-700 shadow"
//               required
//             />
//             <input
//               type="number"
//               name="price"
//               value={item.price}
//               onChange={(e) => handleItemChange(index, e)}
//               placeholder="Price"
//               min="0"
//               step="0.01"
//               className="border rounded w-1/4 py-2 px-3 text-gray-700 shadow"
//               required
//             />
//             <button
//               type="button"
//               onClick={() => removeItem(index)}
//               className="ml-2 bg-red-500 text-white px-4 rounded"
//             >
//               Remove
//             </button>
//           </div>
//         ))}

//         {/* Add Item */}
//         <button
//           type="button"
//           onClick={addItem}
//           className="bg-blue-500 text-white rounded px-4 py-2 mb-4"
//         >
//           Add Item
//         </button>

//         {/* Total */}
//         <div className="mb-4">
//           <h3 className="text-lg font-bold">Total Amount: ₹{totalAmount.toFixed(2)}</h3>
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           className="bg-green-500 text-white rounded px-6 py-2 hover:bg-green-600"
//         >
//           Generate Bill
//         </button>

//         {/* Success Message */}
//         {successMessage && (
//           <div className="text-green-600 font-semibold mt-4">
//             {successMessage}
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default GenerateBills;
// import React, { useEffect, useState } from 'react';

// const GenerateBills = () => {
//   const [businessDetails, setBusinessDetails] = useState({});
//   const [customerName, setCustomerName] = useState('');
//   const [customerMobile, setCustomerMobile] = useState('');
//   const [items, setItems] = useState([{ description: '', quantity: 1, price: 0 }]);
//   const [totalAmount, setTotalAmount] = useState(0);

//   useEffect(() => {
//     const fetchBusinessDetails = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       try {
//         const response = await fetch('http://localhost:5000/api/auth/profile', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await response.json();
//         if (response.ok) setBusinessDetails(data);
//         else console.error('Failed to fetch business details');
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchBusinessDetails();
//   }, []);

//   const handleItemChange = (index, event) => {
//     const { name, value } = event.target;
//     const newItems = [...items];
//     newItems[index][name] = name === 'quantity' || name === 'price' ? Number(value) : value;
//     setItems(newItems);
//     calculateTotal(newItems);
//   };

//   const addItem = () => {
//     setItems([...items, { description: '', quantity: 1, price: 0 }]);
//   };

//   const removeItem = (index) => {
//     const newItems = items.filter((_, i) => i !== index);
//     setItems(newItems);
//     calculateTotal(newItems);
//   };

//   const calculateTotal = (items) => {
//     const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
//     setTotalAmount(total);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const billData = {
//       businessDetails,
//       customerName,
//       customerMobile,
//       items,
//       totalAmount,
//       date: new Date().toLocaleString(),
//     };

//     console.log('Bill generated:', billData);

//     // Open printable invoice
//     const invoiceWindow = window.open('', 'PRINT', 'height=800,width=600');
//     invoiceWindow.document.write(`
//       <html>
//         <head>
//           <title>Invoice</title>
//           <style>
//             body { font-family: Arial, sans-serif; padding: 20px; }
//             h1, h2, h3 { color: #00668c; }
//             table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//             table, th, td { border: 1px solid black; }
//             th, td { padding: 10px; text-align: left; }
//             .total { text-align: right; font-weight: bold; }
//             .logo { max-width: 150px; max-height: 150px; margin-bottom: 20px; }
//           </style>
//         </head>
//         <body>
//           ${billData.businessDetails.logo ? `
//             <img src="http://localhost:5000${billData.businessDetails.logo}" alt="Business Logo" class="logo"/>
//           ` : ''}
//           <h1>${billData.businessDetails.businessName || ''}</h1>
//           <p>${billData.businessDetails.address || ''}</p>
//           <p>Phone: ${billData.businessDetails.phone || ''}</p>
//           <p>Email: ${billData.businessDetails.email || ''}</p>
//           <p>GST No: ${billData.businessDetails.gstNo || ''}</p>
//           <hr/>
//           <h2>Invoice</h2>
//           <p><strong>Date:</strong> ${billData.date}</p>
//           <p><strong>Customer Name:</strong> ${billData.customerName}</p>
//           <p><strong>Customer Mobile:</strong> ${billData.customerMobile}</p>

//           <table>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Description</th>
//                 <th>Quantity</th>
//                 <th>Price (₹)</th>
//                 <th>Total (₹)</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${billData.items.map((item, index) => `
//                 <tr>
//                   <td>${index + 1}</td>
//                   <td>${item.description}</td>
//                   <td>${item.quantity}</td>
//                   <td>${item.price.toFixed(2)}</td>
//                   <td>${(item.price * item.quantity).toFixed(2)}</td>
//                 </tr>
//               `).join('')}
//             </tbody>
//           </table>

//           <h3 class="total">Grand Total: ₹${billData.totalAmount.toFixed(2)}</h3>

//           <script>
//             window.onload = function() {
//               window.print();
//               window.onafterprint = function() {
//                 window.close();
//               }
//             }
//           </script>
//         </body>
//       </html>
//     `);
//     invoiceWindow.document.close();
//     invoiceWindow.focus();

//     // Save bill to database
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       const response = await fetch('http://localhost:5000/api/invoices', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           customerName: billData.customerName,
//           customerMobile: billData.customerMobile,
//           items: billData.items,
//           totalAmount: billData.totalAmount,
//           date: billData.date,
//         }),
//       });

//       const result = await response.json();
//       if (response.ok) {
//         console.log('Invoice saved to database:', result.message);
//       } else {
//         console.error('Failed to save invoice:', result.error);
//       }
//     } catch (err) {
//       console.error('Error saving invoice:', err);
//     }

//     // Reset form
//     setCustomerName('');
//     setCustomerMobile('');
//     setItems([{ description: '', quantity: 1, price: 0 }]);
//     setTotalAmount(0);
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       {/* Business Details */}
//       <div className="flex items-center mb-8 space-x-6 bg-white p-6 rounded-lg shadow-md">
//         {businessDetails.logo && (
//           <img
//             src={`http://localhost:5000${businessDetails.logo}`}
//             alt="Business Logo"
//             className="w-24 h-24 object-contain rounded"
//           />
//         )}
//         <div>
//           <h1 className="text-3xl font-bold text-[#00668c]">{businessDetails.businessName}</h1>
//           <p className="text-gray-700">{businessDetails.address}</p>
//           <p className="text-gray-700">Phone: {businessDetails.phone}</p>
//           <p className="text-gray-700">Email: {businessDetails.email}</p>
//           <p className="text-gray-700">GST No: {businessDetails.gstNo}</p>
//         </div>
//       </div>

//       {/* Form */}
//       <h2 className="text-3xl font-bold text-center text-[#00668c] mb-8">Generate Bill</h2>

//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
//         {/* Customer Info */}
//         <div className="mb-4">
//           <label htmlFor="customerName" className="block text-sm font-bold text-gray-700 mb-2">Customer Name</label>
//           <input
//             type="text"
//             id="customerName"
//             value={customerName}
//             onChange={(e) => setCustomerName(e.target.value)}
//             placeholder="Enter customer name"
//             className="border rounded w-full py-2 px-3 shadow text-gray-700"
//             required
//           />
//         </div>

//         <div className="mb-6">
//           <label htmlFor="customerMobile" className="block text-sm font-bold text-gray-700 mb-2">Customer Mobile Number</label>
//           <input
//             type="tel"
//             id="customerMobile"
//             value={customerMobile}
//             onChange={(e) => setCustomerMobile(e.target.value)}
//             placeholder="Enter customer mobile number"
//             pattern="^\+?[0-9\s\-]{7,15}$"
//             title="Enter a valid phone number"
//             className="border rounded w-full py-2 px-3 shadow text-gray-700"
//             required
//           />
//         </div>

//         {/* Items */}
//         <h3 className="text-xl font-bold mb-4">Items</h3>
//         {items.map((item, index) => (
//           <div key={index} className="flex mb-4">
//             <input
//               type="text"
//               name="description"
//               value={item.description}
//               onChange={(e) => handleItemChange(index, e)}
//               placeholder="Item Description"
//               className="border rounded w-1/2 py-2 px-3 mr-2 text-gray-700 shadow"
//               required
//             />
//             <input
//               type="number"
//               name="quantity"
//               value={item.quantity}
//               onChange={(e) => handleItemChange(index, e)}
//               placeholder="Quantity"
//               min="1"
//               className="border rounded w-1/4 py-2 px-3 mr-2 text-gray-700 shadow"
//               required
//             />
//             <input
//               type="number"
//               name="price"
//               value={item.price}
//               onChange={(e) => handleItemChange(index, e)}
//               placeholder="Price"
//               min="0"
//               step="0.01"
//               className="border rounded w-1/4 py-2 px-3 text-gray-700 shadow"
//               required
//             />
//             <button
//               type="button"
//               onClick={() => removeItem(index)}
//               className="ml-2 bg-red-500 text-white px-4 rounded"
//             >
//               Remove
//             </button>
//           </div>
//         ))}

//         {/* Add Item */}
//         <button
//           type="button"
//           onClick={addItem}
//           className="bg-blue-500 text-white rounded px-4 py-2 mb-4"
//         >
//           Add Item
//         </button>

//         {/* Total */}
//         <div className="mb-4">
//           <h3 className="text-lg font-bold">Total Amount: ₹{totalAmount.toFixed(2)}</h3>
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           className="bg-green-500 text-white rounded px-6 py-2 hover:bg-green-600"
//         >
//           Generate Bill
//         </button>
//       </form>
//     </div>
//   );
// };

// export default GenerateBills;

// import React, { useEffect, useState } from 'react';

// const GenerateBills = () => {
//   const [businessDetails, setBusinessDetails] = useState({});
//   const [customerName, setCustomerName] = useState('');
//   const [customerMobile, setCustomerMobile] = useState('');
//   const [items, setItems] = useState([{ description: '', quantity: 1, price: 0 }]);
//   const [totalAmount, setTotalAmount] = useState(0);

//   useEffect(() => {
//     const fetchBusinessDetails = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       try {
//         const response = await fetch('http://localhost:5000/api/auth/profile', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await response.json();
//         if (response.ok) setBusinessDetails(data);
//         else console.error('Failed to fetch business details');
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchBusinessDetails();
//   }, []);

//   const handleItemChange = (index, event) => {
//     const { name, value } = event.target;
//     const newItems = [...items];
//     if (name === 'quantity' || name === 'price') {
//       newItems[index][name] = Number(value);
//     } else {
//       newItems[index][name] = value;
//     }
//     setItems(newItems);
//     calculateTotal(newItems);
//   };

//   const addItem = () => {
//     setItems([...items, { description: '', quantity: 1, price: 0 }]);
//   };

//   const removeItem = (index) => {
//     const newItems = items.filter((_, i) => i !== index);
//     setItems(newItems);
//     calculateTotal(newItems);
//   };

//   const calculateTotal = (items) => {
//     const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
//     setTotalAmount(total);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const billData = {
//       businessDetails,
//       customerName,
//       customerMobile,
//       items,
//       totalAmount,
//       date: new Date().toLocaleString(),
//     };
//     console.log('Bill generated:', billData);

//     // Open printable invoice
//     const invoiceWindow = window.open('', 'PRINT', 'height=800,width=600');

//     invoiceWindow.document.write(`
//       <html>
//         <head>
//           <title>Invoice</title>
//           <style>
//             body { font-family: Arial, sans-serif; padding: 20px; }
//             h1, h2, h3 { color: #00668c; }
//             table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//             table, th, td { border: 1px solid black; }
//             th, td { padding: 10px; text-align: left; }
//             .total { text-align: right; font-weight: bold; }
//             .logo { max-width: 150px; max-height: 150px; margin-bottom: 20px; }
//           </style>
//         </head>
//         <body>
//           ${billData.businessDetails.logo ? `
//             <img src="http://localhost:5000${billData.businessDetails.logo}" alt="Business Logo" class="logo"/>
//           ` : ''}
//           <h1>${billData.businessDetails.businessName || ''}</h1>
//           <p>${billData.businessDetails.address || ''}</p>
//           <p>Phone: ${billData.businessDetails.phone || ''}</p>
//           <p>Email: ${billData.businessDetails.email || ''}</p>
//           <p>GST No: ${billData.businessDetails.gstNo || ''}</p>
//           <hr/>
//           <h2>Invoice</h2>
//           <p><strong>Date:</strong> ${billData.date}</p>
//           <p><strong>Customer Name:</strong> ${billData.customerName}</p>
//           <p><strong>Customer Mobile:</strong> ${billData.customerMobile}</p>

//           <table>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Description</th>
//                 <th>Quantity</th>
//                 <th>Price (₹)</th>
//                 <th>Total (₹)</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${billData.items.map((item, index) => `
//                 <tr>
//                   <td>${index + 1}</td>
//                   <td>${item.description}</td>
//                   <td>${item.quantity}</td>
//                   <td>${item.price.toFixed(2)}</td>
//                   <td>${(item.price * item.quantity).toFixed(2)}</td>
//                 </tr>
//               `).join('')}
//             </tbody>
//           </table>

//           <h3 class="total">Grand Total: ₹${billData.totalAmount.toFixed(2)}</h3>

//           <script>
//             window.onload = function() {
//               window.print();
//               window.onafterprint = function() {
//                 window.close();
//               }
//             }
//           </script>
//         </body>
//       </html>
//     `);

//     invoiceWindow.document.close();
//     invoiceWindow.focus();

//     // Reset form
//     setCustomerName('');
//     setCustomerMobile('');
//     setItems([{ description: '', quantity: 1, price: 0 }]);
//     setTotalAmount(0);
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       {/* Business Details Section */}
//       <div className="flex items-center mb-8 space-x-6 bg-white p-6 rounded-lg shadow-md">
//         {businessDetails.logo && (
//           <img
//             src={`http://localhost:5000${businessDetails.logo}`}
//             alt="Business Logo"
//             className="w-24 h-24 object-contain rounded"
//           />
//         )}
//         <div>
//           <h1 className="text-3xl font-bold text-[#00668c]">{businessDetails.businessName}</h1>
//           <p className="text-gray-700">{businessDetails.address}</p>
//           <p className="text-gray-700">Phone: {businessDetails.phone}</p>
//           <p className="text-gray-700">Email: {businessDetails.email}</p>
//           <p className="text-gray-700">GST No: {businessDetails.gstNo}</p>
//         </div>
//       </div>

//       {/* Bill Generation Form */}
//       <h2 className="text-3xl font-bold text-center text-[#00668c] mb-8">Generate Bill</h2>

//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
//         {/* Customer Name */}
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerName">
//             Customer Name
//           </label>
//           <input
//             type="text"
//             id="customerName"
//             value={customerName}
//             onChange={(e) => setCustomerName(e.target.value)}
//             placeholder="Enter customer name"
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             required
//           />
//         </div>

//         {/* Customer Mobile */}
//         <div className="mb-6">
//           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerMobile">
//             Customer Mobile Number
//           </label>
//           <input
//             type="tel"
//             id="customerMobile"
//             value={customerMobile}
//             onChange={(e) => setCustomerMobile(e.target.value)}
//             placeholder="Enter customer mobile number"
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             pattern="^\+?[0-9\s\-]{7,15}$"
//             title="Enter a valid phone number"
//             required
//           />
//         </div>

//         {/* Items */}
//         <h3 className="text-xl font-bold mb-4">Items</h3>
//         {items.map((item, index) => (
//           <div key={index} className="flex mb-4">
//             <input
//               type="text"
//               name="description"
//               value={item.description}
//               onChange={(e) => handleItemChange(index, e)}
//               placeholder="Item Description"
//               className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
//               required
//             />
//             <input
//               type="number"
//               name="quantity"
//               value={item.quantity}
//               onChange={(e) => handleItemChange(index, e)}
//               placeholder="Quantity"
//               className="shadow appearance-none border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
//               min="1"
//               required
//             />
//             <input
//               type="number"
//               name="price"
//               value={item.price}
//               onChange={(e) => handleItemChange(index, e)}
//               placeholder="Price"
//               className="shadow appearance-none border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               min="0"
//               step="0.01"
//               required
//             />
//             <button
//               type="button"
//               onClick={() => removeItem(index)}
//               className="bg-red-500 text-white rounded px-4 py-2 ml-2"
//               aria-label={`Remove item ${index + 1}`}
//             >
//               Remove
//             </button>
//           </div>
//         ))}

//         {/* Add Item */}
//         <button
//           type="button"
//           onClick={addItem}
//           className="bg-blue-500 text-white rounded px-4 py-2 mb-4"
//         >
//           Add Item
//         </button>

//         {/* Total */}
//         <div className="mb-4">
//           <h3 className="text-lg font-bold">Total Amount: ₹{totalAmount.toFixed(2)}</h3>
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           className="bg-green-500 text-white rounded px-6 py-2 hover:bg-green-600 transition duration-300"
//         >
//           Generate Bill
//         </button>
//       </form>
//     </div>
//   );
// };

// export default GenerateBills;


// import React, { useEffect, useState } from 'react';

// const GenerateBills = () => {
//   const [businessDetails, setBusinessDetails] = useState({});
//   const [customerName, setCustomerName] = useState('');
//   const [customerMobile, setCustomerMobile] = useState('');
//   const [items, setItems] = useState([{ description: '', quantity: 1, price: 0 }]);
//   const [totalAmount, setTotalAmount] = useState(0);

//   useEffect(() => {
//     const fetchBusinessDetails = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       try {
//         const response = await fetch('http://localhost:5000/api/auth/profile', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await response.json();
//         if (response.ok) setBusinessDetails(data);
//         else console.error('Failed to fetch business details');
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchBusinessDetails();
//   }, []);

//   const handleItemChange = (index, event) => {
//     const { name, value } = event.target;
//     const newItems = [...items];
//     if (name === 'quantity' || name === 'price') {
//       newItems[index][name] = Number(value);
//     } else {
//       newItems[index][name] = value;
//     }
//     setItems(newItems);
//     calculateTotal(newItems);
//   };

//   const addItem = () => {
//     setItems([...items, { description: '', quantity: 1, price: 0 }]);
//   };

//   const removeItem = (index) => {
//     const newItems = items.filter((_, i) => i !== index);
//     setItems(newItems);
//     calculateTotal(newItems);
//   };

//   const calculateTotal = (items) => {
//     const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
//     setTotalAmount(total);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const billData = {
//       businessDetails,
//       customerName,
//       customerMobile,
//       items,
//       totalAmount,
//       date: new Date().toLocaleString(),
//     };
//     console.log('Bill generated:', billData);

//     // Open printable invoice
//     const invoiceWindow = window.open('', 'PRINT', 'height=800,width=600');

//     invoiceWindow.document.write(`
//       <html>
//         <head>
//           <title>Invoice</title>
//           <style>
//             body { font-family: Arial, sans-serif; padding: 20px; }
//             h1, h2, h3 { color: #00668c; }
//             table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//             table, th, td { border: 1px solid black; }
//             th, td { padding: 10px; text-align: left; }
//             .total { text-align: right; font-weight: bold; }
//           </style>
//         </head>
//         <body>
//           <h1>${billData.businessDetails.businessName || ''}</h1>
//           <p>${billData.businessDetails.address || ''}</p>
//           <p>Phone: ${billData.businessDetails.phone || ''}</p>
//           <p>Email: ${billData.businessDetails.email || ''}</p>
//           <p>GST No: ${billData.businessDetails.gstNo || ''}</p>
//           <hr/>
//           <h2>Invoice</h2>
//           <p><strong>Date:</strong> ${billData.date}</p>
//           <p><strong>Customer Name:</strong> ${billData.customerName}</p>
//           <p><strong>Customer Mobile:</strong> ${billData.customerMobile}</p>

//           <table>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Description</th>
//                 <th>Quantity</th>
//                 <th>Price (₹)</th>
//                 <th>Total (₹)</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${billData.items.map((item, index) => `
//                 <tr>
//                   <td>${index + 1}</td>
//                   <td>${item.description}</td>
//                   <td>${item.quantity}</td>
//                   <td>${item.price.toFixed(2)}</td>
//                   <td>${(item.price * item.quantity).toFixed(2)}</td>
//                 </tr>
//               `).join('')}
//             </tbody>
//           </table>

//           <h3 class="total">Grand Total: ₹${billData.totalAmount.toFixed(2)}</h3>

//           <script>
//             window.onload = function() {
//               window.print();
//               window.onafterprint = function() {
//                 window.close();
//               }
//             }
//           </script>
//         </body>
//       </html>
//     `);

//     invoiceWindow.document.close();
//     invoiceWindow.focus();

//     // Reset form
//     setCustomerName('');
//     setCustomerMobile('');
//     setItems([{ description: '', quantity: 1, price: 0 }]);
//     setTotalAmount(0);
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       {/* Business Details Section */}
//       <div className="flex items-center mb-8 space-x-6 bg-white p-6 rounded-lg shadow-md">
//         {businessDetails.logo && (
//           <img
//             src={`http://localhost:5000${businessDetails.logo}`}
//             alt="Business Logo"
//             className="w-24 h-24 object-contain rounded"
//           />
//         )}
//         <div>
//           <h1 className="text-3xl font-bold text-[#00668c]">{businessDetails.businessName}</h1>
//           <p className="text-gray-700">{businessDetails.address}</p>
//           <p className="text-gray-700">Phone: {businessDetails.phone}</p>
//           <p className="text-gray-700">Email: {businessDetails.email}</p>
//           <p className="text-gray-700">GST No: {businessDetails.gstNo}</p>
//         </div>
//       </div>

//       {/* Bill Generation Form */}
//       <h2 className="text-3xl font-bold text-center text-[#00668c] mb-8">Generate Bill</h2>

//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
//         {/* Customer Name */}
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerName">
//             Customer Name
//           </label>
//           <input
//             type="text"
//             id="customerName"
//             value={customerName}
//             onChange={(e) => setCustomerName(e.target.value)}
//             placeholder="Enter customer name"
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             required
//           />
//         </div>

//         {/* Customer Mobile Number */}
//         <div className="mb-6">
//           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerMobile">
//             Customer Mobile Number
//           </label>
//           <input
//             type="tel"
//             id="customerMobile"
//             value={customerMobile}
//             onChange={(e) => setCustomerMobile(e.target.value)}
//             placeholder="Enter customer mobile number"
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             pattern="^\+?[0-9\s\-]{7,15}$"
//             title="Enter a valid phone number"
//             required
//           />
//         </div>

//         {/* Items Section */}
//         <h3 className="text-xl font-bold mb-4">Items</h3>
//         {items.map((item, index) => (
//           <div key={index} className="flex mb-4">
//             <input
//               type="text"
//               name="description"
//               value={item.description}
//               onChange={(e) => handleItemChange(index, e)}
//               placeholder="Item Description"
//               className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
//               required
//             />
//             <input
//               type="number"
//               name="quantity"
//               value={item.quantity}
//               onChange={(e) => handleItemChange(index, e)}
//               placeholder="Quantity"
//               className="shadow appearance-none border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
//               min="1"
//               required
//             />
//             <input
//               type="number"
//               name="price"
//               value={item.price}
//               onChange={(e) => handleItemChange(index, e)}
//               placeholder="Price"
//               className="shadow appearance-none border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               min="0"
//               step="0.01"
//               required
//             />
//             <button
//               type="button"
//               onClick={() => removeItem(index)}
//               className="bg-red-500 text-white rounded px-4 py-2 ml-2"
//               aria-label={`Remove item ${index + 1}`}
//             >
//               Remove
//             </button>
//           </div>
//         ))}

//         {/* Add Item Button */}
//         <button
//           type="button"
//           onClick={addItem}
//           className="bg-blue-500 text-white rounded px-4 py-2 mb-4"
//         >
//           Add Item
//         </button>

//         {/* Total Amount */}
//         <div className="mb-4">
//           <h3 className="text-lg font-bold">Total Amount: ₹{totalAmount.toFixed(2)}</h3>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="bg-green-500 text-white rounded px-6 py-2 hover:bg-green-600 transition duration-300"
//         >
//           Generate Bill
//         </button>
//       </form>
//     </div>
//   );
// };

// export default GenerateBills;


/////////////////------------------

// import React, { useEffect, useState } from 'react';

// const GenerateBills = () => {
//   const [businessDetails, setBusinessDetails] = useState({});
//   const [customerName, setCustomerName] = useState('');
//   const [customerMobile, setCustomerMobile] = useState('');
//   const [items, setItems] = useState([{ description: '', quantity: 1, price: 0 }]);
//   const [totalAmount, setTotalAmount] = useState(0);

//   useEffect(() => {
//     const fetchBusinessDetails = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       try {
//         const response = await fetch('http://localhost:5000/api/auth/profile', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await response.json();
//         if (response.ok) setBusinessDetails(data);
//         else console.error('Failed to fetch business details');
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchBusinessDetails();
//   }, []);

//   const handleItemChange = (index, event) => {
//     const { name, value } = event.target;
//     const newItems = [...items];
//     if (name === 'quantity' || name === 'price') {
//       newItems[index][name] = Number(value);
//     } else {
//       newItems[index][name] = value;
//     }
//     setItems(newItems);
//     calculateTotal(newItems);
//   };

//   const addItem = () => {
//     setItems([...items, { description: '', quantity: 1, price: 0 }]);
//   };

//   const removeItem = (index) => {
//     const newItems = items.filter((_, i) => i !== index);
//     setItems(newItems);
//     calculateTotal(newItems);
//   };

//   const calculateTotal = (items) => {
//     const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
//     setTotalAmount(total);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const billData = {
//       businessDetails,
//       customerName,
//       customerMobile,
//       items,
//       totalAmount,
//       date: new Date().toISOString(),
//     };
//     console.log('Bill generated:', billData);

//     // You can POST `billData` to your backend here if needed

//     // Reset form
//     setCustomerName('');
//     setCustomerMobile('');
//     setItems([{ description: '', quantity: 1, price: 0 }]);
//     setTotalAmount(0);
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       {/* Business Details Section */}
//       <div className="flex items-center mb-8 space-x-6 bg-white p-6 rounded-lg shadow-md">
//         {businessDetails.logo && (
//           <img
//             src={`http://localhost:5000${businessDetails.logo}`}
//             alt="Business Logo"
//             className="w-24 h-24 object-contain rounded"
//           />
//         )}
//         <div>
//           <h1 className="text-3xl font-bold text-[#00668c]">{businessDetails.businessName}</h1>
//           <p className="text-gray-700">{businessDetails.address}</p>
//           <p className="text-gray-700">Phone: {businessDetails.phone}</p>
//           <p className="text-gray-700">Email: {businessDetails.email}</p>
//           <p className="text-gray-700">GST No: {businessDetails.gstNo}</p>
//         </div>
//       </div>

//       {/* Bill Generation Form */}
//       <h2 className="text-3xl font-bold text-center text-[#00668c] mb-8">Generate Bill</h2>

//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
//         {/* Customer Name */}
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerName">
//             Customer Name
//           </label>
//           <input
//             type="text"
//             id="customerName"
//             value={customerName}
//             onChange={(e) => setCustomerName(e.target.value)}
//             placeholder="Enter customer name"
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             required
//           />
//         </div>

//         {/* Customer Mobile Number */}
//         <div className="mb-6">
//           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerMobile">
//             Customer Mobile Number
//           </label>
//           <input
//             type="tel"
//             id="customerMobile"
//             value={customerMobile}
//             onChange={(e) => setCustomerMobile(e.target.value)}
//             placeholder="Enter customer mobile number"
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             pattern="^\+?[0-9\s\-]{7,15}$"
//             title="Enter a valid phone number"
//             required
//           />
//         </div>

//         {/* Items Section */}
//         <h3 className="text-xl font-bold mb-4">Items</h3>
//         {items.map((item, index) => (
//           <div key={index} className="flex mb-4">
//             <input
//               type="text"
//               name="description"
//               value={item.description}
//               onChange={(e) => handleItemChange(index, e)}
//               placeholder="Item Description"
//               className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
//               required
//             />
//             <input
//               type="number"
//               name="quantity"
//               value={item.quantity}
//               onChange={(e) => handleItemChange(index, e)}
//               placeholder="Quantity"
//               className="shadow appearance-none border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
//               min="1"
//               required
//             />
//             <input
//               type="number"
//               name="price"
//               value={item.price}
//               onChange={(e) => handleItemChange(index, e)}
//               placeholder="Price"
//               className="shadow appearance-none border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               min="0"
//               step="0.01"
//               required
//             />
//             <button
//               type="button"
//               onClick={() => removeItem(index)}
//               className="bg-red-500 text-white rounded px-4 py-2 ml-2"
//               aria-label={`Remove item ${index + 1}`}
//             >
//               Remove
//             </button>
//           </div>
//         ))}

//         {/* Add Item Button */}
//         <button
//           type="button"
//           onClick={addItem}
//           className="bg-blue-500 text-white rounded px-4 py-2 mb-4"
//         >
//           Add Item
//         </button>

//         {/* Total Amount */}
//         <div className="mb-4">
//           <h3 className="text-lg font-bold">Total Amount: ₹{totalAmount.toFixed(2)}</h3>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="bg-green-500 text-white rounded px-6 py-2 hover:bg-green-600 transition duration-300"
//         >
//           Generate Bill
//         </button>
//       </form>
//     </div>
//   );
// };

// export default GenerateBills;

////-_______________________________________________________
// import React, { useEffect, useState } from 'react';

// const GenerateBills = () => {
//   const [businessDetails, setBusinessDetails] = useState({});

//   useEffect(() => {
//     const fetchBusinessDetails = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       try {
//         const response = await fetch('http://localhost:5000/api/auth/profile', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await response.json();
//         if (response.ok) setBusinessDetails(data);
//         else console.error('Failed to fetch business details');
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchBusinessDetails();
//   }, []);

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <div className="flex items-center mb-8 space-x-6 bg-white p-6 rounded-lg shadow-md">
//         {businessDetails.logo && (
//           <img
//             src={`http://localhost:5000${businessDetails.logo}`}
//             alt="Business Logo"
//             className="w-24 h-24 object-contain rounded"
//           />
//         )}
//         <div>
//           <h1 className="text-3xl font-bold text-[#00668c]">{businessDetails.businessName}</h1>
//           <p className="text-gray-700">{businessDetails.address}</p>
//           <p className="text-gray-700">Phone: {businessDetails.phone}</p>
//           <p className="text-gray-700">Email: {businessDetails.email}</p>
//           <p className="text-gray-700">GST No: {businessDetails.gstNo}</p>
//         </div>
//       </div>

//       {/* You can continue adding billing form below */}
//     </div>
//   );
// };

// export default GenerateBills;

// import React, { useState, useEffect } from 'react';

// const GenerateBills = () => {
//   // Business details - for demo, fetched from localStorage or hardcoded
//   // You can replace this with props or context as per your app design
//   const [businessDetails, setBusinessDetails] = useState({
//     businessName: '',
//     phone: '',
//     email: '',
//     address: '',
//     gstNo: '',
//     logo: '',
//   });

//   // Customer details
//   const [customerName, setCustomerName] = useState('');
//   const [customerMobile, setCustomerMobile] = useState('');
//   const [items, setItems] = useState([{ description: '', quantity: 1, price: 0 }]);
//   const [totalAmount, setTotalAmount] = useState(0);

//   useEffect(() => {
//     // Example: Fetch business details from localStorage or API
//     // Assuming you stored business info in localStorage as JSON string under 'businessInfo'
//     const storedBusiness = localStorage.getItem('businessInfo');
//     if (storedBusiness) {
//       setBusinessDetails(JSON.parse(storedBusiness));
//     } else {
//       // Fallback hardcoded example
//       setBusinessDetails({
//         businessName: 'InvoiceGen Pvt Ltd',
//         phone: '+1 234 567 890',
//         email: 'contact@invoicegen.com',
//         address: '123 Business St, City, Country',
//         gstNo: 'GSTIN123456789',
//         logo: '', // or '/path/to/logo.png'
//       });
//     }
//   }, []);

//   const handleItemChange = (index, event) => {
//     const { name, value } = event.target;
//     const newItems = [...items];
//     if (name === 'quantity' || name === 'price') {
//       // Convert to number
//       newItems[index][name] = Number(value);
//     } else {
//       newItems[index][name] = value;
//     }
//     setItems(newItems);
//     calculateTotal(newItems);
//   };

//   const addItem = () => {
//     setItems([...items, { description: '', quantity: 1, price: 0 }]);
//   };

//   const removeItem = (index) => {
//     const newItems = items.filter((_, i) => i !== index);
//     setItems(newItems);
//     calculateTotal(newItems);
//   };

//   const calculateTotal = (items) => {
//     const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
//     setTotalAmount(total);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle bill submission, e.g., send to server or save locally
//     const billData = {
//       businessDetails,
//       customerName,
//       customerMobile,
//       items,
//       totalAmount,
//       date: new Date().toISOString(),
//     };
//     console.log('Bill generated:', billData);

//     // Reset form
//     setCustomerName('');
//     setCustomerMobile('');
//     setItems([{ description: '', quantity: 1, price: 0 }]);
//     setTotalAmount(0);
//   };

//   return (
//     <div className="p-8 max-w-4xl mx-auto">
//       {/* Business Details */}
//       <div className="flex items-center mb-8 space-x-6 bg-white p-6 rounded-lg shadow-md">
//         {businessDetails.logo && (
//           <img
//             src={businessDetails.logo}
//             alt="Business Logo"
//             className="w-24 h-24 object-contain rounded"
//           />
//         )}
//         <div>
//           <h1 className="text-3xl font-bold text-[#00668c]">{businessDetails.businessName}</h1>
//           <p className="text-gray-700">{businessDetails.address}</p>
//           <p className="text-gray-700">Phone: {businessDetails.phone}</p>
//           <p className="text-gray-700">Email: {businessDetails.email}</p>
//           <p className="text-gray-700">GST No: {businessDetails.gstNo}</p>
//         </div>
//       </div>

//       <h2 className="text-3xl font-bold text-center text-[#00668c] mb-8">Generate Bill</h2>

//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
//         {/* Customer Name */}
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerName">
//             Customer Name
//           </label>
//           <input
//             type="text"
//             id="customerName"
//             value={customerName}
//             onChange={(e) => setCustomerName(e.target.value)}
//             placeholder="Enter customer name"
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             required
//           />
//         </div>

//         {/* Customer Mobile Number */}
//         <div className="mb-6">
//           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerMobile">
//             Customer Mobile Number
//           </label>
//           <input
//             type="tel"
//             id="customerMobile"
//             value={customerMobile}
//             onChange={(e) => setCustomerMobile(e.target.value)}
//             placeholder="Enter customer mobile number"
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             pattern="^\+?[0-9\s\-]{7,15}$"
//             title="Enter a valid phone number"
//             required
//           />
//         </div>

//         {/* Items */}
//         <h3 className="text-xl font-bold mb-4">Items</h3>
//         {items.map((item, index) => (
//           <div key={index} className="flex mb-4">
//             <input
//               type="text"
//               name="description"
//               value={item.description}
//               onChange={(e) => handleItemChange(index, e)}
//               placeholder="Item Description"
//               className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
//               required
//             />
//             <input
//               type="number"
//               name="quantity"
//               value={item.quantity}
//               onChange={(e) => handleItemChange(index, e)}
//               placeholder="Quantity"
//               className="shadow appearance-none border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
//               min="1"
//               required
//             />
//             <input
//               type="number"
//               name="price"
//               value={item.price}
//               onChange={(e) => handleItemChange(index, e)}
//               placeholder="Price"
//               className="shadow appearance-none border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               min="0"
//               step="0.01"
//               required
//             />
//             <button
//               type="button"
//               onClick={() => removeItem(index)}
//               className="bg-red-500 text-white rounded px-4 py-2 ml-2"
//               aria-label={`Remove item ${index + 1}`}
//             >
//               Remove
//             </button>
//           </div>
//         ))}

//         <button
//           type="button"
//           onClick={addItem}
//           className="bg-blue-500 text-white rounded px-4 py-2 mb-4"
//         >
//           Add Item
//         </button>

//         {/* Total Amount */}
//         <div className="mb-4">
//           <h3 className="text-lg font-bold">Total Amount: ${totalAmount.toFixed(2)}</h3>
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           className="bg-green-500 text-white rounded px-6 py-2 hover:bg-green-600 transition duration-300"
//         >
//           Generate Bill
//         </button>
//       </form>
//     </div>
//   );
// };

// export default GenerateBills;
// import React, { useState } from 'react';

// const GenerateBills = () => {
//   const [customerName, setCustomerName] = useState('');
//   const [items, setItems] = useState([{ description: '', quantity: 1, price: 0 }]);
//   const [totalAmount, setTotalAmount] = useState(0);

//   const handleItemChange = (index, event) => {
//     const { name, value } = event.target;
//     const newItems = [...items];
//     newItems[index][name] = value;
//     setItems(newItems);
//     calculateTotal(newItems);
//   };

//   const addItem = () => {
//     setItems([...items, { description: '', quantity: 1, price: 0 }]);
//   };

//   const removeItem = (index) => {
//     const newItems = items.filter((_, i) => i !== index);
//     setItems(newItems);
//     calculateTotal(newItems);
//   };

//   const calculateTotal = (items) => {
//     const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
//     setTotalAmount(total);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Here you can handle the submission of the bill, e.g., send it to the server
//     console.log('Bill generated:', { customerName, items, totalAmount });
//     // Reset form after submission
//     setCustomerName('');
//     setItems([{ description: '', quantity: 1, price: 0 }]);
//     setTotalAmount(0);
//   };

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold text-center text-[#00668c] mb-8">Generate Bill</h1>
//       <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerName">
//             Customer Name
//           </label>
//           <input
//             type="text"
//             id="customerName"
//             value={customerName}
//             onChange={(e) => setCustomerName(e.target.value)}
//             placeholder="Enter customer name"
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             required
//           />
//         </div>

//         <h2 className="text-xl font-bold mb-4">Items</h2>
//         {items.map((item, index) => (
//           <div key={index} className="flex mb-4">
//             <input
//               type="text"
//               name="description"
//               value={item.description}
//               onChange={(e) => handleItemChange(index, e)}
//               placeholder="Item Description"
//               className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
//               required
//             />
//             <input
//               type="number"
//               name="quantity"
//               value={item.quantity}
//               onChange={(e) => handleItemChange(index, e)}
//               placeholder="Quantity"
//               className="shadow appearance-none border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
//               min="1"
//               required
//             />
//             <input
//               type="number"
//               name="price"
//               value={item.price}
//               onChange={(e) => handleItemChange(index, e)}
//               placeholder="Price"
//               className="shadow appearance-none border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               min="0"
//               required
//             />
//             <button
//               type="button"
//               onClick={() => removeItem(index)}
//               className="bg-red-500 text-white rounded px-4 py-2 ml-2"
//             >
//               Remove
//             </button>
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={addItem}
//           className="bg-blue-500 text-white rounded px-4 py-2 mb-4"
//         >
//           Add Item
//         </button>

//         <div className="mb-4">
//           <h2 className="text-lg font-bold">Total Amount: ${totalAmount.toFixed (2)}</h2>
//         </div>
//         <button
//           type="submit"
//           className="bg-green-500 text-white rounded px-4 py-2"
//         >
//           Generate Bill
//         </button>
//       </form>
//     </div>
//   );
// };

// export default GenerateBills; 