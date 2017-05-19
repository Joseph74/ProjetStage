function RadarChart(id, data, options) {
	
	var opt = {
	 labelFactor: 1.25, 			//Placement des axis (12 pm..., etc.)
	 wrapWidth: 60, 			//Taille de la largeur du texte des axis (12 pm..., etc.)
	 opacityArea: 0.35, 			//Opacité de l'aire
	 dotRadius: 3.5, 				//La taille des petits points
	 opacityCircles: 0.1, 			//Opacité des petits points
	 strokeWidth: 1.5, 			//Largeur du contour de la forme
	};
		
	//Récupère les valeurs stockées dans values
	// d correspond à une ligne du tableau de données (en-tête des colonnes)
	// d.values récupère donc les données qui ont pour en-tête values
	data = data.map(function(d) { return d.values })

	//La variable maxValue prend la valeur maximal qu'il y a dans les données
	var maxValue = Math.max(d3.max(data, function(i){
		return d3.max(i.map(
			function(o){ return o.value; }
		))
	}));
	
	var allAxis = (data[0].map(function(i, j){return i.axis})),	//Nom de chaque axes (les heures)
		total = allAxis.length,					//Nombre d'axes différents
		radius = Math.min(radarChartOptions.w/2, radarChartOptions.h/2), 			//Rayon du plus grand cercle
		Format = d3.format(''),			 	//Le format (exemple : pourcentage, etc...)
		angleSlice = Math.PI * 2 / total;			//Les angles de chaque ligne
	
	//Echelle pour le rayon, permet de mettre le bon intervalle de données (de 0 à la valeur maximale)
	var rScale = d3.scale.linear()
		.range([0, radius])
		.domain([0, maxValue]);
	
	//Remplace le radar par un nouveau si on filtre la vue
	d3.select(id).select("svg").remove();
	
	//Créé le svg (svg = format de dessin vectoriel)
	var svg = d3.select(id).append("svg")
			.attr("width",  radarChartOptions.w + radarChartOptions.margin.left + radarChartOptions.margin.right)
			.attr("height", radarChartOptions.h + radarChartOptions.margin.top + radarChartOptions.margin.bottom)
			.attr("class", "radar"+id);
	//Ajoute un élément g (un élément g permet de regrouper plusieurs éléments ensemble, c'est une sorte de groupe)		
	var g = svg.append("g")
			.attr("transform", "translate(" + (radarChartOptions.w/2 + radarChartOptions.margin.left) + "," + (radarChartOptions.h/2 + radarChartOptions.margin.top) + ")");
			
	
	//Le glow filter pour le contour des formes et les points
	var filter = g.append('defs').append('filter').attr('id','glow'),
		feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
		feMerge = filter.append('feMerge'),
		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');
		
	
	//Enveloppe pour les axes avec g
	var axisGrid = g.append("g").attr("class", "axisWrapper");
	
	//Dessine les 5 cercles 
	axisGrid.selectAll(".levels")
		.data(d3.range(1,(radarChartOptions.levels+1)).reverse())
		.enter()
		.append("circle")
		.attr("class", "gridCircle")
		.attr("r", function(d, i){return radius/radarChartOptions.levels*d;}) 
		.style("fill", "white")
		.style("stroke", "#CDCDCD")
		.style("fill-opacity", opt.opacityCircles)
		.style("stroke-dasharray", ("3, 3"))
		.style("filter" , "url(#glow)");

	//L'échelle
	axisGrid.selectAll(".axisLabel")
	   .data(d3.range(1,(radarChartOptions.levels+1)).reverse())
	   .enter().append("text")
	   .attr("class", "axisLabel")
	   .attr("x", 4)
	   .attr("y", function(d){return -d*radius/radarChartOptions.levels;})
	   .attr("dy", "0.4em")
	   .style("font-size", "12px")
	   .attr("fill", "#E20404")
	   .text(function(d,i) { return Format(maxValue * d/radarChartOptions.levels); });

	
	//Créé les lignes correspondants aux angles
	var axis = axisGrid.selectAll(".axis")
		.data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis");
	//Ajoute les lignes
	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i); })
		.attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i); })
		.attr("class", "line")
		.style("stroke", "white")
		.style("stroke-width", "2px");

	//Ajoute les labels sur chaque axes (12 pm..., etc.)
	axis.append("text")
		.attr("class", "legend")
		.style("font-size", "14px")
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.attr("x", function(d, i){ return rScale(maxValue * opt.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y", function(d, i){ return rScale(maxValue * opt.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
		.text(function(d){return d})
		.call(wrap, opt.wrapWidth);

	
	//Fonction radial line (interpolate ("cardinal-closed") permet de faire des courbes)
	var radarLine = d3.svg.line.radial()
		.interpolate("linear-closed")
		.radius(function(d) { return rScale(d.value); })
		.angle(function(d,i) {	return i*angleSlice; });
		
	if(radarChartOptions.roundStrokes) {
		radarLine.interpolate("cardinal-closed");
	}
				
	//Créé une enveloppe pour les points 	
	var blobWrapper = g.selectAll(".radarWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarWrapper");
			
	//Opacité de l'aire, couleur...	
	blobWrapper
		.append("path")
		.attr("class", "radarArea")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("fill", function(d,i) { return radarChartOptions.color(i); })
		.style("fill-opacity", opt.opacityArea)
		.on('mouseover', function (d,i){
			//Change l'opacité des autres formes quand on passe sur une des formes
			d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", 0.1);
			//Change l'opacité de la forme survolée
			d3.select(this)
				.transition().duration(200)
				.style("fill-opacity", 0.8);				
		})
		.on('mouseout', function(){
			//Remet les opacités comme avant
			d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", opt.opacityArea);
		});
		
	//Créé les contours
	blobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("stroke-width", opt.strokeWidth + "px")
		.style("stroke", function(d,i) { return radarChartOptions.color(i); })
		.style("fill", "none")
		.style("filter" , "url(#glow)");		
	
	//Ajoute les petits points 
	blobWrapper.selectAll(".radarCircle")
		.data(function(d,i) { return d; })
		.enter().append("circle")
		.attr("class", "radarCircle")
		.attr("r", opt.dotRadius)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", function(d,i,j) { return radarChartOptions.color(j); })
		.style("fill-opacity", 0.8);
		
	
	//Enveloppe pour les cercles invisibles (g)
	var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarCircleWrapper");
		
	//Permet d'afficher les valeurs quand on va passer sur les points (les cercles invisibles)
	blobCircleWrapper.selectAll(".radarInvisibleCircle")
		.data(function(d,i) { return d; })
		.enter().append("circle")
		.attr("class", "radarInvisibleCircle")
		.attr("r", opt.dotRadius*1.5)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", "none")
		.style("pointer-events", "all")
		.on("mouseover", function(d,i) {
			newX =  parseFloat(d3.select(this).attr('cx')) - 10;
			newY =  parseFloat(d3.select(this).attr('cy')) - 10;
					
			tooltip
				.attr('x', newX)
				.attr('y', newY)
				.text(Format(d.value))
				.transition().duration(200)
				.style('opacity', 1);
		})
		.on("mouseout", function(){
			tooltip.transition().duration(200)
				.style("opacity", 0);
		});
		
	//Tooltip permettant l'affichage de la value quand on survole un point
	var tooltip = g.append("text")
		.attr("class", "tooltip")
		.style("opacity", 0);
		

	//Enveloppe SVG pour le texte	
	function wrap(text, width) {
	  text.each(function() {
		var text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.4, // ems
			y = text.attr("y"),
			x = text.attr("x"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
			
		while (word = words.pop()) {
		  line.push(word);
		  tspan.text(line.join(" "));
		  if (tspan.node().getComputedTextLength() > width) {
			line.pop();
			tspan.text(line.join(" "));
			line = [word];
			tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		  }
		}
	  });
	}
	
}// Fin de la fonction RadarChart


////////////////////////////////////////////////////////////// 
//////////////////////// Set-Up ////////////////////////////// 
////////////////////////////////////////////////////////////// 

var margin = {top: 100, right: 100, bottom: 100, left: 100},
	width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
	height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
		
////////////////////////////////////////////////////////////// 
//////////// Dessine le radar chart ////////////////////////// 
////////////////////////////////////////////////////////////// 

var color = d3.scale.ordinal()
	.range(["#9EAFAE","#4051A4","#00A0B0", "#96CA2D", "#BD8D46", "#FF358B", "#C03000", "#84815B", "#7FC6BC", "#046380"]);
	
var radarChartOptions = {
  w: width,
  h: height,
  margin: margin,
  levels: 5,
  roundStrokes: true,
  color: color
};

/*var nb;

$('#test').on('click', function() {
    nb = 1;
});

if (nb == 1) {
	d3.json("http://localhost:3000/getData1", function(error, data){
	RadarChart(".radarChart", data, radarChartOptions);
	location.reload();
});
}*/

/*var options = {
	url: "http://localhost:3000/getData",

	getValue: "value",

	list: {
		match: {
			enabled: true
		}
	}
};

$("#provider-json").easyAutocomplete(options);

getValue: function(element) {
	return element.value;
}*/

/*$("#tags").autocomplete({
    source: function (request, response) {
        $.ajax({
            url: "http://localhost:3000/getData",
            data: { query: request.term },
            success: function (data) {
                var transformed = $.map(data, function (el) {
                    return {
                        label: el.axis,
                        id: el.value
                    };
                });
                response(transformed);
            },
            error: function () {
                response([]);
            }
        });
    });
});*/

//d3.json() = Méthode permettant de récupérer des données au format json.
d3.json("http://localhost:3000/getData", function(error, data){
	RadarChart(".radarChart", data, radarChartOptions);
});

function afficheRessource1() {
	d3.json("http://localhost:3000/getData1", function(error, data){
	RadarChart(".radarChart", data, radarChartOptions);
	});
}

function afficheRessource2() {
	d3.json("http://localhost:3000/getData2", function(error, data){
	RadarChart(".radarChart", data, radarChartOptions);
	});
}

/*Pour plus tard le filtrage de la vue avec les 10 ressources :

function afficheRessource3() {
	d3.json("http://localhost:3000/getData3", function(error, data){
	RadarChart(".radarChart", data, radarChartOptions);
	});
}


function afficheRessource4() {
	d3.json("http://localhost:3000/getData4", function(error, data){
	RadarChart(".radarChart", data, radarChartOptions);
	});
}


function afficheRessource5() {
	d3.json("http://localhost:3000/getData5", function(error, data){
	RadarChart(".radarChart", data, radarChartOptions);
	});
}

function afficheRessource6() {
	d3.json("http://localhost:3000/getData6", function(error, data){
	RadarChart(".radarChart", data, radarChartOptions);
	});
}

function afficheRessource7() {
	d3.json("http://localhost:3000/getData7", function(error, data){
	RadarChart(".radarChart", data, radarChartOptions);
	});
}

function afficheRessource8() {
	d3.json("http://localhost:3000/getData8", function(error, data){
	RadarChart(".radarChart", data, radarChartOptions);
	});
}

function afficheRessource9() {
	d3.json("http://localhost:3000/getData9", function(error, data){
	RadarChart(".radarChart", data, radarChartOptions);
	});
}

function afficheRessource10() {
	d3.json("http://localhost:3000/getData10", function(error, data){
	RadarChart(".radarChart", data, radarChartOptions);
	});
}*/

/*$('#PageRefresh').click(function() {
	location.reload();
});*/

////////////////////////////////////////////////////////////////////
/////////////////// Les tableaux trop beaux ////////////////////////
////////////////////////////////////////////////////////////////////

	$("body").append("<p class=tab>Tableaux</p>");
	
	var div = $("<div/>");
	div.attr("class", "container");
	$("body").append(div);
	
$(document).ready(function() {
	
	/*$("<div></div>").appendTo("div#container");*/
	
	var div2 = $("<div/>");
	div2.attr("class", "col");
	div.append(div2);
	
	div2.append("<p class=r1>Ressource 1</p>");
	
	var table = $("<table/>");
	table.attr("id", "liste1");
	div2.append(table);

	var head = $("<tr><th>Heure</th><th>Vues</th></tr>");
	table.append(head);

	var tr = $("<tr/>");
	table.append(tr);
		
	var td = $("<td/>");
	tr.append(td);
		
	var td2 = $("<td/>");
	tr.append(td2);

	$.getJSON("http://localhost:3000/getData", function(data_json) {
	$.each(data_json, function(k,v){
	if(v.key == "Ressource 1"){

	var span = $("<span/>");
	span
		.append(v.values[0].axis)
		.append("<br/>")
		.append(v.values[1].axis)
		.append("<br/>")
		.append(v.values[2].axis)
		.append("<br/>")
		.append(v.values[3].axis)
		.append("<br/>")
		.append(v.values[4].axis)
		.append("<br/>")
		.append(v.values[5].axis)
		.append("<br/>")
		.append(v.values[6].axis)
		.append("<br/>")
		.append(v.values[7].axis)
	td.append(span);
											
	span = $("<span/>");
	span
		.append(v.values[0].value)
		.append("<br/>")
		.append(v.values[1].value)
		.append("<br/>")
		.append(v.values[2].value)
		.append("<br/>")
		.append(v.values[3].value)
		.append("<br/>")
		.append(v.values[4].value)
		.append("<br/>")
		.append(v.values[5].value)
		.append("<br/>")
		.append(v.values[6].value)
		.append("<br/>")
		.append(v.values[7].value)
	td2.append(span);
	return false;
	}
	});
});
});

$(document).ready(function() {
	
	var div2 = $("<div/>");
	div2.attr("class", "col");
	div.append(div2);
	
	div2.append("<p class=r2>Ressource 2</p>");
	
	var table = $("<table/>");
	table.attr("id", "liste2");
	div2.append(table);

	var head = $("<tr><th>Heure</th><th>Vues</th></tr>");
	table.append(head);

	var tr = $("<tr/>");
	table.append(tr);
		
	var td = $("<td/>");
	tr.append(td);
		
	var td2 = $("<td/>");
	tr.append(td2);

	$.getJSON("http://localhost:3000/getData", function(data_json) {
	$.each(data_json, function(k,v){
	if(v.key == "Ressource 2"){ 
	var span = $("<span/>");
	span
		.append(v.values[0].axis)
		.append("<br/>")
		.append(v.values[1].axis)
		.append("<br/>")
		.append(v.values[2].axis)
		.append("<br/>")
		.append(v.values[3].axis)
		.append("<br/>")
		.append(v.values[4].axis)
		.append("<br/>")
		.append(v.values[5].axis)
		.append("<br/>")
		.append(v.values[6].axis)
		.append("<br/>")
		.append(v.values[7].axis)
	td.append(span);
											
	span = $("<span/>");
	span
		.append(v.values[0].value)
		.append("<br/>")
		.append(v.values[1].value)
		.append("<br/>")
		.append(v.values[2].value)
		.append("<br/>")
		.append(v.values[3].value)
		.append("<br/>")
		.append(v.values[4].value)
		.append("<br/>")
		.append(v.values[5].value)
		.append("<br/>")
		.append(v.values[6].value)
		.append("<br/>")
		.append(v.values[7].value)
	td2.append(span);
	return false;
	}
	});
});
});			

$(document).ready(function() {
		
	var div2 = $("<div/>");
	div2.attr("class", "col");
	div.append(div2);
	
	div2.append("<p class=r3>Ressource 3</p>");
	
	var table = $("<table/>");
	table.attr("id", "liste3");
	div2.append(table);

	var head = $("<tr><th>Heure</th><th>Vues</th></tr>");
	table.append(head);

	var tr = $("<tr/>");
	table.append(tr);
		
	var td = $("<td/>");
	tr.append(td);
		
	var td2 = $("<td/>");
	tr.append(td2);

	$.getJSON("http://localhost:3000/getData", function(data_json) {
	$.each(data_json, function(k,v){
	if(v.key == "Ressource 3"){ 
	var span = $("<span/>");
	span
		.append(v.values[0].axis)
		.append("<br/>")
		.append(v.values[1].axis)
		.append("<br/>")
		.append(v.values[2].axis)
		.append("<br/>")
		.append(v.values[3].axis)
		.append("<br/>")
		.append(v.values[4].axis)
		.append("<br/>")
		.append(v.values[5].axis)
		.append("<br/>")
		.append(v.values[6].axis)
		.append("<br/>")
		.append(v.values[7].axis)
	td.append(span);
											
	span = $("<span/>");
	span
		.append(v.values[0].value)
		.append("<br/>")
		.append(v.values[1].value)
		.append("<br/>")
		.append(v.values[2].value)
		.append("<br/>")
		.append(v.values[3].value)
		.append("<br/>")
		.append(v.values[4].value)
		.append("<br/>")
		.append(v.values[5].value)
		.append("<br/>")
		.append(v.values[6].value)
		.append("<br/>")
		.append(v.values[7].value)
	td2.append(span);
	return false;
	}
	});
});
});

$(document).ready(function() {
	
	var div2 = $("<div/>");
	div2.attr("class", "col");
	div.append(div2);
	
	div2.append("<p class=r4>Ressource 4</p>");
	
	var table = $("<table/>");
	table.attr("id", "liste2");
	div2.append(table);

	var head = $("<tr><th>Heure</th><th>Vues</th></tr>");
	table.append(head);

	var tr = $("<tr/>");
	table.append(tr);
		
	var td = $("<td/>");
	tr.append(td);
		
	var td2 = $("<td/>");
	tr.append(td2);

	$.getJSON("http://localhost:3000/getData", function(data_json) {
	$.each(data_json, function(k,v){
	if(v.key == "Ressource 4"){ 
	var span = $("<span/>");
	span
		.append(v.values[0].axis)
		.append("<br/>")
		.append(v.values[1].axis)
		.append("<br/>")
		.append(v.values[2].axis)
		.append("<br/>")
		.append(v.values[3].axis)
		.append("<br/>")
		.append(v.values[4].axis)
		.append("<br/>")
		.append(v.values[5].axis)
		.append("<br/>")
		.append(v.values[6].axis)
		.append("<br/>")
		.append(v.values[7].axis)
	td.append(span);
											
	span = $("<span/>");
	span
		.append(v.values[0].value)
		.append("<br/>")
		.append(v.values[1].value)
		.append("<br/>")
		.append(v.values[2].value)
		.append("<br/>")
		.append(v.values[3].value)
		.append("<br/>")
		.append(v.values[4].value)
		.append("<br/>")
		.append(v.values[5].value)
		.append("<br/>")
		.append(v.values[6].value)
		.append("<br/>")
		.append(v.values[7].value)
	td2.append(span);
	return false;
	}
	});
});
});

$(document).ready(function() {
	
	var div2 = $("<div/>");
	div2.attr("class", "col");
	div.append(div2);
	
	div2.append("<p class=r5>Ressource 5</p>");
	
	var table = $("<table/>");
	table.attr("id", "liste2");
	div2.append(table);

	var head = $("<tr><th>Heure</th><th>Vues</th></tr>");
	table.append(head);

	var tr = $("<tr/>");
	table.append(tr);
		
	var td = $("<td/>");
	tr.append(td);
		
	var td2 = $("<td/>");
	tr.append(td2);

	$.getJSON("http://localhost:3000/getData", function(data_json) {
	$.each(data_json, function(k,v){
	if(v.key == "Ressource 5"){ 
	var span = $("<span/>");
	span
		.append(v.values[0].axis)
		.append("<br/>")
		.append(v.values[1].axis)
		.append("<br/>")
		.append(v.values[2].axis)
		.append("<br/>")
		.append(v.values[3].axis)
		.append("<br/>")
		.append(v.values[4].axis)
		.append("<br/>")
		.append(v.values[5].axis)
		.append("<br/>")
		.append(v.values[6].axis)
		.append("<br/>")
		.append(v.values[7].axis)
	td.append(span);
											
	span = $("<span/>");
	span
		.append(v.values[0].value)
		.append("<br/>")
		.append(v.values[1].value)
		.append("<br/>")
		.append(v.values[2].value)
		.append("<br/>")
		.append(v.values[3].value)
		.append("<br/>")
		.append(v.values[4].value)
		.append("<br/>")
		.append(v.values[5].value)
		.append("<br/>")
		.append(v.values[6].value)
		.append("<br/>")
		.append(v.values[7].value)
	td2.append(span);
	return false;
	}
	});
});
});			

$(document).ready(function() {
	
	var div2 = $("<div/>");
	div2.attr("class", "col");
	div.append(div2);
	
	div2.append("<p class=r6>Ressource 6</p>");
	
	var table = $("<table/>");
	table.attr("id", "liste2");
	div2.append(table);

	var head = $("<tr><th>Heure</th><th>Vues</th></tr>");
	table.append(head);

	var tr = $("<tr/>");
	table.append(tr);
		
	var td = $("<td/>");
	tr.append(td);
		
	var td2 = $("<td/>");
	tr.append(td2);

	$.getJSON("http://localhost:3000/getData", function(data_json) {
	$.each(data_json, function(k,v){
	if(v.key == "Ressource 6"){ 
	var span = $("<span/>");
	span
		.append(v.values[0].axis)
		.append("<br/>")
		.append(v.values[1].axis)
		.append("<br/>")
		.append(v.values[2].axis)
		.append("<br/>")
		.append(v.values[3].axis)
		.append("<br/>")
		.append(v.values[4].axis)
		.append("<br/>")
		.append(v.values[5].axis)
		.append("<br/>")
		.append(v.values[6].axis)
		.append("<br/>")
		.append(v.values[7].axis)
	td.append(span);
											
	span = $("<span/>");
	span
		.append(v.values[0].value)
		.append("<br/>")
		.append(v.values[1].value)
		.append("<br/>")
		.append(v.values[2].value)
		.append("<br/>")
		.append(v.values[3].value)
		.append("<br/>")
		.append(v.values[4].value)
		.append("<br/>")
		.append(v.values[5].value)
		.append("<br/>")
		.append(v.values[6].value)
		.append("<br/>")
		.append(v.values[7].value)
	td2.append(span);
	return false;
	}
	});
});
});			

$(document).ready(function() {
	
	var div2 = $("<div/>");
	div2.attr("class", "col");
	div.append(div2);
	
	div2.append("<p class=r7>Ressource 7</p>");
	
	var table = $("<table/>");
	table.attr("id", "liste2");
	div2.append(table);

	var head = $("<tr><th>Heure</th><th>Vues</th></tr>");
	table.append(head);

	var tr = $("<tr/>");
	table.append(tr);
		
	var td = $("<td/>");
	tr.append(td);
		
	var td2 = $("<td/>");
	tr.append(td2);

	$.getJSON("http://localhost:3000/getData", function(data_json) {
	$.each(data_json, function(k,v){
	if(v.key == "Ressource 7"){ 
	var span = $("<span/>");
	span
		.append(v.values[0].axis)
		.append("<br/>")
		.append(v.values[1].axis)
		.append("<br/>")
		.append(v.values[2].axis)
		.append("<br/>")
		.append(v.values[3].axis)
		.append("<br/>")
		.append(v.values[4].axis)
		.append("<br/>")
		.append(v.values[5].axis)
		.append("<br/>")
		.append(v.values[6].axis)
		.append("<br/>")
		.append(v.values[7].axis)
	td.append(span);
											
	span = $("<span/>");
	span
		.append(v.values[0].value)
		.append("<br/>")
		.append(v.values[1].value)
		.append("<br/>")
		.append(v.values[2].value)
		.append("<br/>")
		.append(v.values[3].value)
		.append("<br/>")
		.append(v.values[4].value)
		.append("<br/>")
		.append(v.values[5].value)
		.append("<br/>")
		.append(v.values[6].value)
		.append("<br/>")
		.append(v.values[7].value)
	td2.append(span);
	return false;
	}
	});
});
});			

$(document).ready(function() {
	
	var div2 = $("<div/>");
	div2.attr("class", "col");
	div.append(div2);
	
	div2.append("<p class=r8>Ressource 8</p>");
	
	var table = $("<table/>");
	table.attr("id", "liste2");
	div2.append(table);

	var head = $("<tr><th>Heure</th><th>Vues</th></tr>");
	table.append(head);

	var tr = $("<tr/>");
	table.append(tr);
		
	var td = $("<td/>");
	tr.append(td);
		
	var td2 = $("<td/>");
	tr.append(td2);

	$.getJSON("http://localhost:3000/getData", function(data_json) {
	$.each(data_json, function(k,v){
	if(v.key == "Ressource 8"){ 
	var span = $("<span/>");
	span
		.append(v.values[0].axis)
		.append("<br/>")
		.append(v.values[1].axis)
		.append("<br/>")
		.append(v.values[2].axis)
		.append("<br/>")
		.append(v.values[3].axis)
		.append("<br/>")
		.append(v.values[4].axis)
		.append("<br/>")
		.append(v.values[5].axis)
		.append("<br/>")
		.append(v.values[6].axis)
		.append("<br/>")
		.append(v.values[7].axis)
	td.append(span);
											
	span = $("<span/>");
	span
		.append(v.values[0].value)
		.append("<br/>")
		.append(v.values[1].value)
		.append("<br/>")
		.append(v.values[2].value)
		.append("<br/>")
		.append(v.values[3].value)
		.append("<br/>")
		.append(v.values[4].value)
		.append("<br/>")
		.append(v.values[5].value)
		.append("<br/>")
		.append(v.values[6].value)
		.append("<br/>")
		.append(v.values[7].value)
	td2.append(span);
	return false;
	}
	});
});
});			

$(document).ready(function() {
	
	var div2 = $("<div/>");
	div2.attr("class", "col");
	div.append(div2);
	
	div2.append("<p class=r9>Ressource 9</p>");
	
	var table = $("<table/>");
	table.attr("id", "liste2");
	div2.append(table);

	var head = $("<tr><th>Heure</th><th>Vues</th></tr>");
	table.append(head);

	var tr = $("<tr/>");
	table.append(tr);
		
	var td = $("<td/>");
	tr.append(td);
		
	var td2 = $("<td/>");
	tr.append(td2);

	$.getJSON("http://localhost:3000/getData", function(data_json) {
	$.each(data_json, function(k,v){
	if(v.key == "Ressource 9"){ 
	var span = $("<span/>");
	span
		.append(v.values[0].axis)
		.append("<br/>")
		.append(v.values[1].axis)
		.append("<br/>")
		.append(v.values[2].axis)
		.append("<br/>")
		.append(v.values[3].axis)
		.append("<br/>")
		.append(v.values[4].axis)
		.append("<br/>")
		.append(v.values[5].axis)
		.append("<br/>")
		.append(v.values[6].axis)
		.append("<br/>")
		.append(v.values[7].axis)
	td.append(span);
											
	span = $("<span/>");
	span
		.append(v.values[0].value)
		.append("<br/>")
		.append(v.values[1].value)
		.append("<br/>")
		.append(v.values[2].value)
		.append("<br/>")
		.append(v.values[3].value)
		.append("<br/>")
		.append(v.values[4].value)
		.append("<br/>")
		.append(v.values[5].value)
		.append("<br/>")
		.append(v.values[6].value)
		.append("<br/>")
		.append(v.values[7].value)
	td2.append(span);
	return false;
	}
	});
});
});			

$(document).ready(function() {
	
	var div2 = $("<div/>");
	div2.attr("class", "col");
	div.append(div2);
	
	div2.append("<p class=r10>Ressource 10</p>");
	
	var table = $("<table/>");
	table.attr("id", "liste2");
	div2.append(table);

	var head = $("<tr><th>Heure</th><th>Vues</th></tr>");
	table.append(head);

	var tr = $("<tr/>");
	table.append(tr);
		
	var td = $("<td/>");
	tr.append(td);
		
	var td2 = $("<td/>");
	tr.append(td2);

	$.getJSON("http://localhost:3000/getData", function(data_json) {
	$.each(data_json, function(k,v){
	if(v.key == "Ressource 10"){ 
	var span = $("<span/>");
	span
		.append(v.values[0].axis)
		.append("<br/>")
		.append(v.values[1].axis)
		.append("<br/>")
		.append(v.values[2].axis)
		.append("<br/>")
		.append(v.values[3].axis)
		.append("<br/>")
		.append(v.values[4].axis)
		.append("<br/>")
		.append(v.values[5].axis)
		.append("<br/>")
		.append(v.values[6].axis)
		.append("<br/>")
		.append(v.values[7].axis)
	td.append(span);
											
	span = $("<span/>");
	span
		.append(v.values[0].value)
		.append("<br/>")
		.append(v.values[1].value)
		.append("<br/>")
		.append(v.values[2].value)
		.append("<br/>")
		.append(v.values[3].value)
		.append("<br/>")
		.append(v.values[4].value)
		.append("<br/>")
		.append(v.values[5].value)
		.append("<br/>")
		.append(v.values[6].value)
		.append("<br/>")
		.append(v.values[7].value)
	td2.append(span);
	return false;
	}
	});
});
});						

/*var div10 = $("<div/>");
div10.attr("class", "lolez");
$("body").append(div10);

$.getJSON("http://localhost:3000/getData", function(data_json) {
	$.each(data_json, function(k,v){
		div10.append(v.key);
		return false;
	});
});*/