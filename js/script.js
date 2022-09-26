window.addEventListener('scroll', reveal);

function reveal(){
    var reveals = document.querySelectorAll('.reveal');

    for(var i = 0; i < reveals.length; i++){

        var windowheight = window.innerHeight;
        var revealtop = reveals[i].getBoundingClientRect().top;
        var revealpoint = 150;

        if(revealtop < windowheight - revealpoint){
          reveals[i].classList.add('reveal-block');
        }
        else{
          reveals[i].classList.remove('reveal-block');
        }
    }
}


var locale = 'en-US';
var options = {style: 'currency', currency: 'usd', minimumFractionDigits: 0, maximumFractionDigits: 2};
var formatter = new Intl.NumberFormat(locale, options);

$( document ).ready(function() {
    $.getJSON('https://api.betcoinscan.com/',function(data){

        $('.netreturn').html(formatter.format(data.stats.netresult));
        $('.totalwon').html(formatter.format(data.stats.profit));
        $('.totallost').html(formatter.format(data.stats.loss));
        $('.wonamount').html(data.stats.won);
        $('.lostamount').html(data.stats.lost);
        $('.pushamount').html(data.stats.push);
        $('.winrate').html(data.stats.winrate+'%');

        for(b in data.bets){
            var bet = data.bets[b];

            var classn='won';
            var text='Won';
            if(bet.Won==0){
                var classn='lost';
                var text='Lost';
            }

            if(typeof(bet['Livescore'])!=='undefined' && bet['Livescore']!==''){
                var classn='';
                var text='<a href="'+bet['Livescore']+'" target="_blank" class="espn"></a>';
            }

            var betHTML = '<tr>' +
                '<td>'+bet.Date+'</td>' +
                    '<td>'+bet.League+'</td>' +
                    '<td class="pick-of-the-day">' +
                    '<span class="bet"><a href="'+bet['Link']+'" target="_blank">'+bet['Pick of the day']+'</a></span>' +
                    '<span class="dd">'+bet['Game']+'</span>' +
                    '</td>' +
                    '<td>'+bet.Dime+'</td>' +
                    '<td>'+formatter.format(bet.Allocation.replace(',',''))+'</td>' +
                    '<td>'+formatter.format(bet['Net Return'].replace(',',''))+'</td>' +
                    '<td>'+bet.Odds+'</td>' +
                    '<td class="'+classn+'">'+text+'</td>' +
                '</tr>';
            $('.betlist').append(betHTML);

        }
    });
});