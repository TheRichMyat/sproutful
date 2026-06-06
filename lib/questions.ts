// The 56 statements (DESIGN.md §8). Wording is canonical — do not edit.
// Each `key` is the intelligence the statement scores; each intelligence has
// exactly 7 statements.

export type IntelligenceKey =
  | "word_smart"
  | "logic_smart"
  | "music_smart"
  | "picture_smart"
  | "body_smart"
  | "people_smart"
  | "self_smart"
  | "nature_smart";

export type Question = { n: number; key: IntelligenceKey; text: string };

export const QUESTIONS = [
  { n: 1,  key: "word_smart",    text: "I pride myself on having a large vocabulary." },
  { n: 2,  key: "logic_smart",   text: "Using numbers and numerical symbols is easy for me." },
  { n: 3,  key: "music_smart",   text: "Music is very important to me in daily life." },
  { n: 4,  key: "picture_smart", text: "I always know where I am in relation to my home." },
  { n: 5,  key: "body_smart",    text: "I consider myself an athlete." },
  { n: 6,  key: "people_smart",  text: "I feel like people of all ages like me." },
  { n: 7,  key: "self_smart",    text: "I often look for weaknesses in myself that I see in others." },
  { n: 8,  key: "nature_smart",  text: "The world of plants and animals is important to me." },
  { n: 9,  key: "word_smart",    text: "I enjoy learning new words and do so easily." },
  { n: 10, key: "logic_smart",   text: "I often develop equations to describe relationships and/or to explain my observations." },
  { n: 11, key: "music_smart",   text: "I have wide and varied musical interests including both classical and contemporary." },
  { n: 12, key: "picture_smart", text: "I do not get lost easily and can orient myself with either maps or landmarks." },
  { n: 13, key: "body_smart",    text: "I feel really good about being physically fit." },
  { n: 14, key: "people_smart",  text: "I like to be with all different types of people." },
  { n: 15, key: "self_smart",    text: "I often think about the influence I have on others." },
  { n: 16, key: "nature_smart",  text: "I enjoy my pets." },
  { n: 17, key: "word_smart",    text: "I love to read and do so daily." },
  { n: 18, key: "logic_smart",   text: "I often see mathematical ratios in the world around me." },
  { n: 19, key: "music_smart",   text: "I have a very good sense of pitch, tempo, and rhythm." },
  { n: 20, key: "picture_smart", text: "Knowing directions is easy for me." },
  { n: 21, key: "body_smart",    text: "I have good balance and eye-hand coordination and enjoy sports which use a ball." },
  { n: 22, key: "people_smart",  text: "I respond to all people enthusiastically, free of bias or prejudice." },
  { n: 23, key: "self_smart",    text: "I believe that I am responsible for my actions and who I am." },
  { n: 24, key: "nature_smart",  text: "I like learning about nature." },
  { n: 25, key: "word_smart",    text: "I enjoy hearing challenging lectures." },
  { n: 26, key: "logic_smart",   text: "Math has always been one of my favorite classes." },
  { n: 27, key: "music_smart",   text: "My music education began when I was younger and still continues today." },
  { n: 28, key: "picture_smart", text: "I have the ability to represent what I see by drawing or painting." },
  { n: 29, key: "body_smart",    text: "My outstanding coordination and balance let me excel in high-speed activities." },
  { n: 30, key: "people_smart",  text: "I enjoy new or unique social situations." },
  { n: 31, key: "self_smart",    text: "I try not to waste my time on trivial pursuits." },
  { n: 32, key: "nature_smart",  text: "I enjoy caring for my house plants." },
  { n: 33, key: "word_smart",    text: "I like to keep a daily journal of my daily experiences." },
  { n: 34, key: "logic_smart",   text: "I like to think about numerical issues and examine statistics." },
  { n: 35, key: "music_smart",   text: "I am good at playing an instrument and singing." },
  { n: 36, key: "picture_smart", text: "My ability to draw is recognized and complimented by others." },
  { n: 37, key: "body_smart",    text: "I like being outdoors, enjoy the change in seasons, and look forward to different physical activities each season." },
  { n: 38, key: "people_smart",  text: "I enjoy complimenting others when they have done well." },
  { n: 39, key: "self_smart",    text: "I often think about the problems in my community, state, and/or world and what I can do to help rectify any of them." },
  { n: 40, key: "nature_smart",  text: "I enjoy hunting and fishing." },
  { n: 41, key: "word_smart",    text: "I read and enjoy poetry and occasionally write my own." },
  { n: 42, key: "logic_smart",   text: "I seem to understand things around me through a mathematical sense." },
  { n: 43, key: "music_smart",   text: "I can remember the tune of a song when asked." },
  { n: 44, key: "picture_smart", text: "I can easily duplicate color, form, shading, and texture in my work." },
  { n: 45, key: "body_smart",    text: "I like the excitement of personal and team competition." },
  { n: 46, key: "people_smart",  text: "I am quick to sense in others dishonesty and desire to control me." },
  { n: 47, key: "self_smart",    text: "I am always totally honest with myself." },
  { n: 48, key: "nature_smart",  text: "I enjoy hiking in natural places." },
  { n: 49, key: "word_smart",    text: "I talk a lot and enjoy telling stories." },
  { n: 50, key: "logic_smart",   text: "I enjoy doing puzzles." },
  { n: 51, key: "music_smart",   text: "I take pride in my musical accomplishments." },
  { n: 52, key: "picture_smart", text: "Seeing things in three dimensions is easy for me, and I like to make things in three dimensions." },
  { n: 53, key: "body_smart",    text: "I like to move around a lot." },
  { n: 54, key: "people_smart",  text: "I feel safe when I am with strangers." },
  { n: 55, key: "self_smart",    text: "I enjoy being alone and thinking about my life and myself." },
  { n: 56, key: "nature_smart",  text: "I look forward to visiting the zoo." },
] as const satisfies readonly Question[];
