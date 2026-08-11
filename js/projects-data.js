/* ============================================
   DS DESIGNS — Project Data
   This file is the single source of truth for all
   project content. The future admin panel will read
   from and write to data like this (via a database
   such as Supabase) instead of this static file.
   ============================================ */

const PROJECTS = [
  {
    id: "lantern-house",
    title: "The Lantern House",
    category: "Residential",
    year: 2024,
    location: "Bhavnagar, Gujarat",
    brief: "A family home built around a single courtyard of light.",
    story: [
      "The clients asked for a house that didn't feel like it was hiding from the sun — most homes on the street kept their courtyards small and shaded. We did the opposite: a double-height light well runs through the centre of the plan, and every main room opens onto it.",
      "Materials stay quiet on purpose — local stone, lime-washed walls, teak detailing — so the light itself becomes the main material of the house. By late afternoon, the courtyard floor reads like a sundial.",
      "The brief was 'a house that feels calm even when it's full of people.' We measured success not at handover, but six months later, when the family told us they still eat breakfast in the courtyard every day."
    ],
    cover: "images/projects/lantern-house/01.svg",
    images: [
      "images/projects/lantern-house/01.svg",
      "images/projects/lantern-house/02.svg",
      "images/projects/lantern-house/03.svg"
    ],
    specs: { area: "3,800 sq.ft", duration: "14 months", scope: "Architecture + Interiors" }
  },
  {
    id: "meridian-offices",
    title: "Meridian Offices",
    category: "Commercial",
    year: 2023,
    location: "Ahmedabad, Gujarat",
    brief: "A workplace designed around how the team actually moves through a day.",
    story: [
      "Before drawing a single wall, we spent two weeks just observing how the existing team worked — where conversations happened, which corners were avoided, what made people leave their desks.",
      "The result favours a spine of informal meeting nooks over a wall of closed cabins. Daylight was prioritised over headcount-per-square-foot, which took some convincing — the client now says it's the reason retention improved.",
      "We treated acoustics as seriously as aesthetics: every open zone is paired with a quieter counterpart within ten steps."
    ],
    cover: "images/projects/meridian-offices/01.svg",
    images: [
      "images/projects/meridian-offices/01.svg",
      "images/projects/meridian-offices/02.svg",
      "images/projects/meridian-offices/03.svg"
    ],
    specs: { area: "9,200 sq.ft", duration: "10 months", scope: "Architecture + Workplace Strategy" }
  },
  {
    id: "birch-stone-apartment",
    title: "Birch & Stone Apartment",
    category: "Interiors",
    year: 2024,
    location: "Surat, Gujarat",
    brief: "An interior fit-out for a young family upgrading from their first home.",
    story: [
      "This was a fit-out, not a build — so every decision had to justify itself against the shell we inherited. We kept the bones honest and let texture do the work: limewash, cane, brushed brass, raw oak.",
      "The clients' one firm request was 'no two rooms should feel like they were designed by different people.' We carried a single material logic — warm, tactile, unfussy — through every room, including the ones guests never see.",
      "Storage was the real design problem here. Half the budget for joinery went into things you can't see: pull-out larders, a shoe wall disguised as a console, a study desk that folds flush into the wall."
    ],
    cover: "images/projects/birch-stone-apartment/01.svg",
    images: [
      "images/projects/birch-stone-apartment/01.svg",
      "images/projects/birch-stone-apartment/02.svg",
      "images/projects/birch-stone-apartment/03.svg"
    ],
    specs: { area: "1,650 sq.ft", duration: "5 months", scope: "Interior Design" }
  },
  {
    id: "courtyard-residence",
    title: "Courtyard Residence",
    category: "Residential",
    year: 2022,
    location: "Rajkot, Gujarat",
    brief: "A multi-generational home for three generations under one roof, with privacy for each.",
    story: [
      "The challenge was never square footage — it was independence. Grandparents, parents, and a young couple needed to share a home without sharing every routine.",
      "We split the plan into three loosely-linked households around a shared courtyard, so everyone could choose how much togetherness they wanted on any given day.",
      "Eighteen months after handover, the family added a fourth swing to the courtyard tree for the newest grandchild — to us, that's the real measure of whether a house works."
    ],
    cover: "images/projects/courtyard-residence/01.svg",
    images: [
      "images/projects/courtyard-residence/01.svg",
      "images/projects/courtyard-residence/02.svg",
      "images/projects/courtyard-residence/03.svg"
    ],
    specs: { area: "5,400 sq.ft", duration: "16 months", scope: "Architecture + Landscape" }
  },
  {
    id: "atelier-workspace",
    title: "Atelier Workspace",
    category: "Commercial",
    year: 2023,
    location: "Bhavnagar, Gujarat",
    brief: "A studio and showroom for a textile brand, built to host clients and craft in the same room.",
    story: [
      "The brand needed a space that could host a buyer meeting at 11am and a fabric-dyeing demo at 2pm without feeling like two different buildings.",
      "We designed around a single flexible hall with a hard-working perimeter — storage, prep, and display all tucked into a deep wall system — so the centre of the room could change roles in minutes.",
      "Every finish was chosen to age the way the brand's own textiles do: visibly, gracefully, without needing constant upkeep."
    ],
    cover: "images/projects/atelier-workspace/01.svg",
    images: [
      "images/projects/atelier-workspace/01.svg",
      "images/projects/atelier-workspace/02.svg",
      "images/projects/atelier-workspace/03.svg"
    ],
    specs: { area: "2,900 sq.ft", duration: "7 months", scope: "Architecture + Interiors" }
  },
  {
    id: "the-reading-room",
    title: "The Reading Room",
    category: "Interiors",
    year: 2023,
    location: "Bhavnagar, Gujarat",
    brief: "A home library and study, designed for one client who reads in every room but wanted one room built only for that.",
    story: [
      "A small, almost monastic brief: one room, one purpose. That kind of focus is rare, and we tried to honour it by removing everything that wasn't reading, light, or quiet.",
      "Joinery was custom-built to the client's actual book collection — sized, measured, and sorted before a single shelf was cut — rather than the usual approach of designing shelves and hoping the books fit.",
      "The client's only feedback after move-in: 'I forgot rooms could be this quiet.' That sentence is framed in our studio now."
    ],
    cover: "images/projects/the-reading-room/01.svg",
    images: [
      "images/projects/the-reading-room/01.svg",
      "images/projects/the-reading-room/02.svg",
      "images/projects/the-reading-room/03.svg"
    ],
    specs: { area: "320 sq.ft", duration: "2 months", scope: "Interior Design" }
  }
];

// Helper used across pages
function getProjectById(id){
  return PROJECTS.find(p => p.id === id);
}
