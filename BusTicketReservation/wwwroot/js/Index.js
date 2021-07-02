function getScheduleDetails(obj) {
    var ScheduleID = obj.ScheduleID;
    $("#scheduleID").val(ScheduleID);
    $("#busSchedule").submit();
}

function RefreshReportData() {

    numberRenderer = $.fn.dataTable.render.number(',', '.', 2).display;
    var baseURL = "http://localhost:39402/";
    var travelDate = $("#TraveltDate").val();
    var myData = { 'getDate': travelDate };
    myData = JSON.stringify(myData);

    $.ajax({
        url: baseURL + "Home/getBusScheduleByDate",
        type: 'POST',
        cache: false,
        dataType: 'json',
        data: myData,
        contentType: 'application/json; charset=utf-8',

        success: function (data) {

            $("#load").hide(); 

            if ($.fn.dataTable.isDataTable('#DisplayBusReservation')) { $('#DisplayBusReservation').dataTable().fnDestroy(); }

            $("#DisplayBusReservation").append('<tfoot><th></th><th></th><th></th><th></th><th></th></tfoot>');
            var table = $('#DisplayBusReservation').DataTable({
                data: data,
                columns: [
                    { data: 'ScheduleID', title: "ID" },   
                    { data: 'Timing', title: "Timings" },                        //0
                    { data: 'BusNumber', title: "Bus Number" },                  //1
                    { data: 'BusCapacity', title: "Total NO of seats" },         //2
                    { data: 'SeatBooked', title: "NO of seats Book" },           //3
                    { data: 'SeatAvailable', title: "No of seats Available" },   //4
                    {
                        data: null, title: "BOOK",
                        "render": function (data, type, row, meta) {
                            st = '<button id="book" type="button" class="btn btn-primary btn-sm grid-btn"><i class="far fa-address-book"></i></button>';
                            return st;
                        }
                    },
                ],

                pageLength: 8,
                paging: true,
                scrollY: true,
                scrollX: true,
                scrollCollapse: true,
                searching: true,
                info: false,

                columnDefs: [
                    {
                        targets: 1, className: 'dt-body-center',
                        targets: 2, className: 'dt-body-center',
                        targets: 3, className: 'dt-body-center',
                        targets: 4, className: 'dt-body-center'
                    }
                ],

                fixedColumns: true,
                select: true,
                responsive: true,
                dom: 'frtp',
            });

            $('#DisplayBusReservation')
                .off()
                .on('click', 'tbody #book', function () {

                    var row = this.closest('tr');
                    getScheduleDetails(table.row(row).data());
                });
        },
        //error: function (XMLHttpRequest, textStatus, errorThrown) {
        //    alert("Status: " + textStatus); alert("Error: " + errorThrown);
        //}
        error: function (jqXHR, exception) {
            console.log(jqXHR);
            if (jqXHR.status == 404) {
                window.location.href = 'http://localhost:39402/Error/404';
            }
            else if  (jqXHR.status == 500) {
                window.location.href = 'http://localhost:39402/Error/500';
            }

        }

    });
}

//function persistSomething() {
//    alert('I am going to save something');
//    $("#myPopup").modal('hide');
//}

$(document).ready(function () {
    $('#TraveltDate').datepicker({
        autoclose: true,
        format: 'yyyy-mm-dd',

    }).on('changeDate', function (ev) {
        var s = ev.format(0, 'yyyy-mm-dd');
        $('#TraveltDate').val(s);
        RefreshReportData()
    });

    $('#TraveltDate').datepicker('setDate', '2021-05-31');
});