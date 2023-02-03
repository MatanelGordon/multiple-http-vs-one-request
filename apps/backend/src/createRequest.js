const uuid = require('uuid');
const {faker} = require('@faker-js/faker');

const createItem = (index) => {
    const guid = uuid.v4();
    const name = faker.name.fullName();
    const [fname, lname] = name.split(' ');
    const company =  faker.company.name();
    const companyAbbr = company.split(' ').map(str => str.charAt(0)).join('').toUpperCase();
    const email = faker.internet.email(fname, lname, companyAbbr);

    return {
        _id: guid.substring(0,8),
        index,
        guid,
        isActive: Math.random() < .5,
        balance: faker.finance.amount(123, 99_999, 2, '$', true),
        picture: `https://picsum.photos/${100 + (Math.random() * 400) | 0}`,
        age: (Math.random()*120) | 0,
        eyeColor: Math.random() < .25 ? 'Blue' : 'Purple',
        name,
        gender: faker.name.sex(true).toUpperCase(),
        company,
        email,
        phone: faker.phone.number(),
        address: faker.address.streetAddress(),
        about: faker.lorem.lines(),
        registered: faker.date.recent(30),
        latitude: faker.address.latitude(),
        longtitude: faker.address.longitude(),
    };
}
const createRequest = length => Array.from({length}, (_, i) => createItem(i));
module.exports = createRequest;