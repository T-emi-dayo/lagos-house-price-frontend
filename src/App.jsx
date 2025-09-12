import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [formData, setFormData] = useState({
    bedrooms: "",
    bathrooms: "",
    toilets: "",
    parking_space: "",
    town: "",
    title: ""
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const towns = [
    "Ikoyi", "Lekki", "Victoria Island", "Yaba",
    "Surulere", "Ikeja", "Ajah", "Maryland",
    "Ogudu", "Other"
  ];

  const titles = [
    "Detached Duplex", "Semi-Detached Duplex", "Terraced Duplex",
    "Bungalow", "Block of Flats", "Penthouse", "Other"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);
    try {
      const res = await axios.post(
        "https://homely-0xi4.onrender.com",
        {
          bedrooms: Number(formData.bedrooms),
          bathrooms: Number(formData.bathrooms),
          toilets: Number(formData.toilets),
          parking_space: Number(formData.parking_space),
          town: formData.town,
          title: formData.title
        }
      );
      setPrediction(res.data.predicted_price);
    } catch (err) {
      console.error(err);
      setPrediction("Error: Could not fetch prediction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Lagos House Price Predictor
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Town Dropdown */}
          <select
            name="town"
            value={formData.town}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="">Select Town</option>
            {towns.map((t, idx) => (
              <option key={idx} value={t}>{t}</option>
            ))}
          </select>

          {/* Title Dropdown */}
          <select
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="">Select Property Type</option>
            {titles.map((t, idx) => (
              <option key={idx} value={t}>{t}</option>
            ))}
          </select>

          {/* Numeric Inputs */}
          <input
            type="number"
            name="bedrooms"
            placeholder="Number of Bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
          <input
            type="number"
            name="bathrooms"
            placeholder="Number of Bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
          <input
            type="number"
            name="toilets"
            placeholder="Number of Toilets"
            value={formData.toilets}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
          <input
            type="number"
            name="parking_space"
            placeholder="Parking Space"
            value={formData.parking_space}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Predicting..." : "Get Prediction"}
          </button>
        </form>

        {/* Prediction Result */}
        {prediction && (
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold">
              {typeof prediction === "string"
                ? prediction
                : `Predicted Price: ₦${Number(prediction).toLocaleString()}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}