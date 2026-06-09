# Casket Design Management - Admin Guide

## Overview

The Casket Design Management system allows admins to:
1. **Manage Casket Templates** - Define customizable casket designs with materials and pricing
2. **Manage Color Library** - Create and maintain a collection of colors and finishes
3. **Review User Submissions** - Approve/reject user-customized casket designs
4. **Track Manufacturing Orders** - Monitor production status and shipping

## Access

- **URL**: `/admin/casket-design`
- **Required Role**: `super_admin` or `admin`
- **Navigation**: Click "Casket Design" in the admin sidebar (🪦 icon)

---

## Features

### 1. Templates Tab

Manage casket design templates that users can customize.

#### Create Template
- Click "Add New Template" button
- Required fields:
  - **Name**: Template display name (e.g., "Classic Wood")
  - **Description**: Brief description of the design
  - **Material**: Type of material (e.g., "Solid Wood", "Brushed Steel")
  - **Price**: Base price in USD
  - **Customizable Areas**: Select which areas users can customize:
    - Front (main casket face)
    - Sides (left/right panels)
    - Back (rear panel)
    - Head (top section)

#### Edit Template
- Click the ✏️ edit icon on any template card
- Modify any fields
- Click "Save" to update

#### Delete Template
- Click the 🗑️ delete icon on any template card
- Confirm deletion (this will not affect existing user designs)

#### View Template Details
- Each template card displays:
  - Name and description
  - Material type
  - Base price
  - Customizable areas (with checkmarks)
  - Active/Inactive status

### 2. Color Library Tab

Manage the color and finish options available for casket customization.

#### Color Properties
- **Name**: Color display name (e.g., "Midnight Black")
- **Hex Code**: Color value (e.g., "#1a1a1a")
- **Category**: 
  - Standard (basic colors, commonly used)
  - Premium (luxury colors, higher cost)
  - Custom (special order colors)
- **Finish Type**:
  - Matte (non-reflective)
  - Glossy (shiny, reflective)
  - Metallic (metal-like sheen)
  - Pearl (pearlescent finish)
- **Usage Count**: Auto-tracked - how many designs use this color

#### Add New Color
- Click "Add New Color" button
- Select or enter hex code using color picker
- Set finish type
- Set category (affects pricing)
- Colors are automatically active

#### Manage Colors
- **Edit**: Click button to modify properties
- **Delete**: Remove unused colors
- **Search**: Filter by color name or hex code

#### Color Usage Stats
- Each color card shows how many user designs use it
- Helps identify popular colors
- Valuable for inventory planning

### 3. User Submissions Tab

Review and approve user-customized casket designs.

#### Design Status Flow

```
User Submits → Pending Review → Admin Action
                                    ↓
                        ┌───────────┴────────────┐
                        ↓                        ↓
                    Approved              Rejected
                        ↓                        ↓
              Manufacturing            User Notified
                   Order Created
```

#### Submission Information
Each submission displays:
- **User Name**: Who submitted the design
- **Status Badge**: 
  - ⏳ Pending (yellow)
  - ✓ Approved (green)
  - ✗ Rejected (red)
- **Customization Details**: What was customized (front, sides, back, head)
- **Submission Date**: When the design was submitted

#### Customization Types
- **Image**: Photo uploads (personal photos, family portraits, team logos)
- **Text**: Custom text (names, dates, messages)
- **Team Logo**: Sports team or organizational logos
- **Design Element**: Custom graphics or patterns

#### Review Actions

**Approve Design**
- Click "Approve" button on pending submission
- Design is automatically queued for manufacturing
- User is notified of approval
- Manufacturing order is created

**Reject Design**
- Click "Reject" button on pending submission
- Optionally add rejection reason (max 500 chars)
- User is notified with your feedback
- Design is NOT sent to manufacturing

**View Full Customization**
- Click on submission to see detailed customization preview
- Each customization area shows the type and content
- Quality check before approval

### 4. Manufacturing Orders Tab

Track all casket production orders through the manufacturing process.

#### Order Status Lifecycle

```
Pending → In Production → Ready → Shipped → Completed
```

**Status Definitions:**
- **Pending**: Order created, awaiting manufacturing partner pickup
- **In Production**: Currently being manufactured
- **Ready**: Completed and ready for shipment
- **Shipped**: In transit to customer
- **Completed**: Delivered to customer

#### Order Information
Each order displays:
- **Order ID**: Unique identifier (first 8 chars shown)
- **Manufacturing Partner**: Company producing the casket
- **Order Date**: When order was placed
- **Est. Completion**: Target completion date
- **Quantity**: Number of caskets (typically 1 per order)
- **Status Badge**: Current production status

#### Manage Orders

**Update Status**
- Click "Details" to open full order management
- Change status to reflect current production stage
- Add tracking number when shipped
- Mark as completed when delivered

**Add Tracking**
- Once status is "Shipped", add tracking number
- Customer receives tracking information
- Track delivery progress

**Manufacturing Partners**
- Current partner: Sky Caskets Inc.
- Expandable to multiple partners in future
- Each partner has their own SLA/timeline

#### Order Timeline
- **Standard**: 10-14 business days
- **Express**: 5-7 business days (premium pricing)
- **Expedited**: 2-3 business days (rush fee applies)

---

## Data Models

### Firestore Collections

#### casket_templates
```javascript
{
  id: string,
  name: string,
  description: string,
  material: string,
  price: number,
  image?: string (base64 or URL),
  status: "active" | "inactive",
  customizableAreas: Array<"front" | "sides" | "back" | "head">,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### casket_colors
```javascript
{
  id: string,
  name: string,
  hexCode: string,
  category: "standard" | "premium" | "custom",
  finish: "matte" | "glossy" | "metallic" | "pearl",
  isActive: boolean,
  usageCount: number,
  createdAt: Timestamp
}
```

#### design_submissions
```javascript
{
  id: string,
  userId: string,
  userName: string,
  userEmail: string,
  templateId: string,
  customizations: {
    front?: { type: string, content: string },
    sides?: { type: string, content: string },
    back?: { type: string, content: string },
    head?: { type: string, content: string }
  },
  status: "pending" | "approved" | "rejected",
  submittedAt: Timestamp,
  approvedAt?: Timestamp,
  rejectedAt?: Timestamp,
  notes?: string,
  adminNotes?: string
}
```

#### manufacturing_orders
```javascript
{
  id: string,
  designId: string,
  userId: string,
  userName: string,
  templateId: string,
  status: "pending" | "in_production" | "ready" | "shipped" | "completed",
  orderDate: Timestamp,
  estimatedCompletion?: Timestamp,
  completionDate?: Timestamp,
  manufacturingPartner: string,
  quantity: number,
  cost: number,
  notes?: string,
  trackingNumber?: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## API Integration

### Service Functions Available

Import from `@/src/services/casketDesignService`:

#### Templates
```typescript
getCasketTemplates(): Promise<CasketTemplate[]>
getCasketTemplate(templateId: string): Promise<CasketTemplate | null>
createCasketTemplate(template): Promise<string>
updateCasketTemplate(templateId, updates): Promise<void>
deleteCasketTemplate(templateId): Promise<void>
```

#### Colors
```typescript
getCasketColors(): Promise<CasketColor[]>
createCasketColor(color): Promise<string>
updateCasketColor(colorId, updates): Promise<void>
deleteCasketColor(colorId): Promise<void>
```

#### Design Submissions
```typescript
getDesignSubmissions(status?): Promise<UserDesignSubmission[]>
getUserDesignSubmissions(userId): Promise<UserDesignSubmission[]>
submitDesign(submission): Promise<string>
approveDesignSubmission(submissionId, adminNotes?): Promise<void>
rejectDesignSubmission(submissionId, adminNotes?): Promise<void>
```

#### Manufacturing Orders
```typescript
getManufacturingOrders(status?): Promise<ManufacturingOrder[]>
getUserManufacturingOrders(userId): Promise<ManufacturingOrder[]>
createManufacturingOrder(order): Promise<string>
updateManufacturingOrderStatus(orderId, status, additionalUpdates?): Promise<void>
updateOrderTracking(orderId, trackingNumber): Promise<void>
completeManufacturingOrder(orderId): Promise<void>
```

---

## Security Rules

Firestore security rules are configured as follows:

```
- casket_templates: Read-only for users, Admin CRUD
- casket_colors: Read-only for users, Admin CRUD
- design_submissions: Users can submit/view own, Admin can manage all
- manufacturing_orders: Users view own, Admin full access
```

---

## Best Practices

### Template Management
- ✅ Create templates for major casket styles first
- ✅ Define clear customizable areas to match manufacturing capabilities
- ✅ Keep material names consistent across templates
- ✅ Regularly review customer preferences in design submissions
- ❌ Don't create too many similar templates (causes confusion)

### Color Management
- ✅ Start with standard colors, expand to premium options
- ✅ Use proper hex codes for consistency
- ✅ Monitor usage stats to identify popular colors
- ✅ Regularly add seasonal or trendy colors
- ❌ Don't archive colors used in pending orders

### Design Review
- ✅ Review submissions within 24-48 hours
- ✅ Provide constructive feedback on rejections
- ✅ Check image quality before approval
- ✅ Verify customization areas match template capabilities
- ❌ Don't approve designs with quality issues

### Manufacturing
- ✅ Track all orders through completion
- ✅ Keep communication with Sky Caskets Inc. updated
- ✅ Provide customers with tracking numbers when shipped
- ✅ Archive completed orders for record-keeping
- ❌ Don't create orders without design approval

---

## Troubleshooting

### Submission Not Appearing
- Check submission status filter
- Verify user account is active
- Check database connection logs

### Color Not Available
- Ensure color `isActive` flag is true
- Check if color was deleted
- Verify color hex code is valid

### Order Status Not Updating
- Confirm you have admin permissions
- Check manufacturing partner status
- Verify order exists in system

### Template Not Showing
- Check if template status is "active"
- Verify template has required fields
- Clear browser cache

---

## Roadmap

Planned enhancements:

- [ ] 3D casket preview in admin panel
- [ ] Batch design approvals
- [ ] Automated manufacturing order creation
- [ ] Customer image quality validation
- [ ] Manufacturing partner integrations
- [ ] Order cost calculation
- [ ] Analytics dashboard for design trends
- [ ] Email notifications for status updates

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Firestore logs for errors
3. Contact development team with error details
