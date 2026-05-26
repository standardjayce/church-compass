import { supabase } from './supabaseClient';

const DEMO_CHURCHES = [
  {
    name: 'Grace Demo Church (Test)',
    slug: 'grace-demo-test',
    description: '[DEMO DATA] A test church for development purposes.',
    address: '123 Test Street',
    city: 'TestCity',
    state: 'TS',
    zip: '12345',
    latitude: 40.7128,
    longitude: -74.0060,
    phone: '(555) 000-0001',
    email: 'test@grace-demo.dev',
    website: 'https://example.com',
    denomination: 'Non-Denominational',
    worship_style: 'Contemporary',
    kids_ministry: true,
    youth_ministry: true,
    verified: false,
    featured: true,
    active: true,
  },
  {
    name: 'Hope Sample Church (Test)',
    slug: 'hope-sample-test',
    description: '[DEMO DATA] A sample church for development testing.',
    address: '456 Sample Ave',
    city: 'SampleTown',
    state: 'ST',
    zip: '54321',
    latitude: 34.0522,
    longitude: -118.2437,
    phone: '(555) 000-0002',
    email: 'info@hope-sample.dev',
    website: 'https://example.com',
    denomination: 'Baptist',
    worship_style: 'Traditional',
    kids_ministry: true,
    youth_ministry: false,
    verified: false,
    featured: true,
    active: true,
  },
  {
    name: 'New Life Test Church (Test)',
    slug: 'new-life-test',
    description: '[DEMO DATA] This is a test church for database validation.',
    address: '789 Trial Road',
    city: 'DemoMetropolis',
    state: 'DM',
    zip: '99999',
    latitude: 41.8781,
    longitude: -87.6298,
    phone: '(555) 000-0003',
    email: 'contact@newlife-test.dev',
    website: 'https://example.com',
    denomination: 'Pentecostal',
    worship_style: 'Contemporary Worship',
    kids_ministry: true,
    youth_ministry: true,
    verified: false,
    featured: true,
    active: true,
  },
  {
    name: 'Living Water Prototype Church (Test)',
    slug: 'living-water-prototype',
    description: '[DEMO DATA] Prototype church for feature testing.',
    address: '321 Beta Street',
    city: 'Testimonialville',
    state: 'TV',
    zip: '88888',
    latitude: 29.7604,
    longitude: -95.3698,
    phone: '(555) 000-0004',
    email: 'dev@livingwater-test.dev',
    website: 'https://example.com',
    denomination: 'Presbyterian',
    worship_style: 'Blended',
    kids_ministry: true,
    youth_ministry: true,
    verified: false,
    featured: true,
    active: true,
  },
  {
    name: 'Restoration Demo Congregation (Test)',
    slug: 'restoration-demo-congregation',
    description: '[DEMO DATA] Demo data for UI/UX testing.',
    address: '654 Mock Lane',
    city: 'VirtualCity',
    state: 'VC',
    zip: '77777',
    latitude: 33.7490,
    longitude: -84.3880,
    phone: '(555) 000-0005',
    email: 'hello@restoration-demo.dev',
    website: 'https://example.com',
    denomination: 'Methodist',
    worship_style: 'Liturgical',
    kids_ministry: true,
    youth_ministry: false,
    verified: false,
    featured: false,
    active: true,
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

    // If churches already exist, don't seed
    if (count && count > 0) {
      return;
    }

    // Seed the demo data
    const { data, error } = await supabase
      .from('churches')
      .insert(DEMO_CHURCHES)
      .select();

    if (!error && data) {
      console.log(`✅ Auto-seeded ${data.length} demo churches`);
    }
  } catch (err) {
    console.error('Auto-seed failed (non-critical):', err);
  }
}
