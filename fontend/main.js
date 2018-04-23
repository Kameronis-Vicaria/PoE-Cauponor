//-> String format function.
String.prototype.formatUnicorn = String.prototype.formatUnicorn || function () { "use strict"; var str = this.toString(); if (arguments.length) { var t = typeof arguments[0]; var key; var args = ("string" === t || "number" === t) ? Array.prototype.slice.call(arguments) : arguments[0]; for (key in args) { str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]); } } return str; };

//-> Define stuff.
const UrlBase = 'https://web.poecdn.com';
const Url = {'sep': '/image/Art/2DArt/UIImages/InGame/ItemsSeparator{0}.png?scale=1&v=bdf0e0541ff8d2a7191264a28fd5cb3b&scaleIndex=0', 'title': '/image/Art/2DArt/UIImages/InGame/ItemsHeader{0}{1}.png?scale=1&version=13e64d23f9f232fb83d1e59f4441bbcf'};
const sepUrl = function(type) { return (UrlBase + Url[arguments.callee.name.replace('Url','')].formatUnicorn(type)); }
const titleUrl = function(pos, type) { return (UrlBase + Url[arguments.callee.name.replace('Url','')].formatUnicorn(type, pos)); }
const styleColors = {'White':'#c8c8c8','Magic':'#8888ff','Rare':'#ffff77','Unique':'#af6025','Gem':'#1ba29b','Quest':'#4ae63a','Prophecy':'#b54bff','Currency':'#aa9e82'};
const dmgTypes = { 0: "physical", 1: "modified", 4: "fire", 5: "cold", 6: "lightning", 7: "chaos" };
const barTypes = { 0: "White", 1: "Magic", 2: "Rare", 3: "Unique", 4: "Gem", 5: "Currency", 6: "Divination", 7: "Quest", 8: "Prophecy", 9: "Relic" }

//-> Creates Element from html string, returning Element Node object.
function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild;
}

//-> Create the tooltips.
let tooltips = [];
function assignTippyTooltip() {
  for (let i = 0; i < tooltips.length; i++) {
    console.log(tooltips[i]);
    tippy(`#${tooltips[i]}`, {
      html: `#tooltip${tooltips[i]}`,
      placement: "bottom",
      animateFill: false,
      theme: ""
    });
  }
}

//-> Set max-width to the width the Container is without 'flavourText' affecting it.
let flavTexts = [];
function assignWidths() {
  for (let x = 0; x < flavTexts.length; x++) {
    var flavourTextArea = $(`.FlavourText span:eq(${x})`);
    var tooltip = $(`.ItemContainer:eq(${x})`);
    var flavourText = flavourTextArea.text();
    //if (!flavourText || flavourText === "") continue;
    flavourTextArea.text("");
    var tooltipWidth = Math.max(300, tooltip.width());
    tooltip.css("max-width", tooltipWidth);
    tooltip.css("width", tooltipWidth);
    flavourTextArea.text(flavourText);
  }
  flavTexts = [];
}

//-> Generate a unique ID for 'Tippy' (js lib) tooltip classes.
function genUID(digits) {
	const Rand = function(max, min) {
  	return Math.floor(Math.random() * Math.floor(max - (min || 0))) + (min || 0);
	};
	let arr = [];
  while(arr.length < 1) {
    var randomnumber = Rand(parseInt(Number.MAX_SAFE_INTEGER.toString().slice(0, digits)), 10 * digits);
    if(tooltips.indexOf('item_' + randomnumber) > -1) continue;
    arr[arr.length] = 'item_' + randomnumber;
  }
  tooltips.push(arr[0]);
  return (arr[0]);
}

//-> Remove all occurrence instances of all provided strings form the main string.
function charRm(str, strsToRm) {
	let tempStr = str;
  for (let x = 0; x < strsToRm.length; x++) {
		tempStr = tempStr.split(strsToRm[x]).join('');
  }
	return tempStr;
}

//-> Well duh, makes url for item image. Yet to implemented.
function constructUrl(type, subtype, itemType, name) {
  type = ["Currency","Divination","Hideout",""].indexOf(type) === -1 ? type + 's' : type;
	return `https://web.poecdn.com/image/Art/2DItems/${type}/${subtype ? subtype + 's/' : ''}${itemType + 's'}/${charRm(name, [' ', "'"])}.png?scale=1&v=a2dc79b071735a12dfcbf002c4c20002`;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getElementalDmg(data) {
	let buffer = { "fire": undefined, "lightning": undefined, "cold": undefined, "chaos": undefined };
	if (!data) return buffer;
  for (var k = 0; k < data.length; k++) {
  	buffer[dmgTypes[data[k][1]]] = data[k][0];
  }
  return buffer;
}
/*
`<div id=tooltip${tooltipId}><table align=center><tr><td><div class="ItemContainer"><div class="ItemBox" style="border-color:${styleColors[rarity]}"><div class="ItemContent"><div class="TitleBar ${barHeight==1 ? 'Single' : 'Double'}Bar" style="background-image:url(${titleUrl("Middle", rarity)})"><div class="${barHeight==1 ? 'SingleBar SingleEnd' : 'DoubleBar DoubleEnd'} TitleBarL" style="background-image:url(${titleUrl("Left", rarity)})"></div><div class="TitleBarR ${barHeight==1 ? 'SingleBar SingleEnd' : 'DoubleBar DoubleEnd'}" style="background-image:url(${titleUrl("Right", rarity)})"></div><span class="ItemName" style="color:${styleColors[rarity]}">${itemName}</span>${barHeight==2 ? `<div></div><span class="ItemName" style="color:${styleColors[rarity]}">${baseType}</span>` : ''}</div><div class="ItemStats Text"><span class="Text"><span>${type}</span><div></div>${quality ? `<span>Quality: <span class="Augmented">${quality}</span></span>` : ''}${physDmg ? `<div></div><span>Physical Damage: <span class="Augmented">${physDmg}</span></span>` : ''}${(fireDmg || lighDmg || coldDmg) ? `<div></div><span>Elemental Damage: ${fireDmg ? `<span class="FireDamage">${fireDmg}</span>` : ''}${lighDmg ? `${ fireDmg ? ',' : ''} <span class="LightningDamage">${lighDmg}</span>` : ''}${coldDmg ? `${ fireDmg || lighDmg ? ',' : ''} <span class="ColdDamage">${coldDmg}</span>` : ''}</span>` : ''}${chaosDmg ? `<div></div><span>Chaos Damage: <span class="ChaosDamage">${chaosDmg}</span></span>` : ''}<div></div><span>Critical Strike Chance: <span class="Default">${critChance}</span></span><div></div><span>Attacks per Second: <span class="Default">${aps}</span></span></span></div><div class="ItemSeparator" style="background-image:url(${sepUrl(rarity)})"></div><div class="Requirements"><span class="Text">Requires Level <span class="Default">${LvlReq}</span>${StrReq && StrReq > 0 ? `, <span class="Default">${StrReq}</span> Str` : ''}${DexReq && DexReq > 0 ? `, <span class="Default">${DexReq}</span> Dex` : ''}${IntReq && IntReq > 0 ? `, <span class="Default">${IntReq}</span> Int` : ''}</span></div><div class="ItemSeparator" style="background-image:url(${sepUrl(rarity)})"></div>${impMod && impMod !== "" ? `<div class="ImplicitMod"><span>${impMod}</span></div><div class="ItemSeparator" style="background-image:url(${sepUrl(rarity)})"></div>` : ''}${expMods && expMods.length > 0 ? `<div class="ExplicitMod"><span>${'<p>' + expMods.join('<p>')}</span></div>` : ''}${flavText && flavText !== "" ? `<div class="ItemSeparator" style="background-image:url(${sepUrl(rarity)})"></div><div class="FlavourText FlavourUnique"><span>${flavText}</span></div>` : ''}</div></div></div></div></table></div>`
*/

//-> Create Item, placeholder button html element, and the soon-to-be-created 'tooltip' inner html.
function create(itemName, baseType, type, rarity, barHeight, img, quality, range, physDmg, fireDmg, lighDmg, coldDmg, chaosDmg, critChance, aps, LvlReq, StrReq, DexReq, IntReq, impMod, crfMod, expMods, flavText, width, height, x, y, identified, propertyhtmltest, titlehtmltest, flavtexthtml, entirehtmlblob) {
	const tooltipId = genUID(9);
  let html = 
  `<div id=tooltip${tooltipId}><table align=center><tr><td><div class="ItemContainer"><div class="ItemBox" style="border-color:${styleColors[rarity]}"><div class="ItemContent">${titlehtmltest}<div class="ItemStats Text"><span class="Text"><span>${type}</span><div></div>${quality ? `<span>Quality: <span class="Augmented">${quality}</span></span>` : ''}${physDmg ? `<div></div><span>Physical Damage: <span class="Augmented">${physDmg}</span></span>` : ''}${(fireDmg || lighDmg || coldDmg) ? `<div></div><span>Elemental Damage: ${fireDmg ? `<span class="FireDamage">${fireDmg}</span>` : ''}${lighDmg ? `${ fireDmg ? ',' : ''} <span class="LightningDamage">${lighDmg}</span>` : ''}${coldDmg ? `${ fireDmg || lighDmg ? ',' : ''} <span class="ColdDamage">${coldDmg}</span>` : ''}</span>` : ''}${chaosDmg ? `<div></div><span>Chaos Damage: <span class="ChaosDamage">${chaosDmg}</span></span>` : ''}${propertyhtmltest ? propertyhtmltest : ''}</span></div><div class="ItemSeparator" style="background-image:url(${sepUrl(rarity)})"></div><div class="Requirements"><span class="Text">Requires Level <span class="Default">${LvlReq}</span>${StrReq && StrReq > 0 ? `, <span class="Default">${StrReq}</span> Str` : ''}${DexReq && DexReq > 0 ? `, <span class="Default">${DexReq}</span> Dex` : ''}${IntReq && IntReq > 0 ? `, <span class="Default">${IntReq}</span> Int` : ''}</span></div>${impMod && impMod !== "" ? `<div class="ImplicitMod"><span>${impMod}</span></div><div class="ItemSeparator" style="background-image:url(${sepUrl(rarity)})"></div>` : ''}${expMods && expMods.length > 0 ? `<div class="ExplicitMod"><span>${'<p>' + expMods.join('<p>')}</span></div>` : ''}${flavText && flavText !== "" ? `<div class="ItemSeparator" style="background-image:url(${sepUrl(rarity)})"></div><div class="FlavourText FlavourUnique"><span>${flavText}</span></div>` : ''}</div></div></div></div></table></div>`;
  //alert(entirehtmlblob);
  let hasRequirements = (DexReq && DexReq > 0 ) || (StrReq && StrReq > 0) || (IntReq && IntReq > 0);
  let hasLevel = (LvlReq && LvlReq > 0);
  html = `<div id=tooltip${tooltipId}><table align=center><tr><td><div class="ItemContainer"><div class="ItemBox" style="border-color:${styleColors[rarity]}"><div class="ItemContent">` + entirehtmlblob + `${hasRequirements && (expMods || impMod || flavText) ? `<div class="ItemSeparator" style="background-image:url(${sepUrl(rarity)})">` : ''}</div>${impMod && impMod !== "" ? `<div class="ImplicitMod"><span>${impMod}</span></div><div class="ItemSeparator" style="background-image:url(${sepUrl(rarity)})"></div>` : ''}${expMods && expMods.length > 0 ? `<div class="ExplicitMod"><span>${'<p>' + expMods.join('<p>')}</span></div>` : ''}${flavtexthtml}</div></div></div></div></table></div>`;

  document.getElementById("hideTooltip").appendChild(createElementFromHTML(html));
  document.getElementById("stashTab").appendChild(createElementFromHTML(`<button id="${tooltipId}"></button>`))
  tooltips.push(tooltipId);
  flavTexts.push(flavText);

  width = width * 47;
  height = height * 47;
  x = x * 47.5;
  y = y * 47.5;

  $(`#${tooltipId}`).css("position", `absolute`);
  $(`#${tooltipId}`).css("width", `${width}px`);
  $(`#${tooltipId}`).css("height", `${height}px`);
  $(`#${tooltipId}`).css("top", `${y}px`);
  $(`#${tooltipId}`).css("left", `${x}px`);
  $(`#${tooltipId}`).css("background-image", `url(${img})`);
  $(`#${tooltipId}`).css("border", 'none');
  
  $(`#${tooltipId}`).addClass(`${identified ? "I" : "Uni"}dentified`);
}

$.getJSON("https://api.myjson.com/bins/16fnab").then(data => {
  let items = data["items"];
  
  for (var i = 0; i < items.length; i++) {
  	let item = items[i];
    let propertyBuffer = {};
    let buffer = {};
    let _HTML = [];
    let _this_HTML = "";
    let handledProperties = ['Elemental Damage','',''];
    let ignoredProperties = [''];
    const Objarr = {
    	'result': {},
      'filter': (obj, property, value) => {
      	let res = {'any': false, 'results': []};
        Objarr.result = res;
    		if(!obj) return res;
        let temp = obj.filter(o => o[property] === value);
        res = {'any': temp.length > 0, 'results': temp};
        Objarr.result = res;
        return res;
      }
    };
    
    //
		//-> The item name and base type.
    let itemName = unescape(item.name).replace(/\<.+\>/, "");
    let baseType = unescape(item.typeLine).replace(/\<.+\>/, "");
    let rarity = barTypes[item.frameType];
    let barHeight = (itemName === '') ? 1 : 2;
    
    _this_HTML = `<div class="TitleBar ${barHeight==1 ? 'Single' : 'Double'}Bar" style="background-image:url(${titleUrl("Middle", rarity)})"><div class="${"{0}Bar {0}End".formatUnicorn(barHeight==1 ? 'Single' : 'Double')} TitleBarL" style="background-image:url(${titleUrl("Left", rarity)})"></div><div class="TitleBarR ${"{0}Bar {0}End".formatUnicorn(barHeight==1 ? 'Single' : 'Double')}" style="background-image:url(${titleUrl("Right", rarity)})"></div><span class="ItemName" style="color:${styleColors[rarity]}">${itemName || baseType}</span>${barHeight==2 ? `<div></div><span class="ItemName" style="color:${styleColors[rarity]}">${baseType}</span>` : ''}</div>`;
    let titlehtml = _this_HTML;
    _this_HTML ? _HTML.push(_this_HTML) : null;
    _this_HTML = undefined;
    
    //
    //-> The item's Type.
    let propType = (item.properties && item.properties.filter(property => property['values'].join() === '') !== []) ? item.properties.filter(property => property['values'].join() === '')[0] : undefined;
    let tBuffer = item.category ? (item.category[Object.keys(item.category)[0]].length > 0 ? item.category[Object.keys(item.category)[0]][0] : Object.keys(item.category)[0] ) : undefined
    let type = (propType ? propType.name : (tBuffer ? tBuffer : ''));
    
    _this_HTML = `<span class="Text" style="margin-top:5px">`;
    _this_HTML ? _HTML.push(_this_HTML) : null;
    _this_HTML = undefined;
    
    //
    //-> The quality percentage, if there is added quality for the item.
    let quality;
    
    //
    //-> Phys damage, if any.
    let __ = Objarr.filter(item.properties, 'name', 'Physical Damage')
    let physDmg = (item.properties && (item.properties.filter(property => (property.name === "Physical Damage")).length > 0)) ? item.properties.filter(property => (property.name === "Physical Damage"))[0].values[0][0] : undefined;
    _this_HTML = physDmg ? `<div></div><span>Physical Damage: <span class="Augmented">${physDmg}</span></span>` :'';
    _this_HTML ? _HTML.push(_this_HTML) : null;
    _this_HTML = undefined;
    
    //
    //-> The elemental damage of the item, if any.
    let elements = (item.properties && (item.properties.filter(property => (property.name === "Elemental Damage")).length > 0)) ? item.properties.filter(property => (property.name === "Elemental Damage"))[0].values : undefined;
    let elementDmg = getElementalDmg(elements);
    let tmp_HTML = [];
    for(let element in elementDmg) {
    	if (element === 'chaos') continue;
    	elementDmg[element] ? tmp_HTML.push(`${ tmp_HTML.length > 0 ? ', ' : ''}<span class="${capitalizeFirstLetter(element)}Damage">${elementDmg[element]}</span>`) : null;
    }
    
    if (tmp_HTML.length > 0) {
    	_this_HTML = ('<div></div><span>Elemental Damage: ' + tmp_HTML.join(''));
    }
    _this_HTML ? _HTML.push(_this_HTML) : null;
    _this_HTML = undefined;
    
    //
    //-> Chaos damage, if any.
     _this_HTML = elementDmg['chaos'] ? `<div></div><span>Chaos Damage: <span class="ChaosDamage">${elementDmg['chaos']}</span></span>` : undefined;
    _this_HTML ? _HTML.push(_this_HTML) : null;
    _this_HTML = undefined;
    
    //
    //-> jus a link, leave him alone :eyes:
    let img = item.icon;
    
    //
    //-> Other properties.
    _this_HTML = item.properties ? (item.properties.filter(property => 
    	(property['values'].join('') !== '' && !handledProperties.includes(property['name']) && !ignoredProperties.includes(property['name']))).map(p => 
    	'<div/>' + (p.name.includes('%') ? `<span>${
    		p.name.replace( /\%\d/g, function(s) { return ('<span class="Default">' + (p.values[parseInt(s.replace('%',''))][0]) + '</span>'); })
			}</span>` :
      `<span>${
      	p.name
      }: <span class="Default">${
      	p.values[0][0]
      }</span></span>`)
    ).join('')) : undefined;
    
    let prophtml = _this_HTML || undefined;
    //prophtml ? alert(prophtml) : null;
    _this_HTML ? _HTML.push(_this_HTML) : null;
    _this_HTML = undefined;
    
    //
    //-> Requirements
    Objarr.filter(item.requirements, 'name', 'Level');
    let LvlReq = Objarr.result.any ? Objarr.result.results[0].values[0][0] : undefined;
    Objarr.filter(item.requirements, 'name', 'Str');
    let StrReq = Objarr.result.any ? Objarr.result.results[0].values[0][0] : undefined;
    Objarr.filter(item.requirements, 'name', 'Dex');
    let DexReq = Objarr.result.any ? Objarr.result.results[0].values[0][0] : undefined;
    Objarr.filter(item.requirements, 'name', 'Int');
    let IntReq = Objarr.result.any ? Objarr.result.results[0].values[0][0] : undefined;
    
    let reqhtml = ((StrReq || DexReq || IntReq) || LvlReq) ? `${prophtml ? `<div class="ItemSeparator" style="background-image:url(${sepUrl(rarity)})"></div>` : ''}<div class="Requirements"><span class="Text">Requires ${LvlReq ? `Level <span class="Default">${LvlReq}</span>, ` : ''}${StrReq && StrReq > 0 ? `<span class="Default">${StrReq}</span> Str` : ''}${DexReq && DexReq > 0 ? `, <span class="Default">${DexReq}</span> Dex` : ''}${IntReq && IntReq > 0 ? `, <span class="Default">${IntReq}</span> Int` : ''}</span></div>` : undefined;
    _this_HTML = reqhtml || undefined;
    _this_HTML ? _HTML.push(_this_HTML) : null;
    _this_HTML = undefined;
    
    let range = (item.properties && (item.properties.filter(property => (property.name === "Weapon Range")).length > 0)) ? item.properties.filter(property => (property.name === "Weapon Range"))[0].values[0][0] : undefined;
    let fireDmg = elementDmg.fire;
    let lighDmg = elementDmg.lightning;
    let coldDmg = elementDmg.cold;
    let chaosDmg = elementDmg.chaos;
    let critChance = (item.properties && (item.properties.filter(property => (property.name === "Critical Strike Chance")).length > 0)) ? item.properties.filter(property => (property.name === "Critical Strike Chance"))[0].values[0][0] : undefined;
    let aps = (item.properties && (item.properties.filter(property => (property.name === "Attacks per Second")).length > 0)) ? item.properties.filter(property => (property.name === "Attacks per Second"))[0].values[0][0] : undefined;

    let impMods = item.implicitMods;
    let expMods = item.explicitMods;
    
    //
    //-> Description
    let flavText = item.flavourText || item.descrText;
    let descr = flavText ? `<div class="ItemSeparator" style="background-image:url(${sepUrl(rarity)})"></div><div class="FlavourText ${flavText && (flavText !== "") ? 'FlavourUnique' : ''}"><span>${flavText}</span></div>` : ''
    let width = item.w;
    let height = item.h;
    let x = item.x;
    let y = item.y;
    let identified = item.identified;
    
    create(itemName, baseType, type, rarity, barHeight, img, quality, range, physDmg, fireDmg, lighDmg, coldDmg, chaosDmg, critChance, aps, LvlReq, StrReq, DexReq, IntReq, impMods, null, expMods, flavText, width, height, x, y, true, prophtml, titlehtml, descr, _HTML.join(''));

  }
  
  //
  const _Stash_Tabs = {
  	__base: 'https://web.poecdn.com/gen/image/YTozOntpOjA7aToyNDtp/OjE7czozMjoiMDJhMTk3/N2QxZDAzNDQzNmU3NzM5/ZjgzZDEzYjIwN2YiO2k6/MjthOjI6e2k6MDtpOjI7/aToxO2E6Mzp7czoxOiJ0/IjtpOj{0}7czoxOiJuIjtz/OjA6IiI7czoxOiJjIjtp/{1}/{2}/Stash_Tab{3}.png',
  	_Stash_T_Colours: {
      names: ['yellow_dark', 'lime', 'red', 'magenta', 'purple', 'grey_light', 'red_light', 'brown_dark', 'lime_dark', 'brown', 'yellow', 'red_dark', 'magenta_dark', 'purple_dark', 'blue_dark', 'green_dark', 'grey_dark', 'blue', 'green', 'grey', 'brown_light', 'magenta_light', 'purple_light', 'blue_light', 'green_light', 'lime_light', 'yellow_light'],
      hashes: [['7b4a0c09c6', '48cdff3a2d', '2e84ef10af'],
    ['b0a652cf06', '3efc6bd8be', '9e2d61628d'], ['98a058fc32', 'edc7e2c501', '42ff0bf3e8'], ['b5a6e7231f', '7f17957d2b', '0ac5e6a211'], ['5721d0efa7', 'a46989dc8a', '577a5b5203'], ['ee8a4216f9', 'e0ce46cb01', 'f8f378ce64'], ['635831eed6', 'ab3648496e', '416089aa6f'], ['535a40fc8b', 'f159e79054', '21241d0535'], ['c64747b68d', 'd6161fcf22', '1185e76da6'], ['ae5b956193', '368b80b1e3', '8cafb9c169'], ['4fd846c823', '8842f2d7ef', '0916f3ec87'], ['8ade9bb940', 'ba64385447', '55c7c28a3a'], ['9124912871', '25eb8a934b', '732ef43793'], ['481dd89f29', '881ac4dd9b', '7f7af29d10'], ['7baaab4c91', 'c6786cda39', '997b161859'], ['f89df77009', 'b422cfa6fe', '5dcd75ab75'], ['6628828a0d', 'a2619ce769', '83ee9c99fb'], ['49ca92df25', '36ac864ec2', 'ebc3169574'], ['3d805e06a6', '3e1a877538', 'e93234071f'], ['3e1c96f156', '9da13bb4dc', '5ff1e90713'], ['bb01c61c4f', '2555475f96', 'ff0e063243'], ['9aa6ef60b7', '0fb4c41aab', 'd2784cca4f'], ['8838d97f87', '23ecc5b004', 'b4dd7a01b4'], ['ce67a12d5c', 'b0c1218fe0', '3690bb27e5'], ['21d6a945b0', 'b36dcdd84f', '3a56bd0acc'], ['f0094a0c50', 'b33be143fc', '8e9ec1995a'], ['8ff4253efe', 'bb73f12637', '22745ba921']],
      ids: ['Oi0yMjAxNjt9fX0,', 'Oi00MTk3MTIwO319fQ,,', 'Oi00MjU5ODQwO319fQ,,', 'Oi0zNDA3NzE4O319fQ,,', 'Oi0xMDg3ODc5Nzt9fX0,', 'Oi0yMjM2OTYzO319fQ,,', 'Oi0zMjY0MDt9fX0,', 'OjgxNDgwMjI7fX19', 'Oi0xMDI1NjM4NDt9fX0,', 'Oi00MjM1Nzc2O319fQ,,', 'Oi0xMTAwODt9fX0,', 'Oi0xMDk0NDUxMjt9fX0,', 'Oi05MjQwNDkxO319fQ,,', 'Oi0xMzg5MzU0Mzt9fX0,', 'Oi0xNjc3NzA4ODt9fX0,', 'Oi0xNjc1NzUwNDt9fX0,', 'Oi0xMzQ4NzU2Njt9fX0,', 'Oi0xNjc3Njk2MTt9fX0,', 'Oi0xNjcyODMyMDt9fX0,', 'Oi03ODI5MzY4O319fQ,,', 'Oi0xNjUxMjt9fX0,', 'Oi0zMjU0NTt9fX0,', 'Oi00MTYxMjgxO319fQ,,', 'Oi04MzQyNTI5O319fQ,,', 'Oi04MzIzMjAwO319fQ,,', 'Oi05ODMxNjg7fX19', 'Oi0xMDM7fX19'],
      chars: ["L", "C", "R", "E", "I", "M"]
    }, 
  getStashTabUrl: (loc, colour) => {
    let idx = _Stash_Tabs._Stash_T_Colours.chars.indexOf(loc);
  	return (_Stash_Tabs.__base.formatUnicorn(_Stash_Tabs._Stash_T_Colours.chars[idx + 3], _Stash_Tabs._Stash_T_Colours.ids[_Stash_Tabs._Stash_T_Colours.names.indexOf(colour)], _Stash_Tabs._Stash_T_Colours.hashes[_Stash_Tabs._Stash_T_Colours.names.indexOf(colour)][idx], loc));
  }
}
  window.open(_Stash_Tabs.getStashTabUrl('C', 'green'))
  
  
  //https://web.poecdn.com/gen/image/YTozOntpOjA7aToyNDtp/OjE7czozMjoiMDJhMTk3/N2QxZDAzNDQzNmU3NzM5/ZjgzZDEzYjIwN2YiO2k6/MjthOjI6e2k6MDtpOjI7/aToxO2E6Mzp7czoxOiJ0/IjtpOj**czoxOiJuIjtz/OjA6IiI7czoxOiJjIjtp/O*******************/**********/Stash_Tab*.png
/*
*/
 // window.open(getStashTabUrl('L', 'red_dark'));
  assignWidths();
	assignTippyTooltip();
});