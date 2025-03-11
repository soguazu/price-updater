# Pricing Calendar

A Next.js application featuring a dynamic pricing calendar that allows users to manage and update property rates for single dates or date ranges.

## Features

- Single date price updates
- Date range price updates
- Real-time pricing summary
- Responsive design
- Toast notifications for success/error states
- Modern UI with animations

## Prerequisites

- Node.js (v18 or later)
- pnpm (v8 or later)

## Installation

1. Clone the repository:

```bash
git clone <your-repository-url>
cd pricing-calendar
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
NEXT_PUBLIC_API_BASE_URL=<your-api-base-url>
NEXT_PUBLIC_PROPERTY_ID=<your-property-id>
```

## Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build

To create a production build:

```bash
pnpm build
```

To start the production server:

```bash
pnpm start
```

## Project Structure

- `/components` - React components including the main pricing calendar
- `/lib` - Utility functions and API calls
- `/hooks` - Custom React hooks
- `/public` - Static assets

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Shadcn UI
- date-fns
- React Toastify

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
