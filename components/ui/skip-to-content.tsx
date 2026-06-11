export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="fixed top-2 left-2 z-[99999] px-4 py-2 rounded-xl bg-[#D4B483] text-[#0E0E0E] text-sm font-semibold opacity-0 focus:opacity-100 pointer-events-none focus:pointer-events-auto transition-opacity"
    >
      Skip to content
    </a>
  );
}
