export const TicketCalendarFooter = ({
  handleApply,
}: {
  handleApply: () => void;
}) => {
  return (
    <div className="flex flex-1 gap-6 items-center px-3 py-4 border-t border-t-[#D7D8DB] lg:border-t-0 lg:justify-between">
      <button className="px-6 py-2 text-[#144722] text-xs font-bold rounded-[2px] bg-green-50 border border-[#00A13A] hover:bg-green-100">
        Lowest prices
      </button>
      <button
        className="px-6 py-3 w-full lg:w-[200px] bg-[#E52330] font-bold text-white rounded-md hover:bg-red-600"
        onClick={handleApply}
      >
        Apply
      </button>
    </div>
  );
};
