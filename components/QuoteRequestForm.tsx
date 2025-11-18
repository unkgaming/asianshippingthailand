"use client";
import { useState } from 'react';

interface QuoteRequestFormProps {
  user?: { name?: string; email?: string } | null;
  onSuccess?: () => void;
  sendToOptions?: string[];
}

export default function QuoteRequestForm({ user, onSuccess, sendToOptions = [] }: QuoteRequestFormProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    company: '',
    service: 'airfreight',
    sendTo: sendToOptions[0] || '',
    productType: '',
    cargoType: '',
    origin: '',
    destination: '',
    weight: '',
    weightUnit: 'kg',
    dimensions: '',
    numberOfBoxes: '',
    numberOfCargo: '',
    itemsList: '',
    shippingDate: '',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Build detailed message with all information
      const detailedMessage = `QUOTE REQUEST

CUSTOMER INFORMATION:
- Name: ${formData.name}
- Email: ${formData.email}
- Phone: ${formData.phone || 'Not provided'}
- Company: ${formData.company || 'Not provided'}

SHIPPING DETAILS:
- Service Type: ${formData.service}
- Product Type: ${formData.productType || 'Not specified'}
- Cargo Type: ${formData.cargoType}
- Origin: ${formData.origin}
- Destination: ${formData.destination}
- Number of Boxes: ${formData.numberOfBoxes || 'Not specified'}
- Number of Cargo: ${formData.numberOfCargo || 'Not specified'}
- Total Weight: ${formData.weight} ${formData.weightUnit}
- Dimensions: ${formData.dimensions || 'Not provided'}
- Preferred Shipping Date: ${formData.shippingDate || 'Not specified'}

CARGO INFORMATION:
${formData.itemsList ? `Items List:\n${formData.itemsList}\n\n` : ''}Description:
${formData.description}`;

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          service: formData.service,
          sendTo: formData.sendTo,
          productType: formData.productType,
          weight: formData.weight,
          weightUnit: formData.weightUnit,
          message: detailedMessage
        })
      });

      const result = await response.json();

      if (result.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({
            name: user?.name || '',
            email: user?.email || '',
            phone: '',
            company: '',
            service: 'airfreight',
            sendTo: sendToOptions[0] || '',
            productType: '',
            cargoType: '',
            origin: '',
            destination: '',
            weight: '',
            weightUnit: 'kg',
            dimensions: '',
            numberOfBoxes: '',
            numberOfCargo: '',
            itemsList: '',
            shippingDate: '',
            description: ''
          });
          onSuccess?.();
        }, 3000);
      } else {
        throw new Error(result.error || 'Failed to submit quote request');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">Quote Request Submitted!</h3>
        <p className="text-green-600">Our team will respond within 24 hours with a detailed quote.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Customer Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              placeholder="Your Company"
            />
          </div>
        </div>
      </div>

      {/* Shipping Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Shipping Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Type *</label>
            <select
              name="service"
              required
              value={formData.service}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
            >
              <option value="airfreight">Airfreight Services</option>
              <option value="fcl">Seafreight - FCL</option>
              <option value="lcl">Seafreight - LCL</option>
              <option value="tracking">Tracking & Monitoring</option>
              <option value="other">Other Services</option>
            </select>
          </div>

          {sendToOptions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Send To *</label>
              <input
                type="email"
                name="sendTo"
                required
                value={formData.sendTo}
                onChange={handleChange}
                list="sendToSuggestions"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                placeholder="Select recipient"
              />
              <datalist id="sendToSuggestions">
                {sendToOptions.map((email) => (
                  <option key={email} value={email} />
                ))}
              </datalist>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Type *</label>
            <select
              name="productType"
              required
              value={formData.productType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
            >
              <option value="">Select a product category</option>
              <optgroup label="Electronics & Fragile">
                <option value="electronics">Consumer Electronics</option>
                <option value="components">Electronic Components</option>
                <option value="instruments">Instruments & Optics</option>
              </optgroup>
              <optgroup label="Apparel & Textiles">
                <option value="apparel">Apparel</option>
                <option value="textiles">Textiles & Fabrics</option>
                <option value="footwear">Footwear</option>
              </optgroup>
              <optgroup label="Food & Perishables">
                <option value="dry-food">Dry Food</option>
                <option value="perishables">Perishables (Chilled/Frozen)</option>
                <option value="beverage">Beverages</option>
              </optgroup>
              <optgroup label="Furniture & Oversized">
                <option value="furniture">Furniture</option>
                <option value="fixtures">Fixtures</option>
              </optgroup>
              <optgroup label="Machinery & Industrial">
                <option value="machinery">Machinery</option>
                <option value="industrial">Industrial Equipment</option>
                <option value="tools">Tools</option>
              </optgroup>
              <optgroup label="Chemicals & Hazmat">
                <option value="chemicals">Chemicals (Non-Hazmat)</option>
                <option value="hazmat">Hazardous Materials</option>
              </optgroup>
              <optgroup label="Documents & Media">
                <option value="documents">Documents</option>
                <option value="media">Media & Books</option>
              </optgroup>
              <optgroup label="Automotive & Parts">
                <option value="automotive">Automotive Parts</option>
                <option value="tires">Tires</option>
              </optgroup>
              <optgroup label="Medical & Pharmaceutical">
                <option value="medical">Medical Devices</option>
                <option value="pharma">Pharmaceuticals</option>
              </optgroup>
              <optgroup label="Other">
                <option value="household">Household Goods</option>
                <option value="other">Other</option>
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cargo Type *</label>
            <select
              name="cargoType"
              required
              value={formData.cargoType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
            >
              <option value="">Select Type</option>
              <option value="General Cargo">General Cargo</option>
              <option value="Refrigerated">Refrigerated</option>
              <option value="Hazardous">Hazardous</option>
              <option value="Oversized">Oversized</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Origin Port/Airport *</label>
            <input
              type="text"
              name="origin"
              required
              value={formData.origin}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              placeholder="e.g., Shanghai, China"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Destination Port/Airport *</label>
            <input
              type="text"
              name="destination"
              required
              value={formData.destination}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              placeholder="e.g., Los Angeles, USA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Boxes *</label>
            <input
              type="number"
              name="numberOfBoxes"
              required
              min="1"
              value={formData.numberOfBoxes}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              placeholder="e.g., 10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Cargo *</label>
            <input
              type="number"
              name="numberOfCargo"
              required
              min="1"
              value={formData.numberOfCargo}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              placeholder="e.g., 5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Weight *</label>
            <div className="flex gap-2">
              <input
                type="number"
                name="weight"
                required
                min="0.1"
                step="0.1"
                value={formData.weight}
                onChange={handleChange}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                placeholder="0.0"
              />
              <select
                name="weightUnit"
                value={formData.weightUnit}
                onChange={handleChange}
                className="w-24 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              >
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
                <option value="tons">tons</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions (L x W x H cm)</label>
            <input
              type="text"
              name="dimensions"
              value={formData.dimensions}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              placeholder="e.g., 100 x 80 x 60"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Shipping Date</label>
            <input
              type="date"
              name="shippingDate"
              value={formData.shippingDate}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Cargo Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Cargo Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              List of Items <span className="text-gray-500 text-xs">(One item per line)</span>
            </label>
            <textarea
              name="itemsList"
              rows={4}
              value={formData.itemsList}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              placeholder="Example:&#10;- 100 boxes of electronics&#10;- 50 cartons of clothing&#10;- 20 pallets of machinery parts"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Details & Description *</label>
            <textarea
              name="description"
              rows={4}
              required
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              placeholder="Provide any additional information about your cargo, special handling requirements, insurance needs, or specific questions..."
            />
          </div>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
        </button>
        <button
          type="reset"
          onClick={() => setFormData({
            name: user?.name || '',
            email: user?.email || '',
            phone: '',
            company: '',
            service: 'airfreight',
            sendTo: sendToOptions[0] || '',
            productType: '',
            cargoType: '',
            origin: '',
            destination: '',
            weight: '',
            weightUnit: 'kg',
            dimensions: '',
            numberOfBoxes: '',
            numberOfCargo: '',
            itemsList: '',
            shippingDate: '',
            description: ''
          })}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Clear Form
        </button>
      </div>
    </form>
  );
}
