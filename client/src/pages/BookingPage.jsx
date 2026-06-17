import { BellRing, CheckCircle2, MessageCircle, Send } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import http, { getApiError } from "../api/http.js";
import SectionHeader from "../components/SectionHeader.jsx";
import { business, fallbackCars, tripTypes } from "../data/siteData.js";
import { createWhatsAppUrl, formatDate } from "../utils/formatters.js";

const initialForm = {
  customerName: "",
  phoneNumber: "",
  pickupLocation: "",
  dropLocation: "",
  tripType: "One Way",
  travelDate: "",
  travelTime: "",
  passengers: 1,
  selectedVehicleId: "",
  preferredCarName: "Any Available Car",
  additionalNotes: ""
};

const travelHours = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, "0"));
const travelMinutes = Array.from({ length: 12 }, (_, index) => String(index * 5).padStart(2, "0"));
const travelPeriods = ["AM", "PM"];

const normalizeWhatsAppNumber = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");

  if (digits.length === 10) {
    return `91${digits}`;
  }

  return digits;
};

const isMongoId = (value) => /^[a-f\d]{24}$/i.test(String(value || ""));

const buildAgentBookingMessage = (booking) =>
  [
    "NEW BOOKING ALERT - GoTrippy",
    booking._id ? `Booking ID: ${booking._id.slice(-6).toUpperCase()}` : "",
    `Name: ${booking.customerName}`,
    `Phone: +91 ${booking.phoneNumber}`,
    `Pickup: ${booking.pickupLocation}`,
    `Drop: ${booking.dropLocation}`,
    `Trip type: ${booking.tripType}`,
    `Journey date: ${formatDate(booking.travelDate)}`,
    `Journey start time: ${booking.travelTime}`,
    `Passengers: ${booking.passengers}`,
    `Vehicle: ${booking.selectedVehicleId?.name || booking.preferredCarName}`,
    booking.selectedVehicleId?.registrationNumber ? `Registration: ${booking.selectedVehicleId.registrationNumber}` : "",
    booking.assignedAgentId?.fullName || booking.assignedAgentName ? `Assigned agent: ${booking.assignedAgentId?.fullName || booking.assignedAgentName}` : "",
    booking.additionalNotes ? `Customer notes: ${booking.additionalNotes}` : "",
    "",
    "Please call the customer and confirm availability."
  ]
    .filter(Boolean)
    .join("\n");

const formatJourneyStartTime = ({ hour, minute, period }) =>
  hour && minute ? `${hour}:${minute} ${period}` : "";

export default function BookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    ...initialForm,
    selectedVehicleId: searchParams.get("vehicle") || "",
    preferredCarName: searchParams.get("car") || "Any Available Car",
    tripType: searchParams.get("tripType") || initialForm.tripType,
    pickupLocation: searchParams.get("pickup") || "",
    dropLocation: searchParams.get("drop") || ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [lastBooking, setLastBooking] = useState(null);
  const [agentNotifyUrl, setAgentNotifyUrl] = useState("");
  const [cars, setCars] = useState(fallbackCars);
  const [journeyStartTime, setJourneyStartTime] = useState({
    hour: "",
    minute: "",
    period: "AM"
  });

  const selectedJourneyStartTime = formatJourneyStartTime(journeyStartTime);
  const selectedCar = cars.find((car) => car._id === form.selectedVehicleId) || cars.find((car) => car.name === form.preferredCarName);
  const selectedAgentPhone = selectedCar?.assignedAgent?.whatsappNumber || selectedCar?.ownerAgentId?.whatsappNumber || selectedCar?.ownerAgentId?.phone || business.whatsapp;
  const selectedAgentWhatsApp = normalizeWhatsAppNumber(selectedAgentPhone);

  useEffect(() => {
    http.get("/cars").then(({ data }) => setCars(data)).catch(() => setCars(fallbackCars));
  }, []);

  const whatsappMessage = useMemo(
    () =>
      `Namaste GoTrippy, I want to book ${form.preferredCarName} for ${form.tripType}. Pickup: ${form.pickupLocation}. Drop: ${form.dropLocation}. Date: ${form.travelDate}. Journey start time: ${selectedJourneyStartTime || "not selected yet"}.`,
    [form, selectedJourneyStartTime]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "selectedVehicleId") {
      const nextCar = cars.find((car) => car._id === value);
      setForm((current) => ({
        ...current,
        selectedVehicleId: value,
        preferredCarName: nextCar?.name || "Any Available Car"
      }));
      return;
    }

    setForm((current) => ({ ...current, [name]: value }));
  };

  const updateTravelTime = (part, value) => {
    setJourneyStartTime((current) => {
      const next = {
        ...current,
        [part]: value
      };

      setForm((formState) => ({
        ...formState,
        travelTime: formatJourneyStartTime(next)
      }));

      return next;
    });
  };

  const resetBookingForm = () => {
    setForm(initialForm);
    setJourneyStartTime({
      hour: "",
      minute: "",
      period: "AM"
    });
  };

  const canSubmitJourneyStartTime = Boolean(selectedJourneyStartTime);
  const selectedTravelTime = selectedJourneyStartTime;
  const bookingPayload = {
    ...form,
    travelTime: selectedTravelTime
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!canSubmitJourneyStartTime) {
      toast.error("Please select journey start time with AM or PM.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...bookingPayload,
        passengers: Number(form.passengers),
        selectedVehicleId: isMongoId(form.selectedVehicleId) ? form.selectedVehicleId : isMongoId(selectedCar?._id) ? selectedCar._id : undefined,
        assignedAgentId: selectedCar?.assignedAgent?._id
      };
      const { data } = await http.post("/bookings", payload);
      const savedBooking = data.booking || payload;
      const notifyPhone =
        savedBooking.assignedAgentId?.whatsappNumber ||
        savedBooking.agentId?.whatsappNumber ||
        savedBooking.agentId?.phone ||
        savedBooking.assignedAgentPhone ||
        (selectedCar ? selectedAgentWhatsApp : business.whatsapp);
      const notifyUrl = createWhatsAppUrl(
        notifyPhone,
        buildAgentBookingMessage(savedBooking)
      );

      toast.success("Booking saved. Opening WhatsApp to notify agent.");
      setLastBooking(savedBooking);
      setAgentNotifyUrl(notifyUrl);
      resetBookingForm();

      window.setTimeout(() => {
        window.open(notifyUrl, "_blank", "noopener,noreferrer");
        navigate(`/booking-confirmation/${savedBooking._id}`);
      }, 600);
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16">
      <div className="page-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeader
            eyebrow="Booking"
            title="Share your trip details"
            description="Submit the request and the owner/admin can confirm availability, update status, and manage the trip from the dashboard."
          />
          <div className="mt-8 rounded-lg bg-shiva-900 p-6 text-white">
            <h3 className="text-xl font-black">Quick WhatsApp booking</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Prefer a direct chat? Fill basic details and send the same request on WhatsApp.
            </p>
            <a
              className="btn-primary mt-5"
              href={createWhatsAppUrl(business.whatsapp, whatsappMessage)}
              target="_blank"
              rel="noreferrer"
            >
              Open WhatsApp
            </a>
          </div>

          {lastBooking && (
            <div className="mt-5 rounded-lg border-2 border-saffron-500 bg-saffron-400/15 p-5 shadow-soft">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 animate-pulse place-items-center rounded-md bg-saffron-500 text-white">
                  <BellRing size={24} />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <CheckCircle2 className="text-emerald-600" size={19} />
                    <h3 className="text-lg font-black text-shiva-900">Booking saved. Notify agent now.</h3>
                  </div>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                    WhatsApp should open automatically for {lastBooking.assignedAgentId?.fullName || lastBooking.assignedAgentName || "the assigned agent"}. If it does not open, press this button.
                  </p>
                  <a
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-saffron-500 px-5 py-4 text-base font-black text-white shadow-soft ring-4 ring-saffron-400/25 transition hover:bg-saffron-600 sm:w-auto"
                    href={agentNotifyUrl || createWhatsAppUrl(business.whatsapp, buildAgentBookingMessage(lastBooking))}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle size={20} /> Notify Agent on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        <form id="booking-form" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label" htmlFor="customerName">Customer name</label>
              <input className="field" id="customerName" name="customerName" value={form.customerName} onChange={handleChange} required />
            </div>
            <div>
              <label className="label" htmlFor="phoneNumber">Phone number</label>
              <input className="field" id="phoneNumber" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} pattern="[6-9][0-9]{9}" required />
            </div>
            <div>
              <label className="label" htmlFor="pickupLocation">Pickup location</label>
              <input className="field" id="pickupLocation" name="pickupLocation" value={form.pickupLocation} onChange={handleChange} required />
            </div>
            <div>
              <label className="label" htmlFor="dropLocation">Drop location</label>
              <input className="field" id="dropLocation" name="dropLocation" value={form.dropLocation} onChange={handleChange} required />
            </div>
            <div>
              <label className="label" htmlFor="tripType">Trip type</label>
              <select className="field" id="tripType" name="tripType" value={form.tripType} onChange={handleChange}>
                {tripTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="selectedVehicleId">Preferred car</label>
              <select className="field" id="selectedVehicleId" name="selectedVehicleId" value={form.selectedVehicleId} onChange={handleChange}>
                <option value="">Any Available Car</option>
                {cars.map((car) => (
                  <option key={car._id || car.slug} value={car._id}>
                    {car.name} - {car.ownerAgentId?.name || car.assignedAgent?.fullName || "GoTrippy Partner"}
                  </option>
                ))}
              </select>
              {selectedCar && (
                <p className="mt-2 text-xs font-bold text-slate-500">
                  Booking will be assigned to {selectedCar.ownerAgentId?.name || selectedCar.assignedAgent?.fullName || "this vehicle owner"}.
                </p>
              )}
            </div>
            <div>
              <label className="label" htmlFor="travelDate">Travel date</label>
              <input className="field" id="travelDate" name="travelDate" type="date" value={form.travelDate} onChange={handleChange} required />
            </div>
            <div>
              <label className="label" htmlFor="travelHour">Journey start time</label>
              <div className="grid grid-cols-[1fr_1fr_92px] gap-2">
                <select
                  className="field"
                  id="travelHour"
                  value={journeyStartTime.hour}
                  onChange={(event) => updateTravelTime("hour", event.target.value)}
                  required
                >
                  <option value="">Hour</option>
                  {travelHours.map((hour) => (
                    <option key={hour} value={hour}>{hour}</option>
                  ))}
                </select>
                <select
                  className="field"
                  aria-label="Journey start minute"
                  value={journeyStartTime.minute}
                  onChange={(event) => updateTravelTime("minute", event.target.value)}
                  required
                >
                  <option value="">Min</option>
                  {travelMinutes.map((minute) => (
                    <option key={minute} value={minute}>{minute}</option>
                  ))}
                </select>
                <select
                  className="field"
                  aria-label="AM or PM"
                  value={journeyStartTime.period}
                  onChange={(event) => updateTravelTime("period", event.target.value)}
                >
                  {travelPeriods.map((period) => (
                    <option key={period} value={period}>{period}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="label" htmlFor="passengers">Number of passengers</label>
              <input className="field" id="passengers" name="passengers" type="number" min="1" value={form.passengers} onChange={handleChange} required />
            </div>
            <div className="md:col-span-2">
              <label className="label" htmlFor="additionalNotes">Additional notes</label>
              <textarea className="field min-h-28" id="additionalNotes" name="additionalNotes" value={form.additionalNotes} onChange={handleChange} placeholder="Route stops, luggage, elderly passengers, return timing..." />
            </div>
          </div>
          <button className="btn-primary mt-6 w-full" type="submit" disabled={submitting}>
            <Send size={18} /> {submitting ? "Submitting..." : "Submit Booking Request"}
          </button>
        </form>
      </div>
    </section>
  );
}
