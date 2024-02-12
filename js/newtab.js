const hour = document.getElementById('hours');
const minutes = document.getElementById('minutes');
const seconds = document.getElementById('seconds');
const midday = document.getElementById('midday');
const randomQ = document.getElementById('ranQuote');
const usersName = document.getElementById('inName');
const pomoTime = document.getElementById('timer');
const pomoMin = document.getElementById('timerMin');
const pomoSec = document.getElementById('timerSec');

const pomoButton = document.getElementById("Pomodoro");
const shortButton = document.getElementById("shortBreak");
const longButton = document.getElementById("longBreak");
const startBut = document.getElementById("startButton");

//Timer for pomodoro timer and short or long breaks
let timing = 25;
let secTiming = 0;
let counter = 0; 
let breaktime = false;
let firstClick = false;

pomoMin.textContent = addZero(timing);
pomoSec.textContent = ": " + addZero(secTiming);

window.onload=function(){
	if(pomoButton)
		pomoButton.addEventListener('click', pomoFunc, false);
	if(shortButton)
		shortButton.addEventListener('click', shortFunc, false);
	if(longButton)
		longButton.addEventListener('click', longFunc, false);
	if(startBut)
		startBut.addEventListener('click', startFunc, false);
}
	

function pomoFunc(){
	timing = 25;
	secTiming = 0;
	pomoMin.textContent = addZero(timing);
	breaktime = true;
}
function shortFunc(){
	timing = 5;
	secTiming = 0;
	pomoMin.textContent = addZero(timing);
	counter = counter + 1;
}
function longFunc(){
	timing = 15;
	secTiming = 0;
	pomoMin.textContent = addZero(timing);
}
function startFunc() {
	if(firstClick == false){
		let interval = setInterval(timerStarts, 1000);
		firstClick = true;
	}
	timerStarts();
}

//Was struggling with getting the numbers from subtracting while pressing start but gave up
function timerStarts(){
	if(secTiming == 0 && timing != 0){
		secTiming = 60;
		timing = timing - 1;
	}
	if(timing == 0 && secTiming == 0 && counter % 4 != 0 && breaktime == true){
		shortFunc();
		counter = counter + 1;
		breaktime = true;
	}else if(counter % 4 == 0 && counter != 0 && breaktime == true){
		longFunc();
		breaktime = true;
	}
	
	if(secTiming == 0 && timing == 0 && breaktime == false){
		pomoFunc();
	}else if(secTiming == 1 && timing == 0){
		breaktime = false;
	}
	
	if(secTiming < 0){
		secTiming = 1;
	}
	secTiming = secTiming - 1;
	
	pomoMin.textContent = addZero(timing);
	pomoSec.textContent = ": " + addZero(secTiming%60);
	pomoMin.style.fontSize = "80px";
	pomoSec.style.fontSize = "80px";  
	
}

//The function for getting users names typed out and saved
usersName.addEventListener("change", (event) => {
    chrome.storage.local.set({usersName: usersName.value});
  })

  chrome.storage.local.get('usersName', function(obj) {
      if(obj.usersName !== undefined && obj.usersName !== '') {
          usersName.value = obj.usersName;
      }else {
          console.log("No username added yet.");
      }
  });

//Random quote using fetch and displaying for users
async function randomQuote(){
	let answer = await fetch("https://api.quotable.io/random");
	let given = await answer.json();
	console.log(given)
	
	let quote = given["content"];
	let author = given["author"];
	randomQ.textContent = quote + " -" + author;
}
randomQuote();

//Time function and adds zeros to the front of the numbers if its a single digit
function time() {

  const currTime = new Date();
  let hourCheck = currTime.getHours();
  let minCheck = currTime.getMinutes();
  let secCheck = currTime.getSeconds();
  let APM = "AM"
  if(hourCheck >= 12){
	  hourCheck = hourCheck%12;
	  APM = "PM"
  }
  if(hourCheck == 0){
	  hourCheck = 12;  
  }
  
  hour.textContent = addZero(hourCheck);
  minutes.textContent = ": " + addZero(minCheck);
  seconds.textContent = ": " + addZero(secCheck);
  midday.textContent = APM;
  
  hour.style.fontSize = "70px";
  minutes.style.fontSize = "70px";
  seconds.style.fontSize = "70px";  
  midday.style.fontSize = "70px";  
  setTimeout(time, 1000);
}

function addZero(num){
	if(num < 10){
		return "0" + num;
	}
	return num;
}

time();
