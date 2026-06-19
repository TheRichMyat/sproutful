// Internationalization (i18n) — EN / MY.
//
// This is the ONE place all interface strings live. Each entry is built with
// the `s()` helper below:
//
//     key: s("English text")                 → my = "[MY] English text"  (placeholder)
//     key: s("English text", "မြန်မာစာ")      → my = "မြန်မာစာ"            (translated)
//
// TO ADD MYANMAR UI TEXT: add a second argument to the `s(...)` call for that
// key. Until you do, MY mode shows the "[MY] …" placeholder so it's obvious
// what still needs translating and nothing ever renders blank.
//
// Rendering rule (see `pick`): when the active language is MY, use `my` only
// if it's non-empty; otherwise fall back to `en`.
//
// NOTE: the 56 questions (lib/questions.ts) and the 8 intelligence
// names/descriptions (lib/intelligences.ts) carry their own Bilingual fields
// in those files — they are data, not UI chrome, and are translated there.

export type Lang = "en" | "my";

export type Bilingual = { en: string; my: string };

/**
 * Resolve a bilingual value for the active language, falling back to English
 * when the Myanmar string hasn't been filled in yet.
 */
export function pick(
  value: { en: string; my?: string | null },
  lang: Lang,
): string {
  if (lang === "my" && value.my && value.my.trim() !== "") return value.my;
  return value.en;
}

/**
 * Replace `{name}` style tokens in a resolved string. Example:
 *   format("Welcome, {school} students", { school: "DYEC" })
 */
export function format(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) =>
    k in vars ? String(vars[k]) : `{${k}}`,
  );
}

// A tiny helper to keep the dictionary terse. Pass only `en` to get an
// auto "[MY] …" placeholder; pass a second argument to supply the real
// Myanmar translation.
const s = (en: string, my = `[MY] ${en}`): Bilingual => ({ en, my });

/**
 * All interface strings. Keys are grouped by screen with a prefix.
 * Strings containing `{token}` are interpolated with `format()` at the call
 * site.
 */
export const UI = {
  // ---- Student start ----
  start_welcome: s(
    "Welcome, {school} students",
    "{school} ကျောင်းသားများအားလုံး, မင်္ဂလာပါ။",
  ),
  // "Discover." / "Understand." / "Grow." stay in English in both languages.
  start_discover: s("Discover.", "Discover."),
  start_understand: s("Understand.", "Understand."),
  start_grow: s("Grow.", "Grow."),
  start_subtext: s(
    "Uncover your unique strengths through Multiple Intelligences and learn in the way that's best for you.",
    "မိမိ၏ ဉာဏအားသာချက်များကို စူးစမ်းရှာဖွေကာ မည်သည့်အရာက ကိုယ့်အတွက်အကောင်းဆုံး၊ အားအသာဆုံးဖြစ်သည်ဆိုသော ရလဒ်များကို သိပ္ပံနည်းကျတိကျစွာသိရှိစေရန်နှင့် လေ့လာသင်ယူနိုင်စေရန်အတွက် ရည်ရွယ်ပါသည်။",
  ),
  // Author byline / writer-style credit shown under the hero subtext.
  start_credit: s("— Riven (Developer)", "— Riven (Developer)"),
  start_field_name: s("Name", "နာမည်"),
  start_field_year: s("Year", "တက်ရောက်နေသည့် အတန်းအဆင့်"),
  start_field_class: s("Class", "အခန်း"),
  start_placeholder_name: s("Enter your name", "သင်၏ အမည်"),
  start_placeholder_year: s("Select your year", "အတန်းအဆင့်အား ရွေးပါ"),
  start_placeholder_class: s("Select your class", "သင်၏အခန်းအားရွေးချယ်ပါ"),
  start_button: s("Start My Journey", "အခုပဲ စလိုက်စို့!!!"),
  start_err_name: s("Enter your name"),
  start_err_year: s("Pick a year"),
  start_err_class: s("Pick a class"),
  start_callout1_title: s("Personalized Insights", "တစ်ဦးချင်းစီ၏ အားသာချက်များ"),
  start_callout1_body: s(
    "Understand your unique strengths.",
    "သင်၏ ထူးခြားသောအရည်အသွေးများကို သဘောပေါက်နားလည်စေရန်။",
  ),
  start_callout2_title: s(
    "Learn Your Way",
    "ကိုယ့်နည်းကိုယ့်ဟန်ဖြင့်သင်ယူလေ့လာခြင်း",
  ),
  start_callout2_body: s(
    "Find the path that fits you best.",
    "ကိုယ့် ဉာဏအားသာမှု အပေါ်မူတည်၍ မိမိသဘောပေါက်လွယ်မည့်နည်းလမ်းများဖြင့် လေ့လာသင်ယူမှု ပြုလုပ်ပါ။",
  ),
  start_callout3_title: s("Grow With Confidence", "မိမိယုံကြည်မှုတိုးတက်ခြင်း"),
  start_callout3_body: s(
    "Build on what makes you, you.",
    "မင်းကိုယ်တိုင် ဖြစ်တည်မှုကို တည်ဆောက်ပါ။",
  ),
  start_loading: s("Getting things ready…"),

  // ---- Link not found (shared shell, two bodies) ----
  linknotfound_title: s("Link not found"),
  linknotfound_body_student: s(
    "This link doesn't look right. Please ask your school for the correct link and try again.",
  ),
  linknotfound_body_dashboard: s(
    "This dashboard link doesn't look right. Please check the URL or ask the Sproutful operator for the correct link.",
  ),

  // ---- Quiz ----
  quiz_progress: s("Question {n} of {total}"),
  quiz_scale_low: s("Not at all", "လုံးဝမဟုတ်ပါ"),
  quiz_scale_high: s("Exactly like me", "လုံးဝမှန်ကန်ပါသည်"),
  quiz_next: s("Next", "နောက်တစ်ခု"),
  quiz_see_results: s("See My Results"),
  quiz_saving: s("Saving…", "သိမ်းနေသည်"),
  quiz_err_generic: s("We couldn't save your answers. Please try again."),
  quiz_err_network: s(
    "We couldn't save your answers. Check your connection and try again.",
  ),
  quiz_redirecting: s("Taking you back to the start…"),

  // ---- Result ----
  result_title: s("Your Strengths", "သင်၏အားသာချက်များ"),
  result_subline: s(
    "Every mind is unique. Here's how your multiple intelligences shine.",
    "လူတိုင်းမှာ ကိုယ်ပိုင်ပါရမီကိုယ်စီ ရှိကြပါတယ်။ သင်ဘယ်လိုအရာတွေမှာ ထူးချွန်ထက်မြက်သလဲဆိုတာ အတူတူ ကြည့်လိုက်ရအောင်။",
  ),
  result_top_strength: s("Your top strength", "သင့်ရဲ့ အားသာဆုံးအချက်"),
  result_keep_growing: s(
    "Keep exploring, keep growing!",
    "ဆက်လက်ရှာဖွေလေ့လာပြီး ပိုမိုတိုးတက်အောင် လုပ်ဆောင်လိုက်ပါ။",
  ),
  result_download: s("Download Report", "အစီရင်ခံစာကို ဒေါင်းလုဒ်ရယူရန်"),
  result_preparing: s("Preparing…"),
  result_continue: s("Take a new test", "စာမေးပွဲအသစ် ပြန်ဖြေရန်"),
  result_pdf_err: s("We couldn't create the PDF. Please try again in a moment."),
  result_student_id_aria: s("Your student ID"),
  result_redirecting: s("Taking you back to the start…"),
  out_of_5: s("/ 5.0"),

  // ---- PDF report ----
  pdf_report_title: s("Student Result Report"),
  pdf_section_student: s("Student"),
  pdf_name: s("Name"),
  pdf_student_id: s("Student ID"),
  pdf_year: s("Year"),
  pdf_class: s("Class"),
  pdf_top_strength: s("Your top strength", "သင့်ရဲ့ အားသာဆုံးအချက်"),
  pdf_all_intelligences: s("All intelligences"),
  pdf_footer: s("Sproutful — Discover the spark within."),

  // ---- Dashboard ----
  dash_title: s("Student Results"),
  dash_subtitle: s(
    "{school} — View and analyse your students' multiple intelligences results.",
  ),
  dash_school: s("School"),
  dash_search_placeholder: s("Search by student name or ID"),
  dash_export: s("Export Report"),
  dash_col_student: s("Student"),
  dash_col_year: s("Year"),
  dash_col_class: s("Class"),
  dash_col_top_strength: s("Top Strength"),
  dash_actions: s("Actions"),
  dash_showing: s("Showing {start} to {end} of {total} {noun}"),
  dash_student_singular: s("student"),
  dash_student_plural: s("students"),
  dash_prev_page: s("Previous page"),
  dash_next_page: s("Next page"),
  dash_no_match: s('No students match "{query}".'),
  dash_footer_title: s("Every child has a unique blend of strengths."),
  dash_footer_body: s(
    "Use these insights to guide and support their learning journey.",
  ),
  dash_empty_title: s("No students have taken the assessment yet"),
  dash_empty_body: s(
    "Share your school's student link with your students to start collecting results. They'll appear here as soon as they finish.",
  ),
  dash_loading: s("Loading student results…"),

  // ---- Delete row ----
  del_tooltip: s("Delete result"),
  del_aria: s("Delete {name}'s result"),
  del_title: s("Delete {name}'s result?"),
  del_subtitle: s("This can't be undone."),
  del_cancel: s("Cancel"),
  del_confirm: s("Delete"),
  del_deleting: s("Deleting…"),
  del_err_generic: s("We couldn't delete this result. Please try again."),
  del_err_network: s(
    "We couldn't delete this result. Check your connection and try again.",
  ),
} satisfies Record<string, Bilingual>;

export type UIKey = keyof typeof UI;
