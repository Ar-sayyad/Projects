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
      $('input[type="time"][name="starttime"]').attr({'value':'00:00:00' });
       $('input[type="time"][name="endtime"]').attr({'value': h + ':' + m + ':' + s });
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
        $('.iframeMap').attr('src', iframeUrl);
        console.log(iframeUrl);//IFRAME URL DISPLAY IN CONSOLE.LOG
        $("#container").empty();
        $("#attributesListLeft").empty();
        $(".tableAttributes").empty();
        $("#elementChildList").empty();
         $("#cellGraphList").empty();        
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
                                <input type="checkbox" id="elemList'+cat+'" data-id="'+cat+'"  data-name="'+attributesItems[key].Name+'" onchange="getMap();" class="paraList" value="'+attributesItems[key].WebId+'" name="selectorLeft">\n\
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
                                        var Value = (Math.round(attributesValue.responseJSON.Value * 100) / 100);
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
        loadEventFrame();//Loading Event Frames
    }); 
/*****BLOCK ELEMENT ONCHNAGE END****/
   
});

/****ADD CELL GRAPH START****/
   var maincell=1; //Child Chart Value Declaration
   function addCell(){       
        if (!$("#elementChildList option:selected").val()) {
            warningmsg("No Element Selected..!");
            return false;
        }
        else{  
            $("#cellGraphList").append('<div class="col-12 col-lg-6 col-xl-1 childListDiv'+maincell+'">\n\
                                <div class="card">\n\
                                    <div class="card-body childGraph style-1">\n\
                                        <ul id="cellgraph'+maincell+'"></ul>\n\
                                    </div>\n\
                                </div>\n\
                            </div>\n\
                            <div class="col-12 col-lg-6 col-xl-5 childListDiv'+maincell+'">\n\
                                <button  type="button" onclick="removeDiv('+maincell+');" class="btn btn-sm btn-danger childChartClose"><i class="fa fa-close"></i></button>\n\
                                <div class="card">\n\
                                    <div class="card-body childGraph" id="cellgraphChart'+maincell+'">\n\
                                        </div>\n\
                                </div>\n\
                            </div></div>');               
        $("#cellGraphList").show();  
            var inc = maincell;
            var childName = $("#elementChildList option:selected").attr("data-name");//childElementName
            var ChildWebId = $("#elementChildList").val();         //childWebId 
            /*****CHILD ATTRIBUTES LOAD START*****/
            var url = baseServiceUrl+'elements/' + ChildWebId + '/attributes'; 
            var childParaData =  processJsonContent(url, 'GET', null);
            $.when(childParaData).fail(function () {
                console.log("Cannot Find the child Parameters.");
            });
            $.when(childParaData).done(function () {
                $(".childGraph").append('<input type="hidden" id="childId'+inc+'" value="'+ChildWebId+'"><input type="hidden" id="childName'+inc+'" value="'+childName+'">');
                $("#cellgraph"+inc).append('<h6 sty>'+childName+'</h6>');
                 var childAttributesItems = (childParaData.responseJSON.Items);
                 var cat=1;
                 $.each(childAttributesItems,function(key) {  
                     var category = childAttributesItems[key].CategoryNames;                    
                     $.each(category,function(key1) {
                         if(trendCat===category[key1]){
                        $("#cellgraph"+inc).append('<li class="paramterListChild paramterList'+cat+'">\n\
                            <input type="checkbox" id="elemList'+inc+cat+'" data-id="'+cat+'"  data-name="'+childAttributesItems[key].Name+'" onchange="getChildMap('+inc+');" class="paraList getChildChart" value="'+childAttributesItems[key].WebId+'" name="selectorChild'+inc+'">\n\
                            <label class="labelListChild leftLabel" for="elemList'+inc+cat+'">'+childAttributesItems[key].Name+'</label>\n\
                            </li>');  
                        }
                    });                    
                    cat++;
                });
            });
             /*****CHILD ATTRIBUTES LOAD END*****/
            maincell++; 
            $('#elementChildList option:selected').remove();   ///Remove List Items   
        }        
     }
    /****ADD CELL GRAPH END****/ 
    
/***LOAD ALL CHARTS ON DATE OR TIME CHANGE***/
function getCharts(){   
    getMap();
    loadEventFrame();
    for(var i=1;i<maincell;i++){
    getChildMap(i);
    }
}
/***LOAD ALL CHARTS ON DATE OR TIME CHANGE***/
 
/***CLOSE CHILD CHART DIV***/
function removeDiv(id){
    var name= $("#childName"+id).val();
    var WebId= $("#childId"+id).val();
    $(".childListDiv"+id).remove();
     $("#elementChildList").append("<option data-name="+name+" value="+WebId+">"+name+"</option>"); 
}
/***CLOSE CHILD CHART DIV***/
 
/*****LOAD EVENT FRAME DATA START****/ 
function loadEventFrame(){
                var now = new Date();
                var WebId = $("#elementList").val();
                var startDate = $('#startDate').val();
                var startTime = $("#startTime").val();
                var startDateTime = (startDate + 'T' + startTime+'Z');
                var endDate = $('#endDate').val();
                var endTime = $("#endTime").val();
                var endDateTime = (endDate + 'T' + endTime+'Z'); 
                var eventFrameList=[];
                var data=[];
                var sdate ='',stime ='',edate ='',etime ='',y=0;
                var url = baseServiceUrl + 'elements/' + WebId + '/eventframes?startTime='+startDateTime+'&endTime='+endDateTime+'&searchFullHierarchy=true'; 
                var eventFrameData =  processJsonContent(url, 'GET', null);
                    $.when(eventFrameData).fail(function () {
                        console.log("Cannot Find the Event Frames.");
                    });
                     $.when(eventFrameData).done(function () {
                          var eventFrames = (eventFrameData.responseJSON.Items);
                            $.each(eventFrames,function(key) {  
                                var eventFrameName = eventFrames[key].TemplateName;
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
                                  type: 'xrange'
                                  // zoomType: 'xy'
                                },
                                title: {
                                  text: ''
                                },
                                xAxis: {
                                  type: 'datetime',
                                  
                                    //categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                                },
                                 plotOptions: {
                                    series: {
                                    shadow: false,                                        
                                    pointStart: Date.UTC(sdate[0], sdate[1]-1, sdate[2],stime[0],stime[1],stime[2]),
                                    pointEnd: Date.UTC(edate[0], edate[1]-1, edate[2],etime[0],etime[1],etime[2]),
                                    },
                                    candlestick: {
                                        lineColor: '#404048'
                                    }
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
                                    borderColor: '#ffffff',
                                    pointWidth: 10,
                                    borderRadius:0,
                                    data: data,
                                  dataLabels: {
                                      format:'{point.nm}',
                                      enabled: false,
                                    style: {
                                        fontSize: '9',
                                        fontWeight:''
                                    }
                                  }
                                }]

                              });   
                     });
                 }
             /*****LOAD EVENT FRAME DATA END****/
             
/****LOAD CHILD ATTRIBUTES CHARTS****/
 function getChildMap(maincell){
        var startDate = $('#startDate').val();
        var startTime = $("#startTime").val();
        var startDateTime = (startDate + 'T' + startTime+'Z');
        var endDate = $('#endDate').val();
        var endTime = $("#endTime").val();
        var endDateTime = (endDate + 'T' + endTime+'Z'); 
        var data=[];
        var yAxisData=[];
        var xAxis=[];
        var sr=0;
        $.each($("input[name='selectorChild"+maincell+"']:checked"), function(){ 
            var data1=[];
            var WebId = $(this).val();
            var name = $(this).attr("data-name");
            var url = baseServiceUrl+'streams/' + WebId + '/interpolated?startTime='+startDateTime+'&endTime='+endDateTime+'&searchFullHierarchy=true'; 
                //console.log(url);
            var attributesData =  processJsonContent(url, 'GET', null);
            $.when(attributesData).fail(function () {
                console.log("Cannot Find the Attributes.");
            });
            $.when(attributesData).done(function () {                 
                 var attributesDataItems = (attributesData.responseJSON.Items);
                 var unit = '';
                $.each(attributesDataItems,function(key) {
                        data1.push(Math.round(attributesDataItems[key].Value * 100) / 100);
                        xAxis.push(attributesDataItems[key].Timestamp);
                        unit = attributesDataItems[key].UnitsAbbreviation;                        
                  });   
                  //console.log(data1);
                  data1.pop();   
                   $.each(eventsColorsData,function(key) {
                       if(name===eventsColorsData[key].name){
                             data.push({
                                name: name,
                                type: 'spline',
                                yAxis: sr,
                                color:eventsColorsData[key].color,
                                data: data1,
                                tooltip: { valueSuffix: unit}
                            });  
                            yAxisData.push({
                                min:eventsColorsData[key].min,
                                max:eventsColorsData[key].max,
                                title: {text: ''},
                                labels: {format: '{value}'+unit,
                                    style: {color: eventsColorsData[key].color}
                                }
                            }); 
                       }
                   });         
                Highcharts.chart('cellgraphChart'+maincell, {
                        chart: {
                            //zoomType: 'xy'
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
                            backgroundColor: 'rgba(255,255,255,0.25)'
                        },
                    series: data //PI ATTRIBUTES RECORDED DATA
                });           
                sr++;
            });            
    });  
        }
/****LOAD CHILD ATTRIBUTES CHARTS****/

/*********MAIN CHARTS SECTION START**********/  
function getMap(){   
    var data=[];
    var yAxisData=[];
    var xAxis=[];
    var sr=0;
    var startDate = $('#startDate').val();
    var startTime = $("#startTime").val();
    var startDateTime = (startDate + 'T' + startTime+'Z');
    var endDate = $('#endDate').val();
    var endTime = $("#endTime").val();
    var endDateTime = (endDate + 'T' + endTime+'Z');      
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
                        data1.push((Math.round((attributesDataItems[key].Value) * 100) / 100));
                        xAxis.push(attributesDataItems[key].Timestamp);
                        unit = attributesDataItems[key].UnitsAbbreviation;
                  });  
                  //console.log(data1);
                   data1.pop(); 
                   $.each(eventsColorsData,function(key) {
                       if(name===eventsColorsData[key].name){
                             data.push({
                                name: name,
                                type: 'spline',
                                yAxis: sr,
                                color:eventsColorsData[key].color,
                                data: data1,
                                tooltip: { valueSuffix: unit}
                            });  
                            yAxisData.push({
                                min:eventsColorsData[key].min,
                                max:eventsColorsData[key].max,
                                title: {text: ''},
                                labels: {format: '{value}'+unit,
                                    style: {color: eventsColorsData[key].color}
                                }
                            }); 
                       }
                   });                            
                Highcharts.chart('container', {
                        chart: {
                            //zoomType: 'xy'
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
                            backgroundColor: 'rgba(255,255,255,0.25)'
                        },
                    series: data //PI ATTRIBUTES RECORDED DATA
                });           
                sr++;
            });            
    });    
}

  /*********MAIN CHARTS SECTION END**********/  

  