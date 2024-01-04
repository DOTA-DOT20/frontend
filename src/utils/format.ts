export  function formatNumberWithCommas(number: number) {
    const numStr = number.toString();
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}



export function shotAddress(address: string) {
    return address.slice(0, 6) + '...' + address.slice(-6)
}
