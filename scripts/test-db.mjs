import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Read .env.local manually to ensure fresh values
const envPath = path.resolve(process.cwd(), '.env.local');
let uri = process.env.MONGODB_URI;

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('MONGODB_URI=')) {
      uri = trimmed.substring('MONGODB_URI='.length).trim();
      // Remove quotes if present
      if ((uri.startsWith('"') && uri.endsWith('"')) || (uri.startsWith("'") && uri.endsWith("'"))) {
        uri = uri.slice(1, -1);
      }
      break;
    }
  }
}

async function testConnection() {
  console.log('----------------------------------------------------');
  console.log('🔍 Testing MongoDB Atlas Connection');
  console.log('----------------------------------------------------');

  if (!uri || uri.trim() === '') {
    console.log('❌ MONGODB_URI is EMPTY in .env.local');
    console.log('👉 Please paste your MongoDB connection string in .env.local:');
    console.log('   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/terra?retryWrites=true&w=majority');
    process.exit(1);
  }

  // Mask credentials for output security
  const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
  console.log(`📡 Connecting to: ${maskedUri}`);

  const startTime = Date.now();

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });

    const latency = Date.now() - startTime;
    console.log(`\n✅ SUCCESS: Connected to MongoDB in ${latency}ms!`);
    console.log(`📦 Database Name: "${conn.connection.name}"`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`🔢 Ready State: Connected (1)`);

    // List collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`📁 Collections in DB (${collections.length}):`);
    if (collections.length === 0) {
      console.log('   (No collections created yet — will be created automatically when you sync/use the app)');
    } else {
      collections.forEach((c) => console.log(`   • ${c.name}`));
    }

    console.log('----------------------------------------------------');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.log('\n❌ FAILED TO CONNECT:');
    console.error(error.message);
    console.log('\n💡 Troubleshooting Tips:');
    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.log('   • Check your Database User and Password in MongoDB Atlas.');
      console.log('   • Ensure special characters in password are URL-encoded if needed.');
    } else if (error.message.includes('queryTxt ETIMEOUT') || error.message.includes('ENOTFOUND') || error.message.includes('server selection timeout')) {
      console.log('   • Check MongoDB Atlas "Network Access": Make sure your IP address (or 0.0.0.0/0 for everywhere) is allowed.');
      console.log('   • Verify your internet connection or cluster name in the URI.');
    }
    console.log('----------------------------------------------------');
    process.exit(1);
  }
}

testConnection();
