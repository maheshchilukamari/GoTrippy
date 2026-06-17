import { CheckCircle2, MessageCircle, Send } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import http, { getApiError } from "../api/http.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { business } from "../data/siteData.js";
import { createWhatsAppUrl, formatDate } from "../utils/formatters.js";

const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const normalizeWhatsAppNumber = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits || business.whatsapp;
};

export default function BookingConfirmationPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);

  const socket = useMemo(() => io(socketUrl, { autoConnect: false }), []);

  useEffect(() => {
    Promise.all([http.get(`/bookings/public/${id}`), http.get(`/chats/booking/${id}`)])
      .then(([bookingResponse, chatResponse]) => {
        setBooking(bookingResponse.data);
        setMessages(chatResponse.data.messages || []);
      })
      .catch((error) => toast.error(getApiError(error)))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    socket.connect();
    socket.emit("booking:join", id);
    socket.on("chat:message", (message) => {
      setMessages((current) => (current.some((item) => item._id === message._id) ? current : [...current, message]));
    });

    return () => {
      socket.off("chat:message");
      socket.disconnect();
    };
  }, [id, socket]);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!messageText.trim()) return;

    try {
      const { data } = await http.post(`/chats/booking/${id}/messages`, {
        senderName: booking.customerName,
        text: messageText
      });
      setMessages((current) => (current.some((item) => item._id === data._id) ? current : [...current, data]));
      setMessageText("");
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  if (loading) return <LoadingSpinner label="Loading booking confirmation" />;
  if (!booking) return null;

  const driverPhone = normalizeWhatsAppNumber(booking.agentId?.whatsappNumber || booking.agentId?.phone || booking.assignedAgentPhone);

  return (
    <section className="py-16">
      <div className="page-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
          <CheckCircle2 className="text-emerald-600" size={42} />
          <h1 className="mt-4 text-3xl font-black text-shiva-900">Booking request received</h1>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Your request is saved. The assigned driver can contact you directly and you can chat here after booking.
          </p>
          <div className="mt-6 grid gap-3 rounded-lg bg-white p-4 text-sm text-slate-700">
            <span><strong>Booking ID:</strong> {booking._id.slice(-8).toUpperCase()}</span>
            <span><strong>Customer:</strong> {booking.customerName}</span>
            <span><strong>Pickup:</strong> {booking.pickupLocation}</span>
            <span><strong>Drop:</strong> {booking.dropLocation}</span>
            <span><strong>Date:</strong> {formatDate(booking.travelDate)} at {booking.travelTime}</span>
            <span><strong>Vehicle:</strong> {booking.selectedVehicleId?.name || booking.preferredCarName}</span>
            <span><strong>Driver:</strong> {booking.agentId?.name || booking.assignedAgentName || "GoTrippy Partner"}</span>
            <span><strong>Status:</strong> {booking.status}</span>
          </div>
          <a className="btn-primary mt-5" href={createWhatsAppUrl(driverPhone, `Namaste, I submitted GoTrippy booking ${booking._id.slice(-8).toUpperCase()}. Please confirm availability.`)} target="_blank" rel="noreferrer">
            <MessageCircle size={18} /> WhatsApp Driver
          </a>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-xl font-black text-shiva-900">Booking Chat</h2>
            <p className="mt-1 text-sm text-slate-600">Messages are stored with timestamps and delivered live when the driver is online.</p>
          </div>
          <div className="max-h-[420px] space-y-3 overflow-y-auto bg-slate-50 p-5">
            {messages.map((message) => (
              <div key={message._id} className={`max-w-[82%] rounded-lg px-3 py-2 text-sm leading-6 ${message.senderRole === "CUSTOMER" ? "ml-auto bg-saffron-500 text-white" : "bg-white text-slate-700"}`}>
                <p className="text-xs font-black opacity-75">{message.senderName}</p>
                <p>{message.text}</p>
                <p className="mt-1 text-[11px] opacity-70">{new Date(message.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}</p>
              </div>
            ))}
            {messages.length === 0 && <p className="text-center text-sm font-bold text-slate-500">No messages yet. Say hello to the driver.</p>}
          </div>
          <form className="flex gap-2 border-t border-slate-200 p-4" onSubmit={sendMessage}>
            <input className="field" value={messageText} onChange={(event) => setMessageText(event.target.value)} placeholder="Type message to driver..." />
            <button className="btn-primary" type="submit"><Send size={18} /></button>
          </form>
        </div>
      </div>
    </section>
  );
}
