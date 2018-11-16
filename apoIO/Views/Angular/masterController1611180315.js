app.controller('masterController', function($scope) {
 $(function() {
    var now = new Date();
    var month = (now.getMonth() + 1);               
    var day = now.getDate();
    if (month < 10) 
        month = "0" + month;
    if (day < 10) 
        day = "0" + day;
    var today = now.getFullYear()+'-'+month + '-' + day;    
     $("#startDate").val(today);
    $( "#startDate").datepicker({dateFormat: 'yy-mm-dd',maxDate : '0'});
     $("#endDate").val(today);
    $( "#endDate").datepicker({dateFormat: 'yy-mm-dd',maxDate : '0'});
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
                    var url = baseServiceUrl + 'assetdatabases/' + WebId + '/elements?templateName=' + templateName+'&searchFullHierarchy=true';
                    //var url = baseServiceUrl+'assetdatabases/' + WebId + '/elementtemplates?field=Categories&query='+filterCategoryName+'&searchFullHierarchy=true'; 
                    var elementList =  processJsonContent(url, 'GET', null);
                    
                    $.when(elementList).fail(function () {
                        warningmsg("Cannot Find the Element Templates.");
                    });
                    $.when(elementList).done(function () {
                        var elementListItems = (elementList.responseJSON.Items);
                         var sr= 1;
                        $.each(elementListItems,function(key) {
                            $("#elementList").append("<option  data-name="+elementListItems[key].Name+" value="+elementListItems[key].WebId+">"+elementListItems[key].Name+"</option>"); 
                            sr++;
                            }); 
                        });                       
                    });
      
      
$("#elementList").change(function (){
    $("#container").empty();
    $("#attributesListLeft").empty();
    $(".tableAttributes tbody").empty();
    var WebId = $("#elementList").val();
     //console.log("WebId : "+ WebId);
     var url = baseServiceUrl + 'elements/' + WebId + '/attributes';
    //var url = baseServiceUrl+'elementtemplates/' + WebId + '/attributetemplates'; 
        var attributesList =  processJsonContent(url, 'GET', null);
            $.when(attributesList).fail(function () {
                console.log("Cannot Find the Attributes.");
            });
            $.when(attributesList).done(function () {
                 var attributesItems = (attributesList.responseJSON.Items);
                 var cat=1;
                 $.each(attributesItems,function(key) {  
                     var category = attributesItems[key].CategoryNames;                    
                     $.each(category,function(key1) {
                         if(trendCat===category[key1]){
                         //Attributes.push({name:attributesItems[key].Name,Cat:category[key1]});
                         $("#attributesListLeft").append('<li class="paramterList paramterList'+cat+'">\n\
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
  //updateChart(100);	
//setInterval(function(){updateChart()}, updateInterval);
 

});
  
function getMap(id){    
    var data=[];
    var yAxisData=[];
    var min='';
    var max= '';
    var sr=0;
    var startDate = $('#startDate').val();
    var startTime = $("#startTime").val();
    var startDateTime = (startDate + 'T' + startTime);
    var endDate = $('#endDate').val();
    var endTime = $("#endTime").val();
    var endDateTime = (endDate + 'T' + endTime); 
     var colors =['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']; 
     
    $.each($("input[name='selectorLeft']:checked"), function(){ 
        var data1=[];
        var WebId = $(this).val();
        var name = $(this).attr("data-name");
        var url = baseServiceUrl+'streams/' + WebId + '/recorded?startTime='+startDateTime+'&endTime='+endDateTime+'&searchFullHierarchy=true'; 
        //console.log(url);
        var attributesData =  processJsonContent(url, 'GET', null);
            $.when(attributesData).fail(function () {
                console.log("Cannot Find the Attributes.");
            });
            $.when(attributesData).done(function () {                 
                 var attributesDataItems = (attributesData.responseJSON.Items);
                 var unit = '';
                 //console.log(JSON.stringify(attributesDataItems));
                $.each(attributesDataItems,function(key) {
                    //var val = Math.round(attributesDataItems[key].Value);
                    //if(isNaN(val)){
                        data1.push(Math.round(attributesDataItems[key].Value));
                   // }
                   unit = attributesDataItems[key].UnitsAbbreviation;
                  });                    
                  data1.pop();                    
                  data.push({
                    name: name,
                    type: 'spline',
                    yAxis: sr,
                    color:colors[sr],
                    data: data1,
                    tooltip: { valueSuffix: unit}
                });  
                /***This part will be dynamic later By JSON array***/
                if(name==='BALANCE'){min=0;max= 200;}
                else if(name==='U'){min=0;max= 250;}
                else if(name==='KU'){min=0;max= 300;}
                 /***This part will be dynamic later By JSON array***/
                yAxisData.push({
                    min:min,
                    max:max,
                    title: {text: ''},
                    labels: {format: '{value}'+unit,
                        style: {color: colors[sr]}
                    }
                });
                             
                Highcharts.chart('container', {
                        chart: {
                            zoomType: 'xy'
                        },
                        title: {
                            text: ''
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis      : { 
                            type           : 'datetime',
                            tickInterval   : 24 * 3600 * 1000, //one day
                            labels         : {
                                rotation : 0
                            },
             //categories : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        },
                        yAxis: yAxisData,
                        tooltip: {
                            shared: true
                        },
                        legend: {
                            layout: 'vetical',
                            align: 'right',
                            x: 0,
                            verticalAlign: 'top',
                            y: 40,
                            floating: true,
                            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255,255,255,0.25)'
                        },
                        plotOptions: {
                                series: {
                                     animation: true,
                                     step: false,
                                    label: {
                                        connectorAllowed: true
                                    },
                                    pointStart:Date.UTC(2018,10,14),
                                    pointEnd: Date.UTC(2018,10,16),
                                    pointInterval: 36e5 //one hour
                                   // pointInterval   : 24 * 3600 * 1000 //one day
                                   // pointInterval   : 24 * 3600 * 1000 * 31//one month
                                }
                            },
                    series: data
                });           
                sr++;
            });            
    }); 
    
   
}

  



