import type { ChainReaction } from "./types";

export const defaultChainReactions: ChainReaction[] = [
  {
    id: crypto.randomUUID(),
    name: "Morning Victory",
    description: "Start your day with a powerful morning routine",
    activities: [
      {
        id: crypto.randomUUID(),
        name: "Wake up 7 AM",
        points: 3,
        completed: false,
      },
      {
        id: crypto.randomUUID(),
        name: "Exercise",
        points: 4,
        completed: false,
      },
      {
        id: crypto.randomUUID(),
        name: "Healthy breakfast",
        points: 3,
        completed: false,
      },
    ],
    bonusPoints: 3,
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: "Evening Wind Down",
    description: "End your day with a relaxing routine",
    activities: [
      {
        id: crypto.randomUUID(),
        name: "No screens after 9 PM",
        points: 2,
        completed: false,
      },
      {
        id: crypto.randomUUID(),
        name: "Read for 20 minutes",
        points: 3,
        completed: false,
      },
      {
        id: crypto.randomUUID(),
        name: "Meditate before sleep",
        points: 4,
        completed: false,
      },
    ],
    bonusPoints: 3,
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: "Productivity Boost",
    description: "Maximize your productivity",
    activities: [
      {
        id: crypto.randomUUID(),
        name: "Plan your day",
        points: 2,
        completed: false,
      },
      {
        id: crypto.randomUUID(),
        name: "Deep work session",
        points: 5,
        completed: false,
      },
      {
        id: crypto.randomUUID(),
        name: "Review accomplishments",
        points: 2,
        completed: false,
      },
    ],
    bonusPoints: 3,
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: "Study Session",
    description: "Effective study routine",
    activities: [
      {
        id: crypto.randomUUID(),
        name: "30 minutes focused work",
        points: 4,
        completed: false,
      },
      {
        id: crypto.randomUUID(),
        name: "Complete a difficult task",
        points: 8,
        completed: false,
      },
      {
        id: crypto.randomUUID(),
        name: "Help a colleague",
        points: 3,
        completed: false,
      },
    ],
    bonusPoints: 5,
    isActive: true,
  },
];
