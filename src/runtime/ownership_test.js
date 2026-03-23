var VAR = 0,
    VAL = 1;

var Var = name => ({type: VAR, name: name, value: null});

var Value = val => ({type: VAL, owner: null, value: val});

var setVar = (name,val,ctx) => {
    if(ctx[name] == undefined){
        ctx[name] = Var(name);
    }
    if(val.type == VAR){
        if(val.value == null){
            console.log("invalid move.");
            return;
        }
        if(val.name != val.value.owner){
            console.log("invalid move.");
            return;
        }
        val.value.owner = name;
        ctx[name].value = val.value;
        val.value = null;
        return ctx[name].value;
    }
        val.owner = name;
    return ctx[name].value = val;
};
var getVar = (name,ctx) => ctx[name];

var ctx = {};
setVar("a",Value(10),ctx);
console.log(ctx);
setVar("b",Value(20),ctx);
console.log(ctx);
setVar("b",getVar("a",ctx),ctx);
console.log(ctx);
setVar("c",getVar("a",ctx),ctx);
console.log(ctx);
