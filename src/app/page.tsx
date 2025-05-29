// HeroUI components removed
// import { Button } from "@heroui/button";
// import { Link } from "@heroui/link";
// import { Snippet } from "@heroui/snippet";
// import { Code } from "@heroui/code";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 min-h-screen bg-black text-white">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          Make <span className="text-purple-500">beautiful</span> websites
          regardless of your design experience.
        </h1>
        <h2 className="mt-6 text-lg md:text-xl text-gray-400">
          A Next.js application.
        </h2>
      </div>

      <div className="flex gap-3 mt-8">
        <a
          href="/docs" // Assuming /docs is a valid route in your app
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg inline-flex items-center"
        >
          Get Started
          <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 24 24"
            width="1em"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-2"
          >
            <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
        <div
          className="p-3 bg-gray-800 text-gray-300 rounded-md"
        >
          <code className="text-purple-400">$ npx create-next-app@latest my-app</code>
        </div>
      </div>
    </section>
  );
}
