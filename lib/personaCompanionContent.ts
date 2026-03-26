export type PersonaProfile = {
  id: string;
  name: string;
  platform: "Apple Music" | "Spotify";
  archetype: string;
  age: number;
  educationOrStatus: string;
  job: string;
  summary: string;
  goals: string[];
  frustrations: string[];
  behaviors: string[];
  journeyHighlights: string[];
  quote: string;
  sourceNotes: string[];
};

export const projectCompanionContent = {
  projectTitle: "Apple Music and Spotify Research Companion",
  printTitle: "Apple Music User Journey Map and Persona Comparison",
  assignmentSummary:
    "This project compares five music-listening personas across Apple Music and Spotify, then maps how Apple Music users move through discovery, playback, cross-device listening, maintenance, success, and failure states over time.",
  howToUse:
    "Use this assistant to ask about the personas, platform differences, Apple Music journey stages, emotional shifts, friction points, and the design takeaways visible in the project materials. If the answer is not in the provided research, the assistant should say that directly.",
  researchScope: [
    "Five personas are represented across Spotify and Apple Music.",
    "The Apple Music journey map overlays two Apple personas: Reid Madsen, 'The Audiophile,' and Sheila Applegate, 'The Apple Loyalist.'",
    "The Spotify personas shown in the source material are Franklin Jacobs, Brayden Johnson, and Brandon Clark.",
    "The journey map tracks emotional shifts and friction across 10 stages of Apple Music use.",
  ],
  assignmentContext: [
    "The deliverables provided here are persona cards and an overlaid Apple Music journey map.",
    "The journey map compares how Apple Music users interact with the service across daily contexts and highlights where emotional highs, lows, and friction points occur.",
    "The companion is intended to let a poster viewer continue the discussion without the project team being present.",
    "Some persona-card bullet details were not fully recoverable from the exported PDF, so a few persona entries rely on the visible title, bio, and profile fields rather than the missing side-panel bullets.",
  ],
  journeyMapSummary: [
    "Stage 1: Platform Relationship. Users want Apple ecosystem fit and high audio quality, but may worry about audio limitations or losing familiar workflows.",
    "Stage 2: Trigger Moment. Users choose music for the moment and want playback that immediately feels right.",
    "Stage 3: Entry Point. Users move between devices and expect strong continuity and easy navigation to specific content.",
    "Stage 4: Content Selection. Users browse, search, and choose music for context and audience; confusion around library structure or navigation changes creates friction.",
    "Stage 5: Playback Experience. This is a high point. Users want seamless, connected playback and high-fidelity listening.",
    "Stage 6: Cross Context Use. Users move across devices and setups, but handoff friction or inconsistent output can interrupt the flow.",
    "Stage 7: Maintenance Over Time. Confidence drops when updates, library complexity, or hard-to-control settings make the system feel less stable.",
    "Stage 8: Success State. Reliability returns when listening feels effortless and validated.",
    "Stage 9: Failure State. Trust becomes fragile when continuity breaks and friction appears immediately.",
    "Stage 10: Experience Takeaway. Long-term retention depends on whether Apple Music still feels easy, reliable, and worth staying with.",
  ],
  suggestedQuestions: [
    "Which persona struggled most with music discovery and why?",
    "What are the biggest emotional highs and lows in the Apple Music journey map?",
    "How do Reid Madsen and Sheila Applegate represent different Apple Music needs?",
    "What makes Franklin Jacobs a strong fit for Spotify?",
    "Where does Apple Music friction show up most clearly over time?",
    "What should a reviewer understand first when looking at the poster?",
  ],
  personas: [
    {
      id: "spotify-franklin-jacobs",
      name: "Franklin Jacobs",
      platform: "Spotify",
      archetype: "The Social Listener",
      age: 22,
      educationOrStatus: "College Junior",
      job: "Lead Associate at a popular retail clothing store",
      summary:
        "Franklin uses music to connect with other people. He shares playlists, discusses new releases with friends and family, and treats listening as a social activity.",
      goals: [
        "Make friends through sharing music",
        "Stay up to date with trends",
        "Be seen as someone with good taste",
      ],
      frustrations: [
        "Music platforms that feel isolating",
        "Sharing without feedback",
        "Limited real-time collaboration",
      ],
      behaviors: [
        "Curates playlists for work shifts and social settings",
        "Starts and joins Jam Sessions",
        "Shares and collaborates on playlists",
        "Actively seeks recommendations and new music",
        "Attends concerts and music festivals",
      ],
      journeyHighlights: [
        "Spotify fits Franklin because sharing and discovery feel communal.",
        "Visible social features and real-time group listening support his identity as a social listener.",
      ],
      quote: "Uses music to connect with others, sharing playlists and discussing new releases with friends and family.",
      sourceNotes: ["This persona card was fully legible in the supplied PDF render."],
    },
    {
      id: "spotify-brayden-johnson",
      name: "Brayden Johnson",
      platform: "Spotify",
      archetype: "The Podcaster",
      age: 26,
      educationOrStatus: "College Dropout",
      job: "Sales Representative",
      summary:
        "Brayden uses Spotify to learn more about the world through podcasts and to feel part of the communities built around those shows.",
      goals: [
        "Learn more about the news through podcasts",
        "Stay up to date with his favorite podcasters",
        "Be involved within podcast communities",
      ],
      frustrations: [
        "Does not know when new podcast episodes come out",
        "Does not have anyone to discuss episodes with",
        "Wants to find podcasts similar to the ones he already follows",
      ],
      behaviors: [
        "Loves listening to podcasts whenever he can",
        "Uses podcasts to keep up to date with the world",
        "Uses audio to lock in and focus",
        "Mostly listens to podcasts, but sometimes switches to music",
      ],
      journeyHighlights: [
        "Spotify fits Brayden because it combines podcast access and music in one place.",
        "Podcast availability, Android compatibility, and all-in-one listening make Spotify his practical default.",
      ],
      quote:
        "Uses Spotify to learn more about the world and the news through podcasts. He also enjoys being a part of a community involved in his podcasts.",
      sourceNotes: [
        "This persona entry was updated with the detailed behaviors, reasons, pain points, and goals supplied after the initial PDF extraction.",
      ],
    },
    {
      id: "spotify-brandon-clark",
      name: "Brandon Clark",
      platform: "Spotify",
      archetype: "The Casual Listener",
      age: 37,
      educationOrStatus: "Associates Degree",
      job: "Medical Assistant",
      summary:
        "Brandon is a routine-driven listener who uses Spotify during daily commutes and while doing chores around the house. Convenience matters more than deep curation.",
      goals: [
        "Add background music to mundane tasks",
        "Keep access to favorite artists",
        "Make commutes feel shorter",
      ],
      frustrations: [
        "Ads break immersion",
        "Mixes can become overly repetitive",
        "Actively searching for music feels like work",
      ],
      behaviors: [
        "Uses Daily Mixes and Daily Drive playlists regularly",
        "Rarely searches for new artists intentionally",
        "Listens to a steady rotation of favorite artists",
        "Plays music around the house",
        "Lets playlists run without adjusting them frequently",
      ],
      journeyHighlights: [
        "Spotify fits Brandon because it feels familiar, easy to use, and low effort.",
        "Free playlist creation and algorithmic recommendations reduce the need for active curation.",
      ],
      quote: "Primarily listens to music during daily commutes and while doing chores around the house.",
      sourceNotes: [
        "This persona entry was updated with the detailed behaviors, reasons, pain points, and goals supplied after the initial PDF extraction.",
      ],
    },
    {
      id: "apple-reid-madsen",
      name: "Reid Madsen",
      platform: "Apple Music",
      archetype: "The Audiophile",
      age: 34,
      educationOrStatus: "Bachelors Degree",
      job: "Computer Programmer",
      summary:
        "Reid cares deeply about sound quality and listens on high-end equipment while programming or gaming. He represents the quality-sensitive Apple Music user.",
      goals: [
        "Listen to music at its highest quality",
        "Use tools that enhance the listening experience",
        "Listen to a variety of genres of music",
      ],
      frustrations: [
        "Hates listening to low-quality audio",
        "Needs a high-quality platform with a wide range of artists",
      ],
      behaviors: [
        "Gets annoyed with sub-par audio",
        "Keeps up to date with state-of-the-art equipment",
        "Nerds out about the science and technology behind listening",
        "Is willing to pay for high-quality audio",
        "Loves niche old-school artists",
      ],
      journeyHighlights: [
        "Reid aligns with the journey-map emphasis on high fidelity, seamless playback, and reliable continuity across devices.",
        "Apple Music fits him because it prioritizes quality, broad artist access, and fewer extra distractions.",
      ],
      quote:
        "Loves to enjoy his music with the highest quality equipment. Uses it to rock while he's programming or gaming.",
      sourceNotes: [
        "This persona entry was updated with the detailed behaviors, reasons, pain points, and corrected goals supplied after the initial PDF extraction.",
        "The Apple Music journey map explicitly labels Reid as one of the two overlaid Apple personas.",
      ],
    },
    {
      id: "apple-sheila-applegate",
      name: "Sheila Applegate",
      platform: "Apple Music",
      archetype: "The Apple Loyalist",
      age: 56,
      educationOrStatus: "Masters Degree",
      job: "High School Teacher",
      summary:
        "Sheila is deeply invested in the Apple ecosystem and came to Apple Music through a long history with iTunes. Continuity and ecosystem trust are central to her experience.",
      goals: [
        "Build an environment that is comfortable for her family",
        "Stay up to date with all things Apple",
        "Connect with her home, car, and life",
      ],
      frustrations: [
        "Understanding new updates",
        "Finding how to upload music from iTunes",
        "Accidental purchases from kids",
      ],
      behaviors: [
        "Enjoys the interconnective Apple ecosystem",
        "Pays for the Apple Music Family Plan",
        "Listens through her smart home system",
        "Buys the latest Apple products and stays updated",
        "Exercises to music",
      ],
      journeyHighlights: [
        "Sheila aligns with the journey-map emphasis on ecosystem fit, continuity, trust, and long-term retention.",
        "Apple Music fits her because family sharing, familiarity with iTunes, and strong Apple integration reduce switching friction.",
      ],
      quote:
        "Picked up on iTunes early on, and follows Apple closely. Since she has already invested so much into iTunes the transition to Apple Music was a no brainer.",
      sourceNotes: [
        "This persona entry was updated with the detailed behaviors, reasons, pain points, and goals supplied after the initial PDF extraction.",
        "The Apple Music journey map explicitly labels Sheila as one of the two overlaid Apple personas.",
      ],
    },
  ] satisfies PersonaProfile[],
};

export function buildCompanionKnowledgeBase() {
  return JSON.stringify(projectCompanionContent, null, 2);
}
