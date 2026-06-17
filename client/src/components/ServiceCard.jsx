import { ImageOff } from "lucide-react";
import { useState } from "react";

export default function ServiceCard({ service, Icon }) {
  const [failed, setFailed] = useState(false);

  return (
    <article className="group flex h-full min-h-[520px] flex-col rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-shiva-50">
        {service.imageUrl && !failed ? (
          <img
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            src={service.imageUrl}
            alt={service.imageAlt || service.title}
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-shiva-50 to-saffron-400/20">
            <div className="text-center text-shiva-900">
              {Icon ? (
                <Icon className="mx-auto text-saffron-600" size={34} />
              ) : (
                <ImageOff className="mx-auto text-saffron-600" size={34} />
              )}
              <p className="mt-2 text-sm font-black">{service.title}</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-shiva-900/78 via-shiva-900/12 to-transparent" />
        {service.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-saffron-500 px-3 py-1 text-xs font-black uppercase tracking-wide text-shiva-900 shadow-sm">
            {service.badge}
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-4 text-white">
          {Icon && (
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-saffron-500 text-shiva-900">
              <Icon size={19} />
            </span>
          )}
          <h3 className="text-lg font-black leading-tight">{service.title}</h3>
        </div>
      </div>
      <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
        <p className="text-sm leading-6 text-slate-600">{service.description}</p>
        {service.routes?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {service.routes.map((route) => (
              <span key={route} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
                {route}
              </span>
            ))}
          </div>
        )}
        {service.ctaLabel && service.ctaHref && (
          <a className="btn-outline mt-auto self-start" href={service.ctaHref}>
            {service.ctaLabel}
          </a>
        )}
      </div>
    </article>
  );
}
