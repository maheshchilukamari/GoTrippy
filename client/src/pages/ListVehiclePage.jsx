import { Car, CheckCircle2, ImagePlus, IndianRupee, Save, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import http, { getApiError } from "../api/http.js";
import CarCard from "../components/CarCard.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const profileBlank = {
  name: "",
  phone: "",
  whatsappNumber: "",
  email: "",
  city: "",
  password: ""
};

const vehicleBlank = {
  name: "",
  registrationNumber: "",
  imageUrl: "",
  seatingCapacity: "",
  luggageCapacity: "",
  fuelType: "Petrol",
  transmission: "Manual",
  acType: "AC",
  vehicleCategory: "Sedan",
  serviceType: "With Driver",
  pricePerKm: "",
  minimumFare: "",
  dailyRentalPrice: "",
  securityDeposit: "",
  airportFixedPrice: "",
  templePackagePrice: "",
  description: ""
};

const fallbackVehicleImage =
  "https://imgd-ct.aeplcdn.com/664x415/n/b6j9ora_1420392.jpg?q=80";

const createSlug = (value) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const readImage = (file) =>
  new Promise((resolve, reject) => {
    if (!file?.type?.startsWith("image/")) {
      reject(new Error("Please upload a valid image file."));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read this image."));
    reader.readAsDataURL(file);
  });

const numberOrZero = (value) => Number(value || 0);

export default function ListVehiclePage() {
  const navigate = useNavigate();
  const { admin, registerDriver } = useAuth();
  const [profile, setProfile] = useState(profileBlank);
  const [vehicle, setVehicle] = useState(vehicleBlank);
  const [submitting, setSubmitting] = useState(false);

  const isLoggedInDriver = Boolean(admin);
  const previewCar = useMemo(
    () => ({
      _id: "preview",
      name: vehicle.name || "Your vehicle preview",
      imageUrl: vehicle.imageUrl || fallbackVehicleImage,
      seatingCapacity: vehicle.seatingCapacity || "4 seats",
      luggageCapacity: vehicle.luggageCapacity || "2 bags",
      idealUseCases: ["Airport rides", "Temple trips", "Family travel"],
      pricePerKm: vehicle.pricePerKm,
      priceEstimate: vehicle.pricePerKm ? `Rs. ${vehicle.pricePerKm}/km` : "Contact driver for price",
      serviceType: vehicle.serviceType,
      ownerAgentId: admin || { name: profile.name || "Driver Partner", phone: profile.whatsappNumber || profile.phone },
      description: vehicle.description || "Driver will share pricing, route coverage, and availability on call."
    }),
    [admin, profile, vehicle]
  );

  const uploadImage = async (file) => {
    try {
      const imageUrl = await readImage(file);
      setVehicle((current) => ({ ...current, imageUrl }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const publishVehicle = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (!isLoggedInDriver) {
        await registerDriver({
          ...profile,
          phone: profile.phone.replace(/\D/g, ""),
          whatsappNumber: profile.whatsappNumber.replace(/\D/g, "") || profile.phone.replace(/\D/g, "")
        });
      }

      const commonPayload = {
        name: vehicle.name,
        slug: `${createSlug(vehicle.name)}-${Date.now()}`,
        registrationNumber: vehicle.registrationNumber,
        imageUrl: vehicle.imageUrl || fallbackVehicleImage,
        seatingCapacity: vehicle.seatingCapacity,
        luggageCapacity: vehicle.luggageCapacity,
        fuelType: vehicle.fuelType,
        transmission: vehicle.transmission,
        acType: vehicle.acType,
        vehicleCategory: vehicle.vehicleCategory,
        serviceType: vehicle.serviceType,
        priceEstimate: vehicle.pricePerKm ? `Starts from Rs. ${vehicle.pricePerKm}/km` : "Contact driver for price",
        pricePerKm: numberOrZero(vehicle.pricePerKm),
        minimumFare: numberOrZero(vehicle.minimumFare),
        dailyRentalPrice: numberOrZero(vehicle.dailyRentalPrice),
        securityDeposit: numberOrZero(vehicle.securityDeposit),
        airportFixedPrice: numberOrZero(vehicle.airportFixedPrice),
        templePackagePrice: numberOrZero(vehicle.templePackagePrice),
        pickupCity: "",
        serviceAreas: [],
        popularRoutes: [],
        idealUseCases: ["Airport rides", "Temple trips", "Family travel"],
        description: vehicle.description || "Driver will share route suitability, pricing, and availability on call.",
        isActive: true,
        status: "ACTIVE"
      };

      if (["With Driver", "Both"].includes(vehicle.serviceType)) {
        await http.post("/cars", commonPayload);
      }

      if (["Self Drive", "Both"].includes(vehicle.serviceType)) {
        await http.post("/self-drive/cars", {
          name: vehicle.name,
          imageUrl: vehicle.imageUrl || fallbackVehicleImage,
          fuelType: vehicle.fuelType,
          transmission: vehicle.transmission,
          seatingCapacity: vehicle.seatingCapacity,
          pricePerDay: numberOrZero(vehicle.dailyRentalPrice),
          securityDeposit: numberOrZero(vehicle.securityDeposit),
          requiredDocuments: ["Valid Driving License", "Aadhaar Card", "PAN Card or Passport", "Security Deposit"],
          availabilityStatus: "Available",
          isActive: true,
          status: "ACTIVE"
        });
      }

      toast.success("Vehicle published on GoTrippy.");
      navigate("/agent/dashboard");
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16">
      <div className="page-shell">
        <SectionHeader
          eyebrow="Driver Partners"
          title="List your vehicle and start getting bookings"
          description="Register for free, add vehicle details, optionally add pricing, preview your card, and publish directly to the public website."
        />

        <form className="mt-10 grid gap-6 xl:grid-cols-[1fr_420px]" onSubmit={publishVehicle}>
          <div className="grid gap-6">
            {isLoggedInDriver ? (
              <Panel icon={UserRound} title="Step 1: Partner Profile">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-black text-shiva-900">Signed in as {admin?.name || "GoTrippy Partner"}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        Vehicles you publish from this page are connected to this partner account. Customer bookings and WhatsApp notifications will go to this owner/driver.
                      </p>
                    </div>
                    <span className="w-max rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-700">
                      Active Partner
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
                    <span><strong>Email:</strong> {admin?.email || "Not added"}</span>
                    <span><strong>Phone:</strong> {admin?.whatsappNumber || admin?.phone || "Not added"}</span>
                    <span><strong>Role:</strong> {admin?.role?.replace("_", " ") || "Agent"}</span>
                  </div>
                </div>
              </Panel>
            ) : (
              <Panel icon={UserRound} title="Step 1: Driver Profile">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Full name" value={profile.name} onChange={(value) => setProfile({ ...profile, name: value })} />
                  <Field label="Phone number" value={profile.phone} onChange={(value) => setProfile({ ...profile, phone: value })} />
                  <Field label="WhatsApp number" value={profile.whatsappNumber} onChange={(value) => setProfile({ ...profile, whatsappNumber: value })} />
                  <Field label="Email" type="email" value={profile.email} onChange={(value) => setProfile({ ...profile, email: value })} />
                  <Field label="City" value={profile.city} onChange={(value) => setProfile({ ...profile, city: value })} />
                  <Field label="Password" type="password" value={profile.password} onChange={(value) => setProfile({ ...profile, password: value })} />
                </div>
              </Panel>
            )}

            <Panel icon={Car} title="Step 2: Vehicle Details">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Vehicle name" value={vehicle.name} onChange={(value) => setVehicle({ ...vehicle, name: value })} />
                <Field label="Registration number" value={vehicle.registrationNumber} onChange={(value) => setVehicle({ ...vehicle, registrationNumber: value.toUpperCase() })} />
                <Field label="Seating capacity" value={vehicle.seatingCapacity} onChange={(value) => setVehicle({ ...vehicle, seatingCapacity: value })} placeholder="Example: 4 seats" />
                <Field label="Luggage capacity" value={vehicle.luggageCapacity} onChange={(value) => setVehicle({ ...vehicle, luggageCapacity: value })} placeholder="Example: 2 bags" />
                <Select label="Fuel type" value={vehicle.fuelType} onChange={(value) => setVehicle({ ...vehicle, fuelType: value })} options={["Petrol", "Diesel", "CNG", "EV"]} />
                <Select label="Transmission" value={vehicle.transmission} onChange={(value) => setVehicle({ ...vehicle, transmission: value })} options={["Manual", "Automatic"]} />
                <Select label="AC / Non-AC" value={vehicle.acType} onChange={(value) => setVehicle({ ...vehicle, acType: value })} options={["AC", "Non-AC"]} />
                <Select label="Vehicle category" value={vehicle.vehicleCategory} onChange={(value) => setVehicle({ ...vehicle, vehicleCategory: value })} options={["Hatchback", "Sedan", "SUV", "MPV", "Tempo Traveller", "Luxury", "Other"]} />
              </div>
              <div className="mt-4">
                <label className="label">Vehicle photo optional</label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-saffron-500 hover:bg-saffron-400/10">
                  <ImagePlus className="text-saffron-600" size={28} />
                  <span className="mt-2 text-sm font-black text-shiva-900">Upload vehicle image</span>
                  <span className="mt-1 text-xs font-semibold text-slate-500">If skipped, GoTrippy uses a clean default car photo.</span>
                  <input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => uploadImage(event.target.files?.[0])} />
                </label>
              </div>
            </Panel>

            <Panel icon={CheckCircle2} title="Step 3: Service Type">
              <Select label="Service type" value={vehicle.serviceType} onChange={(value) => setVehicle({ ...vehicle, serviceType: value })} options={["With Driver", "Self Drive", "Both"]} />
            </Panel>

            <Panel icon={IndianRupee} title="Step 4: Pricing Optional">
              <p className="mb-4 text-sm leading-6 text-slate-600">
                These fields are optional. Drivers can leave prices blank and negotiate the final fare with customers on call or WhatsApp.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Price per km" type="number" value={vehicle.pricePerKm} onChange={(value) => setVehicle({ ...vehicle, pricePerKm: value })} required={false} />
                <Field label="Minimum fare" type="number" value={vehicle.minimumFare} onChange={(value) => setVehicle({ ...vehicle, minimumFare: value })} required={false} />
                <Field label="Daily rental price" type="number" value={vehicle.dailyRentalPrice} onChange={(value) => setVehicle({ ...vehicle, dailyRentalPrice: value })} required={false} />
                <Field label="Security deposit" type="number" value={vehicle.securityDeposit} onChange={(value) => setVehicle({ ...vehicle, securityDeposit: value })} required={false} />
                <Field label="Airport fixed price" type="number" value={vehicle.airportFixedPrice} onChange={(value) => setVehicle({ ...vehicle, airportFixedPrice: value })} required={false} />
                <Field label="Temple package price" type="number" value={vehicle.templePackagePrice} onChange={(value) => setVehicle({ ...vehicle, templePackagePrice: value })} required={false} />
              </div>
            </Panel>

            <Panel icon={CheckCircle2} title="Step 5: Optional Notes">
              <p className="mb-4 text-sm leading-6 text-slate-600">
                Routes are not required. Drivers can explain route coverage and trip details directly to customers.
              </p>
              <label className="label">Vehicle description optional</label>
              <textarea
                className="field min-h-28"
                value={vehicle.description}
                onChange={(event) => setVehicle({ ...vehicle, description: event.target.value })}
                placeholder="Example: Clean vehicle, good for family trips, airport rides, temple trips, or outstation travel."
              />
            </Panel>
          </div>

          <aside className="h-max rounded-lg border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-24">
            <p className="text-sm font-black uppercase tracking-wide text-saffron-600">Step 6: Preview & Publish</p>
            <h2 className="mt-1 text-xl font-black text-shiva-900">Public listing preview</h2>
            <div className="mt-5">
              <CarCard car={previewCar} />
            </div>
            <button className="btn-primary mt-5 w-full" type="submit" disabled={submitting}>
              <Save size={18} /> {submitting ? "Publishing..." : "Publish Vehicle Directly"}
            </button>
            <p className="mt-3 text-xs font-semibold leading-5 text-slate-500">
              No admin approval is required. Admin can remove fake or inappropriate listings later.
            </p>
          </aside>
        </form>
      </div>
    </section>
  );
}

function Panel({ icon: Icon, title, children }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="text-saffron-600" size={20} />
        <h2 className="text-xl font-black text-shiva-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Field({ label, value, onChange, type = "text", placeholder = "", required = true }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className="field" type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="label">{label}</label>
      <select className="field" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </div>
  );
}
