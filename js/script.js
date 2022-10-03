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

var options = {minimumFractionDigits: 0, maximumFractionDigits: 2};
var formatter2 = new Intl.NumberFormat(locale, options);

var options = {style: 'currency', currency: 'usd', minimumFractionDigits: 0, maximumFractionDigits: 0};
var formatter = new Intl.NumberFormat(locale, options);

var options = {minimumFractionDigits: 0, maximumFractionDigits: 5};
var tokenprice = new Intl.NumberFormat(locale, options);
var currentprice = 0;

$( document ).ready(function() {
    if(typeof(localStorage.getItem("holdings"))!=='undefined') $("input.holdings").val(localStorage.getItem("holdings"))
    getPickOfTheDay();

    $.getJSON('https://api.betcoinscan.com/buyback.php',function(data){
        currentprice=data.price;
        if(typeof(localStorage.getItem("holdings"))!=='undefined') {
            $('.networth').html('$'+formatter2.format(currentprice*localStorage.getItem("holdings")));
        }

        var buybacktotal = new Intl.NumberFormat(locale, {minimumFractionDigits: 0, maximumFractionDigits: 0});
        $('.buybacktotal').html('<i class="bet"></i>'+buybacktotal.format(data.buyback))
        $('.betprice').html(tokenprice.format(data.price))
        $('.marketcap').html(formatter.format(data.price*100000000))

        if(data.change.substr(0,1)=='-') {
            $('.pricechange').html('<span class="down">' + data.change + '</span>');
        }else{
            $('.pricechange').html('<span class="up">' + data.change + '</span>');
        }

        $('.buybackpercentage').html(formatter2.format(data.percentage)+'%');
        $('.buybackvalue').html(formatter.format(data.value));

    });
});

function getPickOfTheDay(){
    $('.betlist').html('');
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
            var date = new Date((bet.TimestampUTC*1000)).toLocaleDateString();
            var time = new Date((bet.TimestampUTC*1000)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            var classn='won';
            var text='Won';
            if(bet.Won==0){
                var classn='lost';
                var text='Lost';
            }
            if (typeof (bet['Livescore']) !== 'undefined' && bet['Livescore'] !== '') {
                if (typeof (bet['Finished']) == 'undefined' || bet['Finished'] == '' || bet['Finished'] == '0') {
                    classn = '';
                    text = '<a href="' + bet['Livescore'] + '" target="_blank" class="espn"></a>';
                } else {
                    text = '<a href="' + bet['Livescore'] + '" target="_blank">' + text + '</a>';
                }
            }

            var betHTML = '<tr>' +
                '<td>'+date+' '+time+'</td>' +
                '<td>'+bet.League+'</td>' +
                '<td class="pick-of-the-day">' +
                '<span class="bet"><a href="'+bet['Link']+'" target="_blank">'+bet['Pick of the day']+'</a></span>' +
                '<span class="dd">'+bet['Game']+'</span>' +
                '</td>' +
                '<td>'+bet.Dime+'</td>' +
                '<td>'+formatter.format(bet.Allocation)+'</td>' +
                '<td>'+formatter.format(bet['Net Return'])+'</td>' +
                '<td>'+bet.Odds+'</td>' +
                '<td class="'+classn+'">'+text+'</td>' +
                '</tr>';
            $('.betlist.bet1').append(betHTML);

        }
    });
}

function getCommunityBets(){
    $('.betlist').html('');
    $.getJSON('https://api.betcoinscan.com/community.php',function(data){

        /*$('.netreturn').html(formatter.format(data.stats.netresult));
        $('.totalwon').html(formatter.format(data.stats.profit));
        $('.totallost').html(formatter.format(data.stats.loss));
        $('.wonamount').html(data.stats.won);
        $('.lostamount').html(data.stats.lost);
        $('.pushamount').html(data.stats.push);
        $('.winrate').html(data.stats.winrate+'%');
*/
        for(b in data.bets){
            var bet = data.bets[b];
            var date = new Date((bet.TimestampUTC*1000)).toLocaleDateString();
            var time = new Date((bet.TimestampUTC*1000)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            if(bet.Won==1) {
                var classn = 'won';
                var text = 'Won';
                if (bet.Won == 0) {
                    var classn = 'lost';
                    var text = 'Lost';
                }

                if (typeof (bet['Livescore']) !== 'undefined' && bet['Livescore'] !== '') {
                    if (typeof (bet['Finished']) == 'undefined' || bet['Finished'] == '' || bet['Finished'] == '0') {
                        classn = '';
                        text = '<a href="' + bet['Livescore'] + '" target="_blank" class="espn"></a>';
                    } else {
                        text = '<a href="' + bet['Livescore'] + '" target="_blank">' + text + '</a>';
                    }
                }

                var betHTML = '<tr>' +
                    '<td>'+date+' '+time+'</td>' +
                    '<td>' + bet.League + '</td>' +
                    '<td class="pick-of-the-day">' +
                    '<span class="bet"><a href="' + bet['Link'] + '" target="_blank">' + bet['Pick of the day'] + '</a></span>' +
                    '<span class="dd">' + bet['Game'] + '</span>' +
                    '</td>' +
                    '<td>' + bet.Dime + '</td>' +
                    '<td>' + formatter.format(bet.Allocation) + '</td>' +
                    '<td>' + formatter.format(bet['Net Return']) + '</td>' +
                    '<td>' + bet.Odds + '</td>' +
                    '<td class="' + classn + '">' + text + '</td>' +
                    '</tr>';
                $('.betlist.bet2').append(betHTML);
            }

        }
    });
}
function showTab(which){

    if(which==1) getPickOfTheDay();
    else if(which==2) getCommunityBets();
    $('a.tab').removeClass('active');
    $('a.tab'+which).addClass('active');

    $('div.table').hide();
    $('div.table'+which).show();
}

function saveHoldings(){
    localStorage.setItem("holdings", $("input.holdings").val().replace(',',''));
    $('.networth').html('$'+formatter2.format(currentprice*localStorage.getItem("holdings")));
}