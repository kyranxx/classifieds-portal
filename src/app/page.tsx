export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-8 py-12 md:py-16 text-center px-4 min-h-[calc(100vh-80px)]">
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-800">
          Welcome to <span className="text-sky-600">Bazzoo</span>!
        </h1>
        <p className="mt-4 text-lg md:text-xl text-slate-600">
          Your new marketplace for great finds. Discover amazing deals or post your ad today.
        </p>
      </div>

      {/* Basic Search Bar Placeholder */}
      <div className="mt-6 w-full max-w-xl">
        <input
          type="text"
          placeholder="Search for anything..."
          className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <a
          href="/ads" // Links to your All Ads page
          className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-150 text-lg"
        >
          Browse Ads
        </a>
        <a
          href="/create-ad" // Links to your Post Ad page
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-150 text-lg"
        >
          Post an Ad
        </a>
      </div>
    </section>
  );
}
