# Asaduzzaman Shimul — Personal Portfolio

A responsive, English-language portfolio with locally hosted fonts, two supplied photographs, an education timeline, an illustrated student-life section, a photo journal with a keyboard-accessible lightbox, a future chapter, FAQs, light/dark themes, Bangladesh local time, WhatsApp/email/phone/Facebook links, an email copy button, and a downloadable contact card. No framework, dependencies, account, API key, or database is required.

## Run locally

Install Node.js 22 or newer, open a terminal in this folder, then run:

```sh
npm run dev
```

Open **http://127.0.0.1:3000**. After editing a file, rerun the build and refresh the browser. To build separately:

```sh
npm run build
npm run preview
```

## Deploy to Vercel

### GitHub import

1. Create a GitHub repository and upload the project source files, `assets/`, and `scripts/`. Include the dotfiles. Do not upload the original NID PDF.
2. In Vercel, choose **Add New → Project** and import that repository.
3. Use **Framework Preset: Other**, **Build Command: npm run build**, and **Output Directory: dist**. These are already configured in `vercel.json`.
4. Click **Deploy**. No environment variables are needed.

### Vercel CLI

From this project folder:

```sh
npx vercel
```

Follow the prompts to connect your Vercel account and create the project. To publish to production afterward:

```sh
npx vercel --prod
```

The `shimul-vercel-ready.zip` file is a clean source package for sharing or uploading to a repository; extract it first. Vercel's usual workflow is a Git import or CLI deployment, rather than directly importing a ZIP.

## Edit the content

- `index.html`: names, education, text, contact links, social sharing metadata.
- `styles.css`: colors, typography, and responsive layouts.
- `experience.css`: the expanded visual design, photo viewer, themes, FAQ, and message composer.
- `script.js`: contact card details, copied email address, and navigation behavior. Update these too if contact information changes.
- `assets/shimul-outdoors.jpeg`: hero photo.
- `assets/shimul-portrait.jpeg`: portrait photo.

After you have a final domain, set the `og:image` metadata in `index.html` to its full absolute URL for the widest support in social link previews, for example `https://your-domain.vercel.app/assets/shimul-outdoors.jpeg`.

## Content and privacy

Education years and institution names follow the supplied information. HSC 2026 is listed without a claim about exam results. The Facebook profile could not be accessed publicly during creation, so no unverified biography, grades, skills, projects, employment, or achievements were added.

The original NID PDF is kept out of the website. The build copies only an explicit list of public files; `.gitignore` and `.vercelignore` also exclude PDFs and the original root-level photo files. The deployment ZIP includes only website source and the public photos. The original files remain untouched in this folder.

The message composer prepares WhatsApp and email drafts locally. It does not send or store messages: visitors choose an app, review their draft, and send it there. Editing a prepared draft hides the old send links until it is prepared again. Other contact actions open the visitor's email, phone, WhatsApp, or Facebook app/site. Fonts are self-hosted; font licenses are in `assets/fonts/`. The browser stores only the optional theme preference.

The laptop, notebook, and orbital illustrations are made with CSS. The road-ahead section is introductory editorial copy; it does not claim professional experience or completed projects.

## Responsive verification

Checked with browser viewport simulation at 320, 360, 375, 390, 414, 430, 680, 681, and 768 pixels wide, plus 844 × 390 landscape. The page and header fit without horizontal scrolling. Phone header and photo-viewer buttons have 44px touch targets; form fields use 16px text through tablet widths. Navigation, photo navigation and Escape, theme switching, FAQ expansion, and local message-draft preparation were verified. These are simulated browser checks, not tests on physical phones.
