# Voidtable

# Overview

Voidtable is a full-stack web app based on Airtable and built with Next.js, TypeScript, Tailwind, Prisma, and PostgreSQL. It provides a clean spreadsheet-like interface for managing structured data.

## Features
- In each project, create multiple tables, which can each have several views that define sorting and filtering options.
- Create text and number type columns.
- Row virtualisation allowing for hundreds of thousands of rows to be efficiently displayed and sorted/filtered on.
- Complex backend multi-level sort and filtering.
- Search feature that is processed in the backend, allowing easy searching through tables with many rows, whilst only fetching as much data as required to load the current search result.

## Getting Started
1. Clone the Repository

```base
git clone https://github.com/eoru-dev/voidtable.git
cd voidtable
```

2. Install Dependencies

```bash
npm install
```

3. Configure Environment Variables

Create a `.env` file and set the required values (detailed in the `.env.example` file):
```bash
cp .env.example .env
```

4. Set Up the Database

```bash
npx prisma db push
npm prisma generate
```

5. Run the App

```bash
npm run dev
```