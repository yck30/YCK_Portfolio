import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { Projects } from '@/components/Projects'
import { KitaBuildPipeline } from '@/components/KitaBuildPipeline'
import { Journey } from '@/components/Journey'
import { BlogPreview } from '@/components/BlogPreview'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <main className="page-shell">
      <Hero />
      <About />
      <Projects />
      <KitaBuildPipeline />
      <Journey />
      <BlogPreview />
      <Footer />
    </main>
  )
}
