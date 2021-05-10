var timeout;
var h_times = [];
var t = 0;
var games = 0;
var timerId = 0;

function start(){
	remove_children("playtable")
	remove_children("cards")
	create_elem("DIV", "0", "playtable", "0", "card");

	var array = []
	var x = 0
	while (array.length < 6){
		x = Math.floor(Math.random()*100)
		// console.log(x)
		if (array.indexOf(x) < 0 && x != 0) {
			array.push(x)
		}
		
		
	}
	// console.log(array)
	window.human_cards = [array[0], array[1], array[2]]
	window.comp_cards = [array[3], array[4], array[5]]
	for (i = 0; i < human_cards.length; i++) {
		
		var btn = create_elem("BUTTON", human_cards[i], "cards", human_cards[i], "card");
		btn.setAttribute("onclick","puts_card(this.textContent)");
	}
	t = new Date();
	document.getElementById("games").innerText = games;
	games ++;
	clearTimeout(timerId); 
	
	document.getElementById('b').innerHTML = "Pause";
	document.getElementById('b').onclick = pause;
	timer();
	comp_listen()
	
}

function timer(){
	var x = document.getElementById('timer').innerHTML --;


	if(x<1){
		for (var i = 0; i < human_cards.length; i++) {
			human_cards[i] = parseInt(human_cards[i])
		}
		human_cards.sort(function(a,b){return a-b;});
		document.getElementById('timer').innerHTML = 30;
		puts_card(human_cards[0]);
		}
	else{
		timerId = setTimeout(timer,1000);
		}
}

function puts_card(x){
	var array = get_children("playtable");
	temp = x - array[array.length-1];
	h_times.push([x, temp, (new Date - t)/1000]);
	document.cookie = "ht" + "=" + h_times + "; expires=" + 3600 * 24 * 30
	t = new Date();
	try{
		document.getElementById("cards").removeChild(document.getElementById(String(x)));  
	} 
	catch (err) {
		document.getElementById("cards").removeChild(document.getElementById(parseInt(x)));  
	}
	create_elem("DIV", x, "playtable", x, "card");
	check_cards();
	document.getElementById('timer').innerHTML = 30;
	comp_listen()
}

function put_card(x){
	var temp = []
	for (var i = 0; i < comp_cards.length; i++) {
		if (parseInt(comp_cards[i]) != parseInt(x)){
			temp.push(comp_cards[i])
		}
	}
	comp_cards = temp
	create_elem("DIV", x, "playtable", x, "card");
	
	check_cards();
	document.getElementById('timer').innerHTML = 30;
	
	comp_listen()
}

function remove_children(id){
	var myNode = document.getElementById(id);
	while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}
}

function create_elem(type, id, parentId, text, child_class){
	var div = document.createElement(type);       
	div.id = id;
	div.className += child_class;
	var t = document.createTextNode(text);       // Create a text node
	div.appendChild(t);                            
	if (parentId) document.getElementById(parentId).appendChild(div);  
	return div;
}
	
function comp_listen(x=0){
	if (comp_cards.length > 0){
		for (var i = 0; i < comp_cards.length; i++) {
			comp_cards[i] = parseInt(comp_cards[i])
		}
		comp_cards.sort(function(a,b){return a-b;});
		// console.log("Comp`s", comp_cards)
		var array = get_children("playtable")
		var last = parseInt(array[array.length-1])
		var diff = parseInt(comp_cards[0]) - last - x
		var human_cards_total = 7 - get_children("playtable").length - comp_cards.length
		if (diff <= 1 || human_cards_total == 0){
			setTimeout(function() {
				clearTimeout(timeout)
				timeout = undefined;
				put_card(comp_cards[0]);
			}, 500);
		}
		else{
			var delay = Math.pow(Math.log(diff), 2) + diff/15;
			// console.log("Waits to put", comp_cards[0], "for", delay.toFixed(1), "sec")
			clearTimeout(timeout)
			timeout = setTimeout(function() {
				comp_listen(diff)
			}, delay*1000);
			
		}
	}
}	 
	
function pause(){
	clearTimeout(timeout)
	clearTimeout(timerId)
	var b = document.getElementById('b')
	b.innerHTML = "Resume"
	b.onclick = resume
	var array = get_children("cards");
	for (var i = 0; i < human_cards.length; i++) {
		document.getElementById(human_cards[i]).onclick = undefined
	}
}	

function resume(){
	comp_listen(0);
	timer();
	var b = document.getElementById('b')
	b.innerHTML = "Pause"
	b.onclick = pause
	var array = get_children("cards");
	for (var i = 0; i < human_cards.length; i++) {
		document.getElementById(human_cards[i]).setAttribute("onclick","puts_card(this.textContent)");
	}
}
	
function comp_move(){
	for (var i = 0; i < comp_cards.length; i++) {
		comp_cards[i] = parseInt(comp_cards[i])
	}
	comp_cards.sort(function(a,b){return a-b;});
	// console.log("Comp`s", comp_cards)
	var array = get_children("playtable")
	// console.log("On the table", array)
	var last = parseInt(array[array.length-1])
	var comp_first = parseInt(comp_cards[0])
	
	if (comp_first < last) {
		alert("You lose"); 
		// console.log(h_times)
		console.log(getCookie("ht"))
		document.getElementById("stat").innerText = parseInt(document.getElementById("stat").innerText) - 1
		start();
	}
	else {
		for (var i = 0; i < comp_cards.length; i++) {
			if (comp_cards[i] > last) {
				
				
				put_card(comp_cards[i]); 
				break;
			}
		}
	}
}

function get_children(id){
	var c = document.getElementById(id).childNodes;
	var array = []
	for (var i = 0; i < c.length; i++) {
		array.push(c[i].id)
	}
	return array;
}

function check_cards(){
	var array = get_children("playtable");
	var last = parseInt(array[array.length-1])
	var almost_last = parseInt(array[array.length-2])
	
	if (last < almost_last) { 
		alert("You lose!"); 
		// console.log(h_times)
		console.log(getCookie("ht"))
		document.getElementById("stat").innerText = parseInt(document.getElementById("stat").innerText) - 1
		setTimeout(start, 500);
	}
	else if (array.length == 7){ 
		alert("You won!!"); 
		// console.log(h_times)
		console.log(getCookie("ht"))
		
		document.getElementById("stat").innerText = parseInt(document.getElementById("stat").innerText) + 1
		setTimeout(start, 500);
	}
}

function getHTimes() {
	var tt = [];
	var ee;
	var temp = getCookie("ht");
	// 28,15,17.256,
	// 45,17,11.483,
	// 84,39,15.84
	for (var i = 0; i < temp.length; i++) {
		if (i % 3 == 0){
			ee = temp[i]
			if (!h_times.includes(ee)) {
				h_times.push(
					)
			}
		}
		else {
			tt.push(temp[i])
		}
		console.log(temp[i])
	}
}	

function getCookie(name) {
	var cookie = " " + document.cookie;
	var search = " " + name + "=";
	var setStr = null;
	var offset = 0;
	var end = 0;
	if (cookie.length > 0) {
		offset = cookie.indexOf(search);
		if (offset != -1) {
			offset += search.length;
			end = cookie.indexOf(";", offset)
			if (end == -1) {
				end = cookie.length;
			}
			setStr = unescape(cookie.substring(offset, end));
		}
	}
	return(setStr);
}

module.exports = create_elem;
