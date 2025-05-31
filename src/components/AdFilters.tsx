'use client';

const AdFilters = () => {
  // Basic state for controlled components (optional, can be handled by parent or form library)
  // For now, keeping it simple as a visual placeholder as per earlier plan.

  return (
    // Changed background to white, adjusted padding and shadow for a cleaner look
    <div className="bg-white p-4 sm:p-5 rounded-lg shadow-md mb-6 border border-slate-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        {/* Category Filter */}
        <div className="lg:col-span-1">
          <label htmlFor="category" className="block text-xs font-medium text-slate-600 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            className="w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-sm"
          >
            <option value="">All</option>
            <option value="electronics">Electronics</option>
            <option value="vehicles">Vehicles</option>
            <option value="property">Property</option>
            <option value="furniture">Furniture</option>
            <option value="fashion">Fashion</option>
            {/* Add more categories as needed */}
          </select>
        </div>

        {/* Min Price Filter */}
        <div className="lg:col-span-1">
          <label htmlFor="price-min" className="block text-xs font-medium text-slate-600 mb-1">
            Min Price
          </label>
          <input
            type="number"
            id="price-min"
            name="price-min"
            placeholder="Min"
            className="w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-sm"
          />
        </div>

        {/* Max Price Filter */}
        <div className="lg:col-span-1">
          <label htmlFor="price-max" className="block text-xs font-medium text-slate-600 mb-1">
            Max Price
          </label>
          <input
            type="number"
            id="price-max"
            name="price-max"
            placeholder="Max"
            className="w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-sm"
          />
        </div>
        
        {/* Location Filter */}
        <div className="lg:col-span-1">
          <label htmlFor="location" className="block text-xs font-medium text-slate-600 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="City or Zip"
            className="w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-sm"
          />
        </div>

        {/* Apply Filters Button */}
        <div className="lg:col-span-1 flex justify-end">
          <button
            type="button"
            className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 px-5 rounded-md transition duration-150 shadow-sm hover:shadow-md text-sm"
          >
            Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdFilters;
