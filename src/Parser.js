var unit = [];

/*
                  Dispatch Definitions

        The dispatch prioritise the entries with more given values
    than the ones only with variables (fig.1):

        #1 fac n = ...;
               v
            variable
         
        #2 fac 0 = ...; <- this will be read first.
               v
             value

        The arity, number of parameters, of a function counts
    to order the definitions too. Lower arities come before
    higher arities (fig.2):

        #1 f x y = ...; <- this go after #2.
        #2 f x = ...; <- this go first.
        #3 f x y 0 = ...; <- this go last.

        The 'mdefs' variable holds an example of a function
    definition. Each row has four columns, and they're
    ordered following the table:

        [arity,values (fig.1, #2), params, impl]

        If any param in the 'params' column is 'null', then
    it represents a variable (fig.3):

        #1 f x 1 = ...;
        #2  [null,1]
    
*/
var mdefs = [[1,1,[unit],(a => 0)],
             [1,0,[null],(a => a*a)],
             [2,0,[null,null],((a,n) => a*n)],
             [2,1,[null,0],((a,n) => a)],
             [1,1,[0],(a => 1)]];

/* Implementing first paragraph. */
var toTable = function(defs){
    var tabl = [];
    // See fig.1 //
    defs = defs.map(i => i).sort((a,b) => b[1] - a[1]);
    // See fig.2 //
    for(var df of defs){
        if(tabl[df[0]] == undefined)
            tabl[df[0]] = [];
        tabl[df[0]].push(df);
    }
    return tabl;
}

/* Debug Helper */
var logTable = tabl => tabl.forEach((row,idx) => { console.log(`Table Entry ${idx}:`)
                                             row.forEach(col => console.log("| | ["+col[0]+", "+col[1]+"]")); });
/* Dispatch Helper */
var cmpDefs = (dfs,args) => dfs.reduce(((acc, par, idx) => ((par == null) ? true : par == args[idx]) && acc),true);

/* Dispatch Mechanism */
var dispatchTable = (tabl,args) => {
    var row = tabl[args[0]];
    if(row == undefined)
        return [];
    for(var df of row){
        if(cmpDefs(df[2],args[1])){
            return df[3].apply(null,args[1]);
        }
    }
    return {what: () => "err"};
}

/* Use Examples */
logTable(toTable(mdefs));
console.log(dispatchTable(toTable(mdefs),[2,[2,0]]));
