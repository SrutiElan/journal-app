import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight mb-6">For The Plot</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Celebrate your main character energy. Because everything is for the plot, right?
          </p>
          <Link href="/journal">
            <Button size="lg" className="gap-2">
              Start Journaling <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">Your story. Your data. Your journey.</footer>
    </div>
  )
}
