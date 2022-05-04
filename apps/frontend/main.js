import './style.css'

const serverRoute = 'http://localhost:8000';
const url = (path) => new URL(path, serverRoute);

//begining
const fetchedResRaw = await fetch(url`/all`.href)

const fetchedRes = await fetchedResRaw.json();


