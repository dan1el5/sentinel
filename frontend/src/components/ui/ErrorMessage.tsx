interface ErrorMessageProps {
  message: string
  onRetry: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-900">
      <div className="text-center space-y-4">
        <div className="text-red-500 text-4xl">&#x26A0;</div>
        <p className="text-slate-50 text-lg">Something went wrong</p>
        <p className="text-slate-400 text-sm">{message}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-slate-700 text-slate-50 rounded hover:bg-slate-600 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  )
}
