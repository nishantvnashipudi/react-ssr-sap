
export function setLocalStorage(key, value){
    localStorage.setItem(key, JSON.stringify(value));
}
export function getLocalStorage(key){
    let value = JSON.parse(localStorage.getItem(key));
    return value ? value : [];
}
export function getIntLocalStorage(key){
    let value = JSON.parse(localStorage.getItem(key));
    return value ? value : 0;
}
export function removeLocalStorage(key){
    localStorage.removeItem(key);
}