import React from 'react';

export default function GPT({ children }: { children?: React.ReactNode }) {
  return (
    <section className="mb-4">
      <a
        href="https://chatgpt.com/g/g-67827cbb4c908191adab7df5b10f419c-free-cash-flow-finder"
        className="bg-blue-100 p-2 rounded text-blue-500 hover:text-blue-700 hover:underline font-semibold"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children || 'Use this custom GPT for financial analysis'}
      </a>
    </section>
  );
}
