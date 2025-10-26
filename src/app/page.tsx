 
import ExamHeader from "../modules/exams/ui/exam-header"
import ExamSection from "../modules/exams/ui/exam-section"
import Header from "../modules/shared/ui/header"



export default function DashboardPage() {
  
  return (
    <div className="min-h-screen bg-background">
      <Header/>
      {/* Main content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        <section>
          <ExamHeader/>
          <ExamSection/>
        </section>
      </main>
    </div>
  )
}
