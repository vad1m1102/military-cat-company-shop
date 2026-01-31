export default function Footer() {
  return (
    <footer className="mt-20 py-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        
        {/* Brand */}
        <span className="text-white/60 text-sm">
          © {new Date().getFullYear()} Military Cat Company
        </span>

        {/* Instagram icon */}
        <a
          href="https://www.instagram.com/military_cat_company_/"
          target="_blank"
          rel="noreferrer"
          className="text-white/60 hover:text-primary transition-colors"
          aria-label="Instagram"
        >
          {/* Instagram SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25h-8.5Zm4.25 4a4.75 4.75 0 1 1 0 9.5a4.75 4.75 0 0 1 0-9.5Zm0 1.5a3.25 3.25 0 1 0 0 6.5a3.25 3.25 0 0 0 0-6.5Zm4.9-.65a1.1 1.1 0 1 1 0 2.2a1.1 1.1 0 0 1 0-2.2Z" />
          </svg>
        </a>

      </div>
    </footer>
  );
}
