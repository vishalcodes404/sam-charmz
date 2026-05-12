// Safe storage wrapper with try/catch for browsers that block localStorage/sessionStorage.
// Falls back gracefully to in-memory storage so the app never crashes.

const memoryStore = {};

function isStorageAvailable(type) {
    try {
        const storage = window[type];
        const testKey = '__storage_test__';
        storage.setItem(testKey, 'test');
        storage.removeItem(testKey);
        return true;
    } catch {
        return false;
    }
}

const hasLocalStorage = isStorageAvailable('localStorage');
const hasSessionStorage = isStorageAvailable('sessionStorage');

export const safeLocalStorage = {
    getItem(key) {
        try {
            if (hasLocalStorage) {
                return localStorage.getItem(key);
            }
        } catch { /* ignore */ }
        return memoryStore[key] ?? null;
    },
    setItem(key, value) {
        try {
            if (hasLocalStorage) {
                localStorage.setItem(key, value);
                return;
            }
        } catch { /* ignore */ }
        memoryStore[key] = value;
    },
    removeItem(key) {
        try {
            if (hasLocalStorage) {
                localStorage.removeItem(key);
                return;
            }
        } catch { /* ignore */ }
        delete memoryStore[key];
    },
};

export const safeSessionStorage = {
    getItem(key) {
        try {
            if (hasSessionStorage) {
                return sessionStorage.getItem(key);
            }
        } catch { /* ignore */ }
        return memoryStore[`__session__${key}`] ?? null;
    },
    setItem(key, value) {
        try {
            if (hasSessionStorage) {
                sessionStorage.setItem(key, value);
                return;
            }
        } catch { /* ignore */ }
        memoryStore[`__session__${key}`] = value;
    },
    removeItem(key) {
        try {
            if (hasSessionStorage) {
                sessionStorage.removeItem(key);
                return;
            }
        } catch { /* ignore */ }
        delete memoryStore[`__session__${key}`];
    },
};
