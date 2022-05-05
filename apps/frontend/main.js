import './style.css'

const serverRoute = 'http://localhost:8000';
const url = (path) => new URL(path, serverRoute);

const app = document.getElementById('app');

const sleep = ms => new Promise(res => setTimeout(res, ms));

const createCard = (container = app, id = null) => {
    const node = document.createElement('div');
    node.classList.add(
        'pending', 'border-2', 'py-3','px-5', 
        'font-bold', 'border-cardColor', 'text-cardColor',
        'text-center', 'rounded-lg', 'w-80'
    )

    node.textContent = 'Pending...'

    if(id){
        node.setAttribute('id', id);
    }
    
    container.appendChild(node);

    return {
        node,
        successCard: () => {
            node.classList.remove('pending');
            node.classList.add('success');
            node.textContent = 'Success!'
        },
        setTime: time => {
            node.classList.remove('pending');
            node.classList.add('time');
            node.textContent = `${+time} [ms]`
        }
    }
}

const createDivider = (container = app) => {
    const divider = document.createElement('i');
    divider.classList.add('w-1/2', 'h-0.5', 'bg-gray-500', 'my-5')
    if(container){
        container.appendChild(divider);
    }
    return divider;
}

const createTitle = (content, container = app, element = 'h2') => {
    const header = document.createElement(element);
    header.textContent = content;
    container.appendChild(header);
    return header;
}

//begining

//multiple in server
createTitle('multiple fetches in server')
const card = createCard();

await sleep(1000)

const startTime1 = new Date();
await fetch(url`/all`.href).then(card.successCard);
const time1 = new Date(new Date() - startTime1);
createCard().setTime(time1)

//divider
const divider = createDivider();

//multiple in client
const partsFetch = await fetch(url`/parts`)
const {parts} = await partsFetch.json()

createTitle(`multiple (${parts}) fetches in client`)

const cards = new Array(parts)
    .fill(0)
    .map(() => createCard());

await sleep(1000);
const startTime2 = new Date();
const promises = new Array(parts)
    .fill(0)
    .map((_, i) => i + 1)
    .map(id => url`/partial/${id}`.href)
    .map((addr, i) => fetch(addr).then(cards[i].successCard))

await Promise.all(promises);
const diff2 = new Date(new Date() - startTime2);
createCard().setTime(diff2);




