# Funeral Homes & Cemetery Sample Data

## Overview

This document describes the sample data for the Funeral Homes & Cemetery Database feature in the Memora Admin Panel.

## Data Files

### 1. Sample Data Source (`src/data/funeralHomesData.ts`)

Contains exported arrays and utilities for funeral homes and cemetery data:

```typescript
// Main data exports
export const sampleFuneralHomes    // Array of 20 funeral homes
export const sampleCemeteries      // Array of 20 cemeteries
export const dataStatistics        // Statistics about coverage

// Helper functions
export function getUniqueSates()
export function getFuneralHomesByState(state: string)
export function getCemeteriesByState(state: string)
```

## Current Coverage

**States with Sample Data (20):**
- AL (Alabama)
- AK (Alaska)
- AZ (Arizona)
- AR (Arkansas)
- CA (California)
- CO (Colorado)
- CT (Connecticut)
- DE (Delaware)
- FL (Florida)
- GA (Georgia)
- HI (Hawaii)
- ID (Idaho)
- IL (Illinois)
- IN (Indiana)
- IA (Iowa)
- KS (Kansas)
- KY (Kentucky)
- LA (Louisiana)
- ME (Maine)
- MD (Maryland)

**Total Sample Records:**
- 20 Funeral Homes
- 20 Cemeteries
- Coverage: 20 of 50 states

## Data Structure

### Funeral Home Object

```typescript
{
  name: string              // Business name
  address: string           // Street address
  city: string             // City name
  state: string            // US state code (e.g., "CA")
  zipCode: string          // ZIP code
  phone: string            // Contact number
  email?: string           // Email address (optional)
  website?: string         // Website URL (optional)
  services: string[]       // Array of services offered
  isActive: boolean        // Whether business is active
  verified: boolean        // Whether verified by admin
}
```

**Sample Services:**
- Cremation
- Embalming
- Funeral Planning
- Pre-need Arrangements
- Graveside Service
- Memorial Service
- Consultation

### Cemetery Object

```typescript
{
  name: string             // Cemetery name
  address: string          // Street address
  city: string            // City name
  state: string           // US state code
  zipCode: string         // ZIP code
  phone: string           // Contact number
  email?: string          // Email address (optional)
  website?: string        // Website URL (optional)
  plotPricing?: number    // Price per plot (optional)
  services: string[]      // Array of services offered
  isActive: boolean       // Whether open
  verified: boolean       // Whether verified
}
```

**Sample Services:**
- Ground Burial
- Mausoleum
- Columbarium
- Cremation Garden
- Pre-planning
- Maintenance

## Usage in Admin Panel

### Viewing Sample Data

The admin panel at `/admin/funeral-homes` automatically uses this sample data:

1. **Tab 1: Funeral Homes** - Lists all 20 sample funeral homes
   - Searchable by name, city, ZIP code
   - Filterable by state
   - Shows services, contact info, verification status

2. **Tab 2: Cemeteries** - Lists all 20 sample cemeteries
   - Same search/filter capabilities
   - Displays plot pricing when available
   - Shows verification status

### Statistics Dashboard

Shows aggregate data:
- Total funeral homes: 20
- Total verified homes: 20
- Total cemeteries: 20
- States covered: 20

## Seeding to Firebase

### Prerequisites

1. Firebase Admin SDK installed:
   ```bash
   npm install firebase-admin
   ```

2. Google Cloud credentials configured:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/credentials.json"
   ```

3. Firestore collections created: `funeral_homes`, `cemeteries`

### Running the Seed Script

```bash
# Test run (dry run)
TEST_MODE=true node scripts/seed-funeral-homes.js

# Production seed
node scripts/seed-funeral-homes.js
```

Or via npm scripts (when configured):
```bash
npm run seed:funeral-homes
```

### Firestore Security Rules

After seeding, apply these security rules to protect data:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Funeral Homes Collection
    match /funeral_homes/{document=**} {
      allow read: if true;  // Public read access
      allow write: if request.auth.uid != null 
                   && request.auth.token.role in ['admin', 'super_admin'];
    }
    
    // Cemeteries Collection
    match /cemeteries/{document=**} {
      allow read: if true;  // Public read access
      allow write: if request.auth.uid != null 
                   && request.auth.token.role in ['admin', 'super_admin'];
    }
  }
}
```

## Expanding the Database

### Adding More States

To expand beyond the initial 20 states:

1. **Data Sources:**
   - [USA Funeral Homes Online](https://www.usafuneralhomesonline.com/)
   - [PeopleLegacy Cemetery Directory](https://www.peoplelegacy.com/)
   - [Find A Grave](https://www.findagrave.com/) - Cemetery locations
   - State funeral board websites

2. **Adding to Sample Data:**
   - Edit `src/data/funeralHomesData.ts`
   - Add new entries to `sampleFuneralHomes` and `sampleCemeteries` arrays
   - Follow the existing object structure

3. **Batch Import:**
   - Create CSV/JSON from spread sheet data
   - Write import script in `scripts/import-funeral-homes.js`
   - Transform format to match Firebase schema

### Example: Adding Texas Data

```typescript
// In sampleFuneralHomes array
{
  name: "Texas Memorial Funeral Home",
  address: "1000 Main Street",
  city: "Houston",
  state: "TX",
  zipCode: "77001",
  phone: "(713) 555-0100",
  email: "info@texasmemorial.com",
  services: ["Cremation", "Embalming", "Funeral Planning"],
  isActive: true,
  verified: true,
}
```

## Integration with Mobile App

The mobile app uses the Firestore collections for:

1. **Funeral Home Selection** - Users choosing a funeral home
   - `getFuneralHomesByState(state)` - Browse by state
   - `getFuneralHomesByZipCode(zipCode)` - Nearby search

2. **Cemetery Lookup** - Finding burial locations
   - State/ZIP code selection
   - Plot pricing display
   - Services offered

3. **Comparison** - Side-by-side comparison of options
   - Services available
   - Contact information
   - Pricing (if available)

## Statistics Tracking

The admin dashboard tracks:

```typescript
interface Statistics {
  totalFuneralHomes: number
  totalVerifiedHomes: number
  homesByState: { [state: string]: number }
  totalCemeteries: number
  totalVerifiedCemeteries: number
  cemeteriesByState: { [state: string]: number }
  averagePlotPrice: number
  coverageStates: string[]
}
```

## Data Quality Guidelines

When adding or editing data:

### Verification Checklist
- [ ] Name matches official business name
- [ ] Address is current (verified within 6 months)
- [ ] Phone number is valid and answered
- [ ] Email address bounce-tested
- [ ] Website URL active and relevant
- [ ] Services list is accurate and current
- [ ] State code is valid (2-letter abbreviation)
- [ ] ZIP code matches city/state

### Best Practices
1. **Phone Numbers** - Always include area code
2. **Websites** - Include `https://` prefix
3. **Services** - Use standardized list from constants
4. **State Codes** - Use official US state abbreviations
5. **Active Status** - Set `false` if business closed
6. **Verification** - Set `true` only after manual confirmation

## FAQ

**Q: Why only 20 states initially?**
A: Sample data provides a foundation for testing UI/UX before full 50-state rollout. Real data sources require research and verification.

**Q: Can I bulk import data later?**
A: Yes. Create an import script using Firebase Admin SDK to batch upload from CSV/JSON sources.

**Q: Are ratings included in sample data?**
A: Sample ratings are randomly generated (4.5-5.0) for demonstration only. Real ratings require user review system.

**Q: How often should data be updated?**
A: At least quarterly to catch closures, address changes, and new services. Set up admin workflow for user submissions and validations.

**Q: Can funeral homes edit their own information?**
A: Future feature. Requires authentication system for business accounts and approval workflow.

## Related Files

- **Admin Page:** `/app/admin/funeral-homes/page.tsx`
- **Service Layer:** `/src/services/funeralHomesService.ts`
- **Seed Script:** `/scripts/seed-funeral-homes.js`
- **Navigation:** `/src/components/shared/AdminLayout.tsx` (Funeral Homes nav item)

## Next Steps

1. ✅ Sample data created for 20 states
2. ⏳ Export to Firebase collections
3. ⏳ Implement Firebase integration testing
4. ⏳ Expand to all 50 states
5. ⏳ Add data update workflows
6. ⏳ Build business self-service portal
