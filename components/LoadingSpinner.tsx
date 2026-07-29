interface LoadingSpinnerProps {
  message?: string
}

export default function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-[#2B6CB0] rounded-full border-t-transparent" style={{ animation: 'spin 1s linear infinite' }}></div>
      </div>
      <p className="text-[#718096] text-sm">{message}</p>
    </div>
  )
}
