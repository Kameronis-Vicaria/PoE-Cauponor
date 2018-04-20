//-> String format function.
String.prototype.formatUnicorn = String.prototype.formatUnicorn || function() {
  "use strict";
  var str = this.toString();
  if (arguments.length) {
    var t = typeof arguments[0];
    var key;
    var args = ("string" === t || "number" === t) ? Array.prototype.slice.call(arguments) : arguments[0];
    for (key in args) {
      str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
    }
  }
  return str;
};

//-> Define stuff.
const UrlBase = 'https://web.poecdn.com';
const Url = {
  'sep': '/image/Art/2DArt/UIImages/InGame/ItemsSeparator{0}.png?scale=1&v=bdf0e0541ff8d2a7191264a28fd5cb3b&scaleIndex=0',
  'title': '/image/Art/2DArt/UIImages/InGame/ItemsHeader{0}{1}.png?scale=1&version=13e64d23f9f232fb83d1e59f4441bbcf'
};
const sepUrl = function(type) {
  return (UrlBase + Url[arguments.callee.name.replace('Url', '')].formatUnicorn(type));
}
const titleUrl = function(pos, type) {
  return (UrlBase + Url[arguments.callee.name.replace('Url', '')].formatUnicorn(type, pos));
}
const styleColors = {
  'White': '#c8c8c8',
  'Magic': '#8888ff',
  'Rare': '#ffff77',
  'Unique': '#af6025',
  'Gem': '#1ba29b',
  'Quest': '#4ae63a',
  'Prophecy': '#b54bff',
  'Currency': '#aa9e82'
};
const dmgTypes = {
  0: "physical",
  1: "modified",
  4: "fire",
  5: "cold",
  6: "lightning",
  7: "chaos"
};
const barTypes = {
  0: "White",
  1: "Magic",
  2: "Rare",
  3: "Unique",
  4: "Gem",
  5: "Currency",
  6: "Divination",
  7: "Quest",
  8: "Prophecy",
  9: "Relic"
}

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
    var tooltipWidth = tooltip.width();
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
  while (arr.length < 1) {
    var randomnumber = Rand(parseInt(Number.MAX_SAFE_INTEGER.toString().slice(0, digits)), 10 * digits);
    if (tooltips.indexOf('item_' + randomnumber) > -1) continue;
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
  type = ["Currency", "Divination", "Hideout", ""].indexOf(type) === -1 ? type + 's' : type;
  return `https://web.poecdn.com/image/Art/2DItems/${type}/${subtype ? subtype + 's/' : ''}${itemType + 's'}/${charRm(name, [' ', "'"])}.png?scale=1&v=a2dc79b071735a12dfcbf002c4c20002`;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getElementalDmg(data) {
  let buffer = {
    "fire": undefined,
    "lightning": undefined,
    "cold": undefined,
    "chaos": undefined
  };
  if (!data) return buffer;
  for (var k = 0; k < data.length; k++) {
    buffer[dmgTypes[data[k][1]]] = data[k][0];
  }
  return buffer;
}

//-> Create Item, placeholder button html element, and the soon-to-be-created 'tooltip' inner html.
function create(itemName, baseType, type, rarity, barHeight, img, quality, range, physDmg, fireDmg, lighDmg, coldDmg, chaosDmg, critChance, aps, LvlReq, StrReq, DexReq, IntReq, impMod, crfMod, expMods, flavText, width, height, x, y, identified) {
  const tooltipId = genUID(9);
  var html = `<div id=tooltip${tooltipId}><table align=center><tr><td><div class="ItemContainer"><div class="ItemBox" style="border-color:${styleColors[rarity]}"><div class="ItemContent"><div class="TitleBar ${barHeight==1 ? 'Single' : 'Double'}Bar" style="background-image:url(${titleUrl("Middle", rarity)})"><div class="${barHeight==1 ? 'SingleBar SingleEnd' : 'DoubleBar DoubleEnd'} TitleBarL" style="background-image:url(${titleUrl("Left", rarity)})"></div><div class="TitleBarR ${barHeight==1 ? 'SingleBar SingleEnd' : 'DoubleBar DoubleEnd'}" style="background-image:url(${titleUrl("Right", rarity)})"></div><span class="ItemName" style="color:${styleColors[rarity]}">${itemName}</span>${barHeight==2 ? `<div></div><span class="ItemName" style="color:${styleColors[rarity]}">${baseType}</span>` : ''}</div><div class="ItemStats Text"><span class="Text"><span>${type}</span><div></div>${quality ? `<span>Quality: <span class="Augmented">${quality}</span></span>` : ''}${physDmg ? `<div></div><span>Physical Damage: <span class="Augmented">${physDmg}</span></span>` : ''}${(fireDmg || lighDmg || coldDmg) ? `<div></div><span>Elemental Damage: ${fireDmg ? `<span class="FireDamage">${fireDmg}</span>` : ''}${lighDmg ? `${ fireDmg ? ',' : ''} <span class="LightningDamage">${lighDmg}</span>` : ''}${coldDmg ? `${ fireDmg || lighDmg ? ',' : ''} <span class="ColdDamage">${coldDmg}</span>` : ''}</span>` : ''}${chaosDmg ? `<div></div><span>Chaos Damage: <span class="ChaosDamage">${chaosDmg}</span></span>` : ''}<div></div><span>Critical Strike Chance: <span class="Default">${critChance}</span></span><div></div><span>Attacks per Second: <span class="Default">${aps}</span></span></span></div><div class="ItemSeparator" style="background-image:url(${sepUrl(rarity)})"></div><div class="Requirements"><span class="Text">Requires Level <span class="Default">${LvlReq}</span>${StrReq && StrReq > 0 ? `, <span class="Default">${StrReq}</span> Str` : ''}${DexReq && DexReq > 0 ? `, <span class="Default">${DexReq}</span> Dex` : ''}${IntReq && IntReq > 0 ? `, <span class="Default">${IntReq}</span> Int` : ''}</span></div><div class="ItemSeparator" style="background-image:url(${sepUrl(rarity)})"></div>${impMod && impMod !== "" ? `<div class="ImplicitMod"><span>${impMod}</span></div><div class="ItemSeparator" style="background-image:url(${sepUrl(rarity)})"></div>` : ''}${expMods && expMods.length > 0 ? `<div class="ExplicitMod"><span>${'<p>' + expMods.join('<p>')}</span></div>` : ''}${flavText && flavText !== "" ? `<div class="ItemSeparator" style="background-image:url(${sepUrl(rarity)})"></div><div class="FlavourText FlavourUnique"><span>${flavText}</span></div>` : ''}</div></div></div></div></table></div>`;

  document.getElementById("hideTooltip").appendChild(createElementFromHTML(html));
  document.getElementById("stashTab1").appendChild(createElementFromHTML(`<button id="${tooltipId}"></button>`))
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
    let handledProperties = ['Elemental Damage']

    //
    //-> Other properties.
    item.properties ? alert(JSON.stringify(item.properties.filter(property => (property['values'].join('') !== '' && !handledProperties.includes(property['name']))))) : null

    //
    //-> The item name and base type.
    let itemName = unescape(item.name).replace(/\<.+\>/, "");
    let baseType = unescape(item.typeLine).replace(/\<.+\>/, "");
    let rarity = barTypes[item.frameType];
    let barHeight = (itemName === '') ? 1 : 2;

    _this_HTML = `<div class="TitleBar ${barHeight==1 ? 'Single' : 'Double'}Bar" style="background-image:url(${titleUrl("Middle", rarity)})"><div class="${"{0}Bar {0}End".formatUnicorn(barHeight==1 ? 'Single' : 'Double')} TitleBarL" style="background-image:url(${titleUrl("Left", rarity)})"></div><div class="TitleBarR ${"{0}Bar {0}End".formatUnicorn(barHeight==1 ? 'Single' : 'Double')}" style="background-image:url(${titleUrl("Right", rarity)})"></div><span class="ItemName" style="color:${styleColors[rarity]}">${itemName}</span>${barHeight==2 ? `<div></div><span class="ItemName" style="color:${styleColors[rarity]}">${baseType}</span>` : ''}</div>`;
    _this_HTML ? _HTML.push(_this_HTML) : null;
    _this_HTML = undefined;

    //
    //-> The item's Type.
    let propType = (item.properties && item.properties.filter(property => property['values'].join() === '') !== []) ? item.properties.filter(property => property['values'].join() === '')[0] : undefined;
    let tBuffer = item.category ? (item.category[Object.keys(item.category)[0]].length > 0 ? item.category[Object.keys(item.category)[0]][0] : Object.keys(item.category)[0]) : undefined
    let type = (propType ? propType.name : (tBuffer ? tBuffer : ''));

    _this_HTML = `<span class="Text"><span>${type}</span><div>`;
    _this_HTML ? _HTML.push(_this_HTML) : null;
    _this_HTML = undefined;

    //
    //-> The elemental damage of the item, if any.
    let elements = (item.properties && (item.properties.filter(property => (property.name === "Elemental Damage")).length > 0)) ? item.properties.filter(property => (property.name === "Elemental Damage"))[0].values : undefined;
    let elementDmg = getElementalDmg(elements);
    let tmp_HTML = [];
    for (let element in elementDmg) {
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
    //-> The quality percentage, if there is added quality for the item.
    let quality = (item.properties && (item.properties.filter(property => (property.name === "Quality")).length > 0)) ? item.properties.filter(property => (property.name === "Quality"))[0].values[0][0] : undefined;
    _this_HTML = quality ? `<span>Quality: <span class="Augmented">${quality}</span></span>` : undefined
    _this_HTML ? _HTML.push(_this_HTML) : null;
    _this_HTML = undefined;

    let range = (item.properties && (item.properties.filter(property => (property.name === "Weapon Range")).length > 0)) ? item.properties.filter(property => (property.name === "Weapon Range"))[0].values[0][0] : undefined;
    let physDmg = (item.properties && (item.properties.filter(property => (property.name === "Physical Damage")).length > 0)) ? item.properties.filter(property => (property.name === "Physical Damage"))[0].values[0][0] : undefined;
    let fireDmg = elementDmg.fire;
    let lighDmg = elementDmg.lightning;
    let coldDmg = elementDmg.cold;
    let chaosDmg = elementDmg.chaos;
    let critChance = (item.properties && (item.properties.filter(property => (property.name === "Critical Strike Chance")).length > 0)) ? item.properties.filter(property => (property.name === "Critical Strike Chance"))[0].values[0][0] : undefined;
    let aps = (item.properties && (item.properties.filter(property => (property.name === "Attacks per Second")).length > 0)) ? item.properties.filter(property => (property.name === "Attacks per Second"))[0].values[0][0] : undefined;
    let LvlReq = (item.requirements && (item.requirements.filter(property => (property.name === "Level")).length > 0)) ? item.requirements.filter(property => (property.name === "Level"))[0].values[0][0] : undefined;
    let StrReq = (item.requirements && (item.requirements.filter(property => (property.name === "Str")).length > 0)) ? item.requirements.filter(property => (property.name === "Str"))[0].values[0][0] : undefined;
    let DexReq = (item.requirements && (item.requirements.filter(property => (property.name === "Dex")).length > 0)) ? item.requirements.filter(property => (property.name === "Dex"))[0].values[0][0] : undefined;
    let IntReq = (item.requirements && (item.requirements.filter(property => (property.name === "Int")).length > 0)) ? item.requirements.filter(property => (property.name === "Int"))[0].values[0][0] : undefined;
    let impMods = item.implicitMods;
    let expMods = item.explicitMods;
    let flavText = item.flavourText;
    let width = item.w;
    let height = item.h;
    let x = item.x;
    let y = item.y;
    let identified = item.identified;

    create(itemName, baseType, type, rarity, barHeight, img, quality, range, physDmg, fireDmg, lighDmg, coldDmg, chaosDmg, critChance, aps, LvlReq, StrReq, DexReq, IntReq, impMods, null, expMods, flavText, width, height, x, y, true)

    //console.log(range);
    //(itemName, baseType, type, rarity, barHeight, img, quality, range, physDmg, fireDmg, lighDmg, coldDmg, chaosDmg, critChance, aps, LvlReq, StrReq, DexReq, IntReq, impMod, crfMod, expMods, flavText, width, height, x, y, identified)
  }

  assignWidths();
  assignTippyTooltip();
});

//console.log(constructUrl('Weapon', 'OneHandWeapon', 'Claw', "Cybil's Paw"));

/* create("Thicc boi's Septere", "Vaal Septere", "Septere", "Prophecy", 1, "https://web.poecdn.com/image/Art/2DItems/Weapons/OneHandWeapons/Scepters/DoryanisCatalyst.png?scale=1&scaleIndex=0&w=2&h=3&v=a2dc79b071735a12dfcbf002c4c20002", 99, 11, [21904, 28376], null, null, [69, 91], [39, 49], 99.99, 6.50, 999, 999, 0, 999, "99% more Thicc-ness", "", ["Socketed Gems are Supported by Level 20 Elemental Proliferation", "Adds 68 to 156 Physical Damage", "15% increased Attack Speed", "6% increased Cast Speed<p>31% increased Global Critical Strike Chance", "0.2% of Elemental Damage Leeched as Life", "88% increased Elemental Damage"], "The result of the catalytic reaction would be either immortality for all, or death for all. It was a risk Doryani was willing to take. 1", 2, 3, 0, 0, true);

create("Thicc boi's Septere 2", "Vaal Septere", "Septere", "Unique", 2, "https://web.poecdn.com/image/Art/2DItems/Weapons/OneHandWeapons/Scepters/DoryanisCatalyst.png?scale=1&scaleIndex=0&w=2&h=3&v=a2dc79b071735a12dfcbf002c4c20002", 99, 11, [991904, 998376], null, null, [69, 91], [39, 49], 99.99, 6.50, 999, 999, 0, 999, "99% more Thicc-ness", "", ["Socketed Gems are Supported by Level 20 Elemental Proliferation", "Adds 68 to 156 Physical Damage", "15% increased Attack Speed", "6% increased Cast Speed<p>31% increased Global Critical Strike Chance", "0.2% of Elemental Damage Leeched as Life", "88% increased Elemental Damage"], "The result of the catalytic reaction would be either immortality for all, or death for all. It was a risk Doryani was willing to take. 2", 2, 3, 2, 0, false);

create("Thicc boi's Septere 2", "Vaal Septere", "Septere", "Gem", 1, "https://web.poecdn.com/image/Art/2DItems/Weapons/OneHandWeapons/Scepters/DoryanisCatalyst.png?scale=1&scaleIndex=0&w=2&h=3&v=a2dc79b071735a12dfcbf002c4c20002", 99, 11, [991904, 998376], null, null, [69, 91], [39, 49], 99.99, 6.50, 999, 999, 0, 999, "99% more Thicc-ness", "", ["Socketed Gems are Supported by Level 20 Elemental Proliferation", "Adds 68 to 156 Physical Damage", "15% increased Attack Speed", "6% increased Cast Speed<p>31% increased Global Critical Strike Chance", "0.2% of Elemental Damage Leeched as Life", "88% increased Elemental Damage"], "The result of the catalytic reaction would be either immortality for all, or death for all. It was a risk Doryani was willing to take. 3", 2, 3, 5, 7, true);

create("Thicc boi's Septere 2", "Vaal Septere", "Septere", "White", 1, "https://web.poecdn.com/image/Art/2DItems/Weapons/OneHandWeapons/Scepters/DoryanisCatalyst.png?scale=1&scaleIndex=0&w=2&h=3&v=a2dc79b071735a12dfcbf002c4c20002", 99, 11, [991904, 998376], null, null, [69, 91], [39, 49], 99.99, 6.50, 999, 999, 0, 999, "99% more Thicc-ness", "", ["Socketed Gems are Supported by Level 20 Elemental Proliferation", "Adds 68 to 156 Physical Damage", "15% increased Attack Speed", "6% increased Cast Speed<p>31% increased Global Critical Strike Chance", "0.2% of Elemental Damage Leeched as Life", "88% increased Elemental Damage"], "The result of the catalytic reaction would be either immortality for all, or death for all. It was a risk Doryani was willing to take. 4", 2, 3, 7, 3, false);

create("Thicc boi's Septere 2", "Vaal Septere", "Septere", "Quest", 1, "https://web.poecdn.com/image/Art/2DItems/Weapons/OneHandWeapons/Scepters/DoryanisCatalyst.png?scale=1&scaleIndex=0&w=2&h=3&v=a2dc79b071735a12dfcbf002c4c20002", 99, 11, [991904, 998376], null, null, [69, 91], [39, 49], 99.99, 6.50, 999, 999, 0, 999, "99% more Thicc-ness", "", ["Socketed Gems are Supported by Level 20 Elemental Proliferation", "Adds 68 to 156 Physical Damage", "15% increased Attack Speed", "6% increased Cast Speed<p>31% increased Global Critical Strike Chance", "0.2% of Elemental Damage Leeched as Life", "88% increased Elemental Damage"], "The result of the catalytic reaction would be either immortality for all, or death for all. It was a risk Doryani was willing to take. 5", 2, 3, 0, 9, true);

create("Thicc boi's Ring 2", "Vaal Septere", "Septere", "Currency", 1, "https://web.poecdn.com/image/Art/2DItems/Rings/BreachRing.png?scale=1&scaleIndex=0&w=1&h=1&v=b033df55e6cc9cd0403d5ecd5e91d5a0", 99, 11, [991904, 998376], null, null, [69, 91], [39, 49], 99.99, 6.50, 999, 999, 0, 999, "99% more Thicc-ness", "", ["Socketed Gems are Supported by Level 20 Elemental Proliferation", "Adds 68 to 156 Physical Damage", "15% increased Attack Speed", "6% increased Cast Speed<p>31% increased Global Critical Strike Chance", "0.2% of Elemental Damage Leeched as Life", "88% increased Elemental Damage"], "The result of the catalytic reaction would be either immortality for all, or death for all. It was a risk Doryani was willing to take. 6", 1, 1, 3, 7, true); */
