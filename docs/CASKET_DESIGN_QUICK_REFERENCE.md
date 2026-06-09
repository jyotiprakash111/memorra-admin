# Casket Design System - Developer Quick Reference

## Quick Links

📍 **Admin Page**: `/admin/casket-design`  
📦 **Service**: `@/src/services/casketDesignService`  
📚 **Full Guide**: [CASKET_DESIGN_MANAGEMENT.md](CASKET_DESIGN_MANAGEMENT.md)  
🎉 **Implementation Details**: [CASKET_DESIGN_IMPLEMENTATION.md](CASKET_DESIGN_IMPLEMENTATION.md)

---

## Table of Contents

1. [Service API](#service-api)
2. [Common Tasks](#common-tasks)
3. [Code Examples](#code-examples)
4. [Data Models](#data-models)
5. [Error Handling](#error-handling)

---

## Service API

### Templates

```typescript
// Get all templates
const templates: CasketTemplate[] = await getCasketTemplates()

// Get single template
const template: CasketTemplate | null = await getCasketTemplate('template-id')

// Create template
const templateId: string = await createCasketTemplate({
  name: 'Classic Wood',
  description: 'Traditional wooden casket',
  material: 'Oak Wood',
  price: 1499,
  customizableAreas: ['front', 'sides', 'back', 'head'],
  status: 'active'
})

// Update template
await updateCasketTemplate('template-id', {
  price: 1599,
  status: 'inactive'
})

// Delete template
await deleteCasketTemplate('template-id')
```

### Colors

```typescript
// Get all colors
const colors: CasketColor[] = await getCasketColors()

// Create color
const colorId: string = await createCasketColor({
  name: 'Midnight Black',
  hexCode: '#1a1a1a',
  category: 'standard',
  finish: 'glossy',
  isActive: true,
  usageCount: 0
})

// Update color
await updateCasketColor('color-id', {
  usageCount: 234,
  isActive: false
})

// Delete color
await deleteCasketColor('color-id')
```

### Design Submissions

```typescript
// Get all submissions (optionally filter by status)
const allSubmissions = await getDesignSubmissions()
const pending = await getDesignSubmissions('pending')
const approved = await getDesignSubmissions('approved')

// Get user's submissions
const userDesigns = await getUserDesignSubmissions('user-123')

// Submit design (called from mobile app)
const submissionId = await submitDesign({
  userId: 'user-123',
  userName: 'John Smith',
  userEmail: 'john@example.com',
  templateId: 'template-1',
  customizations: {
    front: { type: 'image', content: 'memorial-photo.jpg' },
    sides: { type: 'text', content: 'In Loving Memory' },
    back: { type: 'team_logo', content: 'patriots-logo.jpg' }
  },
  status: 'pending'
})

// Approve submission
await approveDesignSubmission('submission-id', 'Looks perfect!')

// Reject submission
await rejectDesignSubmission('submission-id', 'Image quality too low')
```

### Manufacturing Orders

```typescript
// Get all orders (optionally filter by status)
const allOrders = await getManufacturingOrders()
const inProduction = await getManufacturingOrders('in_production')

// Get user's orders
const userOrders = await getUserManufacturingOrders('user-123')

// Create order (auto-triggered on design approval)
const orderId = await createManufacturingOrder({
  designId: 'design-123',
  userId: 'user-123',
  userName: 'John Smith',
  templateId: 'template-1',
  status: 'pending',
  manufacturingPartner: 'Sky Caskets Inc.',
  quantity: 1,
  cost: 1499
})

// Update order status
await updateManufacturingOrderStatus('order-id', 'in_production')

// Add tracking number (when shipped)
await updateOrderTracking('order-id', 'TRK123456789')

// Mark order as completed
await completeManufacturingOrder('order-id')
```

---

## Common Tasks

### Task: User Submits a Custom Casket Design

From mobile app:
```typescript
import { submitDesign } from '@/src/services/casketDesignService'

// User selected template and customized it
const customization = {
  front: { type: 'image', content: baseofPhoto },
  sides: { type: 'text', content: userText },
  back: { type: 'team_logo', content: logoUrl }
}

try {
  const submissionId = await submitDesign({
    userId: currentUser.id,
    userName: currentUser.displayName,
    userEmail: currentUser.email,
    templateId: selectedTemplate.id,
    customizations: customization,
    status: 'pending'
  })
  
  toast.success('Design submitted! We\'ll review it within 24 hours.')
} catch (error) {
  toast.error('Failed to submit design. Try again.')
  console.error(error)
}
```

### Task: Admin Reviews and Approves Design

In admin panel (`/admin/casket-design`):
```typescript
import { approveDesignSubmission, createManufacturingOrder } from '@/src/services/casketDesignService'

// User clicks "Approve" button
const handleApprove = async (submissionId: string, adminNotes?: string) => {
  try {
    // Approve the design
    await approveDesignSubmission(submissionId, adminNotes)
    
    // Get submission details
    const submission = await getDesignSubmissions('approved')
    
    // Create manufacturing order
    const order = await createManufacturingOrder({
      designId: submissionId,
      userId: submission.userId,
      userName: submission.userName,
      templateId: submission.templateId,
      status: 'pending',
      manufacturingPartner: 'Sky Caskets Inc.',
      quantity: 1,
      cost: 1499 // Base template price + customization cost
    })
    
    toast.success('Design approved! Manufacturing order created.')
  } catch (error) {
    toast.error('Failed to approve design.')
    console.error(error)
  }
}
```

### Task: Track Manufacturing Order Status

In manufacturing/orders tracking page:
```typescript
import { getManufacturingOrders, updateManufacturingOrderStatus } from '@/src/services/casketDesignService'

// Load orders on page load
useEffect(() => {
  const loadOrders = async () => {
    const orders = await getManufacturingOrders()
    setOrders(orders)
  }
  loadOrders()
}, [])

// Update status when manufacturer provides update
const handleStatusUpdate = async (orderId: string, newStatus: string) => {
  try {
    await updateManufacturingOrderStatus(orderId, newStatus as any)
    toast.success('Order status updated')
    
    // If shipping, add tracking number
    if (newStatus === 'shipped') {
      const trackingNumber = prompt('Enter tracking number:')
      if (trackingNumber) {
        await updateOrderTracking(orderId, trackingNumber)
      }
    }
  } catch (error) {
    toast.error('Failed to update status')
    console.error(error)
  }
}
```

### Task: Display Available Colors to User

In mobile app (color selection):
```typescript
import { getCasketColors } from '@/src/services/casketDesignService'

// Load colors on component mount
useEffect(() => {
  const loadColors = async () => {
    const allColors = await getCasketColors()
    const activeColors = allColors.filter(c => c.isActive)
    setColors(activeColors)
  }
  loadColors()
}, [])

// Render color palette
return (
  <div className="color-grid">
    {colors.map(color => (
      <motion.button
        key={color.id}
        onClick={() => selectColor(color)}
        className="color-swatch"
        style={{ backgroundColor: color.hexCode }}
        title={`${color.name} (${color.finish})`}
      />
    ))}
  </div>
)
```

---

## Code Examples

### Example 1: Display Casket Templates in Mobile App

```typescript
import React, { useEffect, useState } from 'react'
import { getCasketTemplates } from '@/src/services/casketDesignService'
import type { CasketTemplate } from '@/src/services/casketDesignService'

export function CasketSelector() {
  const [templates, setTemplates] = useState<CasketTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<CasketTemplate | null>(null)

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const data = await getCasketTemplates()
        const activeOnly = data.filter(t => t.status === 'active')
        setTemplates(activeOnly)
      } catch (error) {
        console.error('Failed to load templates:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTemplates()
  }, [])

  if (loading) return <div>Loading casket options...</div>

  return (
    <div className="template-grid">
      {templates.map(template => (
        <div
          key={template.id}
          onClick={() => setSelectedTemplate(template)}
          className={`template-card ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
        >
          <h3>{template.name}</h3>
          <p>{template.material}</p>
          <p className="price">${template.price}</p>
          <p className="customizable">
            Customize: {template.customizableAreas.join(', ')}
          </p>
        </div>
      ))}
    </div>
  )
}
```

### Example 2: Admin Statistics Widget

```typescript
import React, { useEffect, useState } from 'react'
import { 
  getCasketTemplates,
  getCasketColors,
  getDesignSubmissions,
  getManufacturingOrders
} from '@/src/services/casketDesignService'

export function CasketStatsWidget() {
  const [stats, setStats] = useState({
    templates: 0,
    colors: 0,
    pendingSubmissions: 0,
    inProduction: 0
  })

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [templates, colors, submissions, orders] = await Promise.all([
          getCasketTemplates(),
          getCasketColors(),
          getDesignSubmissions('pending'),
          getManufacturingOrders('in_production')
        ])

        setStats({
          templates: templates.length,
          colors: colors.length,
          pendingSubmissions: submissions.length,
          inProduction: orders.length
        })
      } catch (error) {
        console.error('Failed to load stats:', error)
      }
    }

    loadStats()
    // Refresh every 30 seconds
    const interval = setInterval(loadStats, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="stats-grid">
      <stat-card title="Templates" value={stats.templates} icon="🎨" />
      <stat-card title="Colors" value={stats.colors} icon="🎭" />
      <stat-card title="Pending Review" value={stats.pendingSubmissions} icon="⏳" />
      <stat-card title="In Production" value={stats.inProduction} icon="⚙️" />
    </div>
  )
}
```

### Example 3: Handle Design Submission Error

```typescript
import { submitDesign } from '@/src/services/casketDesignService'

async function handleDesignSubmission(data) {
  try {
    // Validate user is logged in
    if (!currentUser) {
      throw new Error('You must be logged in to submit a design')
    }

    // Validate customizations
    if (Object.keys(data.customizations).length === 0) {
      throw new Error('Please customize at least one area of the casket')
    }

    // Submit design
    const submissionId = await submitDesign({
      userId: currentUser.uid,
      userName: currentUser.displayName || 'Unknown',
      userEmail: currentUser.email,
      templateId: data.templateId,
      customizations: data.customizations,
      status: 'pending'
    })

    return {
      success: true,
      submissionId,
      message: 'Design submitted successfully!'
    }
  } catch (error) {
    if (error.code === 'permission-denied') {
      return {
        success: false,
        message: 'You don\'t have permission to submit designs.'
      }
    } else if (error.code === 'invalid-argument') {
      return {
        success: false,
        message: 'Invalid design data. Please check your inputs.'
      }
    } else {
      return {
        success: false,
        message: error.message || 'Failed to submit design'
      }
    }
  }
}
```

---

## Data Models

### CasketTemplate
```typescript
interface CasketTemplate {
  id: string                                          // Auto-generated ID
  name: string                                        // "Classic Wood"
  description: string                                 // Full description
  material: string                                    // "Oak Wood"
  price: number                                       // 1499
  image?: string                                      // Optional preview image
  status: 'active' | 'inactive'                      // Availability
  createdAt: Timestamp                                // Creation date
  updatedAt: Timestamp                                // Last modified
  customizableAreas: Array<'front'|'sides'|'back'|'head'>  // Customizable parts
}
```

### CasketColor
```typescript
interface CasketColor {
  id: string                                    // Auto-generated ID
  name: string                                  // "Midnight Black"
  hexCode: string                               // "#1a1a1a"
  category: 'standard' | 'premium' | 'custom'  // Color tier
  finish: 'matte' | 'glossy' | 'metallic' | 'pearl'  // Surface type
  isActive: boolean                             // Available for selection
  usageCount: number                            // How many designs use it
  createdAt: Timestamp                          // Creation date
}
```

### UserDesignSubmission  
```typescript
interface UserDesignSubmission {
  id: string                  // Auto-generated ID
  userId: string              // User's UID
  userName: string            // User's display name
  userEmail: string           // User's email
  templateId: string          // Base template used
  customizations: {           // User customizations per area
    front?: { type: string; content: string }
    sides?: { type: string; content: string }
    back?: { type: string; content: string }
    head?: { type: string; content: string }
  }
  status: 'pending' | 'approved' | 'rejected'  // Current status
  submittedAt: Timestamp      // When submitted
  approvedAt?: Timestamp      // When approved (if approved)
  rejectedAt?: Timestamp      // When rejected (if rejected)
  notes?: string              // User notes with submission
  adminNotes?: string         // Admin notes (rejection reason, etc.)
}
```

### ManufacturingOrder
```typescript
interface ManufacturingOrder {
  id: string                                    // Auto-generated ID
  designId: string                              // Associated design ID
  userId: string                                // Customer user ID
  userName: string                              // Customer name
  templateId: string                            // Base template
  status: 'pending' | 'in_production' | 'ready' | 'shipped' | 'completed'
  orderDate: Timestamp                          // When order created
  estimatedCompletion?: Timestamp               // Expected completion
  completionDate?: Timestamp                    // Actual completion
  manufacturingPartner: string                  // "Sky Caskets Inc."
  quantity: number                              // Usually 1
  cost: number                                  // Order total
  notes?: string                                // Special instructions
  trackingNumber?: string                       // Shipping tracking
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

---

## Error Handling

### Standard Error Codes

```typescript
// Firebase Firestore errors
'permission-denied'     // User doesn't have permission
'not-found'            // Document doesn't exist
'already-exists'       // Document already exists
'invalid-argument'     // Invalid parameter
'internal'             // Server error
'unavailable'          // Service unavailable

// Custom errors
'invalid-template'     // Template doesn't exist or invalid
'invalid-color'        // Color doesn't exist or invalid
'invalid-design'       // Design submission invalid
'invalid-order'        // Manufacturing order invalid
```

### Error Handling Pattern

```typescript
try {
  const result = await getCasketTemplates()
  // Use result
} catch (error: any) {
  // Check error type
  if (error.code === 'permission-denied') {
    console.error('Admin access required')
    showErrorModal('You must be an admin to access this feature')
  } else if (error.code === 'unavailable') {
    console.error('Service temporarily unavailable')
    showErrorModal('Please try again in a moment')
  } else {
    console.error('Unexpected error:', error)
    showErrorModal('An unexpected error occurred')
  }
}
```

---

## Environment Setup

### Required Environment Variables

```bash
# Firebase Configuration (in .env.local)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### Firestore Setup

1. Create these collections in Firebase:
   - `casket_templates`
   - `casket_colors`
   - `design_submissions`
   - `manufacturing_orders`

2. Apply security rules from [CASKET_DESIGN_MANAGEMENT.md](CASKET_DESIGN_MANAGEMENT.md)

3. Create indexes for queries:
   - `design_submissions` on `status` and `submittedAt`
   - `manufacturing_orders` on `status` and `orderDate`

---

## Tips & Best Practices

✅ **Always** catch errors when calling service functions  
✅ **Check** user permissions before operations  
✅ **Validate** data before submission  
✅ **Use** TypeScript for type safety  
✅ **Test** with both success and failure scenarios  

❌ **Don't** expose Firestore errors to users directly  
❌ **Don't** perform heavy operations in render functions  
❌ **Don't** store sensitive data in frontend state  
❌ **Don't** skip error handling  

---

## Support & Resources

📚 Full Guide: [CASKET_DESIGN_MANAGEMENT.md](CASKET_DESIGN_MANAGEMENT.md)  
🎉 Implementation Details: [CASKET_DESIGN_IMPLEMENTATION.md](CASKET_DESIGN_IMPLEMENTATION.md)  
📍 Admin Panel: `/admin/casket-design`  
🔧 Service File: `src/services/casketDesignService.ts`
