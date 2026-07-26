import SeoHead from "@/components/SeoHead";
import Link from "next/link";

const faqs = [
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover) through our secure Stripe payment gateway. We also offer a WhatsApp order option for alternative payment arrangements.",
  },
  {
    q: "How long does shipping take?",
    a: "Domestic orders typically arrive within 5-10 business days. International orders may take 10-20 business days depending on customs processing. You will receive a tracking number once your order ships.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by destination and are calculated at checkout.",
  },
  {
    q: "What is your return policy?",
    a: "We accept returns within 30 days of delivery for items in their original condition. Refunds are processed within 5-10 business days after we receive the returned item. Limited-edition and custom items may be subject to different policies.",
  },
  {
    q: "How do I track my order?",
    a: "You can track your order by visiting our Track Order page and entering your order number. You will also receive email updates when your order status changes.",
  },
  {
    q: "Can I cancel or modify my order?",
    a: "Orders can be cancelled or modified within 24 hours of placement. Please contact us as soon as possible if you need to make changes.",
  },
  {
    q: "Are the figurines limited edition?",
    a: "Some of our figurines are limited edition and are marked as such on the product page. Limited-edition items are produced in restricted quantities and may sell out quickly.",
  },
  {
    q: "How do I care for my figurine?",
    a: "Keep your figurine in a cool, dry place away from direct sunlight. Dust gently with a soft, dry cloth. Avoid using water or cleaning solutions on painted surfaces.",
  },
  {
    q: "Do you offer wholesale or bulk discounts?",
    a: "Yes, we offer wholesale pricing for bulk orders. Please contact us through our Contact form with details about your request.",
  },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl py-8">
      <SeoHead title="FAQ | The Archivist" description="Frequently asked questions about ordering, shipping, returns, and more from The Archivist premium figurines store." />
      <Link href="/" className="mb-6 inline-block text-xs font-medium uppercase tracking-wider text-dark-text-secondary transition-colors hover:text-crimson">
        &larr; Back to Store
      </Link>
      <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl mb-8">
        Frequently Asked <span className="text-crimson">Questions</span>
      </h1>

      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="border-b border-dark-border/50 pb-5">
            <h2 className="font-heading text-base font-bold text-dark-text mb-2">{faq.q}</h2>
            <p className="text-sm leading-relaxed text-dark-text-secondary">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded border border-dark-border/50 p-6 text-center">
        <p className="text-sm text-dark-text-secondary mb-3">Still have questions? We are here to help.</p>
        <Link href="/contact" className="text-xs font-bold uppercase tracking-wider text-crimson hover:underline">
          Contact Us
        </Link>
      </div>
    </div>
  );
}
