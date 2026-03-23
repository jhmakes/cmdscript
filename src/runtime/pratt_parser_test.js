/*
             Pratt Parsing Principle

        This is a concept proof to show how the
    new parser should look like.

        This version has a much greater solid
    base than its early versions.

    
*/


var ATM = 0,
    NAME = 1,
    INFIX = 2,
    SPACE = 3;

var PREC = {
    "+": 10,
    "-": 10,
    "*": 20,
    "/": 20,
    " ": 30
};

var tkls = [[NAME,"doubleUs"],[SPACE," "],[ATM,2],[SPACE," "],[ATM,4],[INFIX,"+"],[NAME,"doubleMe"],[SPACE," "],[ATM,2]];

var order = (ls,idx,prec_num) => {
    var lhs = ls[idx++][1];
    if(idx >= ls.length)
        return [lhs,idx];
    while(prec_num < PREC[ls[idx][1]]){
        var sign = ls[idx++];
        var rhs = order(ls,idx,PREC[sign[1]])
        lhs = [sign[1],lhs,rhs[0]]
        idx = rhs[1];
        if(idx >= ls.length)
            break;
    }
    return [lhs,idx];
}

console.log(order(tkls,0,0))
