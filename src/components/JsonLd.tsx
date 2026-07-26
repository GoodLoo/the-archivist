export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "The Archivist",
    url: "https://thearchivist.com",
    logo: "https://thearchivist.com/og-image.jpg",
    description:
      "Premium figurine collection featuring officially licensed collectibles from Marvel, DC, Star Wars, Anime, Gaming, and more.",
    foundingDate: "2024",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "hello@thearchivist.com",
    },
    sameAs: [
      "https://facebook.com/thearchivist",
      "https://instagram.com/thearchivist",
      "https://twitter.com/thearchivist",
      "https://pinterest.com/thearchivist",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
