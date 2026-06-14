// The 56 statements (DESIGN.md §8). English wording is canonical — do not edit
// the `en` values. Each intelligence has exactly 7 statements.
//
// i18n: each `text` is a Bilingual { en, my }. The `my` (Myanmar) values were
// supplied by the operator. An empty `my` falls back to `en` at render time,
// so the quiz never shows a blank question. Do NOT change `n`, `key`, or the
// order — those drive scoring (§9).

import type { Bilingual } from "./i18n";

export type IntelligenceKey =
  | "word_smart"
  | "logic_smart"
  | "music_smart"
  | "picture_smart"
  | "body_smart"
  | "people_smart"
  | "self_smart"
  | "nature_smart";

export type Question = { n: number; key: IntelligenceKey; text: Bilingual };

export const QUESTIONS = [
  { n: 1,  key: "word_smart",    text: { en: "I pride myself on having a large vocabulary.", my: "ကိုယ့်ကိုယ်ကိုယ် စကားလုံးအသုံးအနှုန်း ကြွယ်ဝတဲ့သူတစ်ယောက်အဖြစ် ဂုဏ်ယူတယ်။" } },
  { n: 2,  key: "logic_smart",   text: { en: "Using numbers and numerical symbols is easy for me.", my: "ကိန်းဂဏန်းတွေနဲ့ သင်္ချာသင်္ကေတတွေကို သုံးရတာ ကိုယ့်အတွက် အေးဆေးပဲ။" } },
  { n: 3,  key: "music_smart",   text: { en: "Music is very important to me in daily life.", my: "နေ့စဉ်ဘဝမှာ သီချင်း/ဂီတက ကိုယ့်အတွက် တော်တော်အရေးပါတယ်။" } },
  { n: 4,  key: "picture_smart", text: { en: "I always know where I am in relation to my home.", my: "ကိုယ့်အိမ်နဲ့ ယှဉ်ရင် အခု ကိုယ်ဘယ်နား ရောက်နေလဲဆိုတာ အမြဲတမ်း အတိအကျ သိတယ်။" } },
  { n: 5,  key: "body_smart",    text: { en: "I consider myself an athlete.", my: "ကိုယ့်ကိုယ်ကိုယ် အားကစားသမားတစ်ယောက်လို့ သတ်မှတ်ထားတယ်။" } },
  { n: 6,  key: "people_smart",  text: { en: "I feel like people of all ages like me.", my: "အသက်အရွယ်မရွေး လူတိုင်းက ကိုယ့်ကို ခင်ကြ၊ သဘောကျကြတယ်လို့ ခံစားရတယ်။" } },
  { n: 7,  key: "self_smart",    text: { en: "I often look for weaknesses in myself that I see in others.", my: "သူများဆီမှာတွေ့တဲ့ အားနည်းချက်မျိုး ကိုယ့်မှာရော ရှိနေမလားဆိုပြီး ခဏခဏ ပြန်ဆန်းစစ်တတ်တယ်။" } },
  { n: 8,  key: "nature_smart",  text: { en: "The world of plants and animals is important to me.", my: "အပင်တွေ၊ သတ္တဝါတွေနဲ့ သဘာဝလောကကြီးက ကိုယ့်အတွက် အရေးပါတယ်။" } },
  { n: 9,  key: "word_smart",    text: { en: "I enjoy learning new words and do so easily.", my: "စကားလုံးအသစ်တွေ လေ့လာရတာ ဝါသနာပါပြီး အလွယ်တကူလည်း မှတ်မိတယ်။" } },
  { n: 10, key: "logic_smart",   text: { en: "I often develop equations to describe relationships and/or to explain my observations.", my: "အခြေအနေတွေရဲ့ ဆက်စပ်မှု ဒါမှမဟုတ် ကိုယ်မြင်ရတဲ့အရာတွေကို ရှင်းပြဖို့ သင်္ချာညီမျှခြင်းတွေကို မကြာခဏ စဉ်းစားထုတ်လေ့ရှိတယ်။" } },
  { n: 11, key: "music_smart",   text: { en: "I have wide and varied musical interests including both classical and contemporary.", my: "ရှေးရိုးဂန္ထဝင်သီချင်းကနေ ခေတ်ပေါ်သီချင်းအထိ သီချင်းအမျိုးမျိုးကို စုံစုံလင်လင် ကြိုက်တတ်တယ်။" } },
  { n: 12, key: "picture_smart", text: { en: "I do not get lost easily and can orient myself with either maps or landmarks.", my: "လမ်း သိပ်မပျောက်တတ်ဘူး၊ မြေပုံဖြစ်ဖြစ်၊ အမှတ်အသားတစ်ခုခုကိုကြည့်ပြီးဖြစ်ဖြစ် ကိုယ်သွားရမယ့် လမ်းကြောင်းကို ရှာတတ်တယ်။" } },
  { n: 13, key: "body_smart",    text: { en: "I feel really good about being physically fit.", my: "ခန္ဓာကိုယ် ကြံ့ခိုင်ကျန်းမာနေတာကို တော်တော်သဘောကျတယ်။" } },
  { n: 14, key: "people_smart",  text: { en: "I like to be with all different types of people.", my: "လူအမျိုးမျိုး၊ အလွှာစုံနဲ့ ရောရောနှောနှော နေရတာကို နှစ်သက်တယ်။" } },
  { n: 15, key: "self_smart",    text: { en: "I often think about the influence I have on others.", my: "ကိုယ်က သူများအပေါ် ဘယ်လောက်အထိ လွှမ်းမိုးမှုရှိလဲဆိုတာ ခဏခဏ စဉ်းစားမိတယ်။" } },
  { n: 16, key: "nature_smart",  text: { en: "I enjoy my pets.", my: "ကိုယ်မွေးထားတဲ့ အိမ်မွေးတိရစ္ဆာန်လေးတွေကို ချစ်တယ်။" } },
  { n: 17, key: "word_smart",    text: { en: "I love to read and do so daily.", my: "စာဖတ်ရတာ ကြိုက်ပြီး နေ့တိုင်း စာဖတ်ဖြစ်တယ်။" } },
  { n: 18, key: "logic_smart",   text: { en: "I often see mathematical ratios in the world around me.", my: "ပတ်ဝန်းကျင်ကို ကြည့်ရင် သင်္ချာဆိုင်ရာ အချိုးအစား (Ratios) တွေကို မကြာခဏ ပြေးမြင်တတ်တယ်။" } },
  { n: 19, key: "music_smart",   text: { en: "I have a very good sense of pitch, tempo, and rhythm.", my: "သီချင်းသံစဉ်၊ အနှေးအမြန်နဲ့ စည်းချက်တွေကို ကောင်းကောင်း ခံစားနားလည်နိုင်တယ်။" } },
  { n: 20, key: "picture_smart", text: { en: "Knowing directions is easy for me.", my: "ဘယ်အရပ်မျက်နှာလဲဆိုတာ ခွဲခြားရတာ ကိုယ့်အတွက် လွယ်ပါတယ်။" } },
  { n: 21, key: "body_smart",    text: { en: "I have good balance and eye-hand coordination and enjoy sports which use a ball.", my: "အကြောအခြင် လှုပ်ရှားမှုနဲ့ မျက်စိ၊ လက် တုံ့ပြန်မှု ကောင်းလို့ ဘောလုံးသုံးရတဲ့ အားကစားတွေကို သဘောကျတယ်။" } },
  { n: 22, key: "people_smart",  text: { en: "I respond to all people enthusiastically, free of bias or prejudice.", my: "ဘယ်သူ့ကိုမဆို ဘက်လိုက်မှု၊ ခွဲခြားမှုမရှိဘဲ တက်တက်ကြွကြွနဲ့ ဖော်ဖော်ရွေရွေ ဆက်ဆံတယ်။" } },
  { n: 23, key: "self_smart",    text: { en: "I believe that I am responsible for my actions and who I am.", my: "ကိုယ့်လုပ်ရပ်နဲ့ ကိုယ့်ဘဝအတွက် ကိုယ့်မှာပဲ တာဝန်ရှိတယ်လို့ ယုံကြည်တယ်။" } },
  { n: 24, key: "nature_smart",  text: { en: "I like learning about nature.", my: "သဘာဝတရားအကြောင်း လေ့လာရတာကို သဘောကျတယ်။" } },
  { n: 25, key: "word_smart",    text: { en: "I enjoy hearing challenging lectures.", my: "အတွေးအခေါ်ပိုင်းကို စိန်ခေါ်တဲ့ ဟောပြောပွဲ၊ ဆွေးနွေးပွဲတွေကို နားထောင်ရတာ ကြိုက်တယ်။" } },
  { n: 26, key: "logic_smart",   text: { en: "Math has always been one of my favorite classes.", my: "ကျောင်းတုန်းကလည်း သင်္ချာက ကိုယ့်အကြိုက်ဆုံး ဘာသာရပ်တွေထဲက တစ်ခုဖြစ်ခဲ့တယ်။" } },
  { n: 27, key: "music_smart",   text: { en: "My music education began when I was younger and still continues today.", my: "ဂီတကို ငယ်ငယ်ကတည်းက လေ့လာခဲ့တာ အခုထိလည်း ဆက်လေ့လာနေတုန်းပဲ။" } },
  { n: 28, key: "picture_smart", text: { en: "I have the ability to represent what I see by drawing or painting.", my: "ကိုယ်မြင်ရတဲ့အရာတွေကို ပုံဆွဲတာ ဒါမှမဟုတ် ဆေးခြယ်တာမျိုးနဲ့ ပြန်ဖော်ပြနိုင်စွမ်း ရှိတယ်။" } },
  { n: 29, key: "body_smart",    text: { en: "My outstanding coordination and balance let me excel in high-speed activities.", my: "ခန္ဓာကိုယ် ဟန်ချက်ထိန်းနိုင်စွမ်း ကောင်းလို့ အရှိန်အဟုန် မြန်မြန်ဆန်ဆန် လုပ်ရတဲ့ လှုပ်ရှားမှုတွေမှာ ထူးချွန်တယ်။" } },
  { n: 30, key: "people_smart",  text: { en: "I enjoy new or unique social situations.", my: "အသစ်အဆန်းဖြစ်တဲ့ လူမှုပတ်ဝန်းကျင် သို့မဟုတ် ထူးခြားတဲ့ ပွဲလမ်းသဘင်တွေကို သွားရတာ နှစ်သက်တယ်။" } },
  { n: 31, key: "self_smart",    text: { en: "I try not to waste my time on trivial pursuits.", my: "အကျိုးမရှိတဲ့ အသေးအဖွဲကိစ္စတွေမှာ အချိန်မဖြုန်းမိအောင် ကြိုးစားတယ်။" } },
  { n: 32, key: "nature_smart",  text: { en: "I enjoy caring for my house plants.", my: "အိမ်က အိုးစိုက်ပင်လေးတွေကို ပြုစုရတာ ဝါသနာပါတယ်။" } },
  { n: 33, key: "word_smart",    text: { en: "I like to keep a daily journal of my daily experiences.", my: "ကိုယ့်ရဲ့ နေ့စဉ်အတွေ့အကြုံတွေကို နေ့စဉ်မှတ်တမ်း (Journal) ရေးရတာ ကြိုက်တယ်။" } },
  { n: 34, key: "logic_smart",   text: { en: "I like to think about numerical issues and examine statistics.", my: "ကိန်းဂဏန်းတွေအကြောင်း စဉ်းစားရတာနဲ့ စာရင်းဇယား ဒေတာတွေကို ဆန်းစစ်ရတာ သဘောကျတယ်။" } },
  { n: 35, key: "music_smart",   text: { en: "I am good at playing an instrument and singing.", my: "တူရိယာတစ်ခုခု တီးရတာ ဒါမှမဟုတ် သီချင်းဆိုရတာ ကျွမ်းကျင်တယ်။" } },
  { n: 36, key: "picture_smart", text: { en: "My ability to draw is recognized and complimented by others.", my: "ကိုယ်ပုံဆွဲတော်တာကို သူများတွေက သတိထားမိပြီး ချီးကျူးလေ့ရှိကြတယ်။" } },
  { n: 37, key: "body_smart",    text: { en: "I like being outdoors, enjoy the change in seasons, and look forward to different physical activities each season.", my: "အပြင်ထွက်ရတာ ကြိုက်တယ်၊ ရာသီဥတု ပြောင်းလဲတာကို သဘောကျပြီး ရာသီအလိုက် ကိုယ်လက်လှုပ်ရှားမှုတွေကို လုပ်ဖို့ မျှော်လင့်နေတတ်တယ်။" } },
  { n: 38, key: "people_smart",  text: { en: "I enjoy complimenting others when they have done well.", my: "သူများတွေ တော်တော်တန်တန် လုပ်နိုင်တာတွေ့ရင် ချီးကျူးစကားပြောရတာ အားရတယ်။" } },
  { n: 39, key: "self_smart",    text: { en: "I often think about the problems in my community, state, and/or world and what I can do to help rectify any of them.", my: "ကိုယ့်ပတ်ဝန်းကျင်၊ ကိုယ့်နိုင်ငံ ဒါမှမဟုတ် ကမ္ဘာကြီးမှာရှိတဲ့ ပြဿနာတွေကို ကိုယ်က ဘာကူညီဖြေရှင်းပေးနိုင်မလဲဆိုတာ ခဏခဏ စဉ်းစားတတ်တယ်။" } },
  { n: 40, key: "nature_smart",  text: { en: "I enjoy hunting and fishing.", my: "အမဲလိုက်တာနဲ့ ငါးမျှားတာကို ဝါသနာပါတယ်။" } },
  { n: 41, key: "word_smart",    text: { en: "I read and enjoy poetry and occasionally write my own.", my: "ကဗျာဖတ်ရတာ ကြိုက်ပြီး တစ်ခါတစ်ရံ ကိုယ်တိုင်လည်း ကဗျာစပ်တတ်တယ်။" } },
  { n: 42, key: "logic_smart",   text: { en: "I seem to understand things around me through a mathematical sense.", my: "ပတ်ဝန်းကျင်က အရာရာကို သင်္ချာအမြင်နဲ့ပဲ ကြည့်ပြီး နားလည်သဘောပေါက်နေတတ်တယ်။" } },
  { n: 43, key: "music_smart",   text: { en: "I can remember the tune of a song when asked.", my: "သီချင်းတစ်ပုဒ်ရဲ့ သံစဉ်ကို လွယ်လွယ်ကူကူ မှတ်မိနိုင်တယ်။" } },
  { n: 44, key: "picture_smart", text: { en: "I can easily duplicate color, form, shading, and texture in my work.", my: "ကိုယ်လုပ်တဲ့အလုပ်တွေမှာ အရောင်၊ ပုံသဏ္ဌာန်၊ အရိပ်အလင်းနဲ့ အသားအနား (Texture) တွေကို အပိုင်အနိုင် ပြန်တုပပြီး လုပ်နိုင်တယ်။" } },
  { n: 45, key: "body_smart",    text: { en: "I like the excitement of personal and team competition.", my: "တစ်ယောက်ချင်းဖြစ်ဖြစ်၊ အသင်းလိုက်ဖြစ်ဖြစ် ပြိုင်ဆိုင်ရတဲ့ စိတ်လှုပ်ရှားမှုကို သဘောကျတယ်။" } },
  { n: 46, key: "people_smart",  text: { en: "I am quick to sense in others dishonesty and desire to control me.", my: "သူများက ကိုယ့်အပေါ် မရိုးသားတာ ဒါမှမဟုတ် ချုပ်ကိုင်ချင်တာမျိုးဆိုရင် ချက်ချင်း ရိပ်မိတယ်။" } },
  { n: 47, key: "self_smart",    text: { en: "I am always totally honest with myself.", my: "မိမိကိုယ်ကိုယ် အမြဲတမ်း ရိုးသားမှုရှိတယ်။" } },
  { n: 48, key: "nature_smart",  text: { en: "I enjoy hiking in natural places.", my: "သဘာဝတောတောင်တွေထဲ လမ်းလျှောက်ခရီး (Hiking) ထွက်ရတာကို သဘောကျတယ်။" } },
  { n: 49, key: "word_smart",    text: { en: "I talk a lot and enjoy telling stories.", my: "စကားပြောရတာ ကြိုက်ပြီး ပုံတွေ၊ အကြောင်းအရာတွေ ပြောပြရတာ ဝါသနာပါတယ်။" } },
  { n: 50, key: "logic_smart",   text: { en: "I enjoy doing puzzles.", my: "ဉာဏ်စမ်းပဟေဠိတွေ ဖြေရှင်းရတာကို သဘောကျတယ်။" } },
  { n: 51, key: "music_smart",   text: { en: "I take pride in my musical accomplishments.", my: "ဂီတပိုင်းနဲ့ ပတ်သက်ပြီး ကိုယ့်ရဲ့ အောင်မြင်မှုတွေအပေါ် ဂုဏ်ယူတယ်။" } },
  { n: 52, key: "picture_smart", text: { en: "Seeing things in three dimensions is easy for me, and I like to make things in three dimensions.", my: "အရာဝတ္ထုတွေကို သုံးဖက်မြင် (3D) အမြင်နဲ့ ကြည့်ရတာ လွယ်ကူပြီး 3D ပစ္စည်းတွေ လုပ်ရတာကိုလည်း သဘောကျတယ်။" } },
  { n: 53, key: "body_smart",    text: { en: "I like to move around a lot.", my: "ငြိမ်ငြိမ်မနေဘဲ ဟိုဟိုဒီဒီ လှုပ်ရှားသွားလာရတာကို ကြိုက်တယ်။" } },
  { n: 54, key: "people_smart",  text: { en: "I feel safe when I am with strangers.", my: "သူစိမ်းတွေကြားထဲ ရောက်နေရင်တောင် ဘေးကင်းတယ်လို့ ခံစားရတယ်။" } },
  { n: 55, key: "self_smart",    text: { en: "I enjoy being alone and thinking about my life and myself.", my: "တစ်ယောက်တည်း အေးအေးဆေးဆေးနေပြီး ကိုယ့်ဘဝနဲ့ ကိုယ့်အကြောင်းကို ပြန်စဉ်းစားရတာ ကြိုက်တယ်။" } },
  { n: 56, key: "nature_smart",  text: { en: "I look forward to visiting the zoo.", my: "တိရစ္ဆာန်ရုံ သွားလည်ဖို့ အမြဲ စိတ်အားထက်သန်နေတတ်တယ်။" } },
] as const satisfies readonly Question[];
