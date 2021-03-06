

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

    dataSourceComboSites = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/site/read2",
                dataType: "json"
            }
        }
    });




    function userNameComboBoxEditor(container, options) {
        $('<input required data-bind="value:' + options.field + '"/>')
            .appendTo(container)
            .kendoComboBox({
                dataSource: dataSourceCombo,
                dataTextField: "company",
                dataValueField: "id",
                filter: "contains",
                minLength: 1
            });
    }

    function userNameComboBoxEditorSites(container, options) {
        $('<input required data-bind="value:' + options.field + '"/>')
            .appendTo(container)
            .kendoComboBox({
                dataSource: dataSourceComboSites,
                dataTextField: "text",
                dataValueField: "value",
                filter: "contains",
                minLength: 1
            });
    }

    dataSource = new kendo.data.DataSource({
        transport: {
            read: { url: "/bill/read", type: 'POST', dataType: "json" },
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
                    codigo: { editable: false },
                    provider: { validation: { required: true, size: 13 }, type: 'string' },
                    document: { validation: { required: true, size: 13 }, type: 'string' },
                    site: { validation: { required: true, size: 50 }, type: 'string' },
                    contract: { validation: { required: true, size: 50 }, type: 'string' },
                    date: { validation: { required: true, }, type: 'date' },
                    datestart: { validation: { required: false, }, type: 'date' },
                    dateend: { validation: { required: false, }, type: 'date' },
                    reference: { validation: { required: true, }, type: 'string' },
                    user: { type: 'string', defaultValue: user, editable: false, visible: false },
                    state: { type: 'string', editable: false }
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

            $.get("/site/read2", function (sites) {


                $("#grid").kendoGrid({
                    dataSource: dataSource,
                    height: 475,
                    filterable: true,
                    groupable: true,
                    resizable: true,

                    pageable: { refresh: true, pageSizes: true, },
                    toolbar: ['create', 'excel'],
                    excel: {
                        allPages: true
                    },
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

                        { field: "codigo", title: "Ingreso", filterable: { search: true, multi: true } },
                        { field: "date", title: "Fecha", filterable: { search: true, search: true }, format: "{0:dd/MM/yyyy}" },
                        { field: "provider", values: providers, editor: userNameComboBoxEditor, title: "Cliente", filterable: { multi: true, search: true } },

                        { field: "document", values: types, title: "Tipo documento", filterable: { multi: true, search: true, search: true } },
                        { field: "reference", title: "Referencia", filterable: { multi: true, search: true } },
                        { field: "contract", title: "Contrato", filterable: { search: true, multi: true } },
                        { field: "site", values:sites, title: "Sitio", editor: userNameComboBoxEditorSites, filterable: { search: true, multi: true } },
                        { field: "datestart", title: "Fecha Inicio garantía", filterable: { search: true, search: true }, format: "{0:dd/MM/yyyy}" },
                        { field: "dateend", title: "Fecha fín garantía", filterable: { multi: false, search: true }, format: "{0:dd/MM/yyyy}" },
                        { field: "user", values: users, title: "Creado por", filterable: { multi: true, search: true } },
                        { field: "state", values: states, title: "Estado", filterable: { multi: true, search: true } },

                        { command: ["edit", "destroy", { text: "Ver detalles", click: showDetails, iconClass: 'icon icon-chart-column' }], title: "Acciones" }],
                    editable: "popup"
                });

            });


        })
    })

    function showDetails(e) {
        e.preventDefault();
        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        location.href = "/bill/" + dataItem.id;
    }



});
