/**
 * Created by socia on 1/6/2024.
 */
$(document).ready(function () {
    let oreGiornoLav = 30
    let step = 10
    let minOreTurno = 2
    let css_dashed = {
        'min-height':'1.3em',
        'max-width':(oreGiornoLav*4*step)+"px",
        'padding-top' : '0.3em',
        'background-size' : 2*step+'px 35px',
        'background-repeat' : 'repeat-x',
        'background-image' :    'linear-gradient(to right, black 1px, transparent 1px)' +
        ',linear-gradient(to bottom, black 1px, transparent 1px)' +
        ',linear-gradient(to right, transparent 1px, rgba(204, 199, 178, 0.5) 1px)',
        'border-right':'1px solid black'
    }
    let css_juma={'padding-left': '2px',
        'width': (step*4)+'px',
        'height': '1em',
        'font-size': '0.8em',
        'text-align': 'left',
        'display': 'inline-block'

    }
    let css_turno = {
        'min-height': '1em',
        'background-color': 'darkred',
        'background-image': 'linear-gradient(to right, #070003, #1d2923, #070003)',
        'color':'white',
        'display': 'inline-block'
    }
    let css_full_dashed_grid = {
        'height': '1.2em',
        'padding-top': '-1px',
        'max-width' : (4*step * oreGiornoLav)+'px',
        'background-color' : 'transparent',
        'background-size' : 4*step+'px 35px',
        'background-repeat' : 'repeat-x',
        'background-image' : 'linear-gradient(to right, black 1px, transparent 1px),' +
                            'linear-gradient(to bottom, black 1px, transparent 1px),' +
                            'linear-gradient(to right, transparent 1px, rgba(204, 199, 178, 0.5) 1px)',
        'display': 'flex'
    }


    function creaza_griglia() {
        let header_div = $('<div \>').css(
            {
                'display':'grid',
                'grid-template-columns': '400px '+ oreGiornoLav*4*step+"px 400px",
            }
        ).appendTo('body')
        $('<div \>').appendTo(header_div)

        var griglia = $('<div \>').css(css_full_dashed_grid)
        for (let i = 0; i < oreGiornoLav; i++) {
            let strI = (i < 24) ? i : i % 24
            $('<span \>', {
                text: strI
            }).css(css_juma).appendTo(griglia)
        }
        griglia.appendTo(header_div)
        $('<div \>').appendTo(header_div)

    }


    function crea_riga(initData,dataInizio,dataFine) {
        let lungime = step * minOreTurno * 4;
        let dateFornite = true
        let stanga = 0
        console.log(lungime)
        if (isNaN(new Date(initData).getTime())){
            let tmp=new Date()
            initData = tmp.getUTCFullYear()+"-"+putZero(tmp.getUTCMonth()+1)+"-"+putZero(tmp.getUTCDate())

        }
        if (isNaN(new Date(dataInizio).getTime())){
            let tmp1=new Date()
            dataInizio = tmp1.getUTCFullYear()+"-"+putZero(tmp1.getUTCMonth()+1)+"-"+putZero(tmp1.getUTCDate())
            dateFornite = false

        }
        else if (!isNaN(new Date(dataFine).getTime())){
            let dif = new Date(dataFine) - new Date(dataInizio)
            if (dif >= minOreTurno*3600*1000)
            {
                lungime = parseFloat(dif/(1000*3600))*step*4
            }


        }
        console.log(lungime)
        let dif=new Date(dataInizio+" UTC")-new Date(initData+" UTC")
        if (dateFornite){
            stanga = parseFloat(dif/(1000*3600))
        }

        //creaza form
        let form = $('<form \>', {class: ""}).appendTo('body');
        //fine creaza form


        //container dentro la form
        let mainContainer = $('<div \>',
            {
                class: "grid-container"
            }
        ).css(
            {   'display':'grid',
                'grid-template-columns': '400px '+ oreGiornoLav*4*step+'px 400px'
            }
        ).appendTo(form);
        //-------------------------

        let col0 = $('<div \>',{class: ""}).appendTo(mainContainer)
        let giorno = $('<input \>', {value:initData}).appendTo(col0);


        //-----col1----------------

        let nome = $('<input \>', {type: "text", class: 'form-control'}).appendTo(col0);


        let col1 = $('<div \>', {class: ""}).css({
            'min-width':oreGiornoLav*4*step+"px"
        }).appendTo(mainContainer)
        //-----col2----------------
        let col2 = $('<div \>',
            {
                class: ""
            }).appendTo(mainContainer)
        let inizio = $('<input \>',
            {
                class: 'form-control disabled',
                type: "text", readonly:"readonly",
                disabled:"disabled"}
            ).appendTo(col2);

        //-----col3----------------
        // let col3 = $('<div \>', {class: "col-2"}).appendTo(mainContainer)
        let fine = $('<input \>',
            {
                type: "text",
                readonly:"readonly",
                disabled:"disabled"}).appendTo(col2);
        //-----fine col3 ----------


        //-----col4----------------

        // let col4 = $('<div \>', {class: "col-1"}).appendTo(mainContainer)
        let closeBtn = $('<button\>', {class: "btn-close"}).appendTo(col2)
        closeBtn.on("click", function () {
            form.remove()
        })

        //-----fine col4-----------
        // let container = $('<div />', {class: "col-12"}).appendTo(mainContainer);

        let dashed = $('<div />').css(css_dashed)

        //set turno


        var turno = $('<div \>').css(css_turno);

        giorno.datepicker({
            dateFormat: "yy-mm-dd",
            onSelect: function(dateText, inst) {
                populateTurnoValues(turno,inizio,fine,nome,giorno)
            }
        })
        function setTurnoValues( stanga,lungime){
            turno.offset({left:stanga*step*4})
            turno.attr('data-inizio', stanga)
            turno.width(lungime);
            turno.height(step);
            turno.attr('data-fine', stanga+parseInt(lungime/(4*step)));
            turno.attr('data-lungime', lungime/ (4 * step));
            inizio.val(getDate(giorno,parseFloat(turno.attr("data-inizio"))))
            fine.val(getDate(giorno,parseFloat(turno.attr("data-fine"))))
            nome.val(strToTime(lungime/(4 * step)))
        }

        turno.resizable(
            {
                handles: "w,e",
                grid: [step],
                maxWidth: 9 * 4 * step,
                minWidth: step,
                containment: "parent",
                resize: function (event, ui) {

                    $(this).attr("data-inizio", ui.position.left / (4 * step))
                    lungime = parseFloat(ui.size.width / (4 * step));
                    $(this).attr("data-fine",
                        parseFloat((ui.position.left) / (4 * step) + lungime)
                    )
                    $(this).attr("data-lungime", lungime)
                    populateTurnoValues($(this),inizio,fine,nome,giorno)


                }
            }
        )
        turno.draggable({
            axis: "x",
            grid: [step],
            containment: "parent",
            drag: function (event, ui) {
                $(this).attr("data-inizio", ui.position.left / (4 * step))
                $(this).attr("data-fine", parseFloat((ui.position.left) / (4 * step) + lungime))
                populateTurnoValues($(this),inizio,fine,nome,giorno)

            }

        })

        if(dateFornite) {
            setTurnoValues(stanga,lungime)
            turno.appendTo(dashed);
        }
        //-----fine set turno----------------------------------------------------------------

        dashed.on('dblclick', function (e) {
            if ($(this).children().length == 0) {
                let rect = e.target.getBoundingClientRect()
                let aici = parseInt((e.clientX - rect.left)/(4*step))
                setTurnoValues(aici,lungime)


                turno.appendTo(dashed);

            }
            else {
                alert("este deja un turno");
            }

        })
        // dashed.trigger('dblclick')
        dashed.appendTo(col1)

        let subm = $('<input \>', {
            class: 'btn  btn-outline-primary btn-sm',
            type: "submit",
            value: "incarca"
        }).appendTo().appendTo(col2)
    }
    function populateTurnoValues(object, start, end,tName,zi){

        isNaN(object.attr("data-inizio")) || start.val(getDate(zi,parseFloat(object.attr("data-inizio"))))
        isNaN(object.attr("data-fine")) ||end.val(getDate(zi,parseFloat(object.attr("data-fine"))))
        isNaN(object.attr("data-lungime")) ||tName.val(strToTime(object.attr("data-lungime")))
    }
    function putZero(valoare) {
        valoare=parseInt(valoare)
        if ((valoare>=0)&&(valoare<10)){
            return "0"+valoare
        }
        return valoare
    }
    function strToTime(valoare) {
        valoare = parseFloat(valoare) * 60
        let zi = parseInt(valoare / (60 * 24))
        let ore = parseInt((valoare % (24 * 60)) / 60)
        let minuti = parseInt(valoare % 60)
        let ore_str = (ore > 9) ? "" + ore : "0" + ore
        let minuti_str = (minuti > 9) ? "" + minuti : "0" + minuti
        return putZero(zi) + ":" + putZero(ore_str) + ":" + putZero(minuti_str)
    }

    function getDate(giorno, valoare){
        valoare = parseFloat(valoare) * 60*60*1000
        let myDate = new Date(giorno.val()+"Z")

        myDate.setMilliseconds(valoare)

        // myDate.setMinutes(myDate.getMinutes()+minuti)
        let tmpDate=myDate.getUTCFullYear()+ "-"+
            putZero(myDate.getUTCMonth()+1)+ "-"+
            putZero(myDate.getUTCDate())+"T"+
            putZero(myDate.getUTCHours())+":"+putZero(myDate.getUTCMinutes())
        return tmpDate

    }

    $('#btn').on("click", function () {
        crea_riga()
    });
    creaza_griglia()
    crea_riga("1980-10-03","1980-10-03 06:30","1980-10-03 10:15")
        //
});
