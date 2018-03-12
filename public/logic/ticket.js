

var types = [{
    "value": 1,
    "text": "FACTURA"
}, {
    "value": 2,
    "text": "ACTA"
}, {
    "value": 3,
    "text": "GUÍA DE REMISIÓN"
}, {
    "value": 4,
    "text": "OTRO"
}];

var states = [{
    "value": 0,
    "text": "ABIERTA"
}, {
    "value": 1,
    "text": "CERRADA"
}];



kendo.culture("es-ES");
$(document).ready(function () {

    dataSourceCombo = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/provider/read",
                dataType: "json"
            }
        }
    });

    function userNameComboBoxEditor(container, options) {
        $('<input required data-bind="value:' + options.field + '"/>')
            .appendTo(container)
            .kendoComboBox({
                dataSource: dataSourceCombo,
                dataTextField: "name",
                dataValueField: "id",
                filter: "contains",
                minLength: 1
            });
    }

    dataSource = new kendo.data.DataSource({
        transport: {
            read: { url: "/labels/read", type: 'GET', dataType: "json" },
            update: { url: "/bill/update", type: "POST", dataType: "json" },
            destroy: { url: "/bill/delete", type: "POST", dataType: "json" },
            create: { url: "/bill/create", type: "POST", dataType: "json" },
            parameterMap: function (options, operation) {
                if (operation !== "read" && options.models) {
                    var datos = options.models[0]
                    return datos;
                }
            }
        },
        batch: true,
        pageSize: 1000,
        serverFiltering: false,
        
        requestEnd: function (e) {
            if (e.type != "read") {
                // refresh the grid
                e.sender.read();
            }
        },
        schema: {
            model: {
                id: "id",
                fields: {
                    id: { editable: false },
                    code2: { validation: { required: true, }, type: 'string' },
                    description: { validation: { required: true, }, type: 'string' },
                    fdr: { validation: { required: true, }, type: 'string' },
                    cso: { validation: { required: true, }, type: 'string' },
                    wbs: { validation: { required: true, }, type: 'string' },
                    area: { validation: { required: true, }, type: 'string' },
                    contrato: { validation: { required: true, }, type: 'string' },
                    date: { validation: { required: true, }, type: 'date' },
                    cant: { validation: { required: true, }, type: 'number' },
                 
                }
            }
        }
    },
    );

    var wnd,
        detailsTemplate;

    var socket = io.connect();
    socket.emit('getProvider', function (providers) {


        $.get("/user/read2", function (users) {


            $("#grid").kendoGrid({
                dataSource: dataSource,
                height: 475,
                filterable: true,
                groupable: false,
                resizable: true,

                pageable: { refresh: true, pageSizes: true, },
                toolbar: ['excel'],
                pdf: {
                    allPages: true,
                    avoidLinks: false,
                    paperSize: "A4",
                    margin: { top: "3.5cm", left: "1cm", right: "1cm", bottom: "2cm" },
                    landscape: true,
                    repeatHeaders: true,
                    template: $("#page-template").html(),
                    scale: 0.8
                },
                pdfExport: function (e) {
                    var grid = $("#grid").data("kendoGrid");
                    grid.hideColumn(6);

                    e.promise
                        .done(function () {
                            grid.showColumn(6);
                        });
                },
                columns: [
                  
                    { field: "code2", title: "Código", filterable: { search: true, multi: true } },
                    { field: "description", title: "Nombre", filterable: { search: true, multi: true } },
                    { field: "barcode", title: "No. de Serie", filterable: { search: true, multi: true } },
                    { field: "location2", title: "Ubicación", filterable: { search: true, multi: true } },
                    { field: "cant", title: "Cantidad", filterable: { search: true} },
                    { field: "numero", title: "Acta", filterable: { search: true, multi: true } },],
                editable: "popup"
            });

        });



    })

    function buttonClickHandler(e) {
        kendoConsole.log(e.target.text() + " 'click' event is fired.");
    }



});
