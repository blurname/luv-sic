const colorToken = {
    Red: '\x1b[31m',
    Green: '\x1b[32m',
    Reset: '\x1b[0m',
    Yellow: '\x1b[33m',
};
const colorLog = ({ msg, fg }) => {
    return `${colorToken['Reset']}${colorToken[fg]}${msg}${colorToken['Reset']}`;
};
export { colorLog };
