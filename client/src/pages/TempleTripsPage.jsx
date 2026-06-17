import { Link } from "react-router-dom";
import SectionHeader from "../components/SectionHeader.jsx";

const temples = ["Yadadri", "Srisailam", "Tirupati", "Bhadrachalam", "Vemulawada", "Basara"];

export default function TempleTripsPage() {
  return (
    <section className="py-16">
      <div className="page-shell">
        <SectionHeader
          eyebrow="Temple Tours"
          title="Temple trips with trusted local drivers"
          description="Book family-friendly cars for early morning darshan, return timing, elders, luggage, and route stops across Telangana, Andhra Pradesh, and South India."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {temples.map((temple) => (
            <article key={temple} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-black uppercase tracking-wide text-saffron-600">Temple Package</p>
              <h2 className="mt-2 text-2xl font-black text-shiva-900">{temple}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Flexible pickup, return schedules, family stops, and comfortable vehicles for darshan travel.</p>
              <Link className="btn-primary mt-5" to={`/booking?tripType=Temple%20Trip&drop=${encodeURIComponent(temple)}`}>Book {temple}</Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
