import { useEffect, useState } from "react";
import http from "../api/http.js";
import CarCard from "../components/CarCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import { fallbackCars } from "../data/siteData.js";

export default function CarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http
      .get("/cars")
      .then(({ data }) => setCars(data))
      .catch(() => setCars(fallbackCars))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading cars" />;
  }

  return (
    <section className="py-16">
      <div className="page-shell">
        <SectionHeader
          eyebrow="Cars"
          title="Choose Ertiga or Swift Dzire for your trip"
          description="Car details include seating capacity, luggage capacity, ideal use cases, and sample price guidance. Final pricing remains editable from the admin dashboard."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {cars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
}
