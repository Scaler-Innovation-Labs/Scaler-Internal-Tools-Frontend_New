# Backend Integration Notes for Mess Feature

## Overview
This branch (`mess-test`) contains the mess management system without mock data, ready for testing with real backend APIs.

## Important Changes Made

### Removed Mock Data
- ✅ Removed all mock/dummy data from hooks and components
- ✅ Deleted `src/lib/mock-data/mess.ts` file
- ✅ Updated components to use real API calls only
- ✅ Removed unused components with mock data

### API Integration Requirements

#### 1. Missing ID Fields in DTOs
The current API responses are missing ID fields that the frontend needs. Please add these fields:

**VendorSummaryDto should include:**
```typescript
export interface VendorSummaryDto {
  vendorId: number  // ⚠️ MISSING - Required for delete/update operations
  vendorName: string
}
```

**VendorPlanSummaryDto should include:**
```typescript
export interface VendorPlanSummaryDto {
  vendorPlanId: number  // ⚠️ MISSING - Required for cart operations and delete/update
  planName: string
  vendorName: string
  fee: number
  mealTypes: MealType[]
}
```

#### 2. Feedback and Reviews API
The current feedback API doesn't have a `fetchAll` method. Consider adding:
- `GET /mess/feedback/fetchAll` - For admin to see all feedback
- `GET /mess/review/fetchAll` - For admin to see all reviews

Or provide guidance on how admins should fetch all feedback/reviews (e.g., iterate through all vendors).

#### 3. Authentication Headers
Ensure all API endpoints properly handle the authentication cookies/headers that are sent with requests.

## Files Updated in This Branch

### Hooks
- `src/hooks/mess/use-mess-data.ts` - Now uses real API calls only
- `src/hooks/mess/use-mess-admin.ts` - Updated to use admin APIs, removed all mock data

### Components
- `src/components/features/mess/mess-cart.tsx` - Expects vendorPlanId from API
- `src/components/features/mess/admin/mess-admin-dashboard.tsx` - Uses real vendor/plan IDs for operations

### API Integration
- All components now call the real APIs defined in `src/lib/api/mess.ts`
- Error handling is in place for missing IDs (will show user-friendly messages)

## Testing Checklist

### User Side Testing
- [ ] Vendor plans load from API
- [ ] Vendors load from API  
- [ ] User selections load from API
- [ ] Cart submission works with real vendor plan IDs
- [ ] Error handling works when API is unavailable

### Admin Side Testing
- [ ] Vendors list loads from admin API
- [ ] Vendor plans list loads from admin API
- [ ] Create vendor functionality
- [ ] Create vendor plan functionality (requires vendor ID)
- [ ] Delete vendor functionality (requires vendor ID)
- [ ] Delete vendor plan functionality (requires plan ID)
- [ ] Student history management
- [ ] Student feedback management

## Expected Errors During Testing

If the backend doesn't include the required ID fields, you'll see these user-friendly error messages:

1. **"Error: Plan ID is missing. Please contact support."** - When vendorPlanId is missing from vendor plans
2. **"Error: Vendor ID is missing. Please contact support."** - When vendorId is missing from vendors

## Common 403 Forbidden Error

If you're getting a **403 Forbidden error**, this indicates an authentication/authorization issue:

### Possible Causes:
1. **User not authenticated** - Session expired or not logged in
2. **Missing admin permissions** - User doesn't have admin role
3. **Backend not handling auth correctly** - CORS or authentication middleware issues
4. **Wrong API endpoint** - Endpoint doesn't exist or has different permissions

### Debug Steps:
1. **Use the Debug Panel** - Navigate to the Mess Admin Dashboard → Debug tab
2. **Test Authentication** - Click "Test Authentication" to check auth status
3. **Test Mess API** - Click "Test Mess API" to test direct API access
4. **Check Console Logs** - Look for detailed error messages in browser console
5. **Verify Backend URL** - Ensure `NEXT_PUBLIC_BACKEND_URL` is set correctly

### Quick Fixes:
- **Re-login**: Try logging out and logging back in
- **Check Roles**: Ensure the user has admin permissions in the backend
- **Verify Backend**: Confirm the backend is running and accessible
- **Check CORS**: Ensure backend allows requests from the frontend domain

## API Endpoints Expected to Work

Based on `src/lib/api/mess.ts`, these endpoints should be functional:

### User APIs
- `GET /mess/admin/vendorPlan/fetchAll`
- `GET /mess/admin/vendor/fetchAll`
- `GET /mess/vendorPlanSelection/fetchByUser/{userId}`
- `POST /mess/vendorPlanSelection/create`

### Admin APIs
- `GET /mess/admin/vendor/fetchAll`
- `POST /mess/admin/vendor/create`
- `PUT /mess/admin/vendor/update/{vendorId}`
- `DELETE /mess/admin/vendor/delete/{vendorId}`
- `GET /mess/admin/vendorPlan/fetchAll`
- `POST /mess/admin/vendorPlan/create`
- `PUT /mess/admin/vendorPlan/update/{planId}`
- `DELETE /mess/admin/vendorPlan/delete/{planId}`

### Feedback APIs
- `POST /mess/feedback/create`
- `GET /mess/feedback/fetchByVendor/{vendorId}`
- `GET /mess/feedback/fetchByVendorAndUser/{vendorId}/{userId}`

## Next Steps

1. **Backend Team**: Implement the missing ID fields in the DTOs
2. **Backend Team**: Test all API endpoints with this frontend
3. **Backend Team**: Confirm authentication is working properly
4. **Frontend Team**: Test with real data and fix any issues found
5. **Both Teams**: Coordinate on any additional API changes needed

## Contact

If you need any clarification about the API expectations or find issues with the integration, please reach out to the frontend team.
