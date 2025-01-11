import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="my-4 text-center text-slate-400">
      <p>
        <a
          href="https://www.linkedin.com/in/jawadshuaib/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-400"
        >
          Created by Jawad Shuaib
        </a>
        {' | '}
        <a
          href="https://github.com/jawadshuaib/stock-valuation"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-400"
        >
          GitHub Repo
        </a>
      </p>
    </footer>
  );
};

export default Footer;
