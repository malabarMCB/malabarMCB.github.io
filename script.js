function calculate() {
    var amount = document.getElementById("amount");
    var apr = document.getElementById("apr");
    var years = document.getElementById("years");
    var zipcode = document.getElementById("zipcode");
    var payment = document.getElementById("payment");
    var total = document.getElementById("total");
    var totalInterest = document.getElementById("totalInterest");
    var principal = parseFloat(amount.value);
    var interest = parseFloat(apr.value) / 100 / 12;
    var payments = parseFloat(years.value) * 12;
    var x = Math.pow(1 + interest, payments);
    var monthly = (principal*x*interest)/(x-1);
    if(isFinite(monthly)){
        payment.innerText = monthly.toFixed(2);
        total.innerHTML = (monthly * payments).toFixed(2);
        totalInterest.innerHTML = ((monthly*payments)-principal).toFixed(2);
        save(amount.value,apr.value, years.value,zipcode.value);
        drowGraph(principal,interest,monthly,payments);
        getLanders();
    }
    else{
        payment.innerHTML='';
        total.innerHTML='';
        totalInterest.innerHTML='';
        drowGraph();
    }
}


function save(amount,apr,years,zipcode) {
    if(window.localStorage){
        localStorage.amount=amount;
        localStorage.apr=apr;
        localStorage.years=years;
        localStorage.zipcode=zipcode;
    }
}


window.onload=function () {
    document.getElementById('calculateButton').onclick=calculate;
    if(window.localStorage && localStorage.amount){
        document.getElementById("amount").value=localStorage.amount;
        document.getElementById("apr").value=localStorage.apr;
        document.getElementById("years").value=localStorage.years;
        document.getElementById("zipcode").value=localStorage.zipcode;
        calculate();
    }
}


function drowGraph(principal,interest,monthly,payments) {
    var graph=document.getElementById('graph');
    graph.width=graph.width;//clear graph
    if(arguments.length==0 || !graph.getContext)
        return;
    var context=graph.getContext('2d');
    var width=graph.width;
    var height=graph.height;
    drowInterestPayments();
    drowEquity();
    drowBalance();
    setMarkersX();
    setMarkersY();


    function drowInterestPayments() {
        context.moveTo(paymentToX(0),amountToY(0));
        context.lineTo(paymentToX(payments),amountToY(monthly*payments));
        context.lineTo(paymentToX(payments),amountToY(0));
        context.closePath();
        context.fillStyle='#f88';
        context.fill();
        context.font='bold 12px san-serif';
        context.fillText('Total Interest Payments',20,20);
    }

    function drowEquity() {
        var equity=0;
        context.beginPath();
        context.moveTo(paymentToX(0),amountToY(0));
        for(var i=1;i<payments;i++){
            var thisMonthInterest=(principal-equity)*interest;
            equity+=(monthly-thisMonthInterest);
            context.lineTo(paymentToX(i),amountToY(equity));
        }
        context.lineTo(paymentToX(payments),amountToY(0));
        context.closePath();
        context.fillStyle='green';
        context.fill();
        context.fillText('Total Equity',20,35);
    }


    function drowBalance() {
        var balance=principal;
        context.beginPath();
        context.moveTo(paymentToX(0),amountToY(balance));
        for(var i=0;i<payments;i++){
            var thisMonthInterest=balance * interest;
            balance-=(monthly-thisMonthInterest);
            context.lineTo(paymentToX(i),amountToY(balance));
        }
        context.lineWidth=3;
        context.stroke();
        context.fillStyle='black';
        context.fillText('Loan Balance',20,50);
    }

    function setMarkersX() {
        context.textAlign='center';
        var y=amountToY(0);
        for(var year=1;year*12<=payments;year++){
            var x= paymentToX(year*12);
            context.fillRect(x-0.5,y-3,1,3);
            if(year==1)
                context.fillText('Year',x,y-5);
            if(year%5==0 && year*12!=payments)
                context.fillText(String(year),x,y-5);

        }
    }


    function setMarkersY() {
        context.textAlign='right';
        context.textBaseline='middle';
        var ticks=[monthly*payments,principal];
        var rightEdge=paymentToX(payments);
        for(var i=0;i<ticks.length;i++){
            var y=amountToY(ticks[i]);
            context.fillRect(rightEdge-3,y-0.5,3,1);
            context.fillText(String(ticks[i].toFixed(0)),rightEdge-5,y);
        }
    }


    function paymentToX(value) {
        return value * width / payments;
    }


    function amountToY(value) {
        return height-(value*height/(monthly * payments * 1.05));
    }
}



function getLanders() {
    if(!window.XMLHttpRequest)
        return;
    var links=document.getElementById('landers');
    if(!links)
        return;
    var request=new XMLHttpRequest();
    request.open('GET','landers.json');
    request.onreadystatechange=function () {
        if(request.status==200 && request.readyState==4){
            var response=request.responseText;
            var landers=JSON.parse(response);
            var list='';
            for(var i=0;i<landers.length;i++)
                list+='<li><a href="'+landers[i].url+'">'+landers[i].name+'</a></li>';
            links.innerHTML='<ul>'+list+'</ul>'
        }
    }
    request.send();
}