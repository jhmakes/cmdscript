/*
                Recursive Pattern Matching

        This is an implementation of a pattern matching
    algorithmn that can read recursive patterns.

        The mechanism uses a type-value pair, or triple,
    to represent the structure of a value (fig.1). Thus, both
    the value and the pattern must be turned into these
    simple wrappers (fig.2), or them can be parsed directly if
    you already have access to the underlying typing
    system:

        Fig. 1:

            Pattern = [Type, Pattern] or Value or ["ALL", Name, Pattern]

        Fig. 2:

            (1,2,3) -> [TUP,[[VAL,1],[VAL,2],[VAL,3]]]
            (x,_,y) -> [TUP,[[VAR,"x"],[SKP],[VAR,"y"]]]
    
*/



/* Constants Definitions */
var ATM = 0, // Atom, a single value. //
    TUP = 1, // Tuple, a colletion of values. //
    VAL = 2  // Value, match EXACT value. //
    VAR = 3, // Variable, bind current value to a name. //
    ALL = 4, // All, bind the entire value to a name. //
    SKP = 5, // Skip, skip value. //
    ERR = 6; // Err, stop matching and throw error. //

var p1 = [[VAR,"atm"],[ATM,"val"]],
    p2 = [[TUP,[[VAR,"tFst"],[SKP],[VAR,"tLst"]]],[TUP,[[ATM,1],[ATM,2],[ATM,3]]]],
    p3 = [[TUP,[[VAL,"Some"],[VAR,"cons"]]],[TUP,[[ATM,"Some"],[ATM,'a']]]],
    p4 = [[ALL,"a",[TUP,[[VAR,"x"],[VAR,"y"]]]],[TUP,[[ATM,1],[ATM,2]]]];

var match = (p,v,m) => {
    if(p[0] == VAR){
        m[p[1]] = v[1];
        return [v[1]];
    }
    else if(p[0] == TUP){
        if(v[0] != TUP)
            return ERR;
        if(p[1].length != v[1].length)
            return ERR;
        var i=0,r=[];
        while(i<p[1].length){
            var atm = match(p[1][i],v[1][i],m);
            if(atm == ERR)
                return ERR;
            if(atm == SKP){
                i++;
                continue;
            }
            r.push(atm);
            i++;
        }
        return [TUP,r];
    }
    else if(p[0] == VAL){
        if(p[1] == v[1])
            return true;
        return ERR;
    }
    else if(p[0] == ALL){
        m[p[1]] = evalVs(v);
        return match(p[2],v,m);
    }
    else if(p[0] == SKP)
        return SKP;
    else if(p[0] == ERR)
        return ERR;
}

var runMatch = (p) => {
    let m = p[2];
    if(p.length < 3)
        m = {};
    return [evalVs(match(p[0],p[1],m)),m];
}

var evalVs = (p) => {
    if(p.length <= 1)
        return p[0];
    if(p[0] == TUP){
        var i=0,r=[];
        while(i<p[1].length){
            var atm = evalVs(p[1][i]);
            r.push(atm);
            i++;
        }
        return r;
    }
    else if(p[0] == ATM)
        return p[1];
    
}

var a = [[ALL,"abcd",[TUP,[[VAR,"a"],[TUP,[[SKP],[TUP,[[VAL,"c"],[VAR,"d"]]]]]]]], // abcd@(a,(_,("c",d)))
         [TUP,[[ATM,"a"],[TUP,[[ATM,"b"],[TUP,[[ATM,"c"],[ATM,"d"]]]]]]]];         // ("a",("b",("c","d")))
var r = runMatch(a)
console.log(r[0])
console.log(r[1])
