import React, { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

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
  const [error, setError] = useState("");

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
    setError(""); // clear errors on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);
    setError("");

    try {
      const res = await axios.post(`${API_URL}/predict`, {
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        toilets: Number(formData.toilets),
        parking_space: Number(formData.parking_space),
        town: formData.town,
        title: formData.title
      });

      if (res.data.predicted_price) {
        setPrediction(res.data.predicted_price);
      } else {
        setError("Unexpected response from API.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to fetch prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg transition-transform hover:scale-[1.01]">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Lagos House Price Predictor
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dropdowns */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Town</label>
            <select
              name="town"
              value={formData.town}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">Select Town</option>
              {towns.map((t, i) => (
                <option key={i} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Property Type</label>
            <select
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">Select Property Type</option>
              {titles.map((t, i) => (
                <option key={i} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Number Inputs */}
          {["bedrooms", "bathrooms", "toilets", "parking_space"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {field.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
              </label>
              <input
                type="number"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          ))}

          {/* Error message */}
          {error && <p className="text-red-600 text-center">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold text-white transition-colors ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Predicting..." : "Get Prediction"}
          </button>
        </form>

        {/* Result */}
        {prediction && (
          <div className="mt-6 bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-xl font-semibold text-gray-800">
              Predicted Price:
            </p>
            <p className="text-2xl font-bold text-blue-700">
              ₦{Number(prediction).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}