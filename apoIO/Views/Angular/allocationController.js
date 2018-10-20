app.controller('allocationController', function($scope) { 
    //$scope.date = new Date();   
   $scope.intervalFunction = function(){
        $scope.date = Date.now();        
       // console.log($scope.date);
        $("#dateTime").val($scope.date);
    }
    setInterval(function() {
      $scope.intervalFunction();
    }, 1000);
  
 
//       setInterval(function(){
//            $scope.format = 'M/d/yy h:mm:ss a';
//             $scope.date = new Date($scope.format);
//             $("#dateTime").html($scope.date);
//             //console.log($scope.date);
//          }, 1000);
        //setTimeout(dataTime, 10000);
        //setInterval(function(){ tick()}, 1000);
/***Asset Database***/
     var url = baseServiceUrl+'assetdatabases?path=\\\\' + afServerName + '\\' + afDatabaseName;       
            var ajaxEF =  processJsonContent(url, 'GET', null);
                $.when(ajaxEF).fail(function () {
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
                                        });
                                       // $scope.currentState = '0';
                                        //console.log("Enumeration Values : "+JSON.stringify($scope.EnumerationValues));
                                });
               /***Enumeration Sets Values***/
                        });
        /***EnumerationSets***/
        
        /***elements***/                    
                    var url = baseServiceUrl+'assetdatabases/'+ WebId + '/elements'; 
                    var elements =  processJsonContent(url, 'GET', null);                    
                        $.when(elements).fail(function () {
                            console.log("Cannot Find the Element Templates.");
                        });
                    $.when(elements).done(function () {
                        $scope.List = [];
                        var Items = (elements.responseJSON.Items);
                            $.each(Items,function(key) {     
                               $scope.List.push({ id:Items[key].WebId, name:Items[key].Name });  
                            }); 
                            $scope.check = function () {
                /***attributesElements***/
                                var WebId = $scope.cardSelected;
                                var url = baseServiceUrl+'elements/' + WebId + '/attributes'; 
                                var attributesElements =  processJsonContent(url, 'GET', null);
                                    $.when(attributesElements).fail(function () {
                                        console.log("Cannot Find the Attributes.");
                                    });
                                    $.when(attributesElements).done(function () {
                                       $scope. Attributes = [];
                                         var attributesItems = (attributesElements.responseJSON.Items);
                                         $.each(attributesItems,function(key) {  
                                          $scope.Attributes.push({
                                              id:attributesItems[key].WebId,
                                              name:attributesItems[key].Name
                                          });
                                         // Attributes.push(attributesItems[key].Name);
                                        });                                            
                                         // console.log("Attributes : "+ Attributes);
                                    });
                /***attributesElements***/
                              };
                        });
        /***elements***/
                    });
/***Asset Database***/

});