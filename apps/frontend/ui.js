const app = document.getElementById("app");

export const addCard = (container = app, id = null) => {
    const node = document.createElement('div');
    node.classList.add(
        'pending', 'border-2', 'py-3','px-5', 
        'font-bold', 'border-cardColor', 'text-cardColor',
        'text-center', 'rounded-lg', 'w-80', 'my-1'
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
            node.textContent = `${time} [ms]`
        },
        setText: text => {
            node.classList.remove('pending');
            node.classList.add('normal');
            node.textContent = text;
        }
    }
}

export const addDivider = (container = app) => {
    const divider = document.createElement('i');
    divider.classList.add('w-1/2', 'h-0.5', 'bg-gray-500', 'my-5')
    if(container){
        container.appendChild(divider);
    }
    return divider;
}

export const addTitle = (content, container = app, element = 'h2') => {
    const header = document.createElement(element);
    header.textContent = content;
    container.appendChild(header);
    return header;
}