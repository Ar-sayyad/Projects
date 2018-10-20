app.controller('allocationController', function($scope) {
     var url = baseServiceUrl+'assetdatabases?path=\\\\' + afServerName + '\\' + afDatabaseName; 
            var ajaxEF =  processJsonContent(url, 'GET', null);
                $.when(ajaxEF).fail(function () {
                    console.log("Cannot Find the WebId.");
                });
                $.when(ajaxEF).done(function () {
                    var WebId = (ajaxEF.responseJSON.WebId); 
                    var url = baseServiceUrl+'assetdatabases/'+ WebId + '/elementtemplates'; 
                    alert(url);
//                    var elementTemplates =  processJsonContent(url, 'GET', null);
                    
//                    $.when(elementTemplates).fail(function () {
//                        console.log("Cannot Find the Element Templates.");
//                    });
//                    $.when(elementTemplates).done(function () {
//                        $scope.List = [];
//                        var Items = (elementTemplates.responseJSON.Items);
//                        $.each(Items,function(key) {     
//                           $scope.List.push({ id:Items[key].WebId, name:Items[key].Name });  
//                           //$("#elementTemplates").append("<option ng-value='item.id' ng-repeat='item in List' class='ng-binding ng-scope' value='string:"+Items[key].WebId+"'>"+Items[key].Name+"</option>");  
//                           //$("#elementTemplates").append("<option label="+Items[key].Name+" value="+Items[key].WebId+">"+Items[key].Name+"</option>");                          
//                            }); 
//                            $scope.check = function () {
//                               // $scope.itemList.push($scope.cardSelected);
//                                //console.log('cardSelected', $scope.cardSelected);
//                                var WebId = $scope.cardSelected;
//                                var url = baseServiceUrl+'elementtemplates/' + WebId + '/attributetemplates'; 
//                                    var attributesTemplates =  processJsonContent(url, 'GET', null);
//                                        $.when(attributesTemplates).fail(function () {
//                                            console.log("Cannot Find the Attributes.");
//                                        });
//                                        $.when(attributesTemplates).done(function () {
//                                           $scope.Attributes = [];
//                                             var attributesItems = (attributesTemplates.responseJSON.Items);
//                                             $.each(attributesItems,function(key) {  
//                                              $scope.Attributes.push({
//                                                  id:attributesItems[key].WebId,
//                                                  name:attributesItems[key].Name,
//                                                  Path:attributesItems[key].Path,
//                                                  DefaultValue:attributesItems[key].DefaultValue
//                                              });
//                                              //Attributes.push(attributesItems[key].Name);
//                                            });                                            
//                                             // console.log("Attributes : "+ Attributes);
//                                        });    
//                              };
//                        });                       
                    });   
});