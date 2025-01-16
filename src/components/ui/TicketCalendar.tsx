import { addDays, format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "./scroll-area";
import { Calendar } from "./calendar";
import CustomDay from "./CustomDay";
import { DayProps } from "react-day-picker";
import { db } from "@/mocks/db";
import { TicketCalendarHeader } from "./TicketCalendarHeader";
import { TicketCalendarFooter } from "./TicketCalendarFooter";

type DayInfo = {
  price: number | null;
  closed: boolean;
  lowestPrice: boolean;
};

type Props = {
  calendarData: PricesData | undefined;
  onFetchNext: () => Promise<void>;
  loading: boolean;
};

export type PricesData = Record<string, DayInfo>;

const TicketCalendar = ({ calendarData, onFetchNext, loading }: Props) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [areMultipleDays, setAreMultipleDays] = useState<boolean>(false);
  const [numberOfMonths, setNumberOfMonths] = useState(2);
  const calendarContainerRef = useRef<HTMLDivElement | null>(null);
  const isMobile = window.innerWidth <= 768;
  console.log("calendarData", calendarData);

  if (!calendarData) {
    return;
  }

  const handleScroll = async () => {
    if (!calendarContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      calendarContainerRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 1 && !loading) {
      console.log("Reached the bottom of the calendar!");

      onFetchNext().then(() => {
        setNumberOfMonths(numberOfMonths + 1);
      });
    }
  };

  useEffect(() => {
    const calendarContainer = calendarContainerRef.current;
    if (!calendarContainer) return;

    calendarContainer.addEventListener("scroll", handleScroll);

    return () => {
      calendarContainer.removeEventListener("scroll", handleScroll);
    };
  }, [numberOfMonths, loading]);

  const handleSelect = (date: Date) => {
    // Check if multiple days are not allowed OR if two dates are already selected
    if (!areMultipleDays || selectedDates.length === 2) {
      // If either condition is true, reset the selection to the newly selected date
      setSelectedDates([date]);
    } else {
      // Multiple days are allowed, and fewer than two dates are currently selected
      const firstDate = selectedDates[0]; // Get the first selected date

      // Check if the selected date is the next consecutive day after the first selected date
      if (addDays(firstDate, 1).getTime() === date.getTime()) {
        // If it is consecutive, add the selected date to the array
        setSelectedDates([...selectedDates, date]);
      } else {
        // If it's not consecutive, reset the selection to the newly selected date
        setSelectedDates([date]);
      }
    }
  };

  const handleDaysOptionSelect = (option: boolean) => {
    setAreMultipleDays(option);
    setSelectedDates([]);
  };

  const handleApply = () => {
    console.log("Applied selection:", { selectedDates, areMultipleDays });
  };

  const renderCalendar = () => {
    const calendarContent = (
      <Calendar
        mode="single"
        disableNavigation={isMobile}
        weekStartsOn={1}
        numberOfMonths={numberOfMonths}
        onMonthChange={onFetchNext}
        onNextClick={() => console.log("here")}
        formatters={{
          formatWeekdayName: (date) => format(date, "eee"),
        }}
        components={{
          Day: (props: DayProps) => (
            <CustomDay
              {...props}
              dateData={calendarData}
              onSelect={handleSelect}
              selectedDates={selectedDates}
            />
          ),
        }}
      />
    );

    if (isMobile) {
      return (
        <ScrollArea
          ref={calendarContainerRef}
          className="overflow-y-auto max-h-[750px]"
        >
          {calendarContent}
          {loading && (
            <div className="text-center py-4 text-gray-500">
              Loading more dates...
            </div>
          )}
        </ScrollArea>
      );
    }

    return calendarContent;
  };

  return (
    <div className="w-full">
      <TicketCalendarHeader
        areMultipleDays={areMultipleDays}
        onDaysOptionSelect={handleDaysOptionSelect}
      />
      {renderCalendar()}
      <TicketCalendarFooter handleApply={handleApply} />
    </div>
  );
};

export default TicketCalendar;
