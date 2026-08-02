import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Event } from '../models/Event';
import { connectDB } from '../config/db';

dotenv.config();

const eventsData = [
  { name: 'The Upside Down: The Final Portal', slug: 'the-upside-down', category: 'fun', difficulty: 'hard', prize: '₹8,000', description: 'A logic-based treasure hunt with puzzles, clues, and campus challenges. Decode, explore, and sprint across campus. Team up to uncover the Final Portal!', icon: '🌀', team: { min: 2, max: 4 }, feeIEEE: 150, feeNonIEEE: 250, maxParticipants: 100 },
  { name: "Founder's Circle: where idea meets reality", slug: 'founders-circle', category: 'design', difficulty: 'medium', prize: '₹5,000', description: 'Hear directly from founders as they discuss entrepreneurship, innovation, and the realities of building a startup. Gain practical insights, ask questions, and learn from the journeys behind successful ventures.', icon: '💡', team: { min: 1, max: 2 }, feeIEEE: 100, feeNonIEEE: 200, maxParticipants: 100 },
  { name: 'The Traitors: System Breach Edition', slug: 'the-traitors', category: 'fun', difficulty: 'hard', prize: '₹7,000', description: 'System Breach Edition is a thrilling game of trust, strategy, and deception. Complete missions, expose the hidden Traitors and outsmart your opponents before the final system breach.', icon: '🕵️', team: { min: 2, max: 4 }, feeIEEE: 150, feeNonIEEE: 250, maxParticipants: 100 },
  { name: 'Egg Shield', slug: 'egg-shield', category: 'tech', difficulty: 'medium', prize: '₹5,000', description: 'Take on the ultimate engineering challenge by building a protective shield using the given materials to save your raw egg from drops off the 1st, 2nd, and 3rd floors!', icon: '🥚', team: { min: 2, max: 3 }, feeIEEE: 150, feeNonIEEE: 250, maxParticipants: 100 },
  { name: 'Code Red: Hunt, Hack & Fix', slug: 'code-red', category: 'tech', difficulty: 'hard', prize: '₹10,000', description: 'Put your coding skills to the test through technical quizzes, debugging rounds, and a thrilling finale on CodeChef. Every bug is a clue! Think fast, code faster, and rise to the top.', icon: '🚨', team: { min: 1, max: 3 }, feeIEEE: 150, feeNonIEEE: 250, maxParticipants: 100 },
  { name: 'Escape room', slug: 'escape-room', category: 'fun', difficulty: 'medium', prize: '₹5,000', description: 'Follow the clues, solve mind-bending puzzles, and overcome each stage of this immersive adventure. Combine logic, speed and teamwork to outsmart the challenge and escape before time runs out.', icon: '🗝️', team: { min: 2, max: 4 }, feeIEEE: 150, feeNonIEEE: 250, maxParticipants: 100 },
  { name: 'Hawkins Havoc', slug: 'hawkins-havoc', category: 'fun', difficulty: 'easy', prize: '₹4,000', description: 'Take on fun mini-games while Chaos Cards introduce twists like blindfolds, no talking, or reversed instructions. Adapt fast, work as a team, and conquer the chaos!', icon: '🃏', team: { min: 2, max: 4 }, feeIEEE: 100, feeNonIEEE: 200, maxParticipants: 100 },
  { name: 'The Transmission: Every Frame tells a story (pitch verse)', slug: 'the-transmission', category: 'design', difficulty: 'medium', prize: '₹6,000', description: 'Creative Pitch Reel Challenge blends storytelling with innovation in an exciting showcase. Create compelling reels that captivate audiences, communicate impactful ideas, and leave a lasting impression.', icon: '🎬', team: { min: 1, max: 3 }, feeIEEE: 150, feeNonIEEE: 250, maxParticipants: 100 },
  { name: 'DemoGrounds (Battleground)', slug: 'demogrounds', category: 'fun', difficulty: 'hard', prize: '₹8,000', description: 'Battle across a multi-day BGMI league, earning points through eliminations and match placements to qualify for the Grand Finale!', icon: '🎮', team: { min: 4, max: 4 }, feeIEEE: 200, feeNonIEEE: 300, maxParticipants: 100 },
  { name: "The Mind Flayer's Maze (RoboTrack)", slug: 'mind-flayers-maze', category: 'tech', difficulty: 'hard', prize: '₹10,000', description: 'Build an autonomous robot and navigate a maze filled with twists, turns, and unexpected challenges. Precision, speed, and smart programming will lead you to victory.', icon: '🤖', team: { min: 2, max: 4 }, feeIEEE: 200, feeNonIEEE: 300, maxParticipants: 100 },
  { name: 'Mind & Muscle', slug: 'mind-and-muscle', category: 'fun', difficulty: 'medium', prize: '₹5,000', description: 'A perfect blend of brains, strength, and teamwork. Solve challenges, power through obstacles, and prove you have what it takes to conquer both mind and muscle.', icon: '💪', team: { min: 2, max: 4 }, feeIEEE: 150, feeNonIEEE: 250, maxParticipants: 100 },
];

const seedEvents = async () => {
  try {
    await connectDB();
    for (const eventData of eventsData) {
      await Event.findOneAndUpdate({ slug: eventData.slug }, eventData, { upsert: true, new: true });
      console.log(`Synced event: ${eventData.name}`);
    }
    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding events:', error);
    process.exit(1);
  }
};

seedEvents();
