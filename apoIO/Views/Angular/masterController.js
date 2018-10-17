app.controller('masterController', function($scope) {
    $scope.itemList = [];
 
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
                         var list = [];
                        var Items = (elementTemplates.responseJSON.Items);
                        $.each(Items,function(key) {                          
                           list.push(Items[key].Name);  
                           //list.push('id:'+Items[key].WebId+', name:'+Items[key].Name+',');       
                           //$("#elementTemplates").append("<option value="+Items[key].WebId+">"+Items[key].Name+"</option>");                          
                            });   
                             console.log("Element Name : "+ list);
                             $scope.list = list;

                                $scope.changedValue = function(item) {
                                  $scope.itemList.push(item);
                                }       
                        });
                        //console.log("Event frame created successfully.\n"+JSON.stringify(ajaxEF));
                    });
                    

    $scope.GetValue = function (fruit) {
                var fruitId = $scope.ddlFruits;
                var fruitName = $.grep($scope.list, function (fruit) {
                    return fruit.Id == fruitId;
                })[0].Name;
                alert("Selected Value: " + fruitId + "\nSelected Text: " + fruitName);
            }
    
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