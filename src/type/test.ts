type Func<A, B> = [A,B] extends [1, 2] 
    ? 'match 1 2'
    : 'not match';
type result = Func<1,2>
// type Func1<A,B> = {A,B} extendx{1,2}