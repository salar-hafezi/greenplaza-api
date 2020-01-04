const generateOtac = () => {
    const min = 10000000;
    const max = 100000000;
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

module.exports = {
    generateOtac
};
