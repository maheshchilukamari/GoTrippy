import { Link } from "react-router-dom";
import SectionHeader from "../components/SectionHeader.jsx";

export default function AirportTransfersPage() {
  return (
    <section className="py-16">
      <div className="page-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="overflow-hidden rounded-lg shadow-soft">
          <img className="h-full min-h-96 w-full object-cover" src="https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1400&q=85" alt="Airport transfer cab booking" />
        </div>
        <div>
          <SectionHeader
            eyebrow="Airport Transfers"
            title="Hyderabad Airport pickup and drop"
            description="Book trusted cars for Rajiv Gandhi International Airport pickup/drop with luggage support, early morning timing, and direct WhatsApp coordination with drivers."
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {["Fixed package options", "Flight timing coordination", "Family luggage support", "Direct driver WhatsApp"].map((item) => (
              <div key={item} className="rounded-lg border border-slate-200 bg-white p-4 text-sm font-black text-shiva-900">{item}</div>
            ))}
          </div>
          <Link className="btn-primary mt-6" to="/booking?tripType=Airport">Book Airport Ride</Link>
        </div>
      </div>
    </section>
  );
}
