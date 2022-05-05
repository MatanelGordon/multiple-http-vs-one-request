import "./style.css";
import { addCard, addDivider, addTitle } from "./ui";

const serverRoute = "http://localhost:8000";

const url = (path) => new URL(path, serverRoute);
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const timePromise = async (promise) => {
  const startTime = new Date();
  const value = await promise;

  return [new Date() - startTime, value];
};
const fetchJson = async path => {
    const fetched = await fetch(path);
    return fetched.json();
}

const {parts} = await fetchJson(url`/settings`);

//multiple in server
addTitle("multiple fetches in server");
const card = addCard();

await sleep(1000);

const [time1, value1] = await timePromise(fetchJson(url`/all`.href));

card.successCard();
addCard().setTime(time1);
addCard().setText(`length: ${value1.length}`);

//divider
addDivider();

//multiple in client
addTitle(`multiple (${parts}) fetches in client`);

const cards = new Array(parts).fill(0).map(() => addCard());

await sleep(500);

const getFromMultipleRoutes = async () => {
    const promises = new Array(parts)
    .fill(0)
    .map((_,i) => {
        const id = i + 1;
        const addr = url(`/partial/${id}`).href;
        return fetchJson(addr);
    })

    const results = await Promise.all(promises);
    return results.flat();
}


const [time2, value2] = await timePromise(getFromMultipleRoutes());

cards.forEach(card => {
    card.successCard();
});

const length = value2.length;

addCard().setTime(time2);
addCard().setText(`length: ${length}`)
