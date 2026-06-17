import {
  ArrowRight,
  BadgeIndianRupee,
  Building2,
  CalendarDays,
  Car,
  CarFront,
  CheckCircle2,
  Headphones,
  Landmark,
  MessageCircle,
  Mountain,
  Plane,
  TrendingUp,
  ShieldCheck,
  Star,
  UserCheck
} from "lucide-react";
import { Link } from "react-router-dom";

const charminarImage = "https://upload.wikimedia.org/wikipedia/commons/7/71/Charminar_Hyderabad_1.jpg";

const heroSlides = [
  {
    image: charminarImage,
    alt: "Charminar Hyderabad city rides",
    eyebrow: "Hyderabad ready",
    title: "Airport, temple and city rides"
  },
  {
    image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1400&q=85",
    alt: "Airport transfer travel",
    eyebrow: "Airport transfers",
    title: "Pickup and drop support"
  },
  {
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1400&q=85",
    alt: "Temple tour travel",
    eyebrow: "Temple tours",
    title: "Family darshan trips"
  },
  {
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85",
    alt: "Comfortable car on road",
    eyebrow: "Outstation rides",
    title: "Comfortable long drives"
  }
];

const serviceCards = [
  {
    title: "Airport Transfers",
    description: "Hassle-free airport pickup and drop to Hyderabad Airport.",
    icon: Plane,
    to: "/airport-transfers",
    theme: "blue"
  },
  {
    title: "Temple Tours",
    description: "Visit famous temples with safe and comfortable rides.",
    icon: Landmark,
    to: "/temple-trips",
    theme: "orange"
  },
  {
    title: "City Rides",
    description: "Local rides for shopping, business, or sightseeing around Hyderabad.",
    icon: Building2,
    to: "/book-now",
    theme: "green"
  },
  {
    title: "Outstation Trips",
    description: "Plan outstation trips to your favorite destinations.",
    icon: Mountain,
    to: "/find-rides?tripType=Outstation",
    theme: "purple"
  },
  {
    title: "Self Drive Cars",
    description: "Drive on your terms with our range of self drive cars.",
    icon: CarFront,
    to: "/self-drive",
    theme: "rose"
  }
];

const destinations = [
  {
    title: "Hyderabad Airport",
    description: "Rajiv Gandhi International Airport pickup and drop services",
    image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=85",
    to: "/airport-transfers",
    theme: "blue"
  },
  {
    title: "Famous Temples",
    description: "Tirumala, Yadadri, Bhadrachalam and more",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85",
    to: "/temple-trips",
    theme: "orange"
  },
  {
    title: "Hyderabad City",
    description: "Charminar, Golconda, Hitech City and more",
    image: charminarImage,
    to: "/book-now",
    theme: "green"
  }
];

const trustItems = [
  { icon: UserCheck, title: "Verified Partners", text: "All partners are verified for your safety." },
  { icon: BadgeIndianRupee, title: "Transparent Pricing", text: "No hidden charges. What you see is what you pay." },
  { icon: ShieldCheck, title: "Secure Payments", text: "Multiple secure payment options available." },
  { icon: Headphones, title: "24/7 Support", text: "We're here to help you anytime, anywhere." }
];

const stats = [
  ["10K+", "Happy Customers", UserCheck],
  ["5K+", "Trips Completed", Plane],
  ["500+", "Verified Partners", ShieldCheck],
  ["4.8/5", "Customer Rating", Star]
];

const themeClasses = {
  blue: {
    card: "from-blue-50 via-white to-white",
    icon: "text-blue-600",
    glow: "shadow-blue-500/10",
    button: "border-blue-500 text-blue-700 hover:bg-blue-600 hover:text-white"
  },
  orange: {
    card: "from-orange-50 via-white to-white",
    icon: "text-orange-600",
    glow: "shadow-orange-500/10",
    button: "border-orange-500 text-orange-700 hover:bg-orange-500 hover:text-white"
  },
  green: {
    card: "from-emerald-50 via-white to-white",
    icon: "text-emerald-600",
    glow: "shadow-emerald-500/10",
    button: "border-emerald-500 text-emerald-700 hover:bg-emerald-600 hover:text-white"
  },
  purple: {
    card: "from-violet-50 via-white to-white",
    icon: "text-violet-600",
    glow: "shadow-violet-500/10",
    button: "border-violet-500 text-violet-700 hover:bg-violet-600 hover:text-white"
  },
  rose: {
    card: "from-rose-50 via-white to-white",
    icon: "text-rose-600",
    glow: "shadow-rose-500/10",
    button: "border-rose-500 text-rose-700 hover:bg-rose-600 hover:text-white"
  }
};

export default function HomePage() {
  const partnerLoginHref = `${import.meta.env.BASE_URL}driver/login`;

  return (
    <>
      <section className="relative overflow-hidden bg-[#fbfdff]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(233,155,34,0.13),transparent_26%),radial-gradient(circle_at_86%_15%,rgba(24,117,169,0.14),transparent_30%),linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)]" />
        <div className="absolute left-[5%] top-24 hidden h-48 w-48 rounded-full bg-saffron-400/10 blur-3xl lg:block" />
        <div className="absolute right-[12%] top-36 hidden h-56 w-56 rounded-full bg-blue-400/10 blur-3xl lg:block" />
        <div className="page-shell relative grid gap-12 py-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:py-20">
          <div className="relative">
            <div className="absolute right-6 top-20 hidden h-40 w-32 bg-[radial-gradient(circle,#cbd5e1_1.2px,transparent_1.2px)] [background-size:16px_16px] opacity-70 lg:block" />
            <p className="inline-flex rounded-full bg-saffron-400/10 px-4 py-2 text-xs font-black uppercase tracking-wide text-saffron-700 ring-1 ring-saffron-400/20">
              Reliable rides. Memorable journeys.
            </p>
            <h1 className="mt-6 max-w-2xl text-4xl font-black leading-tight text-shiva-900 sm:text-5xl lg:text-[64px]">
              Travel Smarter. Explore More.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Airport transfers, temple tours, city rides, outstation trips, and self-drive cars -- all in one place.
            </p>

            <div className="mt-9 grid max-w-lg grid-cols-3 gap-5">
              {[
                [ShieldCheck, "Trusted Drivers"],
                [BadgeIndianRupee, "Best Prices"],
                [Headphones, "24/7 Support"]
              ].map(([Icon, label]) => (
                <div key={label} className="text-center">
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white text-saffron-600 shadow-[0_16px_34px_rgba(233,155,34,0.18)] ring-1 ring-saffron-400/15">
                    <Icon size={24} />
                  </span>
                  <p className="mt-3 text-xs font-black text-slate-600">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-10 top-14 hidden h-40 w-40 rounded-full bg-saffron-400/15 blur-2xl lg:block" />
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full border border-blue-200/70" />
            <div className="relative overflow-hidden rounded-xl border border-white bg-white p-2 shadow-[0_30px_80px_rgba(9,38,63,0.16)]">
              <div className="relative h-[440px] overflow-hidden rounded-lg bg-shiva-900">
                {heroSlides.map((slide, index) => (
                  <img
                    key={slide.title}
                    className="hero-slide absolute inset-0 h-full w-full object-cover object-center"
                    src={slide.image}
                    alt={slide.alt}
                    style={{ animationDelay: `${index * 5}s` }}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-shiva-900/50 via-transparent to-transparent" />
                {heroSlides.map((slide, index) => (
                  <div
                    key={`${slide.title}-caption`}
                    className="hero-caption absolute bottom-6 left-6 rounded-lg bg-white/88 px-5 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.18)] backdrop-blur"
                    style={{ animationDelay: `${index * 5}s` }}
                  >
                    <p className="text-xs font-black uppercase tracking-wide text-saffron-600">{slide.eyebrow}</p>
                    <p className="mt-1 text-sm font-black text-shiva-900">{slide.title}</p>
                  </div>
                ))}
                <div className="absolute bottom-6 right-6 flex gap-2">
                  {heroSlides.map((slide, index) => (
                    <span
                      key={`${slide.title}-dot`}
                      className="hero-dot h-2 w-8 overflow-hidden rounded-full bg-white/40"
                      style={{ animationDelay: `${index * 5}s` }}
                    >
                      <span className="block h-full rounded-full bg-saffron-500" />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fbfdff] pb-12">
        <div className="page-shell">
          <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.09)] lg:p-7">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {serviceCards.map((service) => (
                <ServiceCard key={service.title} service={service} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-[#fbfdff] py-10">
        <div className="page-shell">
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-wide text-saffron-600">Popular Destinations</p>
            <h2 className="mt-3 text-3xl font-black text-shiva-900">Explore Hyderabad with GoTrippy</h2>
          </div>
          <button className="absolute left-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white text-blue-700 shadow-soft xl:grid" aria-label="Previous destinations">
            <ArrowRight className="rotate-180" size={20} />
          </button>
          <button className="absolute right-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white text-blue-700 shadow-soft xl:grid" aria-label="Next destinations">
            <ArrowRight size={20} />
          </button>
          <div className="mx-auto mt-9 grid max-w-6xl gap-8 lg:grid-cols-3">
            {destinations.map((destination) => (
              <DestinationCard key={destination.title} destination={destination} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fbfdff] py-8">
        <div className="page-shell">
          <div className="grid gap-4 rounded-lg border border-slate-200/80 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.08)] md:grid-cols-2 xl:grid-cols-4">
            {trustItems.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-4 border-slate-200 py-3 xl:border-r xl:last:border-r-0">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-700">
                  <Icon size={24} />
                </span>
                <div>
                  <h3 className="font-black text-shiva-900">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fbfdff] py-10">
        <div className="page-shell">
          <div className="relative overflow-hidden rounded-xl border border-orange-100 bg-[linear-gradient(110deg,#fff7ed_0%,#ffffff_42%,#fff7ed_100%)] shadow-[0_28px_80px_rgba(15,23,42,0.09)] lg:grid lg:grid-cols-[1fr_0.95fr]">
            <div className="absolute -left-20 -top-20 h-52 w-52 rounded-full bg-saffron-400/20 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-blue-400/10 blur-3xl" />
            <div className="relative p-8 lg:p-10">
              <p className="text-sm font-black uppercase tracking-wide text-saffron-600">Grow with GoTrippy</p>
              <h2 className="mt-2 max-w-xl text-3xl font-black leading-tight text-shiva-900 sm:text-4xl">Partner / Driver Portal</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
                List vehicles, manage bookings, and grow your business with GoTrippy.
              </p>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <PartnerFeature icon={CalendarDays} title="View Bookings" text="Track upcoming trips, customer details, and booking status." />
                <PartnerFeature icon={Car} title="List Your Vehicle" text="Publish cars with driver details, photos, and pricing options." />
                <PartnerFeature icon={MessageCircle} title="Manage Leads" text="Connect with customers faster after every booking request." />
                <PartnerFeature icon={CheckCircle2} title="Verified Partner" text="Build trust with an owner profile and active vehicle status." />
              </div>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a className="btn-primary" href={partnerLoginHref} target="_blank" rel="noopener noreferrer">
                  Partner Login
                </a>
                <Link className="btn-outline border-saffron-500 text-saffron-600 hover:bg-saffron-500 hover:text-white" to="/list-your-vehicle">
                  New Partner? Register Now
                </Link>
              </div>
            </div>
            <div className="relative hidden items-end justify-center px-8 pt-10 lg:flex">
              <div className="absolute left-4 top-12 rounded-xl bg-shiva-900 px-4 py-3 text-white shadow-[0_18px_45px_rgba(9,38,63,0.24)]">
                <p className="text-xs font-bold text-slate-300">New booking</p>
                <p className="mt-1 text-sm font-black">Airport pickup</p>
              </div>
              <div className="relative h-72 w-full max-w-md rounded-t-2xl bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
                <div className="absolute -left-24 bottom-0 h-44 w-32 rounded-t-full bg-saffron-500/90" />
                <div className="absolute -left-20 bottom-36 h-16 w-16 rounded-full bg-shiva-900" />
                <div className="absolute -left-5 bottom-28 h-9 w-14 rotate-12 rounded-md bg-slate-700 shadow-lg" />
                <div className="mb-4 flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                </div>
                <div className="grid gap-4">
                  <div className="grid grid-cols-[4.5rem_1fr] gap-3 rounded-lg bg-slate-100 p-3">
                    <div className="grid rounded-md bg-shiva-900 text-white">
                      <span className="self-center justify-self-center text-xs font-black">GT</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-4/5 rounded bg-slate-200" />
                      <div className="h-3 w-3/5 rounded bg-slate-200" />
                      <div className="flex gap-2 pt-1">
                        <span className="h-6 w-16 rounded-full bg-white" />
                        <span className="h-6 w-20 rounded-full bg-white" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-blue-50 p-3">
                      <p className="text-xs font-bold text-slate-500">Requests</p>
                      <p className="mt-1 text-2xl font-black text-shiva-900">24</p>
                    </div>
                    <div className="rounded-lg bg-saffron-400/15 p-3">
                      <p className="text-xs font-bold text-slate-500">Earnings</p>
                      <p className="mt-1 text-2xl font-black text-shiva-900">Rs. 18K</p>
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-black text-shiva-900">Recent bookings</span>
                      <TrendingUp className="text-emerald-600" size={16} />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full rounded bg-slate-100" />
                      <div className="h-3 w-4/5 rounded bg-slate-100" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fbfdff] py-8">
        <div className="page-shell">
          <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(([value, label, Icon]) => (
              <div key={label} className="flex items-center justify-center gap-4 border-slate-200 py-2 lg:border-r lg:last:border-r-0">
                <Icon className="text-slate-400" size={28} />
                <div>
                  <p className="text-2xl font-black text-blue-700">{value}</p>
                  <p className="text-xs font-semibold text-slate-500">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ServiceCard({ service }) {
  const Icon = service.icon;
  const theme = themeClasses[service.theme];

  return (
    <article className={`group min-h-[265px] rounded-xl border border-white bg-gradient-to-br ${theme.card} p-5 shadow-xl ${theme.glow} transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl`}>
      <span className="inline-grid h-12 w-12 place-items-center rounded-xl bg-white/80 shadow-sm ring-1 ring-slate-200/60">
        <Icon className={theme.icon} size={25} />
      </span>
      <h3 className="mt-6 text-lg font-black text-shiva-900">{service.title}</h3>
      <p className="mt-3 min-h-20 text-sm leading-6 text-slate-600">{service.description}</p>
      <Link className={`mt-5 inline-flex w-full items-center justify-between rounded-lg border bg-white/85 px-4 py-2.5 text-sm font-black transition ${theme.button}`} to={service.to}>
        Book Now <ArrowRight size={18} />
      </Link>
    </article>
  );
}

function DestinationCard({ destination }) {
  const theme = themeClasses[destination.theme];

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:shadow-soft">
      <img className="h-52 w-full object-cover transition duration-500 hover:scale-105" src={destination.image} alt={destination.title} />
      <div className="p-6">
        <h3 className="text-xl font-black text-shiva-900">{destination.title}</h3>
        <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{destination.description}</p>
        <Link className={`mt-5 inline-flex w-full items-center justify-between rounded-md border bg-white px-4 py-2.5 text-sm font-black transition ${theme.button}`} to={destination.to}>
          Book Now <ArrowRight size={18} />
        </Link>
      </div>
    </article>
  );
}

function PartnerFeature({ icon: Icon, title, text }) {
  return (
    <div className="rounded-xl border border-white bg-white/82 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur transition hover:-translate-y-1 hover:shadow-soft">
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-shiva-50 text-shiva-800">
        <Icon size={22} />
      </span>
      <h3 className="mt-3 font-black text-shiva-900">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}
