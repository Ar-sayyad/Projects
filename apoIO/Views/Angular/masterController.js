app.controller('masterController', function($scope) {
     var url = baseServiceUrl+'assetdatabases?path=\\\\' + afServerName + '\\' + afDatabaseName; 
            var ajaxEF =  processJsonContent(url, 'GET', null);
                $.when(ajaxEF).fail(function () {
                    console.log("Cannot Find the WebId.");
                });
                $.when(ajaxEF).done(function () {
                    var WebId = (ajaxEF.responseJSON.WebId); 
                    var url = baseServiceUrl+'assetdatabases/'+ WebId + '/elementtemplates'; 
                    var elementTemplates =  processJsonContent(url, 'GET', null);
                    
                    $.when(elementTemplates).fail(function () {
                        console.log("Cannot Find the Element Templates.");
                    });
                    $.when(elementTemplates).done(function () {
                        $scope.List = [];
                        var Items = (elementTemplates.responseJSON.Items);
                        $.each(Items,function(key) {     
                           $scope.List.push({ id:Items[key].WebId, name:Items[key].Name });  
                           //$("#elementTemplates").append("<option ng-value='item.id' ng-repeat='item in List' class='ng-binding ng-scope' value='string:"+Items[key].WebId+"'>"+Items[key].Name+"</option>");  
                           //$("#elementTemplates").append("<option label="+Items[key].Name+" value="+Items[key].WebId+">"+Items[key].Name+"</option>");                          
                            }); 
                            $scope.check = function () {
                               // $scope.itemList.push($scope.cardSelected);
                                //console.log('cardSelected', $scope.cardSelected);
                                var WebId = $scope.cardSelected;
                                var url = baseServiceUrl+'elementtemplates/' + WebId + '/attributetemplates'; 
                                    var attributesTemplates =  processJsonContent(url, 'GET', null);
                                        $.when(attributesTemplates).fail(function () {
                                            console.log("Cannot Find the Attributes.");
                                        });
                                        $.when(attributesTemplates).done(function () {
                                           $scope.Attributes = [];
                                             var attributesItems = (attributesTemplates.responseJSON.Items);
                                             $.each(attributesItems,function(key) {  
                                              $scope.Attributes.push({
                                                  id:attributesItems[key].WebId,
                                                  name:attributesItems[key].Name,
                                                  Path:attributesItems[key].Path,
                                                  DefaultValue:attributesItems[key].DefaultValue
                                              });
                                              //Attributes.push(attributesItems[key].Name);
                                            });                                            
                                             // console.log("Attributes : "+ Attributes);
                                        });    
                              };
                        });                       
                    });
      
    /*********chart section**********/
    
    var dataPoints1 = [];
    var dataPoints2 = [];
      $scope.chart = new CanvasJS.Chart("chartContainer", {
          zoomEnabled: true,
	title: {
		text: ""
	},
	axisX: {
		title: ""
	},
	axisY:{
		prefix: "",
		includeZero: false
	}, 
	toolTip: {
		shared: true
	},
	legend: {
		cursor:"pointer",
		verticalAlign: "top",
		fontSize: 22,
		fontColor: "dimGrey",
		itemclick : toggleDataSeries
	},
		data: [{ 
		type: "line",
		xValueType: "dateTime",
		yValueFormatString: "####.00",
		xValueFormatString: "hh:mm:ss TT",
		showInLegend: true,
		name: "Company A",
		dataPoints: dataPoints1
		},
		{				
                    type: "line",
                    xValueType: "dateTime",
                    yValueFormatString: "####.00",
                    showInLegend: true,
                    name: "Company B" ,
                    dataPoints: dataPoints2
	}]
});

function toggleDataSeries(e) {
	if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
		e.dataSeries.visible = false;
	}
	else {
		e.dataSeries.visible = true;
	}
	$scope.chart.render();
}
var updateInterval = 3000;
// initial value
var yValue1 = 05; 
var yValue2 = 05;

var time = new Date;
// starting at 9.30 am
time.setHours(time.getHours());
time.setMinutes(time.getMinutes());
time.setSeconds(time.getSeconds());
time.setMilliseconds(time.getMilliseconds());

function updateChart(count) {
	count = count || 1;
	var deltaY1, deltaY2;
	for (var i = 0; i < count; i++) {
		time.setTime(time.getTime()+ updateInterval);
		deltaY1 = .5 + Math.random() *(-.5-.5);
		deltaY2 = .5 + Math.random() *(-.5-.5);

	// adding random value and rounding it to two digits. 
	yValue1 = Math.round((yValue1 + deltaY1)*100)/100;
	yValue2 = Math.round((yValue2 + deltaY2)*100)/100;

	// pushing the new values
	dataPoints1.push({
		x: time.getTime(),
		y: yValue1
	});
	dataPoints2.push({
		x: time.getTime(),
		y: yValue2
	});
	}

	// updating legend text with  updated with y Value 
        $scope.chart.options.data[0].legendText = " A " + yValue1;
	$scope.chart.options.data[1].legendText = " B " + yValue2; 
        $scope.chart.render(); //render the chart for the first time    
    }
 updateChart(100);	
setInterval(function(){updateChart()}, updateInterval);
});