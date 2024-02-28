/**
 * Created by socia on 1/6/2024.
 */
$(document).ready(function () {
    let oreGiornoLav = 31
    let step = 7
    let minOreTurno = 2
    let doc_width = 900
    let laterali= parseInt(doc_width/3)
    let width_griglia = parseInt(doc_width-2*laterali)

    function init_display() {
            if(window.innerWidth > doc_width){
                doc_width = window.innerWidth
                laterali= parseInt(doc_width/10)
                width_griglia = parseInt(doc_width-2*laterali)
                step=parseInt(width_griglia/(oreGiornoLav*4))
            }

    }

    init_display()


    let css_grid_main = {
        'display':'grid',
        'grid-template-columns': laterali+'px '+ oreGiornoLav*4*step+'px '+1.5*laterali+'px'
    }

    let css_mezzo_lat = {
        'width': parseInt(laterali/2)+'px'
    }

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
    let input_width = {
        'width': '110px'
    }

    function creaza_griglia(lineare) {
        let header_div = $('<div \>').css(css_grid_main).appendTo(lineare.container)
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


    function crea_riga(lineare,dataInizio,dataFine) {
        let lungime = step * minOreTurno * 4;
        let dateFornite = true
        let stanga = 0

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
        let dif=new Date(dataInizio+" UTC")-new Date(lineare.data+" UTC")
        if (dateFornite){
            stanga = parseFloat(dif/(1000*3600))
        }

        //creaza form
        let form = $('<div \>',{'class':'riga-lineare'}).appendTo(lineare.container);
        //fine creaza form


        //container dentro la form
        let mainContainer = $('<div \>').css(css_grid_main).appendTo(form);
        //-------------------------

        let col0 = $('<div \>').appendTo(mainContainer)
        // let giorno = $('<input \>', {
        //     value:lineare.data,
        //     class: 'form-control',
        //     type: "text"
        // }).css(input_width).appendTo(col0);


        //-----col1----------------

        let nome = $('<input \>', {
            class: 'form-control disabled',
            type: "text", readonly:"readonly",
            disabled:"disabled"
        }).css(input_width).appendTo(col0);


        let col1 = $('<div \>').css({
            'width': width_griglia+"px"
        }).appendTo(mainContainer)
        //-----col2----------------
        let col2 = $('<div \>').appendTo(mainContainer)
        let inizio = $('<input \>',
            {
                class: 'form-control disabled',
                type: "text", readonly:"readonly",
                disabled:"disabled"}
            ).css(input_width).appendTo(col2);

        //-----col3----------------
        // let col3 = $('<div \>', {class: "col-2"}).appendTo(mainContainer)
        let fine = $('<input \>',
            {
                type: "text",
                readonly:"readonly",
                disabled:"disabled"}).css(input_width).appendTo(col2);
        //-----fine col3 ----------


        //-----col4----------------

        // let col4 = $('<div \>', {class: "col-1"}).appendTo(mainContainer)
        let closeBtn = $('<button\>', {class: "btn-close"}).appendTo(col2)
        closeBtn.on("click", function () {
            form.remove()
        })

        //-----fine col4-----------

        let dashed = $('<div />').css(css_dashed)

        //set turno


        var turno = $('<div \>').css(css_turno);

        function setTurnoValues( stanga,lungime){
            turno.offset({left:stanga*step*4})
            turno.attr('data-inizio', stanga)
            turno.width(lungime);
            turno.height(step);
            turno.attr('data-lungime', lungime/ (4 * step));
            turno.attr('data-fine', stanga+parseFloat(lungime/ (4 * step)));

            inizio.val(getDate(lineare.data,parseFloat(turno.attr("data-inizio"))))
            fine.val(getDate(lineare.data,parseFloat(turno.attr("data-fine"))))



            nome.val(strToTime(lungime/(4 * step)))
        }

        turno.resizable(
            {
                handles: "w,e",
                grid: [step],
                // maxWidth: 9 * 4 * step,
                minWidth: step,
                containment: "parent",
                resize: function (event, ui) {

                    $(this).attr("data-inizio", ui.position.left / (4 * step))
                    lungime = parseFloat(ui.size.width / (4 * step));
                    $(this).attr("data-fine",
                        parseFloat((ui.position.left) / (4 * step) + lungime)
                    )
                    $(this).attr("data-lungime", lungime)
                    populateTurnoValues($(this),inizio,fine,nome,lineare.data)


                }
            }
        )
        turno.draggable(
            {
            axis: "x",
            grid: [step],
            containment: "parent",
            drag: function (event, ui) {

                $(this).attr("data-inizio", ui.position.left / (4 * step))
                $(this).attr("data-fine",
                    parseFloat(ui.position.left / (4 * step) +parseFloat($(this).attr("data-lungime")))
                )
                populateTurnoValues($(this), inizio, fine, nome, lineare.data)

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
        let tmp = ""
        if(zi>0) tmp=tmp+putZero(zi)+":"

        return tmp + putZero(ore_str) + ":" + putZero(minuti_str)
    }

    function getDate(giorno, valoare){
        valoare = parseFloat(valoare) * 60*60*1000
        let myDate = new Date(giorno+"Z")

        myDate.setMilliseconds(valoare)

        // myDate.setMinutes(myDate.getMinutes()+minuti)
        let tmpDate=myDate.getUTCFullYear()+ "-"+
            putZero(myDate.getUTCMonth()+1)+ "-"+
            putZero(myDate.getUTCDate())+"T"+
            putZero(myDate.getUTCHours())+":"+putZero(myDate.getUTCMinutes())
        return tmpDate

    }

    class Lineare{
        constructor(data,parent){
            if (isNaN(new Date(data).getTime())){
                let tmp=new Date()
                data = tmp.getUTCFullYear()+"-"+putZero(tmp.getUTCMonth()+1)+"-"+putZero(tmp.getUTCDate())

            }
            this.data=data
            this.container=$('<div \>',{'class':'lineare'}).appendTo(parent)
            this.giorno = $('<input \>', {
                value:this.data,
                class: 'form-control',
                type: "text"
            }).css(input_width).appendTo(this.container);
            // this.giorno.datepicker({
            //     dateFormat: "yy-mm-dd",
            //     onSelect: function(dateText, inst) {
            //         this.data=dateText
            //         //populateTurnoValues(turno,inizio,fine,nome,giorno)
            //     }
            // })
        }
        getRighe(){
            return this.container.children('.riga-lineare')
        }
    }
    let lineare = new Lineare("1980-10-03","body")
    $('#btn').on("click", function () {
        crea_riga(lineare)
    })
    creaza_griglia(lineare)
    crea_riga(lineare,"1980-10-03 06:30","1980-10-03 10:15")
    crea_riga(lineare,"1980-10-03 06:30","1980-10-03 10:15")
    crea_riga(lineare/*,"1980-10-03 06:30","1980-10-03 10:15"*/)
    crea_riga(lineare/*,"1980-10-03 06:30","1980-10-03 10:15"*/)
    crea_riga(lineare/*,"1980-10-03 06:30","1980-10-03 10:15"*/)
    console.log(lineare.getRighe())

});
