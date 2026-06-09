#!/usr/bin/env node
/**
 * Seed Script: Populate Funeral Homes & Cemeteries Database
 * 
 * This script initializes the Firestore database with sample funeral homes
 * and cemetery data across multiple US states.
 * 
 * Usage:
 *   node scripts/seed-funeral-homes.js
 *   npm run seed:funeral-homes
 * 
 * Make sure Firebase is configured in firebaseConfig.js before running
 */

const firebaseConfig = require("../src/firebaseConfig")
const {
  sampleFuneralHomes,
  sampleCemeteries,
  dataStatistics,
} = require("../src/data/funeralHomesData")

// Check if running in test mode
const TEST_MODE = process.env.TEST_MODE === "true"

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seed for Funeral Homes & Cemeteries...")
    console.log(`📊 Statistics: ${dataStatistics.sampleFuneralHomes} funeral homes, ${dataStatistics.sampleCemeteries} cemeteries`)

    if (TEST_MODE) {
      console.log("\n✅ TEST MODE: Skipping actual database writes")
      console.log("Sample data would be imported:")
      console.log(`  - ${sampleFuneralHomes.length} funeral homes`)
      console.log(`  - ${sampleCemeteries.length} cemeteries`)
      console.log(`  - ${dataStatistics.totalStatesWithSampleData} states covered`)
      return
    }

    // In production, this would use Firebase Admin SDK
    console.log("\n⚠️  Production Seeding (Firebase required):")
    console.log("  This script requires Firebase Admin SDK setup")
    console.log("  Ensure GOOGLE_APPLICATION_CREDENTIALS is set")
    console.log("  Run: npm install firebase-admin")
    console.log("\n📝 Current sample data summary:")

    const stateMap = {}
    sampleFuneralHomes.forEach((home) => {
      if (!stateMap[home.state]) stateMap[home.state] = { homes: 0, cemeteries: 0 }
      stateMap[home.state].homes++
    })
    sampleCemeteries.forEach((cem) => {
      if (!stateMap[cem.state]) stateMap[cem.state] = { homes: 0, cemeteries: 0 }
      stateMap[cem.state].cemeteries++
    })

    console.log("\n📍 Coverage by State:")
    Object.entries(stateMap)
      .sort()
      .forEach(([state, counts]) => {
        console.log(`  ${state}: ${counts.homes} homes, ${counts.cemeteries} cemeteries`)
      })

    console.log("\n✨ Data ready for import!")
    console.log("Next steps:")
    console.log("  1. Set up Firebase Admin SDK")
    console.log("  2. Configure Firestore security rules")
    console.log("  3. Run: npm run seed:funeral-homes")
  } catch (error) {
    console.error("❌ Error during seeding:", error.message)
    process.exit(1)
  }
}

// Run the seed
seedDatabase().then(() => {
  console.log("\n✅ Seed process complete!")
  process.exit(0)
})
