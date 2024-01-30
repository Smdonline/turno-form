/**
 * Created by socia on 1/6/2024.
 */
$(document).ready(function () {
    let oreGiornoLav = 30
    let step = 10

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


    function init_container(initData) {
        if (isNaN(new Date(initData).getTime())){
            let tmp=new Date()
            initData = tmp.getUTCFullYear()+"-"+putZero(tmp.getUTCMonth()+1)+"-"+putZero(tmp.getUTCDate())
            console.log(initData)
        }
        //creaza form
        form = $('<form \>', {class: "mx-auto"}).appendTo('body');
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
                type: "date", class: 'form-control',value:initData
            }
        ).appendTo($('<div \>', {class: "col-3 align-self-start"}).appendTo(mainContainer));
        giorno.datepicker({
            dateFormat: "yy-mm-dd"
        })
        //-----col1----------------
        let col1 = $('<div \>', {class: "col-3 "}).appendTo(mainContainer)
        let nome = $('<input \>', {type: "text", class: 'form-control'}).appendTo(col1);



        //-----col2----------------
        let col2 = $('<div \>', {class: "col-3"}).appendTo(mainContainer)
        let inizio = $('<input \>', {class: 'form-control disabled', type: "text", readonly:"readonly",disabled:"disabled"}).appendTo(col2);
        //-----col3----------------
        let col3 = $('<div \>', {class: "col-3"}).appendTo(mainContainer)
        let fine = $('<input \>', {class: 'form-control ', type: "text", readonly:"readonly", disabled:"disabled"}).appendTo(col3);

        let container = $('<div />', {class: "col-12"}).appendTo(mainContainer);

        let dashed = $('<div />', {class: "dashed-grid "});
        dashed.on('dblclick', function () {
            if ($(this).children().length == 0) {

                var lungime = step * 8;
                var turno = $('<div \>', {
                    class: 'selector',

                });
                turno.offset({left:40})
                turno.attr('data-inizio', 0)


                turno.width(lungime);
                turno.height(step);
                lungime = lungime / (4 * step);
                turno.attr('data-fine', lungime);
                turno.attr('data-lungime', lungime);
                inizio.val(getDate(giorno,strToTime(parseFloat(turno.attr("data-inizio")))))
                fine.val(getDate(giorno,strToTime(parseFloat(turno.attr("data-fine")))))
                nome.val(strToTime(lungime))
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
                        inizio.val($(this).attr("data-inizio"))
                        fine.val($(this).attr("data-fine"))
                        inizio.val(getDate(giorno,parseFloat($(this).attr("data-inizio"))))
                        fine.val(getDate(giorno,parseFloat($(this).attr("data-fine"))))
                        nome.val(strToTime(lungime))
                    }

                })

                turno.appendTo(dashed);
            }
            else {
                alert("este deja un turno");
            }

        })
        // dashed.trigger('dblclick')
        let rooler = creaza_griglia()
        rooler.appendTo(container)
        console.log(rooler.width())
        console.log(dashed.width())
        dashed.appendTo(container)

        let subm = $('<input \>', {
            class: 'btn',
            type: "submit",
            value: "incarca"
        }).appendTo($('<div \>', {class: "col-12"}).appendTo(mainContainer))
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

    function getDate(giorno,valoare){
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
        init_container("1980-10-32");
    });
    init_container("1980-10-33")

});
