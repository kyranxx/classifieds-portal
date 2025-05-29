'use client';

import { useSearchBox, UseSearchBoxProps } from 'react-instantsearch'; // Updated import
import { FormEvent, useEffect, useRef } from 'react';

const SearchBox = (props: UseSearchBoxProps) => {
  const { query, refine, clear, isSearchStalled } = useSearchBox(props);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // The refine function is called on input change, so submit might not be strictly necessary
    // unless you want to trigger search explicitly on enter or button click.
    if (inputRef.current) {
      refine(inputRef.current.value);
    }
  };

  // Debounce refine calls if needed, or rely on default behavior
  // For simplicity, we'll use the default behavior here.

  useEffect(() => {
    // Optional: focus input on mount
    // inputRef.current?.focus();
  }, []);

  return (
    <form
      action=""
      role="search"
      noValidate
      onSubmit={handleSubmit}
      className="relative w-full max-w-md mx-auto"
    >
      <input
        ref={inputRef}
        type="search"
        placeholder="Search for ads..."
        value={query}
        onChange={(event) => refine(event.currentTarget.value)}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        className="w-full px-4 py-3 pr-10 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
      />
      <button
        type="button"
        onClick={clear}
        className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700 ${
          !query ? 'hidden' : ''
        }`}
        aria-label="Clear search"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {isSearchStalled ? <p className="text-xs text-slate-500 mt-1">Loading results...</p> : null}
    </form>
  );
};

export default SearchBox;
