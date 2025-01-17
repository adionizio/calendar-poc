# TicketCalendar Component

## Overview

The `TicketCalendar` component is a versatile, interactive calendar widget designed for ticket selection and scheduling. It supports infinite scrolling, single or multiple day selection, and adapts to mobile and desktop layouts using `Sheet` and `Popover` respectively.

## Features

- **Infinite Scrolling**: Dynamically fetch additional months as the user scrolls.
- **Single/Multiple Day Selection**: Toggle between single and consecutive day selection.
- **Mobile & Desktop Support**:
  - Uses a `Sheet` layout for mobile devices.
  - Uses a `Popover` layout for desktop devices.
- **Customizable Calendar Days**: Each day displays custom data (e.g., price, closed status).
- **Lazy Loading**: Fetches data on demand to optimize performance.

## Props

### `Props`

| Name           | Type                  | Description                                     |
| -------------- | --------------------- | ----------------------------------------------- |
| `calendarData` | `PricesData`          | A mapping of dates to their respective details. |
| `onFetchNext`  | `() => Promise<void>` | Callback for fetching additional months.        |
| `loading`      | `boolean`             | Indicates if data is being loaded.              |

### `PricesData`

`PricesData` is a record type that maps string-formatted dates (e.g., `"2025-01-16"`) to `DayInfo` objects:

```typescript
type DayInfo = {
  price: number | null;
  closed: boolean;
  lowestPrice: boolean;
};
```

## Usage

### Basic Usage

```tsx
import TicketCalendar from "./TicketCalendar";

const MyComponent = () => {
  const [calendarData, setCalendarData] = useState<PricesData>({});
  const [loading, setLoading] = useState(false);

  const fetchMoreData = async () => {
    // Fetch data logic here
  };

  return (
    <TicketCalendar
      calendarData={calendarData}
      onFetchNext={fetchMoreData}
      loading={loading}
    />
  );
};
```

### Example Data Structure

```typescript
const sampleCalendarData: PricesData = {
  "2025-01-16": {
    price: 50,
    closed: false,
    lowestPrice: true,
  },
  "2025-01-17": {
    price: 60,
    closed: false,
    lowestPrice: false,
  },
};
```

## Key Components

### ScrollArea

Wraps the calendar content and enables infinite scrolling.

### Calendar

Renders the calendar interface, including navigation and day components.

### CustomDay

Customizes the rendering of individual days, including:

- Price display
- Closed or available status
- Highlighting the lowest price

### Header & Footer

- **`TicketCalendarHeader`**: Provides controls for toggling between single and multiple day selection.
- **`TicketCalendarFooter`**: Includes actions like applying the selection.

## Event Handling

### Infinite Scrolling

The `handleScroll` function monitors the `ScrollArea` and triggers the `onFetchNext` callback when the bottom is reached.

### Day Selection

The `handleSelect` function handles logic for:

- Single day selection.
- Consecutive day selection when in multiple-day mode.

## Adaptive Layout

- **Mobile**: The calendar is rendered inside a `Sheet`, which slides up from the bottom.
- **Desktop**: The calendar is displayed in a `Popover` that anchors to a trigger element.

## Dependencies

- `date-fns`: For date formatting and manipulation.
- Custom UI components: `ScrollArea`, `Sheet`, `Popover`, etc.

## Customization

To customize the calendar's behavior or appearance:

- **Day Rendering**: Modify the `CustomDay` component.
- **Calendar Layout**: Adjust the `renderCalendar` or `renderContainer` methods.
- **Styles**: Update the classes passed to the components (e.g., `className="overflow-y-auto max-h-[750px]"`).

## Commands to Run the Project

- `yarn dev`: Starts the development server.
- `yarn run-mock-server`: Runs the mock server for testing purposes.

## License

This component is provided under the MIT License.
