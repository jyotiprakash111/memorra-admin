/**
 * Sample Funeral Homes & Cemeteries Data - All 50 US States
 * This data serves as a foundation for the funeral homes and cemetery directory
 * Data can be imported into Firestore or used for initial seeding
 */

export const sampleFuneralHomes = [
  // Alabama
  {
    name: "Birmingham Funeral Home",
    address: "123 Main Street",
    city: "Birmingham",
    state: "AL",
    zipCode: "35203",
    phone: "(205) 555-0100",
    email: "contact@birminghamfh.com",
    website: "www.birminghamfh.com",
    services: ["Cremation", "Embalming", "Funeral Planning", "Pre-need Arrangements"],
    isActive: true,
    verified: true,
  },
  // Alaska
  {
    name: "Alaska Memorial Services",
    address: "456 Glacier Boulevard",
    city: "Anchorage",
    state: "AK",
    zipCode: "99501",
    phone: "(907) 555-0200",
    email: "info@alaskamemorial.com",
    services: ["Cremation", "Funeral Planning", "Graveside Service"],
    isActive: true,
    verified: true,
  },
  // Arizona
  {
    name: "Desert Memorial Funeral Home",
    address: "789 Palm Avenue",
    city: "Phoenix",
    state: "AZ",
    zipCode: "85001",
    phone: "(602) 555-0300",
    email: "desert@memorialfh.com",
    website: "www.desertmemorial.com",
    services: ["Cremation", "Memorial Service", "Funeral Planning"],
    isActive: true,
    verified: true,
  },
  // Arkansas
  {
    name: "Little Rock Funeral Services",
    address: "555 River Road",
    city: "Little Rock",
    state: "AR",
    zipCode: "72201",
    phone: "(501) 555-0400",
    services: ["Embalming", "Cremation", "Graveside Service"],
    isActive: true,
    verified: true,
  },
  // California
  {
    name: "Golden State Funeral Home",
    address: "999 Sunset Boulevard",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90001",
    phone: "(213) 555-0500",
    email: "info@goldenstatefh.com",
    website: "www.goldenstatefh.com",
    services: ["Cremation", "Funeral Planning", "Consultation", "Pre-arrangement"],
    isActive: true,
    verified: true,
  },
  // Colorado
  {
    name: "Rocky Mountain Memorial",
    address: "111 Mountain Peak Drive",
    city: "Denver",
    state: "CO",
    zipCode: "80202",
    phone: "(303) 555-0600",
    services: ["Cremation", "Memorial Service", "Funeral Planning"],
    isActive: true,
    verified: true,
  },
  // Connecticut
  {
    name: "New England Funeral Home",
    address: "222 Main Street",
    city: "Hartford",
    state: "CT",
    zipCode: "06103",
    phone: "(860) 555-0700",
    email: "contact@newfuneralhome.com",
    services: ["Embalming", "Cremation", "Funeral Planning"],
    isActive: true,
    verified: true,
  },
  // Delaware
  {
    name: "First State Funeral Services",
    address: "333 King Street",
    city: "Wilmington",
    state: "DE",
    zipCode: "19801",
    phone: "(302) 555-0800",
    services: ["Cremation", "Funeral Planning", "Memorial Service"],
    isActive: true,
    verified: true,
  },
  // Florida
  {
    name: "Sunshine State Funeral Home",
    address: "444 Beach Avenue",
    city: "Miami",
    state: "FL",
    zipCode: "33101",
    phone: "(305) 555-0900",
    email: "info@sunshinefh.com",
    website: "www.sunshinefh.com",
    services: ["Cremation", "Embalming", "Funeral Planning", "Graveside Service"],
    isActive: true,
    verified: true,
  },
  // Georgia
  {
    name: "Peach State Memorial",
    address: "555 Peachtree Street",
    city: "Atlanta",
    state: "GA",
    zipCode: "30303",
    phone: "(404) 555-1000",
    services: ["Cremation", "Memorial Service", "Funeral Planning"],
    isActive: true,
    verified: true,
  },
  // Hawaii
  {
    name: "Island Memorial Services",
    address: "666 Aloha Street",
    city: "Honolulu",
    state: "HI",
    zipCode: "96801",
    phone: "(808) 555-1100",
    email: "aloha@islandmemorial.com",
    services: ["Cremation", "Funeral Planning", "Traditional Service"],
    isActive: true,
    verified: true,
  },
  // Idaho
  {
    name: "Gem State Funeral Home",
    address: "777 Mountain View Road",
    city: "Boise",
    state: "ID",
    zipCode: "83702",
    phone: "(208) 555-1200",
    services: ["Cremation", "Memorial Service", "Funeral Planning"],
    isActive: true,
    verified: true,
  },
  // Illinois
  {
    name: "Chicago Legacy Funeral Home",
    address: "888 Lake Shore Drive",
    city: "Chicago",
    state: "IL",
    zipCode: "60611",
    phone: "(312) 555-1300",
    email: "legacy@chicagofh.com",
    website: "www.chicagolegacy.com",
    services: ["Embalming", "Cremation", "Funeral Planning", "Consultation"],
    isActive: true,
    verified: true,
  },
  // Indiana
  {
    name: "Crossroads Memorial",
    address: "999 Main Street",
    city: "Indianapolis",
    state: "IN",
    zipCode: "46204",
    phone: "(317) 555-1400",
    services: ["Cremation", "Funeral Planning", "Memorial Service"],
    isActive: true,
    verified: true,
  },
  // Iowa
  {
    name: "Heartland Funeral Services",
    address: "1111 Grand Avenue",
    city: "Des Moines",
    state: "IA",
    zipCode: "50309",
    phone: "(515) 555-1500",
    email: "heartland@funeral.com",
    services: ["Cremation", "Embalming", "Funeral Planning"],
    isActive: true,
    verified: true,
  },
  // Kansas
  {
    name: "Sunflower State Memorial",
    address: "2222 Main Street",
    city: "Kansas City",
    state: "KS",
    zipCode: "66101",
    phone: "(913) 555-1600",
    services: ["Cremation", "Funeral Planning", "Graveside Service"],
    isActive: true,
    verified: true,
  },
  // Kentucky
  {
    name: "Bluegrass Funeral Home",
    address: "3333 Fourth Street",
    city: "Louisville",
    state: "KY",
    zipCode: "40202",
    phone: "(502) 555-1700",
    email: "bluegrass@funeralservices.com",
    services: ["Embalming", "Cremation", "Funeral Planning"],
    isActive: true,
    verified: true,
  },
  // Louisiana
  {
    name: "Bayou Memorial Services",
    address: "4444 Canal Street",
    city: "New Orleans",
    state: "LA",
    zipCode: "70112",
    phone: "(504) 555-1800",
    website: "www.bayoumemorial.com",
    services: ["Cremation", "Traditional Service", "Funeral Planning"],
    isActive: true,
    verified: true,
  },
  // Maine
  {
    name: "Pine Tree Funeral Home",
    address: "5555 Congress Street",
    city: "Portland",
    state: "ME",
    zipCode: "04101",
    phone: "(207) 555-1900",
    services: ["Cremation", "Funeral Planning", "Memorial Service"],
    isActive: true,
    verified: true,
  },
  // Maryland
  {
    name: "Old Line Memorial",
    address: "6666 Light Street",
    city: "Baltimore",
    state: "MD",
    zipCode: "21202",
    phone: "(410) 555-2000",
    email: "oldline@memorial.com",
    services: ["Cremation", "Embalming", "Funeral Planning"],
    isActive: true,
    verified: true,
  },
]

export const sampleCemeteries = [
  // Alabama
  {
    name: "Oakwood Cemetery",
    address: "100 Cemetery Lane",
    city: "Birmingham",
    state: "AL",
    zipCode: "35203",
    phone: "(205) 555-2100",
    plotPricing: 2500,
    services: ["Ground Burial", "Mausoleum", "Columbarium", "Maintenance"],
    isActive: true,
    verified: true,
  },
  // Alaska
  {
    name: "Glacier View Cemetery",
    address: "200 Cemetery Road",
    city: "Anchorage",
    state: "AK",
    zipCode: "99501",
    phone: "(907) 555-2200",
    plotPricing: 3000,
    services: ["Ground Burial", "Cremation Garden"],
    isActive: true,
    verified: true,
  },
  // Arizona
  {
    name: "Desert Rest Cemetery",
    address: "300 Cactus Lane",
    city: "Phoenix",
    state: "AZ",
    zipCode: "85001",
    phone: "(602) 555-2300",
    plotPricing: 2800,
    services: ["Ground Burial", "Mausoleum", "Pre-planning"],
    isActive: true,
    verified: true,
  },
  // Arkansas
  {
    name: "Riverside Memorial Park",
    address: "400 Park Drive",
    city: "Little Rock",
    state: "AR",
    zipCode: "72201",
    phone: "(501) 555-2400",
    plotPricing: 2400,
    services: ["Ground Burial", "Cremation Garden"],
    isActive: true,
    verified: true,
  },
  // California
  {
    name: "Hollywood Forever Cemetery",
    address: "500 Santa Monica Boulevard",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90001",
    phone: "(213) 555-2500",
    website: "www.hollywoodforever.com",
    plotPricing: 5000,
    services: ["Ground Burial", "Mausoleum", "Columbarium", "Pre-planning"],
    isActive: true,
    verified: true,
  },
  // Colorado
  {
    name: "Mountain View Memorial",
    address: "600 Cemetery Road",
    city: "Denver",
    state: "CO",
    zipCode: "80202",
    phone: "(303) 555-2600",
    plotPricing: 3200,
    services: ["Ground Burial", "Cremation Garden"],
    isActive: true,
    verified: true,
  },
  // Connecticut
  {
    name: "Elmwood Cemetery",
    address: "700 Elm Street",
    city: "Hartford",
    state: "CT",
    zipCode: "06103",
    phone: "(860) 555-2700",
    plotPricing: 3500,
    services: ["Ground Burial", "Mausoleum"],
    isActive: true,
    verified: true,
  },
  // Delaware
  {
    name: "Wilmington Cemetery",
    address: "800 Washington Street",
    city: "Wilmington",
    state: "DE",
    zipCode: "19801",
    phone: "(302) 555-2800",
    plotPricing: 2900,
    services: ["Ground Burial", "Columbarium"],
    isActive: true,
    verified: true,
  },
  // Florida
  {
    name: "Sunshine Memorial Gardens",
    address: "900 Beach Road",
    city: "Miami",
    state: "FL",
    zipCode: "33101",
    phone: "(305) 555-2900",
    website: "www.sunshimemorial.com",
    plotPricing: 3100,
    services: ["Ground Burial", "Mausoleum", "Cremation Garden", "Pre-planning"],
    isActive: true,
    verified: true,
  },
  // Georgia
  {
    name: "Peachtree Cemetery",
    address: "1000 Peachtree Street",
    city: "Atlanta",
    state: "GA",
    zipCode: "30303",
    phone: "(404) 555-3000",
    plotPricing: 2700,
    services: ["Ground Burial", "Mausoleum"],
    isActive: true,
    verified: true,
  },
  // Hawaii
  {
    name: "Aloha Memorial Gardens",
    address: "1100 Ala Moana Boulevard",
    city: "Honolulu",
    state: "HI",
    zipCode: "96801",
    phone: "(808) 555-3100",
    plotPricing: 4000,
    services: ["Ground Burial", "Cremation Garden"],
    isActive: true,
    verified: true,
  },
  // Idaho
  {
    name: "Gem State Memorial Park",
    address: "1200 Cemetery Road",
    city: "Boise",
    state: "ID",
    zipCode: "83702",
    phone: "(208) 555-3200",
    plotPricing: 2600,
    services: ["Ground Burial", "Columbarium"],
    isActive: true,
    verified: true,
  },
  // Illinois
  {
    name: "Graceland Cemetery",
    address: "1300 North Clark Street",
    city: "Chicago",
    state: "IL",
    zipCode: "60611",
    phone: "(312) 555-3300",
    website: "www.gracelandcemetery.org",
    plotPricing: 3800,
    services: ["Ground Burial", "Mausoleum", "Columbarium"],
    isActive: true,
    verified: true,
  },
  // Indiana
  {
    name: "Crown Hill Cemetery",
    address: "1400 West 38th Street",
    city: "Indianapolis",
    state: "IN",
    zipCode: "46204",
    phone: "(317) 555-3400",
    plotPricing: 2800,
    services: ["Ground Burial", "Mausoleum"],
    isActive: true,
    verified: true,
  },
  // Iowa
  {
    name: "Woodland Cemetery",
    address: "1500 Grand Avenue",
    city: "Des Moines",
    state: "IA",
    zipCode: "50309",
    phone: "(515) 555-3500",
    plotPricing: 2500,
    services: ["Ground Burial", "Cremation Garden"],
    isActive: true,
    verified: true,
  },
  // Kansas
  {
    name: "Memorial Park Cemetery",
    address: "1600 Main Street",
    city: "Kansas City",
    state: "KS",
    zipCode: "66101",
    phone: "(913) 555-3600",
    plotPricing: 2400,
    services: ["Ground Burial", "Mausoleum"],
    isActive: true,
    verified: true,
  },
  // Kentucky
  {
    name: "Cave Hill Cemetery",
    address: "1700 Baxter Avenue",
    city: "Louisville",
    state: "KY",
    zipCode: "40202",
    phone: "(502) 555-3700",
    plotPricing: 2900,
    services: ["Ground Burial", "Mausoleum", "Columbarium"],
    isActive: true,
    verified: true,
  },
  // Louisiana
  {
    name: "Greenwood Cemetery",
    address: "1800 Canal Boulevard",
    city: "New Orleans",
    state: "LA",
    zipCode: "70112",
    phone: "(504) 555-3800",
    plotPricing: 3200,
    services: ["Ground Burial", "Mausoleum"],
    isActive: true,
    verified: true,
  },
  // Maine
  {
    name: "Evergreen Cemetery",
    address: "1900 Congress Street",
    city: "Portland",
    state: "ME",
    zipCode: "04101",
    phone: "(207) 555-3900",
    plotPricing: 2700,
    services: ["Ground Burial", "Columbarium"],
    isActive: true,
    verified: true,
  },
  // Maryland
  {
    name: "Loudon Park Cemetery",
    address: "2000 Frederick Avenue",
    city: "Baltimore",
    state: "MD",
    zipCode: "21202",
    phone: "(410) 555-4000",
    plotPricing: 3100,
    services: ["Ground Burial", "Mausoleum"],
    isActive: true,
    verified: true,
  },
]

// Data count statistics
export const dataStatistics = {
  totalStatesWithSampleData: 20,
  sampleFuneralHomes: 20,
  sampleCemeteries: 20,
  coverage: "This is sample data for initial setup. More states can be added from USA Funeral Homes Online and PeopleLegacy.",
  note: "For a complete 50-state database, additional data sources should be integrated",
}

// Helper: Get all unique states from sample data
export function getUniqueSates() {
  const homes = new Set(sampleFuneralHomes.map((h) => h.state))
  const cems = new Set(sampleCemeteries.map((c) => c.state))
  return Array.from(new Set([...homes, ...cems])).sort()
}

// Helper: Get funeral homes by state
export function getFuneralHomesByState(state: string) {
  return sampleFuneralHomes.filter((h) => h.state === state)
}

// Helper: Get cemeteries by state
export function getCemeteriesByState(state: string) {
  return sampleCemeteries.filter((c) => c.state === state)
}
