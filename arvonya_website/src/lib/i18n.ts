export const translations: Record<string, Record<string, string>> = {
  TR: {
    "Biz Kimiz": "Biz Kimiz",
    Misyonumuz: "Misyonumuz",
    Vizyonumuz: "Vizyonumuz",
    "Arvonya Group; emlak, yatırım, otomotiv ve dış ticaret sektörleri ile profesyonel tercüme hizmetlerinde faaliyet gösteren çok yönlü kurumsal bir yapıdır. 'Kurumsal Güven, Kalıcı İstikrar' ilkesiyle değer katan stratejik çözümler sunuyoruz.":
      "Arvonya Group is a versatile corporate structure operating in the real estate, investment, automotive and international trade sectors, as well as professional translation services. We provide strategic value-adding solutions with the principle of 'Corporate Trust, Lasting Stability'.",
    "Müşterilerimize her sektörde şeffaf, ölçülebilir ve sürdürülebilir değer üretmek; uluslararası standartlarda hizmet kalitesini Türk iş dünyasına taşımak.":
      "To produce transparent, measurable and sustainable value for our customers in every sector; to bring international service quality standards to the Turkish business world.",
    "Bölgemizde güvenin ve kurumsal istikrarın referans markası olmak; teknoloji, insan ve sermayeyi en yüksek verimle birleştirmek.":
      "To be the reference brand of trust and corporate stability in our region; to combine technology, people and capital with the highest efficiency.",
    "Kurumsal Güven, Kalıcı İstikrar": "Corporate Trust, Lasting Stability",
    Kurumsal: "Corporate",
  },
  EN: {
    "Biz Kimiz": "Who We Are",
    Misyonumuz: "Our Mission",
    Vizyonumuz: "Our Vision",
    "Arvonya Group; emlak, yatırım, otomotiv ve dış ticaret sektörleri ile profesyonel tercüme hizmetlerinde faaliyet gösteren çok yönlü kurumsal bir yapıdır. 'Kurumsal Güven, Kalıcı İstikrar' ilkesiyle değer katan stratejik çözümler sunuyoruz.":
      "Arvonya Group is a versatile corporate structure operating in the real estate, investment, automotive and international trade sectors, as well as professional translation services. We provide strategic value-adding solutions with the principle of 'Corporate Trust, Lasting Stability'.",
    "Müşterilerimize her sektörde şeffaf, ölçülebilir ve sürdürülebilir değer üretmek; uluslararası standartlarda hizmet kalitesini Türk iş dünyasına taşımak.":
      "To produce transparent, measurable and sustainable value for our customers in every sector; to bring international service quality standards to the Turkish business world.",
    "Bölgemizde güvenin ve kurumsal istikrarın referans markası olmak; teknoloji, insan ve sermayeyi en yüksek verimle birleştirmek.":
      "To be the reference brand of trust and corporate stability in our region; to combine technology, people and capital with the highest efficiency.",
    "Kurumsal Güven, Kalıcı İstikrar": "Corporate Trust, Lasting Stability",
    Kurumsal: "Corporate",
  },
};

export function tr(key: string, lang: "TR" | "EN"): string {
  return translations[lang]?.[key] ?? key;
}
