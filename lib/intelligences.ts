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

export type Intelligence = {
  key: IntelligenceKey;
  label: string;
  color: string;
  icon: LucideIcon;
  /** One-sentence description for the "top strength" card (DESIGN.md §6.3). */
  description: string;
};

export const INTELLIGENCES: Record<IntelligenceKey, Intelligence> = {
  word_smart: {
    key: "word_smart",
    label: "Word Smart",
    color: "#EF6F61",
    icon: BookOpen,
    description:
      "You think in words and love reading, writing, and storytelling.",
  },
  logic_smart: {
    key: "logic_smart",
    label: "Logic Smart",
    color: "#F4B740",
    icon: Calculator,
    description:
      "You enjoy numbers, patterns, problem-solving, and figuring out how things work.",
  },
  music_smart: {
    key: "music_smart",
    label: "Music Smart",
    color: "#3BA6A0",
    icon: Music,
    description:
      "You have a natural ability to understand, create, and express through music.",
  },
  picture_smart: {
    key: "picture_smart",
    label: "Picture Smart",
    color: "#5B8DEF",
    icon: ImageIcon,
    description:
      "You think in pictures and are great with space, design, and visual ideas.",
  },
  body_smart: {
    key: "body_smart",
    label: "Body Smart",
    color: "#6CC07A",
    icon: PersonStanding,
    description:
      "You learn by doing and moving, with great coordination and physical skill.",
  },
  people_smart: {
    key: "people_smart",
    label: "People Smart",
    color: "#9B7EDE",
    icon: Users,
    description:
      "You understand and connect with others easily and work well in groups.",
  },
  self_smart: {
    key: "self_smart",
    label: "Self Smart",
    color: "#F0915A",
    icon: Heart,
    description:
      "You know yourself well and reflect deeply on your own thoughts and goals.",
  },
  nature_smart: {
    key: "nature_smart",
    label: "Nature Smart",
    color: "#7FB069",
    icon: Leaf,
    description:
      "You feel connected to nature, plants, animals, and the world outdoors.",
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
