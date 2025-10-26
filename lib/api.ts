type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  body?: unknown
  headers?: Record<string, string>
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }
  }

  getToken(): string | null {
    if (this.token) return this.token
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
    return this.token
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body, headers = {} } = options

    const token = this.getToken()
    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    }

    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`
    }

    const config: RequestInit = {
      method,
      headers: requestHeaders,
    }

    if (body) {
      config.body = JSON.stringify(body)
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, config)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Request failed" }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const data = await this.request<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: { email, password },
    })
    this.setToken(data.token)
    return data
  }

  async logout() {
    this.clearToken()
  }

  // Exam endpoints
  async getExams() {
    return this.request<Exam[]>("/exams")
  }

  async getExam(examId: string) {
    return this.request<ExamDetail>(`/exam/${examId}`)
  }

  async getExamQuestions(examId: string) {
    return this.request<Question[]>(`/exam/${examId}/questions`)
  }

  async saveAnswer(examId: string, sessionId: string, questionId: string, answer: string) {
    return this.request(`/exam/${examId}/save`, {
      method: "POST",
      body: { sessionId, questionId, answer },
    })
  }

  async submitExam(examId: string, sessionId: string, answers: Record<string, string>) {
    return this.request<SubmissionResult>(`/exam/${examId}/submit`, {
      method: "POST",
      body: { sessionId, answers },
    })
  }

  async getReview(examId: string, sessionId: string) {
    return this.request<ReviewData>(`/exam/${examId}/review/${sessionId}`)
  }
}

export const api = new ApiClient()

// Type definitions
export type User = {
  id: number
  name: string
  email: string
  verification_account: string | null
  mobile: string
  is_active: number
  address: string | null
  subject: string | null
  created_at: string
  updated_at: string
}

export type Exam = {
  id: string
  title: string
  type: "SAT" | "PSAT"
  sections: number
  duration: number
  status: "available" | "in-progress" | "completed"
  sessionId?: string
}

export type ExamDetail = Exam & {
  description: string
  allowedTools: string[]
  instructions: string
}

export type Question = {
  id: string
  sectionId: string
  number: number
  type: "multiple-choice" | "grid-in"
  passage?: string
  question: string
  options?: string[]
  image?: string
}

export type SubmissionResult = {
  sessionId: string
  score: number
  totalQuestions: number
  correctAnswers: number
}

export type ReviewData = {
  score: number
  totalQuestions: number
  correctAnswers: number
  sections: {
    name: string
    score: number
    questions: ReviewQuestion[]
  }[]
}

export type ReviewQuestion = {
  id: string
  number: number
  question: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  explanation: string
}
