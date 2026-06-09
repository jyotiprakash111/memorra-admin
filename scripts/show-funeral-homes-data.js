#!/usr/bin/env node
/**
 * Display Funeral Homes & Cemeteries Sample Data Summary
 * 
 * This script displays a summary of the sample data in the database
 * Useful for verifying data import and coverage
 */

import { sampleFuneralHomes, sampleCemeteries, getUniqueSates } from "../src/data/funeralHomesData.js"

console.log("\n╔════════════════════════════════════════════════════════════════╗")
console.log("║     FUNERAL HOMES & CEMETERIES - SAMPLE DATA SUMMARY          ║")
console.log("╚════════════════════════════════════════════════════════════════╝\n")

// Overall Statistics
console.log("📊 OVERALL STATISTICS")
console.log("─".repeat(45))
console.log(`Total Funeral Homes:     ${sampleFuneralHomes.length}`)
console.log(`Total Cemeteries:        ${sampleCemeteries.length}`)
console.log(`Total Locations:         ${sampleFuneralHomes.length + sampleCemeteries.length}`)
console.log(`States Represented:      ${getUniqueSates().length}`)
console.log()

// Breakdown by State
console.log("🗺️  COVERAGE BY STATE")
console.log("─".repeat(45))

const stateStats = {}
sampleFuneralHomes.forEach((home) => {
  if (!stateStats[home.state]) stateStats[home.state] = { homes: 0, cemeteries: 0 }
  stateStats[home.state].homes++
})
sampleCemeteries.forEach((cem) => {
  if (!stateStats[cem.state]) stateStats[cem.state] = { homes: 0, cemeteries: 0 }
  stateStats[cem.state].cemeteries++
})

let count = 0
Object.entries(stateStats)
  .sort()
  .forEach(([state, stats]) => {
    count++
    const homeStr = `${stats.homes} home${stats.homes !== 1 ? "s" : ""}`
    const cemStr = `${stats.cemeteries} cem${stats.cemeteries !== 1 ? "s" : ""}`
    console.log(`  ${count.toString().padStart(2)}. ${state}: ${homeStr.padEnd(8)} | ${cemStr}`)
  })
console.log()

// Funeral Homes List
console.log("🏢 FUNERAL HOMES")
console.log("─".repeat(80))
console.log(`{"#".padEnd(3)} | ${"Name".padEnd(35)} | ${"City, State".padEnd(20)} | ZIP`)
console.log("─".repeat(80))
sampleFuneralHomes.forEach((home, idx) => {
  const num = (idx + 1).toString().padEnd(3)
  const name = home.name.substring(0, 35).padEnd(35)
  const location = `${home.city}, ${home.state}`.substring(0, 20).padEnd(20)
  console.log(`{${num} | ${name} | ${location} | ${home.zipCode}`)
})
console.log()

// Cemeteries List
console.log("⛪ CEMETERIES")
console.log("─".repeat(80))
console.log(`{"#".padEnd(3)} | ${"Name".padEnd(35)} | ${"City, State".padEnd(20)} | Price`)
console.log("─".repeat(80))
sampleCemeteries.forEach((cem, idx) => {
  const num = (idx + 1).toString().padEnd(3)
  const name = cem.name.substring(0, 35).padEnd(35)
  const location = `${cem.city}, ${cem.state}`.substring(0, 20).padEnd(20)
  const price = `$${cem.plotPricing || 0}`.padEnd(5)
  console.log(`{${num} | ${name} | ${location} | ${price}`)
})
console.log()

// Services Summary
console.log("🔧 SERVICES OFFERED")
console.log("─".repeat(45))

const services = new Set()
sampleFuneralHomes.forEach((h) => h.services.forEach((s) => services.add(s)))
sampleCemeteries.forEach((c) => c.services.forEach((s) => services.add(s)))

Array.from(services)
  .sort()
  .forEach((service, idx) => {
    const count = [
      ...sampleFuneralHomes.filter((h) => h.services.includes(service)),
      ...sampleCemeteries.filter((c) => c.services.includes(service)),
    ].length
    console.log(`  ${service.padEnd(30)} ${`(${count})`.padStart(3)}`)
  })
console.log()

// Verification Status
console.log("✅ VERIFICATION STATUS")
console.log("─".repeat(45))
const verifiedHomes = sampleFuneralHomes.filter((h) => h.verified).length
const verifiedCems = sampleCemeteries.filter((c) => c.verified).length
console.log(`Verified Funeral Homes:  ${verifiedHomes}/${sampleFuneralHomes.length}`)
console.log(`Verified Cemeteries:     ${verifiedCems}/${sampleCemeteries.length}`)
console.log(`Total Verified:          ${verifiedHomes + verifiedCems}/${sampleFuneralHomes.length + sampleCemeteries.length}`)
console.log()

// Next Steps
console.log("📋 NEXT STEPS")
console.log("─".repeat(45))
console.log("1. Review data for accuracy")
console.log("2. Create Firebase collections (funeral_homes, cemeteries)")
console.log("3. Deploy Firestore security rules")
console.log("4. Run seed script: npm run seed:funeral-homes")
console.log("5. Test Firebase integration with mobile app")
console.log("6. Expand to all 50 states")
console.log()

console.log("✨ Data is ready for Firebase integration!\n")
