const fetch = require('node-fetch');

async function testDirectusConnection() {
  const baseUrl = "http://directus-sl0izb3d1xyr4hddh33ffb9k.62.238.15.22.sslip.io/";
  const token = "gGJKsr..._Ejs";
  
  try {
    console.log("Testing Directus connection...");
    
    // Test collections endpoint
    const url = new URL("/collections", baseUrl);
    const response = await fetch(url.toString(), {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      timeout: 10000
    });
    
    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log("Collections count:", data.data?.length || 0);
      console.log("First few collections:", data.data?.slice(0, 3));
    } else {
      console.log("Response text:", await response.text());
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testDirectusConnection();