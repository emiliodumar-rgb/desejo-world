/* ═══════════════════════════════════════════════════════════════
   DESÉJO, PROJECT DATA (reference only, not read by any live page)

   HOW IT WORKS (current setup)
   ─────────────────────────────
   Every page on the site is now plain static HTML, including each
   project's own page (project-your-slug.html). Nothing reads this
   file at runtime any more. It's kept purely as a reference of each
   project's copy/photo set, since it's a handy record while a
   project only has 1-2 images. The old "project.html?slug=..." data-
   driven template has been retired and is no longer linked anywhere
   on the site (it's still sitting in the folder, unused, in case you
   ever want it back, safe to ignore or delete).

   HOW TO ADD A NEW PROJECT (static pages)
   ────────────────────────────────────────
   1. Duplicate an existing "project-something.html" file and rename
      it "project-your-slug.html" (lowercase, hyphens, no spaces).
   2. Open it and edit three things directly in the text:
      - the <title> tag at the top
      - the eyebrow line (location, year) and the shoot-title/
        about-headline paragraph (your project's description)
      - the image URLs inside the two "shoot-col" divs further down
        (add or remove <img> lines freely, each column just stacks
        whatever images you put in it, so they don't need to match
        in count or size, only the same fixed column width)
   3. Add one tile to projects.html's grid: copy one of the existing
      <a class="proj r">…</a> blocks, point its href at
      "project-your-slug.html", swap the thumbnail image and title.
   4. Want it featured on the home page too? Copy one of the tiles in
      home.html's "Recent Projects" grid the same way.
   5. To remove a project, delete its project-*.html file and its
      tile(s) in projects.html / home.html.

   No build step, no JavaScript to touch, just HTML you copy, paste
   and edit like a Word document. This file below is left as-is so
   you (or a future Claude session) can see each project's original
   copy and image URLs at a glance.
   ═══════════════════════════════════════════════════════════════ */

window.DESEJO_PROJECTS = [

  {
    slug: "rogue-season",
    title: "Rogue Season",
    location: "Sumba, Indonesia",
    year: "2024",
    featured: true,
    services: ["Creative Direction", "Photography", "Location Scouting"],
    description: "A campaign shot along Sumba's salt-washed coastline, stills and motion produced start to finish in one continuous shoot.",
    thumb: "https://images.squarespace-cdn.com/content/v1/64d1bcf0cf0c2750aad95072/659ee284-524e-4247-979e-c89dfebecd1b/ROGUE+SEASON+SUMB+PHOTOS+_+49.jpg?format=1500w",
    hero: "https://images.squarespace-cdn.com/content/v1/64d1bcf0cf0c2750aad95072/536bf0bd-9e16-4f95-b709-1764827a9d74/ROGUE+SEASON+SUMB+PHOTOS+_+52.jpg?format=2500w",
    gallery: [
      "https://images.squarespace-cdn.com/content/v1/64d1bcf0cf0c2750aad95072/536bf0bd-9e16-4f95-b709-1764827a9d74/ROGUE+SEASON+SUMB+PHOTOS+_+52.jpg?format=1500w",
      "https://images.squarespace-cdn.com/content/v1/64d1bcf0cf0c2750aad95072/659ee284-524e-4247-979e-c89dfebecd1b/ROGUE+SEASON+SUMB+PHOTOS+_+49.jpg?format=1500w"
    ]
  },

  {
    slug: "ciao-ciao-vacation",
    title: "Ciao Ciao Vacation",
    location: "Tokyo, Japan",
    year: "2024",
    featured: true,
    services: ["Creative Production", "Photography & Motion", "Line Producing"],
    description: "An editorial campaign moving through Shibuya's back streets, quiet, filmic frames shot on location over two days.",
    thumb: "https://images.squarespace-cdn.com/content/v1/64d1bcf0cf0c2750aad95072/d6d8e45e-ce68-4988-9b8a-1c5e09b66de7/EMILIODUMAR_CCV_SHIBUYA_PHOTOS-33.jpg?format=1500w",
    hero: "https://images.squarespace-cdn.com/content/v1/64d1bcf0cf0c2750aad95072/d6d8e45e-ce68-4988-9b8a-1c5e09b66de7/EMILIODUMAR_CCV_SHIBUYA_PHOTOS-33.jpg?format=2500w",
    gallery: [
      "https://images.squarespace-cdn.com/content/v1/64d1bcf0cf0c2750aad95072/d6d8e45e-ce68-4988-9b8a-1c5e09b66de7/EMILIODUMAR_CCV_SHIBUYA_PHOTOS-33.jpg?format=1500w",
      "https://images.squarespace-cdn.com/content/v1/64d1bcf0cf0c2750aad95072/bc77ab60-f25e-43af-ac04-eef8e043327c/EMILIODUMAR_CCV_SHIBUYA_PHOTOS-174.jpg?format=1500w"
    ]
  },

  {
    slug: "cleonie",
    title: "Cleonie",
    location: "Sumba, Indonesia",
    year: "2023",
    featured: true,
    services: ["Creative Direction", "Photography", "Casting & Talent"],
    description: "A swim and resort-wear campaign built around natural light and Sumba's coastline, produced as a single cohesive shoot.",
    thumb: "https://images.squarespace-cdn.com/content/v1/64d1bcf0cf0c2750aad95072/c53d40b8-d527-42ef-9518-9d8806c0abb4/CLEONIE+_+SUMBA+_+45.jpg?format=1500w",
    hero: "https://images.squarespace-cdn.com/content/v1/64d1bcf0cf0c2750aad95072/c53d40b8-d527-42ef-9518-9d8806c0abb4/CLEONIE+_+SUMBA+_+45.jpg?format=2500w",
    gallery: [
      "https://images.squarespace-cdn.com/content/v1/64d1bcf0cf0c2750aad95072/c53d40b8-d527-42ef-9518-9d8806c0abb4/CLEONIE+_+SUMBA+_+45.jpg?format=1500w",
      "https://images.squarespace-cdn.com/content/v1/64d1bcf0cf0c2750aad95072/5bbd30d3-bbf5-4e6a-b99c-ee79be1bebb3/vyMPclhw.jpg?format=1500w"
    ]
  },

  {
    slug: "inbluem",
    title: "Inbluem",
    location: "Sumba, Indonesia",
    year: "2023",
    featured: true,
    services: ["Photography & Motion", "Film & Motion", "Post Production"],
    description: "A film-led campaign exploring texture and stillness, motion and stills captured together across one location.",
    thumb: "https://images.squarespace-cdn.com/content/v1/64d1bcf0cf0c2750aad95072/cb871bfd-16dc-4268-ad6d-ac29839663cd/INBLUEM_FILM_14.jpg?format=1500w",
    hero: "https://images.squarespace-cdn.com/content/v1/64d1bcf0cf0c2750aad95072/cb871bfd-16dc-4268-ad6d-ac29839663cd/INBLUEM_FILM_14.jpg?format=2500w",
    gallery: [
      "https://images.squarespace-cdn.com/content/v1/64d1bcf0cf0c2750aad95072/cb871bfd-16dc-4268-ad6d-ac29839663cd/INBLUEM_FILM_14.jpg?format=1500w",
      "https://images.squarespace-cdn.com/content/v1/64d1bcf0cf0c2750aad95072/79b361af-6132-4c34-b8e7-d26334fe1600/INBLUEM_FILM_1.jpg?format=1500w"
    ]
  },

  {
    slug: "san-lorenzo",
    title: "San Lorenzo",
    location: "Sydney, Australia",
    year: "2023",
    featured: true,
    services: ["Creative Production", "Photography", "Full Production Management"],
    description: "A homecoming campaign shot in Sydney, bringing the same slow, filmic approach back to Deséjo's own coastline.",
    thumb: "https://images.squarespace-cdn.com/content/v1/64d1bcf0cf0c2750aad95072/5cff4a6b-ece0-499c-80df-13531d18cb11/EMILIODUMAR_SANLORENZO_CRISTIANA_-131.jpg?format=1500w",
    hero: "https://images.squarespace-cdn.com/content/v1/64d1bcf0cf0c2750aad95072/5cff4a6b-ece0-499c-80df-13531d18cb11/EMILIODUMAR_SANLORENZO_CRISTIANA_-131.jpg?format=2500w",
    gallery: [
      "https://images.squarespace-cdn.com/content/v1/64d1bcf0cf0c2750aad95072/5cff4a6b-ece0-499c-80df-13531d18cb11/EMILIODUMAR_SANLORENZO_CRISTIANA_-131.jpg?format=1500w",
      "https://images.squarespace-cdn.com/content/v1/64d1bcf0cf0c2750aad95072/77135f8b-44f4-4210-aa15-960d7afe02a6/SAN+LORENZO+_+BALI+_+31.jpg?format=1500w"
    ]
  },

  {
    // TODO: placeholder photo, swap "thumb"/"hero"/"gallery" for Arde's real images,
    // and fill in location/year/services/description once confirmed.
    slug: "arde",
    title: "ARDE",
    location: "",
    year: "",
    featured: false,
    services: [],
    description: "",
    thumb: "assets/arde.jpg",
    hero: "assets/arde.jpg",
    gallery: [
      "assets/arde.jpg"
    ]
  },

  {
    // TODO: placeholder photo, swap "thumb"/"hero"/"gallery" for The Wolf Gang's real images,
    // and fill in location/year/services/description once confirmed.
    slug: "the-wolf-gang",
    title: "The Wolf Gang",
    location: "",
    year: "",
    featured: false,
    services: [],
    description: "",
    thumb: "assets/wolf-gang.jpg",
    hero: "assets/wolf-gang.jpg",
    gallery: [
      "assets/wolf-gang.jpg"
    ]
  }

  /* ── ADD YOUR NEXT PROJECT BELOW THIS LINE ──
  ,{
    slug: "your-project-slug",
    title: "Project Title",
    location: "City, Country",
    year: "2026",
    featured: true,
    services: ["Service One", "Service Two"],
    description: "One or two sentences about the project.",
    thumb: "https://link-to-your-portrait-image.jpg",
    hero: "https://link-to-your-large-hero-image.jpg",
    gallery: [
      "https://link-to-image-1.jpg",
      "https://link-to-image-2.jpg"
    ]
  }
  */

];
