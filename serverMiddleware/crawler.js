import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import iconv from 'iconv-lite';
import uniqBy from 'lodash.uniqby';

const app = express();
const cacheKey = 'allOffers';
const NodeCache = require("node-cache");
const cache = new NodeCache();

const selectorMain = 'body > div > table > tbody > tr:first-child > td:first-child';

const getDocument = async (pageNumber) => {
  const targetUrl = process.env.TARGET_URL.replace('&f1=1', '')
  const url = `${targetUrl}&f1=${pageNumber}`;
  const { data } = await axios.request({
    method: 'GET',
    url: url,
    responseType: 'arraybuffer',
    responseEncoding: 'binary'
  })
  return iconv.decode(data, 'cp1251');
}

const setLastPage = (body) => {
  const pageNumbersInfo = body.find('.pageNumbersInfo').first().text();
  return parseInt(pageNumbersInfo.split(' ').pop(), 10);
}

const getOffers = ($, body) => {
  const offers = [];
  body.find('> table').each(function () {
    const price = $(this).find('.price').text();
    if (price) {
      const link = $(this).find('.lnk2');
      offers.push({
        price,
        imgUrl: $(this).find('table a > img').attr('src'),
        location: link.text(),
        url: link.attr('href'),
        desc: $(this).find('> tbody > tr:nth-child(3) > td').text().trim().slice(0, -18)
      });
    }
  })
  return offers;
}

app.get('/', async (req, res) => {
  let pageNumber = 1;
  let lastPage = 1;
  let isLastPageKnown = false;
  let allOffers = [];

  const cachedOffers = cache.get(cacheKey);
  if (cachedOffers) {
    console.warn('Server: Returning cached results');
    allOffers = JSON.parse(cachedOffers);
  } else {
    console.warn('Server: Fetching new results');
    for (pageNumber; pageNumber <= lastPage; pageNumber += 1) {
      const document = await getDocument(pageNumber);
      const $ = cheerio.load(document);

      const body = $(selectorMain);

      if (!isLastPageKnown) {
        isLastPageKnown = true;
        lastPage = setLastPage(body);
      }

      const offers = getOffers($, body);
      allOffers.push(...offers);
    }
    cache.set(cacheKey, JSON.stringify(allOffers), 3600);
  }

  res.send(uniqBy(allOffers, 'desc'));
})

export default {
  path: '/api/cralwer',
  handler: app
}
