app.controller('assetdesignController', function($scope) {  
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
          $( "#dateTime").datepicker();
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
        /***Elements***/  
                          var url = baseServiceUrl+'assetdatabases/' + WebId + '/elementtemplates'; 
                                var elementdata =  processJsonContent(url, 'GET', null);
                                    $.when(elementdata).fail(function () {
                                        warningmsg("Cannot Find the Element Templates.");
                                        console.log("Cannot Find the Element Templates.");
                                    });
                                    $.when(elementdata).done(function () {                                        
                                        $scope.elementTemplateList = [];
                                         var elementsItems = (elementdata.responseJSON.Items);
                                         var sr= 1;
                                         $.each(elementsItems,function(key) { 
                                             $("#elementTemplatesLeft").append("<option label="+elementsItems[key].Name+" data-id="+elementsItems[key].WebId+" value="+elementsItems[key].Name+">"+elementsItems[key].Name+"</option>");                                             
//                                               $scope.elementTemplateList.push({
//                                                  id:elementsItems[key].WebId,
//                                                  name:elementsItems[key].Name
//                                              });  
                                            sr++;
                                          });
                                        // console.log("elementTemplateList : "+ JSON.stringify($scope.elementTemplateList));
                                    });
                /***Elements***/  
                
                            $("#elementTemplatesLeft").change(function(){
                              var leftTemplate = $("#elementTemplatesLeft").val();
                              //  alert(leftTemplate);
                                 /***Elements***/  
                          var url = baseServiceUrl+'assetdatabases/' + WebId + '/elements?templateName='+leftTemplate; 
                                var elementdata =  processJsonContent(url, 'GET', null);
                                    $.when(elementdata).fail(function () {
                                        warningmsg("Cannot Find the Element.");
                                        console.log("Cannot Find the Element.");
                                    });
                                    $.when(elementdata).done(function () {                                        
                                        $scope.elementList = [];
                                         var elementsItems = (elementdata.responseJSON.Items);
                                         //alert(ElementsItems);
                                         $("#elementListLeft").empty();
                                         $("#elementTemplatesRight").empty();
                                         var sr= 1;
                                         $.each(elementsItems,function(key) {
                                             $("#elementTemplatesRight").append("<option label="+elementsItems[key].Name+" data-id="+elementsItems[key].WebId+" value="+elementsItems[key].Name+">"+elementsItems[key].Name+"</option>");
                                             $("#elementListLeft").append('<li class="elemList elemList'+sr+'" onClick="return elemList();" name="'+sr+'" id="'+elementsItems[key].WebId+'" value="'+elementsItems[key].Name+'">'+elementsItems[key].Name+'</li>');
                                         });
                                            
                                    });
                /***Elements***/    

                            });
                    });
                   
/***Asset Database***/
function elemList(){
    alert('hello');
}

$(".elemList").click(function(){
    alert('hello');
});
/****Save Allocation***/
function saveAllocation(srn,dataValues,dateTime){
    var elementWebId = $("#elements"+srn).val();
   //var enumerationName = $('#enumerationValues option:selected').data("name");
   var url = baseServiceUrl+'elements/' + elementWebId + '/attributes'; 
   var attributesElements =  processJsonContent(url, 'GET', null);
        $.when(attributesElements).fail(function () {
            warningmsg("Cannot Find the Attributes.");
            console.log("Cannot Find the Attributes.");
        });
        $.when(attributesElements).done(function () {
            var attributesItems = (attributesElements.responseJSON.Items);
            $.each(attributesItems,function(key) {
                if (attributesItems[key].Name === 'PLANT') {
                    var url = baseServiceUrl + 'streams/' + attributesItems[key].WebId + '/recorded';
                        var data = [
                                    {
                                      "Timestamp": dateTime,
                                      "UnitsAbbreviation": "m",
                                      "Good": true,
                                      "Questionable": false,
                                      "Value": dataValues
                                    }
                                  ];
                    var postData = JSON.stringify(data);
                    var postAjaxEF = processJsonContent(url, 'POST', postData, null, null);
                     $.when(postAjaxEF).fail(function () {
                         errormsg("Cannot Post The Data.");
                        //console.log("Cannot Post The Data.");
                    });

                    $.when(postAjaxEF).done(function () {
                        var response = (JSON.stringify(postAjaxEF.responseText));
                        if(response=='""'){
                          successmsg("Data Saved successfully.");
                          //console.log("Data Saved in PLANT successfully.");
                        }else{
                            var failure = postAjaxEF.responseJSON.Items;
                             $.each(failure,function(key) {
                                warningmsg("Status: "+failure[key].Substatus+" <br> Message: "+failure[key].Message);
                                //console.log(failure);
                             });
                        }
                        
                    });
                }else{}
                
           });
        });
}

/****Save Allocation***/
});