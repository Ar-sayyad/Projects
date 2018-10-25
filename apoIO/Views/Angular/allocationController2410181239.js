app.controller('allocationController', function($scope) { 
   $scope.intervalFunction = function(){
        $scope.date = new Date().toLocaleString().replace(",","");//new Date(); //Date.now();        
       // console.log($scope.date);
        $("#dateTime").val($scope.date);
    }
    setInterval(function() {
      $scope.intervalFunction();
    }, 1000);
  
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
        
        /***elementtemplates***/                    
                    var url = baseServiceUrl+'assetdatabases/'+ WebId + '/elementtemplates'; 
                    var elements =  processJsonContent(url, 'GET', null);                    
                        $.when(elements).fail(function () {
                             warningmsg("Cannot Find the Element Templates.");
                            console.log("Cannot Find the Element Templates.");
                        });
                    $.when(elements).done(function () {
                        $scope.List = [];
                        var Items = (elements.responseJSON.Items);
                            $.each(Items,function(key) {   
                              $("#elementTemplates").append("<option label="+Items[key].Name+" data-id="+Items[key].WebId+" value="+Items[key].Name+">"+Items[key].Name+"</option>");
                               //$scope.List.push({ id:Items[key].WebId, name:Items[key].Name });  
                            }); 
                                $("#elementTemplates").change(function () {
                /***Elements***/                                
                               $("#elements").children().remove().end();//.append('<option selected="" value="">---Select Block---</option>') ;
                                var TemplatesName = $("#elementTemplates").val();
                                if(TemplatesName){
                                var url = baseServiceUrl+'assetdatabases/' + WebId + '/elements?templateName='+TemplatesName; 
                                var elementdata =  processJsonContent(url, 'GET', null);
                                    $.when(elementdata).fail(function () {
                                        warningmsg("Cannot Find the Element.");
                                        console.log("Cannot Find the Element.");
                                    });
                                    $.when(elementdata).done(function () {                                        
                                        $scope.elementList = [];
                                         var elementsItems = (elementdata.responseJSON.Items);
                                         //alert(ElementsItems);
                                         $.each(elementsItems,function(key) {                                          
                                             $("#elements").append("<option value="+elementsItems[key].WebId+">"+elementsItems[key].Name+"</option>");
//                                             $scope.elementList.push({
//                                                  id:elementsItems[key].WebId,
//                                                  name:elementsItems[key].Name
//                                              });  
                                          });
                                            //console.log("Attributes : "+ JSON.stringify($scope.elementList));
                                    });
                                }else{
                                   warningmsg("Template Not Selected.");
                                    console.log("Template Not Selected.");
                                }
                /***Elements***/
                              });
                              
         //console.log("Attributes : "+ JSON.stringify($scope.List));
                        });
        /***elementtemplates***/
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