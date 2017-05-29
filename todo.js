"use strict"
//This software is provided with Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) lisence.
//You can read the full text of this license here https://creativecommons.org/licenses/by-nc/4.0/legalcode 
//Commercial usage is not allowed. (c) Remixer Dec 2017
if(!('localStorage' in window && window['localStorage'] !== null)){
    alert('локальное хранилище не поддерживается')
    window.localStorage = {
    _data       : {},
    setItem     : function(id, val) { return this._data[id] = String(val); },
    getItem     : function(id) { return this._data.hasOwnProperty(id) ? this._data[id] : undefined; },
    removeItem  : function(id) { return delete this._data[id]; },
    clear       : function() { return this._data = {}; }
  };
}
var lists = JSON.parse(localStorage.lists || '["default"]');
var items = JSON.parse(localStorage.default || "[]");
var currentList = 0;
var sts = {
  "ru":{
    tni:"здесь пусто",
    title: "Lister - менеджер списков",
    lists: "все списки",
    desc: "Приложение для ведения списков, без излишеств. Все данные сохраняются локально на вашем устройстве. Приложение может работать без интернета, после первого запуска. Удалять элементы и списки можно жестами вправо и влево по экрану. ПО и его исходный код предоставляются по лицензии <a href='https://creativecommons.org/licenses/by-nc/4.0/legalcode'>CC BY-NC 4.0</a> <br><sup>(c)Remixer Dec "+(1900+new Date().getYear())+"</sup>",
    def: "список дел",
    placeholder: " ",
    ccl:"Невозможно создать список с таким именем",
  },
  "en":{
    tni:"nothing here",
    title: "Lister - simple list manager & ToDo",
    lists: "all lists",
    desc: "Create and manage lists with this app. All data is stored locally on your device. This app can be used without Internet Connection, after you add it to your Homescreen. You can delete elements with swipes. This Sowftware and sources are provided with <a href='https://creativecommons.org/licenses/by-nc/4.0/legalcode'>CC BY-NC 4.0</a> License <br><sup>(c)Remixer Dec "+(1900+new Date().getYear())+"</sup>",
    def: "ToDo List",
    placeholder: " ",
    ccl: "Unable to create list with that name",
  }
}

var isgoing = 0;
var hlang = 'en';
var nl = navigator.language;
if(nl.substr(0,2)=="ru"||nl.substr(0,2)=="ua"){
   hlang = "ru";
   thing.placeholder=sts[hlang].placeholder;
   td.innerHTML = sts[hlang].def;
   xhtitle.innerHTML = sts[hlang].lists;
}
var demoelement = "<div class='element' style='height:0' id='demo'>"+sts[hlang].tni+"</div>";

function getst(element, CSSProperty) {
    return (typeof getComputedStyle == "undefined" ? element.currentStyle : getComputedStyle(element, null))[CSSProperty];
}
function setItems(n){
    items = JSON.parse(localStorage[n]||"[]");  
}
function init(){
  for(var el of items){
    cont.innerHTML+="<div class='element'>" + el + "</div>";
  }
  if(items.length == 0){
    cont.innerHTML += demoelement;
    setTimeout(function(){demo.style.height='34px';},40);
  }
  for(var el of lists){
    var lid = 'l'+new Date().getTime();
    if(el == "default"){lid = "ldefault";el = sts[hlang].def}
    ruh.innerHTML+= '<div id="'+lid+'" class="element lst">'+el+'</div>'
  }
  setEvents();
}
function showLists(){
  listbox.style.display='block';
  setTimeout(function(){listbox.style.opacity=1},90);
}
function close(){
  listbox.style.opacity=0;
  setTimeout(function(){listbox.style.display='none'},390);
}
function addList(){
  var text = listi.value==''?false:listi.value; //listi is an input element
  if(!text){return}
    if(text == "default" || text == "lists"){alert(sts[hlang].ccl);return}
  while(lists.includes(text)){
    text+=" ";
  }
  text = text.replace(/\</g,"&lt;");
  text = text.replace(/\>/g,"&gt;");
  lists.push(text);
  listi.value='';
  localStorage['lists'] = JSON.stringify(lists);
  var id = 'l'+new Date().getTime();
  ruh.innerHTML+="<div style='height:0px' class='element lst' id='"+id+"'>" + text + "</div>";
  setTimeout(function(){window[id].style.height="34px";setEvents()},40);
}
function add(){
  var text = thing.value==''?false:thing.value;
  if(!text) return;
  var list = lists[currentList];
  if('demo' in window){demo.style.height="0px";demo.style.opacity="0px";setTimeout(()=>{demo.remove()},302)}
  while(items.includes(text)){
    text+=" "; //too add different elements with the same name
  }
  items.push(text);
  thing.value='';
  localStorage[list] = JSON.stringify(items);
  var id = 'i'+new Date().getTime();
  cont.innerHTML+="<div style='height:0px' class='element' id='"+id+"'>" + text + "</div>";
  setTimeout(function(){window[id].style.height="34px";setEvents()},40);
}
function del(e){
  if(e.target.id[0]=='l'){
    if(lists.indexOf(e.target.innerHTML)!=-1){
      if(e.target.id!='ldefault'){
        var ln = lists.indexOf(e.target.innerHTML);
        isgoing += 1;
        lists.splice(lists.indexOf(e.target.innerHTML),1);
        localStorage.removeItem(e.target.innerHTML);
        localStorage['lists'] = JSON.stringify(lists);
        var st=getst(e.target,"width");
        var mr = e.gesture.direction=="left"?"1px "+st+" 0 20px":"1px 20px 0 "+st;
        e.target.style.margin = mr;
        setTimeout(function(){e.target.innerHTML=''},100);
        setTimeout(function(){e.target.style.height=0},301);
        setTimeout(function(){
          e.target.remove();
          isgoing -=1 ;
          if(ln == currentList){
            selectList({id:'ldefault'},true);
          }
        },661); 
      }      
    }
  } else if(items.indexOf(e.target.innerHTML)!=-1){
    isgoing +=1 ;
    items.splice(items.indexOf(e.target.innerHTML),1);
    localStorage[lists[currentList]] = JSON.stringify(items);
    var st=getst(e.target,"width");
    var mr = e.gesture.direction=="left"?"1px "+st+" 0 20px":"1px 20px 0 "+st;
    e.target.style.margin = mr;
    setTimeout(function(){e.target.innerHTML=''},100);
    setTimeout(function(){e.target.style.height=0},301);
    setTimeout(function(){e.target.remove();isgoing -=1;
      if (isgoing == 0 && items.length == 0 && !("demo" in window)) {
        cont.innerHTML += demoelement;
        setTimeout(function(){demo.style.height='34px';},40);
        }
    },661); 
  }
}
function selectList(id,notclose){
  if(!isgoing){
    if(id.id == "ldefault"){
      id = "default";
    }else{
      id = id.innerHTML
    }
    currentList = lists.indexOf(id);
    td.innerHTML = id=="default"?sts[hlang].def:id;
    currentList = currentList==-1?0:currentList;
    setItems(id);
    cont.innerHTML = '';
    for(var el of items){
      cont.innerHTML += "<div class='element'>" + el + "</div>";
    }
    if(items.length == 0){
      cont.innerHTML += "<div class='element' id='demo'>"+sts[hlang].tni+"</div>";
    }
    setEvents();
    if(typeof notclose !='undefined'){} else {close()}
  }
}
function setEvents(){
  var ea = document.getElementsByClassName('element');
  for(var el of ea){
   Hammer(el).on("swipeleft dragleft swiperight dragright", function(e){del(e)});
  }
  var la = document.getElementsByClassName('lst');
  for(var el of la){
   Hammer(el).on("tap", function(e){selectList(e.target)});
  }
}
//everything bellow was not modefied (almost)
function showHelp(){ 
  var helpBox=document.createElement('div');
  helpBox.id="helpbox";
  helpBox.className="helpbox";
  helpBox.innerHTML="<div id='htitle'>"+sts[hlang].title+"</div><div id='hcont'>"+sts[hlang].desc+"</div><div onclick='this.parentNode.remove()' id='okhbtn'>X</div>";
  document.body.appendChild(helpBox)
  var hbx=document.getElementById("helpbox");
  var htc=document.getElementById("hcont");
  hbx.style.opacity=0;
  setTimeout(function(){hbx.style.opacity=1;},30);
 }
init();

if(navigator.serviceWorker){
  navigator.serviceWorker.register('sw.js', {
  scope: '/Lister'
});
}