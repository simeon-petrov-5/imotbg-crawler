# Web Scrapper for Imot.bg

This Scrapper/Crawler is designed specifically for Imot.bg to make easier to check quickly your desired searches. 

> Disclaimer: The project is for learning purposes. It was a quick idea I wanted to play around with. Future improvements may come as I think of such and have the time for those.

## Technologies

 - [Cheerio](https://www.npmjs.com/package/cheerio)
 - [Nuxt](https://nuxtjs.org/) (Vue 2, [SCSS](https://nuxtjs.org/docs/2.x/features/configuration#pre-processors), [Vite](https://vite.nuxtjs.org/), [Axios](https://axios.nuxtjs.org/))
 - [Node-cache](https://www.npmjs.com/package/node-cache)

## Functionalities
 - Can sort by Price [ASC/DESC]
 - Can filter by the specific places 
 - Removes any duplicated offers from agencies (based on the description)
 - Shows all results on a single page
 - Will fetched results are cached for 1 hour


## Usage / Local Development

#### Clone project

#### Add .env
You need to provide your desired search in imot.bg as environment variable `TARGET_URL` so it can be crawled. Important: at the end of the url you'll see the page parameter `&f1=1`, which is reqired to be set to 1. Example with https://www.imot.bg/pcgi/imot.cgi?act=3&slink=6ve5xp&f1=1
```
.env
TARGET_URL=https://www.imot.bg/pcgi/imot.cgi?act=3&slink=6ve5xp&f1=1
```

#### Install dependencies
```
yarn install
OR
npm install
```


#### Start project
```
yarn dev
OR
npm run dev
```


## Deployment

####  Build for production and launch server
```
yarn build
yarn start
OR
npm run build
npm run start
```
We're using [Nuxt SSR/Universal](https://nuxtjs.org/docs/2.x/features/deployment-targets#server-hosting) - Please refer to [Nuxt Docs](https://nuxtjs.org/docs/2.x/get-started/commands#server-deployment) for more information about the deployment.


## How the scraping works
We use Nuxt to have a Node server & FE framework in single project and to be able call the target API from the server to overpass CORS issues, etc. The scrapping logic is under `serverMiddleware/crawler.js`. You can clone the scraper and use your own frontend framework or styling, it's not bind to Nuxt/Vue specifically.

With node-cache we limit the crawling to only once per hour (if you don't stop the server of course - this means also starting/stopping the app in development mode).