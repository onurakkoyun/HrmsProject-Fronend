import React, { useEffect } from 'react'

export default function ResumeSubmitPopup({
  message,
  success,
  handleDismissPopup,
}) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleDismissPopup()
    }, 3000) // 5000 milisaniye (5 saniye) sonra kapat

    // useEffect temizleme fonksiyonu
    return () => {
      clearTimeout(timeoutId) // Component unmount olduğunda timeout'u temizle
    }
  }, [])

  const successSvg = success ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="h-5 w-5 text-green-600"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5 text-red-600"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
      />
    </svg>
  )

  return (
    <div className="fixed top-8 right-1 z-50">
      <div
        role="alert"
        className="flex rounded-xl w-[286px] h-[86px] border-2 border-gray-100 bg-white p-1 shadow-md"
      >
        <div className="flex items-start gap-4 mt-2">
          <span className="text-green-600">{successSvg}</span>

          <div className="flex-1">
            <strong className="block font-medium text-left text-gray-900">
              {message.title}
            </strong>

            <p className="text-sm text-left text-gray-700">{message.content}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
