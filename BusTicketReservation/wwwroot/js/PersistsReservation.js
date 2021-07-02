function EditReservation(obj) {
    var scheduleID = obj.ScheduleID;
    var RID = obj.ReservationID;
    var name = obj.Name;
    var email = obj.Email;
    var cnic = obj.CNIC;
    var phone = obj.ContactNumber;

    $("#schid").val(scheduleID);
    $("#Rid").val(RID)
    $("#name").val(name);
    $("#email").val(email);
    $("#cnic").val(cnic);
    $("#phno").val(phone)

    $("#myPopup").modal('show');
 
}
function cancelReservation(obj) {

    if (obj == undefined) { return false; }

    var id = obj.ScheduleID.toString();
    var Rid = obj.ReservationID.toString();
    var name = obj.Name;
    var email = obj.Email;
    var cnic = obj.CNIC;
    var phno = obj.ContactNumber;

  
    persistReservationInfo(id, Rid, name, email, cnic, phno, '0');
    toastr.warning("Record deleted Successfully");
   
    //alert("ticket cancel");
}

function RefreshReservationData() {
    var scheduleID = $("#scheduleID").val();
    //var scheduleID = 8;
    var myData = { 'ScheduleID': scheduleID };
    myData = JSON.stringify(myData);


    numberRenderer = $.fn.dataTable.render.number(',', '.', 2).display;



    var baseURL = "http://localhost:39402/";
    $.ajax({
        url: baseURL + "Home/getScheduleDetails",
        type: 'POST',
        cache: false,
        dataType: 'json',
        data: myData,
        contentType: 'application/json; charset=utf-8',

        success: function (data) {
            if ($.fn.dataTable.isDataTable('#ReservedSeatinfoTable')) { $('#ReservedSeatinfoTable').dataTable().fnDestroy(); }

            $("#ReservedSeatinfoTable").append('<tfoot><th></th><th></th><th></th><th></th><th></th></tfoot>');
            var table = $('#ReservedSeatinfoTable').DataTable({
                data: data,
                columns: [
                    { data: 'ReservationID', title: "RID" },  
                    { data: 'ScheduleID', title: "ID" },                                //0
                    { data: 'TicketNumber', title: "Ticket Number" },                  //1
                    { data: 'Name', title: "Name" },                                  //2
                    { data: 'Email', title: "Email" },                               //3
                    { data: 'CNIC', title: "CNIC" },
                    { data: 'ContactNumber', title: "Contact Number" },             //4
                    {
                        data: null, title: "Edit",
                        "render": function (data, type, row, meta) {
                            st = '<button id="edit" type="button" class="btn btn-primary btn-sm grid-btn"><i class="fas fa-user-edit"></i></button>';                                                                                 
                            return st;
                        }
                    },
                    {
                        data: null, title: "Cancel",
                        "render": function (data, type, row, meta) {
                            st = '<button id="cancel" type="button" class="btn btn-primary btn-sm grid-btn"><i class="fas fa-user-slash"></i></button>';
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
               // dom: 'frtp',
                dom: 'bfrtip',
                buttons: [
                     "create"
                   
                    
                ],

            });

            $('#ReservedSeatinfoTable')
                .off()
                .on('click', 'tbody #edit', function () {
                    
                    var row = this.closest('tr');
                    EditReservation(table.row(row).data());
                }).on('click', 'tbody #cancel', function () {

                    var row = this.closest('tr');
                    cancelReservation(table.row(row).data());
                });
           
        },
         error: function (jqXHR, exception) {
            console.log(jqXHR);
            if (jqXHR.status == 404) {
                window.location.href = 'http://localhost:39402/Error/404';
            }
            else if (jqXHR.status == 500) {
                window.location.href = 'http://localhost:39402/Error/500';
            }

        }
    });
}

function Showpopup() {
   // alert('I am going to save something');
    $("#Rid").val(0)
    $("#name").val('');
    $("#email").val('');
    $("#cnic").val('');
    $("#phno").val('')
    $("#myPopup").modal('show');
}

function persistReservationInfo(id,Rid ,name, email, cnic, phno,Act) {
   
    var baseURL = "http://localhost:39402/";
    var myData = { 'ScheduleId': id,'ResID':Rid, 'Name': name, 'Email': email, 'CNIC': cnic, 'ContactNo': phno, 'Active': Act };
    myData = JSON.stringify(myData);
    $.ajax({
        url: baseURL + "Home/presistCustomerInfo",
        type: "POST",
        cashe: false,
        dataType: "json",
        data: myData,
        contentType: "application/json; charset= utf-8",
        success: function (data) {

            RefreshReservationData();
        },
        error: function (XMLHttpRequest, testStatus, errorThrown) {
            alert('Error! Persisting Reservation Info');

        }
    })
}

function persistReservation () {
    var id = $("#scheduleID").val();
    var Rid = $("#Rid").val();
    var name = $("#name").val();
    var email = $("#email").val();
    var cnic = $("#cnic").val();
    var phno = $("#phno").val();
   
    persistReservationInfo(id, Rid, name, email, cnic, phno, '1');
    RefreshReservationData();
    $("#myPopup").modal('hide');
    toastr.success("Record saved Successfully");
   
}

$(document).ready(function () {
    

    RefreshReservationData();
  
});