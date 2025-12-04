# Next.js Price Range Slider

A custom dual-handle range slider component built with Next.js 16, React 19, and TypeScript for the MANGO frontend technical test.

## 🎯 Project Overview

This project implements a custom `<Range />` component with two operating modes:
- **Exercise 1**: Normal range with continuous values (min-max)
- **Exercise 2**: Fixed range with predefined discrete price points

## ✨ Features

- ✅ Custom dual-handle range slider (not HTML5 input)
- ✅ Two operating modes (normal & fixed values)
- ✅ Draggable handles with hover/drag states
- ✅ Editable labels (normal mode)
- ✅ Server-side data fetching with Next.js App Router
- ✅ Full TypeScript support
- ✅ Comprehensive test coverage (54 tests: 43 unit + 11 E2E)
- ✅ Responsive design (mobile & desktop)
- ✅ Accessibility (ARIA labels, keyboard support)
- ✅ Zero CLS (Cumulative Layout Shift)
- ✅ Touch device support

## 🌐 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ installed (required)
- npm 10+ package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/kevinbenach/nextjs-price-sliders.git
cd nextjs-price-sliders

# Install dependencies
npm install
```

### Development

```bash
# Start development server on port 8080
npm run dev
```

The application will be available at **http://localhost:8080**

### Build

```bash
# Create production build
npm run build

# Run production server
npm run start
```

### Testing

**Unit Tests (Vitest + Testing Library):**
```bash
npm test                    # Run all unit tests once
npm run test:ui             # Interactive UI for debugging
npm run test:coverage       # Generate coverage report (requires @vitest/coverage-v8)
```

**E2E Tests (Playwright):**
```bash
# First time setup - install browsers
npx playwright install chromium

# Run tests
npm run test:e2e            # Run all E2E tests (headless)
npm run test:e2e:ui         # Visual test runner with UI
npm run test:e2e:headed     # Run with visible browser
```

**All Tests:**
```bash
npm run test:all            # Run unit + E2E tests
npm run ci                  # Full CI pipeline (lint + type + test + build + e2e)
```

## 📁 Project Structure

```
nextjs-price-sliders/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API Routes (mocked services)
│   │   │   ├── range/            # Normal range endpoint
│   │   │   └── fixed-range/      # Fixed range endpoint
│   │   ├── exercise1/            # Normal range page
│   │   ├── exercise2/            # Fixed range page
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page
│   │   └── globals.css           # Global styles
│   ├── components/               # React components
│   │   ├── Range/                # Main Range component
│   │   ├── RangeSkeleton/        # Loading skeleton
│   │   └── Navigation/           # Navigation component
│   └── hooks/                    # Custom React hooks
│       └── useDrag.ts            # Drag interaction logic
├── e2e/                          # E2E tests (Playwright)
│   ├── navigation.spec.ts        # Navigation flow tests
│   ├── exercise1.spec.ts         # Exercise 1 E2E tests
│   └── exercise2.spec.ts         # Exercise 2 E2E tests
├── package.json
├── tsconfig.json
├── vitest.config.ts              # Unit test config
├── playwright.config.ts          # E2E test config
└── README.md
```

## 🎮 Usage

### Exercise 1: Normal Range

Visit **http://localhost:8080/exercise1**

- Drag handles to select range
- Click labels to edit values directly
- Values constrained between min (1) and max (100)

### Exercise 2: Fixed Values Range

Visit **http://localhost:8080/exercise2**

- Drag handles to select from predefined values
- Values: €1.99, €5.99, €10.99, €30.99, €50.99, €70.99
- Labels are read-only (not editable)

## 🏗️ Architecture

### Server/Client Component Pattern

The project follows Next.js 13+ best practices:

**Server Components (Data Fetching):**
- Pages (`exercise1/page.tsx`, `exercise2/page.tsx`)
- Fetch data from API routes
- Pass data to client components as props

**Client Components (Interactivity):**
- `Range` component (`'use client'`)
- Handles user interactions (drag, click, edit)
- Manages internal state

### Component Design

**Range Component:**
- Single, unified component for both modes
- Uses discriminated union types for type safety
- Extracts drag logic to custom hook (`useDrag`)
- No duplicate rendering (values only in labels)

**Key Design Decisions:**
- ✅ One component (not split into multiple)
- ✅ No logic duplication
- ✅ Server-side data fetching
- ✅ Fixed CSS dimensions (zero CLS)
- ✅ Mobile-first with accessibility

## 🧪 Testing

### Unit Tests (Vitest + Testing Library)

```bash
# Coverage:
- Range component: 22 tests
- useDrag hook: 7 tests
- API routes: 14 tests
- Total: 43 unit tests

# Run unit tests:
npm test
```

### E2E Tests (Playwright)

```bash
# Coverage:
- Navigation flow: 2 tests
- Exercise 1 functionality: 4 tests
- Exercise 2 functionality: 5 tests
- Total: 11 E2E tests

# Run E2E tests:
npm run test:e2e

# Run with visual debugging:
npm run test:e2e:ui
```

**Complete Test Suite:** 54 tests total (43 unit + 11 E2E)

## 🌐 API Endpoints

### GET /api/range

Returns min/max values for normal range mode.

**Response:**
```json
{
  "min": 1,
  "max": 100
}
```

### GET /api/fixed-range

Returns array of predefined values for fixed range mode.

**Response:**
```json
{
  "rangeValues": [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]
}
```

**Note:** Both endpoints simulate 300ms network latency.

## 🎨 Technical Highlights

### Zero CLS (Cumulative Layout Shift)

- Fixed CSS dimensions (no responsive size changes)
- Skeleton loader matches exact component dimensions
- No layout shifts on page load or viewport resize

### Accessibility

- ARIA labels on all interactive elements
- Keyboard focus support
- Screen reader friendly
- Touch-friendly targets on mobile (44px)

### Performance

- Server-side data fetching with dynamic rendering (fresh data on each request)
- React Suspense for loading states
- Optimized re-renders
- Minimal bundle size

## 🔧 Technologies

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5.9
- **Testing**: Vitest 4.0 + Testing Library + Playwright
- **Styling**: CSS Modules
- **Port**: 8080

## 📝 Environment Variables

No environment variables required for local development. The app uses mocked API routes.

For deployment, optionally set:
- `NEXT_PUBLIC_API_URL` - Custom API URL
- `VERCEL_URL` - Automatically set on Vercel

## 🚢 Deployment

The project is ready for deployment on:
- **Vercel** (recommended)
- **Any Node.js hosting**

```bash
# Build for production
npm run build

# Start production server (port 8080)
npm run start
```

## 🎯 Project Highlights

**What makes this implementation stand out:**

### Code Quality
- ✅ Zero console.logs, no debugging code
- ✅ 100% TypeScript with strict mode
- ✅ Single unified component for both modes (DRY principle)
- ✅ Custom hooks for separation of concerns
- ✅ Zero ESLint errors, zero TypeScript errors

### Testing Excellence
- ✅ **54 tests total** (43 unit + 11 E2E)
- ✅ Comprehensive coverage of edge cases
- ✅ CI/CD pipeline with GitHub Actions
- ✅ Both unit (Vitest) and E2E (Playwright) testing

### UX & Performance
- ✅ **Zero CLS** (Cumulative Layout Shift)
- ✅ Full accessibility (ARIA, keyboard navigation)
- ✅ Touch-optimized for mobile
- ✅ Smooth animations and transitions
- ✅ Proper loading states with Suspense

### Architecture
- ✅ Modern Next.js 16 App Router patterns
- ✅ Server/Client component separation
- ✅ Type-safe with discriminated unions
- ✅ Production-ready error handling

---

## 📄 License

ISC

## 👤 Author

Kevin Benach

## 🔗 Links

- Repository: https://github.com/kevinbenach/nextjs-price-sliders
- Issues: https://github.com/kevinbenach/nextjs-price-sliders/issues

---

**Note**: This project was built as a technical test for MANGO, demonstrating modern React/Next.js patterns, TypeScript expertise, comprehensive testing practices, and attention to UX/accessibility details.
