<html>
  <head>
      <?php
header("Access-Control-Allow-Origin: *");
?>
  <meta charset="utf-8"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
  <meta name="description" content=""/>
  <meta name="author" content=""/>
  <title>APOIO | PI WEB API</title>
  <!--favicon-->
  <link rel="icon" href="assets/images/favicon.ico" type="image/x-icon">
  <!-- Vector CSS -->
  <link href="assets/plugins/vectormap/jquery-jvectormap-2.0.2.css" rel="stylesheet" />
  <!-- simplebar CSS-->
  <link href="assets/plugins/simplebar/css/simplebar.css" rel="stylesheet"/>
  <!-- Bootstrap core CSS-->
  <link href="assets/css/bootstrap.min.css" rel="stylesheet"/>
  <!-- animate CSS-->
  <link href="assets/css/animate.css" rel="stylesheet" type="text/css"/>
  <!-- Icons CSS-->
  <link href="assets/css/icons.css" rel="stylesheet" type="text/css"/>
  <!-- Sidebar CSS-->
  <link href="assets/css/sidebar-menu.css" rel="stylesheet"/>
  <!-- Custom Style-->
  <link href="assets/css/app-style.css" rel="stylesheet"/>
  
</head>

<body>
    <!-- Start wrapper-->
 <div id="wrapper"> 
     <div class="clearfix"></div>
	
    <div class="content-wrapper">
    <div class="container-fluid">

      <!--Start Dashboard Content-->
      <div class="row">
        <div class="col-3 col-lg-3 col-xl-3">
            <div class="card border-secondary border-left-sm" style="margin-bottom: 5px;">
              <div class="card-body" style="padding: 15px;text-align: center;text-transform: uppercase;">
                   <button id="myDiv" class="btn btn-info" onclick="getData()">Get Data</button>
              </div>
          </div>
        </div>
          <div class="col-3 col-lg-3 col-xl-3">
            <div class="card border-secondary border-left-sm" style="margin-bottom: 5px;">
              <div class="card-body" style="padding: 15px;text-align: center;text-transform: uppercase;">
                  <select class="form-control" id="Database">
                     
                  </select>
              </div>
          </div>
        </div>
          <div class="col-3 col-lg-3 col-xl-3">
            <div class="card border-secondary border-left-sm" style="margin-bottom: 5px;">
              <div class="card-body" style="padding: 15px;text-align: center;text-transform: uppercase;">
                  <select class="form-control" id="AssetDatabase">
                     
                  </select>
              </div>
          </div>
        </div>
           <div class="col-3 col-lg-3 col-xl-3">
            <div class="card border-secondary border-left-sm" style="margin-bottom: 5px;">
              <div class="card-body" style="padding: 15px;text-align: center;text-transform: uppercase;">
                  <select class="form-control" id="ElementTemplates">
                     
                  </select>
              </div>
          </div>
        </div>
          <div class="col-3 col-lg-3 col-xl-3">
            <div class="card border-secondary border-left-sm" style="margin-bottom: 5px;">
              <div class="card-body" style="padding: 15px;text-align: center;text-transform: uppercase;">
                  <select class="form-control" id="Element">
                     
                  </select>
              </div>
          </div>
        </div>
      </div>
   
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script type="text/javascript">  
    
    var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://ecg-dev-server:1706/piwebapi/",
  "method": "GET",
  "headers": {
    "Access-Control-Allow-Origin": "*",
    "Authorization": "Basic QXNpZjpFQ0dAMTIz",
    "Access-Control-Allow-Headers": "*"
  }
}

$.ajax(settings).done(function (response) {
  console.log(response);
});


    var basePIWebAPIUrl = "https://ecg-dev-server:1706/piwebapi/";
    var user = "Asif";
    var pass = "ECG@123";
    var afServerName="PISRV1";
    var databaseName = "NuGreen";
    var efTemplateName = "Boiler";
      var processJsonContent = function (url, type, data) {
        return $.ajax({
            url: encodeURI(url),
            type: type,
            data: data,
            contentType: "application/json; charset=UTF-8",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", makeBasicAuth(user, pass));
                xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
                xhr.setRequestHeader("Access-Control-Allow-Headers","Origin,authorization, X-Requested-With, content-type, Accept");
            }
        });
    };
    var getDatabaseWebId = function (databaseName) {
        var url = basePIWebAPIUrl + "assetdatabases?path=\\\\" + afServerName + "\\" + databaseName;
        return processJsonContent(url, 'GET', null);
    };
    
    function getEventData(afDatabaseName){
         var ajaxDb = getDatabaseWebId(afDatabaseName);

            $.when(ajaxDb).fail(function () {
                console.log("Cannot connect to AF database " + afDatabaseName);
            });

            // Create event frame
            $.when(ajaxDb).done(function (data) {
                var url = basePIWebAPIUrl + "assetdatabases/" + data.WebId + "/eventframes";
                var now = JSON.stringify(new Date());
                currentEFName = user + "_" + now.slice(1, now.length - 1);
                var data1 = {
                    "Name" : currentEFName,
                    "Description" : "Event frame from user " + user,
                    "TemplateName" : efTemplateName,
                    "StartTime" : "*",
                    "EndTime": "*+5m"
                };
                var postData = JSON.stringify(data1);
                var ajaxEF = processJsonContent(url, 'POST', postData);

                $.when(ajaxEF).fail(function () {
                    console.log("Cannot create event frame.");
                });

                $.when(ajaxEF).done(function () {
                    console.log("Event frame created successfully.");
                    alert("You may now start recording.");
                });
            });
    };
    
    function getData(){
         $.ajax({
            url: encodeURI(basePIWebAPIUrl+'assetservers'),
            type: "GET",
            contentType: "application/json; charset=UTF-8",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", makeBasicAuth(user,pass));
            },
            success: function (data) {
                alert (JSON.stringify(data));
//                $('#Database').empty();
//            $('#Database').append('<option>--Select Database--</option>');
//            for(i=0; i < data.Items.length; i++){                
//                $('#Database').append('<option value="' + data.Items[i].WebId + '">' + data.Items[i].Name + '</a></option>');
//            }
         },
            error: function(){
                  //console.log("Data not found..!");
                alert("Cannot get data");
               // $('#Database').empty();
              }
        });
    };
    
    $("#Database").change(function(){
           $WebId= $("#Database").val();           
            var url = basePIWebAPIUrl + 'assetservers/'+ $WebId + '/' + 'assetdatabases';
            getAssetDatabase(url, 'GET');           
       });
      $("#AssetDatabase").change(function(){
           var WebName= $("#AssetDatabase").val();   
           getEventData(WebName);
//            var url = basePIWebAPIUrl + '/assetdatabases/'+ $WebId + '/' + 'elementtemplates';
//             var url1 = basePIWebAPIUrl + '/assetdatabases/'+ $WebId + '/' + 'elements';
//            getElementTemplates(url, 'GET');  
//            getElement(url1, 'GET');  
       });   
    
    function getAssetDatabase(url, type) {
         $.ajax({
            url: encodeURI(url),
            type: type,
            contentType: "application/json; charset=UTF-8",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", makeBasicAuth(user, pass));
            },
            success: function (data) {
                 $('#AssetDatabase').empty();
               //alert (JSON.stringify(data));
               $('#AssetDatabase').append('<option>--Select Asset Database--</option>');
                for(i=0; i < data.Items.length; i++){                
                    $('#AssetDatabase').append('<option value="' + data.Items[i].Name + '">' + data.Items[i].Name + '</a></option>');
                }
            },
            error: function(){
                 $('#AssetDatabase').empty();
                alert('Fail');
            }
        });
    };
     function getElementTemplates(url, type) {
         $.ajax({
            url: encodeURI(url),
            type: type,
            contentType: "application/json; charset=UTF-8",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", makeBasicAuth(user, pass));
            },
            success: function (data) {
                 $('#ElementTemplates').empty();      
               //alert (JSON.stringify(data));
               $('#ElementTemplates').append('<option>--Select Element Templates--</option>');
                for(i=0; i < data.Items.length; i++){                
                    $('#ElementTemplates').append('<option value="' + data.Items[i].WebId + '">' + data.Items[i].Name + '</a></option>');
                }
            },
            error: function(){
                 $('#ElementTemplates').empty();                 
                alert('Fail');
            }
        });
    };
     function getElement(url, type) {
         $.ajax({
            url: encodeURI(url),
            type: type,
            contentType: "application/json; charset=UTF-8",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", makeBasicAuth(user, pass));
            },
            success: function (data) {
                 $('#Element').empty();      
               //alert (JSON.stringify(data));
               $('#Element').append('<option>--Select Elements--</option>');
                for(i=0; i < data.Items.length; i++){                
                    $('#Element').append('<option value="' + data.Items[i].WebId + '">' + data.Items[i].Name + '</a></option>');
                }
            },
            error: function(){
                 $('#Element').empty();                 
                alert('Fail');
            }
        });
    };
    var makeBasicAuth = function (user, password) {
        var tok = user + ':' + password;
        var hash = window.btoa(tok);
        return "Basic " + hash;
    };

 
    

</script>
    </div>
    </div>
 </div>
</body>
</html>
