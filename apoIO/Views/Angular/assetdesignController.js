app.controller('assetdesignController', function($scope) { 
    var elementdata = '';
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
                                var elementTemplatedata =  processJsonContent(url, 'GET', null);
                                    $.when(elementTemplatedata).fail(function () {
                                        warningmsg("Cannot Find the Element Templates.");
                                        console.log("Cannot Find the Element Templates.");
                                    });
                                    $.when(elementTemplatedata).done(function () {                                        
                                        $scope.elementTemplateList = [];
                                         var elementTemplateItems = (elementTemplatedata.responseJSON.Items);
                                         var sr= 1;
                                         $.each(elementTemplateItems,function(key) { 
                                             $("#elementTemplatesLeft").append("<option label="+elementTemplateItems[key].Name+" data-id="+elementTemplateItems[key].WebId+" value="+elementTemplateItems[key].Name+">"+elementTemplateItems[key].Name+"</option>");                                             
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
                                 elementdata =  processJsonContent(url, 'GET', null);
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
                                         $("#elementListRight").empty();
                                         $("#elementTemplatesRight").append("<option value='' selected disabled>---Select Elements---</option>");
                                         var sr= 1;
                                         $.each(elementsItems,function(key) {
                                             $("#elementTemplatesRight").append("<option data-name="+elementsItems[key].Name+" data-id="+sr+" value="+elementsItems[key].WebId+">"+elementsItems[key].Name+"</option>");
                                             $("#elementListLeft").append('<li class="elemList elemList'+sr+'"><input type="radio" id="elemList'+sr+'" data-id="'+sr+'" data-name="'+elementsItems[key].Name+'" value="'+elementsItems[key].WebId+'" name="selectorLeft"><label class="labelList" for="elemList'+sr+'">'+elementsItems[key].Name+'</label></li>');

                                            
                                             $("#elemList"+sr).click(function(){
                                                 var WebId = $(this).val();
                                                 var sr = ($(this).attr("data-id"));
                                                 var name = ($(this).attr("data-name"));
                                                 //selectedList(WebId,sr,name); 
                                                 //$("#elementListRight").append('<li class="subelemList elemRightList'+sr+'"><input type="radio" id="elemRightList'+sr+'" data-id="'+sr+'" value="'+WebId+'" name="selectorRight"><label class="labelList" for="elemRightList'+sr+'">'+name+'</label></li>');
                                              });
                                            sr++;
                                         });
                                            
                                    });
                /***Elements***/    

                            });
                    });
                   var RightArray = [];
                   $("#shiftRight").click(function(){  
                       if (!$("input[name='selectorLeft']:checked").val()) {
                                warningmsg("Select the Left Element..!");
                                 return false;
                             }
                             else {                         
                                var WebId = $("input[name='selectorLeft']:checked").val();
                                var sr = $("input[name='selectorLeft']:checked").attr("data-id");
                                var name = $("input[name='selectorLeft']:checked").attr("data-name");
                                
                                var RightWebId = $("#elementTemplatesRight").val(); 
//                                if(RightArray.length ==''){
                                         if(RightWebId!=='? object:null ?'){
                                             if(WebId!==RightWebId){
                                                var Rightsr = $('#elementTemplatesRight option:selected').data("id");
                                                var Rightname = $('#elementTemplatesRight option:selected').data("name");
                                                $("#elementListRight").append('<li class="subelemList elemRightList'+sr+'"><input type="radio" id="elemRightList'+sr+'" data-id="'+sr+'" data-name="'+name+'"  value="'+WebId+'" checked="" name="selectorRight"><label class="labelList" for="elemRightList'+sr+'">'+name+' [Child]</label></li>');
                                                $(".elemList"+sr).remove(); 
                                                //RightArray.push(sr);
                                            }else{
                                                errormsg("Cannot create a circular reference.");
                                                return false;
                                            }
                                         }else{
                                              warningmsg("Select the Right Element..!");
                                                return false;
                                         }
//                                 }else{
//                                      warningmsg("Element Already Added..!");
//                                        return false;
//                                       selectedList(RightWebId,Rightsr,Rightname);
//                                 }
                                selectedList(WebId,sr,name); 
                            }
                   });
                   
                   /***validation required***/
                   $("#shiftLeft").click(function(){
                        if (!$("input[name='selectorRight']:checked").val()) {
                                warningmsg("Select the Child Element..!");
                                 return false;
                             }
                             else {   
                                var WebId = $("input[name='selectorRight']:checked").val();
                                var sr = $("input[name='selectorRight']:checked").attr("data-id");
                                var name = $("input[name='selectorRight']:checked").attr("data-name");
                                $(".elemRightList"+sr).remove();
                                 $("#elementListLeft").append('<li class="elemList elemList'+sr+'"><input type="radio" id="elemList'+sr+'" data-id="'+sr+'" data-name="'+name+'" value="'+WebId+'" name="selectorLeft"><label class="labelList" for="elemList'+sr+'">'+name+'</label></li>');
                                var RightWebId = $("#elementTemplatesRight").val();
                                var Rightsr = $('#elementTemplatesRight option:selected').data("id");
                                var Rightname = $('#elementTemplatesRight option:selected').data("name");
                                //alert(RightWebId);
                                RightArray.pop(sr);
                                selectedList(WebId,sr,name);
                                selectedList(RightWebId,Rightsr,Rightname);    
                            }
                   });
                   
/***Asset Database***/
function selectedList(WebId,sr,name){
  console.log(WebId+" "+sr+" "+name);
}
$("#elementTemplatesRight").change(function(){
     var WebId = $(this).val();
    var sr = $('#elementTemplatesRight option:selected').data("id");
    var name = $('#elementTemplatesRight option:selected').data("name");
     $("#elementListLeft").empty();
    var elementsItems = (elementdata.responseJSON.Items);
     var srn= 1;
    $.each(elementsItems,function(key) {
        if(WebId===elementsItems[key].WebId){
            $("#elementListLeft").append('<li class="elemList elemList'+srn+'"><input type="radio" id="elemList'+srn+'" data-id="'+srn+'" data-name="'+elementsItems[key].Name+'" value="'+elementsItems[key].WebId+'" disabled="" name="selectorLeft"><label class="labelList" for="elemList'+srn+'">'+elementsItems[key].Name+'</label></li>');
        }else{
            $("#elementListLeft").append('<li class="elemList elemList'+srn+'"><input type="radio" id="elemList'+srn+'" data-id="'+srn+'" data-name="'+elementsItems[key].Name+'" value="'+elementsItems[key].WebId+'" name="selectorLeft"><label class="labelList" for="elemList'+srn+'">'+elementsItems[key].Name+'</label></li>');    
        }
        srn++;
     });
    $("#elementListRight").empty();   
    $("#elementListRight").append('<li class="elemRightList elemRightList'+sr+'"><input type="radio" id="elemRightList'+sr+'" data-id="'+sr+'" data-name="'+name+'"  value="'+WebId+'" checked="" name="selectorMainRight"><label class="labelList" for="elemRightList'+sr+'">'+name+' [Parent]</label></li>');
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