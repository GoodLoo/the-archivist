import SeoHead from "@/components/SeoHead";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl py-8">
      <SeoHead title="Privacy Policy | The Archivist" description="Privacy policy for The Archivist premium figurines store." />
      <Link href="/" className="mb-6 inline-block text-xs font-medium uppercase tracking-wider text-dark-text-secondary transition-colors hover:text-crimson">
        &larr; Back to Store
      </Link>
      <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl mb-8">
        Privacy <span className="text-crimson">Policy</span>
      </h1>

      <div className="space-y-6 text-sm leading-relaxed text-dark-text-secondary">
        <p><strong className="text-dark-text">Last Updated:</strong> July 27, 2026</p>

        <section>
          <h2 className="font-heading text-lg font-bold text-dark-text mb-3">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, including your name, email address, phone number, shipping address, and payment details when you place an order. We also automatically collect certain information about your device and browsing behavior on our site.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-dark-text mb-3">2. How We Use Your Information</h2>
          <p>We use your information to process and fulfill orders, communicate with you about your orders, send marketing communications (with your consent), improve our store and user experience, and comply with legal obligations.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-dark-text mb-3">3. Payment Processing</h2>
          <p>All payment transactions are processed securely through Stripe. We do not store your full credit card details on our servers. Stripe handles all sensitive payment data in compliance with PCI DSS standards.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-dark-text mb-3">4. Data Sharing</h2>
          <p>We do not sell your personal information. We may share your data with trusted third-party service providers (payment processors, shipping carriers) solely for the purpose of fulfilling your orders.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-dark-text mb-3">5. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data at any time. You can manage your account settings or contact us directly to exercise these rights.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-dark-text mb-3">6. Cookies</h2>
          <p>We use essential cookies for authentication and cart functionality. Analytics cookies may be used to help us understand how visitors interact with our store.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-dark-text mb-3">7. Contact</h2>
          <p>If you have any questions about this Privacy Policy, please contact us through our Contact page or email us at privacy@thearchivist.com.</p>
        </section>
      </div>
    </div>
  );
}
