import {Clock} from "lucide-react";
import {WeeklyProgress} from "@/types";

type Props = {
  totalHours: number;
  weeklyProgress: WeeklyProgress[];
};

export default function StatisticsTab({totalHours, weeklyProgress}: Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-base-content">
        Learning Statistics
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70">Total Hours</p>
                <p className="text-2xl font-bold">{totalHours}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl md:col-span-2 lg:col-span-3">
          <div className="card-body">
            <h3 className="card-title">Weekly Progress</h3>
            <div className="space-y-4">
              {weeklyProgress.map((day) => (
                <div
                  key={day.day}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">{day.day}</span>
                  <div className="flex items-center gap-2">
                    <progress
                      className="progress progress-primary w-24"
                      value={day.progress}
                      max="100"
                    ></progress>
                    <span className="text-sm text-base-content/70">
                      {day.hours}h
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
