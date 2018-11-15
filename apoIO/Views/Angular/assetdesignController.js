app.controller('assetdesignController', function($scope) { 
    /***GLOBAL VARIABLES***/
     var elementdata = '';
     var lastSrl='';     
     var elementsChildListItems ='';
     var previousList=[];
  
/***Asset Database***/
     var url = baseServiceUrl+'assetdatabases?path=\\\\' + afServerName + '\\' + afDatabaseName;       
            var ajaxEF =  processJsonContent(url, 'GET', null);
                $.when(ajaxEF).fail(function () {
                    warningmsg("Cannot Find the Assetdatabases.");
                    console.log("Cannot Find the Assetdatabases.");
                });
                $.when(ajaxEF).done(function () {
                    var WebId = (ajaxEF.responseJSON.WebId);
                    /***Elements Templates BY Category***/  
                          var url = baseServiceUrl+'assetdatabases/' + WebId + '/elementtemplates?field=Categories&query='+filterCategoryName+'&searchFullHierarchy=true'; 
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
                    /***Elements Templates BY Category***/ 
                            $("#elementTemplatesLeft").change(function(){
                                $("#elementListLeft").empty();
                                $("#elementTemplatesRight").empty();
                                $("#elementListRight").empty();
                                var leftTemplate = $("#elementTemplatesLeft").val();
                                 /***ElementsListByTemplate***/  
                                var url = baseServiceUrl+'assetdatabases/' + WebId + '/elements?templateName='+leftTemplate+'&searchFullHierarchy=true'; 
                                var rightelementdata =  processJsonContent(url, 'GET', null);
                                    $.when(rightelementdata).fail(function () {
                                        warningmsg("Cannot Find the Element.");
                                        console.log("Cannot Find the Element.");
                                    });
                                    $.when(rightelementdata).done(function () {  
                                         var elementsItems = (rightelementdata.responseJSON.Items);                                         
                                         $("#elementTemplatesRight").append("<option value='' selected disabled>---Select Elements---</option>");
                                         var sr= 1;
                                         $.each(elementsItems,function(key) {
                                             $("#elementTemplatesRight").append("<option data-name="+elementsItems[key].Name+" data-id="+sr+" value="+elementsItems[key].WebId+">"+elementsItems[key].Name+"</option>");
                                            sr++;
                                         });
                                     });
                                    /***ElementsListByTemplate***/
                                    
                                    /***ElementsListByCategory***/  
                                 var catName= catNameGenrate+leftTemplate.toLowerCase();
                                 console.log(catName);
                                        var url = baseServiceUrl+'assetdatabases/' + WebId + '/elements?categoryName='+catName+'&searchFullHierarchy=true';
                                         elementdata =  processJsonContent(url, 'GET', null);
                                        $.when(elementdata).fail(function () {
                                            warningmsg("Cannot Find the Element of this Category");
                                            return false;
                                        });
                                        $.when(elementdata).done(function () {
                                             var elementsCatItems = (elementdata.responseJSON.Items);
                                              var csr= 1;
                                            $.each(elementsCatItems,function(key) {
                                                $("#elementListLeft").append('<li class="elemList elemList'+csr+'"><input type="radio" id="elemList'+csr+'" data-id="'+csr+'" data-name="'+elementsCatItems[key].Name+'" value="'+elementsCatItems[key].WebId+'" name="selectorLeft"><label class="labelList leftLabel btn btn-primary" for="elemList'+csr+'">'+elementsCatItems[key].Name+'</label></li>');
                                              csr++;  
                                            });
                                            lastSrl=csr;
                                        });
                                /***ElementsListByCategory***/  
                            });
                    });
                    
                    /***shiftRight***/
                   $("#shiftRight").click(function(){  
                        if (!$("input[name='selectorLeft']:checked").val()) {
                                warningmsg("No Left Element Selected..!");
                                 return false;
                            }
                        else {                         
                           var WebId = $("input[name='selectorLeft']:checked").val();
                           var sr = $("input[name='selectorLeft']:checked").attr("data-id");
                           var name = $("input[name='selectorLeft']:checked").attr("data-name");
                           var RightWebId = $("#elementTemplatesRight").val(); 
                           if(RightWebId!=='? object:null ?'){
                               if(WebId!==RightWebId){
                                  $("#elementListRight").append('<li class="subelemList elemRightList'+sr+'"><input type="radio" id="elemRightListPush'+sr+'" data-id="'+sr+'" data-name="'+name+'"  value="'+WebId+'"  name="selectorRight"><label class="labelList childLabel btn btn-success" for="elemRightListPush'+sr+'">'+name+' </label></li>');
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
                                warningmsg("No Right Element Selected..!");
                                 return false;
                             }
                             else {   
                                var WebId = $("input[name='selectorRight']:checked").val();
                                var sr = $("input[name='selectorRight']:checked").attr("data-id");
                                var name = $("input[name='selectorRight']:checked").attr("data-name");
                                $(".elemRightList"+sr).remove();
                                 $("#elementListLeft").append('<li class="elemList elemList'+sr+'"><input type="radio" id="elemList'+sr+'" data-id="'+sr+'" data-name="'+name+'" value="'+WebId+'" name="selectorLeft"><label class="labelList leftLabel btn btn-primary" for="elemList'+sr+'">'+name+'</label></li>');
                             }
                   });
                   /***shiftLeft***/                   

/***Right Drop Down OnChange***/  
$("#elementTemplatesRight").change(function(){    
    while(previousList.length > 0) {
        previousList.pop();
    }
    $("#elementListLeft").empty();    
    $("#elementListRight").empty();   
    var WebId = $(this).val();
    var sr = $('#elementTemplatesRight option:selected').data("id");
    var name = $('#elementTemplatesRight option:selected').data("name");
                                    
    var elementsItems = (elementdata.responseJSON.Items);
    var srn= 1;
    $.each(elementsItems,function(key) {
        if(WebId===elementsItems[key].WebId){
            $("#elementListLeft").append('<li class="elemList elemList'+srn+'"><input type="radio" id="elemList'+srn+'" data-id="'+srn+'" data-name="'+elementsItems[key].Name+'" value="'+elementsItems[key].WebId+'" disabled="" name="selectorLeft"><label class="labelList leftLabel btn btn-primary" for="elemList'+srn+'">'+elementsItems[key].Name+'</label></li>');
        }else{
            $("#elementListLeft").append('<li class="elemList elemList'+srn+'"><input type="radio" id="elemList'+srn+'" data-id="'+srn+'" data-name="'+elementsItems[key].Name+'" value="'+elementsItems[key].WebId+'" name="selectorLeft"><label class="labelList leftLabel btn btn-primary" for="elemList'+srn+'">'+elementsItems[key].Name+'</label></li>');    
        }
        srn++;
     });
    $("#elementListRight").append('<li class="elemRightList elemRightListMain'+sr+'"><input type="radio" id="elemRightList'+sr+'" data-id="'+sr+'" data-name="'+name+'"  value="'+WebId+'" checked="" name="selectorMainRight"><label class="labelList rightLabel btn btn-success_light" for="elemRightListMain'+sr+'">'+name+' </label></li>');
     /***ElementsListByRightOnchange***/  
        var url = baseServiceUrl+'elements/' + WebId + '/elements'; 
        var rightelementList =  processJsonContent(url, 'GET', null);
            $.when(rightelementList).fail(function () {
                warningmsg("Cannot Find the Element On Change.");
                console.log("Cannot Find the Element.");
            });
            $.when(rightelementList).done(function () {                 
                 elementsChildListItems = (rightelementList.responseJSON.Items);                                         
                 var srt= lastSrl;
                 $.each(elementsChildListItems,function(key) {
                      previousList.push(elementsChildListItems[key].WebId);
                      $.each($("input[name='selectorLeft']"), function(){
                         var LeftWebId =$(this).val();
                         var id = $(this).attr("data-id");
                         if(LeftWebId===elementsChildListItems[key].WebId){
                             $(".elemList"+id).remove();//attr('disabled', 'disabled');
                         }else{}
                        });
                      $("#elementListRight").append('<li class="subelemList elemRightList'+srt+'"><input type="radio" id="elemRightListChild'+srt+'" data-id="'+srt+'" data-name="'+elementsChildListItems[key].Name+'"  value="'+elementsChildListItems[key].WebId+'"  name="selectorRight"><label class="labelList childLabel btn btn-success" for="elemRightListChild'+srt+'">'+elementsChildListItems[key].Name+'</label></li>');
                    
                    srt++;
                 });
             });
    /***ElementsListByRightOnchange***/ 
    
   
});
/***Right Drop Down OnChange***/  

/*****buildElementReference*****/
function isDoubleClicked(element) {
    //if already clicked return TRUE to indicate this click is not allowed
    if (element.data("isclicked")) return true;
    //mark as clicked for 1 second
    element.data("isclicked", true);
    setTimeout(function () {
        element.removeData("isclicked");
    }, 1000);
    //return FALSE to indicate this click was allowed
    return false;
}

$("#buildElementReference").click(function(){
    if (isDoubleClicked($(this))) return;
    var ParentWebId = $("#elementTemplatesRight").val();
    var currentList=[];   
    //var matchedList =[];
    var addedList = [];
    var removedList =[]; 
   $.each($("input[name='selectorRight']"), function(){
        var ChildWebId = $(this).val();
        currentList.push(ChildWebId);       ;
      });     
       // matchedList = previousList.filter(function(n){ return currentList.indexOf(n)>-1?n:false;});
        addedList = currentList.filter(function(n){ return previousList.indexOf(n)>-1?false:n;});
        removedList = previousList.filter(function(n){ return currentList.indexOf(n)>-1?false:n;});
        
//        console.log("previousList: "+previousList);
//        console.log("currentList: "+currentList);
//         console.log("addedList: "+addedList);
//          console.log("removedList: "+removedList);
        
        $.each($(addedList), function(key){
            if(ParentWebId!==''){
                if(ParentWebId!=='? object:null ?'){      
                          var url = baseServiceUrl+'elements/' + ParentWebId + '/referencedelements?WebId='+ParentWebId+'&referencedElementWebId='+addedList[key]+'&referenceType=Weak+Reference&startIndex=0'; 
                             var postAjaxEF = processJsonContent(url, 'POST', null);
                             $.when(postAjaxEF).fail(function () {
                                errormsg("Cannot Post The Data..!");
                                return false;
                             });
                             $.when(postAjaxEF).done(function () {
                                 var response = (JSON.stringify(postAjaxEF.responseText));
                                 if(response=='""'){                                     
                                      previousList.push(addedList[key]);
                                 }else{
                                     var failure = postAjaxEF.responseJSON.Items;
                                      $.each(failure,function(key) {
                                         warningmsg("Status: "+failure[key].Substatus+" <br> Message: "+failure[key].Message);
                                         return false;
                                      });
                                 }
                             });

                    }else{        
                      warningmsg("Parent Element Selection Required..!"); return false;
                    }
                }else{        
                  warningmsg("Element Selection Required..!"); return false;
                }
        }); 
       var remval=0;
       var remlen = removedList.length;
        $.each($(removedList), function(key){
             if(ParentWebId!==''){
                if(ParentWebId!=='? object:null ?'){      
                          var url = baseServiceUrl+'elements/' + ParentWebId + '/referencedelements?WebId='+ParentWebId+'&referencedElementWebId='+removedList[key]; 
                             var postAjaxEF = processJsonContent(url, 'DELETE', null);
                             $.when(postAjaxEF).fail(function () {
                                //errormsg("Cannot Post The Data..!");
//                                console.log("remlen "+remlen); 
//                                 console.log("remval "+remval); 
                                if(++remval === remlen) {
                                       //console.log(remval);
                                       warningmsg((remval)+" Element Cannot Removed..!<br> Not a Weak Reference");
                                      }                               
                                //return false;
                             });
                             $.when(postAjaxEF).done(function () {
                                 var response = (JSON.stringify(postAjaxEF.responseText));
                                 if(response=='""'){
                                     previousList.pop(removedList[key]);
                                     if(++remval === remlen) {
                                       //console.log(remval);
                                       successmsg((remval)+" Element Removed Successfully..!");
                                      } 
                                 }else{
                                     var failure = postAjaxEF.responseJSON.Items;
                                      $.each(failure,function(key) {
                                         warningmsg("Status: "+failure[key].Substatus+" <br> Message: "+failure[key].Message);
                                         return false;
                                      });
                                 }
                             });

                    }else{        
                      warningmsg("Parent Element Selection Required..!"); return false;
                    }
                }else{        
                  warningmsg("Element Selection Required..!"); return false;
                }                
        });        
        if(addedList.length > 0){ 
          successmsg((addedList.length)+" Element Created Successfully..!");
        }
        
//      if(removedList.length > 0){ 
//        //successmsg((removedList.length)+" Element Removed Successfully..!");
//        console.log("length"+removedList.length);
//      }        
});
/******buildElementReference******/
});