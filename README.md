# 🎉 VIT Event Scheduler

**Live Site:** [https://vit-event-scheduler.netlify.app/](https://vit-event-scheduler.netlify.app/)

A modern, full-featured event management system built for VIT (Vellore Institute of Technology) to streamline event organization, registration, and management. This project provides a comprehensive solution for managing university events with real-time notifications, venue conflict detection, and automated email systems.

## ✨ Features

### 🗓️ **Event Management**
- **Create & Edit Events**: Comprehensive event creation with detailed information
- **Real-time Updates**: Live synchronization across all users
- **Event Categories**: Organize events by type, department, or custom categories
- **Date & Time Management**: Smart scheduling with conflict detection

### 🏢 **Venue Management**
- **Venue Conflict Detection**: Automatic detection and prevention of double bookings
- **Venue Suggestions**: Smart recommendations for alternative venues
- **Capacity Management**: Track and enforce venue capacity limits
- **Real-time Availability**: Live venue availability checking

### 🔔 **Notification System**
- **Email Notifications**: Automated email alerts for event updates
- **Real-time Notifications**: Instant in-app notifications
- **Custom Notification Settings**: Users can customize their notification preferences
- **Welcome Emails**: Automated welcome emails for new users

### 👤 **User Authentication & Club Management**
- **Secure Authentication**: Built with Supabase Auth
- **Club-based Access Control**: Each VIT club has a unique secret code for registration
- **Role-based Permissions**: Different access levels for club admins and members
- **Club Event Management**: Clubs can create, edit, and manage only their own events
- **Profile Management**: User profile customization and management

#### 🏛️ **Club System**
The platform operates on a **club-based system** where:

- **113 VIT Clubs**: Each official VIT club has a unique secret code
- **Club Registration**: Students use their club's secret code to join and create accounts
- **Event Ownership**: Clubs can only create/edit events for their own organization
- **Super Admin**: OSPC (Open Source Programming Club) has system-wide administrative privileges

#### 🔐 **How to Create Club Account**
1. **Get Your Club Code**: Contact your club's Point of Contact (POC) for the unique secret code
2. **Register**: Use the club code during account registration
3. **Verify Membership**: Club POCs can verify and approve new members
4. **Start Creating**: Once approved, create and manage events for your club

#### 📋 **For Club POCs (Points of Contact)**
- **Account Setup**: Use your club's unique secret code to create the initial admin account
- **Member Management**: Approve new member registrations for your club  
- **Event Control**: Full control over your club's events and activities
- **Collaboration**: Multiple POCs can manage the same club with proper permissions

### 🎨 **Modern UI/UX**
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Mode**: Automatic theme switching based on system preference
- **Intuitive Interface**: Clean, modern design with excellent user experience
- **Accessibility**: Built with accessibility best practices

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn or bun
- A Supabase account ([Sign up free](https://supabase.com))
- (Optional) EmailJS account for email notifications ([Sign up free](https://emailjs.com))

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/vit-event-scheduler-public.git
cd vit-event-scheduler-public
```

### 2. Install Dependencies
```bash
# Using npm
npm install

# Using yarn
yarn install

# Using bun
bun install
```

### 3. Set Up Supabase

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)
2. **Get your project credentials** from Settings → API
3. **Run the database migrations**:
   ```bash
   # Install Supabase CLI if you haven't already
   npm install -g supabase

   # Login to Supabase
   supabase login

   # Link your project
   supabase link --project-ref your-project-id

   # Run migrations
   supabase db push
   ```

### 4. Environment Configuration

**Important for Club Registration:** This system uses club-specific secret codes for user registration. Each of the 113 VIT clubs has a unique code that members must use to create accounts.

1. **Copy the environment files**:
   ```bash
   cp .env.example .env
   cp supabase/.env.example supabase/.env
   ```

2. **Fill in your credentials** in `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. **Configure Supabase functions** in `supabase/.env`:
   ```env
   EMAILJS_SERVICE_ID=your_emailjs_service_id
   EMAILJS_TEMPLATE_ID=your_emailjs_template_id
   EMAILJS_PUBLIC_KEY=your_emailjs_public_key
   SITE_URL=http://localhost:8080
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

### 5. Deploy Supabase Functions (Optional - for email notifications)
```bash
supabase functions deploy
```

### 6. Start Development Server
```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using bun
bun dev
```

Visit `http://localhost:5173` to see your application running!

**Note:** To test the full club functionality, you'll need to:
1. Set up the clubs table with secret codes (see database schema section)
2. Use a club's secret code when creating test accounts
3. Test event creation and management features with different club permissions

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Email**: EmailJS
- **Hosting**: Netlify
- **State Management**: React Hooks + Context API

### Project Structure
```
vit-event-scheduler/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── events/         # Event-specific components
│   │   ├── layout/         # Layout components
│   │   └── ui/            # shadcn/ui components
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # External service integrations
│   │   └── supabase/      # Supabase client and types
│   ├── lib/               # Utility functions and services
│   ├── pages/             # Page components
│   └── App.tsx            # Main application component
├── supabase/
│   ├── functions/         # Serverless functions
│   ├── migrations/        # Database schema migrations
│   └── config.toml        # Supabase configuration
└── public/                # Static assets
```

## 🔧 Configuration Guide

### Database Schema

The application uses the following main tables:

1. **events**: Store event information (title, description, date, venue, etc.)
2. **clubs**: Store club information with unique secret codes for registration
3. **users**: User authentication and profile data (linked to clubs via secret codes)
4. **notifications**: User notification preferences and history
5. **venues**: Venue information and availability

#### Club Secret Codes Setup

To enable the club registration system, you need to populate the clubs table with secret codes. Here's the structure:

```sql
-- Add secret_code column to clubs table
ALTER TABLE public.clubs ADD COLUMN secret_code TEXT UNIQUE;

-- Example: Add clubs with their unique codes
INSERT INTO public.clubs (club_name, description, secret_code) VALUES 
('OPEN SOURCE PROGRAMMING CLUB', 'System Administrators', 'XXXXXXXXXXXXX'),
('ACM STUDENT CHAPTER', 'ACM Student Chapter', 'XXXXXXXXXXXXX'),
-- ... add all 113 clubs with their unique codes
```

**Important:** Each club needs a unique secret code that members will use during registration. The system supports 113 official VIT clubs, with OSPC having super admin privileges.

### Email Notifications

The system supports multiple email notification types:

- **Welcome Emails**: Sent to new users upon registration
- **Event Notifications**: Sent when users are registered for events
- **Update Notifications**: Sent when event details change
- **Reminder Notifications**: Sent before event dates

### Environment Variables Explained

#### Main Application (`.env`)
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Public key for client-side operations
- `VITE_EMAILJS_SERVICE_ID`: (Optional) EmailJS service ID for client-side email
- `VITE_EMAILJS_TEMPLATE_ID`: EmailJS template ID
- `VITE_EMAILJS_PUBLIC_KEY`: EmailJS public key
- `NODE_ENV`: Environment mode (development/production)

#### Supabase Functions (`supabase/.env`)
- `EMAILJS_SERVICE_ID`: EmailJS service ID for server-side email sending
- `EMAILJS_TEMPLATE_ID`: EmailJS template ID for email formatting
- `EMAILJS_PUBLIC_KEY`: EmailJS public key for authentication
- `SITE_URL`: Your application's URL (for email links)
- `SUPABASE_SERVICE_ROLE_KEY`: Private key for server-side operations

## 📚 How It Works

### Event Creation Flow
1. **User Authentication**: Users log in via Supabase Auth
2. **Event Form**: Users fill out the comprehensive event creation form
3. **Venue Validation**: System checks for venue conflicts in real-time
4. **Database Storage**: Event data is stored in Supabase PostgreSQL
5. **Notifications**: Automated emails are sent to relevant users
6. **Real-time Updates**: All connected users see the new event immediately

### Venue Conflict Detection
- Real-time checking against existing bookings
- Smart suggestions for alternative venues
- Visual conflict indicators in the UI
- Automatic conflict resolution suggestions

### Notification System
- **Trigger-based**: Database triggers initiate notification workflows
- **Serverless Functions**: Supabase Edge Functions handle email sending
- **Template System**: Customizable email templates for different notification types
- **User Preferences**: Users can customize their notification settings

### Authentication & Security
- **Row Level Security (RLS)**: Database-level security policies
- **JWT Tokens**: Secure session management
- **Role-based Access**: Different permissions for different user types
- **API Rate Limiting**: Protection against abuse

## � **Club Authentication System - How It Works**

The VIT Event Scheduler operates on a **club-based authentication system** where each of the 113 official VIT clubs has a unique secret code stored in the database. When students want to create an account, they must provide their club's secret code during registration - this automatically links them to that specific club and determines their permissions within the system. **Club POCs (Points of Contact)** create their accounts by using the same secret code system, but they typically register first or are granted admin privileges for their club after registration. For example, if you're a POC for the "ACM Student Chapter," you would use the secret code `XXXXXXXX` during registration, which associates your account with ACM and potentially grants you admin rights to create/edit events for that club only. The system ensures that **each club can only manage their own events** - so ACM members can't edit events created by the Robotics Club, maintaining organizational boundaries. The **OSPC (Open Source Programming Club)** has a special super admin code `XXXXXXXX` that provides system-wide administrative privileges, allowing them to oversee the entire platform. Once a POC creates their account with their club code, they can approve new member registrations from their club, manage club events, and collaborate with other POCs from the same organization. The beauty of this system is that it's **completely self-contained** - no manual admin approval needed, just the correct secret code from the authorized club representative, making it scalable across all 113 VIT clubs while maintaining security and organizational structure.

## �🚀 Deployment

### Deploy to Netlify
1. **Connect your repository** to Netlify
2. **Set build settings**:
   - Build command: `npm run build` or `yarn build` or `bun run build`
   - Publish directory: `dist`
3. **Add environment variables** in Netlify dashboard
4. **Enable automatic deployments** from your main branch

### Deploy Supabase Functions
```bash
supabase functions deploy --project-ref your-project-id
```

### Environment Variables for Production
Make sure to update your environment variables for production:
- Change `SITE_URL` to your actual domain
- Use production Supabase keys
- Configure proper CORS settings in Supabase

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 🐛 Troubleshooting

### Common Issues

**1. Supabase Connection Error**
- Verify your Supabase URL and keys in `.env`
- Check if your Supabase project is active
- Ensure RLS policies are properly configured

**2. Email Notifications Not Working**
- Verify EmailJS credentials in `supabase/.env` and `.env`
- Check EmailJS dashboard for service status
- Ensure EmailJS templates are properly configured
- Check Supabase function logs for EmailJS API responses

**3. Venue Conflicts Not Detected**
- Check database triggers are properly set up
- Verify venue conflict detection function is deployed
- Check console for JavaScript errors

**4. Build Issues**
- Clear node_modules and reinstall dependencies
- Check for TypeScript errors
- Verify all environment variables are set

### Getting Help
- Check the [Issues](https://github.com/vizarrd/vit-event-scheduler-public/issues) page for common questions

## 📜 License

This project is licensed under the MIT License.

---

**Made with ❤️ for VIT University students and event organizers**

