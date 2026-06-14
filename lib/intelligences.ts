// The 8 intelligences — colors, labels, and icons (DESIGN.md §4).
// Order matters: it's the §4 order and the wedge order in the Strength Wheel
// (clockwise from top: Word, Logic, Music, Picture, Body, People, Self, Nature).
// Ties in scoring are also broken using this order (§9).

import {
  BookOpen,
  Calculator,
  Heart,
  Image as ImageIcon,
  Leaf,
  Music,
  PersonStanding,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { IntelligenceKey } from "./questions";
import type { Bilingual } from "./i18n";

export type Intelligence = {
  key: IntelligenceKey;
  /** Display name. EN is canonical; fill `my` with the Burmese name. */
  label: Bilingual;
  color: string;
  icon: LucideIcon;
  /**
   * One-sentence description for the "top strength" card (DESIGN.md §6.3).
   * EN is canonical; fill `my` with the Burmese translation. Empty `my`
   * falls back to EN at render time.
   */
  description: Bilingual;
};

export const INTELLIGENCES: Record<IntelligenceKey, Intelligence> = {
  word_smart: {
    key: "word_smart",
    label: { en: "Word Smart", my: "" },
    color: "#EF6F61",
    icon: BookOpen,
    description: {
      en: "You think in words and love reading, writing, and storytelling.",
      my: "",
    },
  },
  logic_smart: {
    key: "logic_smart",
    label: { en: "Logic Smart", my: "" },
    color: "#F4B740",
    icon: Calculator,
    description: {
      en: "You enjoy numbers, patterns, problem-solving, and figuring out how things work.",
      my: "",
    },
  },
  music_smart: {
    key: "music_smart",
    label: { en: "Music Smart", my: "" },
    color: "#3BA6A0",
    icon: Music,
    description: {
      en: "You have a natural ability to understand, create, and express through music.",
      my: "",
    },
  },
  picture_smart: {
    key: "picture_smart",
    label: { en: "Picture Smart", my: "" },
    color: "#5B8DEF",
    icon: ImageIcon,
    description: {
      en: "You think in pictures and are great with space, design, and visual ideas.",
      my: "",
    },
  },
  body_smart: {
    key: "body_smart",
    label: { en: "Body Smart", my: "" },
    color: "#6CC07A",
    icon: PersonStanding,
    description: {
      en: "You learn by doing and moving, with great coordination and physical skill.",
      my: "",
    },
  },
  people_smart: {
    key: "people_smart",
    label: { en: "People Smart", my: "" },
    color: "#9B7EDE",
    icon: Users,
    description: {
      en: "You understand and connect with others easily and work well in groups.",
      my: "",
    },
  },
  self_smart: {
    key: "self_smart",
    label: { en: "Self Smart", my: "" },
    color: "#F0915A",
    icon: Heart,
    description: {
      en: "You know yourself well and reflect deeply on your own thoughts and goals.",
      my: "",
    },
  },
  nature_smart: {
    key: "nature_smart",
    label: { en: "Nature Smart", my: "" },
    color: "#7FB069",
    icon: Leaf,
    description: {
      en: "You feel connected to nature, plants, animals, and the world outdoors.",
      my: "",
    },
  },
};

/** Canonical order (§4). Used by the wheel and tie-breaking. */
export const INTELLIGENCE_ORDER: readonly IntelligenceKey[] = [
  "word_smart",
  "logic_smart",
  "music_smart",
  "picture_smart",
  "body_smart",
  "people_smart",
  "self_smart",
  "nature_smart",
] as const;
