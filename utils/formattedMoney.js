function formattedMoney(num) {
    if (num >= 1000) {
        let formatted = (num / 1000).toFixed(1);
        formatted = formatted.replace(/\.0$/, '');
        return `${formatted}K`;
    }
    return num.toString();
}

module.exports = formattedMoney;