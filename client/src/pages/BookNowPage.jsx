import {
  Car,
  Headphones,
  IndianRupee,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import http from "../api/http.js";
import CarCard from "../components/CarCard.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import { business, fallbackCars, fallbackSelfDriveCars, tripTypes } from "../data/siteData.js";
import { createWhatsAppUrl, formatRupees } from "../utils/formatters.js";

const popularRoutes = [
  "Hyderabad -> Yadadri",
  "Hyderabad -> Srisailam",
  "Hyderabad Airport -> Warangal",
  "Hyderabad -> Vijayawada",
  "Hyderabad -> Tirupati",
  "Hyderabad Local City Tour"
];

const templeImage = "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85";

const templePackages = [
  { name: "Yadadri", route: "Hyderabad to Yadadri", image: templeImage },
  { name: "Srisailam", route: "Hyderabad to Srisailam", image: templeImage },
  { name: "Tirupati", route: "Hyderabad to Tirupati", image: templeImage },
  { name: "Bhadrachalam", route: "Hyderabad to Bhadrachalam", image: templeImage },
  { name: "Vemulawada", route: "Hyderabad to Vemulawada", image: templeImage },
  { name: "Basara", route: "Hyderabad to Basara", image: templeImage }
];

const cityPlaces = [
  "Charminar",
  "Hussain Sagar",
  "Tank Bund",
  "Hitech City",
  "Secunderabad Railway Station",
  "MGBS Bus Station",
  "Hyderabad Airport"
];

const whyItems = [
  { icon: UserCheck, title: "Trusted local drivers" },
  { icon: Sparkles, title: "Clean vehicles" },
  { icon: ShieldCheck, title: "Family-friendly rides" },
  { icon: MapPin, title: "Temple trip specialists" },
  { icon: Car, title: "Airport pickup experts" },
  { icon: IndianRupee, title: "Transparent pricing" },
  { icon: Headphones, title: "WhatsApp support" }
];

const reviews = [
  { name: "Ravi Kumar", city: "Hyderabad", text: "Booked an Ertiga for Yadadri. Driver was punctual and helped my parents throughout the trip." },
  { name: "Sravani Reddy", city: "Miyapur", text: "Airport drop was smooth. Clear price discussion and quick WhatsApp updates." },
  { name: "Mahender Goud", city: "Warangal", text: "Good platform for finding local drivers. Vehicle details and driver contact were easy to understand." }
];

const initialSearch = {
  pickup: "",
  drop: "",
  date: "",
  returnDate: "",
  passengers: "1",
  tripType: "One Way",
  vehicleType: ""
};

export default function BookNowPage() {
  const navigate = useNavigate();
  const [cars, setCars] = useState(fallbackCars);
  const [selfDriveCars, setSelfDriveCars] = useState(fallbackSelfDriveCars);
  const [searchForm, setSearchForm] = useState(initialSearch);

  useEffect(() => {
    http.get("/cars").then(({ data }) => setCars(data.length ? data : fallbackCars)).catch(() => setCars(fallbackCars));
    http.get("/self-drive/cars").then(({ data }) => setSelfDriveCars(data.length ? data : fallbackSelfDriveCars)).catch(() => setSelfDriveCars(fallbackSelfDriveCars));
  }, []);

  const runSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams(Object.entries(searchForm).filter(([, value]) => value));
    navigate(`/find-rides?${params.toString()}`);
  };

  return (
    <>
      <section className="hero-image text-white">
        <div className="page-shell grid min-h-[calc(100vh-64px)] items-center gap-10 py-14 lg:grid-cols-[1fr_0.86fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-black backdrop-blur">
              <ShieldCheck size={16} className="text-saffron-400" /> Your Journey. Your Ride. GoTrippy.
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Book Trusted Cars for Airport Rides, Temple Trips & Family Travel
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-100">
              Find cars with drivers, self-drive rentals, airport transfers, temple packages, and outstation rides from trusted local vehicle owners.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="btn-primary" to="/booking"><Car size={18} /> Book a Ride</Link>
              <Link className="btn-secondary" to="/list-your-vehicle"><UserCheck size={18} /> List Your Vehicle</Link>
              <a className="btn-secondary" href={createWhatsAppUrl(business.whatsapp, "Namaste GoTrippy, I want to book a ride.")} target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp Us</a>
            </div>
          </div>

          <form className="rounded-lg border border-white/15 bg-white p-5 text-shiva-900 shadow-soft" onSubmit={runSearch}>
            <p className="text-sm font-black uppercase tracking-wide text-saffron-600">Smart Search</p>
            <h2 className="mt-1 text-2xl font-black">Find a ride quickly</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <input className="field" placeholder="Pickup location" value={searchForm.pickup} onChange={(event) => setSearchForm({ ...searchForm, pickup: event.target.value })} />
              <input className="field" placeholder="Drop location" value={searchForm.drop} onChange={(event) => setSearchForm({ ...searchForm, drop: event.target.value })} />
              <input className="field" type="date" value={searchForm.date} onChange={(event) => setSearchForm({ ...searchForm, date: event.target.value })} />
              <input className="field" type="date" value={searchForm.returnDate} onChange={(event) => setSearchForm({ ...searchForm, returnDate: event.target.value })} />
              <input className="field" type="number" min="1" placeholder="Passengers" value={searchForm.passengers} onChange={(event) => setSearchForm({ ...searchForm, passengers: event.target.value })} />
              <select className="field" value={searchForm.tripType} onChange={(event) => setSearchForm({ ...searchForm, tripType: event.target.value })}>
                {tripTypes.map((type) => <option key={type}>{type}</option>)}
              </select>
              <select className="field md:col-span-2" value={searchForm.vehicleType} onChange={(event) => setSearchForm({ ...searchForm, vehicleType: event.target.value })}>
                <option value="">Any vehicle type</option>
                {["Hatchback", "Sedan", "SUV", "MPV", "Self Drive"].map((type) => <option key={type}>{type}</option>)}
              </select>
            </div>
            <button className="btn-primary mt-4 w-full" type="submit"><Search size={18} /> Search Rides</button>
          </form>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="page-shell">
          <SectionHeader eyebrow="Popular Routes" title="High-demand routes customers search every day" description="Start with common Hyderabad, airport, temple, and outstation routes." />
          <div className="mt-7 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {popularRoutes.map((route) => (
              <Link key={route} className="rounded-lg border border-slate-200 bg-slate-50 p-4 font-black text-shiva-900 transition hover:border-saffron-500 hover:bg-white hover:shadow-sm" to={`/find-rides?drop=${encodeURIComponent(route)}`}>
                <MapPin className="mb-3 text-saffron-600" size={20} /> {route}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="page-shell">
          <SectionHeader eyebrow="Available Rides" title="Cars with trusted local drivers" description="Each listing connects customers directly with the driver or vehicle owner." />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {cars.slice(0, 4).map((car) => <CarCard key={car._id || car.slug} car={car} />)}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-20">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-saffron-400/10 to-transparent" />
        <div className="page-shell">
          <div className="relative">
            <SectionHeader eyebrow="Temple Tours" title="Temple trip packages" description="Family-friendly cars for darshan trips across Telangana, Andhra Pradesh, and South India." align="center" />
          </div>
          <div className="relative mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templePackages.map((place) => <TemplePackageCard key={place.name} place={place} />)}
          </div>
        </div>
      </section>

      <section id="hyderabad-city-rides" className="py-16">
        <div className="page-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="overflow-hidden rounded-lg shadow-soft">
            <img className="h-full min-h-80 w-full object-cover" src="https://upload.wikimedia.org/wikipedia/commons/7/71/Charminar_Hyderabad_1.jpg" alt="Charminar Hyderabad city travel" />
          </div>
          <div>
            <SectionHeader eyebrow="Hyderabad City Travel" title="Local rides and city tours" description="Convenient rides for shopping, hospital visits, railway stations, bus stands, office travel, sightseeing, and family transportation." />
            <div className="mt-5 flex flex-wrap gap-2">
              {cityPlaces.map((place) => <span key={place} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700">{place}</span>)}
            </div>
            <Link className="btn-primary mt-6" to="/booking?tripType=Local">Book Hyderabad Local</Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="page-shell">
          <SectionHeader eyebrow="Self Drive" title="Rent a car and drive yourself" description="Customers can choose pickup/return dates, submit document details, and request a self-drive car." />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {selfDriveCars.slice(0, 4).map((car) => (
              <article key={car._id} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm">
                <img className="h-56 w-full object-cover" src={car.imageUrl} alt={car.name} />
                <div className="p-5">
                  <h3 className="text-xl font-black text-shiva-900">{car.name}</h3>
                  <p className="mt-2 text-sm text-slate-600">{car.fuelType} | {car.transmission} | {car.seatingCapacity}</p>
                  <p className="mt-3 font-black text-saffron-600">{formatRupees(car.pricePerDay)}/day</p>
                  <p className="mt-1 text-sm font-semibold text-slate-600">Security deposit: {formatRupees(car.securityDeposit)}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(car.requiredDocuments || []).slice(0, 4).map((doc) => <span key={doc} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">{doc}</span>)}
                  </div>
                  <Link className="btn-primary mt-5 w-full" to="/self-drive">Request Self Drive</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="page-shell">
          <SectionHeader eyebrow="Why GoTrippy" title="Built for Indian family travel" description="A marketplace that helps customers book confidently and helps driver brothers receive direct online bookings." align="center" />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {whyItems.map(({ icon: Icon, title }) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <Icon className="text-saffron-600" size={24} />
                <h3 className="mt-4 font-black text-shiva-900">{title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-shiva-900 py-16 text-white">
        <div className="page-shell grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-saffron-400">Driver Partners</p>
            <h2 className="mt-2 text-3xl font-black">Own a car? Start getting bookings with GoTrippy.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Register for free, add your vehicle, set your pricing, and receive customer bookings directly.</p>
          </div>
          <Link className="btn-primary" to="/list-your-vehicle">List My Vehicle</Link>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="page-shell">
          <SectionHeader eyebrow="Reviews" title="What customers say" description="Sample reviews for portfolio/demo credibility." />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {reviews.map((review) => (
              <article key={review.name} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <div className="flex gap-1 text-saffron-500">{Array.from({ length: 5 }).map((_, index) => <Star key={index} size={16} fill="currentColor" />)}</div>
                <p className="mt-4 text-sm leading-6 text-slate-700">{review.text}</p>
                <p className="mt-4 font-black text-shiva-900">{review.name}</p>
                <p className="text-xs font-bold text-slate-500">{review.city}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function TemplePackageCard({ place }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="group flex min-h-[360px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div className="relative h-56 overflow-hidden bg-shiva-900">
        {!imageFailed ? (
          <img
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            src={place.image}
            alt={`${place.name} temple package`}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_top_left,#f4b63f_0%,#0b3f66_42%,#09263f_100%)] text-center text-white">
            <div>
              <Sparkles className="mx-auto text-saffron-400" size={34} />
              <p className="mt-3 text-sm font-black uppercase tracking-wide">Temple Trip</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-shiva-900 via-shiva-900/25 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-saffron-500 px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
          Darshan Ride
        </span>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-black text-white">{place.name}</h3>
          <p className="mt-1 text-sm font-semibold text-slate-100">{place.route}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm leading-6 text-slate-600">
          Comfortable family cab with flexible pickup, return timing, luggage space, and stops for elders and children.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Early pickup", "Round trip", "Family friendly"].map((item) => (
            <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{item}</span>
          ))}
        </div>
        <Link className="btn-primary mt-auto w-full" to={`/booking?tripType=Temple%20Trip&drop=${encodeURIComponent(place.name)}`}>
          Book {place.name}
        </Link>
      </div>
    </article>
  );
}
