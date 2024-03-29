import "./style.css";
import { addCard, addDivider, addTitle } from "./ui";

// configuration
const PORT = import.meta.env["VITE_PORT"] ?? 8000;
const SERVER_ROUTE = `http://localhost:${PORT}`;

const defTag = (strings, ...values) =>
  strings.slice(1).reduce((acc, curr, i) => acc + values[i] + curr, strings[0]);

const url = (...path) => new URL(defTag(...path), SERVER_ROUTE);
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

const { PARTS, ENABLE_POLLING } = await fetchJson(url`/settings`).catch(() => {
  const failCard = addCard();
  failCard.failCard();
  failCard.setText("Failed to fetch settings");
});

addTitle("Single Fetch From Server");

const mainCard = addCard();

await sleep(1000);

const [time1, value1] = await timePromise(fetchJson(url`/all`));

mainCard.successCard();
addCard().setTime(time1);
addCard({ color: "normal" }).setText(`length: ${value1.length}`);

//divider
addDivider();

//multiple in client
addTitle(`multiple (${PARTS}) fetches in client (polling: ${ENABLE_POLLING})`);

const cards = [];

await sleep(500);

const getFromMultipleRoutes = async () => {
  const promises = new Array(PARTS).fill(0).map((_, i) => {
    const id = i + 1;
    const addr = url`/partial/${id}`;
    setTimeout(() => {
      cards.push(addCard());
    }, 0);
    return fetchJson(addr);
  });

  const results = await Promise.all(promises);
  return results.flat();
};

const getFromMultipleRoutesWithPolling = async () => {
  const res = [];
  let nextId = 0;

  do {
    const { results, next } = await fetchJson(url`/chunk/${nextId}`);
    setTimeout(() => {
      cards.push(addCard({color: 'success'}));
    }, 0);
    res.push(...results);
    nextId = next;
  } while (nextId);

  return res;
};

const getMultiple = ENABLE_POLLING
  ? getFromMultipleRoutesWithPolling
  : getFromMultipleRoutes;

const [time2, value2] = await timePromise(getMultiple()).catch((e) => {
  cards.forEach((card) => {
    card.remove();
  });

  addCard({ color: "failed", text: e.message });
});

// success all cards in non-polling mode after fetch
if(!ENABLE_POLLING){
  cards.forEach(card => card.successCard());
}

await sleep(100);

const length = value2.length;

addCard().setTime(time2);
addCard({ color: "normal" }).setText(`length: ${length}`);
