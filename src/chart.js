
var varName = 'relativeSalary1';
var variantSelect = 'gradient';
var colorSelect = 'GreenOrange';

var legendColors = {
	"GreenOrange" : ['#75995A','#90B144',"#AAC92D",'#C5D123',"#E0D819","#E7CA15","#EEBB11",'#F6AB0D',"#FD9B08"],
	"BlueOrange" : ["#69D2E7",'#84DDEE',"#9fe7f5",'#C0E6E1',"#E0E4CC",'#EAB57E',"#F38630",'#F77818',"#FA6900"],
	"LightGreenOrange" : ["#BBBB88",'#C4C18B',"#CCC68D",'#DDD293',"#EEDD99",'#EED095',"#EEC290",'#EEB68C',"#EEAA88"]
}


// var legendProperties = {
// 		"texts" : {
// 				"gradient" : { "BMPH" : ['0','0.2','0.4','0.6','0.8','1'],
// 							   "McWages" : ['0','20','40','60','80','100'],
// 							   "McWages_PPP" : ['0','20','40','60','80','100'],
// 							   "BigMacPrice" : ['0','20','40','60','80','100'],
// 							   "MinWage" : ['No','Yes']
// 							   								}
// 					},
// 		"minmax" : {
// 				"BMPH" : [0,1],
// 				"McWages" : [0,100],
// 				"McWages_PPP":[0,100],
// 				"BigMacPrice" : [0,100],
// 				"MinWage" : [0,1]
// 		},
// 		"colors" : {
// 			"gradient" : {
// 				"GreenOrange" : ['#75995A','#90B144',"#AAC92D",'#C5D123',"#E0D819","#E7CA15","#EEBB11",'#F6AB0D',"#FD9B08"],
// 				"BlueOrange" : ["#69D2E7",'#84DDEE',"#9fe7f5",'#C0E6E1',"#E0E4CC",'#EAB57E',"#F38630",'#F77818',"#FA6900"],
// 				"LightGreenOrange" : ["#BBBB88",'#C4C18B',"#CCC68D",'#DDD293',"#EEDD99",'#EED095',"#EEC290",'#EEB68C',"#EEAA88"]
// 				}
// 			}
// 		};

var max;
var min;
var colorScale;
var tooltipfloat;
var zoomTransform;
var fZoom;

// CONTROLLING VARIANTS AND VARIABLES

function changeVariant(variant,colors,id)
{
	    $(".credit a").removeClass("activeVariant");
	    $('#' + id).addClass("activeVariant");


	colorSelect = colors
	variantSelect = variant;
	LoadMap();
	LoadDesc();
};
//
// function changeYear(xYear)
// {
// 	year = xYear;
// 	$('#btnYear').html(xYear + '  <img src="src/down-arrow.png" class="menu-icon" />');
// 	LoadMap();
// }

function changeVar(xVar)
{
	varName = xVar;
	$('#btnVar').html(data.Variables[xVar].fullName + '  <img src="src/down-arrow.png" class="menu-icon" />' );
	LoadMap();
	LoadDesc();
}

// MAIN LOADING FUNCTIONS
function LoadMap_First()
{
	LoadMap();
	LoadDesc();

	TransformZoom(-59,-150,1.15,'');
}

function LoadDesc()
{
	vari = data.Variables[varName]

	$('#desVarName').text(vari.fullName);
	$('#desVarDesc').text(vari.Description + '(' + vari.unit + '; ' +vari.year + ')');
	oecd = 'Podrobnější informace jsou k dispozici v reportu OECD na straně %pg v kapitole %ch. Data lze také stáhnout přímo <a href="%l">zde</a>'
	oecd.replace('%pg',vari.sourcePage)
	oecd.replace('%ch',vari.ref)
	oecd.replace('%l',vari.sourceLink)
	$('#desVarOECD').text(oecd);
}
function LoadMap()
{
	d3.select('#svgMap').attr("overflow", "hidden");

	max = data.Variables[varName].max;
	min = data.Variables[varName].min;

	fZoom = d3.zoom()
	.scaleExtent([1, 5])
	.on("zoom", zoomed);


	var svg = d3.select("#gContainer").call(fZoom)

	$('.ActiveState').removeClass('ActiveState');
	$('#linear-gradient').remove();

	if( variantSelect == 'gradient') {
		var linearGradient = d3.select('#defs').append('linearGradient').attr('id','linear-gradient');

		linearGradient // mozna ze y ma byt 50 %, podle obrazku v blogu
					.attr('x1','0%')
					.attr('y1','0%')
					.attr('x2','100%')
					.attr('y2','0%');

		colorScale = d3.scaleLinear().range(legendColors[colorSelect])
		linearGradient.selectAll('stop')
				.data(colorScale.range())
				.enter()
				.append('stop')
				.attr('offset',function(d,i) {return i/(colorScale.range().length-1);} )
				.attr('stop-color',function(d) {return d; });
	}

	var colorCont;
	var rangeCont;
	// if (variantSelect == 'gradient')
	// {
		colorCont = legendColors[colorSelect];
		rangeCont = generateDomRange(legendColors[colorSelect]);
	// }
	// else
	// {
	// 	colorCont = legendProperties.colors.discrete[colorSelect];
	// 	rangeCont = generateDomRange(legendProperties.colors.discrete[colorSelect]);
	// }

	$.each(data.Data,function(d)
		{
			var val = this[varName];
			if(val != 'NA')
				{
					$('#' +d).css('fill',ValToCol(val,colorCont,rangeCont));
					$('#' + d).addClass('ActiveState');

				}
			else
				{
					$('#' + d).css('fill','#AAAAAA')
				}
		}
    );
	handleEvents();
	drawLegend();
};
// HELPING FUNCTIONS - COLORS

function ValToCol(val,colorCont,rangeCont)
{
	var result = '';
	// TODO - ta druha nerovnost by tam byt nemela ale pak to nefunguje na extermnich hodnotach
	for (i =0; i < rangeCont.length; i++)
		{
			if((val >= rangeCont[i][0]) && (val <= rangeCont[i][1]))
				{
					result = colorCont[i];
					break;
				}
		}
	return result;
};

function generateDomRange(colorCont)
{
	var result = [];
	var inter = (max-min)/colorCont.length;
	var last = min;
	for( i = 0; i < colorCont.length; i++)
		{
			result.push([last, min + (i+1) * inter]);
			last = min + (i+1) * inter;
		}
	return result;
}

function generateLegendText()
{
	var max = data.Variables[varName].max;
	var min = data.Variables[varName].min;
	var count = data.Variables[varName].LegendCount;
	var inter = data.Variables[varName].LegendInterval;
  	var round = data.Variables[varName].round;
	var result = [];
	var last = min;
	for( i = 0; i < count + 1; i++)
		{
			//result.push([last, min + (i+1) * inter]);
			result.push(last.toFixed(round))
			last = last + inter;
		}
	return result;
}



function drawLegend()
{
	 d3.select("#svgLegend").selectAll("*").remove();
	var svgLegend = d3.select('#svgLegend');
	// 	svgLegend.append('text')
	// 	.attr('class','legend-text')
	// 	.attr('y','18px')
	// 	.text(data.Variables[varName].fullName)

	var colors;
	var texts;


	rectWidth = 300;
	svgLegend.append('rect')
		.attr('id','rectGradient')
		.attr('width',rectWidth)
		.attr('height',10)
		.attr('x',180)
		.attr('y',15)
		.style('fill','url(#linear-gradient)');

 	texts = generateLegendText();
	interval = rectWidth /(texts.length-1)
	svgLegend.selectAll('g')
		.data(texts)
		.enter()
		.append('text')
		.attr('class','legend-text')
		.attr('x',function (d,i) { return 180 + i * interval; })
		.attr('y',40)
		.attr('text-anchor','middle')
		.text(function (d) {return d;})
};

function zoomed() {
	g = d3.select('#gContainer');
		d3.zoomIdentity = d3.zoomTransform(g.node());

	  g.attr("transform", d3.event.transform);
	};



function TransformZoom(X,Y,k,ZoomName){
	s = 'translate(' + X + ',' + Y +') scale (' + k +')';
	g = d3.select('#gContainer').transition().duration(750).attr('transform',s);

	z = d3.zoomTransform(g.node());
	z.k = k;
	z.y = Y;
	z.x = X;

	if (ZoomName != '')
		{
			$('#btnZoom').html(ZoomName  +    '  <img src="src/down-arrow.png" class="menu-icon" />');
			$('#divZoomOut').css('display','inline-block');
		}
	else
		{
			$('#btnZoom').html('Přiblížit region  ' +  '<img src="src/down-arrow.png" class="menu-icon" />')
			$('#divZoomOut').css('display','none')
		}
	fZoom.transform("",z);
};

function handleEvents()
{

	HasData = true;
	if (data.Data.hasOwnProperty(this.id)) {
		if (data.Data[this.id][varName] == "NA")
		{
			HasData = false;
		}
	}
if (HasData) {
	d3.select('#tooltip').selectAll("*").remove();
			div = d3.select('#tltpflt')
			tooltip = d3.select('body').append('div')
				.attr('class','tooltipfloat')
				.style('opacity',0);

			g = d3.selectAll('.state')
				.on('mouseover', function () {
					if (HasData){
							tooltip.transition()
							.duration(200)
							.style('opacity',0.85);
							tooltip.html(getTooltipText(this.id,HasData))
					}})
				.on('mouseout',function(){
					if (HasData){
							tooltip.transition()
							.duration(500)
							.style('opacity',0);
					}})
				.on('mousemove',function(){
		 			if (HasData){
			 				tooltip
			 				.style('left', d3.event.pageX + 'px')
			 				.style('top',(d3.event.pageY - 28) + 'px');
		 			}});

}
};

function getTooltipText(el,HasData){
	s = "";
	if (HasData) {
	e = data.Data[el]
	if (typeof el != undefined) {
	v = data.Data[el][varName];
	if (v != "NA")
	{
		v = parseFloat(data.Data[el][varName]).toFixed(data.Variables[varName].round);


		var s;
		s = data.Variables[varName].Tooltip;
		s = s.replace('%c0',data.Countries[el].Czech);
		s = s.replace('%c6',data.Countries[el].V_zemi);
		s = s.replace('%n',v);
	}
}}
	return s;
};
//}
