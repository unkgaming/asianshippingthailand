# asianshippingthai - Logistics Platform

Modern logistics and freight forwarding platform built with Next.js, Prisma, and Vercel.

## Features

- **Services**: Airfreight, Seafreight (FCL/LCL), Warehousing
- **Customer Portal**: Track shipments, view quotes, manage documents
- **Admin Portal**: Manage shipments, quotes, customers, documents
- **Contact Forms**: Product type selection, weight estimation
- **Real-time Tracking**: Shipment status updates

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Hosting**: Vercel

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL database (or use Neon free tier)

### Setup

1. Clone and install:
```bash
git clone <your-repo>
cd asian
npm install
```

2. Set up environment variables:
```bash
# Create .env file
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

3. Initialize database:
```bash
npx prisma migrate dev
npx prisma generate
```

4. Run development server:
```bash
npm run dev
```

Visit http://localhost:3000

### Useful Commands

```bash
# Database
npx prisma studio           # Browse database
npx prisma migrate dev      # Create & apply migration
npx prisma db push          # Push schema changes

# Development
npm run dev                 # Start dev server
npm run build               # Build for production
npm run start               # Start production server
npm run lint                # Run ESLint
```

## Project Structure

```
asian/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── contact/       # Contact form endpoint
│   │   └── shipments/     # Shipments CRUD
│   ├── about/             # About page
│   ├── admin/             # Admin portal
│   │   └── portal/        # Admin dashboard
│   ├── auth/              # Authentication pages
│   ├── contact/           # Contact page
│   ├── portal/            # Customer portal
│   └── services/          # Service pages
├── components/            # React components
├── contexts/              # React contexts (Auth)
├── lib/                   # Utilities
│   └── prisma.ts         # Prisma client
├── prisma/               # Database schema & migrations
│   └── schema.prisma     # Prisma schema
└── public/               # Static assets
```

## API Endpoints

### Shipments
- `GET /api/shipments` - List all shipments
- `POST /api/shipments` - Create shipment
- `GET /api/shipments/[code]` - Get shipment by code
- `PATCH /api/shipments/[code]` - Update shipment
- `DELETE /api/shipments/[code]` - Delete shipment

### Contact
- `POST /api/contact` - Submit contact form

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

### Quick Deploy to Vercel

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add `DATABASE_URL` environment variable
4. Deploy

## Environment Variables

Required for production:

```env
DATABASE_URL="postgresql://..."  # Neon or other Postgres
```

## Database Schema

### Models
- **User**: Authentication and user profiles
- **Shipment**: Shipment details and tracking
- **ShipmentDocument**: Document metadata

## Features Roadmap

- [x] Customer Portal
- [x] Admin Portal
- [x] Contact Forms
- [x] Shipment CRUD API
- [ ] Real-time tracking updates
- [ ] Document upload/storage
- [ ] Email notifications
- [ ] Payment integration
- [ ] Multi-language support

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

Private - All rights reserved

## Support

For support, email info@asianshippingthai.com or open an issue.
