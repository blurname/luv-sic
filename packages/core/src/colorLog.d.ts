declare const colorToken: {
    readonly Red: "\u001B[31m";
    readonly Green: "\u001B[32m";
    readonly Reset: "\u001B[0m";
    readonly Yellow: "\u001B[33m";
};
type Color = keyof typeof colorToken;
type ColorLog = {
    msg: string;
    fg: Color;
};
declare const colorLog: ({ msg, fg }: ColorLog) => string;
export { colorLog };
//# sourceMappingURL=colorLog.d.ts.map