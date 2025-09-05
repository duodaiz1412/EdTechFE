import { Link } from "react-router-dom";

export default function About(): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-4">
      <div className="text-4xl font-bold text-center">About</div>
      <div className="text-2xl text-center">This is about page</div>
      <Link
        to="/"
        className="btn btn-primary bg-gray-600 hover:bg-gray-700 text-white px-6"
      >
        Go back
      </Link>
    </div>
  );
}
