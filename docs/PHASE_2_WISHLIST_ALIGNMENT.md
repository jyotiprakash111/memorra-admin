# Admin Panel - Phase 2 Wishlist Feature Alignment Audit

## Overview
This document compares the current admin panel implementation against the Phase 2 Wishlist features specified in the requirements document.

---

## Phase 2 Wishlist Features Required

### 1. Casket Customization Management
**Phase 2 Requirement**: Manage user casket designs with 3D customization tool, color selection, personal photos, team logos, etc.

**Current Status**: ❌ NOT IMPLEMENTED
- No admin interface for casket designs
- No 3D design preview/management
- No customization template management

**Required Admin Features**:
- [ ] Casket design management dashboard
- [ ] Casket color/finish library management
- [ ] Design template CRUD operations
- [ ] User casket design review/approval workflow
- [ ] 3D preview integration
- [ ] Manufacturing order tracking

**Priority**: HIGH
**Effort**: HIGH

---

### 2. Flowers (Standing Spray Arrangements)
**Phase 2 Requirement**: Manage a gallery of 50+ standing spray funeral flower arrangements for user selection.

**Current Status**: ❌ NOT IMPLEMENTED
- No flower arrangement library
- No gallery management
- No selection limit enforcement (5 max)

**Required Admin Features**:
- [ ] Flower arrangement gallery CRUD
- [ ] Image management (upload, resize, organize)
- [ ] Flower type categorization
- [ ] Availability/stock tracking
- [ ] Seasonal arrangement updates
- [ ] Supplier management

**Priority**: MEDIUM
**Effort**: MEDIUM

---

### 3. Funeral Homes & Cemetery Selection
**Phase 2 Requirement**: Manage funeral home and cemetery data by ZIP code for user selection.

**Current Status**: ❌ NOT IMPLEMENTED
- No funeral home database
- No cemetery directory
- No ZIP code search infrastructure

**Required Admin Features**:
- [ ] Funeral home directory management (all 50 US states)
- [ ] Cemetery directory management
- [ ] ZIP code mapping system
- [ ] Business contact management
- [ ] Operating hours/services tracking
- [ ] User ratings & reviews moderation
- [ ] Integration with data sources (USA Funeral Homes Online, PeopleLegacy)

**Data Sources**:
- USA Funeral Homes Online
- PeopleLegacy cemetery listings

**Priority**: HIGH
**Effort**: VERY HIGH

---

### 4. Obituary Management
**Phase 2 Requirement**: Enable users to write and save obituaries with publication submission to local newspapers.

**Current Status**: ❌ NOT IMPLEMENTED
- No obituary storage/management
- No newspaper submission workflow
- No obituary preview/approval

**Required Admin Features**:
- [ ] Obituary repository/search
- [ ] Obituary moderation/approval workflow
- [ ] Newspaper publication tracking
- [ ] Template library for obituary writing
- [ ] Publication history logs
- [ ] Newspaper contact database

**Priority**: MEDIUM
**Effort**: MEDIUM

---

### 5. Final Video Message
**Phase 2 Requirement**: Users can upload/record final video messages with distribution options (funeral, followers, trusted contact, feed, family).

**Current Status**: ❌ NOT IMPLEMENTED
- No video upload/storage management
- No distribution tracking
- No playback/delivery management

**Required Admin Features**:
- [ ] Video message repository
- [ ] Video content moderation
- [ ] Distribution tracking (family, followers, funeral, etc.)
- [ ] Delivery status management
- [ ] Video processing/transcoding management
- [ ] Storage quota management
- [ ] Publication scheduling interface

**Priority**: MEDIUM
**Effort**: MEDIUM

---

### 6. Funeral Music Library
**Phase 2 Requirement**: Manage user-selected funeral music with song titles, artists, and streaming links (YouTube, Spotify, Apple Music).

**Current Status**: ❌ NOT IMPLEMENTED
- No music library
- No streaming integration
- No playlist management

**Required Admin Features**:
- [ ] Music library CRUD
- [ ] Song/artist database
- [ ] Streaming service link management (YouTube, Spotify, Apple Music)
- [ ] Music metadata curation
- [ ] Royalty/licensing tracking
- [ ] User playlist view/management
- [ ] Popular songs statistics

**Priority**: LOW
**Effort**: LOW

---

### 7. Cremation Urns Gallery
**Phase 2 Requirement**: Manage cremation urn images for user browsing and selection.

**Current Status**: ❌ NOT IMPLEMENTED
- No urn gallery
- No image management
- No selection tracking

**Required Admin Features**:
- [ ] Urn gallery CRUD
- [ ] Image upload/management
- [ ] Urn categorization (material, style, size, price)
- [ ] Inventory tracking
- [ ] Supplier management
- [ ] User selection statistics

**Priority**: LOW
**Effort**: LOW

---

### 8. Insurance Integration & Call-to-Action
**Phase 2 Requirement**: First year insurance premium covered by Memorra; redirect to insurance application.

**Current Status**: ⚠️ PARTIALLY IMPLEMENTED
- Insurance redirect button exists
- No admin management interface

**Required Admin Features**:
- [ ] Insurance policy management
- [ ] Premium subsidy tracking
- [ ] User conversion analytics
- [ ] Insurance partner integration
- [ ] Auto-enrollment workflow
- [ ] Policy activation tracking
- [ ] Renewal reminder management

**Priority**: MEDIUM
**Effort**: MEDIUM

---

## Current Admin Panel Sections

### Existing Sections (Already Implemented)
1. **Funeral Plans** - Subscription plans (Basic, Standard, Premium, VIP, Legacy)
   - ✅ Plan pricing management
   - ✅ Feature management
   - ✅ Purchase tracking
   - ✅ Status management

2. **Cascade Design** - Memorial design templates
   - ✅ Template CRUD
   - ✅ Design customization options
   - ✅ Download/rating tracking

3. **Products** - E-commerce product management
   - ✅ Product CRUD
   - ✅ Image management
   - ✅ Pricing & inventory

4. **Users** - User management
   - ✅ User roles & permissions
   - ✅ Ban/delete functionality
   - ✅ Status tracking

5. **Messages** - Messaging system management
   - ✅ Message queue
   - ✅ Delivery tracking

6. **Posts** - Social media posts
   - ✅ Post moderation
   - ✅ Content management

7. **Trusted Contacts** - Trusted contact management
   - ✅ Contact verification
   - ✅ Permission levels

8. **Legal** - Legal/compliance management
   - ✅ Dispute handling
   - ✅ Content restrictions

9. **FAQs** - FAQ management
   - ✅ FAQ CRUD
   - ✅ Category management

10. **Feedback** - User feedback
    - ✅ Feedback review
    - ✅ Status tracking

11. **Reports** - Reporting system
    - ✅ Report management
    - ✅ Status tracking

12. **Settings** - Admin settings
    - ✅ Configuration management

---

## Implementation Roadmap

### Phase 2A - Core Wishlist Items (PRIORITY)
**Timeline**: 2-3 weeks

1. **Casket Design Management** (HIGH PRIORITY)
   - Admin dashboard for user-submitted designs
   - Design template library
   - Manufacturing order management
   - Color/finish library

2. **Funeral Homes & Cemetery** (HIGH PRIORITY)
   - Funeral home database (all 50 states)
   - Cemetery directory
   - ZIP code mapping system
   - Service management

### Phase 2B - Secondary Wishlist Items
**Timeline**: 2-3 weeks

3. **Flowers Gallery** (MEDIUM PRIORITY)
   - Standing spray arrangement library (50+)
   - Image management
   - Availability tracking

4. **Obituary Management** (MEDIUM PRIORITY)
   - Obituary storage repository
   - Newspaper submission workflow
   - Publication tracking

5. **Video Message Management** (MEDIUM PRIORITY)
   - Video content moderation
   - Distribution tracking
   - Storage management

### Phase 2C - Supporting Features
**Timeline**: 1-2 weeks

6. **Funeral Music Library** (LOW PRIORITY)
   - Song/artist database
   - Streaming integration

7. **Cremation Urns Gallery** (LOW PRIORITY)
   - Urn image management
   - Categorization system

---

## Missing Data Models

To implement Phase 2 Wishlist features, the following data models need to be created:

### Casket Designs Collection
```
{
  id: string
  userId: string
  name: string
  colors: { primary, secondary, accent }
  customizations: { front, sides, back, head }
  images: string[]
  designStatus: 'draft' | 'submitted' | 'approved' | 'manufacturing'
  manufacturingOrderId?: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Flowers Collection
```
{
  id: string
  name: string
  description: string
  imageUrl: string
  category: string
  pricing: number
  availability: 'in_stock' | 'out_of_stock'
  supplier: string
  createdAt: timestamp
}
```

### Funeral Homes Collection
```
{
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email: string
  website?: string
  services: string[]
  hours: { day: string, open: time, close: time }[]
  rating: number
  createdAt: timestamp
}
```

### Cemeteries Collection
```
{
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email?: string
  website?: string
  plotPricing: number
  services: string[]
  createdAt: timestamp
}
```

### Obituaries Collection
```
{
  id: string
  userId: string
  content: string
  status: 'draft' | 'submitted' | 'published'
  submissionHistory: { newspaper: string, submittedAt: timestamp, status: string }[]
  createdAt: timestamp
  updatedAt: timestamp
  publishedAt?: timestamp
}
```

### Video Messages Collection
```
{
  id: string
  userId: string
  videoUrl: string
  title?: string
  description?: string
  distributionOptions: ('funeral' | 'followers' | 'trusted_contact' | 'feed' | 'family')[]
  deliveryStatus: 'pending' | 'delivered' | 'viewed'
  createdAt: timestamp
  scheduledFor?: timestamp
}
```

### Music Library Collection
```
{
  id: string
  songTitle: string
  artist: string
  album?: string
  streamingLinks: {
    youtube?: string
    spotify?: string
    apple_music?: string
  }
  duration: number
  genre?: string
  isActive: boolean
  createdAt: timestamp
}
```

### Cremation Urns Collection
```
{
  id: string
  name: string
  description: string
  imageUrl: string
  material: string
  style: string
  size: string
  pricing: number
  supplier: string
  availability: 'in_stock' | 'out_of_stock'
  createdAt: timestamp
}
```

---

## Next Steps

1. ✅ Fix admin panel login (COMPLETE)
2. ⏳ Create Casket Design management section
3. ⏳ Create Funeral Homes & Cemetery management section
4. ⏳ Add Flowers gallery management
5. ⏳ Add Obituary management
6. ⏳ Add Video Message management
7. ⏳ Add Music Library management
8. ⏳ Add Cremation Urns management

---

## Notes

- Current admin panel has strong foundations with existing section patterns
- Can reuse existing CRUD components from Products, FAQs, etc.
- Major effort needed for data collection (funeral homes, cemeteries, flowers)
- Integration with external data sources (USA Funeral Homes Online, PeopleLegacy) required
- Phase 2 implementation requires significant backend/database changes
