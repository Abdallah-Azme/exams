# Bluebook Exam App

A frontend-only clone of the College Board Bluebook digital testing platform built with Next.js, TypeScript, and Tailwind CSS v4.

## Features

- 🔐 Student authentication
- 📝 Practice exam interface (SAT/PSAT)
- ⏱️ Timer and question navigation
- 🛠️ Exam tools: calculator, highlighter, notes, option eliminator
- 📊 Results and review page
- 💾 Auto-save functionality
- ⌨️ Keyboard shortcuts for accessibility

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running (see Backend Setup below)

### Installation

1. Clone the repository
2. Install dependencies:

\`\`\`bash
npm install
\`\`\`

3. Create a `.env.local` file:

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
\`\`\`

4. Run the development server:

\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000)

## Keyboard Shortcuts

- **C** - Open calculator
- **R** - Open reference sheet
- **N** - Open notes drawer
- **M** - Mark/unmark question for review
- **Arrow Left** - Previous question
- **Arrow Right** - Next question

## Backend Setup

This is a **frontend-only** application. All data comes from external API endpoints.

### Required API Endpoints

- `POST /auth/login` - User authentication
- `GET /exams` - List available exams
- `GET /exam/:examId` - Get exam details
- `GET /exam/:examId/questions` - Get exam questions
- `POST /exam/:examId/save` - Auto-save answers
- `POST /exam/:examId/submit` - Submit exam
- `GET /exam/:examId/review/:sessionId` - Get results

### Mock API (for local demo)

If you don't have a backend, you can use mock data by modifying `lib/api.ts` to return static JSON responses.

Example mock data structure:

\`\`\`typescript
// Mock exams
const mockExams: Exam[] = [
  {
    id: "sat-practice-1",
    title: "SAT Practice Test 1",
    type: "SAT",
    sections: 4,
    duration: 180,
    status: "available"
  }
]

// Mock questions
const mockQuestions: Question[] = [
  {
    id: "q-1",
    sectionId: "reading",
    number: 1,
    type: "multiple-choice",
    passage: "Sample passage text...",
    question: "What is the main idea?",
    options: ["Option A", "Option B", "Option C", "Option D"]
  }
]
\`\`\`

## Project Structure

\`\`\`
app/
├── page.tsx                    # Dashboard
├── login/page.tsx              # Login page
├── error/page.tsx              # Error page
├── exam/
│   ├── [examId]/setup/         # Exam setup page
│   ├── [examId]/take/          # Exam taking interface
│   └── [examId]/review/        # Results and review page
components/
├── ui/                         # shadcn/ui components
└── exam/                       # Exam-specific components
    ├── timer-display.tsx       # Timer with hide/show
    ├── question-navigator.tsx  # Sidebar navigation
    ├── question-display.tsx    # Question and options
    ├── calculator-modal.tsx    # Calculator tool
    ├── reference-sheet-modal.tsx # Math formulas
    ├── notes-drawer.tsx        # Notes tool
    ├── score-summary-card.tsx  # Score display
    └── answer-review-table.tsx # Answer review
lib/
├── api.ts                      # API client with all endpoints
├── store.ts                    # Zustand state management
└── utils.ts                    # Utility functions
\`\`\`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | Yes |

## Features in Detail

### Exam Taking Interface

- Clean, distraction-free design
- Question navigator sidebar with visual indicators
- Answer selection with option elimination
- Flag questions for review
- Auto-save every 30 seconds
- Timer with hide/show toggle
- Warning when time is low (< 5 minutes)

### Exam Tools

- **Calculator**: Full-featured calculator with basic operations
- **Reference Sheet**: Math formulas and constants organized by category
- **Notes**: Per-question notes that persist through the exam
- **Option Eliminator**: Cross out incorrect answer choices

### Review Page

- Score summary with accuracy percentage
- Correct/incorrect breakdown
- Expandable question review with explanations
- Color-coded correct/incorrect indicators

## Design System

The app uses a calm, professional color scheme optimized for focused exam taking:

- **Primary**: Deep blue (trustworthy, educational)
- **Accent**: Soft teal (success states)
- **Warning**: Amber (time warnings)
- **Neutrals**: White, light grays, dark gray text

Typography uses the Geist Sans font family for excellent readability.

## Future Enhancements

- Offline mode with localStorage sync
- Multiple exam types (GRE, GMAT, etc.)
- Dark mode support
- Text highlighting tool
- Zoom controls and line reader
- Proctor dashboard view
- Analytics and performance tracking

## License

MIT
