type ErrorDisplayProps = {
  error: string | null;
  clearError: () => void;
};

export default function ErrorDisplay({error, clearError}: ErrorDisplayProps) {
  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mx-6 mt-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800 text-sm mt-2"
          >
            Dismiss
          </button>
        </div>
      )}
    </>
  );
}
