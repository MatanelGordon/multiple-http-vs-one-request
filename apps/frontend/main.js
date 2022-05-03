import './style.css'

const serverRoute = 'http://localhost:8000';
const url = (path) => new URL(path, serverRoute);
const result = document.getElementById('fetch-result');

//begining
const fetchedResRaw = await fetch(url`/all`.href)

const fetchedRes = await fetchedResRaw.json();

result.textContent = JSON.stringify(fetchedRes);

