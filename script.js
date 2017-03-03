window.onload=function () {
    document.getElementById("countFirstTask").onclick=calculateFirst;
    document.getElementById("clearFirstAnswer").onclick=function () {
        document.getElementById("firstTaskAnswer").innerText='';
    }

    document.getElementById("countSecondTask").onclick=calculateSecond;
    document.getElementById("clearSecondAnswer").onclick=function () {
        document.getElementById("secondTaskAnswer").innerText='';
    }

    document.getElementById("countThirdTask").onclick=calculateThird;
    document.getElementById("clearThirdAnswer").onclick=function () {
        document.getElementById("thirdTaskAnswer").innerText='';
    }

}

function calculateFirst() {
    var answer=document.getElementById("firstTaskAnswer");
    var expressionsStr=document.getElementsByName("fistTaskNumbers");
    var expressions=[];
    for(var i=0;i<expressionsStr.length;i++)
        expressions[i]=expressionsStr[i].value;

    var borderRelativeMistakes=[];
    for(var i=0;i<expressions.length;i++)
        borderRelativeMistakes[i]=calculate(expressions[i],i);
    if(borderRelativeMistakes[0]<borderRelativeMistakes[1])
        answer.innerText+=borderRelativeMistakes[0]+"<"+borderRelativeMistakes[1]+"\nПерша рівність точніша\n";
    else if(borderRelativeMistakes[0]>borderRelativeMistakes[1])
        answer.innerText+=borderRelativeMistakes[0]+">"+borderRelativeMistakes[1]+"\nДруга рівність точніша\n";


    function calculate(expression,index) {
        index++;
        var parts=expression.split("=");
        var exactValue;
        var numberAmount=document.getElementById("lettersAfterDot").value;
        if(/sqrt/.test(parts[0]))
        {
            var value=parseFloat(parts[0].match(/\d+/));
            value=Math.sqrt(value);
            exactValue=value.toFixed(numberAmount);
        }
        else if(/\//.test(parts[0]))
        {
            var pattern=/\d+/g;
            var values=parts[0].match(pattern);
            exactValue=(values[0]/values[1]).toFixed(numberAmount);
        }

        var difference=parseFloat(Math.abs(exactValue-parts[1]).toFixed(numberAmount));
        var borderAbsMistake=(difference+1/Math.pow(10,numberAmount)).toFixed(numberAmount);
        var borderRelativeMistake=getBorderRelativeMistake(borderAbsMistake,parts[1]);
        var percent=+(borderRelativeMistake*10*10).toFixed(10);

        answer.innerText+="a"+index+"="+parts[1]+"\n"+
            "A"+index+"="+parts[0]+"="+exactValue+"\n"+
            "|A"+index+"-a"+index+"= |"+exactValue+"-"+parts[1]+"|= "+difference+"<= "+borderAbsMistake+"\n"+
            "△a"+index+"= "+difference+"\nГранична △a"+index+"= "+borderAbsMistake+"\n"+
            "Гранична &a"+index+"= |гранична △a"+index+"/a"+index+"|= "+borderAbsMistake+"/"+parts[1]+"= "+
            borderRelativeMistake+" ("+percent+"%)\n\n";

        return borderRelativeMistake;
    }
}

function calculateSecond() {
    var number=parseFloat(document.getElementById("secondTaskNumber").value);
    var absMistake=document.getElementById("absMistake").value;
    var checked=getCheckedValue("secondTaskChoice");

    var nonZeroCoord;
    var borderAbsMistake;
    if(checked=="narrow"){
        nonZeroCoord=getFirstNonZeroCoord(5);
        borderAbsMistake=0.5/Math.pow(10,nonZeroCoord--);
    }
    else{
        nonZeroCoord=getFirstNonZeroCoord(1);
        borderAbsMistake=0.1/Math.pow(10,nonZeroCoord);
    }

    var answer=document.getElementById("secondTaskAnswer");
    absMistake=parseFloat(absMistake);
    var i=1;
    do{

        if(i>1)
            answer.innerText+=delta+">"+borderAbsMistake+"\n";
        borderAbsMistake*=10;
        var tmpNumber=parseFloat(number.toFixed(nonZeroCoord--));
        var delta=+(absMistake+Math.abs(number-tmpNumber)).toFixed(7);

        var a="a";
        for(var j=0;j<i;j++)
            a+="*";

        answer.innerText+="\n"+absMistake+"<="+borderAbsMistake+"\n"+
                a+"= "+tmpNumber+"\n"+
                "△"+a+"= △a+△окр= "+absMistake+"+|"+number+"-"+tmpNumber+"|= "+delta+"\n";
        i++;
    }while (delta>=borderAbsMistake);
    answer.innerText+=delta+"<="+borderAbsMistake+"\nВідповідь: "+tmpNumber+"\n";


    function getFirstNonZeroCoord(n) {
        for(var i=absMistake.length-1;i>1;i--){
            var num=parseFloat(absMistake[i]);
            if (n>num)
                return i-1;
        }

    }
}

function calculateThird() {
    var number=document.getElementById("thirdTaskNumber").value;
    var borderAbsMistake;
    var stp;

    var checked=getCheckedValue("thirdTaskChoice");

    if(checked=="narrow"){
        stp=number.length-number.indexOf(".");
        borderAbsMistake=5/Math.pow(10,stp);
    }
    else {
        stp=number.length-number.indexOf(".")-1;
        borderAbsMistake=1/Math.pow(10,stp);
    }

    var borderRelativeMistake=getBorderRelativeMistake(borderAbsMistake,number);
    var percent=+(borderRelativeMistake*10*10).toFixed(10);

    document.getElementById("thirdTaskAnswer").innerText+="a= "+number+"\nгранична △a= "+
        borderAbsMistake+"\nГранична &a=|гранична △a/a|= "+borderAbsMistake+"/"+
            number+"= "+borderRelativeMistake+" ("+percent+"%)\n\n";
}

function getCheckedValue(radioButtonsName) {
    var choise=document.getElementsByName(radioButtonsName);
    for(var i=0;i<choise.length;i++)
        if(choise[i].checked)
            return choise[i].value;
}

function getBorderRelativeMistake(borderAbsMistake,a) {
    var borderRelativeMistake=Math.abs(borderAbsMistake/a).toString();
    for(var i=2;borderRelativeMistake.length;i++)
        if(borderRelativeMistake[i]!="0"){
            var result=borderRelativeMistake.substring(0,i+1);
            var newNum=parseFloat(borderRelativeMistake[i+1])+1;
            result+=newNum;
            result=parseFloat(result);
            return result;
        }
}