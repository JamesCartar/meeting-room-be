Meeting Room Booking System
Objective
Build a small web application for managing bookings for a single meeting room.
The system must include:
● A backend HTTP API
● A frontend interface
● Role-based behavior
● Basic administrative management features
You may use any libraries or frameworks. The backend API must be in NodeJS.
Roles
The system supports three roles:
● Admin
● Owner
● User
You may design how users are created and how roles are assigned.
Authentication does not need to be production-grade, but the system must clearly distinguish
between roles when performing actions.
Core Entities
User
Each user must have:
● id
● name
● role (admin, owner, or user)
Booking
Each booking must have:
● id
● userId (creator)
● startTime
● endTime
● createdAt
Booking Rules
1. startTime must be before endTime.
2. Bookings must not overlap.
3. Overlap detection must correctly handle:
○ Identical ranges
○ Partial overlaps
○ One range fully inside another
○ Back-to-back bookings (clearly define your logic)
4. All time handling must be consistent (document assumptions).
5. Invalid operations must return clear error responses.
Permissions
User
Can:
● Create booking
● View all bookings
● Delete their own bookings only
Cannot:
● Delete others’ bookings
● Manage users
Owner
Can:
● Create booking
● View all bookings
● Delete any booking
● View bookings grouped by user
● View basic usage summary (e.g., total bookings per user)
Cannot:
● Create or delete users
● Change user roles
Admin
Can:
● Create users
● Delete users
● Change user roles
● View all users
● View all bookings
● Delete any booking
System behavior when deleting a user must be clearly defined (e.g., what happens to their
bookings).
API Requirements
You may design the route structure.
However, the API must clearly support:
● User management (admin)
● Booking creation
● Booking deletion (with permission rules enforced server-side)
● Listing bookings
● Listing users
● Summary/aggregation endpoint for owner/admin
All permission checks must be enforced in the backend.

Frontend Requirements
The frontend must:
● Allow selecting or logging in as a specific user
● Display role clearly
● Allow:
○ Booking creation
○ Viewing bookings
○ Deleting bookings (based on role)
○ User management (admin only)
● Display validation and permission errors clearly
● Provide a usable interface (layout does not need to be visually polished)
The frontend must communicate with your backend API.
