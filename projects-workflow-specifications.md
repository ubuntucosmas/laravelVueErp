# Projects Module Workflow Redesign Specifications

## Overview

This document outlines the redesigned workflow for the projects module, aligning with the specified 10-step process from client registration to production completion.

## Current State Analysis

### Existing Workflow Components
- **Frontend**: Vue.js components with enquiry workflow and project phases
- **Backend**: Laravel structure (no dedicated projects module yet)
- **Current Steps**: 4-step enquiry workflow + 10 project phases
- **Data Structures**: TypeScript interfaces for enquiries, projects, phases

### Key Findings
- Current workflow has some alignment but needs restructuring
- Project phases exist but don't match the specified production process
- Enquiry statuses need updating to reflect new workflow
- Frontend components need updates to match 10-step process

## New Workflow Process

### 10-Step Process Overview

1. **Client Registered** - Client information captured in system
2. **Enquiry Logged** - Initial project enquiry created
3. **Site Survey Conducted** (Optional) - Location assessment if required
4. **Design Team Creates Mockups/Render/Design** - Creative development phase
5. **Design and Artworks Approved** - Client approval of design work
6. **Design Team Provides List of Materials** - Material requirements specification
7. **Budget Created from Material List** - Cost estimation and budgeting
8. **Quote Prepared and Sent to Client** - Formal quotation for approval
9. **Quote Approved, Project ID Assigned** - Enquiry converted to project
10. **Proceed to Production** - Manufacturing and execution phase

## Detailed Workflow Specifications

### Phase 1: Client Registration
**Status**: `client_registered`
**Responsible**: Sales/Customer Service
**Duration**: 1-2 days
**Required Actions**:
- Capture client contact information
- Verify client details
- Create client profile in system
**Dependencies**: None
**Next Phase**: Enquiry Logging

### Phase 2: Enquiry Logging
**Status**: `enquiry_logged`
**Responsible**: Project Officer
**Duration**: 1 day
**Required Actions**:
- Create enquiry record
- Document project requirements
- Assign priority level
- Link to registered client
**Dependencies**: Client Registration
**Next Phase**: Site Survey (optional) or Design Development

### Phase 3: Site Survey (Optional)
**Status**: `site_survey_completed`
**Responsible**: Survey Team
**Duration**: 2-3 days
**Required Actions**:
- Schedule site visit
- Conduct location assessment
- Document findings and recommendations
- Update enquiry with survey data
**Dependencies**: Enquiry Logging
**Next Phase**: Design Development
**Conditional**: Only if site survey is required

### Phase 4: Design Development
**Status**: `design_completed`
**Responsible**: Design Officer
**Duration**: 5-9 days
**Required Actions**:
- Create initial design concepts
- Develop mockups and renderings
- Present designs to client
- Incorporate client feedback
**Dependencies**: Enquiry Logging (or Site Survey if conducted)
**Next Phase**: Design Approval

### Phase 5: Design Approval
**Status**: `design_approved`
**Responsible**: Project Lead
**Duration**: 2-3 days
**Required Actions**:
- Client review of final designs
- Obtain written approval
- Document approval in system
**Dependencies**: Design Development
**Next Phase**: Material Specification

### Phase 6: Material Specification
**Status**: `materials_specified`
**Responsible**: Design Team
**Duration**: 3-4 days
**Required Actions**:
- Compile comprehensive material list
- Specify quantities and specifications
- Identify material suppliers
- Update system with material requirements
**Dependencies**: Design Approval
**Next Phase**: Budget Creation

### Phase 7: Budget Creation
**Status**: `budget_created`
**Responsible**: Project Lead/Finance Officer
**Duration**: 3-4 days
**Required Actions**:
- Calculate material costs
- Add labor and overhead costs
- Include contingencies
- Create detailed budget breakdown
**Dependencies**: Material Specification
**Next Phase**: Quote Preparation

### Phase 8: Quote Preparation
**Status**: `quote_prepared`
**Responsible**: Project Lead
**Duration**: 2-3 days
**Required Actions**:
- Prepare formal quotation document
- Include all cost breakdowns
- Add terms and conditions
- Send quote to client for approval
**Dependencies**: Budget Creation
**Next Phase**: Quote Approval

### Phase 9: Quote Approval & Project Conversion
**Status**: `quote_approved`
**Responsible**: Project Lead
**Duration**: 1-2 days
**Required Actions**:
- Client review and approval of quote
- Process client payment/deposit
- Generate project ID
- Convert enquiry to active project
**Dependencies**: Quote Preparation
**Next Phase**: Production

### Phase 10: Production
**Status**: `in_production`
**Responsible**: Production Manager
**Duration**: Variable (based on project scope)
**Required Actions**:
- Create production work orders
- Procure materials
- Execute manufacturing
- Quality control checks
- Prepare for delivery/installation
**Dependencies**: Quote Approval
**Next Phase**: Project completion phases

## Data Structure Updates

### Enquiry Status Updates
```typescript
status: 'client_registered' | 'enquiry_logged' | 'site_survey_completed' | 'design_completed' | 'design_approved' | 'materials_specified' | 'budget_created' | 'quote_prepared' | 'quote_approved' | 'converted_to_project' | 'cancelled'
```

### New Project Phases Structure
```typescript
interface ProjectPhase {
  id: string;
  name: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Skipped';
  order: number;
  estimatedDuration: number;
  assignedRole: string;
  dependencies?: string[];
  requiredActions: string[];
  deliverables: string[];
}
```

### Production Phases (Post-Quote Approval)
1. **Procurement** - Material sourcing and acquisition
2. **Pre-Production** - Planning and preparation
3. **Manufacturing** - Core production work
4. **Quality Control** - Testing and inspection
5. **Logistics** - Transportation and delivery
6. **Installation** - On-site setup (if applicable)
7. **Client Handover** - Final delivery and training
8. **Post-Production** - Cleanup and documentation

## Frontend Component Updates

### EnquiryDetailWorkflow.vue Updates
- Replace 4-step workflow with 10-step process
- Update step cards to reflect new phases
- Modify progress calculation
- Update status badges and transitions

### useProjectPhases.ts Updates
- Restructure phase templates to match production workflow
- Update dependencies and order
- Add new production-specific phases

## Backend Requirements

### New Models Needed
- **Project Model** - Main project entity
- **ProjectPhase Model** - Individual phase tracking
- **Material Model** - Material specifications
- **Budget Model** - Cost breakdowns
- **Quote Model** - Quotation management

### Database Migrations Required
- projects table
- project_phases table
- materials table
- budgets table
- quotes table
- Update enquiries table with new status values

## Implementation Plan

### Phase 1: Data Structure Updates
1. Update TypeScript interfaces
2. Create backend migrations
3. Update API endpoints

### Phase 2: Frontend Workflow Updates
1. Modify EnquiryDetailWorkflow.vue
2. Update useProjectPhases.ts
3. Update component logic

### Phase 3: Backend Implementation
1. Create project models and controllers
2. Implement API endpoints
3. Update existing enquiry endpoints

### Phase 4: Testing and Validation
1. Test workflow transitions
2. Validate phase dependencies
3. Test data persistence

## Success Criteria

- [ ] Workflow follows exact 10-step process
- [ ] All status transitions work correctly
- [ ] Phase dependencies are enforced
- [ ] Data persistence across workflow steps
- [ ] User interface reflects new workflow accurately
- [ ] Backend supports all required operations

## Risk Assessment

### Potential Issues
1. **Data Migration**: Existing enquiries may need status updates
2. **UI Complexity**: 10-step process may overwhelm users
3. **Phase Dependencies**: Complex dependency chains may cause blocking

### Mitigation Strategies
1. **Gradual Rollout**: Implement in phases with testing
2. **User Training**: Provide clear workflow documentation
3. **Fallback Options**: Allow skipping optional phases
4. **Progress Indicators**: Clear visual feedback on current status

## Next Steps

1. Begin with data structure updates
2. Update frontend components
3. Implement backend support
4. Test complete workflow
5. Deploy and train users

---

*Document Version: 1.0*
*Last Updated: 2025-09-18*
*Author: Kilo Code (Architect Mode)*