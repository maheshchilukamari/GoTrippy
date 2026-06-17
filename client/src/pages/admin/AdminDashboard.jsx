import {
  Bell,
  Car,
  CheckCircle2,
  ImagePlus,
  IndianRupee,
  KeyRound,
  LogOut,
  Mail,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  Trash2,
  UserRound
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import http, { getApiError } from "../../api/http.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { statusOptions, tripTypes } from "../../data/siteData.js";
import { formatDate, formatRupees } from "../../utils/formatters.js";

const carBlank = {
  name: "",
  slug: "",
  imageUrl: "",
  registrationNumber: "",
  assignedAgent: "",
  seatingCapacity: "",
  luggageCapacity: "",
  idealUseCases: "",
  priceEstimate: "",
  description: "",
  isActive: true,
  status: "ACTIVE"
};

const agentBlank = {
  fullName: "",
  mobileNumber: "",
  whatsappNumber: "",
  alternateNumber: "",
  licenseNumber: "",
  status: "Active",
  profilePhoto: ""
};

const vehicleUseCases = [
  "Family trips",
  "Temple trips",
  "Airport rides",
  "Outstation travel",
  "City rides",
  "Picnic trips",
  "Small family travel"
];

const pricingBlank = {
  title: "",
  category: "Per Kilometer",
  price: "",
  unit: "",
  carType: "Both",
  description: "",
  inclusions: "",
  isActive: true
};

const vehicleApprovalStatuses = ["PENDING_APPROVAL", "ACTIVE", "INACTIVE", "REJECTED"];

const selfDriveCarBlank = {
  name: "",
  imageUrl: "",
  fuelType: "Petrol",
  transmission: "Manual",
  seatingCapacity: "",
  pricePerDay: "",
  securityDeposit: "",
  requiredDocuments: "Valid Driving License, Aadhaar Card, PAN Card or Passport, Security Deposit",
  availabilityStatus: "Available",
  isActive: true,
  status: "ACTIVE"
};

const selfDriveStatuses = ["Pending", "Approved", "Rejected", "Completed"];
const selfDriveAvailability = ["Available", "Unavailable", "Maintenance"];

const accountBlank = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "AGENT",
  status: "ACTIVE"
};

const superAdminTabs = [
  { id: "dashboard", label: "Dashboard", icon: CheckCircle2 },
  { id: "bookings", label: "Bookings", icon: CheckCircle2 },
  { id: "cars", label: "Vehicles", icon: Car },
  { id: "agents", label: "Agents", icon: UserRound },
  { id: "self-drive", label: "Self-Drive", icon: KeyRound },
  { id: "pricing", label: "Pricing", icon: IndianRupee },
  { id: "messages", label: "Messages", icon: Mail },
  { id: "settings", label: "Settings", icon: Settings }
];

const agentTabs = [
  { id: "bookings", label: "My Bookings", icon: CheckCircle2 },
  { id: "cars", label: "My Vehicles", icon: Car },
  { id: "self-drive", label: "My Self-Drive", icon: KeyRound },
  { id: "pricing", label: "My Pricing", icon: IndianRupee },
  { id: "settings", label: "My Profile", icon: Settings }
];

const createSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const sanitizePhone = (value) => value.replace(/\D/g, "");

const displayPhone = (value) => {
  const digits = sanitizePhone(String(value || ""));
  if (!digits) return "";
  return digits.startsWith("91") ? `+${digits}` : `+91 ${digits}`;
};

const getAgentId = (agent) => {
  if (!agent) return "";
  if (typeof agent === "string") return agent;
  return agent._id || "";
};

const getVehiclePartner = (car) => car.ownerAgentId || car.assignedAgent || null;

const resizeVehicleImage = (file) =>
  new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please upload an image file."));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const maxWidth = 1200;
        const scale = Math.min(1, maxWidth / image.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);

        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };

      image.onerror = () => reject(new Error("Could not read this image."));
      image.src = reader.result;
    };

    reader.onerror = () => reject(new Error("Could not read this image."));
    reader.readAsDataURL(file);
  });

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const isAgent = admin?.role === "AGENT";
  const tabs = isAgent ? agentTabs : superAdminTabs;
  const [activeTab, setActiveTab] = useState(isAgent ? "cars" : "dashboard");

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="page-shell flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-saffron-600">GoTrippy</p>
            <h1 className="text-2xl font-black text-shiva-900">{isAgent ? "Agent Dashboard" : "GoTrippy Dashboard"}</h1>
            <p className="text-sm text-slate-600">{admin?.name} {admin?.role ? `| ${admin.role.replace("_", " ")}` : ""}</p>
          </div>
          <button className="btn-outline" onClick={logout}>
            <LogOut size={17} /> Logout
          </button>
        </div>
      </header>

      <div className="page-shell py-6">
        <div className="mb-6 flex gap-2 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`inline-flex min-w-max items-center gap-2 rounded-md px-4 py-2.5 text-sm font-bold transition ${
                activeTab === id ? "bg-shiva-900 text-white" : "border border-slate-200 bg-white text-slate-700"
              }`}
              onClick={() => setActiveTab(id)}
            >
              <Icon size={17} /> {label}
            </button>
          ))}
        </div>

        {activeTab === "dashboard" && <DashboardPanel />}
        {activeTab === "bookings" && <BookingsPanel />}
        {activeTab === "cars" && <CarsPanel />}
        {activeTab === "agents" && <AccountsPanel />}
        {activeTab === "self-drive" && <SelfDriveAdminPanel />}
        {activeTab === "pricing" && <PricingPanel />}
        {activeTab === "messages" && <MessagesPanel />}
        {activeTab === "settings" && <ProfilePanel />}
      </div>
    </main>
  );
}

function DashboardPanel() {
  const [summary, setSummary] = useState({ bookings: 0, vehicles: 0, selfDriveCars: 0, accounts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      http.get("/bookings"),
      http.get("/cars", { params: { includeInactive: true } }),
      http.get("/self-drive/cars", { params: { includeInactive: true } }),
      http.get("/accounts")
    ])
      .then(([bookings, vehicles, selfDriveCars, accounts]) => {
        setSummary({
          bookings: bookings.data.length,
          vehicles: vehicles.data.length,
          selfDriveCars: selfDriveCars.data.length,
          accounts: accounts.data.length
        });
      })
      .catch((error) => toast.error(getApiError(error)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading dashboard" />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <ReportTile label="Total bookings" value={summary.bookings} />
      <ReportTile label="Driver cars" value={summary.vehicles} />
      <ReportTile label="Self-drive cars" value={summary.selfDriveCars} />
      <ReportTile label="Partner accounts" value={summary.accounts} />
    </div>
  );
}

function AccountsPanel() {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState(accountBlank);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const { data } = await http.get("/accounts");
      setAccounts(data);
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const saveAccount = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      phone: sanitizePhone(form.phone)
    };

    if (editingId && !payload.password) {
      delete payload.password;
    }

    try {
      if (editingId) {
        await http.put(`/accounts/${editingId}`, payload);
        toast.success("Account updated.");
      } else {
        await http.post("/accounts", payload);
        toast.success("Partner account created.");
      }
      setForm(accountBlank);
      setEditingId(null);
      loadAccounts();
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const editAccount = (account) => {
    setEditingId(account._id);
    setForm({
      name: account.name || "",
      email: account.email || "",
      phone: account.phone || "",
      password: "",
      role: account.role || "AGENT",
      status: account.status || "ACTIVE"
    });
  };

  if (loading) {
    return <LoadingSpinner label="Loading partner accounts" />;
  }

  return (
    <CrudPanel
      title={editingId ? "Edit partner account" : "Create partner account"}
      form={
        <form className="grid gap-4" onSubmit={saveAccount}>
          <div className="rounded-lg border border-saffron-400/30 bg-saffron-400/10 p-4">
            <h3 className="font-black text-shiva-900">Super Admin account controls</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Create Super Admin or Agent / Vehicle Owner logins. Agents can manage only their own vehicles, pricing, and assigned bookings.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <AdminInput label="Name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
            <AdminInput label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
            <AdminInput label="Phone" value={form.phone} onChange={(value) => setForm({ ...form, phone: sanitizePhone(value) })} required={false} />
            <AdminInput label={editingId ? "New password" : "Password"} type="password" value={form.password} onChange={(value) => setForm({ ...form, password: value })} required={!editingId} />
            <div>
              <label className="label">Role</label>
              <select className="field" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="AGENT">Agent / Vehicle Owner</option>
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="field" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="btn-primary" type="submit">
              <Save size={17} /> {editingId ? "Update Account" : "Create Account"}
            </button>
            {editingId && (
              <button className="btn-outline" type="button" onClick={() => { setEditingId(null); setForm(accountBlank); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      }
      list={
        <div className="grid gap-4">
          <div>
            <h2 className="text-xl font-black text-shiva-900">Partner accounts</h2>
            <p className="mt-1 text-sm text-slate-600">View agent activity, vehicles, bookings, and account status.</p>
          </div>
          {accounts.map((account) => (
            <AdminListItem
              key={account._id}
              title={account.name}
              subtitle={`${account.email} | ${account.role.replace("_", " ")} | ${account.status} | Vehicles: ${account.vehicleCount || 0} | Bookings: ${account.bookingCount || 0}`}
            >
              <button className="btn-outline" onClick={() => editAccount(account)}>
                <RefreshCw size={16} /> Edit
              </button>
            </AdminListItem>
          ))}
        </div>
      }
    />
  );
}

function ProfilePanel() {
  const { admin } = useAuth();

  return (
    <AdminCard>
      <p className="text-sm font-black uppercase tracking-wide text-saffron-600">My Profile</p>
      <h2 className="mt-1 text-2xl font-black text-shiva-900">{admin?.name}</h2>
      <div className="mt-4 grid gap-2 text-sm text-slate-700">
        <span><strong>Email:</strong> {admin?.email}</span>
        <span><strong>Phone:</strong> {admin?.phone ? displayPhone(admin.phone) : "Not added"}</span>
        <span><strong>Role:</strong> {admin?.role?.replace("_", " ")}</span>
        <span><strong>Status:</strong> {admin?.status || "ACTIVE"}</span>
      </div>
    </AdminCard>
  );
}

function BookingsPanel() {
  const { admin } = useAuth();
  const isSuperAdmin = admin?.role !== "AGENT";
  const [bookings, setBookings] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ date: "", status: "", tripType: "", car: "", agent: "" });
  const [lastRefreshedAt, setLastRefreshedAt] = useState(null);
  const knownBookingIds = useRef(new Set());
  const initialLoadDone = useRef(false);

  const loadAgents = async () => {
    if (!isSuperAdmin) return;
    try {
      const { data } = await http.get("/agents", { params: { includeInactive: true } });
      setAgents(data);
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const loadBookings = async ({ silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
    }

    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
      const { data } = await http.get("/bookings", { params });

      if (initialLoadDone.current) {
        const newBookings = data.filter((booking) => !knownBookingIds.current.has(booking._id));

        if (newBookings.length > 0) {
          toast.success(`New booking from ${newBookings[0].customerName}`);
        }
      }

      knownBookingIds.current = new Set(data.map((booking) => booking._id));
      initialLoadDone.current = true;
      setBookings(data);
      setLastRefreshedAt(new Date());
    } catch (error) {
      if (!silent) {
        toast.error(getApiError(error));
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadAgents();
    loadBookings();
    const intervalId = window.setInterval(() => loadBookings({ silent: true }), 30000);

    return () => window.clearInterval(intervalId);
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await http.patch(`/bookings/${id}/status`, { status });
      setBookings((current) => current.map((booking) => (booking._id === id ? { ...booking, status: data.status } : booking)));
      toast.success("Booking status updated.");
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading bookings" />;
  }

  const pendingBookings = bookings.filter((booking) => booking.status === "Pending");
  const latestPending = pendingBookings[0];

  return (
    <section className="grid gap-5">
      <AdminCard>
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-saffron-400/20 text-saffron-600">
              <Bell size={22} />
            </span>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-saffron-600">Agent booking alerts</p>
              <h2 className="mt-1 text-2xl font-black text-shiva-900">
                {pendingBookings.length} pending booking{pendingBookings.length === 1 ? "" : "s"}
              </h2>
              {latestPending ? (
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Latest: {latestPending.customerName}, +91 {latestPending.phoneNumber}, {latestPending.tripType} from {latestPending.pickupLocation} to {latestPending.dropLocation} on {formatDate(latestPending.travelDate)} at {latestPending.travelTime}. Assigned to {latestPending.assignedAgentId?.fullName || latestPending.assignedAgentName || "not assigned"}.
                </p>
              ) : (
                <p className="mt-2 text-sm text-slate-600">No pending requests right now.</p>
              )}
              {lastRefreshedAt && (
                <p className="mt-2 text-xs font-semibold text-slate-500">
                  Auto-refreshes every 30 seconds. Last checked {lastRefreshedAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}.
                </p>
              )}
            </div>
          </div>
          <button className="btn-outline" onClick={() => loadBookings()}>
            <RefreshCw size={16} /> Check Now
          </button>
        </div>
      </AdminCard>

      <AdminCard>
        <div className={`grid gap-3 ${isSuperAdmin ? "md:grid-cols-6" : "md:grid-cols-5"}`}>
          <input className="field" type="date" value={filters.date} onChange={(event) => setFilters({ ...filters, date: event.target.value })} />
          <select className="field" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
            <option value="">All statuses</option>
            {statusOptions.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
          <select className="field" value={filters.tripType} onChange={(event) => setFilters({ ...filters, tripType: event.target.value })}>
            <option value="">All trip types</option>
            {tripTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
          <select className="field" value={filters.car} onChange={(event) => setFilters({ ...filters, car: event.target.value })}>
            <option value="">All cars</option>
            <option>Maruti Suzuki Ertiga</option>
            <option>Maruti Suzuki Swift Dzire</option>
            <option>Any Available Car</option>
          </select>
          {isSuperAdmin && (
            <select className="field" value={filters.agent} onChange={(event) => setFilters({ ...filters, agent: event.target.value })}>
              <option value="">All agents</option>
              {agents.map((agent) => (
                <option key={agent._id} value={agent._id}>{agent.fullName}</option>
              ))}
            </select>
          )}
          <button className="btn-primary" onClick={loadBookings}>
            <Search size={17} /> Filter
          </button>
        </div>
      </AdminCard>

      <div className="grid gap-4">
        {bookings.map((booking) => {
          const vehicleName = booking.selectedVehicleId?.name || booking.preferredCarName;
          const registrationNumber = booking.selectedVehicleId?.registrationNumber;
          const agentName = booking.assignedAgentId?.fullName || booking.assignedAgentName;
          const agentPhone = booking.assignedAgentId?.whatsappNumber || booking.assignedAgentPhone;

          return (
            <AdminCard key={booking._id}>
              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.7fr]">
                <div>
                  <h3 className="text-lg font-black text-shiva-900">{booking.customerName}</h3>
                  <p className="mt-1 text-sm font-semibold text-slate-600">+91 {booking.phoneNumber}</p>
                  <p className="mt-3 text-sm text-slate-700">
                    <strong>Pickup:</strong> {booking.pickupLocation}
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    <strong>Drop:</strong> {booking.dropLocation}
                  </p>
                  {booking.additionalNotes && <p className="mt-2 text-sm text-slate-500">{booking.additionalNotes}</p>}
                </div>
                <div className="grid gap-2 text-sm text-slate-700">
                  <span><strong>Trip:</strong> {booking.tripType}</span>
                  <span><strong>Date:</strong> {formatDate(booking.travelDate)} at {booking.travelTime}</span>
                  <span><strong>Passengers:</strong> {booking.passengers}</span>
                  <span><strong>Vehicle:</strong> {vehicleName}{registrationNumber ? ` (${registrationNumber})` : ""}</span>
                  <span><strong>Assigned agent:</strong> {agentName || "Not assigned"}</span>
                  {agentPhone && <span><strong>Agent contact:</strong> {displayPhone(agentPhone)}</span>}
                </div>
                <div>
                  <label className="label" htmlFor={`status-${booking._id}`}>Status</label>
                  <select
                    className="field"
                    id={`status-${booking._id}`}
                    value={booking.status}
                    onChange={(event) => updateStatus(booking._id, event.target.value)}
                  >
                    {statusOptions.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                  <a className="btn-outline mt-3 w-full" href={`/booking-confirmation/${booking._id}`} target="_blank" rel="noreferrer">
                    Open Chat
                  </a>
                </div>
              </div>
            </AdminCard>
          );
        })}
        {bookings.length === 0 && <EmptyState label="No bookings found for the selected filters." />}
      </div>
    </section>
  );
}

function CarsPanel() {
  const { admin } = useAuth();
  const isSuperAdmin = admin?.role !== "AGENT";
  const [cars, setCars] = useState([]);
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState(carBlank);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [carsResponse, agentsResponse] = await Promise.all([
        http.get("/cars", { params: { includeInactive: true } }),
        isSuperAdmin ? http.get("/agents", { params: { includeInactive: true } }) : Promise.resolve({ data: [] })
      ]);
      setCars(carsResponse.data);
      setAgents(agentsResponse.data);
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveCar = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      slug: form.slug || createSlug(form.name),
      assignedAgent: isSuperAdmin ? form.assignedAgent || undefined : undefined,
      idealUseCases: form.idealUseCases.split(",").map((item) => item.trim()).filter(Boolean)
    };

    try {
      if (editingId) {
        await http.put(`/cars/${editingId}`, payload);
        toast.success("Vehicle updated.");
      } else {
        await http.post("/cars", payload);
        toast.success("Vehicle added.");
      }
      setForm(carBlank);
      setEditingId(null);
      loadData();
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const updateVehicleName = (value) => {
    setForm((current) => ({
      ...current,
      name: value,
      slug: editingId ? current.slug : createSlug(value)
    }));
  };

  const uploadVehicleImage = async (file) => {
    if (!file) return;

    try {
      const imageUrl = await resizeVehicleImage(file);
      setForm((current) => ({ ...current, imageUrl }));
      toast.success("Vehicle image uploaded.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleUseCase = (useCase) => {
    const selected = form.idealUseCases.split(",").map((item) => item.trim()).filter(Boolean);
    const next = selected.includes(useCase)
      ? selected.filter((item) => item !== useCase)
      : [...selected, useCase];

    setForm({ ...form, idealUseCases: next.join(", ") });
  };

  const editCar = (car) => {
    setEditingId(car._id);
    setForm({
      ...carBlank,
      ...car,
      assignedAgent: getAgentId(car.assignedAgent),
      idealUseCases: car.idealUseCases?.join(", ") || ""
    });
  };

  const deleteCar = async (id) => {
    if (!window.confirm("Delete this vehicle?")) return;

    try {
      await http.delete(`/cars/${id}`);
      toast.success("Vehicle deleted.");
      loadData();
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading vehicles" />;
  }

  return (
    <CrudPanel
      title={editingId ? "Edit vehicle listing" : "Add new vehicle"}
      form={
        <form className="grid gap-4" onSubmit={saveCar}>
          <div className="rounded-lg border border-saffron-400/30 bg-saffron-400/10 p-4">
            <h3 className="font-black text-shiva-900">Vehicle listing details</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Add the car, registration, photo, capacity, and price guidance. Bookings go to the vehicle owner account automatically.
            </p>
          </div>

          <div>
            <label className="label" htmlFor="vehicle-image">Vehicle photo</label>
            <label
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-saffron-500 hover:bg-saffron-400/10"
              htmlFor="vehicle-image"
            >
              <ImagePlus className="text-saffron-600" size={28} />
              <span className="mt-2 text-sm font-black text-shiva-900">Upload vehicle image</span>
              <span className="mt-1 text-xs font-semibold text-slate-500">JPG, PNG, or WEBP. The app compresses it before saving.</span>
            </label>
            <input
              className="sr-only"
              id="vehicle-image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => uploadVehicleImage(event.target.files?.[0])}
            />
          </div>

          {form.imageUrl && (
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              <img className="h-52 w-full object-cover" src={form.imageUrl} alt={form.name || "Vehicle preview"} />
              <div className="px-4 py-3 text-sm font-bold text-slate-600">Image preview</div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <AdminInput label="Vehicle name" placeholder="Example: Toyota Innova Crysta" value={form.name} onChange={updateVehicleName} />
            <AdminInput label="Slug" placeholder="toyota-innova-crysta" value={form.slug} onChange={(value) => setForm({ ...form, slug: value })} help="Auto-filled from vehicle name, but you can edit it." />
            <AdminInput label="Registration number" placeholder="Example: TS09AB1234" value={form.registrationNumber} onChange={(value) => setForm({ ...form, registrationNumber: value.toUpperCase() })} required={false} />
            <AdminInput label="Seating capacity" placeholder="Example: 6-7 passengers" value={form.seatingCapacity} onChange={(value) => setForm({ ...form, seatingCapacity: value })} />
            <AdminInput label="Luggage capacity" placeholder="Example: 3 medium bags" value={form.luggageCapacity} onChange={(value) => setForm({ ...form, luggageCapacity: value })} />
            <AdminInput label="Price estimate" placeholder="Example: Starts from Rs. 20/km" value={form.priceEstimate} onChange={(value) => setForm({ ...form, priceEstimate: value })} />
            {isSuperAdmin && (
              <div>
                <label className="label" htmlFor="vehicle-status">Listing status</label>
                <select className="field" id="vehicle-status" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                  {vehicleApprovalStatuses.map((status) => (
                    <option key={status} value={status}>{status.replace("_", " ")}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {isSuperAdmin && (
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <h3 className="font-black text-shiva-900">Assigned Driver / Agent</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Optional override for Super Admin. If left empty, bookings notify the vehicle owner account.
              </p>
              <label className="label mt-3" htmlFor="assignedAgent">Driver profile</label>
              <select
                className="field"
                id="assignedAgent"
                value={form.assignedAgent}
                onChange={(event) => setForm({ ...form, assignedAgent: event.target.value })}
              >
                <option value="">Use vehicle owner account</option>
                {agents.map((agent) => (
                  <option key={agent._id} value={agent._id} disabled={agent.status !== "Active"}>
                    {agent.fullName} - {displayPhone(agent.whatsappNumber)}{agent.status !== "Active" ? " (Inactive)" : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="label">Best for</label>
            <div className="flex flex-wrap gap-2">
              {vehicleUseCases.map((useCase) => {
                const selected = form.idealUseCases.split(",").map((item) => item.trim()).includes(useCase);

                return (
                  <button
                    key={useCase}
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                      selected
                        ? "border-saffron-500 bg-saffron-400/20 text-saffron-600"
                        : "border-slate-200 bg-white text-slate-600 hover:border-saffron-500"
                    }`}
                    type="button"
                    onClick={() => toggleUseCase(useCase)}
                  >
                    {useCase}
                  </button>
                );
              })}
            </div>
            <input
              className="field mt-3"
              value={form.idealUseCases}
              onChange={(event) => setForm({ ...form, idealUseCases: event.target.value })}
              placeholder="Or type custom use cases separated by commas"
            />
          </div>

          <AdminTextarea label="Vehicle description" placeholder="Describe comfort, route suitability, family use, luggage space, and ride type." value={form.description} onChange={(value) => setForm({ ...form, description: value })} />
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} />
            Show this vehicle on the website
          </label>
          <div className="flex flex-wrap gap-3">
            <button className="btn-primary" type="submit">
              <Save size={17} /> {editingId ? "Update Vehicle" : "Add Vehicle"}
            </button>
            {editingId && (
              <button className="btn-outline" type="button" onClick={() => { setEditingId(null); setForm(carBlank); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      }
      list={
        <div className="grid gap-4">
          <div>
            <h2 className="text-xl font-black text-shiva-900">Current vehicle listings</h2>
            <p className="mt-1 text-sm text-slate-600">Edit details anytime. Active vehicles are bookable and notify the vehicle owner account.</p>
          </div>
          {cars.map((car) => {
            const assignedAgent = car.assignedAgent;
            const responsiblePartner = getVehiclePartner(car);
            const hasInactiveAgent = assignedAgent && assignedAgent.status !== "Active";

            return (
              <div key={car._id} className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-[140px_1fr]">
                <img className="h-28 w-full rounded-md object-cover" src={car.imageUrl} alt={car.name} />
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-shiva-900">{car.name}</h3>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${car.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                        {car.isActive ? "Active" : "Hidden"}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        {(car.status || "ACTIVE").replace("_", " ")}
                      </span>
                      {hasInactiveAgent && <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">Agent inactive</span>}
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{car.seatingCapacity} | {car.luggageCapacity}</p>
                    {car.registrationNumber && <p className="mt-1 text-sm text-slate-600">Registration: {car.registrationNumber}</p>}
                    <p className="mt-1 text-sm text-slate-600">
                      Responsible partner: <span className="font-semibold">{responsiblePartner?.name || responsiblePartner?.fullName || "Vehicle owner account"}</span>
                      {responsiblePartner?.whatsappNumber || responsiblePartner?.phone ? ` | ${displayPhone(responsiblePartner.whatsappNumber || responsiblePartner.phone)}` : ""}
                    </p>
                    {assignedAgent && <p className="mt-1 text-xs font-bold text-slate-500">Driver profile override selected.</p>}
                    {hasInactiveAgent && <p className="mt-1 text-xs font-bold text-red-600">Selected driver profile is inactive. Use the vehicle owner account or choose an active driver profile.</p>}
                    <p className="mt-1 text-sm font-semibold text-saffron-600">{car.priceEstimate}</p>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">{car.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button className="btn-outline" onClick={() => editCar(car)}>
                      <RefreshCw size={16} /> Edit
                    </button>
                    <button className="btn-outline" onClick={() => deleteCar(car._id)}>
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {cars.length === 0 && <EmptyState label="No vehicles yet." />}
        </div>
      }
    />
  );
}

function AgentsPanel() {
  const [agents, setAgents] = useState([]);
  const [reports, setReports] = useState([]);
  const [mostBookedVehicle, setMostBookedVehicle] = useState(null);
  const [form, setForm] = useState(agentBlank);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAgents = async () => {
    setLoading(true);
    try {
      const [agentsResponse, reportsResponse] = await Promise.all([
        http.get("/agents", { params: { includeInactive: true } }),
        http.get("/agents/reports")
      ]);
      setAgents(agentsResponse.data);
      setReports(reportsResponse.data.agents || []);
      setMostBookedVehicle(reportsResponse.data.mostBookedVehicle || null);
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const uploadAgentPhoto = async (file) => {
    if (!file) return;

    try {
      const profilePhoto = await resizeVehicleImage(file);
      setForm((current) => ({ ...current, profilePhoto }));
      toast.success("Driver photo uploaded.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const saveAgent = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      mobileNumber: sanitizePhone(form.mobileNumber),
      whatsappNumber: sanitizePhone(form.whatsappNumber),
      alternateNumber: sanitizePhone(form.alternateNumber)
    };

    try {
      if (editingId) {
        await http.put(`/agents/${editingId}`, payload);
        toast.success("Agent updated.");
      } else {
        await http.post("/agents", payload);
        toast.success("Agent added.");
      }
      setForm(agentBlank);
      setEditingId(null);
      loadAgents();
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const editAgent = (agent) => {
    setEditingId(agent._id);
    setForm({
      ...agentBlank,
      ...agent
    });
  };

  const deleteAgent = async (id) => {
    if (!window.confirm("Delete this agent? Active assigned vehicles will block deletion.")) return;

    try {
      await http.delete(`/agents/${id}`);
      toast.success("Agent deleted.");
      loadAgents();
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading agents" />;
  }

  const reportByAgentId = new Map(reports.map((report) => [report.agentId, report]));

  return (
    <CrudPanel
      title={editingId ? "Edit assigned driver / agent" : "Add assigned driver / agent"}
      form={
        <form className="grid gap-4" onSubmit={saveAgent}>
          <div className="rounded-lg border border-saffron-400/30 bg-saffron-400/10 p-4">
            <h3 className="font-black text-shiva-900">Assigned Driver / Agent</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Create the driver profile once, then assign one or more vehicles to this agent from the Vehicles tab.
            </p>
          </div>

          <div>
            <label className="label" htmlFor="agent-photo">Driver photo</label>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center transition hover:border-saffron-500 hover:bg-saffron-400/10" htmlFor="agent-photo">
              <ImagePlus className="text-saffron-600" size={24} />
              <span className="mt-2 text-sm font-black text-shiva-900">Upload driver photo</span>
              <span className="mt-1 text-xs font-semibold text-slate-500">Optional JPG, PNG, or WEBP.</span>
            </label>
            <input className="sr-only" id="agent-photo" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => uploadAgentPhoto(event.target.files?.[0])} />
          </div>

          {form.profilePhoto && (
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <img className="h-16 w-16 rounded-md object-cover" src={form.profilePhoto} alt={form.fullName || "Driver preview"} />
              <span className="text-sm font-bold text-slate-600">Driver photo selected</span>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <AdminInput label="Agent full name" value={form.fullName} onChange={(value) => setForm({ ...form, fullName: value })} />
            <AdminInput label="Mobile number" value={form.mobileNumber} onChange={(value) => setForm({ ...form, mobileNumber: sanitizePhone(value) })} />
            <AdminInput label="WhatsApp number" value={form.whatsappNumber} onChange={(value) => setForm({ ...form, whatsappNumber: sanitizePhone(value) })} />
            <AdminInput label="Alternate number" value={form.alternateNumber} onChange={(value) => setForm({ ...form, alternateNumber: sanitizePhone(value) })} required={false} />
            <AdminInput label="Driver license number" value={form.licenseNumber} onChange={(value) => setForm({ ...form, licenseNumber: value.toUpperCase() })} required={false} />
            <div>
              <label className="label" htmlFor="driver-status">Driver status</label>
              <select className="field" id="driver-status" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          {form.status === "Inactive" && (
            <p className="rounded-md bg-red-50 p-3 text-sm font-bold text-red-700">
              Inactive agents cannot receive new vehicle bookings. Reassign active vehicles before taking this driver offline.
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button className="btn-primary" type="submit">
              <Save size={17} /> {editingId ? "Update Agent" : "Add Agent"}
            </button>
            {editingId && (
              <button className="btn-outline" type="button" onClick={() => { setEditingId(null); setForm(agentBlank); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      }
      list={
        <div className="grid gap-5">
          <div>
            <h2 className="text-xl font-black text-shiva-900">Agent management</h2>
            <p className="mt-1 text-sm text-slate-600">Assign multiple vehicles to one agent from the Vehicles tab, then filter bookings by agent.</p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <ReportTile label="Agents" value={agents.length} />
            <ReportTile label="Most booked vehicle" value={mostBookedVehicle?.name || "No bookings yet"} />
            <ReportTile label="Tracked bookings" value={reports.reduce((total, item) => total + item.totalBookings, 0)} />
          </div>

          {agents.map((agent) => {
            const report = reportByAgentId.get(agent._id);
            const assignedVehicles = agent.assignedVehicles || [];

            return (
              <div key={agent._id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-3">
                    {agent.profilePhoto ? (
                      <img className="h-16 w-16 rounded-md object-cover" src={agent.profilePhoto} alt={agent.fullName} />
                    ) : (
                      <span className="grid h-16 w-16 place-items-center rounded-md bg-shiva-900 text-white">
                        <UserRound size={24} />
                      </span>
                    )}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black text-shiva-900">{agent.fullName}</h3>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${agent.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                          {agent.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">Mobile: {displayPhone(agent.mobileNumber)}</p>
                      <p className="mt-1 text-sm text-slate-600">WhatsApp: {displayPhone(agent.whatsappNumber)}</p>
                      {agent.licenseNumber && <p className="mt-1 text-sm text-slate-600">License: {agent.licenseNumber}</p>}
                      <p className="mt-2 text-sm font-semibold text-saffron-600">
                        Vehicles: {assignedVehicles.length ? assignedVehicles.map((car) => car.name).join(", ") : "None assigned"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button className="btn-outline" onClick={() => editAgent(agent)}>
                      <RefreshCw size={16} /> Edit
                    </button>
                    <button className="btn-outline" onClick={() => deleteAgent(agent._id)}>
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  <ReportTile label="Bookings" value={report?.totalBookings || 0} />
                  <ReportTile label="Revenue" value={formatRupees(report?.revenue || 0)} />
                  <ReportTile label="Active vehicles" value={report?.activeVehicles || 0} />
                  <ReportTile label="Utilization" value={`${report?.utilizationPercent || 0}%`} />
                </div>
              </div>
            );
          })}
          {agents.length === 0 && <EmptyState label="No agents yet. Add one before publishing vehicles." />}
        </div>
      }
    />
  );
}

function SelfDriveAdminPanel() {
  const [selfDriveCars, setSelfDriveCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState(selfDriveCarBlank);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({ status: "", car: "" });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
      const [carsResponse, bookingsResponse] = await Promise.all([
        http.get("/self-drive/cars", { params: { includeInactive: true } }),
        http.get("/self-drive/bookings", { params })
      ]);
      setSelfDriveCars(carsResponse.data);
      setBookings(bookingsResponse.data);
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const uploadSelfDriveImage = async (file) => {
    if (!file) return;

    try {
      const imageUrl = await resizeVehicleImage(file);
      setForm((current) => ({ ...current, imageUrl }));
      toast.success("Self-drive car image uploaded.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const saveSelfDriveCar = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      pricePerDay: Number(form.pricePerDay),
      securityDeposit: Number(form.securityDeposit),
      requiredDocuments: form.requiredDocuments.split(",").map((item) => item.trim()).filter(Boolean)
    };

    try {
      if (editingId) {
        await http.put(`/self-drive/cars/${editingId}`, payload);
        toast.success("Self-drive car updated.");
      } else {
        await http.post("/self-drive/cars", payload);
        toast.success("Self-drive car added.");
      }
      setForm(selfDriveCarBlank);
      setEditingId(null);
      loadData();
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const editSelfDriveCar = (car) => {
    setEditingId(car._id);
    setForm({
      ...selfDriveCarBlank,
      ...car,
      requiredDocuments: car.requiredDocuments?.join(", ") || selfDriveCarBlank.requiredDocuments
    });
  };

  const deleteSelfDriveCar = async (id) => {
    if (!window.confirm("Delete this self-drive car?")) return;

    try {
      await http.delete(`/self-drive/cars/${id}`);
      toast.success("Self-drive car deleted.");
      loadData();
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const updateSelfDriveStatus = async (id, status) => {
    try {
      const { data } = await http.patch(`/self-drive/bookings/${id}/status`, { status });
      setBookings((current) => current.map((booking) => (booking._id === id ? data : booking)));
      toast.success("Self-drive booking status updated.");
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading self-drive bookings" />;
  }

  return (
    <div className="grid gap-6">
      <AdminCard>
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-saffron-600">Self-drive booking requests</p>
            <h2 className="mt-1 text-2xl font-black text-shiva-900">{bookings.length} request{bookings.length === 1 ? "" : "s"}</h2>
            <p className="mt-2 text-sm text-slate-600">These are separate from normal cab bookings with driver.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-[180px_220px_auto]">
            <select className="field" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
              <option value="">All statuses</option>
              {selfDriveStatuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
            <select className="field" value={filters.car} onChange={(event) => setFilters({ ...filters, car: event.target.value })}>
              <option value="">All self-drive cars</option>
              {selfDriveCars.map((car) => (
                <option key={car._id} value={car._id}>{car.name}</option>
              ))}
            </select>
            <button className="btn-primary" onClick={loadData}>
              <Search size={17} /> Filter
            </button>
          </div>
        </div>
      </AdminCard>

      <div className="grid gap-4">
        {bookings.map((booking) => (
          <AdminCard key={booking._id}>
            <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr_220px]">
              <div>
                <h3 className="text-lg font-black text-shiva-900">{booking.customerName}</h3>
                <p className="mt-1 text-sm font-semibold text-slate-600">+91 {booking.phoneNumber}</p>
                <p className="mt-3 text-sm text-slate-700"><strong>License:</strong> {booking.drivingLicenseNumber}</p>
                <p className="mt-1 text-sm text-slate-700"><strong>Pickup location:</strong> {booking.pickupLocation}</p>
                {booking.notes && <p className="mt-2 text-sm text-slate-500">{booking.notes}</p>}
              </div>
              <div className="grid gap-2 text-sm text-slate-700">
                <span><strong>Car:</strong> {booking.selectedCar?.name || "Deleted car"}</span>
                <span><strong>Pickup:</strong> {formatDate(booking.pickupDate)}</span>
                <span><strong>Return:</strong> {formatDate(booking.returnDate)}</span>
                <span><strong>Daily price:</strong> {formatRupees(booking.selectedCar?.pricePerDay || 0)}</span>
                <span><strong>Deposit:</strong> {formatRupees(booking.selectedCar?.securityDeposit || 0)}</span>
                <span><strong>Documents:</strong> {booking.documentNote || "Upload placeholder / pending verification"}</span>
              </div>
              <div>
                <label className="label" htmlFor={`self-drive-status-${booking._id}`}>Status</label>
                <select
                  className="field"
                  id={`self-drive-status-${booking._id}`}
                  value={booking.status}
                  onChange={(event) => updateSelfDriveStatus(booking._id, event.target.value)}
                >
                  {selfDriveStatuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </AdminCard>
        ))}
        {bookings.length === 0 && <EmptyState label="No self-drive requests found." />}
      </div>

      <CrudPanel
        title={editingId ? "Edit self-drive car" : "Add self-drive car"}
        form={
          <form className="grid gap-4" onSubmit={saveSelfDriveCar}>
            <div>
              <label className="label" htmlFor="self-drive-image">Self-drive car image</label>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-saffron-500 hover:bg-saffron-400/10" htmlFor="self-drive-image">
                <ImagePlus className="text-saffron-600" size={28} />
                <span className="mt-2 text-sm font-black text-shiva-900">Upload car image</span>
                <span className="mt-1 text-xs font-semibold text-slate-500">JPG, PNG, or WEBP.</span>
              </label>
              <input className="sr-only" id="self-drive-image" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => uploadSelfDriveImage(event.target.files?.[0])} />
            </div>

            {form.imageUrl && (
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                <img className="h-48 w-full object-cover" src={form.imageUrl} alt={form.name || "Self-drive car preview"} />
                <div className="px-4 py-3 text-sm font-bold text-slate-600">Image preview</div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <AdminInput label="Car name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
              <AdminInput label="Fuel type" value={form.fuelType} onChange={(value) => setForm({ ...form, fuelType: value })} />
              <AdminInput label="Transmission type" value={form.transmission} onChange={(value) => setForm({ ...form, transmission: value })} />
              <AdminInput label="Seating capacity" value={form.seatingCapacity} onChange={(value) => setForm({ ...form, seatingCapacity: value })} />
              <AdminInput label="Price per day" type="number" value={form.pricePerDay} onChange={(value) => setForm({ ...form, pricePerDay: value })} />
              <AdminInput label="Security deposit" type="number" value={form.securityDeposit} onChange={(value) => setForm({ ...form, securityDeposit: value })} />
              <div>
                <label className="label" htmlFor="availabilityStatus">Availability status</label>
                <select className="field" id="availabilityStatus" value={form.availabilityStatus} onChange={(event) => setForm({ ...form, availabilityStatus: event.target.value })}>
                  {selfDriveAvailability.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="self-drive-approval">Listing status</label>
                <select className="field" id="self-drive-approval" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                  {vehicleApprovalStatuses.map((status) => (
                    <option key={status} value={status}>{status.replace("_", " ")}</option>
                  ))}
                </select>
              </div>
            </div>

            <AdminInput label="Required documents comma separated" value={form.requiredDocuments} onChange={(value) => setForm({ ...form, requiredDocuments: value })} />
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} />
              Show this self-drive car on the website
            </label>
            <div className="flex flex-wrap gap-3">
              <button className="btn-primary" type="submit">
                <Save size={17} /> {editingId ? "Update Self-Drive Car" : "Add Self-Drive Car"}
              </button>
              {editingId && (
                <button className="btn-outline" type="button" onClick={() => { setEditingId(null); setForm(selfDriveCarBlank); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        }
        list={
          <div className="grid gap-4">
            <div>
              <h2 className="text-xl font-black text-shiva-900">Self-drive car inventory</h2>
              <p className="mt-1 text-sm text-slate-600">Control price per day, deposit, required documents, and availability.</p>
            </div>
            {selfDriveCars.map((car) => (
              <div key={car._id} className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-[140px_1fr]">
                <img className="h-28 w-full rounded-md object-cover" src={car.imageUrl} alt={car.name} />
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-shiva-900">{car.name}</h3>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${car.availabilityStatus === "Available" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                        {car.availabilityStatus}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        {(car.status || "ACTIVE").replace("_", " ")}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{car.fuelType} | {car.transmission} | {car.seatingCapacity}</p>
                    <p className="mt-1 text-sm font-semibold text-saffron-600">{formatRupees(car.pricePerDay)}/day | Deposit {formatRupees(car.securityDeposit)}</p>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">{car.requiredDocuments?.join(", ")}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button className="btn-outline" onClick={() => editSelfDriveCar(car)}>
                      <RefreshCw size={16} /> Edit
                    </button>
                    <button className="btn-outline" onClick={() => deleteSelfDriveCar(car._id)}>
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {selfDriveCars.length === 0 && <EmptyState label="No self-drive cars yet." />}
          </div>
        }
      />
    </div>
  );
}

function PricingPanel() {
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState(pricingBlank);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPricing = async () => {
    setLoading(true);
    try {
      const { data } = await http.get("/pricing", { params: { includeInactive: true } });
      setPackages(data);
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPricing();
  }, []);

  const savePackage = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      inclusions: form.inclusions.split(",").map((item) => item.trim()).filter(Boolean)
    };

    try {
      if (editingId) {
        await http.put(`/pricing/${editingId}`, payload);
        toast.success("Pricing package updated.");
      } else {
        await http.post("/pricing", payload);
        toast.success("Pricing package added.");
      }
      setForm(pricingBlank);
      setEditingId(null);
      loadPricing();
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const editPackage = (item) => {
    setEditingId(item._id);
    setForm({
      ...item,
      inclusions: item.inclusions?.join(", ") || ""
    });
  };

  const deletePackage = async (id) => {
    if (!window.confirm("Delete this pricing package?")) return;

    try {
      await http.delete(`/pricing/${id}`);
      toast.success("Pricing package deleted.");
      loadPricing();
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading pricing" />;
  }

  return (
    <CrudPanel
      title={editingId ? "Edit pricing package" : "Add pricing package"}
      form={
        <form className="grid gap-4" onSubmit={savePackage}>
          <div className="grid gap-4 md:grid-cols-2">
            <AdminInput label="Title" value={form.title} onChange={(value) => setForm({ ...form, title: value })} />
            <AdminInput label="Price" type="number" value={form.price} onChange={(value) => setForm({ ...form, price: value })} />
            <div>
              <label className="label">Category</label>
              <select className="field" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                {["Per Kilometer", "Per Day", "Airport", "Temple", "Outstation", "Local", "Custom"].map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Car type</label>
              <select className="field" value={form.carType} onChange={(event) => setForm({ ...form, carType: event.target.value })}>
                {["Both", "Ertiga", "Swift Dzire"].map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>
            <AdminInput label="Unit" value={form.unit} onChange={(value) => setForm({ ...form, unit: value })} />
            <AdminInput label="Inclusions comma separated" value={form.inclusions} onChange={(value) => setForm({ ...form, inclusions: value })} />
          </div>
          <AdminTextarea label="Description" value={form.description} onChange={(value) => setForm({ ...form, description: value })} />
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} />
            Active
          </label>
          <div className="flex flex-wrap gap-3">
            <button className="btn-primary" type="submit">
              <Save size={17} /> Save Package
            </button>
            {editingId && (
              <button className="btn-outline" type="button" onClick={() => { setEditingId(null); setForm(pricingBlank); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      }
      list={
        <div className="grid gap-4">
          {packages.map((item) => (
            <AdminListItem key={item._id} title={item.title} subtitle={`${formatRupees(item.price)} ${item.unit} | ${item.category} | ${item.carType}`}>
              <button className="btn-outline" onClick={() => editPackage(item)}>
                <RefreshCw size={16} /> Edit
              </button>
              <button className="btn-outline" onClick={() => deletePackage(item._id)}>
                <Trash2 size={16} /> Delete
              </button>
            </AdminListItem>
          ))}
          {packages.length === 0 && <EmptyState label="No pricing packages yet." />}
        </div>
      }
    />
  );
}

function MessagesPanel() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const { data } = await http.get("/contact");
      setMessages(data);
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const toggleRead = async (message) => {
    try {
      const { data } = await http.patch(`/contact/${message._id}/read`, { isRead: !message.isRead });
      setMessages((current) => current.map((item) => (item._id === message._id ? data : item)));
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading messages" />;
  }

  return (
    <div className="grid gap-4">
      {messages.map((message) => (
        <AdminCard key={message._id}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-black text-shiva-900">{message.name}</h3>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${message.isRead ? "bg-slate-100 text-slate-600" : "bg-saffron-400/20 text-saffron-600"}`}>
                  {message.isRead ? "Read" : "New"}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600">+91 {message.phone} {message.email ? `| ${message.email}` : ""}</p>
              <p className="mt-3 text-sm leading-6 text-slate-700">{message.message}</p>
            </div>
            <button className="btn-outline" onClick={() => toggleRead(message)}>
              Mark {message.isRead ? "Unread" : "Read"}
            </button>
          </div>
        </AdminCard>
      ))}
      {messages.length === 0 && <EmptyState label="No contact messages yet." />}
    </div>
  );
}

function CrudPanel({ title, form, list }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
      <AdminCard>
        <div className="mb-4 flex items-center gap-2">
          <Plus size={20} className="text-saffron-600" />
          <h2 className="text-xl font-black text-shiva-900">{title}</h2>
        </div>
        {form}
      </AdminCard>
      <AdminCard>{list}</AdminCard>
    </div>
  );
}

function AdminCard({ children }) {
  return <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">{children}</div>;
}

function AdminInput({ label, value, onChange, type = "text", placeholder = "", help = "", required = true }) {
  const id = useMemo(() => label.toLowerCase().replaceAll(" ", "-"), [label]);

  return (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      <input
        className="field"
        id={id}
        type={type}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
      />
      {help && <p className="mt-1 text-xs font-semibold text-slate-500">{help}</p>}
    </div>
  );
}

function AdminTextarea({ label, value, onChange, placeholder = "" }) {
  const id = useMemo(() => label.toLowerCase().replaceAll(" ", "-"), [label]);

  return (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      <textarea className="field min-h-28" id={id} value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required />
    </div>
  );
}

function AdminListItem({ title, subtitle, children }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h3 className="font-black text-shiva-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function ReportTile({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black text-shiva-900">{value}</p>
    </div>
  );
}

function EmptyState({ label }) {
  return <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-bold text-slate-500">{label}</div>;
}
