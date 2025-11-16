# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/18b957a7-6058-46c7-9eb6-dd9493acbcc7

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/18b957a7-6058-46c7-9eb6-dd9493acbcc7) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (backend/database)
- OpenAI (AI-powered resume parsing - optional)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration (Required)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration (Optional - for AI-powered resume parsing)
# Get your API key from https://platform.openai.com/api-keys
VITE_OPENAI_API_KEY=your_openai_api_key
```

### Setting up OpenAI API Key (Optional)

For the best resume parsing experience, you can optionally configure an OpenAI API key:

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add it to your `.env.local` file as `VITE_OPENAI_API_KEY`

**Note:** Without an OpenAI API key, the app will use a rule-based parser (less accurate). With an API key, the app will use AI-powered parsing for much better accuracy.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/18b957a7-6058-46c7-9eb6-dd9493acbcc7) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
