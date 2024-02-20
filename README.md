# NC News App

The backend of a small Reddit-like app. It is currently hosted at: `https://nc-news-1.onrender.com/`

If you'd like to run this project you'll need to run the following commands:

1. Clone the repo:
   `git clone https://github.com/dmmq20/nc-news.git && cd nc-news`

2. Create .env files
   `echo PGDATABASE=nc_news_test > .env.test && echo PGDATABASE=nc_news > .env.development`

3. Install dependencies
   `npm install`

4. Create databases
   `npm run setup-dbs`

5. Seed dbs
   `npm run seed`

To run this successfully you will need atleast Node v20.11.0 and PostgresQL 14.10
