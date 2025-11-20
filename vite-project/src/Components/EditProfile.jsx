import React, { useEffect, useState } from 'react';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    phone: '',
    address: '',
    gstNo: '',
    logo: null,
  });
  const [previewLogo, setPreviewLogo] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch current profile details
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setFormData({
            businessName: data.businessName || '',
            phone: data.phone || '',
            address: data.address || '',
            gstNo: data.gstNo || '',
            logo: null,
          });
          setPreviewLogo(data.logo ? `http://localhost:5000${data.logo}` : '');
        } else {
          setError('Failed to fetch profile');
        }
      } catch (err) {
        setError('Error fetching profile');
      }
    };
    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle logo file change
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, logo: file }));
    if (file) setPreviewLogo(URL.createObjectURL(file));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    const token = localStorage.getItem('token');
    if (!token) return setError('Not authenticated');

    const data = new FormData();
    data.append('businessName', formData.businessName);
    data.append('phone', formData.phone);
    data.append('address', formData.address);
    data.append('gstNo', formData.gstNo);
    if (formData.logo) data.append('logo', formData.logo);

    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      const result = await response.json();
      if (response.ok) {
        setSuccessMessage('Profile updated successfully!');
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('Error updating profile');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-[#00668c]">Edit Business Profile</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block font-semibold mb-1">Business Name</label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">GST No</label>
          <input
            type="text"
            name="gstNo"
            value={formData.gstNo}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="border rounded w-full py-2 px-3"
          />
          {previewLogo && (
            <img src={previewLogo} alt="Logo Preview" className="mt-2 w-24 h-24 object-contain rounded" />
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-6 py-2 hover:bg-blue-700"
        >
          Save Changes
        </button>
        {successMessage && <div className="text-green-600 mt-4">{successMessage}</div>}
        {error && <div className="text-red-600 mt-4">{error}</div>}
      </form>
    </div>
  );
};

export default EditProfile;
