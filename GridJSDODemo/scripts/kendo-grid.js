$(document).ready(function () {
    var dataSource = {
        type: "jsdo",
        transport: {
            config: {
                serviceURI: "http://oemobiledemo.progress.com/CustomerService",
                catalogURI: "http://oemobiledemo.progress.com/CustomerService/static/mobile/CustomerService.json",
                resourceName: "Customer"
            }
        }
    };

    $("#grid").kendoGrid({
        dataSource: dataSource,
        sortable: true,
        filterable: true,
        pageable: {
            refresh: true,
            pageSizes: true,
            page: 1,
            pageSize: 10,
            buttonCount: 5
        },
        editable: "inline",
        selectable: "multiple, row",
        columns: [
            { field: "CustNum", title: "No", type: "int", width: "50px" },
            { field: "Name" },
            { field: "State" },
            { field: "Country" },
            { command: ["edit", "destroy"], title: "&nbsp;", width: "250px" }
        ],
        toolbar: ["pdf", { name: "create", text: "Add" }],
        pdf: {
            allPages: true,
            fileName: "CustomerListExport.pdf"
        },
    });
});