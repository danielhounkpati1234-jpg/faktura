import RevealOnScroll from "./RevealOnScroll";

const brands = [
  { name: "Ecobank", sub: "Siège Lomé" },
  { name: "CORIS BANK", sub: "International" },
  { name: "ASKY", sub: "Airlines" },
  { name: "SUNU", sub: "Assurances" },
  { name: "TotalEnergies", sub: "Togo" },
  { name: "BB LOMÉ", sub: "Brasseries" },
];

export default function SocialProofBar() {
  return (
    <section className="py-14 border-y border-[#F3F4F6] bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto px-6">
        <RevealOnScroll>
          <p className="text-center text-[12px] font-semibold uppercase tracking-[0.15em] text-[#9CA3AF] mb-10">
            Ils nous font confiance
          </p>
        </RevealOnScroll>

        <div
          className="relative overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div className="flex animate-marquee w-max">
            {[...brands, ...brands].map((brand, i) => (
              <div
                key={`${brand.name}-${i}`}
                className="flex flex-col items-center text-center px-10 shrink-0"
              >
                <div className="text-[15px] font-extrabold text-[#9CA3AF] tracking-tight whitespace-nowrap">
                  {brand.name}
                </div>
                <div className="text-[10px] font-medium text-[#D1D5DB] uppercase tracking-wider">
                  {brand.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
