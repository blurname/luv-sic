const Tokenizer = (input) => {
    const tokens = [];
    const source = input.split(' ');
    source.map((s) => {
        if (s === 'query') {
            tokens.push({
                type: 'query',
            });
        }
        else if (s === '(') {
            tokens.push({
                type: 'parens',
                value: '(',
            });
            // eslint-disable-next-line no-empty
        }
        else if (s === 'result') {
        }
        else if (s === ')') {
            tokens.push({
                type: 'parens',
                value: ')',
            });
        }
        else if (s === 'from') {
            tokens.push({
                type: 'from',
            });
        }
        else if (s === 'where') {
            tokens.push({
                type: 'where',
            });
        }
    });
};
const parensTokenizer = (source, tokens) => { };
const whereTokenizer = (source, tokens) => { };
export {};
