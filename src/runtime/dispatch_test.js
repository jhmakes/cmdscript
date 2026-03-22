var unit = [];

var mdefs = [[1,1,[unit],(a => 0)],
             [1,0,[null],(a => a*a)],
             [2,0,[null,null],((a,n) => a*n)],
             [2,1,[null,0],((a,n) => a)],
             [1,1,[0],(a => 1)]];

var toTable = function(defs){
    var tabl = [];
    defs = defs.map(i => i).sort((a,b) => b[1] - a[1]);
    for(var df of defs){
        if(tabl[df[0]] == undefined)
            tabl[df[0]] = [];
        tabl[df[0]].push(df);
    }
    return tabl;
}

var logTable = tabl => tabl.forEach((row,idx) => { console.log(`Table Entry ${idx}:`)
                                             row.forEach(col => console.log("| | ["+col[0]+", "+col[1]+"]")); });

var cmpDefs = (dfs,args) => dfs.reduce(((acc, par, idx) => ((par == null) ? true : par == args[idx]) && acc),true);

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

logTable(toTable(mdefs));
console.log(dispatchTable(toTable(mdefs),[1,[0]]));
