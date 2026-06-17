import { IndianRupee } from "lucide-react";
import { formatRupees } from "../utils/formatters.js";

export default function PricingCard({ item }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-saffron-600">{item.category}</p>
          <h3 className="mt-1 text-lg font-black text-shiva-900">{item.title}</h3>
        </div>
        <span className="rounded-md bg-shiva-50 px-3 py-1 text-xs font-bold text-shiva-700">{item.carType}</span>
      </div>
      <div className="flex items-end gap-2">
        <IndianRupee className="mb-1 text-saffron-600" size={22} />
        <span className="text-3xl font-black text-shiva-900">{formatRupees(item.price).replace("₹", "")}</span>
        <span className="pb-1 text-sm font-semibold text-slate-500">/{item.unit}</span>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{item.description}</p>
      {item.inclusions?.length > 0 && (
        <ul className="mt-4 grid gap-2 text-sm text-slate-700">
          {item.inclusions.map((inclusion) => (
            <li key={inclusion} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-saffron-500" />
              {inclusion}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
