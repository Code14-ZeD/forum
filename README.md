# Forum App

Forum App is a modern, scalable online discussion platform designed to foster community interaction, knowledge sharing, and engaging conversations. From niche interest groups to large public forums, Forum App provides a polished, intuitive experience for creating topics, asking questions, and collaborating in real time.

---

## 🚀 Live Demo

Check out the live version: [forum-pi-seven.vercel.app](https://forum-pi-seven.vercel.app/)

---

## 🎯 Key Features

•⁠ ⁠*Clean, Intuitive UI* – Responsive design optimized for desktop and mobile.
•⁠ ⁠*Social Sign‑On* – Secure authentication via GitHub and Google OAuth.
•⁠ ⁠*Threaded Discussions* – Nested replies for organized conversations.
•⁠ ⁠*Dark Mode* – User‑selectable light/dark themes.

---

## 🛠️ Tech Stack

| Layer          | Technology         |
| -------------- | ------------------ |
| _Frontend_     | Next.js (React)    |
| _Backend_      | Next.js API Routes |
| _Database/ORM_ | Drizzle ORM        |
| _Auth_         | Better Auth        |
| _Hosting_      | Vercel (app)       |
| _Database_     | Neon (PostgreSQL)  |

---

## 📥 Prerequisites

•⁠ ⁠Node.js v16+ and npm/yarn installed
•⁠ ⁠A GitHub or Google account for OAuth
•⁠ ⁠Access to a PostgreSQL-compatible database (Neon recommended)

---

## 🔧 Installation & Setup

1.⁠ ⁠*Clone the repo*

⁠ bash
git clone https://github.com/yourusername/forum-app.git
cd forum-app
 ⁠

2.⁠ ⁠*Install dependencies*

⁠ bash
npm install

# or

yarn install
 ⁠

3.⁠ ⁠*Environment configuration*
Create a ⁠ .env.local ⁠ file at the project root:

⁠ ini
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>
NEXTAUTH_URL=http://localhost:3000
GITHUB_ID=<your_github_client_id>
GITHUB_SECRET=<your_github_client_secret>
GOOGLE_ID=<your_google_client_id>
GOOGLE_SECRET=<your_google_client_secret>
 ⁠

4.⁠ ⁠*Run locally*

⁠ bash
npm run dev

# or

yarn dev
 ⁠

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deployment

Forum App is primed for Vercel:

1.⁠ ⁠Push your repository to GitHub.
2.⁠ ⁠Connect it to your Vercel account.
3.⁠ ⁠Add the same environment variables in Vercel dashboard.
4.⁠ ⁠Deploy and enjoy automated CI/CD!

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.⁠ ⁠Fork the repository.
2.⁠ ⁠Create a new branch: ⁠ git checkout -b feature/YourFeature ⁠.
3.⁠ ⁠Make your changes and commit: ⁠ git commit -m "feat: add new feature" ⁠.
4.⁠ ⁠Push to your fork: ⁠ git push origin feature/YourFeature ⁠.
5.⁠ ⁠Open a Pull Request describing your changes.

Please ensure your code follows existing style and includes relevant tests.

---

## ✉️ Contact

For questions or feedback, reach out to the maintainer:

•⁠ ⁠GitHub: [Vaibhav Jha](https://github.com/Code14-ZeD)
•⁠ ⁠Email: [vaibhavjha22@gmail.com](mailto:vaibhavjha22@gmail.com)
