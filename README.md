# Local Market App

A simple React Native mobile application for local vendors to list products and customers to browse and shop.

## Features

- **Authentication**: Sign up and sign in with email/password
- **Product Management**: Vendors can add, view, and manage products
- **Product Search**: Customers can search products by name
- **Shopping Cart**: Add products to cart and manage quantities
- **User Profile**: View profile and sign out

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (Database, Auth, Storage)
- **Navigation**: React Navigation
- **Icons**: Expo Vector Icons

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- Supabase account

### 1. Clone and Install

\`\`\`bash
git clone <your-repo-url>
cd local-market-app
npm install
\`\`\`

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Update `lib/supabase.ts` with your credentials:

\`\`\`typescript
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
\`\`\`

### 3. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL scripts from the `scripts/` folder:
   - First run `create-tables.sql`
   - Then run `seed-data.sql` (optional, for sample data)

### 4. Run the App

\`\`\`bash
npm start
\`\`\`

Then use the Expo Go app on your phone to scan the QR code, or run on simulator:

\`\`\`bash
npm run ios     # for iOS simulator
npm run android # for Android emulator
\`\`\`

## Project Structure

\`\`\`
local-market-app/
├── App.tsx                 # Main app component with navigation
├── lib/
│   └── supabase.ts        # Supabase client configuration
├── screens/
│   ├── LoginScreen.tsx    # Authentication - Login
│   ├── RegisterScreen.tsx # Authentication - Register
│   ├── HomeScreen.tsx     # Product listing and search
│   ├── AddProductScreen.tsx # Add new products
│   ├── CartScreen.tsx     # Shopping cart management
│   └── ProfileScreen.tsx  # User profile
├── scripts/
│   ├── create-tables.sql  # Database schema
│   └── seed-data.sql      # Sample data
└── package.json
\`\`\`

## Key Features Implementation

### Authentication
- Email/password authentication using Supabase Auth
- Automatic session management
- Protected routes based on auth state

### Product Management
- CRUD operations for products
- Image URL support for product photos
- Vendor-specific product ownership

### Shopping Cart
- Add/remove products from cart
- Quantity management
- Real-time cart updates
- User-specific cart items

### Search Functionality
- Real-time product search by name
- Case-insensitive search using PostgreSQL ILIKE

## Database Schema

### Products Table
- `id`: UUID (Primary Key)
- `name`: Product name
- `description`: Product description
- `price`: Product price (decimal)
- `image_url`: Optional product image URL
- `vendor_id`: Reference to user who created the product
- `created_at`: Timestamp

### Cart Items Table
- `id`: UUID (Primary Key)
- `user_id`: Reference to user
- `product_id`: Reference to product
- `quantity`: Number of items
- `created_at`: Timestamp

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own cart items
- Users can only modify their own products
- All products are publicly viewable

## Future Enhancements

- Image upload functionality
- Order management system
- Push notifications
- Payment integration
- Product categories and filters
- User ratings and reviews
- Real-time chat between buyers and sellers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes as part of SWE201 coursework.
