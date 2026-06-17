import { CalendarCheck, Car, Compass, MapPinned, Phone, ShieldCheck } from "lucide-react";
import SectionHeader from "../components/SectionHeader.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import { services } from "../data/siteData.js";

const serviceIcons = [MapPinned, Car, Compass, CalendarCheck, Phone, ShieldCheck];

export default function ServicesPage() {
  return (
    <section className="py-16">
      <div className="page-shell">
        <SectionHeader
          eyebrow="Services"
          title="Travel services for Indian families"
          description="GoTrippy supports planned family routes and urgent local requirements with simple booking coordination."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = serviceIcons[index % serviceIcons.length];

            return (
              <ServiceCard key={service.title} service={service} Icon={Icon} />
            );
          })}
        </div>
      </div>
    </section>
  );
}
