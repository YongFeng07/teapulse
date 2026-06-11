export function SchemaOrg() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Tea Pulse",
        url: "https://teapulse.com",
        logo: "https://teapulse.com/og-image.jpg",
        description:
          "Luxury handcrafted tea experiences designed for the rhythm of modern life. Order ahead, earn rewards, skip the queue.",
        sameAs: ["https://instagram.com/teapulse", "https://facebook.com/teapulse"],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+60-11-3178-0587",
          contactType: "customer service",
        },
      },
      {
        "@type": "WebSite",
        name: "Tea Pulse",
        url: "https://teapulse.com",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://teapulse.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
