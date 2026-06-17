import { LockKeyhole, Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { business } from "../data/siteData.js";

const links = [
  { label: "Home", to: "/" },
  { label: "Airport", to: "/airport-transfers" },
  { label: "Temple Tours", to: "/temple-trips" },
  { label: "City Rides", to: "/book-now" },
  { label: "Outstation", to: "/find-rides?tripType=Outstation" },
  { label: "Self Drive", to: "/self-drive" },
  { label: "List Vehicle", to: "/list-your-vehicle" },
  { label: "Contact", to: "/contact" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const partnerLoginHref = `${import.meta.env.BASE_URL}driver/login`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-[0_8px_24px_rgba(15,23,42,0.06)] backdrop-blur">
      <div className="page-shell flex h-16 items-center justify-between gap-3">
        <Link to="/" className="flex min-w-max items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-shiva-900 text-lg font-black text-saffron-400 shadow-sm">
            G
          </span>
          <span>
            <span className="block text-base font-black text-shiva-900">GoTrippy</span>
            <span className="hidden text-xs font-semibold text-slate-500 xl:block">Your Journey. Your Ride.</span>
          </span>
        </Link>

        <nav className="hidden min-w-0 items-center gap-2 xl:flex 2xl:gap-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative whitespace-nowrap px-1 py-5 text-[13px] font-bold transition after:absolute after:bottom-2.5 after:left-1 after:h-0.5 after:w-0 after:rounded-full after:bg-saffron-500 after:transition-all ${
                  isActive ? "text-saffron-600 after:w-7" : "text-slate-700 hover:text-shiva-700 hover:after:w-5"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden min-w-max items-center gap-2 xl:flex">
          <a className="btn-outline whitespace-nowrap border-shiva-800 px-4 text-shiva-800 hover:bg-shiva-50" href={partnerLoginHref} target="_blank" rel="noopener noreferrer">
            <LockKeyhole size={16} />
            Partner Login
          </a>
          <a className="btn-outline whitespace-nowrap border-blue-600 px-4 text-blue-700 hover:bg-blue-50" href={`tel:+91${business.phone}`}>
            <Phone size={17} />
            Call Now
          </a>
          <Link className="btn-primary whitespace-nowrap px-6 py-3" to="/book-now">
            Book Now
          </Link>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-shiva-900 xl:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white xl:hidden">
          <div className="page-shell grid gap-2 py-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-bold text-slate-700 hover:bg-shiva-50"
              >
                {link.label}
              </NavLink>
            ))}
            <a className="btn-outline mt-2" href={`tel:+91${business.phone}`} onClick={() => setOpen(false)}>
              <Phone size={17} /> Call Now
            </a>
            <a className="btn-outline mt-2 border-shiva-800 text-shiva-800" href={partnerLoginHref} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
              <LockKeyhole size={17} /> Partner Login
            </a>
            <Link className="btn-primary mt-2" to="/book-now" onClick={() => setOpen(false)}>
              Book Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
