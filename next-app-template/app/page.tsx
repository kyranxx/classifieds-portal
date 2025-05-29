// HeroUI components and styles removed
// import { Link } from "@heroui/link";
// import { Snippet } from "@heroui/snippet";
// import { Code } from "@heroui/code";
// import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
// import { title, subtitle } from "@/components/primitives"; // Primitives removed
import { GithubIcon } from "@/components/icons"; // Assuming GithubIcon is not from HeroUI

// Basic styling, replace with your own or Tailwind utility classes
const title = () => "text-4xl font-bold";
const subtitle = () => "text-xl text-gray-500";
const buttonStyles = (opts: any) => {
  let base = "py-2 px-4 rounded-full ";
  if (opts.color === "primary") base += "bg-blue-500 text-white ";
  if (opts.variant === "bordered") base += "border border-gray-300 ";
  return base;
};


export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <h1 className={title()}>Make&nbsp;
        <span style={{ color: "violet" }}>beautiful&nbsp;</span>
        <br />
          websites regardless of your design experience.
        </h1>
        <p className={subtitle() + " mt-4"}>
          A Next.js template.
        </p>
      </div>

      <div className="flex gap-3">
        <a
          href={siteConfig.links.docs}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow", // This variant might not have a direct Tailwind equivalent without custom CSS
          })}
        >
          Documentation
        </a>
        <a
          href={siteConfig.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonStyles({ variant: "bordered", radius: "full" })}
        >
          <GithubIcon size={20} /> {/* Assuming this is a generic SVG icon */}
          GitHub
        </a>
      </div>

      <div className="mt-8 p-2 border rounded">
        <span>
          Get started by editing <code className="text-blue-500">app/page.tsx</code>
        </span>
      </div>
    </section>
  );
}
