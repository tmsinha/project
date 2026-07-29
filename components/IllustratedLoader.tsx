interface IllustratedLoaderProps {
  message: string
}

export default function IllustratedLoader({ message }: IllustratedLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="relative w-24 h-24 mb-6">
        {/* Animated circle */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-[#2B6CB0] border-t-transparent" style={{ animation: 'spin 1s linear infinite' }}></div>
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-10 h-10 text-[#2B6CB0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
      
      <p className="text-[#1A202C] text-lg font-semibold mb-2">Processing</p>
      <p className="text-[#718096] text-sm text-center max-w-md">{message}</p>
      
      {/* Progress dots */}
      <div className="flex gap-2 mt-4">
        <div className="w-2 h-2 rounded-full bg-[#2B6CB0]" style={{ animation: 'bounce 0.5s ease-in-out infinite', animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-[#2B6CB0]" style={{ animation: 'bounce 0.5s ease-in-out infinite', animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-[#2B6CB0]" style={{ animation: 'bounce 0.5s ease-in-out infinite', animationDelay: '300ms' }}></div>
      </div>
    </div>
  )
}
