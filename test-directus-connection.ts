import { fetchDirectusCollection } from '@/lib/directus';

async function testDirectusConnection() {
  try {
    console.log('Testing Directus connection...');
    
    // Try to fetch collections to test connection
    const result = await fetchDirectusCollection('collections');
    
    if (result === null) {
      console.log('Directus connection failed or no data returned');
      return false;
    }
    
    console.log('Directus connection successful');
    console.log('Number of collections:', result.length);
    if (result.length > 0) {
      console.log('First collection:', result[0]);
    }
    return true;
  } catch (error) {
    console.error('Error testing Directus connection:', error);
    return false;
  }
}

// Run test
if (typeof window === 'undefined') {
  testDirectusConnection().then(result => {
    if (result) {
      console.log('Directus connection test passed');
    } else {
      console.log('Directus connection test failed');
    }
  });
}