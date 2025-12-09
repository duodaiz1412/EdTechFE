import {useState} from "react";
import {useQuery} from "@tanstack/react-query";

import {Batch} from "@/types";
// import {useAppSelector} from "@/redux/hooks";
import {publicServices} from "@/lib/services/public.services";

import {BatchSkeleton} from "./BatchSkeleton";
import BatchItem from "./BatchItem";
import notFoundImg from "@/assets/not_found.svg";

export default function BatchList() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  // const userData = useAppSelector((state) => state.user.data);

  const {isLoading} = useQuery({
    queryKey: ["batches"],
    queryFn: async () => {
      const response = await publicServices.getBatches();
      setBatches(response.content);
      return response;
    },
  });

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const searchedCourses = await publicServices.getBatches(search);
      setBatches(searchedCourses.content);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = async () => {
    setIsSearching(true);
    try {
      const allCourses = await publicServices.getBatches();
      setBatches(allCourses.content);
      setSearch("");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-10">
      {/* Search */}
      <div className="flex justify-between items-center">
        {/* Labels/Categories */}
        <div></div>
        {/* Search bar */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search for batches"
            className="input w-96 rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="btn bg-slate-900 text-white rounded-lg"
            onClick={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? (
              <>
                <span className="loading loading-spinner loading-sm mr-2"></span>
                Searching...
              </>
            ) : (
              "Search"
            )}
          </button>
          <button
            className="btn rounded-lg"
            onClick={handleClear}
            disabled={isSearching}
          >
            Clear
          </button>
        </div>
      </div>
      {/* List of courses */}
      {isLoading && <BatchSkeleton count={6} />}
      {!isLoading && batches.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {batches?.map((batch: Batch) => {
            return <BatchItem key={batch.id} batch={batch} />;
          })}
        </div>
      )}
      {!isLoading && batches.length === 0 && (
        <div className="w-full flex justify-center">
          <img src={notFoundImg} alt="Not Found" className="w-1/2" />
        </div>
      )}
    </div>
  );
}
