import {adminServices} from "@/lib/services/admin.services";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {UserInfoProps} from "@/types";
import {useQuery} from "@tanstack/react-query";
import {SquarePen, Trash2} from "lucide-react";
import {useState} from "react";
import {Link} from "react-router-dom";

export default function UserList() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const {data, isLoading} = useQuery({
    queryKey: ["userList", page, size],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const response = await adminServices.getUserList(page, size, accessToken);
      return response.data;
    },
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-10">User Management</h2>
      {isLoading && <div className="loading"></div>}
      {!isLoading && (
        <div className="space-y-5">
          <div className="overflow-hidden rounded-box border border-base-content/5 bg-base-100">
            <table className="table table-zebra">
              <thead className="bg-slate-900 text-white tracking-wider">
                <tr>
                  <th>STT</th>
                  <th>Full name</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Image</th>
                  <th>User type</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {data?.content.map((user: UserInfoProps, index: number) => (
                  <tr key={user.id}>
                    <th>{index + 1}</th>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.username}</td>
                    <td>{user.userImage}</td>
                    <td>{user.userType}</td>
                    <td>
                      <Link
                        to={`/users/${user.id}`}
                        className="btn btn-circle btn-ghost"
                      >
                        <SquarePen size={20} className="text-green-600" />
                      </Link>
                    </td>
                    <td>
                      <button className="btn btn-circle btn-ghost">
                        <Trash2 size={20} className="text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center items-center space-x-4">
            <div className="join">
              {Array.from(
                {length: data?.pagination.totalPages || 0},
                (_, i) => i,
              ).map((pageIdx) => (
                <button
                  key={pageIdx}
                  className={`join-item btn ${
                    pageIdx === page ? "btn-active" : ""
                  }`}
                  onClick={() => setPage(pageIdx)}
                >
                  {pageIdx + 1}
                </button>
              ))}
            </div>
            <select
              className="select w-auto"
              defaultValue={"Page size"}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPage(0);
              }}
            >
              <option disabled>Page size</option>
              {[5, 10, 20, 50].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
