
// TODO:
// 1) femaleShare ma byt maleShare // udela Sam
// 2) secist věk učiteů - ucitele pod 40 // udela Sam
// 4) Udaje v % at jsou skutecne v procentech, ne v desetinnych mistech
// 5) Srafovani bud zrusit nebo udelat koukatelny
// 6) odstran ctverce malych zemi //done
// 7) svetla je moc svetla a vypada seda - budto ma byt tmavsi, nebo se ma vsechno srafovat
// 8) Přidej k ose jednotky //done
// 9) Doladit pro jednotlivé prohlížeče
// 9) Vyčisti kód a okomentuj kód
// 10) Minify code
// 11) sjednotit PPS a PPP plus nekde vysvetlit


var varName = 'relativeSalary1';
// var variantSelect = 'gradient';
var colorSelect = 'IDEALight';

var legendColors = {
	"ColBrew" : ['#FFF5EB','#FEE6CE',"#FDD0A2",'#FDAE6B',"#FD8D3C","#F16913","#D94801",'#A63603',"#7F2704"],
	"IDEARed" : ['#F5F5F5','#EDDEE2',"#E6C7CF",'#DFB0BC',"#D899A9","#D18396","#C96C83",'#C25570',"#B4274A"],
	"IDEABlue" : ['#C7D8E5','#AECADE',"#95BCD8",'#7CAED2',"#63A0CC","#4A92C6","#3184C0",'#1876BA',"#0068B4"],
	"IDEALight" : ['#C7D8E5','#AECADE',"#95BCD8",'#7CAED2',"#63A0CC","#4A92C6","#3184C0",'#1876BA',"#0068B4"],
	"GreenOrange" : ['#75995A','#90B144',"#AAC92D",'#C5D123',"#E0D819","#E7CA15","#EEBB11",'#F6AB0D',"#FD9B08"],
	"BlueOrange" : ["#69D2E7",'#84DDEE',"#9fe7f5",'#C0E6E1',"#E0E4CC",'#EAB57E',"#F38630",'#F77818',"#FA6900"],
	"LightGreenOrange" : ["#BBBB88",'#C4C18B',"#CCC68D",'#DDD293',"#EEDD99",'#EED095',"#EEC290",'#EEB68C',"#EEAA88"]
}

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

function changeVar(xVar)
{
	varName = xVar;
	//$('#btnVar').html(data.Variables[xVar].ShortName + '  <img src="src/down-arrow.png" class="menu-icon" />' );
	LoadMap();
	LoadDesc();
	$('#sideMenu .selected').removeClass('selected');
	$('#a_' + xVar).addClass('selected');
}

// MAIN LOADING FUNCTIONS
function LoadMap_First()
{
	LoadMap();
	LoadDesc();
	varName = 'relativeSalary1';
	//TransformZoom(-2000,-1150,5,'Evropa');
	$('#a_relativeSalary1').addClass('selected');
	$('#linkEurope').addClass('selected');//GenerateMenu();
  TransformZoom(-2000,-1150,5,'Evropa')

};

function LoadDesc()
{
	vari = data.Variables[varName]

	$('#desVarName').text(vari.fullName);
	$('#desVarDesc').text(vari.Description + ' (' + vari.unit + '; ' +vari.year + ')');
	oecd = 'Podrobnější informace jsou k dispozici v reportu <a href="http://www.oecd.org/edu/education-at-a-glance-19991487.htm">Education at glance</a> na straně %pg v kapitole %ch. <br>Data lze také stáhnout přímo <a href="%l">zde</a>'
	oecd = oecd.replace('%pg',vari.sourcePage)
	oecd = oecd.replace('%ch',vari.ref)
	oecd = oecd.replace('%l',vari.sourceLink)
	$('#desVarOECD').html(oecd);
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
					// $('#' + d).css('fill','#AAAAAA')
					$('#' + d).css('fill','url(#diagonalHatch')
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
	var unit = data.Variables[varName].unit;
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


	if (unit == '%')
	{
		texts = []
		for (var s in result) {
			val = result[s]
			result[s] = val + '%'
		}
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
	var unit = data.Variables[varName].unit;


	var colors;
	var texts;
	if (unit != '%') {
		svgLegend
			.append('text')
			.attr('id','legendUnit')
			.attr('x',80)
			.attr('y',28)
			.attr('font-weight',550)
			.text(unit);
	}

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



function TransformZoom(X,Y,k,zoomName){
	s = 'translate(' + X + ',' + Y +') scale (' + k +')';
	g = d3.select('#gContainer').transition().duration(750).attr('transform',s);

	z = d3.zoomTransform(g.node());
	z.k = k;
	z.y = Y;
	z.x = X;

	$('#divZoom .selected').removeClass('selected');
	if (zoomName == 'Evropa')
	{
		$('#linkEurope').addClass('selected');
	}
	else {
		$('#linkWorld').addClass('selected');
	}
	// $('linkEurope').toggleClass('selected')
	// $('linkWorld').toggleClass('selected')

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
