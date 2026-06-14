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
    label: { en: "Word Smart", my: "ဘာသာစကားဉာဏ်ရည်" },
    color: "#EF6F61",
    icon: BookOpen,
    description: {
      en: "You think in words and love reading, writing, and storytelling.",
      my: "သင်ဟာ စကားလုံးတွေနဲ့ တွေးခေါ်တတ်ပြီး စာဖတ်ခြင်း၊ စာရေးခြင်းနဲ့ ပုံပြင်ပြောပြခြင်းတို့ကို နှစ်သက်မြတ်နိုးပါတယ်။",
    },
  },
  logic_smart: {
    key: "logic_smart",
    label: { en: "Logic Smart", my: "သင်္ချာနှင့် ယုတ္တိဉာဏ်ရည်" },
    color: "#F4B740",
    icon: Calculator,
    description: {
      en: "You enjoy numbers, patterns, problem-solving, and figuring out how things work.",
      my: "သင်ဟာ ကိန်းဂဏန်းတွေ၊ ပုံစံ (Pattern) တွေ၊ ပြဿနာဖြေရှင်းခြင်းနဲ့ အရာတွေ ဘယ်လိုအလုပ်လုပ်သလဲဆိုတာ ရှာဖွေဖော်ထုတ်ခြင်းတို့ကို နှစ်သက်ပါတယ်။",
    },
  },
  music_smart: {
    key: "music_smart",
    label: { en: "Music Smart", my: "ဂီတဉာဏ်ရည်" },
    color: "#3BA6A0",
    icon: Music,
    description: {
      en: "You have a natural ability to understand, create, and express through music.",
      my: "သင်ဟာ ဂီတကို နားလည်ခြင်း၊ ဖန်တီးခြင်းနဲ့ ဂီတဖြင့် ဖော်ပြခြင်းတို့မှာ မွေးရာပါ အရည်အချင်း ရှိပါတယ်။",
    },
  },
  picture_smart: {
    key: "picture_smart",
    label: { en: "Picture Smart", my: "အာကာသဆိုင်ရာဉာဏ်ရည်" },
    color: "#5B8DEF",
    icon: ImageIcon,
    description: {
      en: "You think in pictures and are great with space, design, and visual ideas.",
      my: "သင်ဟာ ပုံရိပ်တွေနဲ့ တွေးခေါ်တတ်ပြီး နေရာအကွာအဝေး (Space)၊ ဒီဇိုင်းနဲ့ မြင်ကွင်းဆိုင်ရာ အတွေးအခေါ်တွေမှာ တော်ပါတယ်။",
    },
  },
  body_smart: {
    key: "body_smart",
    label: { en: "Body Smart", my: "ကာယဉာဏ်ရည်" },
    color: "#6CC07A",
    icon: PersonStanding,
    description: {
      en: "You learn by doing and moving, with great coordination and physical skill.",
      my: "သင်ဟာ လက်တွေ့လုပ်ဆောင်ရင်းနဲ့ လှုပ်ရှားရင်း သင်ယူတတ်ပြီး ခန္ဓာကိုယ် ဟန်ချက်ညီမှုနဲ့ ကိုယ်လက်လှုပ်ရှားမှု ကျွမ်းကျင်မှု ကောင်းမွန်ပါတယ်။",
    },
  },
  people_smart: {
    key: "people_smart",
    label: { en: "People Smart", my: "လူမှုဆက်ဆံရေးဉာဏ်ရည်" },
    color: "#9B7EDE",
    icon: Users,
    description: {
      en: "You understand and connect with others easily and work well in groups.",
      my: "သင်ဟာ အခြားသူတွေကို အလွယ်တကူ နားလည်သဘောပေါက်ပြီး ရင်းနှီးအောင် လုပ်နိုင်စွမ်းရှိသလို အဖွဲ့အစည်းနဲ့လည်း လက်တွဲလုပ်ဆောင်ရတာ အဆင်ပြေပြေ လုပ်နိုင်စွမ်း ရှိပါတယ်။",
    },
  },
  self_smart: {
    key: "self_smart",
    label: { en: "Self Smart", my: "ကိုယ်တွင်းသိဉာဏ်ရည်" },
    color: "#F0915A",
    icon: Heart,
    description: {
      en: "You know yourself well and reflect deeply on your own thoughts and goals.",
      my: "သင်ဟာ မိမိကိုယ်ကို ကောင်းစွာ သိရှိနားလည်ပြီး ကိုယ့်ရဲ့ အတွေးအခေါ်တွေနဲ့ ပန်းတိုင်တွေကို နက်နက်ရှိုင်းရှိုင်း ပြန်လည်သုံးသပ်တတ်ပါတယ်။",
    },
  },
  nature_smart: {
    key: "nature_smart",
    label: { en: "Nature Smart", my: "သဘာဝသိဉာဏ်ရည်" },
    color: "#7FB069",
    icon: Leaf,
    description: {
      en: "You feel connected to nature, plants, animals, and the world outdoors.",
      my: "သင်ဟာ သဘာဝတရား၊ အပင်တွေ၊ တိရစ္ဆာန်တွေနဲ့ ပြင်ပလောကကြီးနဲ့ ထိတွေ့ဆက်နွယ်နေတယ်လို့ ခံစားရပါတယ်။",
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
