import {Link} from "react-router-dom";

export default function Logo() {
  return (
    <Link
      to="/"
      className="text-blue-600 text-2xl font-bold cursor-pointer hover:opacity-80"
    >
      Edtech
    </Link>
  );
}
