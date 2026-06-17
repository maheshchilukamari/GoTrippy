import { Filter, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import http from "../api/http.js";
import CarCard from "../components/CarCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import { fallbackCars } from "../data/siteData.js";

export default function FindRidesPage() {
  const [searchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    vehicleType: searchParams.get("vehicleType") || "",
    seats: "",
    serviceType: "",
    priceRange: "",
    instantBooking: false,
    sort: "newest"
  });

  useEffect(() => {
    http.get("/cars").then(({ data }) => setCars(data.length ? data : fallbackCars)).catch(() => setCars(fallbackCars)).finally(() => setLoading(false));
  }, []);

  const filteredCars = useMemo(() => {
    const priceMax = filters.priceRange ? Number(filters.priceRange) : Infinity;
    const minSeats = filters.seats ? Number(filters.seats) : 0;

    return cars
      .filter((car) => !filters.vehicleType || car.vehicleCategory === filters.vehicleType || car.name?.toLowerCase().includes(filters.vehicleType.toLowerCase()))
      .filter((car) => !filters.serviceType || car.serviceType === filters.serviceType || car.serviceType === "Both")
      .filter((car) => !filters.instantBooking || car.instantBooking !== false)
      .filter((car) => {
        const seats = Number(String(car.seatingCapacity || "").match(/\d+/)?.[0] || 0);
        return seats >= minSeats;
      })
      .filter((car) => Number(car.pricePerKm || 0) <= priceMax || !car.pricePerKm)
      .sort((a, b) => {
        if (filters.sort === "lowest") return Number(a.pricePerKm || 9999) - Number(b.pricePerKm || 9999);
        if (filters.sort === "highest") return Number(b.pricePerKm || 0) - Number(a.pricePerKm || 0);
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [cars, filters]);

  if (loading) return <LoadingSpinner label="Finding rides" />;

  return (
    <section className="py-16">
      <div className="page-shell">
        <SectionHeader
          eyebrow="Find Rides"
          title="Search trusted vehicles near your route"
          description="Filter by vehicle type, seats, self-drive or with-driver service, price, rating, and instant booking."
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-max rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <div className="mb-4 flex items-center gap-2">
              <Filter className="text-saffron-600" size={19} />
              <h2 className="font-black text-shiva-900">Filters</h2>
            </div>
            <div className="grid gap-4">
              <select className="field" value={filters.vehicleType} onChange={(event) => setFilters({ ...filters, vehicleType: event.target.value })}>
                <option value="">All vehicle types</option>
                {["Hatchback", "Sedan", "SUV", "MPV", "Self Drive"].map((type) => <option key={type}>{type}</option>)}
              </select>
              <select className="field" value={filters.serviceType} onChange={(event) => setFilters({ ...filters, serviceType: event.target.value })}>
                <option value="">Any service type</option>
                <option>With Driver</option>
                <option>Self Drive</option>
              </select>
              <select className="field" value={filters.seats} onChange={(event) => setFilters({ ...filters, seats: event.target.value })}>
                <option value="">Any seats</option>
                <option value="4">4+ seats</option>
                <option value="6">6+ seats</option>
                <option value="7">7+ seats</option>
              </select>
              <select className="field" value={filters.priceRange} onChange={(event) => setFilters({ ...filters, priceRange: event.target.value })}>
                <option value="">Any price</option>
                <option value="15">Under ₹15/km</option>
                <option value="20">Under ₹20/km</option>
                <option value="25">Under ₹25/km</option>
              </select>
              <select className="field" value={filters.sort} onChange={(event) => setFilters({ ...filters, sort: event.target.value })}>
                <option value="newest">Newest listing</option>
                <option value="lowest">Lowest price</option>
                <option value="highest">Highest price</option>
              </select>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <input type="checkbox" checked={filters.instantBooking} onChange={(event) => setFilters({ ...filters, instantBooking: event.target.checked })} />
                Instant booking
              </label>
            </div>
          </aside>

          <div>
            <div className="mb-5 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="font-black text-shiva-900">{filteredCars.length} ride listing{filteredCars.length === 1 ? "" : "s"} found</p>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <Search size={17} /> {searchParams.get("pickup") || "Any pickup"} to {searchParams.get("drop") || "Any destination"}
              </div>
            </div>
            <div className="grid gap-6 xl:grid-cols-2">
              {filteredCars.map((car) => <CarCard key={car._id || car.slug} car={car} />)}
            </div>
            {filteredCars.length === 0 && (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
                <p className="text-lg font-black text-shiva-900">No rides match these filters yet.</p>
                <p className="mt-2 text-sm text-slate-600">Try a broader vehicle type or price range.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
