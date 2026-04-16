import { Shield, Lock, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter mb-4">
              Terms & <span className="text-transparent bg-gradient-to-r from-purple-400 to-red-500 bg-clip-text">Conditions</span>
            </h1>
            <p className="text-gray-400">Last updated: April 15, 2026</p>
          </div>

          {/* Content */}
          <div className="space-y-12 text-gray-300 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Shield className="w-6 h-6 text-purple-400" />
                1. Agreement to Terms
              </h2>
              <p>
                By accessing or using Ticketa, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not access our services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Lock className="w-6 h-6 text-purple-400" />
                2. User Accounts
              </h2>
              <p>
                When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the security of your account and your password (or Magic Link session).
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must be at least 18 years old to use Ticketa.</li>
                <li>You are responsible for all activities that occur under your account.</li>
                <li>We reserve the right to suspend accounts that violate our terms.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FileText className="w-6 h-6 text-purple-400" />
                3. Event Ticketing & Payments
              </h2>
              <p>
                Ticketa provides a platform for organizers to sell tickets and for buyers to purchase them. Payments are processed through third-party providers like PesaPal.
              </p>
              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-white">Refund Policy</h3>
                <p className="text-sm">
                  Refunds are handled by event organizers according to their specific policies. Ticketa is not responsible for refunding ticket costs unless the event is canceled and the organizer has authorized refunds.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">4. Ticket Security & QR Codes</h2>
              <p>
                Ticketa uses rotating QR codes to prevent fraud. You agree not to attempt to circumvent these security measures. Duplicating or screenshotting tickets for resale outside of Ticketa's official secondary marketplace is strictly prohibited.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">5. Limitation of Liability</h2>
              <p>
                Ticketa shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of the services.
              </p>
            </section>

            <div className="pt-12 border-t border-white/10">
              <p className="text-sm text-gray-500">
                If you have any questions about these Terms, please contact us at <a href="mailto:support@ticketa.app" className="text-purple-400 hover:underline">support@ticketa.app</a>.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
