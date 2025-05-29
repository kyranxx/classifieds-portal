import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 min-h-screen bg-black text-white">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          Make <span className="text-purple-500">beautiful</span> websites
          regardless of your design experience.
        </h1>
        <h2 className="mt-6 text-lg md:text-xl text-gray-400">
          Beautiful, fast and modern React UI library for building accessible
          and customizable web applications.
        </h2>
      </div>

      <div className="flex gap-3 mt-8">
        <Button
          as={Link}
          href="/docs"
          variant="shadow"
          color="primary"
          size="lg"
          endContent={
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
            >
              <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          }
        >
          Get Started
        </Button>
        <Snippet
          hideCopyButton
          hideSymbol
          variant="flat"
          className="bg-gray-800 text-gray-300"
        >
          <Code color="primary">$ npx heroui-cli@latest init</Code>
        </Snippet>
      </div>
    </section>
  );
}
