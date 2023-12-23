// 1. Init DB and populate with data (there is a button for that)
// 2. Init DB on page open and measure init time

let db;

const start = performance.now();
const request = window.indexedDB.open("TestDB", 1);

const tableCount = 30;

request.onerror = (error) => {
    console.error("Why didn't you allow my web app to use IndexedDB?!", error);
};

request.onupgradeneeded = (event) => {
    console.log('onupgradeneeded');

    const db = event.target.result;

    for (let i = 0; i < tableCount; i++) {
        const objectStore = db.createObjectStore('items' + i, { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex("id", "id", { unique: true });
    }
};

request.onsuccess = (event) => {
    console.log('onsuccess');

    db = event.target.result;

    const result = Math.ceil(performance.now() - start);

    showTime(`${result}`);
};

async function addContent() {
    const itemsToInsert = [];
    const itemTemplate = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
    Ut enim ad minim veniam, 
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
    Excepteur sint occaecat cupidatat non proident, 
    sunt in culpa qui officia deserunt mollit anim id est laborum.
    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
    totam rem aperiam, 
    eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. 
    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, 
    sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. 
    Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, 
    adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. 
    Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, 
    nisi ut aliquid ex ea commodi consequatur? 
    Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, 
    vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?'`;

    for (let i = 0; i < 25000; i++) {
        const itemToInsert = i + itemTemplate;

        itemsToInsert.push({ name: itemToInsert });
    }

    showContentInfo(0, tableCount);

    for (let i = 0; i < tableCount; i++) {
        await addItems(db, 'items' + i, itemsToInsert);
        showContentInfo(i + 1, tableCount);
    }

    showDone();
}

async function addItems(db, tableName, items) {
    return new Promise((resolve) => {
        const tx = db.transaction(tableName, 'readwrite');

        items.forEach(item => {
            tx.objectStore(tableName).add(item);
        })

        tx.oncomplete = function () {
            resolve();
        }
    });
}

function addStudent(student) {
    const request = db.transaction('students', 'readwrite')
        .objectStore('students')
        .add(student);

    request.onsuccess = () => {
        console.log(`New student added, email: ${request.result}`);
    }

    request.onsuccess = (err) => {
        console.error(`Error to add new student: ${err}`)
    }
}

function showTime(result) {
    const innerElement = document.createElement('span');
    innerElement.id = 'resultValue';
    innerElement.innerHTML = result;

    const element = document.getElementById('result');

    element.appendChild(innerElement);
}

function showContentInfo(value, total) {
    const element = document.getElementById('addContentInfo');

    element.innerHTML = `Tables populated: ${value} out of ${total}.`;
}

function showDone() {
    const element = document.getElementById('addContentInfo');

    element.innerHTML = `DONE!`;
}