// TASKS
    // add statistics
    // TODO: add detection of open devtools
    // https://stackoverflow.com/questions/7798748/find-out-whether-chrome-console-is-open

let attempt = 0;
let N = 6; // number of attempts
let timeoutID;
let allSchemas = [];
let currentLang= "eng";
let isDone = false;
let dataset;
let cookie = {};


let colours = {
    "green": "#62e2d0",
    "yellow": "#ffec68",
    "gray": "#b8b8b8",
    "red": "#c81d1d",
    "white": "#dfe8e8",
    "whitish": "#f9f9f9"
}
//🟨⬜️🟩🟥⬛️
let emojis = {
    "#62e2d0": "🟩",
    "#ffec68": "🟨",
    "#b8b8b8": "⬜️",
    "#c81d1d": "🟥"
}

let attempts = {
    "first": 1,
    "second": 2,
    "third": 3,
    "forth": 4,
    "fifth": 5,
    "sixth": 6,
}


function prepare() {
    if (currentLang=="eng") {
        document.getElementById("keyboardRus").style.display = "none";
        document.getElementById("keyboardEng").style.display = "block";
        document.getElementById("closeBtn").classList.add("closeBtnEng");
        document.getElementById("closeBtn").classList.remove("closeBtnRus");
        document.getElementById("copyBtn").classList.add("copyBtnEng");
        document.getElementById("copyBtn").classList.remove("copyBtnRus");
    }
    else {
        document.getElementById("keyboardEng").style.display = "none";
        document.getElementById("keyboardRus").style.display = "block";
        document.getElementById("closeBtn").classList.remove("closeBtnEng");
        document.getElementById("closeBtn").classList.add("closeBtnRus");
        document.getElementById("copyBtn").classList.remove("copyBtnEng");
        document.getElementById("copyBtn").classList.add("copyBtnRus");
    }
    secretWord = getSecretWord();
    cookie.total = getCookie("total"); cookie.total == ""? 0 : parseInt(cookie.total);
    cookie.wins = getCookie("wins"); cookie.wins == ""? 0 : parseInt(cookie.wins);
    cookie.first = getCookie("first"); cookie.first == ""? 0 : parseInt(cookie.first);
    cookie.second = getCookie("second"); cookie.second == ""? 0 : parseInt(cookie.second);
    cookie.third = getCookie("third"); cookie.third == ""? 0 : parseInt(cookie.third);
    cookie.forth = getCookie("forth"); cookie.total == ""? 0 : parseInt(cookie.forth);
    cookie.fifth = getCookie("fifth"); cookie.fifth == ""? 0 : parseInt(cookie.fifth);
    cookie.sixth = getCookie("sixth"); cookie.total == ""? 0 : parseInt(cookie.sixth);
    console.log("Got cookies", cookie);
    document.getElementById("title").innerHTML = currentLang=="eng"?"Wordik":"Вордик";
    document.getElementById("statisticsLabel").innerHTML = currentLang=="eng"?"Statistics":"Статистика";
    document.getElementById("label-total").innerHTML = currentLang=="eng"?"Total":"Всего";
    document.getElementById("label-wins").innerHTML = currentLang=="eng"?"Wins":"Побед";
    document.getElementById("copyBtn").innerHTML = currentLang=="eng"?"Copy result":"Скопировать результат";
    document.getElementById("closeBtn").innerHTML = currentLang=="eng"?"Close":"Закрыть";
    document.getElementById("newGame").innerHTML = currentLang=="eng"?"New Game":"Новая Игра";
    document.getElementById("languageLink").innerHTML = currentLang=="eng"?"Russan Language":"Английский Язык";


    // if user authorized then print "hello" instead of Auth button

    isAuthenticated = getCookie("auth");
    // if (isAuthenticated) {
    //     let userName = isSessionValid(isAuthenticated);
    //     if (userName) {
    //         document.getElementById("authLink").style.display = "none";
    //         document.getElementById("helloUser").style.display = "block";
    //         document.getElementById("helloUser").innerHTML += ", " + userName + "!";
    //     }
    //     else {
    //         document.getElementById("authLink").style.display = "block";
    //         document.getElementById("helloUser").style.display = "none";
    //     }
    // }
    // else {
    //     document.getElementById("authLink").style.display = "block";
    //     document.getElementById("helloUser").style.display = "none";
    // }

}

function isSessionValid(cookieValue) {
    // do a request to the server
    // return user name
    return "Ali"
}

function auth(){
    // show popup for passphrase and then with pictures
    // document.getElementById("overlayAuth").style.display = "block";
    // send responses to server to validate
    // write cookie with user ID (?)
}


function getSecretWord() {
    if (currentLang=="eng") dataset = myListEng
        else dataset = myListRus

    let total = dataset.length;
    let secret = dataset[Math.floor(Math.random()*total)];
    return secret
}

document.addEventListener('keydown', (event) => {
    clearNotification();
    const keyName = event.key;
    if ((keyName.length == "1")&&(keyName.match(/[a-zа-я]/i))) {
        displayLetter(keyName);
    }
    else if (keyName == "Backspace") deleteLetter();
    else if (keyName == "Enter") {
        checkInput();
    }
}, false);

function checkInput() {
    let result = isResultValid();
    if (result) compareResult(result);
}

function keyAction(element, letter) {
    clearNotification();
    displayLetter(letter);
}

function deleteLetter() {
    let children = getRowChildren("row"+attempt);
    let i = 0;
    while ((i > -1)&&(i < 5)&&(children[i].innerHTML != "")) { i++; }
    i--;
    if ((i > -1)&&(i < 5)) { children[i].innerHTML = ""; }
}

function displayLetter(l) {
    if (!isDone) {
        let children = getRowChildren("row"+attempt);
        let i = 0;
        while ((i < N-1)&&(children[i].innerHTML != "")) { i++; }
        if (i < N) { children[i].innerHTML = "<p>"+l+"</p>"; }
    }
}

function isResultValid() {
    let children = getRowChildren("row"+attempt);
    let result = "";
    for (let ch of children) {
        if (ch.nodeName=="DIV") {
            if (!ch.innerHTML) return false
            result += ch.innerHTML.replace(/<\/?p>/g,'');
        }
    }
    // console.log("result", result)
    if (result.length < 5) return false;
    if (dataset.indexOf(result) == -1) {
        notify("doesn't exist");
        return false
    }
    return result;
}

function compareResult(result) {
    attempt ++;
    // console.log(result, secretWord,result == secretWord)
    if (result == secretWord) {
        colorize(result);
        notify("win");
    }
    else {
        if (attempt == N) {
            colorize(result, true);
            notify("lose");
        }
        else {
            colorize(result)
            notify("try");
        }
    }
}

function colorize(result, isLost) {
    let schema = []

    for (let i in result) {
        if (result[i] == secretWord[i]) {
            schema.push(colours["green"]);
            document.getElementById(result[i]).style.backgroundColor = colours["green"] ;
        }
        else {
            if (secretWord.includes(result[i])) {
                schema.push(colours["yellow"]);
                if (document.getElementById(result[i]).style.backgroundColor != "rgb(98, 226, 208)") { //green in rgb
                    document.getElementById(result[i]).style.backgroundColor = colours["yellow"] ;
                }
            }
            else {
                schema.push(colours["gray"]);
                document.getElementById(result[i]).style.backgroundColor = colours["gray"] ;
            }
        }
    }

    allSchemas.push(schema);
    updateFrontend(schema);
}

function getRowChildren(id) {
    let row = document.getElementById(id)
    let children = row.childNodes;
    let resultArray = []
    for (let ch of children) {
        if (ch.nodeName == "DIV")
        resultArray.push(ch)
    }
    return resultArray;
}

function updateFrontend(schema) {
    let children = getRowChildren("row"+(attempt-1));
    for (let i in schema) {
        children[i].getElementsByTagName('p')[0].classList.add("p")
        children[i].classList.add("turn")
        children[i].style.backgroundColor = schema[i] ;
    }
}

function notify(type) {
    if (["try", "lose", "win", "doesn't exist"].indexOf(type) == -1) return;
    let alertBox = document.getElementById("alert");
    alertBox.classList.add("alert");
    if (type=="try") {
        alertBox.style.backgroundColor = colours["gray"];
        alertBox.innerHTML = currentLang=="eng"?"Try again!":"Попробуй снова!";
        timeoutID = setTimeout(() => {
            alertBox.classList.remove("alert");
            alertBox.innerHTML = "";
        }, 4000);
    }
    else {
        if (type=="win") {
            alertBox.style.backgroundColor = colours["green"];
            alertBox.innerHTML = currentLang=="eng"?"You win!":"Победа!";
            timeoutID = setTimeout(() => {
                alertBox.classList.remove("alert");
                alertBox.innerHTML = "";
            }, 5000);
            cookie.total = (parseInt(cookie.total)||0) + 1;
            cookie.wins = (parseInt(cookie.wins)||0) + 1;
            let thisTry = Object.keys(attempts).find(key => attempts[key] === attempt);
            cookie[thisTry] = (parseInt(cookie[thisTry])||0) + 1;
            writeCookies();
            isDone = true;
            // open Statistics
            generateStats();
            openStats();
        }
        else {
            if (type=="lose") {
                alertBox.style.backgroundColor = colours["red"];
                alertBox.innerHTML = currentLang=="eng"?"You lose!":"Ты проиграл!";
                cookie.total = (parseInt(cookie.total)||0) + 1;
                writeCookies();
                generateStats();
                openStats();
            }
            else {
                alertBox.style.backgroundColor = colours["yellow"];
                alertBox.innerHTML = currentLang=="eng"?"This word doesn't exist!":"Такого слова нет!";
                // TODO: add shaking
                timeoutID = setTimeout(() => {
                    alertBox.classList.remove("alert");
                    alertBox.innerHTML = "";
                }, 4000);
            }
        }
    }
}

function clearNotification() {
    clearTimeout(timeoutID);
    let alertBox = document.getElementById("alert");
    alertBox.classList.remove("alert");
    alertBox.innerHTML = "";
}

function generateStats() {
    document.getElementsByClassName("stat-total")[0].innerHTML = cookie.total;
    document.getElementsByClassName("stat-wins")[0].innerHTML = cookie.wins;

    let result = "";
    for (let schema of allSchemas) {
        for (let el of schema) {
            result += emojis[el];
        }
        result += "<br>";

    }
    document.getElementById("schema").innerHTML = result;

    if (currentLang=="eng") {
        document.getElementById("word").innerHTML = secretWord.charAt(0).toUpperCase() + secretWord.slice(1) + " definition:";
        let definition = document.getElementById("definition");


        // wordnik API
        // https://www.wordnik.com/users/grgbimtwnmnbdzqolu/API
        // nsjwwpg2zk2rkpu289guoctxzhnwudfjos10ddqellfsjrsr6

        // ABBYY Lingvo api
        //https://developers.lingvolive.com/ru-ru/Applications/cd9a4236-66cb-4e1e-a665-531400a27a06/Details
        // Y2Q5YTQyMzYtNjZjYi00ZTFlLWE2NjUtNTMxNDAwYTI3YTA2OjE3MGI4ZTUzZDA3ZDQ0ZjFiNzE1YzlmYWFkYWUxZTIw
        fetch('https://www.dictionaryapi.com/api/v3/references/collegiate/json/'+secretWord+'?key=2856cedf-229e-483e-9d88-82c2995cc7e6')
          .then(response => response.json())
          // .then(json => definition.innerHTML = json[0]["shortdef"][0])
          .then(json => {
              if (typeof json[0] == "string") {
                  definition.innerHTML = "❌";
              }
              else {
                  let jsonResult = json[0]["shortdef"];
                  for (let i in jsonResult) {
                      definition.innerHTML += "<li>"+jsonResult[i]+"</li>";
                  }
              }
          })
        }
    else {
        document.getElementById("word").innerHTML = "Загаданное слово: " + secretWord
    }
}

function openStats() {
    document.getElementById("overlayStats").style.display = "block";

}

function copySchema() {
    let text = document.getElementById("schema").innerHTML;
    text = text.replace(/<br>/g,"\n");
    navigator.clipboard.writeText(text);
}

function closePopup() {
    document.getElementById("overlayStats").style.display = "none";
}

function writeCookies() {
    let date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = encodeURIComponent("total") + '=' + encodeURIComponent(cookie.total) + "; " + expires + "; path=/";
    document.cookie = encodeURIComponent("wins") + '=' + encodeURIComponent(cookie.wins) + "; " + expires + "; path=/";
    document.cookie = encodeURIComponent("first") + '=' + encodeURIComponent(cookie.first) + "; " + expires + "; path=/";
    document.cookie = encodeURIComponent("second") + '=' + encodeURIComponent(cookie.second) + "; " + expires + "; path=/";
    document.cookie = encodeURIComponent("third") + '=' + encodeURIComponent(cookie.third) + "; " + expires + "; path=/";
    document.cookie = encodeURIComponent("forth") + '=' + encodeURIComponent(cookie.forth) + "; " + expires + "; path=/";
    document.cookie = encodeURIComponent("fifth") + '=' + encodeURIComponent(cookie.fifth) + "; " + expires + "; path=/";
    document.cookie = encodeURIComponent("sixth") + '=' + encodeURIComponent(cookie.sixth) + "; " + expires + "; path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function startNewGame() {
    attempt = 0;
    allSchemas = [];
    clearNotification();
    isDone = false;
    timeoutID = undefined;

    prepare();
    /// colorize cards
    for (let i=0; i<N;i++) {
        let children = getRowChildren("row"+i)
        for (let ch of children) {
            if (ch.querySelector("p") != null) {
                ch.getElementsByTagName('p')[0].classList.remove("p")
                ch.classList.remove("turn");
                ch.style.backgroundColor = colours["white"] ;
                ch.innerHTML = "" ;
            }
        }
    }

    // colorize keyboard
    for (i = 0; i < 26; i++) {
        document.getElementById((i+10).toString(36)).style.backgroundColor = colours["whitish"]
        document.getElementById((i+10).toString(36)).style.backgroundColor = colours["whitish"]
    }
    for (let i of "абвгдежзийклмнопрстуфхцчшщъыьэюя") {
        document.getElementById(i).style.backgroundColor = colours["whitish"]
        document.getElementById(i).style.backgroundColor = colours["whitish"]
    }


    let definition = document.getElementById("definition").innerHTML = ""
}

function changeLanguage(){
    currentLang=currentLang=="rus"?"eng":"rus";
    startNewGame();
}
