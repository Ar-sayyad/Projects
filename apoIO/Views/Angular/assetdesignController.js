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
                    /***Elements Templates***/  
                          var url = baseServiceUrl+'assetdatabases/' + WebId + '/elementtemplates'; 
                                var elementTemplatedata =  processJsonContent(url, 'GET', null);
                                    $.when(elementTemplatedata).fail(function () {
                                        warningmsg("Cannot Find the Element Templates.");
                                        console.log("Cannot Find the Element Templates.");
                                    });
                                    $.when(elementTemplatedata).done(function () {   
                                        var elementTemplateItems = (elementTemplatedata.responseJSON.Items);                                       
                                         var sr= 1;
                                         $.each(elementTemplateItems,function(key) { 
                                             $("#elementTemplatesLeft").append("<option label="+elementTemplateItems[key].Name+" data-id="+elementTemplateItems[key].WebId+" value="+elementTemplateItems[key].Name+">"+elementTemplateItems[key].Name+"</option>");                                             
                                            sr++;
                                          });
                                    });
                    /***Elements Templates***/ 
                            $("#elementTemplatesLeft").change(function(){
                                var leftTemplate = $("#elementTemplatesLeft").val();
                                 /***Elements***/  
                                var url = baseServiceUrl+'assetdatabases/' + WebId + '/elements?templateName='+leftTemplate; 
                                 var rightelementdata =  processJsonContent(url, 'GET', null);
                                    $.when(rightelementdata).fail(function () {
                                        warningmsg("Cannot Find the Element.");
                                        console.log("Cannot Find the Element.");
                                    });
                                    $.when(rightelementdata).done(function () {  
                                         var elementsItems = (rightelementdata.responseJSON.Items);                                         
                                         var categories = (elementsItems[0].CategoryNames);
                                         $("#elementListLeft").empty();
                                         $("#elementTemplatesRight").empty();
                                         $("#elementListRight").empty();
                                         $("#elementTemplatesRight").append("<option value='' selected disabled>---Select Elements---</option>");
                                         var sr= 1;
                                         $.each(elementsItems,function(key) {
                                             $("#elementTemplatesRight").append("<option data-name="+elementsItems[key].Name+" data-id="+sr+" value="+elementsItems[key].WebId+">"+elementsItems[key].Name+"</option>");
                                             //$("#elementListLeft").append('<li class="elemList elemList'+sr+'"><input type="radio" id="elemList'+sr+'" data-id="'+sr+'" data-name="'+elementsItems[key].Name+'" value="'+elementsItems[key].WebId+'" name="selectorLeft"><label class="labelList leftLabel" for="elemList'+sr+'">'+elementsItems[key].Name+'</label></li>');
                                            sr++;
                                         });
                                         
                                         $.each(categories,function(key) {
                                             var catName = categories[key];
                                              console.log(catName);
                                               var url = baseServiceUrl+'assetdatabases/' + WebId + '/elements?categoryName='+catName;
                                                elementdata =  processJsonContent(url, 'GET', null);
                                                    $.when(elementdata).fail(function () {
                                                        warningmsg("Cannot Find the Element.");
                                                        console.log("Cannot Find the Element.");
                                                    });
                                                    $.when(elementdata).done(function () {
                                                         var elementsCatItems = (elementdata.responseJSON.Items);
                                                          var csr= 1;
                                                            $.each(elementsCatItems,function(key) {
                                                                $("#elementListLeft").append('<li class="elemList elemList'+csr+'"><input type="radio" id="elemList'+csr+'" data-id="'+csr+'" data-name="'+elementsCatItems[key].Name+'" value="'+elementsCatItems[key].WebId+'" name="selectorLeft"><label class="labelList leftLabel" for="elemList'+csr+'">'+elementsCatItems[key].Name+'</label></li>');
                                                              csr++;  
                                                            });
                                                    });
                                          }); 
                                    });
                                /***Elements***/  
                            });
                    });
                    
                    /***shiftRight***/
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
                           if(RightWebId!=='? object:null ?'){
                               if(WebId!==RightWebId){
                                  $("#elementListRight").append('<li class="subelemList elemRightList'+sr+'"><input type="radio" id="elemRightList'+sr+'" data-id="'+sr+'" data-name="'+name+'"  value="'+WebId+'" name="selectorRight"><label class="labelList childLabel" for="elemRightList'+sr+'">'+name+' [Child]</label></li>');
                                  $(".elemList"+sr).remove(); 
                              }else{
                                  errormsg("Cannot create a circular reference.");
                                  return false;
                                }
                           }else{
                                warningmsg("Select the Right Element..!");
                                  return false;
                           }
                       }
                   });
                   /***shiftRight***/
                   
                   /***shiftLeft***/
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
                                 $("#elementListLeft").append('<li class="elemList elemList'+sr+'"><input type="radio" id="elemList'+sr+'" data-id="'+sr+'" data-name="'+name+'" value="'+WebId+'" name="selectorLeft"><label class="labelList leftLabel" for="elemList'+sr+'">'+name+'</label></li>');
                             }
                   });
                   /***shiftLeft***/                   

/***Right Drop Down OnChange***/  
$("#elementTemplatesRight").change(function(){
    var WebId = $(this).val();
    var sr = $('#elementTemplatesRight option:selected').data("id");
    var name = $('#elementTemplatesRight option:selected').data("name");
    $("#elementListLeft").empty();
    var elementsItems = (elementdata.responseJSON.Items);
    var srn= 1;
    $.each(elementsItems,function(key) {
        if(WebId===elementsItems[key].WebId){
            $("#elementListLeft").append('<li class="elemList elemList'+srn+'"><input type="radio" id="elemList'+srn+'" data-id="'+srn+'" data-name="'+elementsItems[key].Name+'" value="'+elementsItems[key].WebId+'" disabled="" name="selectorLeft"><label class="labelList leftLabel" for="elemList'+srn+'">'+elementsItems[key].Name+'</label></li>');
        }else{
            $("#elementListLeft").append('<li class="elemList elemList'+srn+'"><input type="radio" id="elemList'+srn+'" data-id="'+srn+'" data-name="'+elementsItems[key].Name+'" value="'+elementsItems[key].WebId+'" name="selectorLeft"><label class="labelList leftLabel" for="elemList'+srn+'">'+elementsItems[key].Name+'</label></li>');    
        }
        srn++;
     });
    $("#elementListRight").empty();   
    $("#elementListRight").append('<li class="elemRightList elemRightList'+sr+'"><input type="radio" id="elemRightList'+sr+'" data-id="'+sr+'" data-name="'+name+'"  value="'+WebId+'" checked="" name="selectorMainRight"><label class="labelList rightLabel" for="elemRightList'+sr+'">'+name+' [Parent]</label></li>');
});
/***Right Drop Down OnChange***/  

/*****buildElementReference*****/
$("#buildElementReference").click(function(){
  var ParentWebId = $("#elementTemplatesRight").val();
  //var Parentname = $('#elementTemplatesRight option:selected').data("name");
  var ChildWebId = $("input[name='selectorRight']:checked").val();
  var Childname = $("input[name='selectorRight']:checked").attr("data-name");
  if(ParentWebId!==''){
    if(ParentWebId!=='? object:null ?'){ 
       if(ChildWebId==null){
            warningmsg("Child Element Selection Required..!"); return false;                
            }else{        
              var url = baseServiceUrl+'elements/' + ParentWebId + '/referencedelements?WebId='+ParentWebId+'&referencedElementWebId='+ChildWebId+'&referenceType=Weak+Reference&startIndex=0'; 
                 var postAjaxEF = processJsonContent(url, 'POST', null);
                 $.when(postAjaxEF).fail(function () {
                     errormsg("Cannot Post The Data..!<br> Be "+Childname+" Already Exit as Reference Element..!");
                 });
                 $.when(postAjaxEF).done(function () {
                     var response = (JSON.stringify(postAjaxEF.responseText));
                     if(response=='""'){
                       successmsg("Element Created Successfully..!");
                     }else{
                         var failure = postAjaxEF.responseJSON.Items;
                          $.each(failure,function(key) {
                             warningmsg("Status: "+failure[key].Substatus+" <br> Message: "+failure[key].Message);
                          });
                     }
                 });
            }
        }else{        
          warningmsg("Parent Element Selection Required..!"); return false;
        }
    }else{        
      warningmsg("Element Selection Required..!"); return false;
    }    
});
/******buildElementReference******/

});