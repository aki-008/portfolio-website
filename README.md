# Portfolio Website

A modern, interactive, and fully responsive developer portfolio built to showcase projects, experience, skills, and AI/ML work.

## Preview

🌐 Live Demo: [https://portfolio-website-nu-pearl.vercel.app/](https://portfolio-website-nu-pearl.vercel.app/)

📦 Repository: [https://github.com/aki-008/portfolio-website](https://github.com/aki-008/portfolio-website)

---

## Features

* Modern animated UI/UX
* Fully responsive design
* Dynamic project showcase
* Admin panel for updating portfolio data
* JSON-based content management
* Dark/Light theme support
* Smooth animations & transitions
* SEO optimized
* Fast performance with modern frontend stack

---

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Framer Motion

### Backend / Data

* Prisma
* JSON-based CMS structure

### Deployment

* Vercel

---

## Folder Structure

```bash
portfolio-website/
│── app/
│── components/
│── lib/
│── prisma/
│── public/
│── styles/
│── site-data.json
│── package.json
│── tailwind.config.ts
│── next.config.js
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/aki-008/portfolio-website.git
```

### 2. Navigate to the Project

```bash
cd portfolio-website
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Setup Environment Variables

Create a `.env.local` file:

```env
DATABASE_URL=

ADMIN_EMAIL=
ADMIN_PASSWORD=

NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

---

## Run Locally

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

## Build for Production

```bash
npm run build
npm start
```

---

## Customization

Most portfolio content can be edited from:

```bash
site-data.json
```

You can update:

* Personal information
* Projects
* Experience
* Skills
* Social links
* Resume links
* Contact details

without touching the UI code.

---

## Deployment

The project is optimized for deployment on:

* Vercel

Deploy instantly by importing the GitHub repository.

---

## Credits

## Thanks to [crizmo](https://github.com/crizmo) , for making the original site, I'm just reusing it.

This project is based on a template originally created by [Bartosz Jarocki](https://github.com/BartoszJarocki) under the MIT License.

See the [LICENSE](LICENSE) file for more details.
---

## Author

Built by Shaswat Singh (aki-008)

GitHub: [https://github.com/aki-008](https://github.com/aki-008)

---

## License

This project is licensed under the MIT License.

---

## Support

If you like the project, consider giving it a ⭐ on GitHub.

🚀
