# NC News App

The backend of a small Reddit-like app. It is currently hosted at: https://nc-news-1.onrender.com/

## Getting Started

To run this project locally, follow these steps:

### Prerequisites

Make sure you have the following installed on your system:

- Node.js (minimum version 20.11.0)
- PostgreSQL (minimum version 14.10)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/dmmq20/nc-news.git && cd nc-news
   ```

2. Create .env files for development and testing environments:

   ```bash
   echo PGDATABASE=nc_news_test > .env.test && echo PGDATABASE=nc_news > .env.development
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create databases:

   ```bash
   npm run setup-dbs
   ```

5. Seed the databases:

   ```bash
   npm run seed
   ```

### Usage

To run all tests:

```bash
npm test
```

To start the server:

```bash
npm start
```

The server will be running on http://localhost:9090 by default.
