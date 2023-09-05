const users = [
    {
        id: 1,
        name: 'John',
        firstname: 'Doe',
        email: 'johndoe@mail.com'
    },
    {
        id: 2,
        name: 'Jane',
        firstname: 'Doe',
        email: 'janedoe@mail.com'
    },
    {
        id: 3,
        name: 'Jack',
        firstname: 'Sparrow',
        email: 'jacksparrow@mail.com'
    }
];

const usersPanel = document.getElementById('users-panel');
const addUserBtn = document.getElementById('add-user');

const nameInput = document.getElementById('name');
const firstnameInput = document.getElementById('firstname');
const emailInput = document.getElementById('email');

renderUsers();

addUserBtn.addEventListener('click', () => {
    users.push({
        id: users.length + 1,
        name: nameInput.value,
        firstname: firstnameInput.value,
        email: emailInput.value
    });
    renderUsers();
});

function computeUserPanel(user) {
    const div = document.createElement('div');
    div.classList.add('user_card');
    const pName = document.createElement('p');
    pName.innerText = `Name: ${user.name} ${user.firstname}`;
    div.appendChild(pName);
    const pEmail = document.createElement('p');
    pEmail.innerText = `Email: ${user.email}`;
    div.appendChild(pEmail);
    return div;
};

function renderUsers () {
    usersPanel.innerHTML = '';
    for(let user of users) {
        usersPanel.appendChild(computeUserPanel(user));
    }
    console.log(usersPanel.innerText);
};