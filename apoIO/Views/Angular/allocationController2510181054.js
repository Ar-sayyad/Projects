app.controller('allocationController', function($scope) { 
//   $scope.intervalFunction = function(){
//        $scope.date = new Date().toLocaleString().replace(",","");//new Date(); //Date.now();        
//       // console.log($scope.date);
//        $("#dateTime1").val($scope.date);
//    }
//    setInterval(function() {
//      $scope.intervalFunction();
//    }, 1000);
//  
 $(function() {
      var now = new Date();
    var month = (now.getMonth() + 1);               
    var day = now.getDate();
    if (month < 10) 
        month = "0" + month;
    if (day < 10) 
        day = "0" + day;
    var today = month + '/' + day + '/'+now.getFullYear();    
     $("#dateTime").val(today);
    $( "#dateTime" ).datepicker();
});
$(function(){     
  var d = new Date(),        
      h = d.getHours(),
      m = d.getMinutes();
  if(h < 10) h = '0' + h; 
  if(m < 10) m = '0' + m; 
  $('input[type="time"][name="time"]').each(function(){ 
    $(this).attr({'value': h + ':' + m});
  });
});
  
/***Asset Database***/
     var url = baseServiceUrl+'assetdatabases?path=\\\\' + afServerName + '\\' + afDatabaseName;       
            var ajaxEF =  processJsonContent(url, 'GET', null);
                $.when(ajaxEF).fail(function () {
                    warningmsg("Cannot Find the Assetdatabases.");
                    console.log("Cannot Find the Assetdatabases.");
                });
                $.when(ajaxEF).done(function () {
                    var WebId = (ajaxEF.responseJSON.WebId);
        /***EnumerationSets***/
                     var EnumSetsurl = baseServiceUrl+'assetdatabases/'+ WebId + '/enumerationsets'; 
                     var ajaxEnumSets =  processJsonContent(EnumSetsurl, 'GET', null);
                        $.when(ajaxEnumSets).fail(function () {
                             console.log("Cannot Find the Enumeration Sets.");
                        });
                        $.when(ajaxEnumSets).done(function () {
                             var EnumWebId = (ajaxEnumSets.responseJSON.Items[0].WebId);                             
               /***Enumeration Sets Values***/         
                              var EnumValueurl = baseServiceUrl+'enumerationsets/'+ EnumWebId + '/enumerationvalues';
                              var ajaxEnumValues =  processJsonContent(EnumValueurl, 'GET', null);
                                $.when(ajaxEnumValues).fail(function () {
                                     warningmsg("Cannot Find the Enumeration Sets Values.");
                                    console.log("Cannot Find the Enumeration Sets Values.");
                                });
                                $.when(ajaxEnumValues).done(function () {
                                    $scope.EnumerationValues = [];                                    
                                     var disabled='';
                                        var EnumValItems = (ajaxEnumValues.responseJSON.Items);
                                        $.each(EnumValItems,function(key) { 
                                            if (EnumValItems[key].Value === 0 || EnumValItems[key].Value === 128) {
                                                     disabled = 1;
                                                 }else{  disabled = 0; }
                                            $scope.EnumerationValues.push({
                                                Name:EnumValItems[key].Name,                                                
                                                Value:EnumValItems[key].Value,
                                                Disabled:disabled
                                            });  
//                                      $("#enumerationValues").append("<option label="+EnumValItems[key].Name+"  value="+EnumValItems[key].Value+" disabled>"+EnumValItems[key].Name+"</option>");
                                        });
                                });
               /***Enumeration Sets Values***/
                        });
        /***EnumerationSets***/
        
        /***Elements***/  
                          var url = baseServiceUrl+'assetdatabases/' + WebId + '/elements?templateName='+templateName; 
                                var elementdata =  processJsonContent(url, 'GET', null);
                                    $.when(elementdata).fail(function () {
                                        warningmsg("Cannot Find the Element.");
                                        console.log("Cannot Find the Element.");
                                    });
                                    $.when(elementdata).done(function () {                                        
                                        $scope.elementList = [];
                                         var elementsItems = (elementdata.responseJSON.Items);
                                         //alert(ElementsItems);
                                         var sr= 1;
                                         $.each(elementsItems,function(key) {                                          
                                             //$("#elements").append("<option value="+elementsItems[key].WebId+">"+elementsItems[key].Name+"</option>");
                                             $("#loadedDiv").append('<div class="col-12 col-lg-6 col-xl-2" style="">\n\
<div class="card cardpadding">\n\
                    <div class="card-body" style="text-align: center;margin-top: 15px;">\n\
                       <input type="hidden" id="elements'+sr+'" data-id="'+elementsItems[key].Name+'" value="'+elementsItems[key].WebId+'" class="elements form-control">\n\
                       <h4>'+elementsItems[key].Name+'</h4>\n\
                  </div>\n\
               </div>\n\
</div>\n\
             <div class="col-12 col-lg-6 col-xl-5">\n\
                 <div class="row card">\n\
                     <div class="col-12 col-lg-6 col-xl-6">\n\
                         <div class="card-body" style="margin-top: 20px;">\n\
                                <select id="connection'+sr+'" class="connection form-control">\n\
                                    <option value="" selected="" disabled="">---Select Connection---</option>\n\
                                      <option value="0">Not Connected</option>\n\
                                        <option value="128">Recirculation</option>\n\
                                          <option value="0">Connected</option>\n\
                                </select>\n\
                            </div> \n\
                        </div>\n\
                     <div class="col-12 col-lg-6 col-xl-6">\n\
                            <div class="card-body">\n\
                                <select id="prValues'+sr+'" class="prValues form-control">\n\
                                    <option value="">---Select PR---</option>\n\
                                    <option value="1">PR</option>\n\
                                    <option value="17">PR - TKD </option>\n\
                                    <option value="33">PR - MKM_old</option>\n\
                                    <option value="65">PR - MKM_new</option>\n\
                                 </select>\n\
                                <select id="vrValues'+sr+'" class="vrValues form-control">\n\
                                    <option value="">---Select VR---</option>\n\
                                    <option value="2">VR</option>\n\
                                    <option value="18">VR - TKD </option>\n\
                                    <option value="34">VR - MKM_old</option>\n\
                                    <option value="66">VR - MKM_new</option>\n\
                                </select>   \n\
                            </div>\n\
                     </div>\n\
                 </div>\n\
             </div>\n\
                <div class="col-12 col-lg-6 col-xl-3">\n\
                <div class="card cardpadding">\n\
                    <div class="card-body">\n\
                        <span  style="text-align: center;width: 50%;float: left">\n\
                            <input type="text" class="dateTime form-control" style="width:95%;"  id="dateTime'+sr+'"  placeholder="Date Time">\n\
                        </span>\n\
                         <span  style="text-align: center;width: 50%;float: left">\n\
                                <input type="time" name="time'+sr+'" id="time'+sr+'" style="width:95%;" class="time form-control">\n\
                        </span>\n\
                    </div>\n\
                </div>\n\
             </div>\n\
             <div class="col-12 col-lg-6 col-xl-2">\n\
                <div class="card cardpadding">\n\
                    <div class="card-body"  style="text-align: center">\n\
                        <button type="button" id="saveAllocation'+sr+'" onclick="saveAllocation('+sr+');" class="saveAllocation btn btn-primary"><i class="ti-save"></i> Save</button>\n\
                    </div>\n\
                </div>\n\
             </div>');
//                                             $scope.elementList.push({
//                                                  id:elementsItems[key].WebId,
//                                                  name:elementsItems[key].Name
//                                              }); 
                                        $(function() {
                                             var now = new Date();
                                           var month = (now.getMonth() + 1);               
                                           var day = now.getDate();
                                           if (month < 10) 
                                               month = "0" + month;
                                           if (day < 10) 
                                               day = "0" + day;
                                           var today = month + '/' + day + '/'+now.getFullYear();    
                                            $("#dateTime"+sr).val(today);
                                           $( "#dateTime"+sr).datepicker();
                                       });
                                       $(function(){     
                                         var d = new Date(),        
                                             h = d.getHours(),
                                             m = d.getMinutes();
                                         if(h < 10) h = '0' + h; 
                                         if(m < 10) m = '0' + m; 
                                         $('input[type="time"][name="time'+sr+'"]').each(function(){ 
                                           $(this).attr({'value': h + ':' + m});
                                         });
                                       });

                                    sr++;
                                          });
                                            //console.log("Attributes : "+ JSON.stringify($scope.elementList));
                                    });
                /***Elements***/    
                    });
                   
/***Asset Database***/

/****Save Allocation***/
$('#saveAllocation').click(function(){
   var elementWebId = $("#elements").val();
   var enumerationValues = $("#enumerationValues").val();
   //var enumerationName = $('#enumerationValues option:selected').data("name");
   //var dateTime = $("#dateTime").val();
   var url = baseServiceUrl+'elements/' + elementWebId + '/attributes'; 
   var attributesElements =  processJsonContent(url, 'GET', null);
        $.when(attributesElements).fail(function () {
            warningmsg("Cannot Find the Attributes.");
            console.log("Cannot Find the Attributes.");
        });
        $.when(attributesElements).done(function () {
            $scope.Attributes = [];
            var attributesItems = (attributesElements.responseJSON.Items);
            $.each(attributesItems,function(key) {
                if (attributesItems[key].Name === 'PLANT') {
                    var now = JSON.stringify(new Date());
                    var url = baseServiceUrl + 'streams/' + attributesItems[key].WebId + '/recorded';
                        var data = [
                                    {
                                      "Timestamp": now,
                                      "UnitsAbbreviation": "m",
                                      "Good": true,
                                      "Questionable": false,
                                      "Value": enumerationValues
                                    }
                                  ];
                    var postData = JSON.stringify(data);
                    var postAjaxEF = processJsonContent(url, 'POST', postData, null, null);
                     $.when(postAjaxEF).fail(function () {
                         errormsg("Cannot Post The Data.");
                        console.log("Cannot Post The Data.");
                    });

                    $.when(postAjaxEF).done(function () {
                        successmsg("Data Saved successfully.");
                        console.log("Data Saved in PLANT successfully.");
                    });
                }else{}
                
           });
           // console.log("Attributes : "+ JSON.stringify($scope.Attributes)); 
        });
});

/****Save Allocation***/
});