'use client';

const AdFilters = () => {
  return (
    <div className="bg-slate-50 p-4 rounded-lg shadow mb-8 border border-slate-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
          >
            <option value="">All Categories</option>
            {/* Add category options here later */}
            <option value="electronics">Electronics</option>
            <option value="vehicles">Vehicles</option>
            <option value="property">Property</option>
          </select>
        </div>
        <div>
          <label htmlFor="price-min" className="block text-sm font-medium text-slate-700 mb-1">
            Min Price
          </label>
          <input
            type="number"
            id="price-min"
            name="price-min"
            placeholder="e.g., 100"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="price-max" className="block text-sm font-medium text-slate-700 mb-1">
            Max Price
          </label>
          <input
            type="number"
            id="price-max"
            name="price-max"
            placeholder="e.g., 1000"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="e.g., City or Zip"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="mt-4 text-right">
        <button
          type="button"
          className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-6 rounded-md transition duration-150 shadow-sm hover:shadow-md"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default AdFilters;
