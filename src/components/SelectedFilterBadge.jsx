import React from "react";

const SelectedFilterBadge = ({ filter, onRemove }) => {
  return (
    <div className="inline-flex items-center justify-start rounded-full bg-indigo-100 px-2 py-[4px] mr-1 text-indigo-700">
      <label className="whitespace-nowrap text-xs">{filter}</label>
      <button
        className="-me-1 ms-2 inline-block rounded-full bg-indigo-200 p-0.5 text-indigo-700 transition hover:bg-indigo-300"
        onClick={() => onRemove(filter)}
      >
        <span className="sr-only">Remove badge</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-2 w-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default SelectedFilterBadge;
