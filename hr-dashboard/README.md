# HR Data Dashboard

A modern, interactive dashboard for viewing and querying HR data.

## Features

- **Data Visualization**: Key statistics at a glance (Total Employees, Departments, Areas).
- **Interactive Table**:
  - **Sorting**: Click on column headers to sort.
  - **Filtering**: Search across all columns using the global search bar.
  - **Pagination**: Navigate through efficient paginated data.
  - **Column Management**: Toggle visibility of columns to focus on what matters.
  - **Dynamic Columns**: Automatically adapts to new columns in the JSON data.
- **Modern UI**: Built with Tailwind CSS, Framer Motion, and Lucide Icons for a premium feel.

## Tech Stack

- **Framework**: React + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Headless UI / Lucide React
- **Table Logic**: TanStack Table v8
- **Animations**: Framer Motion

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Start the development server**:
    ```bash
    npm run dev
    ```

3.  **Build for production**:
    ```bash
    npm run build
    ```

## Project Structure

- `src/App.tsx`: Main application logic and UI.
- `src/hrdata.json`: The data source.
- `src/lib/utils.ts`: Utility functions.
