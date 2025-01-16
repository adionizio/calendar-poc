import { http, HttpResponse } from "msw";
import { env } from "@/config/env";
import { db } from "../db";
import { PricesData } from "@/components/ui/TicketCalendar";
import {
  addMonths,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  startOfDay,
  subDays,
} from "date-fns";

export const handlers = [
  http.get(`${env.API_URL}/auth/calendarDay`, async (req) => {
    try {
      console.log("here", req);

      const requestUrl = new URL(req.request.url);
      const page = Number(requestUrl.searchParams.get("page") || "1");

      // Calculate start and end dates based on the page
      const today = new Date();
      console.log("here", startOfMonth(today));
      const startDate =
        page === 1
          ? startOfMonth(today) // First page starts with the current month
          : startOfMonth(addMonths(today, (page - 1) * 2));
      const endDate = endOfMonth(addMonths(startDate, 1)); // Covers two months

      console.log(`Fetching dates between: ${startDate} and ${endDate}`);

      // Fetch all data and filter by the calculated date range
      const rawData = db.calendarDay.getAll();

      const filteredData = rawData.filter((day) => {
        const dayDate = startOfDay(new Date(day.date));
        const isInInterval = isWithinInterval(dayDate, {
          start: startOfDay(subDays(startDate, 1)),
          end: startOfDay(subDays(endDate, 1)),
        });
        return isInInterval;
      });

      // Get all data
      //   const formattedData = rawData.reduce((acc: PricesData, day) => {
      //     acc[day.date] = {
      //       price: day.price,
      //       closed: day.closed,
      //       lowestPrice: day.lowestPrice,
      //     };
      //     return acc;
      //   }, {} as PricesData);

      // Format the filtered data into the PricesData structure
      const formattedData = filteredData.reduce((acc: PricesData, day) => {
        acc[day.date] = {
          price: day.price,
          closed: day.closed,
          lowestPrice: day.lowestPrice,
        };
        return acc;
      }, {} as PricesData);

      // Calculate total pages for pagination metadata
      const totalMonths = Math.ceil(rawData.length / 30); // Approximate total months
      const totalPages = Math.ceil(totalMonths / 2); // Each page contains 2 months

      return HttpResponse.json({
        data: formattedData,
        pagination: {
          page,
          totalPages,
        },
      });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || "Server Error" },
        { status: 500 }
      );
    }
  }),
];
