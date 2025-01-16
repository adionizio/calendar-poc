"use client";

import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import TicketCalendar, { PricesData } from "@/components/ui/TicketCalendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { env } from "@/config/env";

const queryClient = new QueryClient();

type ResponseData = {
  data: PricesData;
  pagination: {
    page: number;
    totalPages: number;
  };
};

const Home = () => {
  const isMobile = window.innerWidth <= 768;
  const [calendarData, setCalendarData] = useState<PricesData>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const getDates = async (page: number) => {
    setLoading(true);

    if (page !== 1 && isMobile)
      await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      const response = await fetch(
        `${env.API_URL}/auth/calendarDay?page=${page}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      const json: ResponseData = await response.json();
      console.log(`Data for page ${page}:`, json);

      setCalendarData((prevData) => ({
        ...prevData,
        ...json.data,
      }));
      setTotalPages(json.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNextMonths = async () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      await getDates(nextPage);
      setCurrentPage(nextPage);
    } else {
      console.log("No more pages to fetch");
    }
  };

  useEffect(() => {
    getDates(1);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col gap-10 p-4">
        {isMobile ? (
          <Sheet>
            <SheetTrigger>Open Calendar</SheetTrigger>
            <SheetContent className="p-4" side="bottom">
              <SheetTitle />
              <TicketCalendar
                calendarData={calendarData}
                onFetchNext={fetchNextMonths}
                loading={loading}
              />
            </SheetContent>
          </Sheet>
        ) : (
          <Popover>
            <PopoverTrigger>Open Calendar</PopoverTrigger>
            <PopoverContent className="w-full">
              <TicketCalendar
                calendarData={calendarData}
                onFetchNext={fetchNextMonths}
                loading={loading}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>
    </QueryClientProvider>
  );
};

export default Home;
