const addbutton = document.querySelector('.addbutton');
addbutton.addEventListener('click', function () {
    console.log('tedgvcsc');
    document.getElementById('form').style.display = 'grid';
    addbutton.style.display = 'none';

});

document.querySelector('.btn-form').addEventListener('click', function () {
    document.getElementById('form').style.display = 'none';
    addbutton.style.display = 'grid';
})

document.querySelector('.login').addEventListener('click', function () {
    alert('fitur login: belum ada;😁');
})

const searchInput = document.getElementById('searchbook');
const searchButton = document.createElement('button'); 

searchButton.textContent = 'Cari';
searchButton.classList.add('search-button'); 
searchButton.style.display = 'none';
searchInput.insertAdjacentElement('afterend', searchButton); 


searchInput.addEventListener('click', function () {
    searchButton.style.display = 'block';
});

searchButton.addEventListener('click', function () {
    const searchText = searchInput.value.trim().toLowerCase(); 
    const bookItems = document.querySelectorAll('.item');

    bookItems.forEach(item => {
        const titleElement = item.querySelector('h2'); 
        const title = titleElement.textContent.toLowerCase(); 

        if (title.includes(searchText)) {
            item.style.display = 'flex'; 
        } else {
            item.style.display = 'none'; 
        }
    });
});


const newBooks = [];
const RENDER_EVENT = 'render-newbook';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addNewBook(); 
    });

    

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

const SAVED_EVENT = 'saved-newbook';
const STORAGE_KEY = 'NEWBOOK_APPS';

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    saveData();
    renderNewBooks();
});

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(newBooks);
        localStorage.setItem(STORAGE_KEY, parsed);
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        newBooks.push(...data);
    }

    renderNewBooks();
}

function addNewBook() {
    const title = document.getElementById('title').value;
    const penulis = document.getElementById('penulis').value;
    const year = document.getElementById('year').value;
    const isComplete = false;


    const newBookObject = {
        id: generateId(),
        title,
        penulis,
        year,
        isComplete
    };


    newBooks.push(newBookObject);

    document.getElementById('title').value = '';
    document.getElementById('penulis').value = '';
    document.getElementById('year').value = '';

    notifikasihidden(newBookObject);

    document.dispatchEvent(new Event(SAVED_EVENT));
}

function generateId() {
    return +new Date();
}

function renderNewBooks() {
    const belumdibacaList = document.getElementById('belumdibaca');
    const sudahdibacaList = document.getElementById('sudahdibaca');

    belumdibacaList.innerHTML = '';
    sudahdibacaList.innerHTML = '';

    newBooks.forEach(book => {
        const item = document.createElement('div');
        item.classList.add('item', 'shadow');
        const textcontainer = document.createElement('div');
        textcontainer.classList.add('inner');
        const titleHeading = document.createElement('h2');
        titleHeading.textContent = book.title;
        const penulisPara = document.createElement('p');
        penulisPara.textContent = `Penulis: ${book.penulis}`;
        const tahunPara = document.createElement('p');
        tahunPara.textContent = `Tahun: ${book.year}`;

        const menu = document.createElement('div');
        menu.classList.add('menu');

        textcontainer.append(titleHeading, penulisPara, tahunPara);
        item.appendChild(textcontainer);

        if (book.isComplete) {
            const undoButton = document.createElement('button');
            undoButton.textContent = 'Belum dibaca';
            undoButton.classList.add('undo-button');
            undoButton.addEventListener('click', function () {
                book.isComplete = false;
                document.dispatchEvent(new Event(SAVED_EVENT));
            });
            const deleteButton = createDeleteButton(book.id);
            menu.append(undoButton, deleteButton);
            item.append(menu);
            sudahdibacaList.appendChild(item);
        } else {
            const completeButton = document.createElement('button');
            completeButton.textContent = 'Selesai dibaca';
            completeButton.classList.add('complete-button');
            completeButton.addEventListener('click', function () {
                book.isComplete = true;
                document.dispatchEvent(new Event(SAVED_EVENT));
            });
            const deleteButton = createDeleteButton(book.id);
            menu.append(completeButton, deleteButton);
            item.append(menu);
            belumdibacaList.appendChild(item);
        }
    });
}

function createDeleteButton(bookId) {
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');

    deleteButton.addEventListener('click', function () {
        const confirmationDialog = document.getElementById('confirmationDialog');
        confirmationDialog.style.display = 'block';

        const confirmDeleteButton = document.getElementById('confirmDeleteButton');
        const cancelDeleteButton = document.getElementById('cancelDeleteButton');

        confirmDeleteButton.addEventListener('click', function () {
            deleteBookById(bookId);
            document.dispatchEvent(new Event(SAVED_EVENT));
            renderNewBooks();
            confirmationDialog.style.display = 'none';
        });

        cancelDeleteButton.addEventListener('click', function () {
            confirmationDialog.style.display = 'none';
        });
    });

    return deleteButton;
}


function deleteBookById(bookId) {
    newBooks.splice(newBooks.findIndex(book => book.id === bookId), 1);
}



function notifikasihidden(book) {
    const notifbox = document.createElement('div');
    notifbox.classList.add('notifbox');
    const notifikasi = document.createElement('div');
    notifikasi.classList.add('notifikasihidden');
    const h2notif = document.createElement('h2');
    h2notif.textContent = 'buku ' + book.title + ' sudah ditambahkan!';

    const okeybutton = document.createElement('button');
    okeybutton.classList.add('okeybutton');
    okeybutton.textContent = 'ok';

    notifikasi.append(h2notif, okeybutton);
    notifbox.append(notifikasi);
    document.querySelector('.wrapper').append(notifbox);

    okeybutton.addEventListener('click', function () {
        notifbox.style.display = 'none';
    });
}



