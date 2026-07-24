import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Event } from '../models/Event';
import { connectDB } from '../config/db';

dotenv.config();

const eventsData = [
  { name: 'Code Siege', slug: 'code-siege', category: 'tech', difficulty: 'hard', prize: '₹10,000', description: 'The ultimate coding showdown — write flawless code under extreme time pressure and zero room for error.', icon: '⚔️', team: { min: 2, max: 3 }, feeIEEE: 150, feeNonIEEE: 250, maxParticipants: 100 },
  { name: 'Debug Dynasty', slug: 'debug-dynasty', category: 'tech', difficulty: 'medium', prize: '₹5,000', description: 'Debug, decode, and dominate in this fast-paced technical quest through layers of broken code.', icon: '🔍', team: { min: 2, max: 4 }, feeIEEE: 150, feeNonIEEE: 250, maxParticipants: 100 },
  { name: 'Cipher Hunt', slug: 'cipher-hunt', category: 'tech', difficulty: 'medium', prize: '₹5,000', description: 'A thrilling technical challenge that tests your problem-solving skills and cryptographic intuition.', icon: '🔐', team: { min: 1, max: 2 }, feeIEEE: 150, feeNonIEEE: 250, maxParticipants: 100 },
  { name: 'Neural Nexus', slug: 'neural-nexus', category: 'tech', difficulty: 'easy', prize: '₹3,000', description: 'Dive into the digital maze and navigate through layers of logic, code, and cunning traps.', icon: '🧠', team: { min: 1, max: 1 }, feeIEEE: 150, feeNonIEEE: 250, maxParticipants: 100 },
  { name: 'Pixel Forge', slug: 'pixel-forge', category: 'design', difficulty: 'hard', prize: '₹8,000', description: 'Push the boundaries of UI/UX in this intense design marathon. Only the most creative survive.', icon: '🎨', team: { min: 2, max: 3 }, feeIEEE: 150, feeNonIEEE: 250, maxParticipants: 100 },
  { name: 'Chromatic Clash', slug: 'chromatic-clash', category: 'design', difficulty: 'medium', prize: '₹5,000', description: 'A high-stakes design sprint where aesthetics meet functionality — pixel perfection required.', icon: '🌈', team: { min: 1, max: 2 }, feeIEEE: 150, feeNonIEEE: 250, maxParticipants: 100 },
  { name: 'Canvas Blitz', slug: 'canvas-blitz', category: 'design', difficulty: 'easy', prize: '₹3,000', description: 'Unleash your creativity and craft stunning visuals from a blank canvas under ticking clocks.', icon: '🖌️', team: { min: 1, max: 1 }, feeIEEE: 150, feeNonIEEE: 250, maxParticipants: 100 },
  { name: 'Design Duel', slug: 'design-duel', category: 'design', difficulty: 'medium', prize: '₹5,000', description: 'Transform abstract ideas into pixel-perfect reality in this electrifying creative battle.', icon: '⚡', team: { min: 1, max: 2 }, feeIEEE: 150, feeNonIEEE: 250, maxParticipants: 100 },
  { name: 'Mind Maze', slug: 'mind-maze', category: 'fun', difficulty: 'hard', prize: '₹7,000', description: 'Expect the unexpected — this chaotic challenge keeps everyone on their toes till the very end.', icon: '🧩', team: { min: 2, max: 3 }, feeIEEE: 150, feeNonIEEE: 250, maxParticipants: 100 },
  { name: 'Rapid Fire', slug: 'rapid-fire', category: 'fun', difficulty: 'easy', prize: '₹3,000', description: "A lighthearted challenge that's all about quick thinking, sharp reflexes, and good vibes.", icon: '🔥', team: { min: 2, max: 4 }, feeIEEE: 150, feeNonIEEE: 250, maxParticipants: 100 },
  { name: 'Alliance', slug: 'alliance', category: 'fun', difficulty: 'medium', prize: '₹5,000', description: 'Team up for a wildly entertaining event that tests your wit, strategy, and teamwork.', icon: '🤝', team: { min: 3, max: 4 }, feeIEEE: 150, feeNonIEEE: 250, maxParticipants: 100 },
  { name: 'Arena Royale', slug: 'arena-royale', category: 'fun', difficulty: 'medium', prize: '₹5,000', description: 'A crowd-favorite spectacle where strategy meets spontaneity in the most unpredictable arena.', icon: '🏟️', team: { min: 2, max: 4 }, feeIEEE: 150, feeNonIEEE: 250, maxParticipants: 100 },
];

const seedEvents = async () => {
  try {
    await connectDB();
    for (const eventData of eventsData) {
      const existing = await Event.findOne({ slug: eventData.slug });
      if (!existing) {
        await Event.create(eventData);
        console.log(`Created event: ${eventData.name}`);
      } else {
        console.log(`Event already exists: ${eventData.name}`);
      }
    }
    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding events:', error);
    process.exit(1);
  }
};

seedEvents();
