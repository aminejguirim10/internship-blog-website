# 📝 Professional Blog Platform

Welcome to the **Professional Blog Platform**, your comprehensive solution for creating, managing, and sharing content in Arabic. This full-stack blogging platform is specifically designed for Turkish clients, providing a secure and intuitive environment for content creators, editors, and readers. Whether you're publishing articles, organizing events, or building a community through newsletters, our platform ensures that your content reaches your audience effectively. Join us in creating a digital publishing ecosystem where every story matters and every voice is heard.

## 🔋 Features

👉 **User Authentication:** Secure multi-role authentication system with Admin, Editor, and User privileges using Clerk integration.

👉 **Content Management:** Complete blog lifecycle, rich text editing, and category organization.

👉 **Event Management:** Create, schedule, and manage events with automated notifications and community engagement.

👉 **Comment System:** Interactive commenting with nested replies, moderation tools, and reporting functionality.

👉 **RTL Support:** Complete Right-to-Left layout optimized for Arabic content with responsive typography.

👉 **Admin Dashboard:** Comprehensive management interface with analytics, content oversight, and user administration.

👉 **File Upload:** Integrated media management with image optimization and secure storage via UploadThing.

👉 **SEO Optimized:** Server-side rendering with meta tags, sitemap generation, and performance optimization.

👉 **Responsive Design:** Mobile-first approach ensuring optimal experience across all devices and screen sizes.

👉 **AI Chatbot:** Intelligent chatbot for user assistance and content discovery.

## ⚙️ Technologies Used

- **Frontend:** [Next.js 14](https://nextjs.org/), [TailwindCSS](https://tailwindcss.com/), [TypeScript](https://www.typescriptlang.org/)
- **Backend:** Next.js Server Actions and API Routes
- **Database:** [Supabase](https://supabase.com/) with [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [Clerk](https://clerk.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **File Upload:** [UploadThing](https://uploadthing.com/)
- **Notifications:** [Twilio WhatsApp API](https://www.twilio.com/)
- **Email:** [Nodemailer](https://nodemailer.com/)
- **Validation:** [Zod](https://zod.dev/)

## 🖥️ Prerequisites

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en) (v18 or higher)
- [npm](https://www.npmjs.com/) (Node Package Manager)

## 🚀 Installation

1. Clone the repository:

```bash
git clone https://github.com/aminejguirim10/internship-blog-website.git
```

2. Navigate to the project directory:

```bash
cd internship-blog-website
```

3. Install the dependencies:

```bash
npm install
```

4. Configure environment variables:

Create a new file named `.env` in the root of your project and add the following content:

```bash
# Supabase Database Configuration
DATABASE_URL="your_supabase_postgresql_connection_string"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# Application URLs
NEXT_URL="http://localhost:3000"

# File Upload (UploadThing)
UPLOADTHING_SECRET="your_uploadthing_secret"
UPLOADTHING_APP_ID="your_uploadthing_app_id"

# Email Configuration (Nodemailer)
NODE_MAILER_AUTHOR_MAIL="your_email@gmail.com"
NODE_MAILER_SECRET="your_gmail_app_password"

# WhatsApp Notifications (Twilio)
TWILIO_ACCOUNT_SID="your_twilio_account_sid"
TWILIO_AUTH_TOKEN="your_twilio_auth_token"
TWILIO_WHATSAPP_NUMBER="your_twilio_whatsapp_number"

# AI Chatbot
GROQ_API_KEY="your_groq_api_key"
```

5. Set up the database:

```bash
npx prisma generate
npx prisma db push
```

6. Start the development server:

```bash
npm run dev
```

7. Open your browser and visit:

```bash
http://localhost:3000
```

## 🌍 Arabic Content & RTL Support

This platform is specifically designed for Arabic content creation with:

- **Complete RTL Layout:** Right-to-Left text direction and UI elements
- **Arabic Typography:** Optimized fonts and text rendering for Arabic script
- **Localized Interface:** All UI elements and messages in Arabic
- **Cultural Adaptation:** Content structure and design adapted for Arabic-speaking audiences

## 🚶 Contributing

This project was developed as part of an internship for Turkish clients. Contributions for educational purposes are welcome:

1. Fork the repository
2. Create a feature branch
3. Implement improvements following modern web development practices
4. Add appropriate documentation
5. Submit a pull request
