import { Bot, MessageCircle, Send, X } from "lucide-react";
import { useState } from "react";
import { business } from "../data/siteData.js";
import { createWhatsAppUrl } from "../utils/formatters.js";

const responses = {
  "Airport Pickup": "For airport pickup/drop, share terminal timing, pickup point, passenger count, and luggage. A local driver can confirm the fixed price on WhatsApp.",
  "Temple Tour": "For temple tours, GoTrippy drivers support early pickup, family stops, return timing, and routes like Yadadri, Srisailam, Tirupati, Vemulawada, Basara, and Bhadrachalam.",
  "City Ride": "For Hyderabad city rides, choose pickup, drop, timing, passengers, and the preferred car. The driver can confirm route suitability and price on call.",
  "Self Drive Car": "For self-drive, you need a valid driving license, Aadhaar card, PAN/passport, and security deposit. Choose pickup and return dates on the Self Drive page.",
  "Outstation Trip": "For outstation trips, choose pickup city, destination, date, return plan, passengers, and vehicle type. Pricing can be per km or package-based."
};

const quickOptions = ["Airport Pickup", "Temple Tour", "City Ride", "Self Drive Car", "Outstation Trip", "Partner Login"];

export default function FloatingHelp() {
  const [open, setOpen] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "How can I help you today?"
    }
  ]);

  const ask = (option) => {
    if (option === "Talk on WhatsApp") {
      window.open(createWhatsAppUrl(business.whatsapp, "Namaste GoTrippy, I need help booking a ride."), "_blank", "noopener,noreferrer");
      return;
    }

    if (option === "Partner Login") {
      window.open(`${import.meta.env.BASE_URL}driver/login`, "_blank", "noopener,noreferrer");
      return;
    }

    setMessages((current) => [
      ...current,
      { from: "user", text: option },
      { from: "bot", text: responses[option] || "I can help with bookings, self-drive cars, and partner login." }
    ]);
  };

  const sendCustomMessage = (event) => {
    event.preventDefault();
    const text = input.trim();

    if (!text) return;

    setMessages((current) => [
      ...current,
      { from: "user", text },
      { from: "bot", text: "Thanks. For fastest help, choose a quick option or message GoTrippy on WhatsApp." }
    ]);
    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-5 sm:right-5">
      {open && (
        <div className="mb-3 w-[min(360px,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
          <div className="flex items-center justify-between bg-gradient-to-r from-white to-blue-50 px-4 py-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                <Bot size={24} />
              </span>
              <div>
                <p className="text-sm font-black text-shiva-900">Hi! I'm GoTrippy Assistant</p>
                <p className="text-xs font-semibold text-slate-500">How can I help you today?</p>
              </div>
            </div>
            <button className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-shiva-900" onClick={() => setOpen(false)} aria-label="Close chat">
              <X size={18} />
            </button>
          </div>

          <div className="max-h-48 space-y-2 overflow-y-auto border-y border-slate-100 bg-slate-50 p-3 sm:max-h-56">
            {messages.map((message, index) => (
              <div
                key={`${message.from}-${index}`}
                className={`rounded-lg px-3 py-2 text-sm leading-6 ${
                  message.from === "bot" ? "bg-white text-slate-700" : "ml-auto bg-saffron-500 text-white"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 p-3">
            {quickOptions.map((option) => (
              <button key={option} className="rounded-md border border-slate-200 px-3 py-2 text-left text-xs font-bold text-shiva-900 transition hover:border-saffron-500 hover:text-saffron-600" onClick={() => ask(option)}>
                {option}
              </button>
            ))}
            <button className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-left text-xs font-bold text-emerald-700 transition hover:border-emerald-500" onClick={() => ask("Talk on WhatsApp")}>
              Talk on WhatsApp
            </button>
          </div>

          <form className="flex gap-2 border-t border-slate-100 p-3" onSubmit={sendCustomMessage}>
            <input className="field" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Type your message..." />
            <button className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-shiva-900 text-white transition hover:bg-shiva-700" type="submit" aria-label="Send message">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
      <button className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-shiva-900 text-white shadow-soft transition hover:bg-shiva-700" onClick={() => setOpen((value) => !value)} aria-label="Open GoTrippy help chat">
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
