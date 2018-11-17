app.controller('masterController', function($scope) {
 $(function() {
    var now = new Date();
    var month = (now.getMonth() + 1);  
    var emonth = (now.getMonth());
    var day = now.getDate();
    if (month < 10) 
        month = "0" + month;
    if (day < 10) 
        day = "0" + day;
    var start = now.getFullYear()+'-'+emonth + '-' + day;
    var end = now.getFullYear()+'-'+month + '-' + day;
     $("#startDate").val(start);
    $( "#startDate").datepicker({dateFormat: 'yy-mm-dd',maxDate : '0'});
     $("#endDate").val(end);
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
    $(".tableAttributes").empty();
    $(".tableAttributes").append('<div class="attributeData"><div class="attrHead attrName">NAME</div><div class="attrHead">VALUE<BR><span>(Timestamp)</span></div></div>');
    var WebId = $("#elementList").val();
     var url = baseServiceUrl + 'elements/' + WebId + '/attributes';
        var attributesList =  processJsonContent(url, 'GET', null);
            $.when(attributesList).fail(function () {
                warningmsg("Cannot Find the Attributes.");
            });            
            $.when(attributesList).done(function () {
                 var attributesItems = (attributesList.responseJSON.Items);
                 var cat=1;
                 var WebIdVal='';
                 $.each(attributesItems,function(key) {  
                     var category = attributesItems[key].CategoryNames;                    
                     $.each(category,function(key1) {
                         if(trendCat===category[key1]){
                         $("#attributesListLeft").append('<li class="paramterList paramterList'+cat+'">\n\
                            <input type="checkbox" id="elemList'+cat+'" data-id="'+cat+'"  data-name="'+attributesItems[key].Name+'" onchange="getMap('+cat+');" class="paraList" value="'+attributesItems[key].WebId+'" name="selectorLeft">\n\
                            <label class="labelList leftLabel" for="elemList'+cat+'">'+attributesItems[key].Name+'</label>\n\
                            </li>');  
                        }
                        
                        else if(timestampCat===category[key1] || valueCat===category[key1]){
                            if(WebIdVal==='' || WebIdVal!==attributesItems[key].WebId){
                            var url = baseServiceUrl + 'streams/' + attributesItems[key].WebId + '/value';
                           // console.log(url+" "+attributesItems[key].Name);
                            var attributesValue =  processJsonContent(url, 'GET', null);
                                $.when(attributesValue).fail(function () {
                                    console.log("Cannot Find the Attributes Values.");
                                });
                                $.when(attributesValue).done(function () {
                                    var Value = Math.round(attributesValue.responseJSON.Value);
                                     var Units = (attributesValue.responseJSON.UnitsAbbreviation);
                                    var Timestamp = (attributesValue.responseJSON.Timestamp).substring(0,10);
                                 $(".tableAttributes").append('<div class="attributeData"><div class="attrName">'+attributesItems[key].Name+'</div><div>'+Value+' <b>'+Units+'</b><br><span>('+Timestamp+')</span></div></div>');
                                 }); 
                                 WebIdVal=attributesItems[key].WebId;
                             }
                        }
//                        if(category[key1]===valueCat && category[key1]===timestampCat){
//                            
//                            $(".tableAttributes").append('<div class="col-12 tableAttributes"><div class="attributeData"><h6>'+attributesItems[key].Name+'</h6><h6>99</h6><h6>2018-11-15T11:50:00Z</h6></div></div>');
//                            //$(".tableAttributes").append('<tr><td>'+attributesItems[key].Name+'</td><td>'+attributesItems[key].DefaultValue+'</td><td>03-11-2018 11:28AM</td></tr>');
//                        }
                     });
                    cat++;
                 });                                            
            });    
  });       
});

  /*********chart section start**********/
  
function getMap(id){    
    var data=[];
    var yAxisData=[];
    var xAxis=[];
    var min=''; //chart y axis min value
    var max= '';//chart y axis max value
    var sr=0;
    var startDate = $('#startDate').val();
    var nstartDate = startDate.split('-');//for chart start point
    var startTime = $("#startTime").val();
    var startDateTime = (startDate + 'T' + startTime);
    var endDate = $('#endDate').val();
    var nendDate = endDate.split('-');//for chart end point
    var endTime = $("#endTime").val();
    var endDateTime = (endDate + 'T' + endTime); 
    var colors =['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']; //for chart color
     
    $.each($("input[name='selectorLeft']:checked"), function(){ 
        var data1=[];
        var WebId = $(this).val();
        var name = $(this).attr("data-name");
        var url = baseServiceUrl+'streams/' + WebId + '/recorded?startTime='+startDateTime+'&endTime='+endDateTime+'&searchFullHierarchy=true'; 
       // console.log(url);
        var attributesData =  processJsonContent(url, 'GET', null);
            $.when(attributesData).fail(function () {
                console.log("Cannot Find the Attributes.");
            });
            $.when(attributesData).done(function () {                 
                 var attributesDataItems = (attributesData.responseJSON.Items);
                 var unit = '';
                $.each(attributesDataItems,function(key) {
                        data1.push(Math.round(attributesDataItems[key].Value));
                        xAxis.push(attributesDataItems[key].Timestamp);
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
                    else if(name==='KU'){min=0;max= 10;}
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
                         xAxis: [{
                                categories: xAxis,
                                crosshair: true
                            }],
//                        xAxis:{ 
//                            type: 'datetime',
//                            tickInterval: 24 * 3600 * 1000, //one day
//                            labels:{rotation : 0},
//                        },
                        yAxis: yAxisData, //Y AXIS RANGE DATA
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
                            backgroundColor: 'rgba(255,255,255,0.25'
                        },
//                        plotOptions: {
//                                series: {
//                                     animation: true,
//                                     step: false,
//                                    label: {
//                                        connectorAllowed: true
//                                    },
//                                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
//                                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
//                                   // pointStart:Date.UTC(nstartDate[0],nstartDate[1]-1,nstartDate[2]),
//                                   // pointEnd: Date.UTC(nendDate[0],nendDate[1]-1,nendDate[2]),
//                                    //pointInterval: 36e5 //one hour
//                                    //pointInterval   : 24 * 3600 * 1000 //one day
//                                   // pointInterval   : 24 * 3600 * 1000 * 31//one month
//                                }
//                            },
                    series: data //PI ATTRIBUTES RECORDED DATA
                });           
                sr++;
            });            
    });    
}

/*********chart section end**********/

  