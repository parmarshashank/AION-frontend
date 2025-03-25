import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1A1A1D]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#3B1C32] via-[#6A1E55] to-[#A64D79] bg-clip-text text-transparent mb-6">
            AION: Timeless Knowledge, Instantly Retrieved
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Your personal second brain, designed to store and organize knowledge effortlessly.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-3 bg-gradient-to-r from-[#3B1C32] via-[#6A1E55] to-[#A64D79] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
            <Link
              href="/demo"
              className="px-8 py-3 text-gray-300 border border-[#3B1C32] rounded-lg hover:border-[#6A1E55] transition-colors"
            >
              Watch Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#1A1A1D]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#3B1C32] p-8 rounded-xl shadow-lg border border-[#6A1E55]/20">
              <div className="w-12 h-12 bg-[#6A1E55] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#A64D79]">Smart Chronicles</h3>
              <p className="text-gray-300">
                Save important links, articles, and notes enriched with AI-powered summarization.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#3B1C32] p-8 rounded-xl shadow-lg border border-[#6A1E55]/20">
              <div className="w-12 h-12 bg-[#6A1E55] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#A64D79]">Intelligent Retrieval</h3>
              <p className="text-gray-300">
                Query your saved knowledge and get precise answers using advanced AI technology.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#3B1C32] p-8 rounded-xl shadow-lg border border-[#6A1E55]/20">
              <div className="w-12 h-12 bg-[#6A1E55] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#A64D79]">Seamless Collaboration</h3>
              <p className="text-gray-300">
                Create and share collections of knowledge with your team or community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#A64D79] mb-4">
            Ready to Organize Your Knowledge?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join AION today and experience the power of AI-driven knowledge management.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3 bg-gradient-to-r from-[#3B1C32] via-[#6A1E55] to-[#A64D79] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Start Free Trial
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
