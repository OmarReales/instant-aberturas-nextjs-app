# Instant Aberturas - Next.js E-commerce

A modern e-commerce platform for Instant Aberturas, specializing in doors, windows, and related products. Built with Next.js 15, TypeScript, and Firebase.

## Features

- **Product Catalog**: Browse products by category with filters for brand and other attributes
- **Shopping Cart**: Add products to cart and checkout securely
- **User Authentication**: Sign up, login, and profile management
- **Order Management**: Track order history and status
- **Admin Panel**: Manage products, inventory, and orders
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI components
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Image Storage**: Firebase Storage, Cloudinary

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Firebase account

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/instant-aberturas-app-nextjs.git
cd instant-aberturas-app-nextjs
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables
   Create a `.env` file in the root directory based on the `.env.example` file:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

4. Run the development server

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app` - Next.js app directory with routes and components
- `/app/components` - Reusable UI components
- `/app/lib` - Utility functions and API services
- `/app/context` - React context providers
- `/app/hooks` - Custom React hooks
- `/public` - Static assets like images and icons

## Deployment

This project can be deployed to Vercel with minimal configuration:

```bash
npm run build
# or
yarn build
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Firebase](https://firebase.google.com/) - Backend services
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Shadcn UI](https://ui.shadcn.com/) - UI component library
