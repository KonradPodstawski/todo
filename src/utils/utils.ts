let localCounter = 0;

export function getNextID(): number {
    let timestamp = parseInt((new Date().getTime() / 10000).toFixed(0));
    localCounter += 1;
    return parseInt(`${timestamp}${localCounter}`);
}