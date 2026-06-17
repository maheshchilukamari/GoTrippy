import { Car, Globe2, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { business } from "../data/siteData.js";
import { createWhatsAppUrl } from "../utils/formatters.js";

const quickLinks = [
  ["Home", "/"],
  ["Airport Transfers", "/airport-transfers"],
  ["Temple Tours", "/temple-trips"],
  ["City Rides", "/book-now"],
  ["Self Drive Cars", "/self-drive"],
  ["Contact Us", "/contact"]
];

const partnerLinks = [
  ["Partner Login", "/driver/login"],
  ["List Your Vehicle", "/list-your-vehicle"],
  ["Partner Registration", "/list-your-vehicle"],
  ["Partner Support", "/contact"],
  ["Terms & Conditions", "/contact"]
];

export default function Footer() {
  return (
    <footer className="bg-shiva-900 text-white">
      <div className="page-shell grid gap-8 py-12 md:grid-cols-2 xl:grid-cols-[1.3fr_0.9fr_1fr_1.2fr]">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-saffron-500 text-lg font-black text-shiva-900 shadow-sm">
              G
            </span>
            <span>
              <span className="block text-xl font-black">GoTrippy</span>
              <span className="text-xs font-semibold text-slate-300">Your Journey. Your Ride.</span>
            </span>
          </div>
          <p className="max-w-md text-sm leading-7 text-slate-300">
            A Hyderabad-focused travel marketplace for airport transfers, temple tours, city rides,
            outstation trips, and self-drive car rentals.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-saffron-400 hover:text-saffron-400"
              href={createWhatsAppUrl(business.whatsapp, "Namaste GoTrippy, I need help with a booking.")}
              target="_blank"
              rel="noreferrer"
              aria-label="GoTrippy WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
            <Link
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-saffron-400 hover:text-saffron-400"
              to="/contact"
              aria-label="GoTrippy website contact"
            >
              <Globe2 size={18} />
            </Link>
            <Link
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-saffron-400 hover:text-saffron-400"
              to="/list-your-vehicle"
              aria-label="GoTrippy partner verification"
            >
              <ShieldCheck size={18} />
            </Link>
          </div>
        </div>

        <FooterColumn title="Quick Links" links={quickLinks} />
        <FooterColumn title="Partner Resources" links={partnerLinks} />

        <div>
          <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-saffron-400">Contact Us</h3>
          <div className="grid gap-3 text-sm text-slate-300">
            <a className="flex items-center gap-2 transition hover:text-white" href={`tel:+91${business.phone}`}>
              <Phone size={16} /> +91 {business.phone}
            </a>
            <span className="flex items-center gap-2">
              <Car size={16} /> Cars with drivers and self-drive rentals
            </span>
            <span className="flex items-center gap-2">
              <Mail size={16} /> bookings@gotrippy.in
            </span>
            <span className="flex items-start gap-2 leading-6">
              <MapPin size={16} className="mt-1 shrink-0" /> {business.serviceArea}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="page-shell flex flex-col gap-2 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>{"\u00a9"} 2026 GoTrippy. All rights reserved.</span>
          <span>Built for travel booking, partner listings, and local ride discovery.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-saffron-400">{title}</h3>
      <div className="grid gap-2 text-sm text-slate-300">
        {links.map(([label, to]) => (
          <Link key={`${title}-${label}`} className="transition hover:text-white" to={to}>
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
