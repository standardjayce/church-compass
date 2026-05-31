const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const churches = [
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
    service_times: [
      { day: 'Sunday', time: '10:00 AM' },
      { day: 'Wednesday', time: '7:00 PM' }
    ],
    kids_ministry: true,
    youth_ministry: true,
    verified: false,
    featured: true,
    active: true
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
    service_times: [{ day: 'Sunday', time: '11:00 AM' }],
    kids_ministry: true,
    youth_ministry: false,
    verified: false,
    featured: true,
    active: true
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
    service_times: [
      { day: 'Sunday', time: '9:00 AM' },
      { day: 'Sunday', time: '11:00 AM' }
    ],
    kids_ministry: true,
    youth_ministry: true,
    verified: false,
    featured: true,
    active: true
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
    service_times: [
      { day: 'Saturday', time: '6:00 PM' },
      { day: 'Sunday', time: '10:30 AM' }
    ],
    kids_ministry: true,
    youth_ministry: true,
    verified: false,
    featured: true,
    active: true
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
    service_times: [
      { day: 'Sunday', time: '8:00 AM' },
      { day: 'Sunday', time: '10:00 AM' }
    ],
    kids_ministry: true,
    youth_ministry: false,
    verified: false,
    featured: false,
    active: true
  }
];

(async () => {
  try {
    console.log('Seeding churches...');
    
    const { data, error } = await supabase
      .from('churches')
      .insert(churches)
      .select();
    
    if (error) {
      console.error('Error seeding churches:', error.message);
      process.exit(1);
    }
    
    console.log(`✅ Successfully seeded ${data.length} churches`);
    data.forEach(church => {
      console.log(`   - ${church.name} (${church.slug})`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
})();
