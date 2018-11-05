app.controller('masterController', function($scope) {
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
$(function(){     
  var d = new Date(),        
      h = d.getHours(),
      m = d.getMinutes();
  if(h < 10) h = '0' + h; 
  if(m < 10) m = '0' + m; 
  $('input[type="time"][name="time"]').attr({'value': h + ':' + m});
});
   
     var url = baseServiceUrl+'assetdatabases?path=\\\\' + afServerName + '\\' + afDatabaseName; 
            var ajaxEF =  processJsonContent(url, 'GET', null);
                $.when(ajaxEF).fail(function () {
                    warningmsg("Cannot Find the WebId.");
                });
                $.when(ajaxEF).done(function () {
                    var WebId = (ajaxEF.responseJSON.WebId); 
                    var url = baseServiceUrl+'assetdatabases/'+ WebId + '/elementtemplates'; 
                    var elementTemplates =  processJsonContent(url, 'GET', null);
                    
                    $.when(elementTemplates).fail(function () {
                        warningmsg("Cannot Find the Element Templates.");
                    });
                    $.when(elementTemplates).done(function () {
                        var elementTemplateItems = (elementTemplates.responseJSON.Items);
                         var sr= 1;
                        $.each(elementTemplateItems,function(key) {
                            $("#elementTemplates").append("<option  data-name="+elementTemplateItems[key].Name+" value="+elementTemplateItems[key].WebId+">"+elementTemplateItems[key].Name+"</option>"); 
                            sr++;
                            }); 
                        });                       
                    });
      
      
$("#elementTemplates").change(function (){
    $("#elementListLeft").empty();
    $(".tableAttributes tbody").empty();
    var WebId = $("#elementTemplates").val();
     //console.log("WebId : "+ WebId);
    var url = baseServiceUrl+'elementtemplates/' + WebId + '/attributetemplates'; 
        var attributesTemplates =  processJsonContent(url, 'GET', null);
            $.when(attributesTemplates).fail(function () {
                console.log("Cannot Find the Attributes.");
            });
            $.when(attributesTemplates).done(function () {
                 var attributesItems = (attributesTemplates.responseJSON.Items);
                 var cat=1;
                 $.each(attributesItems,function(key) {  
                     var category = attributesItems[key].CategoryNames;                    
                     $.each(category,function(key1) {
                         if(trendCat===category[key1]){
                         //Attributes.push({name:attributesItems[key].Name,Cat:category[key1]});
                         $("#elementListLeft").append('<li class="paramterList paramterList'+cat+'">\n\
                            <input type="checkbox" id="elemList'+cat+'" data-id="'+cat+'" data-value="'+attributesItems[key].DefaultValue+'" data-name="'+attributesItems[key].Name+'" onchange="getMap('+cat+');" class="paraList" value="'+attributesItems[key].WebId+'" name="selectorLeft">\n\
                            <label class="labelList leftLabel" for="elemList'+cat+'">'+attributesItems[key].Name+'</label>\n\
                            </li>');  
                        }
                        else if(valueCat===category[key1] || timestampCat===category[key1]){
                            $(".tableAttributes").append('<tr><td>'+attributesItems[key].Name+'</td><td>'+attributesItems[key].DefaultValue+'</td><td>03-11-2018 11:28AM</td></tr>');
                        }
                     });
                    cat++;
                  //Attributes.push({id:attributesItems[key].WebId, name:attributesItems[key].Name,Path:attributesItems[key].Path, DefaultValue:attributesItems[key].DefaultValue});
                  //Attributes.push({name:attributesItems[key].Name, DefaultValue:attributesItems[key].DefaultValue, CategoryName:JSON.stringify(attributesItems[key].CategoryNames)});
                });                                            
                 // console.log("Attributes : "+ JSON.stringify(Attributes));
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
 //updateChart(100);	
//setInterval(function(){updateChart()}, updateInterval);
});


function getMap(count=100){
   var yValue1 = 05; 
var yValue2 = 010;
var time = new Date;
// starting at 9.30 am
time.setHours(time.getHours());
time.setMinutes(time.getMinutes());
time.setSeconds(time.getSeconds());
time.setMilliseconds(time.getMilliseconds());

var dataPoints1=[];
var dataPoints2=[];

var updateInterval = 3000;

      var chart = new CanvasJS.Chart("chartContainer", {
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
	chart.render();
}
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
        chart.options.data[0].legendText = " A " + yValue1;
	chart.options.data[1].legendText = " B " + yValue2; 
        chart.render();
        

//setInterval(function(){updateChart()}, updateInterval);
}