import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const cities = [
  { name: 'Paris', country: 'France', region: 'Europe', costIndex: 8.5, popularityScore: 4.9, imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400' },
  { name: 'Tokyo', country: 'Japan', region: 'Asia', costIndex: 7.0, popularityScore: 4.8, imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400' },
  { name: 'New York', country: 'USA', region: 'North America', costIndex: 9.0, popularityScore: 4.7, imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400' },
  { name: 'Rome', country: 'Italy', region: 'Europe', costIndex: 6.5, popularityScore: 4.8, imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400' },
  { name: 'Bali', country: 'Indonesia', region: 'Asia', costIndex: 3.5, popularityScore: 4.9, imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400' },
  { name: 'Barcelona', country: 'Spain', region: 'Europe', costIndex: 6.0, popularityScore: 4.7, imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400' },
  { name: 'Dubai', country: 'UAE', region: 'Middle East', costIndex: 8.0, popularityScore: 4.6, imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400' },
  { name: 'Bangkok', country: 'Thailand', region: 'Asia', costIndex: 3.0, popularityScore: 4.7, imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400' },
  { name: 'London', country: 'UK', region: 'Europe', costIndex: 9.5, popularityScore: 4.8, imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400' },
  { name: 'Sydney', country: 'Australia', region: 'Oceania', costIndex: 8.0, popularityScore: 4.6, imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400' },
  { name: 'Amsterdam', country: 'Netherlands', region: 'Europe', costIndex: 7.5, popularityScore: 4.5, imageUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400' },
  { name: 'Singapore', country: 'Singapore', region: 'Asia', costIndex: 8.5, popularityScore: 4.7, imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400' },
  { name: 'Istanbul', country: 'Turkey', region: 'Europe/Asia', costIndex: 4.5, popularityScore: 4.6, imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400' },
  { name: 'Prague', country: 'Czech Republic', region: 'Europe', costIndex: 5.0, popularityScore: 4.5, imageUrl: 'https://images.unsplash.com/photo-1458150945447-7fb764c11a92?w=400' },
  { name: 'Santorini', country: 'Greece', region: 'Europe', costIndex: 7.0, popularityScore: 4.9, imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400' },
  { name: 'Kyoto', country: 'Japan', region: 'Asia', costIndex: 6.5, popularityScore: 4.8, imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400' },
  { name: 'Marrakech', country: 'Morocco', region: 'Africa', costIndex: 3.5, popularityScore: 4.6, imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400' },
  { name: 'Lisbon', country: 'Portugal', region: 'Europe', costIndex: 5.5, popularityScore: 4.6, imageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400' },
  { name: 'Vienna', country: 'Austria', region: 'Europe', costIndex: 7.0, popularityScore: 4.5, imageUrl: 'https://images.unsplash.com/photo-1516550135131-fe3dcb0bedc0?w=400' },
  { name: 'Maldives', country: 'Maldives', region: 'Indian Ocean', costIndex: 9.5, popularityScore: 5.0, imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400' },
];

const activities = [
  { name: 'Eiffel Tower Visit', type: 'SIGHTSEEING' as const, cost: 25, durationMinutes: 180, description: 'Visit the iconic iron lattice tower' },
  { name: 'Louvre Museum Tour', type: 'CULTURE' as const, cost: 17, durationMinutes: 240, description: 'World\'s largest art museum' },
  { name: 'Seine River Cruise', type: 'SIGHTSEEING' as const, cost: 15, durationMinutes: 90, description: 'Scenic boat tour along the Seine' },
  { name: 'Sushi Making Class', type: 'FOOD' as const, cost: 85, durationMinutes: 120, description: 'Learn to make authentic Japanese sushi' },
  { name: 'Tsukiji Fish Market Tour', type: 'FOOD' as const, cost: 0, durationMinutes: 120, description: 'Explore the world\'s largest fish market' },
  { name: 'Mount Fuji Hiking', type: 'ADVENTURE' as const, cost: 30, durationMinutes: 480, description: 'Hike Japan\'s iconic volcano' },
  { name: 'Colosseum Tour', type: 'CULTURE' as const, cost: 16, durationMinutes: 150, description: 'Ancient Roman amphitheater exploration' },
  { name: 'Vatican Museums', type: 'CULTURE' as const, cost: 21, durationMinutes: 180, description: 'Sistine Chapel and papal collections' },
  { name: 'Cooking Class in Rome', type: 'FOOD' as const, cost: 70, durationMinutes: 180, description: 'Learn traditional Italian pasta making' },
  { name: 'Ubud Rice Terrace Trek', type: 'ADVENTURE' as const, cost: 20, durationMinutes: 240, description: 'Walk through Bali\'s stunning rice terraces' },
  { name: 'Balinese Spa & Massage', type: 'WELLNESS' as const, cost: 35, durationMinutes: 120, description: 'Traditional Balinese relaxation therapy' },
  { name: 'Sunrise Temple Tour', type: 'CULTURE' as const, cost: 15, durationMinutes: 180, description: 'Visit ancient Hindu temples at dawn' },
  { name: 'Sagrada Familia Visit', type: 'SIGHTSEEING' as const, cost: 26, durationMinutes: 120, description: 'Gaudí\'s unfinished masterpiece' },
  { name: 'Tapas Bar Crawl', type: 'FOOD' as const, cost: 45, durationMinutes: 180, description: 'Traditional Spanish bar-hopping experience' },
  { name: 'Barcelona Beach Day', type: 'WELLNESS' as const, cost: 0, durationMinutes: 300, description: 'Relax at Barceloneta beach' },
  { name: 'Burj Khalifa Observation Deck', type: 'SIGHTSEEING' as const, cost: 35, durationMinutes: 120, description: 'Visit world\'s tallest building' },
  { name: 'Desert Safari', type: 'ADVENTURE' as const, cost: 75, durationMinutes: 360, description: 'Dune bashing and camel riding' },
  { name: 'Dubai Gold Souk', type: 'CULTURE' as const, cost: 0, durationMinutes: 120, description: 'Explore the traditional gold market' },
  { name: 'Thai Cooking Class', type: 'FOOD' as const, cost: 40, durationMinutes: 180, description: 'Learn authentic Thai cuisine' },
  { name: 'Grand Palace Tour', type: 'CULTURE' as const, cost: 15, durationMinutes: 150, description: 'Former royal residence of Thai kings' },
  { name: 'Elephant Sanctuary Visit', type: 'ADVENTURE' as const, cost: 80, durationMinutes: 480, description: 'Ethical elephant interaction experience' },
  { name: 'Tower of London', type: 'CULTURE' as const, cost: 30, durationMinutes: 180, description: 'Historic castle and crown jewels' },
  { name: 'West End Show', type: 'CULTURE' as const, cost: 65, durationMinutes: 150, description: 'World-class theatre performance' },
  { name: 'Borough Market Food Tour', type: 'FOOD' as const, cost: 25, durationMinutes: 120, description: 'London\'s oldest food market' },
  { name: 'Sydney Opera House Tour', type: 'SIGHTSEEING' as const, cost: 40, durationMinutes: 90, description: 'Iconic architectural landmark tour' },
  { name: 'Bondi Beach Surf Lesson', type: 'ADVENTURE' as const, cost: 65, durationMinutes: 120, description: 'Learn to surf at Bondi' },
  { name: 'Blue Mountains Day Trip', type: 'ADVENTURE' as const, cost: 55, durationMinutes: 480, description: 'Scenic escape from Sydney' },
  { name: 'Canal Boat Tour Amsterdam', type: 'SIGHTSEEING' as const, cost: 18, durationMinutes: 90, description: 'Explore Amsterdam\'s famous canals' },
  { name: 'Rijksmuseum Visit', type: 'CULTURE' as const, cost: 22, durationMinutes: 180, description: 'Dutch art and history museum' },
  { name: 'Anne Frank House', type: 'CULTURE' as const, cost: 16, durationMinutes: 90, description: 'Historic wartime hiding place' },
  { name: 'Marina Bay Sands Sky Park', type: 'SIGHTSEEING' as const, cost: 25, durationMinutes: 120, description: 'Iconic rooftop infinity pool views' },
  { name: 'Hawker Centre Food Crawl', type: 'FOOD' as const, cost: 20, durationMinutes: 120, description: 'Singapore street food experience' },
  { name: 'Gardens by the Bay', type: 'SIGHTSEEING' as const, cost: 28, durationMinutes: 180, description: 'Futuristic garden attraction' },
  { name: 'Hagia Sophia Visit', type: 'CULTURE' as const, cost: 0, durationMinutes: 120, description: 'Ancient Byzantine cathedral-mosque' },
  { name: 'Grand Bazaar Shopping', type: 'CULTURE' as const, cost: 0, durationMinutes: 180, description: 'World\'s oldest covered market' },
  { name: 'Bosphorus Boat Tour', type: 'SIGHTSEEING' as const, cost: 20, durationMinutes: 120, description: 'Cruise between two continents' },
  { name: 'Prague Castle Tour', type: 'CULTURE' as const, cost: 15, durationMinutes: 180, description: 'Largest ancient castle complex in the world' },
  { name: 'Old Town Square Walk', type: 'SIGHTSEEING' as const, cost: 0, durationMinutes: 120, description: 'Medieval architecture and Astronomical Clock' },
  { name: 'Czech Beer Tasting', type: 'FOOD' as const, cost: 25, durationMinutes: 120, description: 'Traditional Czech brewery tour' },
  { name: 'Oia Sunset Viewing', type: 'SIGHTSEEING' as const, cost: 0, durationMinutes: 120, description: 'Famous Santorini sunset viewpoint' },
  { name: 'Caldera Boat Tour', type: 'ADVENTURE' as const, cost: 45, durationMinutes: 300, description: 'Explore volcanic islands by boat' },
  { name: 'Wine & Fira Tour', type: 'FOOD' as const, cost: 55, durationMinutes: 180, description: 'Local wine tasting in Santorini' },
  { name: 'Arashiyama Bamboo Grove', type: 'SIGHTSEEING' as const, cost: 0, durationMinutes: 90, description: 'Walk through iconic bamboo forest' },
  { name: 'Geisha District Walk', type: 'CULTURE' as const, cost: 0, durationMinutes: 120, description: 'Explore traditional Gion district' },
  { name: 'Zen Garden Meditation', type: 'WELLNESS' as const, cost: 10, durationMinutes: 60, description: 'Mindful meditation in traditional garden' },
  { name: 'Djemaa El Fna Night Market', type: 'CULTURE' as const, cost: 0, durationMinutes: 180, description: 'Vibrant night market experience' },
  { name: 'Medina Spice Tour', type: 'FOOD' as const, cost: 30, durationMinutes: 180, description: 'Explore traditional Moroccan spice markets' },
  { name: 'Camel Trek in Sahara', type: 'ADVENTURE' as const, cost: 65, durationMinutes: 480, description: 'Overnight desert experience' },
  { name: 'Alfama District Walk', type: 'CULTURE' as const, cost: 0, durationMinutes: 150, description: 'Oldest neighborhood in Lisbon' },
  { name: 'Fado Music Night', type: 'CULTURE' as const, cost: 35, durationMinutes: 150, description: 'Traditional Portuguese music experience' },
  { name: 'Schönbrunn Palace Tour', type: 'CULTURE' as const, cost: 22, durationMinutes: 150, description: 'Imperial Habsburg summer palace' },
  { name: 'Vienna Coffee House Tour', type: 'FOOD' as const, cost: 20, durationMinutes: 120, description: 'Explore Vienna\'s legendary café culture' },
  { name: 'Maldives Snorkeling', type: 'ADVENTURE' as const, cost: 60, durationMinutes: 180, description: 'Explore vibrant coral reefs' },
  { name: 'Overwater Bungalow Stay', type: 'WELLNESS' as const, cost: 500, durationMinutes: 1440, description: 'Luxury overwater accommodation experience' },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Seed cities
  const createdCities = await Promise.all(
    cities.map((city) =>
      prisma.city.upsert({
        where: { id: city.name + city.country }, // Won't match — will always create
        update: {},
        create: city,
      }).catch(() => prisma.city.create({ data: city }))
    )
  );
  console.log(`✅ Created ${createdCities.length} cities`);

  // Seed global activities (no city link)
  const createdActivities = await Promise.all(
    activities.map((activity) =>
      prisma.activity.create({ data: activity })
    )
  );
  console.log(`✅ Created ${createdActivities.length} activities`);

  console.log('🎉 Seed complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
