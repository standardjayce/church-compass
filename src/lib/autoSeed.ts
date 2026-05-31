import { supabase } from './supabaseClient';

const DEMO_CHURCHES = [
  {
    name: 'Riverside Community Church',
    slug: 'riverside-community-church',
    description: 'A vibrant community of faith dedicated to authentic worship and spiritual growth. We welcome families of all backgrounds.',
    address: '245 Riverside Drive',
    city: 'Austin',
    state: 'TX',
    zip: '78704',
    latitude: 30.2672,
    longitude: -97.7449,
    phone: '(512) 555-0101',
    email: 'info@riversidechurch.org',
    website: 'https://riversidechurch.org',
    denomination: 'Non-Denominational',
    worship_style: 'Contemporary',
    kids_ministry: true,
    youth_ministry: true,
    verified: true,
    featured: true,
    active: true,
    profile_image_url: 'https://images.unsplash.com/photo-1438747668470-552f029e1994?w=1024&h=1280&fit=crop',
  },
  {
    name: 'Grace Baptist Fellowship',
    slug: 'grace-baptist-fellowship',
    description: 'A warm, Bible-believing community with a heart for reaching our city with the Gospel. Multi-generational worship and discipleship.',
    address: '1200 Oak Street',
    city: 'Denver',
    state: 'CO',
    zip: '80204',
    latitude: 39.7392,
    longitude: -104.9903,
    phone: '(720) 555-0102',
    email: 'contact@gracebaptist.org',
    website: 'https://gracebaptist.org',
    denomination: 'Baptist',
    worship_style: 'Traditional',
    kids_ministry: true,
    youth_ministry: true,
    verified: true,
    featured: true,
    active: true,
    profile_image_url: 'https://images.unsplash.com/photo-1516214104703-3e461bfb9f38?w=1024&h=1280&fit=crop',
  },
  {
    name: 'Hope Orthodox Cathedral',
    slug: 'hope-orthodox-cathedral',
    description: 'Ancient traditions, living faith. Join us for beautiful liturgical worship rooted in centuries of Christian heritage.',
    address: '567 Maple Avenue',
    city: 'Chicago',
    state: 'IL',
    zip: '60614',
    latitude: 41.9028,
    longitude: -87.6233,
    phone: '(312) 555-0103',
    email: 'hello@hopeorthodox.org',
    website: 'https://hopeorthodox.org',
    denomination: 'Orthodox',
    worship_style: 'Liturgical',
    kids_ministry: true,
    youth_ministry: false,
    verified: true,
    featured: true,
    active: true,
    profile_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1024&h=1280&fit=crop',
  },
  {
    name: 'New Life Pentecostal Church',
    slug: 'new-life-pentecostal-church',
    description: 'Empowered by the Holy Spirit for transformed lives. Experience authentic worship, powerful preaching, and genuine community.',
    address: '890 Vine Road',
    city: 'Houston',
    state: 'TX',
    zip: '77002',
    latitude: 29.7589,
    longitude: -95.3677,
    phone: '(713) 555-0104',
    email: 'blessed@newlifepc.org',
    website: 'https://newlifepc.org',
    denomination: 'Pentecostal',
    worship_style: 'Contemporary Worship',
    kids_ministry: true,
    youth_ministry: true,
    verified: false,
    featured: true,
    active: true,
    profile_image_url: 'https://images.unsplash.com/photo-1533461502717-83546f485c90?w=1024&h=1280&fit=crop',
  },
  {
    name: 'Cornerstone Presbyterian Church',
    slug: 'cornerstone-presbyterian-church',
    description: 'Grounded in Reformed theology with a heart for community service. Bible-teaching, Christ-centered worship.',
    address: '345 Elm Street',
    city: 'Seattle',
    state: 'WA',
    zip: '98101',
    latitude: 47.6062,
    longitude: -122.3321,
    phone: '(206) 555-0105',
    email: 'office@cornerstonepc.org',
    website: 'https://cornerstonepc.org',
    denomination: 'Presbyterian',
    worship_style: 'Blended',
    kids_ministry: true,
    youth_ministry: true,
    verified: true,
    featured: false,
    active: true,
    profile_image_url: 'https://images.unsplash.com/photo-1470229722519-ccf4ee4b6138?w=1024&h=1280&fit=crop',
  },
  {
    name: 'Faith Methodist Chapel',
    slug: 'faith-methodist-chapel',
    description: 'Serving our neighbors with compassion since 1952. Join us for thoughtful worship and meaningful community outreach.',
    address: '678 Birch Lane',
    city: 'Boston',
    state: 'MA',
    zip: '02108',
    latitude: 42.3601,
    longitude: -71.0589,
    phone: '(617) 555-0106',
    email: 'faith@methodistchapel.org',
    website: 'https://methodistchapel.org',
    denomination: 'Methodist',
    worship_style: 'Traditional',
    kids_ministry: true,
    youth_ministry: false,
    verified: true,
    featured: false,
    active: true,
    profile_image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1024&h=1280&fit=crop',
  },
  {
    name: 'Living Waters Anglican Church',
    slug: 'living-waters-anglican-church',
    description: 'Celebrating God\'s presence through liturgical beauty and pastoral care. All are welcome at our table.',
    address: '234 Cedar Court',
    city: 'Portland',
    state: 'OR',
    zip: '97204',
    latitude: 45.5152,
    longitude: -122.6784,
    phone: '(503) 555-0107',
    email: 'welcome@livingwatersanglican.org',
    website: 'https://livingwatersanglican.org',
    denomination: 'Anglican',
    worship_style: 'Liturgical',
    kids_ministry: false,
    youth_ministry: false,
    verified: false,
    featured: false,
    active: true,
    profile_image_url: 'https://images.unsplash.com/photo-1504680869281-eb83b21c63cc?w=1024&h=1280&fit=crop',
  },
  {
    name: 'Abundant Grace Assembly',
    slug: 'abundant-grace-assembly',
    description: 'A place where the power of God transforms lives. Contemporary music, powerful preaching, caring community.',
    address: '912 Park Street',
    city: 'Phoenix',
    state: 'AZ',
    zip: '85004',
    latitude: 33.4484,
    longitude: -112.0742,
    phone: '(602) 555-0108',
    email: 'grace@abundantgrace.org',
    website: 'https://abundantgrace.org',
    denomination: 'Assemblies of God',
    worship_style: 'Contemporary',
    kids_ministry: true,
    youth_ministry: true,
    verified: true,
    featured: true,
    active: true,
    profile_image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1024&h=1280&fit=crop',
  },
];

let hasAttemptedSeed = false;

export async function ensureDemoData() {
  // Only try once per session to avoid repeated attempts
  if (hasAttemptedSeed) return;
  hasAttemptedSeed = true;

  try {
    // Check if churches exist
    const { count } = await supabase
      .from('churches')
      .select('id', { count: 'exact', head: true });

    // If we have churches already, check if we should update
    if (count && count > 0) {
      // Only seed if we have less than expected number (allows updates)
      if (count >= DEMO_CHURCHES.length) {
        return;
      }
    }

    // Seed the demo data
    const { data, error } = await supabase
      .from('churches')
      .insert(DEMO_CHURCHES)
      .select();

    if (!error && data) {
      console.log(`✅ Auto-seeded ${data.length} churches`);
    } else if (error && !error.message.includes('duplicate')) {
      console.error('Auto-seed error:', error.message);
    }
  } catch (err) {
    console.error('Auto-seed failed (non-critical):', err);
  }
}
