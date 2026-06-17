import { CalendarDays, Car, Fuel, ImageOff, Send, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import http, { getApiError } from "../api/http.js";
import SectionHeader from "../components/SectionHeader.jsx";
import { fallbackSelfDriveCars } from "../data/siteData.js";
import { formatRupees } from "../utils/formatters.js";

const initialForm = {
  customerName: "",
  phoneNumber: "",
  drivingLicenseNumber: "",
  pickupDate: "",
  returnDate: "",
  pickupLocation: "",
  selectedCar: "",
  notes: "",
  documentNote: "Documents will be verified before handover."
};

const isMongoId = (value) => /^[a-f\d]{24}$/i.test(String(value || ""));

function SafeCarImage({ src, alt }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="grid h-52 w-full place-items-center bg-shiva-50 text-shiva-700">
        <div className="text-center">
          <ImageOff className="mx-auto text-saffron-600" size={34} />
          <p className="mt-2 text-sm font-black">Car image coming soon</p>
        </div>
      </div>
    );
  }

  return <img className="h-52 w-full object-cover" src={src} alt={alt} onError={() => setFailed(true)} />;
}

export default function SelfDrivePage() {
  const [cars, setCars] = useState(fallbackSelfDriveCars);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    http.get("/self-drive/cars").then(({ data }) => {
      setCars(data.length ? data : fallbackSelfDriveCars);
      if (data[0]?._id) {
        setForm((current) => ({ ...current, selectedCar: data[0]._id }));
      }
    }).catch(() => setCars(fallbackSelfDriveCars));
  }, []);

  const selectedCar = useMemo(() => cars.find((car) => car._id === form.selectedCar), [cars, form.selectedCar]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submitRequest = async (event) => {
    event.preventDefault();

    if (!isMongoId(form.selectedCar)) {
      toast.error("Please select an available self-drive car from the live list.");
      return;
    }

    setSubmitting(true);

    try {
      await http.post("/self-drive/bookings", form);
      toast.success("Self-drive request submitted. Admin will confirm availability.");
      setForm({ ...initialForm, selectedCar: cars[0]?._id || "" });
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="bg-white py-16">
        <div className="page-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-saffron-600">Self Drive Cars</p>
            <h1 className="mt-3 text-4xl font-black leading-tight text-shiva-900 sm:text-5xl">
              Rent a car and drive it yourself
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Choose a clean self-drive car, select pickup and return dates, and submit a request for admin approval.
              Cab bookings with driver and self-drive rentals are handled separately.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {["Valid Driving License", "Aadhaar Card", "PAN Card or Passport", "Security Deposit"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <ShieldCheck className="text-saffron-600" size={20} />
                  <span className="text-sm font-black text-shiva-900">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <form className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft" onSubmit={submitRequest}>
            <h2 className="text-xl font-black text-shiva-900">Self-drive booking request</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="Customer name" name="customerName" value={form.customerName} onChange={updateField} />
              <Field label="Phone number" name="phoneNumber" value={form.phoneNumber} onChange={updateField} pattern="[6-9][0-9]{9}" />
              <Field label="Driving license number" name="drivingLicenseNumber" value={form.drivingLicenseNumber} onChange={updateField} />
              <div>
                <label className="label" htmlFor="selectedCar">Selected car</label>
                <select className="field" id="selectedCar" name="selectedCar" value={form.selectedCar} onChange={updateField} required>
                  <option value="">Choose car</option>
                  {cars.map((car) => (
                    <option key={car._id} value={car._id}>
                      {car.name} - {formatRupees(car.pricePerDay)}/day
                    </option>
                  ))}
                </select>
              </div>
              <Field label="Pickup date" name="pickupDate" type="date" value={form.pickupDate} onChange={updateField} />
              <Field label="Return date" name="returnDate" type="date" value={form.returnDate} onChange={updateField} />
              <div className="md:col-span-2">
                <Field label="Pickup location" name="pickupLocation" value={form.pickupLocation} onChange={updateField} />
              </div>
              <div className="md:col-span-2">
                <label className="label" htmlFor="documentNote">Document upload placeholder</label>
                <input className="field" id="documentNote" name="documentNote" value={form.documentNote} onChange={updateField} />
                <p className="mt-1 text-xs font-semibold text-slate-500">Upload integration can be connected later; admin can currently view this document note.</p>
              </div>
              <div className="md:col-span-2">
                <label className="label" htmlFor="notes">Notes</label>
                <textarea className="field min-h-24" id="notes" name="notes" value={form.notes} onChange={updateField} placeholder="Pickup timing, planned route, extra requirements..." />
              </div>
            </div>
            {selectedCar && (
              <div className="mt-4 rounded-lg bg-shiva-50 p-4 text-sm text-slate-700">
                Deposit: <strong>{formatRupees(selectedCar.securityDeposit)}</strong> | Fuel: <strong>{selectedCar.fuelType}</strong> | Transmission: <strong>{selectedCar.transmission}</strong>
              </div>
            )}
            <button className="btn-primary mt-5 w-full" type="submit" disabled={submitting}>
              <Send size={18} /> {submitting ? "Submitting..." : "Submit Self-Drive Request"}
            </button>
          </form>
        </div>
      </section>

      <section className="py-16">
        <div className="page-shell">
          <SectionHeader
            eyebrow="Available Self-Drive Cars"
            title="Choose your rental car"
            description="Daily pricing, deposit amount, required documents, and availability are managed separately by the admin."
            align="center"
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {cars.map((car) => (
              <article key={car._id} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <SafeCarImage src={car.imageUrl} alt={car.name} />
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black text-shiva-900">{car.name}</h3>
                      <p className="mt-1 text-sm font-bold text-saffron-600">{car.availabilityStatus}</p>
                    </div>
                    <span className="rounded-md bg-shiva-900 px-3 py-2 text-sm font-black text-white">
                      {formatRupees(car.pricePerDay)}/day
                    </span>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <MiniSpec icon={Fuel} label={car.fuelType} />
                    <MiniSpec icon={Car} label={car.transmission} />
                    <MiniSpec icon={CalendarDays} label={car.seatingCapacity} />
                  </div>
                  <p className="mt-4 text-sm text-slate-600">Security deposit: <strong>{formatRupees(car.securityDeposit)}</strong></p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(car.requiredDocuments || []).map((document) => (
                      <span key={document} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-600">
                        {document}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, ...props }) {
  const id = props.name;
  return (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      <input className="field" id={id} required {...props} />
    </div>
  );
}

function MiniSpec({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 rounded-md bg-slate-50 p-3 text-sm font-bold text-shiva-900">
      <Icon className="text-saffron-600" size={17} />
      {label}
    </div>
  );
}
