import {InstructorService} from "@/lib/services/instructor.services";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {useEffect, useState} from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from "recharts";
import {BookOpen, DollarSign, CalendarCheck} from "lucide-react";
import OverviewCard from "@/components/OverviewCard";
import PerformanceTable, {
  IPagination,
  IPerformanceItem,
} from "@/components/PerformanceTable";
import CardSkeleton from "@/components/CardSkeleton";
import {toast} from "react-toastify";

interface IOverviewStats {
  totalCoursePublished: number;
  totalBatchPublished: number;
  courseRevenue: number;
  batchRevenue: number;
}

interface IRevenueDataPoint {
  label: string;
  revenue: number;
}

type Period = "WEEK" | "MONTH" | "YEAR" | "ALL_TIME";
type RevenueType = "COURSE" | "BATCH";

export default function InstructorStatistic() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [overview, setOverview] = useState<IOverviewStats | null>(null);
  const [revenueData, setRevenueData] = useState<IRevenueDataPoint[]>([]);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);
  const [period, setPeriod] = useState<Period>("MONTH");
  const [revenueType, setRevenueType] = useState<RevenueType>("COURSE");

  const [coursePerformance, setCoursePerformance] = useState<{
    content: IPerformanceItem[];
    pagination: IPagination | null;
  }>({content: [], pagination: null});
  const [batchPerformance, setBatchPerformance] = useState<{
    content: IPerformanceItem[];
    pagination: IPagination | null;
  }>({content: [], pagination: null});
  const [coursePage, setCoursePage] = useState(0);
  const [batchPage, setBatchPage] = useState(0);
  const [loadingPerformances, setLoadingPerformances] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getAccessToken();
      setAccessToken(token);
    };
    fetchToken();
  }, []);

  useEffect(() => {
    const fetchOverview = async () => {
      if (!accessToken) return;

      setLoadingOverview(true);
      try {
        const response =
          await InstructorService.getStatisticsOverview(accessToken);
        setOverview(response.data);
      } catch {
        toast.error("Failed to fetch overview statistics");
      } finally {
        setLoadingOverview(false);
      }
    };
    fetchOverview();
  }, [accessToken]);

  useEffect(() => {
    const fetchRevenueData = async () => {
      if (!accessToken) return;

      setLoadingChart(true);
      try {
        const response = await InstructorService.getStatisticsRevenueOverTime(
          accessToken,
          {period, type: revenueType},
        );
        const dataPoints = response.data?.dataPoints;
        if (Array.isArray(dataPoints)) {
          const formattedData = dataPoints.map((point) => ({
            label:
              period === "WEEK" || period === "MONTH"
                ? point.date.split("-").slice(1).join("/")
                : point.date,
            revenue: point.revenue,
          }));
          setRevenueData(formattedData);
        } else {
          setRevenueData([]);
        }
      } catch {
        // handle error
      } finally {
        setLoadingChart(false);
      }
    };
    fetchRevenueData();
  }, [period, revenueType, accessToken]);

  useEffect(() => {
    const fetchPerformances = async () => {
      if (!accessToken) return;

      setLoadingPerformances(true);
      try {
        const courseRes =
          await InstructorService.getStatisticsCoursePerformance(
            accessToken,
            coursePage,
            5,
          );
        setCoursePerformance({
          content: courseRes.data.content,
          pagination: courseRes.data.pagination,
        });

        // Fetch batch performance data
        const batchRes = await InstructorService.getStatisticsBatchPerformance(
          accessToken,
          batchPage,
          5,
        );
        setBatchPerformance({
          content: batchRes.data.content,
          pagination: batchRes.data.pagination,
        });
      } catch {
        // handle error
      } finally {
        setLoadingPerformances(false);
      }
    };
    fetchPerformances();
  }, [coursePage, batchPage, accessToken]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 border-b-2 border-indigo-500 pb-2 inline-block">
          Instructor Dashboard
        </h1>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {loadingOverview ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <OverviewCard
              title="Total Courses"
              value={overview?.totalCoursePublished ?? 0}
              icon={BookOpen}
              color="bg-indigo-600"
            />
            <OverviewCard
              title="Total Batches"
              value={overview?.totalBatchPublished ?? 0}
              icon={CalendarCheck}
              color="bg-green-600"
            />
            <OverviewCard
              title="Course Revenue"
              value={overview ? formatCurrency(overview.courseRevenue) : "..."}
              icon={DollarSign}
              color="bg-pink-600"
            />
            <OverviewCard
              title="Batch Revenue"
              value={overview ? formatCurrency(overview.batchRevenue) : "..."}
              icon={DollarSign}
              color="bg-cyan-600"
            />
          </>
        )}
      </section>

      <hr className="my-10 border-gray-200" />

      <section className="bg-white p-6 md:p-8 rounded-xl shadow-xl border border-gray-100 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Revenue Chart</h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <label className="text-gray-700 font-medium">Data Range:</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
          >
            <option value="WEEK">Last 7 Days</option>
            <option value="MONTH">Last 30 Days</option>
            <option value="YEAR">Last 12 Months</option>
            <option value="ALL_TIME">All Time</option>
          </select>

          <label className="text-gray-700 font-medium sm:ml-4">Type:</label>
          <select
            value={revenueType}
            onChange={(e) => setRevenueType(e.target.value as RevenueType)}
            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
          >
            <option value="COURSE">Course Revenue</option>
            <option value="BATCH">Batch Revenue</option>
          </select>
        </div>

        {loadingChart ? (
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center animate-pulse">
            <span className="text-indigo-500">Loading revenue chart...</span>
          </div>
        ) : revenueData.length === 0 ? (
          <div className="h-96 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
            No revenue data available for the selected period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={450}>
            {period === "WEEK" ? (
              <BarChart
                data={revenueData}
                margin={{top: 20, right: 30, left: 20, bottom: 5}}
              >
                <CartesianGrid strokeDasharray="4 4" stroke="#e0e0e0" />
                <XAxis dataKey="label" stroke="#6b7280" />
                <YAxis
                  stroke="#6b7280"
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("vi-VN").format(value as number)
                  }
                />
                <Tooltip
                  cursor={{fill: "#f1f5f9"}}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                  labelStyle={{fontWeight: "bold", color: "#333"}}
                  formatter={(value) => formatCurrency(value as number)}
                />
                <Legend wrapperStyle={{paddingTop: "10px"}} />
                <Bar
                  dataKey="revenue"
                  fill="#4F46E5" // Indigo color
                  name={`${revenueType} Revenue`}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            ) : (
              <LineChart
                data={revenueData}
                margin={{top: 20, right: 30, left: 20, bottom: 5}}
              >
                <CartesianGrid strokeDasharray="4 4" stroke="#e0e0e0" />
                <XAxis dataKey="label" stroke="#6b7280" />
                <YAxis
                  stroke="#6b7280"
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("vi-VN").format(value as number)
                  }
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                  labelStyle={{fontWeight: "bold", color: "#333"}}
                  formatter={(value) => formatCurrency(value as number)}
                />
                <Legend wrapperStyle={{paddingTop: "10px"}} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={3}
                  activeDot={{r: 8}}
                  name={`${revenueType} Revenue`}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        )}
      </section>

      <hr className="my-10 border-gray-200" />

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Performance Rankings
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <PerformanceTable
            title="Top Course Performance"
            data={coursePerformance.content}
            pagination={coursePerformance.pagination}
            onPageChange={setCoursePage}
            loading={loadingPerformances}
            formatCurrency={formatCurrency}
            currentPage={coursePage}
          />
          <PerformanceTable
            title="Top Batch Performance"
            data={batchPerformance.content}
            pagination={batchPerformance.pagination}
            onPageChange={setBatchPage}
            loading={loadingPerformances}
            formatCurrency={formatCurrency}
            currentPage={batchPage}
          />
        </div>
      </section>
    </div>
  );
}
