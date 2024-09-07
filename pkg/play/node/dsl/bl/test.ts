//
// test
const query1 = `query (a) from CidSet`;
const query2 = `query (a b) from CidSet`;
const query3 = `query (a) from CidSet where a === 1 || a>=1 || a<=1 `;
const query4 = `query (a) from CidSet where a>=1 && a<=1 `;
const query5 = `query (a) from CidSet where (a === 1) || (a >= 1 && a <= 1)`;
const query6 = `query (a) from CidSet where (a === 1) && (a >= 1 && a <= 1)`; // throw error
const query7 = `query (a) from CidSet where (a === 1)`;
const queryN = `add xx to CidSet | query`;
export {};
