document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('createItem').addEventListener('click', createItem);
    document.getElementById("mainView").addEventListener("click", getItems);
    document.getElementById('editItem').addEventListener('click', chooseItemAndEdit);
    document.getElementById('logout').addEventListener('click', logout);
    document.getElementById('deleteItem').addEventListener('click', chooseItemAndDelete);

    showUserData(); 
    getItems(); 
});

function getItems() {
    const url = `https://localhost:7171/api/ToDo`; 

    fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error fetching items: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Fetched items:', data);
        displayItems(data); 
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function displayItems(items) {
    const itemsContainer = document.getElementById('itemsContainer');
    const userId = sessionStorage.getItem('userId').slice(1, -1);
    console.log('Displaying items for userId:', userId);

    itemsContainer.innerHTML = '';

    const filteredItems = items.filter(item => item.userId === userId);

    if (filteredItems.length === 0) {
        itemsContainer.innerHTML = '<p>Nerastas nei vienas šio vartotojo įrašas</p>';
        return;
    }

    filteredItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';

        itemDiv.innerHTML = `
            <p><strong>Įrašo numeris:</strong> ${item.id}</p>
            <p><strong>Pavadinimas:</strong> ${item.type}</p>
            <p><strong>Aprašymas:</strong> ${item.content}</p>
            <p><strong>Galiojimo data iki:</strong> ${new Date(item.endDate).toLocaleString()}</p>
        `;

        itemsContainer.appendChild(itemDiv);
    });
}

function logout() {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('email');
    window.location.href = '../index.html';
}

function createItem() {
    const formContainer = document.getElementById('itemsContainer');
    
    formContainer.innerHTML = '';

    const userId = sessionStorage.getItem('userId').slice(1, -1);

    const typeField = createInputField('type', 'Pavadinimas');
    const contentField = createInputField('content', 'Aprašymas');
    const endDateField = createInputField('endDate', 'Data');

    formContainer.appendChild(typeField);
    formContainer.appendChild(contentField);
    formContainer.appendChild(endDateField);

    const saveButton = document.createElement('button');
    saveButton.id = 'saveButton';
    saveButton.innerText = 'Save';

    formContainer.appendChild(saveButton);

    saveButton.addEventListener('click', function () {

        const requestBody = {
            userId: userId, 
            type: document.getElementById('type').value,
            content: document.getElementById('content').value,
            endDate: new Date(document.getElementById('endDate').value).toISOString() 
        };

        fetch('https://localhost:7171/api/ToDo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
}

function getItemById(itemId) {
    return fetch(`https://localhost:7171/api/ToDo/${itemId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching item: ${response.status} ${response.statusText}`);
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error('Received non-JSON response');
            }
            return response.json();
        })
        .then(item => {
            if (item) {
                return item;
            } else {
                console.error('Item not found or invalid response structure.');
                return null;
            }
        })
        .catch(error => {
            console.error('Error fetching item:', error);
            alert('Failed to fetch item. Please try again.');
            return null;
        });
}

function updateItem(item) {
    const formContainer = document.getElementById('itemsContainer');

    formContainer.innerHTML = '';

    const userId = sessionStorage.getItem('userId').slice(1, -1);
    item.userId = userId;

    console.log('Updating item:', item);

    const inputFields = [
        { id: 'Id', label: 'Id', value: item.id, readonly: true },
        { id: 'userId', label: 'User ID', value: item.userId, readonly: true },
        { id: 'type', label: 'Type', value: item.type },
        { id: 'content', label: 'Content', value: item.content },
        { id: 'endDate', label: 'End Date', value: new Date(item.endDate).toISOString(), type: 'datetime-local' }
    ];

    inputFields.forEach(field => {
        const inputElement = createInputField(field.id, field.label, field.value, field.readonly || false, field.type);
        formContainer.appendChild(inputElement);
    });

    const saveButton = document.createElement('button');
    saveButton.id = 'saveButton';
    saveButton.innerText = 'Atnaujinti';
    formContainer.appendChild(saveButton);

    saveButton.addEventListener('click', async () => {
        const requestBody = {
            userId: document.getElementById('userId').value,
            type: document.getElementById('type').value,
            content: document.getElementById('content').value,
            endDate: new Date(document.getElementById('endDate').value).toISOString(),
            id: item.id
        };

        try {
            const response = await fetch(`https://localhost:7171/api/ToDo/${item.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`Error updating item: ${response.status}`);
            }

            console.log('Update successful');
            getItems();

        } catch (error) {
            console.error('Error:', error);
        }
    });
}

function deleteItem(itemId) {
    const url = `https://localhost:7171/api/ToDo/${itemId}`;

    fetch(url, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error deleting item: ' + response.status);
        }
    })
    .then(data => {
        console.log('Success:', data);
        getItems();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function showUserData() {
    const userName = sessionStorage.getItem('userName').slice(1, -1);
    const userNameCapitalized = userName.charAt(0).toUpperCase() + userName.slice(1);
    const email = sessionStorage.getItem('email').slice(1, -1);

    if (userName) {
        document.getElementById('userNameDisplay').textContent = userNameCapitalized;
    }
    if (email) {
        document.getElementById('emailDisplay').textContent = email;
    } 
    else {
        console.log('No user data found in sessionStorage');
    }
}

function createInputField(id, label, value = '', readOnly = false) {
    const container = document.createElement('div');
    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', id);
    labelElement.innerText = label;

    const input = document.createElement('input');
    input.type = 'text'; 
    input.id = id;
    input.value = value;
    input.readOnly = readOnly; 

    container.appendChild(labelElement);
    container.appendChild(input);

    return container;
}

function createItemIdForm(callback) {
    const formContainer = document.createElement('div');

    const itemIdInputField = createInputField('itemIdInput', 'Įveskite pasirinktą numerį: ');
    itemIdInputField.classList.add('input-field');

    const fetchItemButton = document.createElement('button');
    fetchItemButton.innerText = 'Pasirinkti';
    fetchItemButton.id = 'fetchItemButton';

    fetchItemButton.addEventListener('click', function () {
        const itemId = document.getElementById('itemIdInput').value.trim();
        if (itemId) {
            callback(itemId);
        } else {
            console.log('Įvedėte neteisingą numerį');
        }
    });

    formContainer.appendChild(itemIdInputField);
    formContainer.appendChild(fetchItemButton);

    const itemFormContainer = document.getElementById('itemsContainer');
    itemFormContainer.appendChild(formContainer);
}

function chooseItemAndDelete() {
    createItemIdForm(function (itemId) {
        deleteItem(itemId);
    });
}

function chooseItemAndEdit() {
    createItemIdForm(function (itemId) {
        getItemById(itemId).then(item => {
            if (item) {
                updateItem(item); 
            }
        });
    });
}

