import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-red-500 bg-clip-text text-transparent">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-gray-400 max-w-md mb-8">
          The page you are looking for doesn't exist or has been moved to a new destination.
        </p>
        <Link 
          href="/" 
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-red-500 text-white font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
        >
          Return Home
        </Link>
      </div>
      <Footer />
    </main>
  )
}
