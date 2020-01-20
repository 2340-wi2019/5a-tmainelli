$(document).ready(function() {
    $('#holder').hide();
    $('#get-employees').fadeIn();
    $('#get-employees').click(function() {
        $(this).fadeOut(function() {
            $('#loader').fadeIn(function() {
                $.ajax( {
                    url:'https://www.mccinfo.net/epsample/employees',
                }).done(onAjaxComplete);
            });
        });
    });
    function onAjaxComplete(data) {
        var employees = $.parseJSON(data);
        var s = "";
        if(Array.isArray(employees)) {
            for (var i = 0; i < employees.length; i++) {
                s += "<h3>" + employees[i].first_name + " " + employees[i].last_name + "</h3>";
                s += "<div id='" + employees[i].id + "'>";
                s += "<p>First Name: " + employees[i].first_name + "</p>";
                s += "<p>Last Name: " + employees[i].last_name + "</p>";
                s += "<img src=' " + employees[i].image_filename + " ' alt='employee image'/>";
                s += "<br /><br />"
                s += "<button id='" +employees[i].id +"'" +" class='get-info'>Get Info</button>";
                s += "</div>";
                /*
                if( i != employees.length -1) {
                    s += "<hr />";
                }
                */
               $('#holder').html(s);
               $('#loader').fadeOut(function() {
                   $('#holder').accordion({
                       heightStyle:"content"
                   });
                $('.get-info').click(function(evt) {
                    console.log(this.id);
                    var id = this.id
                    evt.stopImmediatePropagation();
                    $('#holder').fadeOut();
                    $('#loader').fadeIn(function() {
                        $.ajax({
                            url:'https://www.mccinfo.net/epsample/employees/' + id 
                        }).done(showEmployeeInfo);
                    });
                });
                function showEmployeeInfo(data) {
                    var employee = $.parseJSON(data);
                    console.log(employee);
                    var name = employee.first_name + " " + employee.last_name;
                    var salary = accounting.formatMoney(employee.annual_salary);
                    $('#dialog').attr('title', name);
                    var s = "";
                        s += "<img src='" + employee.image_filename + "'/>"
                        s += "<p>Hire Date: " + employee.hire_date + "</p>";
                        s += "<p>Salary: " + salary + "</p>";
                        s += "<p>Department: " + employee.department.name + "</p>";
                    $('#dialog').html(s);
                    $('#loader').fadeOut();
                    $('#dialog').dialog({
                        close:function(){
                            console.log('closing');
                            $('#holder').fadeIn(function(){
                                $('#dialog').html('');
                            });
                        }
                    });
                }
                $('#holder').fadeIn();
               });

            }
        } else {
            s += "<p>Error - unexpected response from server. Expected Array, received something else! :-(</p>"
        }
    }
});
