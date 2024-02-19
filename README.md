# Northcoders News API

If you'd like to run this project you'll need to run the following commands:

1. Clone the repo:
   `git clone https://github.com/dmmq20/nc-news.git`

2. `cd nc-news`

3. Create .env files
   `echo PGDATABASE=nc_news_test > .env.test && echo PGDATABASE=nc_news > .env.development`

4. Install dependencies
   `npm install`

5. Create databases
   `npm run setup-dbs`

6. Seed dbs
   `npm run seed`
