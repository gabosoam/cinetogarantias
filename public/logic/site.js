var roles = [{
    "value": 1,
    "text": "Usuario"
}, {
    "value": 2,
    "text": "Administrador"
}];



kendo.culture("es-ES");
$(document).ready(function () {

 

    dataSource = new kendo.data.DataSource({
        transport: {
            read: { url: "/site/read", dataType: "json" },
            update: { url: "/site/update", type: "POST", dataType: "json" },
            destroy: { url: "/site/delete", type: "POST", dataType: "json" },
            create: { url: "/site/create", type: "POST", dataType: "json" },
            parameterMap: function (options, operation) {
                if (operation !== "read" && options.models) {
                    var datos = options.models[0]
                    return datos;
                }
            }
        },
        batch: true,
        pageSize: 10,
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
                    siteasigned: { validation: { required: false, }, type: 'string' },
                    name: { validation: { required: true, }, type: 'string' }
                }
            }
        }
    },
    );

    $("#grid").kendoGrid({
        dataSource: dataSource,
        height: 475,
        filterable: true,
        resizable: true,
        pageable: { refresh: true, pageSizes: true, },
        toolbar: ['create','excel'],
        excel: {
            allPages: true
        },
        columns: [
            { field: "siteasigned", title: "Sitio asignado", filterable: { search: true, multi:true } },
            { field: "name", title: "Nombre sitio", filterable: { search: true, multi:true } },
            { command: ["edit", "destroy"], title: "Acciones" }],
        editable: "inline"
    });
});
function redirect(category) {
    window.location.href = category;
}
