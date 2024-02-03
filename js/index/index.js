/**
 * Created by socia on 1/6/2024.
 */
$(document).ready(function () {
    let oreGiornoLav = 30
    let step = 10

    let minOreTurno = 2


    function creaza_griglia() {

        var griglia = $('<div \>', {
            class: 'full-dashed-grid ',
        }).width(40 * oreGiornoLav)
        for (let i = 0; i < oreGiornoLav; i++) {
            let strI = (i < 24) ? i : i % 24
            $('<span \>', {
                class: 'juma',
                text: strI
            }).appendTo(griglia)
        }
        return griglia
    }


    function init_container(initData,dataInizio,dataFine) {
        let lungime = step * minOreTurno * 4;
        let dateFornite = true
        let stanga = 0
        console.log(lungime)
        if (isNaN(new Date(initData).getTime())){
            let tmp=new Date()
            initData = tmp.getUTCFullYear()+"-"+putZero(tmp.getUTCMonth()+1)+"-"+putZero(tmp.getUTCDate())

        }

        console.log(initData)
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
        let form = $('<form \>', {class: "mx-auto"}).appendTo('body');
        form.width(4 * step * oreGiornoLav)
        //fine creaza form


        //container dentro la form
        let mainContainer = $('<div \>',
            {
                class: "row justify-content-center "
            }
        ).appendTo(form);
        //-------------------------

        //let col0 = $('<div \>',{class: "col"}).appendTo(mainContainer)
        let giorno = $('<input \>',
            {
                class: 'form-control',value:initData
            }
        ).appendTo($('<div \>', {class: "col-2 align-self-start"}).appendTo(mainContainer));


        //-----col1----------------
        let col1 = $('<div \>', {class: "col-2 "}).appendTo(mainContainer)
        let nome = $('<input \>', {type: "text", class: 'form-control'}).appendTo(col1);



        //-----col2----------------
        let col2 = $('<div \>',
            {
                class: "col-3"
            }).appendTo(mainContainer)
        let inizio = $('<input \>',
            {
                class: 'form-control disabled',
                type: "text", readonly:"readonly",
                disabled:"disabled"}
            ).appendTo(col2);

        //-----col3----------------
        let col3 = $('<div \>', {class: "col-2"}).appendTo(mainContainer)
        let fine = $('<input \>', {class: 'form-control ', type: "text", readonly:"readonly", disabled:"disabled"}).appendTo(col3);
        //-----fine col3 ----------


        //-----col4----------------

        let col4 = $('<div \>', {class: "col-1"}).appendTo(mainContainer)
        let closeBtn = $('<button\>', {class: "btn-close"}).appendTo(col4)
        closeBtn.on("click", function () {
            form.remove()
        })

        //-----fine col4-----------
        let container = $('<div />', {class: "col-12"}).appendTo(mainContainer);

        let dashed = $('<div />', {class: "dashed-grid "});

        //set turno


        var turno = $('<div \>', {
            class: 'selector',

        });

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
                    inizio.val(getDate(giorno,parseFloat($(this).attr("data-inizio"))))
                    fine.val(getDate(giorno,parseFloat($(this).attr("data-fine"))))
                    nome.val(strToTime(lungime))

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
                // inizio.val($(this).attr("data-inizio"))
                // fine.val($(this).attr("data-fine"))
                inizio.val(getDate(giorno,parseFloat($(this).attr("data-inizio"))))
                fine.val(getDate(giorno,parseFloat($(this).attr("data-fine"))))
                nome.val(strToTime(lungime))
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
        let rooler = creaza_griglia()
        rooler.appendTo(container)
        dashed.appendTo(container)

        let subm = $('<input \>', {
            class: 'btn',
            type: "submit",
            value: "incarca"
        }).appendTo($('<div \>', {class: "col-12"}).appendTo(mainContainer))
    }
    function populateTurnoValues(object, start, end,tName,zi){
        start.val(getDate(zi,parseFloat(object.attr("data-inizio"))))
        end.val(getDate(zi,parseFloat(object.attr("data-fine"))))
        tName.val(strToTime(object.attr("data-lungime")))
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
        init_container();
    });
    init_container("1980-10-03","1980-10-03 06:30","1980-10-03 10:15")
        //
});
