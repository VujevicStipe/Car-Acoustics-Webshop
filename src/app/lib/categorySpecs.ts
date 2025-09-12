export type Category = "speaker" | "amplifier" | "player";

export const categorySpecs: Record<Category, { key: string; label: string }[]> =
  {
    speaker: [
      { key: "type", label: "Tip" },
      { key: "size", label: "Veličina (inča)" },
      { key: "rms", label: "RMS snaga (W)" },
      { key: "max_power", label: "Maksimalna snaga (W)" },
      { key: "sensitivity", label: "Osjetljivost (dB)" },
      { key: "impedance", label: "Impedancija (Ohm)" },
      { key: "frequency_range", label: "Frekvencijski opseg (Hz)" },
      { key: "magnet_type", label: "Vrsta magneta" },
      { key: "weight", label: "Težina (kg)" },
      { key: "mounting_depth", label: "Dubina montaže (mm)" },
      { key: "warranty", label: "Garancija u godinama" },
    ],
    amplifier: [
      { key: "channels", label: "Broj kanala" },
      { key: "power_4_ohm", label: "Snaga na 4 Ohma (RMS)" },
      { key: "power_2_ohm", label: "Snaga na 2 Ohma (RMS)" },
      { key: "power_1_ohm", label: "Snaga na 1 Ohm (RMS)" },
      { key: "power_bridge_4_ohm", label: "Snaga u Bridge 4 Ohm(RMS)" },
      { key: "signal_to_noise", label: "Odnos signal/šum (dB)" },
      { key: "thd", label: "Izobličenje (THD)" },
      { key: "subsonic_filter", label: "Subsonični filter (Hz)" },
      { key: "high_pass_filter", label: "High pass filter HPF" },
      { key: "bassboost", label: "Bass Boost" },
      { key: "dimensions", label: "Dimenzije (mm)" },
      { key: "warranty", label: "Garancija u godinama" },
    ],
    player: [
      { key: "output_power", label: "Izlazna snaga (W)" },
      { key: "bluetooth", label: "Bluetooth" },
      { key: "display", label: "Zaslon" },
      { key: "supported_formats", label: "Podržani formati" },
      { key: "radio", label: "Radijski prijemnik" },
      { key: "usb_input", label: "USB ulaz" },
      { key: "warranty", label: "Garancija u godinama" },
    ],
    // accessories: [
    //   { key: "compatible_with", label: "Kompatibilnost" },
    //   { key: "material", label: "Materijal" },
    //   { key: "color", label: "Boja" },
    //   { key: "weight", label: "Težina (g)" },
    // ],
  };

export const specOptions: Partial<Record<string, string[]>> = {
  brand: [
    "Pioneer",
    "GroundZero",
    "ESX",
    "CLItalia",
    "Sony",
    "Alpine",
    "Kenwood",
    "JVC",
    "JBL",
    "Hifonics",
    "Mushway",
    "Crunch",
  ],

  size: [
    "7",
    "8.7",
    "10 x 15",
    "10 x 25",
    "10",
    "13",
    "15 x 20",
    "15 x 23",
    "16",
    "16.5",
    "17",
    "18 x 25",
    "20",
    "25",
    "30",
    "38",
    "46",
  ],
  impedance: ["2", "3", "4", "6", "8"],
  type: [
    "Koaksijalni",
    "Komponentni",
    "Subwoofer",
    "Srednjetonac",
    "Visokotonac",
  ],

  channels: ["1-kanalni", "2-kanalni", "4-kanalni", "5-kanalni", "6-kanalni"],
  playerSize: ["1-din", "2-din"],
};

// export type Category = "speaker" | "amplifier" | "player" | "accessory";

// export const categorySpecs: Record<Category, string[]> = {
//   speaker: [
//     "type",
//     "size",
//     "rms",
//     "max_power",
//     "impedance",
//     "frequency_range",
//     "mounting_depth",
//     "warranty",
//   ],
//   amplifier: ["power_output", "channels", "class"],
//   player: ["bluetooth", "usb_input", "apple_android_support"],
//   accessory: ["accessory_type", "compatibility"],
// };

// export default categorySpecs;
