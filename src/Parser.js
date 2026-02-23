var LexerIsLetter = function(c){
    return c.toUpperCase() != c.toLowerCase();
}
var LexerIsDigit = function(c){
    return '0'.charCodeAt(0) <= c.charCodeAt(0) && c.charCodeAt(0) <= '9'.charCodeAt(0);
}
var LexerIsSpace = function(c){
    return c == " " || c == "\n" || c == "\t";
}
var LexerOpsit = {
    "(": ")", ")": "(",
    "<": ">", ">": "<",
    "[": "]", "]": "[",
    "{": "}", "}": "{"
}
var LexerOpposite = function(c){
    return LexerOpsit[c];
}

var ParserExpect = function(src,c,msg){
    if(src[0] != c[0])
        throw msg;
    src.shift();
}

var ParseSpace = function(src){
    while(src.length > 0 && LexerIsSpace(src[0]))
        src.shift();
}

var ParseDigit = function(src){
    var num = "";
    while(src.length > 0 && LexerIsDigit(src[0]))
        num += src.shift();
    if(src.length > 0 && src[0] == '.'){
        num += src.shift();
        while(src.length > 0 && LexerIsDigit(src[0]))
            num += src.shift();
        return {
            type: "float",
            value: +num,
            debugValue: num
        }
    }
    
    return {
        type: "int",
        value: (+num) | 0,
        debugValue: num
    }
}

var ParseWord = function(src){
    var wrd = src.shift();
    var multi = false;
    while(src.length > 0 && (LexerIsLetter(src[0]) || src[0] == "_" || src[0] == ".")){
        if(src[0] == ".")
            multi = true;
        wrd += src.shift();
    }

    if(wrd[0] == ".")
        return {
            type: "member",
            value: wrd.substring(1),
            symbol: wrd
        }
    else if(wrd[0] == ":")
        return {
            type: "type var",
            value: wrd.substring(1),
            symbol: wrd
        }
    else if(wrd[0] != "." && wrd[0] != ":" && multi)
        return {
            type: "multi",
            value: wrd.split('.'),
            symbol: wrd
        }
    
    if(wrd == "yes")
        return {
            type: "bool",
            value: 1
        }
    else if(wrd == "no")
        return {
            type: "bool",
            value: 0
        }
    else if(wrd == "nil")
        return {
            type: "nil",
            value: null
        }
    return {
        type: "word",
        value: wrd
    }
}

var ParseString = function(src,type){
    var str = "";
    src.shift();
    while(src.length > 0 && src[0] != type){
        if(src[0] == "\\" && src.length > 1){
            src.shift();
            if(src[0] == type){
                str += type;
                src.shift();
            }
            else if(src[0] == "n"){
                str += "\n";
                src.shift();
            }
            else if(src[0] == "t"){
                str += "\t";
                src.shift();
            }
            else
                str += src.shift();
            continue;
        }
        str += src.shift()
    }
    src.shift();
    return {
        type: "string",
        value: str
    }
}

var ParseList = function(src){
    var body = [];
    var type = src.shift();
    while(src.length > 0 && src[0] != LexerOpposite(type))
        body.push(ParseExpr(src));
    ParserExpect(src,LexerOpposite(type),"RT ERR: expct '"+LexerOpposite(type)+"'.");
    return {
        type: "list",
        value: body,
        symbol: type + LexerOpposite(type)
    }
}

var ParseValue = function(src){
    ParseSpace(src);
    if(LexerIsDigit(src[0]))
        return ParseDigit(src);
    else if(LexerIsLetter(src[0]) || src[0] == "_" || src[0] == "." || src[0] == ":")
        return ParseWord(src);
    else if(src[0] == '"')
        return ParseString(src,'"');
    else if(src[0] == "'")
        return ParseString(src,"'");
    else if(LexerOpposite(LexerOpposite(src[0])) == src[0])
        return ParseList(src)
    else if(src.length == 0)
        throw "RT ERR: expct val.";
    else
        throw "RT ERR: unknwn val type.";
}

var ParseExpr = function(src){
    return ParseValue(src);
}
var ParseStats = function(src){
    var body = [];
    while(src.length > 0){
        body.push(ParseExpr(src))
        ParseSpace(src);
    }
    return {
        type: "program",
        body: body
    }
}

var ParserRun = function(src){
    return ParseStats(src.split(''));
}
