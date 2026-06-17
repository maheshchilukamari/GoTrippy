import { Armchair, Briefcase, CheckCircle2, MapPin, MessageCircle, Phone, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { business } from "../data/siteData.js";
import { createWhatsAppUrl } from "../utils/formatters.js";

const normalizeWhatsAppNumber = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits || business.whatsapp;
};

export default function CarCard({ car }) {
  const driverName = car.ownerAgentId?.name || car.assignedAgent?.fullName || car.agentName || "GoTrippy Partner";
  const rawDriverPhone = car.ownerAgentId?.whatsappNumber || car.ownerAgentId?.phone || car.assignedAgent?.whatsappNumber || car.agentPhone;
  const driverPhone = normalizeWhatsAppNumber(rawDriverPhone);
  const driverCity = car.ownerAgentId?.city || car.pickupCity || "Local partner";
  const price = car.pricePerKm ? `Rs. ${car.pricePerKm}/km` : car.priceEstimate;
  const bookingUrl = car._id === "preview"
    ? "/list-your-vehicle"
    : `/booking?vehicle=${encodeURIComponent(car._id)}&car=${encodeURIComponent(car.name)}`;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div className="relative h-56 overflow-hidden">
        <img className="h-full w-full object-cover transition duration-500 hover:scale-105" src={car.imageUrl} alt={car.name} />
        <div className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-black text-shiva-900 shadow-sm">
          {car.serviceType || "With Driver"}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-1 text-xs font-black uppercase tracking-wide text-saffron-600">
              <Star size={14} fill="currentColor" /> 4.8 rated driver
            </p>
            <h3 className="mt-1 text-xl font-black text-shiva-900">{car.name}</h3>
            <p className="mt-1 text-sm font-bold text-slate-700">Owner / Driver: {driverName}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
              <span className="inline-flex items-center gap-1"><MapPin size={13} /> {driverCity}</span>
              {rawDriverPhone && <span className="inline-flex items-center gap-1"><Phone size={13} /> Direct contact after booking</span>}
            </div>
          </div>
          <p className="rounded-md bg-saffron-400/15 px-3 py-2 text-sm font-black text-saffron-700">{price}</p>
        </div>
        <p className="line-clamp-3 text-sm leading-6 text-slate-600">{car.description}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <span className="flex items-center gap-2 rounded-md bg-shiva-50 px-3 py-2 text-sm font-bold text-shiva-800">
            <Armchair size={17} /> {car.seatingCapacity}
          </span>
          <span className="flex items-center gap-2 rounded-md bg-saffron-400/15 px-3 py-2 text-sm font-bold text-saffron-600">
            <Briefcase size={17} /> {car.luggageCapacity}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {(car.idealUseCases || []).slice(0, 4).map((useCase) => (
            <span key={useCase} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              <CheckCircle2 size={13} /> {useCase}
            </span>
          ))}
        </div>
        <div className="mt-auto grid gap-3 pt-5 sm:grid-cols-3">
          <a className="btn-outline sm:col-span-1" href={createWhatsAppUrl(driverPhone, `Namaste, I saw your ${car.name} on GoTrippy. Is it available?`)} target="_blank" rel="noreferrer">
            <MessageCircle size={17} /> WhatsApp
          </a>
          <Link className="btn-outline sm:col-span-1" to={car._id === "preview" ? "/list-your-vehicle" : `/rides/${car._id}`}>
            Details
          </Link>
          <Link className="btn-primary sm:col-span-1" to={bookingUrl}>
            Book
          </Link>
        </div>
      </div>
    </article>
  );
}
