app.controller('masterController', function($scope) {
var now = new Date();
    $(function() {   
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
      var h = now.getHours(),
          m = now.getMinutes(),
          s = now.getSeconds();
      if(h < 10) h = '0' + h; 
      if(m < 10) m = '0' + m; 
      if(s < 10) s = '0' + s;
      $('input[type="time"][name="time"]').attr({'value': h + ':' + m + ':' + s });
    });
    
    var url = baseServiceUrl+'assetdatabases?path=\\\\' + afServerName + '\\' + afDatabaseName; 
       var ajaxEF =  processJsonContent(url, 'GET', null);
           $.when(ajaxEF).fail(function () {
               warningmsg("Cannot Find the WebId.");
           });
            $.when(ajaxEF).done(function () {
               var WebId = (ajaxEF.responseJSON.WebId); 
               
                /****TEMPLATE ELEMENT SEARCH BY TEMPLATE NAME START****/
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
                    /****TEMPLATE ELEMENT SEARCH BY TEMPLATE NAME END****/ 
               });
    
    /*****BLOCK ELEMENT ONCHNAGE START****/
    $("#elementList").change(function (){
        var elementName = $("#elementList option:selected").attr("data-name");//BLOCK ELEMENT NAME FOR IFRAME GRAPH GENERATION
        var iframeUrl= iframeConfigUrl+'?name='+elementName; //IFRAME URL 
        //$scope.url = iframeUrl;
        //var frame = '<iframe class="iframeMap" src="'+iframeUrl+'"  allowfullscreen="true" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media"></iframe>';
        $('.iframeMap').attr('src', iframeUrl);  
       // $("#iframeLoad").html(frame);
        console.log(iframeUrl);
        $("#container").empty();
        $("#attributesListLeft").empty();
        $(".tableAttributes").empty();
        $("#elementChildList").empty();
        $(".tableAttributes").append('<div class="attributeData"><div class="attrHead">NAME<BR>VALUE<BR><span>(Timestamp)</span></div></div>');
        var WebId = $("#elementList").val();
   
    /***GET CHILD ELEMENTS OF SELECTED BLOCK ELEMENT START***/  
        var url = baseServiceUrl+'elements/' + WebId + '/elements'; 
        var childElementList =  processJsonContent(url, 'GET', null);
            $.when(childElementList).fail(function () {
                //warningmsg("Cannot Find the Child Element On Change.");
                console.log("Cannot Find the child Element.");
            });
            $.when(childElementList).done(function () {  
                $("#elementChildList").append("<option value='' selected disabled>---Select Elements---</option>");
                 var elementsChildListItems = (childElementList.responseJSON.Items);     
                 $.each(elementsChildListItems,function(key) {
                      $("#elementChildList").append("<option data-name="+elementsChildListItems[key].Name+" value="+elementsChildListItems[key].WebId+">"+elementsChildListItems[key].Name+"</option>"); 
                    });
            });
    /***GET CHILD ELEMENTS OF SELECTED BLOCK ELEMENT END***/   
    
    /*****GET CHART DATA AND VALUE AND TIMESTAMP ATTRIBUTES START****/
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
                                 $(".tableAttributes").append('<div class="attributeData"><div class="attrHead">'+attributesItems[key].Name+'<br>'+Value+' <b>'+Units+'</b><br><span>('+Timestamp+')</span></div></div>');
                                 }); 
                                 WebIdVal=attributesItems[key].WebId;
                             }
                        }
                     });
                    cat++;
                 });                                            
            });  
            /*****GET CHART DATA AND VALUE AND TIMESTAMP ATTRIBUTES END****/
            
            /*****LOAD EVENT FRAME DATA START****/
                var startDate = $('#startDate').val();
                var startTime = $("#startTime").val();
                var startDateTime = (startDate + 'T' + startTime+'Z');
                var endDate = $('#endDate').val();
                var endTime = $("#endTime").val();
                var endDateTime = (endDate + 'T' + endTime+'Z'); 
                var eventFrameList=[];
                var data=[];
                var sdate ='';
                var stime ='';
                var edate ='';
                var etime ='';
                var y=0;
                var url = baseServiceUrl + 'elements/' + WebId + '/eventframes?startTime='+startDateTime+'&endTime='+endDateTime+'&searchFullHierarchy=true'; 
                console.log(url);
                var eventFrameData =  processJsonContent(url, 'GET', null);
                    $.when(eventFrameData).fail(function () {
                        console.log("Cannot Find the Event Frames.");
                    });
                     $.when(eventFrameData).done(function () {
                          var eventFrames = (eventFrameData.responseJSON.Items);
                          //console.log(eventFrames);
                            $.each(eventFrames,function(key) {  
                                 var eventFrameName = eventFrames[key].Name;
                                eventFrameList.push(eventFrameName);                               
                                var eventFrameStartTime = eventFrames[key].StartTime;
                                var eventFrameEndTime = eventFrames[key].EndTime;
                                    sdate = eventFrameStartTime.substring(0,10);//start date
                                    stime = eventFrameStartTime.substring(11,19);//start time
                                    edate = eventFrameEndTime.substring(0,10);//end date
                                    etime = eventFrameEndTime.substring(11,19);//end time                                     
                                    sdate = sdate.split('-');//start date split array
                                    stime = stime.split(':');//start time split array
                                    edate = edate.split('-');//end date split array
                                    etime = etime.split(':');//end time split array
                                if(edate[0]==='9999'){var edyr=sdate[0]; var edmnth = now.getMonth();var eddt=now.getDate();var h = now.getHours();var m = now.getMinutes();var s = now.getSeconds(); eventFrameEndTime="Running";}
                                else{var edyr=edate[0]; var edmnth = edate[1]-1; var eddt=edate[2];var h = etime[0];var m = etime[1];var s =etime[2];} //if Event Frame is Runnig Stage                              
                            data.push({
                                nm:eventFrameName,
                                sd:eventFrameStartTime,
                                ed:eventFrameEndTime,
                                x: Date.UTC(sdate[0], sdate[1]-1, sdate[2],stime[0],stime[1],stime[2]),
                                x2: Date.UTC(edyr, edmnth, eddt,h,m,s),
                                y: y,
                            });   
                              y++; //AXIS INCREAMENT
                            }); 
                         Highcharts.chart('eventFrame', {
                                chart: {
                                  type: 'xrange',
                                   zoomType: 'xy'
                                },
                                title: {
                                  text: ''
                                },
                                xAxis: {
                                  type: 'datetime'
                                },
                               tooltip: {
                                    shared: true,
                                    useHTML: true,
                                    headerFormat:'<table>',
                                    pointFormat: '<tr><th colspan="2" style="text-align: center;font-size:10px;"><b>{point.nm} </b></th></tr>' +
                                        '<tr><td style="font-size:10px;">Start: {point.sd} - End: {point.ed}</td></tr>',
                                    footerFormat: '</table>',
                                    valueDecimals: 2
                                },
                                yAxis: {
                                  title: {
                                    text: ''
                                  },
                                  categories: eventFrameList,
                                  reversed: true,
                                  labels: {
                                        enabled: false
                                    }
                                },
                                series: [{
                                     showInLegend: false, 
                                    name: 'Event Frames',
                                   pointPadding: 0,
                                   groupPadding: 0,
                                  borderColor: 'gray',
                                  pointWidth: 12,
                                  borderRadius:0,
                                  data: data,
                                  dataLabels: {
                                      format:'{point.nm}',
                                    enabled: true,
                                    style: {
                                        fontSize: '9',
                                        fontWeight:''
                                    }
                                  }
                                }]

                              });   
                     });
             /*****LOAD EVENT FRAME DATA END****/
            
  }); 
    /*****BLOCK ELEMENT ONCHNAGE END****/
    
     $("#elementChildList").change(function(){
        console.log("hello"); 
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
    var startDateTime = (startDate + 'T' + startTime+'Z');
    var endDate = $('#endDate').val();
    var nendDate = endDate.split('-');//for chart end point
    var endTime = $("#endTime").val();
    var endDateTime = (endDate + 'T' + endTime+'Z'); 
    var colors =['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']; //for chart color
     
    $.each($("input[name='selectorLeft']:checked"), function(){ 
        var data1=[];
        var WebId = $(this).val();
        var name = $(this).attr("data-name");
        var url = baseServiceUrl+'streams/' + WebId + '/interpolated?startTime='+startDateTime+'&endTime='+endDateTime+'&searchFullHierarchy=true'; 
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
                    else if(name==='KU'){min=0;max= 200;}
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

  