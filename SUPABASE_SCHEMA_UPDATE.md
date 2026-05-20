# Supabase Schema Update: Add Consent Tracking

## Migration Instructions

Run this SQL in your Supabase SQL editor to add consent tracking to the `project_requests` table.

### SQL Migration

```sql
-- Add consent_given column to project_requests table
ALTER TABLE public.project_requests
ADD COLUMN consent_given BOOLEAN NOT NULL DEFAULT FALSE;

-- Add comment to document the column
COMMENT ON COLUMN public.project_requests.consent_given IS 'Client consent to use GitHub account and Gmail credentials for deployment and Supabase integration';

-- Update existing records (optional - set to false for historical data)
UPDATE public.project_requests
SET consent_given = FALSE
WHERE consent_given IS NULL;
```

## What This Does

- Adds a `consent_given` boolean column to track whether the client gave consent
- Default value is `FALSE` for new records
- Existing records will have `FALSE` unless manually updated
- The column stores the client's consent to use their GitHub and Gmail credentials for:
  - Vercel deployment setup
  - Supabase integration
  - Other necessary deployment tools

## Implementation Details

### Changes Made:

1. **Request Form** (`components/request-form.tsx`)
   - Added confirmation dialog that appears before final submission
   - Users must check the consent checkbox to proceed
   - Form sends `consent_given: true` with the request

2. **Confirmation Dialog** (`components/request-confirmation-dialog.tsx`)
   - New component showing important information about credential usage
   - Requires explicit checkbox confirmation
   - Clear explanation of what credentials will be used and why

3. **API Route** (`app/api/requests/route.ts`)
   - Updated to accept and store `consent_given` field
   - Email notification includes consent status
   - Validation ensures all required fields are present

4. **Types** (`lib/types.ts`)
   - Added `consent_given: boolean` to `ProjectRequest` interface

5. **Admin Detail View** (`app/admin/(dashboard)/requests/[id]/request-detail-client.tsx`)
   - New consent status card showing whether client gave consent
   - Green border/checkmark if consent given
   - Amber border/X if consent not given
   - Clear explanation of what the consent covers

## Database Update Process

1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Create a new query
4. Copy and paste the SQL above
5. Click "Run" to execute the migration
6. Verify the column was added: `SELECT * FROM project_requests LIMIT 1`

## After Migration

- All new requests will require explicit consent
- The confirmation dialog will appear before submission
- Admin panel will display consent status for each request
- Emails will include consent information
- Historical requests will have `consent_given = FALSE` unless manually updated
