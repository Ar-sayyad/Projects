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
  //updateChart(100);	
//setInterval(function(){updateChart()}, updateInterval);
});

function getMap(id){    
      var data=[];
      var min=0; 
      var max=100; 
 $.each($("input[name='selectorLeft']:checked"), function(){
        var value = $(this).attr("data-value");
        var name = $(this).attr("data-name");
        var WebId = $(this).val();           
          data.push({
              name: name,
              data: [(Math.floor((Math.random() * (+max - +min)) + +min)), (Math.floor((Math.random() * (+max - +min)) + +min)), (Math.floor((Math.random() * (+max - +min)) + +min)), (Math.floor((Math.random() * (+max - +min)) + +min)), (Math.floor((Math.random() * (+max - +min)) + +min)), (Math.floor((Math.random() * (+max - +min)) + +min))]
          });	
       // currentList.push({"WebId":WebId,"value:":value}); 
       
    }); 
Highcharts.chart('container', {
    title: {
        text: ''
    },

    subtitle: {
        text: ''
    },

    yAxis: {
        title: {
            text: 'Element Data'
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: 2010
        }
    },

    series: data,

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

});

  console.log(data);
}