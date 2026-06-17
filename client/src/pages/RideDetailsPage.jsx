import { Armchair, Briefcase, Car, MessageCircle, ShieldCheck, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import http from "../api/http.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { business, fallbackCars } from "../data/siteData.js";
import { createWhatsAppUrl, formatRupees } from "../utils/formatters.js";

const normalizeWhatsAppNumber = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits || business.whatsapp;
};

export default function RideDetailsPage() {
  const { id } = useParams();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get(`/cars/${id}`).then(({ data }) => setRide(data)).catch(() => setRide(fallbackCars.find((car) => car._id === id) || fallbackCars[0])).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading ride details" />;
  if (!ride) return null;

  const driverName = ride.ownerAgentId?.name || ride.assignedAgent?.fullName || "GoTrippy Partner";
  const driverPhone = normalizeWhatsAppNumber(ride.ownerAgentId?.whatsappNumber || ride.ownerAgentId?.phone || ride.assignedAgent?.whatsappNumber);

  return (
    <section className="py-16">
      <div className="page-shell grid gap-8 lg:grid-cols-[1.1fr_0.75fr]">
        <div className="grid gap-6">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <img className="h-[420px] w-full object-cover" src={ride.imageUrl} alt={ride.name} />
            <div className="p-6">
              <p className="flex items-center gap-1 text-sm font-black uppercase tracking-wide text-saffron-600">
                <Star size={15} fill="currentColor" /> 4.8 rated driver
              </p>
              <h1 className="mt-2 text-3xl font-black text-shiva-900">{ride.name}</h1>
              <p className="mt-3 text-slate-600">{ride.description}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <Info icon={Armchair} label="Seats" value={ride.seatingCapacity} />
                <Info icon={Briefcase} label="Luggage" value={ride.luggageCapacity} />
                <Info icon={Car} label="Service" value={ride.serviceType || "With Driver"} />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-shiva-900">Route and amenities</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {(ride.serviceAreas || ["Hyderabad", "Airport transfers", "Temple routes"]).map((item) => (
                <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{item}</span>
              ))}
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {["Clean vehicle", ride.acType || "AC", ride.fuelType || "Petrol", ride.transmission || "Manual", "WhatsApp support", "Family-friendly"].map((amenity) => (
                <span key={amenity} className="flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700">
                  <ShieldCheck size={16} className="text-emerald-600" /> {amenity}
                </span>
              ))}
            </div>
          </div>
        </div>

        <aside className="h-max rounded-lg border border-slate-200 bg-white p-6 shadow-soft lg:sticky lg:top-24">
          <p className="text-sm font-black uppercase tracking-wide text-saffron-600">Driver Profile</p>
          <h2 className="mt-1 text-2xl font-black text-shiva-900">{driverName}</h2>
          <p className="mt-2 text-sm text-slate-600">{ride.ownerAgentId?.city || ride.pickupCity || "Local"} based GoTrippy partner</p>
          <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p><strong>Driver contact:</strong> visible through WhatsApp and after booking</p>
            {ride.registrationNumber && <p className="mt-1"><strong>Vehicle no:</strong> {ride.registrationNumber}</p>}
          </div>
          <div className="mt-5 grid gap-3 rounded-lg bg-slate-50 p-4 text-sm">
            <span><strong>Per km:</strong> {ride.pricePerKm ? formatRupees(ride.pricePerKm) : "Discuss on call"}</span>
            <span><strong>Minimum fare:</strong> {ride.minimumFare ? formatRupees(ride.minimumFare) : "Route based"}</span>
            <span><strong>Airport:</strong> {ride.airportFixedPrice ? formatRupees(ride.airportFixedPrice) : "Available"}</span>
            <span><strong>Temple package:</strong> {ride.templePackagePrice ? formatRupees(ride.templePackagePrice) : "Available"}</span>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-600">
            Customer safety: confirm pickup point, vehicle number, driver contact, luggage, and final price before starting the ride.
          </p>
          <div className="mt-6 grid gap-3">
            <a className="btn-outline" href={createWhatsAppUrl(driverPhone, `Namaste, I want to book ${ride.name} from GoTrippy.`)} target="_blank" rel="noreferrer">
              <MessageCircle size={18} /> WhatsApp Driver
            </a>
            <Link className="btn-primary" to={`/booking?vehicle=${encodeURIComponent(ride._id)}&car=${encodeURIComponent(ride.name)}`}>
              Book This Ride
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <Icon className="text-saffron-600" size={20} />
      <p className="mt-2 text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-black text-shiva-900">{value}</p>
    </div>
  );
}
