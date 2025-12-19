import {Link} from "react-router-dom";

interface BatchLiveErrorProps {
  batchSlug?: string;
}

export default function BatchLiveError({batchSlug}: BatchLiveErrorProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-400 via-blue-300 to-purple-300 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md text-center">
        <div className="mb-6">
          <svg
            className="w-20 h-20 mx-auto text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Room Not Available
        </h2>
        <p className="text-gray-600 mb-8">
          The live session is not open or could not be found.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            to={`/batch/${batchSlug}/teach`}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Go back to discussion
          </Link>
          <button
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
