interface ErrorMessageProps {
  message: string
  onRetry: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex h-screen items-center justify-center bg-black bg-grid">
      <div className="text-center space-y-4">
        <div className="text-red-500 text-4xl">&#x26A0;</div>
        <p className="text-neutral-50 text-lg">Something went wrong</p>
        <p className="text-neutral-500 text-sm">{message}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-neutral-800 text-neutral-50 rounded border border-neutral-700 hover:bg-neutral-700 transition-all duration-150 active:scale-95"
        >
          Retry
        </button>
      </div>
    </div>
  )
}
