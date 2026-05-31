import mercyImg from "@/assets/church-mercy.jpg";
import judeImg from "@/assets/church-jude.jpg";
import greenwoodImg from "@/assets/church-greenwood.jpg";

export type Church = {
  slug: string;
  name: string;
  city: string;
  denomination: string;
  tagline: string;
  description: string;
  size: "Small" | "Mid-Size" | "Large";
  style: string;
  image: string;
  imageAlt: string;
};

export const churches: Church[] = [
  {
    slug: "mercy-collective",
    name: "The Mercy Collective",
    city: "Brooklyn, NY",
    denomination: "Non-Denominational",
    tagline: "Liturgy & Arts",
    description:
      "A progressive community focused on restorative justice and contemplative worship in the heart of the city.",
    size: "Mid-Size",
    style: "Contemporary",
    image: mercyImg,
    imageAlt: "Modern minimalist chapel interior with light wood pews",
  },
  {
    slug: "st-judes",
    name: "St. Jude’s on the Hill",
    city: "Boston, MA",
    denomination: "Anglican",
    tagline: "Historical Tradition",
    description:
      "Deep roots in the Anglican tradition with a focus on choral excellence and community outreach programs.",
    size: "Large",
    style: "Liturgical",
    image: judeImg,
    imageAlt: "Stone gothic cathedral interior with stained glass light",
  },
  {
    slug: "greenwood-commons",
    name: "Greenwood Commons",
    city: "Portland, OR",
    denomination: "Presbyterian",
    tagline: "Contemporary Family",
    description:
      "Intergenerational gathering with vibrant youth programs and a focus on environmental stewardship.",
    size: "Mid-Size",
    style: "Family-Focused",
    image: greenwoodImg,
    imageAlt: "Warm open community space with circular seating and plants",
  },
  {
    slug: "old-north-chapel",
    name: "Old North Chapel",
    city: "Asheville, NC",
    denomination: "Methodist",
    tagline: "Art & Activism",
    description:
      "Traditional roots, progressive branches. A small but vibrant congregation centered on art and activism.",
    size: "Small",
    style: "Traditional",
    image: mercyImg,
    imageAlt: "Quiet chapel interior",
  },
  {
    slug: "the-table",
    name: "The Table Collective",
    city: "Austin, TX",
    denomination: "Non-Denominational",
    tagline: "Radical Hospitality",
    description:
      "Modern worship with a deep commitment to radical hospitality and community table-gathering.",
    size: "Large",
    style: "Contemporary",
    image: greenwoodImg,
    imageAlt: "Community gathering space",
  },
  {
    slug: "vespers-orthodox",
    name: "Holy Vespers",
    city: "Chicago, IL",
    denomination: "Orthodox",
    tagline: "Ancient Liturgy",
    description:
      "Centuries-old liturgy in a vibrant urban parish — incense, chant, and a deeply welcoming community.",
    size: "Mid-Size",
    style: "Liturgical",
    image: judeImg,
    imageAlt: "Orthodox church interior with candles",
  },
];

export const denominations = [
  "All",
  "Anglican",
  "Non-Denominational",
  "Orthodox",
  "Presbyterian",
  "Methodist",
  "Baptist",
];