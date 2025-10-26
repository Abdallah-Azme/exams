import { create } from "zustand"
import type { User } from "./api"

type ExamSession = {
  examId: string
  sessionId: string
  answers: Record<string, string>
  flags: Set<string>
  highlights: Record<string, string[]>
  notes: Record<string, string>
  currentQuestionIndex: number
  startTime: number
  timeRemaining: number
}

type Store = {
  user: User | null
  setUser: (user: User | null) => void

  examSession: ExamSession | null
  initSession: (examId: string, sessionId: string, duration: number) => void
  setAnswer: (questionId: string, answer: string) => void
  toggleFlag: (questionId: string) => void
  addHighlight: (questionId: string, text: string) => void
  setNote: (questionId: string, note: string) => void
  setCurrentQuestion: (index: number) => void
  updateTimeRemaining: (time: number) => void
  clearSession: () => void
}

export const useStore = create<Store>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  examSession: null,
  initSession: (examId, sessionId, duration) =>
    set({
      examSession: {
        examId,
        sessionId,
        answers: {},
        flags: new Set(),
        highlights: {},
        notes: {},
        currentQuestionIndex: 0,
        startTime: Date.now(),
        timeRemaining: duration * 60,
      },
    }),
  setAnswer: (questionId, answer) =>
    set((state) => {
      if (!state.examSession) return state
      return {
        examSession: {
          ...state.examSession,
          answers: { ...state.examSession.answers, [questionId]: answer },
        },
      }
    }),
  toggleFlag: (questionId) =>
    set((state) => {
      if (!state.examSession) return state
      const flags = new Set(state.examSession.flags)
      if (flags.has(questionId)) {
        flags.delete(questionId)
      } else {
        flags.add(questionId)
      }
      return {
        examSession: { ...state.examSession, flags },
      }
    }),
  addHighlight: (questionId, text) =>
    set((state) => {
      if (!state.examSession) return state
      const highlights = { ...state.examSession.highlights }
      if (!highlights[questionId]) highlights[questionId] = []
      highlights[questionId].push(text)
      return {
        examSession: { ...state.examSession, highlights },
      }
    }),
  setNote: (questionId, note) =>
    set((state) => {
      if (!state.examSession) return state
      return {
        examSession: {
          ...state.examSession,
          notes: { ...state.examSession.notes, [questionId]: note },
        },
      }
    }),
  setCurrentQuestion: (index) =>
    set((state) => {
      if (!state.examSession) return state
      return {
        examSession: { ...state.examSession, currentQuestionIndex: index },
      }
    }),
  updateTimeRemaining: (time) =>
    set((state) => {
      if (!state.examSession) return state
      return {
        examSession: { ...state.examSession, timeRemaining: time },
      }
    }),
  clearSession: () => set({ examSession: null }),
}))
