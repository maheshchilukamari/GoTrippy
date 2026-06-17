import { useEffect, useState } from "react";
import http from "../api/http.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import PricingCard from "../components/PricingCard.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import { fallbackPricing } from "../data/siteData.js";

export default function PricingPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http
      .get("/pricing")
      .then(({ data }) => setPackages(data))
      .catch(() => setPackages(fallbackPricing))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading pricing" />;
  }

  return (
    <section className="py-16">
      <div className="page-shell">
        <SectionHeader
          eyebrow="Pricing"
          title="Sample pricing packages"
          description="These prices are editable from the admin panel. Final quote can vary by distance, route, tolls, parking, waiting time, and travel date."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((item) => (
            <PricingCard key={item._id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
