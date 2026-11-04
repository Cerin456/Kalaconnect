import fs from 'fs';
import path from 'path';
import { hashPassword } from './auth';

export interface Artist {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  craft: string;
  category: string;
  location: string;
  experience: string;
  story: string;
  tradition: string;
  avatarUrl: string;
  badge: string;
  viewsCount: number;
  createdAt: string;
}

export interface Artwork {
  id: string;
  artistId: string;
  title: string;
  craft: string;
  medium: string;
  year: string;
  price?: string;
  dimensions?: string;
  imageUrl: string;
  description: string;
  createdAt: string;
}

export interface Enquiry {
  id: string;
  artistId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  enquiryType: string;
  message: string;
  status: 'pending' | 'responded';
  createdAt: string;
}

export interface PricingRecord {
  id: string;
  artistId: string;
  artworkId?: string;
  artworkTitle: string;
  category: string;
  dimensions?: string;
  materials?: string;
  materialCost: number;
  labourHours: number;
  hourlyRate: number;
  additionalCosts: number;
  complexity: 'simple' | 'moderate' | 'complex' | 'highly_detailed';
  experienceLevel?: string;
  profitMargin: number;
  productionCost: number;
  suggestedMinPrice: number;
  suggestedMaxPrice: number;
  recommendedPrice: number;
  currency: string;
  aiExplanation?: string;
  marketTips?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface JourneyStage {
  id: string;
  stageTitle: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  stageOrder: number;
  stageDate?: string;
  createdAt: string;
}

export interface CreativeJourney {
  id: string;
  artistId: string;
  artworkId: string;
  title: string;
  introduction: string;
  fullStory: string;
  keywords?: string[];
  socialDescription?: string;
  stages: JourneyStage[];
  visibility: 'public' | 'private';
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExhibitionArtwork {
  artworkId: string;
  displayOrder: number;
  customDescription?: string;
}

export interface Exhibition {
  id: string;
  artistId: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  theme: string;
  category: string;
  coverImage: string;
  startDate: string;
  endDate?: string;
  visibility: 'public' | 'private';
  published: boolean;
  artworks: ExhibitionArtwork[];
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

interface DatabaseSchema {
  artists: Artist[];
  artworks: Artwork[];
  enquiries: Enquiry[];
  pricingRecords?: PricingRecord[];
  creativeJourneys?: CreativeJourney[];
  exhibitions?: Exhibition[];
}

const DB_FILE = path.join(process.cwd(), 'data', 'database.json');

const INITIAL_ARTISTS: Artist[] = [
  {
    id: 'artist-1',
    slug: 'meera-devi',
    firstName: 'Meera',
    lastName: 'Devi',
    email: 'meera@kalaconnect.art',
    passwordHash: hashPassword('kala12345'),
    craft: 'Madhubani Painting',
    category: 'Madhubani',
    location: 'Madhubani, Bihar',
    experience: '18 years',
    story:
      'Practicing the sacred Kohbar and Mithila traditions since age 12, Meera Devi uses natural mineral and plant-based dyes extracted from crushed leaves, lampblack, and turmeric. Her works carry motifs of sacred flora, fertility, and cosmic balance passed down through five generations of women in her family.',
    tradition:
      'Centuries-old folk art from the Mithila region of Bihar, traditionally painted on freshly plastered mud walls during ceremonies, characterized by eye-catching geometrical patterns and natural pigment extraction.',
    avatarUrl: '/images/artist_meera.png',
    badge: 'Featured Master Artist',
    viewsCount: 14200,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'artist-2',
    slug: 'ramesh-kumar',
    firstName: 'Ramesh',
    lastName: 'Kumar',
    email: 'ramesh@kalaconnect.art',
    passwordHash: hashPassword('kala12345'),
    craft: 'Blue Pottery Artisan',
    category: 'Blue Pottery',
    location: 'Jaipur, Rajasthan',
    experience: '24 years',
    story:
      'Ramesh learned the fragile art of Blue Pottery under his grandfather in Kot Jewar. Unlike conventional clay pottery, his works use Egyptian paste made of quartz powder, powdered glass, Fuller’s earth, and natural gum, fired only once at low temperatures to produce an inimitable glassy turquoise luster.',
    tradition:
      'A distinct craft of Jaipur of Turko-Persian origin, famous for using no clay whatsoever, creating translucent, cobalt and copper-tinted decorative vessels and tiles.',
    avatarUrl: '/images/artist_ramesh.png',
    badge: 'Verified Master Potter',
    viewsCount: 11800,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'artist-3',
    slug: 'lalita-ben',
    firstName: 'Lalita',
    lastName: 'Ben',
    email: 'lalita@kalaconnect.art',
    passwordHash: hashPassword('kala12345'),
    craft: 'Kutch Embroidery',
    category: 'Kutch Embroidery',
    location: 'Bhuj, Gujarat',
    experience: '15 years',
    story:
      'A master embroiderer from the nomadic Rabari and Ahir communities of Kutch, Lalita Ben stitches intricate mirrors (abhala) into hand-dyed cotton fabrics, creating wearable heirlooms that tell the migration and kinship stories of her community.',
    tradition:
      'An embroidery signature of the arid Kutch desert in Gujarat, known for vibrant silk threadwork, geometric herringbone stitches, and hand-cut mirrors that reflect moonlight.',
    avatarUrl: '/images/artist_lalita.png',
    badge: 'Verified Heritage Artisan',
    viewsCount: 9400,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'artist-4',
    slug: 'jivya-soma',
    firstName: 'Jivya',
    lastName: 'Soma',
    email: 'jivya@kalaconnect.art',
    passwordHash: hashPassword('kala12345'),
    craft: 'Warli Folk Art',
    category: 'Warli',
    location: 'Dahanu, Maharashtra',
    experience: '21 years',
    story:
      'Using rice paste paste pigment on mud-coated walls and handmade canvas, Jivya depicts the rhythm of agricultural cycles, sacred Tarpa dances, and reverence for Mother Nature.',
    tradition:
      'Tribal art originating from Maharashtra, Warli paintings communicate through basic geometric forms: circles, triangles, and squares representing celestial bodies, mountains, and human community.',
    avatarUrl: '/images/art_warli.png',
    badge: 'Master Artisan',
    viewsCount: 7600,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'artist-5',
    slug: 'radha-bai',
    firstName: 'Radha',
    lastName: 'Bai',
    email: 'radha@kalaconnect.art',
    passwordHash: hashPassword('kala12345'),
    craft: 'Charkha Handloom Weaving',
    category: 'Handloom',
    location: 'Chanderi, MP',
    experience: '19 years',
    story:
      'Radha weaves gossamer-light sarees combining silk and cotton with real zari borders on traditional pit looms, sustaining a centuries-old royal weaving patronage.',
    tradition:
      'Chanderi weaves are celebrated for lightweight sheer texture and opulent floral motifs woven entirely on wooden handlooms.',
    avatarUrl: '/images/art_handloom.png',
    badge: 'Verified Artisan',
    viewsCount: 6200,
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_ARTWORKS: Artwork[] = [
  {
    id: 'artwork-1',
    artistId: 'artist-1',
    title: 'Tree of Life with Sacred Deer',
    craft: 'Madhubani Painting',
    medium: 'Natural mineral and plant dyes on handmade paper',
    year: '2025',
    price: '₹14,500',
    dimensions: '22" x 30"',
    imageUrl: '/images/artist_meera.png',
    description: 'Intricate Mithila painting depicting the divine interconnectedness of all living organisms under the kalpavriksha.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'artwork-2',
    artistId: 'artist-1',
    title: 'Krishna & Radha on Sheshnag',
    craft: 'Madhubani Painting',
    medium: 'Lampblack and natural turmeric on raw cotton',
    year: '2024',
    price: '₹22,000',
    dimensions: '30" x 40"',
    imageUrl: '/images/art_madhubani.png',
    description: 'Ceremonial Kohbar panel celebrating love and divine devotion.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'artwork-3',
    artistId: 'artist-2',
    title: 'Cobalt Fluted Heritage Vase',
    craft: 'Blue Pottery',
    medium: 'Quartz stone paste and cobalt oxide glaze',
    year: '2025',
    price: '₹8,900',
    dimensions: '14" Height x 8" Dia',
    imageUrl: '/images/artist_ramesh.png',
    description: 'Wheel-thrown fluted ceramic urn featuring traditional Persian-influenced floral arabesques.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'artwork-4',
    artistId: 'artist-2',
    title: 'Wheel-Thrown Earthen Terracotta Form',
    craft: 'Blue Pottery',
    medium: 'Earthen clay & copper ash glaze',
    year: '2024',
    price: '₹6,400',
    dimensions: '10" Height',
    imageUrl: '/images/art_blue_pottery.png',
    description: 'Rustic handmade vessel crafted on manual stone flywheel.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'artwork-5',
    artistId: 'artist-3',
    title: 'Rabari Mirrorwork Ceremonial Tapestry',
    craft: 'Kutch Embroidery',
    medium: 'Silk floss & glass mirrors on handloom khadi',
    year: '2025',
    price: '₹18,000',
    dimensions: '36" x 48"',
    imageUrl: '/images/artist_lalita.png',
    description: 'Geometric needlecraft studded with hand-cut convex mirrors reflecting light.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'artwork-6',
    artistId: 'artist-4',
    title: 'Tarpa Harvest Dance Harmony',
    craft: 'Warli Folk Art',
    medium: 'Rice flour paste on cow-dung treated canvas',
    year: '2025',
    price: '₹11,000',
    dimensions: '24" x 24"',
    imageUrl: '/images/art_warli.png',
    description: 'Circular Warli spiral dance celebrating agrarian harvest abundance.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'artwork-7',
    artistId: 'artist-5',
    title: 'Chanderi Gold Zari Handloom Saree',
    craft: 'Handloom Weave',
    medium: 'Mulberry silk and metallic gold zari',
    year: '2025',
    price: '₹26,500',
    dimensions: '6.5 Meters with Blouse Piece',
    imageUrl: '/images/art_handloom.png',
    description: 'Woven on manual wooden pit loom with sheer drape and intricate peacocks.',
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'enquiry-1',
    artistId: 'artist-1',
    customerName: 'Ananya Deshmukh',
    customerEmail: 'ananya.d@heritage.in',
    customerPhone: '+91 98201 12345',
    enquiryType: 'custom_commission',
    message: 'We are seeking a 4x6 ft Madhubani Kohbar canvas for our ancestral home in Pune. Could we discuss motif choices and timeline?',
    status: 'pending',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
  },
  {
    id: 'enquiry-2',
    artistId: 'artist-2',
    customerName: 'Marcus Vance',
    customerEmail: 'marcus@galleria-design.com',
    customerPhone: '+1 415 555 0192',
    enquiryType: 'buy_existing',
    message: 'Interested in purchasing two Cobalt Fluted Heritage Vases with international shipping to San Francisco.',
    status: 'responded',
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
  },
];

function readDB(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial: DatabaseSchema = {
        artists: INITIAL_ARTISTS,
        artworks: INITIAL_ARTWORKS,
        enquiries: INITIAL_ENQUIRIES,
        pricingRecords: [],
        creativeJourneys: [],
        exhibitions: [],
      };
      fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf8');
      return initial;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(data);
    return {
      artists: parsed.artists || INITIAL_ARTISTS,
      artworks: parsed.artworks || INITIAL_ARTWORKS,
      enquiries: parsed.enquiries || INITIAL_ENQUIRIES,
      pricingRecords: parsed.pricingRecords || [],
      creativeJourneys: parsed.creativeJourneys || [],
      exhibitions: parsed.exhibitions || [],
    };
  } catch (err) {
    console.error('Error reading database file:', err);
    return {
      artists: INITIAL_ARTISTS,
      artworks: INITIAL_ARTWORKS,
      enquiries: INITIAL_ENQUIRIES,
      pricingRecords: [],
      creativeJourneys: [],
      exhibitions: [],
    };
  }
}

function writeDB(data: DatabaseSchema): void {
  try {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to database file:', err);
  }
}

// Artist helpers
export function getAllArtists(): Artist[] {
  const db = readDB();
  return db.artists;
}

export function getArtistBySlug(slug: string): Artist | undefined {
  const db = readDB();
  return db.artists.find((a) => a.slug.toLowerCase() === slug.toLowerCase());
}

export function getArtistById(id: string): Artist | undefined {
  const db = readDB();
  return db.artists.find((a) => a.id === id);
}

export function getArtistByEmail(email: string): Artist | undefined {
  const db = readDB();
  return db.artists.find((a) => a.email.toLowerCase() === email.toLowerCase());
}

export function createArtist(artist: Omit<Artist, 'id' | 'createdAt' | 'viewsCount'>): Artist {
  const db = readDB();
  const newArtist: Artist = {
    ...artist,
    id: `artist-${Date.now()}`,
    viewsCount: 1,
    createdAt: new Date().toISOString(),
  };
  db.artists.unshift(newArtist);
  writeDB(db);
  return newArtist;
}

export function updateArtist(id: string, updates: Partial<Artist>): Artist | null {
  const db = readDB();
  const index = db.artists.findIndex((a) => a.id === id);
  if (index === -1) return null;
  db.artists[index] = { ...db.artists[index], ...updates };
  writeDB(db);
  return db.artists[index];
}

// Artwork helpers
export function getAllArtworks(): Artwork[] {
  const db = readDB();
  return db.artworks;
}

export function getArtworksByArtistId(artistId: string): Artwork[] {
  const db = readDB();
  return db.artworks.filter((w) => w.artistId === artistId);
}

export function createArtwork(artwork: Omit<Artwork, 'id' | 'createdAt'>): Artwork {
  const db = readDB();
  const newArtwork: Artwork = {
    ...artwork,
    id: `art-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  db.artworks.unshift(newArtwork);
  writeDB(db);
  return newArtwork;
}

export function deleteArtwork(id: string, artistId: string): boolean {
  const db = readDB();
  const initialLen = db.artworks.length;
  db.artworks = db.artworks.filter((w) => !(w.id === id && w.artistId === artistId));
  if (db.artworks.length !== initialLen) {
    writeDB(db);
    return true;
  }
  return false;
}

// Enquiry helpers
export function getEnquiriesByArtistId(artistId: string): Enquiry[] {
  const db = readDB();
  return db.enquiries.filter((e) => e.artistId === artistId);
}

export function createEnquiry(enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Enquiry {
  const db = readDB();
  const newEnquiry: Enquiry = {
    ...enquiry,
    id: `enq-${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  db.enquiries.unshift(newEnquiry);
  writeDB(db);
  return newEnquiry;
}

export function updateEnquiryStatus(id: string, status: 'pending' | 'responded'): boolean {
  const db = readDB();
  const item = db.enquiries.find((e) => e.id === id);
  if (!item) return false;
  item.status = status;
  writeDB(db);
  return true;
}

// Artwork price updater
export function updateArtworkPrice(artworkId: string, artistId: string, price: string): boolean {
  const db = readDB();
  const work = db.artworks.find((w) => w.id === artworkId && w.artistId === artistId);
  if (!work) return false;
  work.price = price;
  writeDB(db);
  return true;
}

// Pricing Record helpers
export function getPricingRecordsByArtistId(artistId: string): PricingRecord[] {
  const db = readDB();
  return (db.pricingRecords || []).filter((r) => r.artistId === artistId);
}

export function getPricingRecordById(id: string): PricingRecord | undefined {
  const db = readDB();
  return (db.pricingRecords || []).find((r) => r.id === id);
}

export function createPricingRecord(
  data: Omit<PricingRecord, 'id' | 'createdAt' | 'updatedAt'>
): PricingRecord {
  const db = readDB();
  if (!db.pricingRecords) db.pricingRecords = [];
  const now = new Date().toISOString();
  const newRecord: PricingRecord = {
    ...data,
    id: `price-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: now,
    updatedAt: now,
  };
  db.pricingRecords.unshift(newRecord);
  writeDB(db);
  return newRecord;
}

export function deletePricingRecord(id: string, artistId: string): boolean {
  const db = readDB();
  if (!db.pricingRecords) return false;
  const initialLen = db.pricingRecords.length;
  db.pricingRecords = db.pricingRecords.filter((r) => !(r.id === id && r.artistId === artistId));
  if (db.pricingRecords.length !== initialLen) {
    writeDB(db);
    return true;
  }
  return false;
}

// Creative Journey helpers
export function getJourneysByArtistId(artistId: string): CreativeJourney[] {
  const db = readDB();
  return (db.creativeJourneys || []).filter((j) => j.artistId === artistId);
}

export function getJourneyById(id: string): CreativeJourney | undefined {
  const db = readDB();
  return (db.creativeJourneys || []).find((j) => j.id === id);
}

export function getJourneyByArtworkId(artworkId: string): CreativeJourney | undefined {
  const db = readDB();
  return (db.creativeJourneys || []).find((j) => j.artworkId === artworkId);
}

export function createJourney(
  data: Omit<CreativeJourney, 'id' | 'createdAt' | 'updatedAt'>
): CreativeJourney {
  const db = readDB();
  if (!db.creativeJourneys) db.creativeJourneys = [];
  const now = new Date().toISOString();
  const newJourney: CreativeJourney = {
    ...data,
    id: `journey-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: now,
    updatedAt: now,
  };
  db.creativeJourneys.unshift(newJourney);
  writeDB(db);
  return newJourney;
}

export function updateJourney(
  id: string,
  artistId: string,
  updates: Partial<CreativeJourney>
): CreativeJourney | null {
  const db = readDB();
  if (!db.creativeJourneys) return null;
  const index = db.creativeJourneys.findIndex((j) => j.id === id && j.artistId === artistId);
  if (index === -1) return null;
  db.creativeJourneys[index] = {
    ...db.creativeJourneys[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writeDB(db);
  return db.creativeJourneys[index];
}

export function deleteJourney(id: string, artistId: string): boolean {
  const db = readDB();
  if (!db.creativeJourneys) return false;
  const initialLen = db.creativeJourneys.length;
  db.creativeJourneys = db.creativeJourneys.filter((j) => !(j.id === id && j.artistId === artistId));
  if (db.creativeJourneys.length !== initialLen) {
    writeDB(db);
    return true;
  }
  return false;
}

// Exhibition helpers
export function getAllPublishedExhibitions(): Exhibition[] {
  const db = readDB();
  return (db.exhibitions || []).filter((e) => e.published && e.visibility === 'public');
}

export function getExhibitionsByArtistId(artistId: string): Exhibition[] {
  const db = readDB();
  return (db.exhibitions || []).filter((e) => e.artistId === artistId);
}

export function getExhibitionById(id: string): Exhibition | undefined {
  const db = readDB();
  return (db.exhibitions || []).find((e) => e.id === id);
}

export function getExhibitionBySlug(slug: string): Exhibition | undefined {
  const db = readDB();
  return (db.exhibitions || []).find((e) => e.slug.toLowerCase() === slug.toLowerCase());
}

export function createExhibition(
  data: Omit<Exhibition, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount'>
): Exhibition {
  const db = readDB();
  if (!db.exhibitions) db.exhibitions = [];
  const now = new Date().toISOString();
  const newExhibition: Exhibition = {
    ...data,
    id: `exh-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    viewsCount: 0,
    createdAt: now,
    updatedAt: now,
  };
  db.exhibitions.unshift(newExhibition);
  writeDB(db);
  return newExhibition;
}

export function updateExhibition(
  id: string,
  artistId: string,
  updates: Partial<Exhibition>
): Exhibition | null {
  const db = readDB();
  if (!db.exhibitions) return null;
  const index = db.exhibitions.findIndex((e) => e.id === id && e.artistId === artistId);
  if (index === -1) return null;
  db.exhibitions[index] = {
    ...db.exhibitions[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writeDB(db);
  return db.exhibitions[index];
}

export function deleteExhibition(id: string, artistId: string): boolean {
  const db = readDB();
  if (!db.exhibitions) return false;
  const initialLen = db.exhibitions.length;
  db.exhibitions = db.exhibitions.filter((e) => !(e.id === id && e.artistId === artistId));
  if (db.exhibitions.length !== initialLen) {
    writeDB(db);
    return true;
  }
  return false;
}

export function incrementExhibitionViews(id: string): void {
  const db = readDB();
  if (!db.exhibitions) return;
  const exh = db.exhibitions.find((e) => e.id === id || e.slug.toLowerCase() === id.toLowerCase());
  if (exh) {
    exh.viewsCount = (exh.viewsCount || 0) + 1;
    writeDB(db);
  }
}
