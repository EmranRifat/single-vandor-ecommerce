"use client";

type SidebarTogglerProps = {
  onToggle?: () => void;
};

export default function SidebarToggler({ onToggle }: SidebarTogglerProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="ml-2 mr-2 rounded-md p-1 transition hover:bg-white/10 md:hidden"
      aria-label="Toggle sidebar"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6 text-white"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
        />
      </svg>
    </button>
  );
}
