import { MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import http, { getApiError } from "../api/http.js";
import SectionHeader from "../components/SectionHeader.jsx";
import { business } from "../data/siteData.js";
import { createWhatsAppUrl } from "../utils/formatters.js";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  message: ""
};

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await http.post("/contact", form);
      toast.success("Message sent successfully.");
      setForm(initialForm);
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
          eyebrow="Contact"
          title="Call or message GoTrippy"
          description="Reach out for cab availability, temple packages, airport travel, or a custom family route."
        />
        <div className="mt-10 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="grid gap-4">
            <a className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" href={`tel:+91${business.phone}`}>
              <Phone className="text-saffron-600" size={24} />
              <h3 className="mt-3 text-xl font-black text-shiva-900">Phone</h3>
              <p className="mt-1 text-slate-600">+91 {business.phone}</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">{business.ownerName}</p>
            </a>
            <a
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              href={createWhatsAppUrl(business.whatsapp, "Namaste GoTrippy, I want to enquire about cab booking.")}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="text-saffron-600" size={24} />
              <h3 className="mt-3 text-xl font-black text-shiva-900">WhatsApp booking</h3>
              <p className="mt-1 text-slate-600">Send trip details directly on WhatsApp.</p>
            </a>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <MapPin className="text-saffron-600" size={24} />
              <h3 className="mt-3 text-xl font-black text-shiva-900">Service area</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{business.serviceArea}</p>
            </div>
            <div className="grid h-52 place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-100 text-center">
              <div>
                <MapPin className="mx-auto text-shiva-700" />
                <p className="mt-2 text-sm font-bold text-slate-600">Google Maps placeholder</p>
              </div>
            </div>
          </div>

          <form className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label" htmlFor="name">Name</label>
                <input className="field" id="name" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div>
                <label className="label" htmlFor="phone">Phone</label>
                <input className="field" id="phone" name="phone" value={form.phone} onChange={handleChange} pattern="[6-9][0-9]{9}" required />
              </div>
              <div className="md:col-span-2">
                <label className="label" htmlFor="email">Email optional</label>
                <input className="field" id="email" name="email" type="email" value={form.email} onChange={handleChange} />
              </div>
              <div className="md:col-span-2">
                <label className="label" htmlFor="message">Message</label>
                <textarea className="field min-h-40" id="message" name="message" value={form.message} onChange={handleChange} required />
              </div>
            </div>
            <button className="btn-primary mt-6 w-full" type="submit" disabled={submitting}>
              <Send size={18} /> {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
