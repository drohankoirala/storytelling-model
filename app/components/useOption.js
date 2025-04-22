import { useEffect, useState } from 'react';

export default function useOption(__handler = "opt", __default = {}, __db = "__nav") {
    const [options, setOption] = useState(__default);
    const [dataBase, setDataBase] = useState({});

    useEffect(() => {
        initDB().then(async (db) => {
            const existingData = await readData(db, __handler) || __default;
            const allData = await readAll(db);
            setDataBase(allData);
            changeData(existingData, allData);
        });
    }, []);

    function changeData(__data, existingDB) {
        __data = typeof __data === "function" ? __data(options) : __data;
        const newDB = { ...(existingDB || dataBase), [__handler]: __data };

        setOption(__data);
        setDataBase(newDB);

        initDB().then(db => writeData(db, __handler, __data));
    }

    return [options, changeData];
}

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('__drk__local_db', 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('__drk__store')) {
                db.createObjectStore('__drk__store');
            }
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

function writeData(db, key, value) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction('__drk__store', 'readwrite');
        const store = tx.objectStore('__drk__store');
        store.put(value, key);

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

function readData(db, key) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction('__drk__store', 'readonly');
        const store = tx.objectStore('__drk__store');
        const request = store.get(key);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function readAll(db) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction('__drk__store', 'readonly');
        const store = tx.objectStore('__drk__store');
        const request = store.getAllKeys();
        const allData = {};

        request.onsuccess = () => {
            const keys = request.result;
            const valueRequests = keys.map(key => {
                return new Promise((res, rej) => {
                    const valueReq = store.get(key);
                    valueReq.onsuccess = () => res({ key, value: valueReq.result });
                    valueReq.onerror = () => rej(valueReq.error);
                });
            });

            Promise.all(valueRequests)
                .then(results => {
                    results.forEach(({ key, value }) => allData[key] = value);
                    resolve(allData);
                })
                .catch(reject);
        };

        request.onerror = () => reject(request.error);
    });
}
