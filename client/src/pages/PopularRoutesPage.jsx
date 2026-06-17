import { Link } from "react-router-dom";
import SectionHeader from "../components/SectionHeader.jsx";

const routes = [
  "Hyderabad → Yadadri",
  "Hyderabad → Srisailam",
  "Hyderabad Airport → Warangal",
  "Hyderabad → Vijayawada",
  "Hyderabad → Tirupati",
  "Hyderabad Local City Tour"
];

export default function PopularRoutesPage() {
  return (
    <section className="py-16">
      <div className="page-shell">
        <SectionHeader eyebrow="Popular Routes" title="Common GoTrippy customer routes" description="Use these quick route cards to start a booking request with local driver partners." />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {routes.map((route) => (
            <article key={route} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-shiva-900">{route}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Search available vehicles, compare driver listings, and send a booking request.</p>
              <Link className="btn-primary mt-5" to={`/find-rides?drop=${encodeURIComponent(route)}`}>Find Rides</Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
