import Avatar from "@/components/Avatar";
import {adminServices} from "@/lib/services/admin.services";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {User} from "@/types";
import {useQuery} from "@tanstack/react-query";
import {Eye} from "lucide-react";
import {useState} from "react";
import {Link} from "react-router-dom";

export default function UserList() {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const {data, isLoading} = useQuery({
    queryKey: ["userList", page],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const response = await adminServices.getUserList(accessToken, page);
      setTotalPages(response.data.pagination.totalPages);
      return response.data;
    },
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          User Management
        </h2>
        <p className="text-sm text-gray-500">Manage and view all users</p>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      )}

      {!isLoading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-gray-600 font-semibold">#</th>
                  <th className="text-gray-600 font-semibold">Name</th>
                  <th className="text-gray-600 font-semibold">User Type</th>
                  <th className="text-gray-600 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.content.map((user: User, index: number) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <th className="text-gray-500">{page * 10 + index + 1}</th>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar
                          imageUrl={user.userImage}
                          name={user.fullName}
                        />
                        <span className="font-medium text-gray-700">
                          {user.fullName}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div
                        className={`badge ${user.userType === "SYSTEM_USER" ? "badge-primary" : "badge-neutral"}`}
                      >
                        {user.userType}
                      </div>
                    </td>
                    <td>
                      <Link
                        to={`/users/${user.id}`}
                        className="btn btn-ghost btn-sm btn-circle hover:bg-primary/10 hover:text-primary transition-colors"
                        title="View user details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center p-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Page {page + 1} of {totalPages}
            </p>
            <div className="join">
              <button
                className="btn join-item btn-sm"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <button className="btn join-item btn-sm btn-active">
                {page + 1}
              </button>
              <button
                className="btn join-item btn-sm"
                disabled={page === totalPages - 1}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
