import React, { useEffect } from "react";

export default function ResumeSubmitPopup({ message, handleDismissPopup }) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleDismissPopup();
    }, 3000); // 5000 milisaniye (5 saniye) sonra kapat

    // useEffect temizleme fonksiyonu
    return () => {
      clearTimeout(timeoutId); // Component unmount olduğunda timeout'u temizle
    };
  }, []);
  return (
    <div className="fixed top-8 right-1 z-50">
      <div
        role="alert"
        className="flex animate-pulse rounded-xl w-[286px] h-[86px] border border-gray-100 bg-white p-4"
      >
        <div className="flex items-start gap-4">
          <span className="text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>

          <div className="flex-1">
            <strong className="block font-medium text-gray-900">
              {message.title}
            </strong>

            <p className="mt-1 text-sm text-gray-700">{message.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
