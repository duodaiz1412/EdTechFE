import {useState, useMemo, useEffect} from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
} from "date-fns";
import {ChevronLeft, ChevronRight} from "lucide-react";
import Button from "@/components/Button";

interface CalendarProps {
  // Updated to accept string (e.g., "2024-12-31") or Date
  value?: Date | string;
  onChange?: (date: Date) => void;
  minDate?: Date;
}

const Calendar = ({value, onChange, minDate}: CalendarProps) => {
  // Safely convert the prop 'value' (which can be a string) into a valid Date object.
  const parsedSelectedDate = useMemo(() => {
    if (value) {
      try {
        let date;
        if (value instanceof Date) {
          date = value;
        } else if (typeof value === "string") {
          // For "YYYY-MM-DD" strings, append time to avoid timezone issues.
          // new Date("2024-11-24") can be interpreted as UTC, which might be the previous day in local time.
          date = new Date(`${value}T00:00:00`);
        }
        // Check if the resulting date is valid
        if (!isNaN(date.getTime())) {
          return date;
        }
      } catch {
        // Error
      }
    }
    return undefined;
  }, [value]);

  // Use state to track the month currently being viewed in the calendar.
  // Initialize the view to the selected date's month, or today's month if no date is selected.
  const [currentMonth, setCurrentMonth] = useState(
    parsedSelectedDate || new Date(),
  );

  useEffect(() => {
    // When the selected date changes, update the current month to reflect this change.
    if (parsedSelectedDate) {
      setCurrentMonth(parsedSelectedDate);
    }
  }, [parsedSelectedDate]);

  const handleDateClick = (day: Date) => {
    if (onChange) {
      // Pass the fully qualified Date object back to the parent
      onChange(day);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between py-2 px-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevMonth}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-lg font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextMonth}
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 text-center text-sm text-gray-500">
        {days.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({start: startDate, end: endDate});

    return (
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          // Use the parsed Date object for comparison
          const isSelected =
            parsedSelectedDate && isSameDay(day, parsedSelectedDate);
          const isCurrentDay = isToday(day);
          const isDisabled = minDate
            ? isBefore(day, minDate) && !isSameDay(day, minDate)
            : false;

          // Use template literals for cleaner class construction
          const cellClasses = `
            flex items-center justify-center h-10 w-10 rounded-full text-sm cursor-pointer transition-colors
            ${isDisabled ? "text-gray-300 cursor-not-allowed" : ""}
            ${!isDisabled && isCurrentMonth ? "text-gray-800" : ""}
            ${!isDisabled && !isCurrentMonth ? "text-gray-400" : ""}
            ${!isCurrentMonth || isDisabled ? "pointer-events-none" : ""}
            ${isCurrentDay && !isSelected ? "bg-gray-100" : ""}
            ${
              isSelected
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "hover:bg-gray-200"
            }
          `
            .replace(/\s+/g, " ")
            .trim();

          return (
            <div
              key={day.toString()}
              className="p-1 flex justify-center items-center"
            >
              <div className={cellClasses} onClick={() => handleDateClick(day)}>
                <span>{format(day, "d")}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white border rounded-lg shadow-md p-4 max-w-sm w-full">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
