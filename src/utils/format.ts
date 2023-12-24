export  function formatNumberWithCommas(number: number) {
    const numStr = number.toString();
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}


