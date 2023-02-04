import "./style.css";
import { addCard, addDivider, addTitle } from "./ui";

// configuration
const PORT = import.meta.env["VITE_PORT"] ?? 8000;
const SERVER_ROUTE = `http://localhost:${PORT}`;
const ENABLE_POLLING = false;

const url = (path) => new URL(path, SERVER_ROUTE);
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const timePromise = async (promise) => {
  const startTime = new Date();
  const value = await promise;

  return [new Date() - startTime, value];
};

const fetchJson = async (pathLike) => {
  const path = pathLike instanceof URL ? pathLike.href : pathLike;
  const fetched = await fetch(path);
  return fetched.json();
};

const { PARTS } = await fetchJson(url`/settings`).catch(() => {
  const failCard = addCard();
  failCard.failCard();
  failCard.setText('Failed to fetch settings');
});

//multiple in server
addTitle("multiple fetches in server");

const mainCard = addCard();

await sleep(1000);

const [time1, value1] = await timePromise(fetchJson(url`/all`));

mainCard.successCard();
addCard().setTime(time1);
addCard({color:'normal'}).setText(`length: ${value1.length}`);

//divider
addDivider();

//multiple in client
addTitle(`multiple (${PARTS}) fetches in client (polling: ${ENABLE_POLLING})`);

const cards = [];

await sleep(500);

const getFromMultipleRoutes = async () => {
  const promises = new Array(PARTS).fill(0).map((_, i) => {
    const id = i + 1;
    const addr = url(`/partial/${id}`);
    setTimeout(() => {cards.push(addCard())},0)
    return fetchJson(addr);
  });

  const results = await Promise.all(promises);
  return results.flat();
};

const getFromMultipleRoutesWithPolling = async () => {
  const res = [];

  for (let i = 1; i <= PARTS; i++) {
    const addr = url(`/partial/${i}`);
    const json = await fetchJson(addr);
    setTimeout(() => {cards.push(addCard())},0)
    res.push(...json);
  }

  return res;
};

const getMultiple = ENABLE_POLLING
  ? getFromMultipleRoutesWithPolling
  : getFromMultipleRoutes;

const [time2, value2] = await timePromise(getMultiple()).catch(() => {
  cards.forEach(card => {
    card.remove();
  });

  addCard({color:'failed', text: 'Failed fetching multiple Requests'})
});

await sleep(100);

cards.forEach((card) => {
  card.successCard();
});

const length = value2.length;

addCard().setTime(time2);
addCard({color: 'normal'}).setText(`length: ${length}`);
