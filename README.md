
# 💎 Precious MD Dermatology Clinic Platform

A luxury, image-driven full-stack web platform engineered and deployed independently for Precious MD Dermatology (Iligan City, Philippines). Built to deliver a seamless user experience, secure appointment bookings, and robust administrative management.

![Next.js](https://img.shields.io/badge/Next.js-black?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=flat-square&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-%2338B2AC.svg?style=flat-square&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?style=flat-square&logo=vercel&logoColor=white)

---

## ✨ Key Features & Architecture

* **Modern Full-Stack Architecture:** Independently engineered using **Next.js 14+ (App Router** utilizing both Server and Client Components) for optimal server-side rendering, SEO performance, and dynamic routing.
* **Database Security & Access Control:** Built on **Supabase (PostgreSQL)**, enforcing strict **Row-Level Security (RLS)** policies and multi-tier user role-mapping (`admin`, `editor`, `receptionist`) via `@supabase/ssr`.
* **Automated Transactional Messaging:** Integrated **Resend API** for automated email notifications and booking confirmations synchronized through a structured state machine ledger.
* **Dynamic UI & Asset Management:** Developed smooth, fluid client-side animations with **Framer Motion** and **Lucide React**, paired with high-performance image and media storage managed via Supabase Storage buckets.
* **Automated CI/CD Pipeline:** Maintained continuous integration and lightning-fast edge deployments via GitHub and Vercel.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js, TypeScript, Tailwind CSS, Framer Motion, Lucide React
* **Backend & Database:** Supabase (PostgreSQL, RLS, Storage, Auth via `@supabase/ssr`)
* **API & Integrations:** Resend API (Transactional Emails)
* **DevOps & Tooling:** Git, GitHub, Vercel CI/CD

---

## 🚀 Getting Started Locally

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/mayaelli/pmd-derma-clinic-lending-dynamic-page.git](https://github.com/mayaelli/pmd-derma-clinic-lending-dynamic-page.git)
   cd pmd-derma-clinic-lending-dynamic-page

```

2. **Install dependencies:**
```bash
npm install

```


3. **Set up environment variables:**
Create a `.env.local` file in the root directory and add your Supabase and Resend keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key

```


4. **Run the development server:**
```bash
npm run dev

```


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 👩‍💻 Author

**Marhamah S. Ali**

*Full-Stack Developer | Summa Cum Laude IT Graduate*

* Portfolio: [https://marhamah-ali.netlify.app/](https://marhamah-ali.netlify.app/)
* GitHub: [@mayaelli](https://www.google.com/search?q=https://github.com/mayaelli)

```

```
