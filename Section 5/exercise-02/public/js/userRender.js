function computeUserPanel(user) {
    return `<div class="user_card><p>Name: ${user.name} ${user.firstname}</p><p>Email: ${user.email}</p></div>`;
};

function renderUsers (users, usersPanel) {
    usersPanel.innerHTML = '';
    for(let user of users) {
        usersPanel.innerHTML += computeUserPanel(user);
    }
    console.log(usersPanel.innerHTML);
};

export { renderUsers };