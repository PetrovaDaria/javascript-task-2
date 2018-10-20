'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook;
phoneBook = new Map();

function checkPhone(phone) {
    return /^\d{10}$/.test(phone);
}

function formatPhone(phone) {
    return '+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) + '-' +
        phone.slice(6, 8) + '-' + phone.slice(8, 10);
}

function findMap(query) {
    if (query === '*') {
        return phoneBook;
    }
    const reg = new RegExp(query);
    const found = new Map();
    phoneBook.forEach(function (value, key) {
        if (reg.test(key) || reg.test(value.name) || reg.test(value.email)) {
            found.set(key, value);
        }
    });

    return found;
}

function decorateFoundMap(foundMap) {
    const result = [];
    foundMap.forEach(function (value, key) {
        const formattedPhone = formatPhone(key);
        let note = value.name + ', ' + formattedPhone;
        if (value.email !== '') {
            note += ', ' + value.email;
        }
        result.push(note);
    });

    return result.sort();
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if ((!checkPhone(phone)) || (phoneBook.has(phone)) || (arguments.length === 1)) {
        return false;
    }
    phoneBook.set(phone, { 'name': name, 'email': email });

    return true;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (arguments.length === 1 || !phoneBook.has(phone)) {
        return false;
    }
    if (arguments.length === 2) {
        email = '';
    }
    phoneBook.set(phone, { 'name': name, 'email': email });

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    const foundMap = findMap(query);
    foundMap.forEach(function (value, key) {
        phoneBook.delete(key);
    });

    return foundMap.size;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    const foundMap = findMap(query);

    return decorateFoundMap(foundMap);
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует
    let addedOrUpdatedCount = 0;
    const csvStrings = csv.split('\n');
    csvStrings.forEach(function (item) {
        const parts = item.split(';');
        const name = parts[0];
        const phone = parts[1];
        const email = parts[2];
        if (add(phone, name, email) || update(phone, name, email)) {
            addedOrUpdatedCount++;
        }
    });

    return addedOrUpdatedCount;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};