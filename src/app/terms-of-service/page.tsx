import SeoHead from "@/components/SeoHead";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-3xl py-8">
      <SeoHead title="Terms of Service | The Archivist" description="Terms of service for The Archivist premium figurines store." />
      <Link href="/" className="mb-6 inline-block text-xs font-medium uppercase tracking-wider text-dark-text-secondary transition-colors hover:text-crimson">
        &larr; Back to Store
      </Link>
      <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl mb-8">
        Terms of <span className="text-crimson">Service</span>
      </h1>

      <div className="space-y-6 text-sm leading-relaxed text-dark-text-secondary">
        <p><strong className="text-dark-text">Last Updated:</strong> July 27, 2026</p>

        <section>
          <h2 className="font-heading text-lg font-bold text-dark-text mb-3">1. General</h2>
          <p>By placing an order on The Archivist website, you agree to these Terms of Service. We reserve the right to update these terms at any time. Continued use of the site after changes constitutes acceptance of the new terms.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-dark-text mb-3">2. Products & Pricing</h2>
          <p>All prices are listed in USD. We strive for accuracy but reserve the right to correct pricing errors. Product images are for illustration purposes; actual products may vary slightly. We reserve the right to limit quantities or refuse orders at our discretion.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-dark-text mb-3">3. Orders & Payment</h2>
          <p>Orders are confirmed once payment is successfully processed. We accept payments via credit/debit cards and other methods offered through Stripe. Your order may be cancelled if payment is declined or fraud is suspected.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-dark-text mb-3">4. Shipping & Delivery</h2>
          <p>Shipping costs and estimated delivery times are displayed at checkout. We are not responsible for delays caused by carriers or customs. Risk of loss passes to you upon delivery to the carrier.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-dark-text mb-3">5. Returns & Refunds</h2>
          <p>We accept returns within 30 days of delivery for items in their original condition. Refunds are processed to the original payment method within 5-10 business days after we receive the returned item. Custom or limited-edition items may be subject to different return policies.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-dark-text mb-3">6. Intellectual Property</h2>
          <p>All content on this website, including text, images, logos, and designs, is the property of The Archivist and is protected by applicable copyright and trademark laws. Unauthorized use is prohibited.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-dark-text mb-3">7. Limitation of Liability</h2>
          <p>The Archivist shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website, to the maximum extent permitted by law.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-dark-text mb-3">8. Contact</h2>
          <p>For questions regarding these terms, please contact us at legal@thearchivist.com.</p>
        </section>
      </div>
    </div>
  );
}
