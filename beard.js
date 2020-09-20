var video = el("video");
var canvas = el("canvas");
var invisCanvas = el("invisCanvas");
var realCtx = canvas.getContext("2d");
var ctx = invisCanvas.getContext("2d");

var firstTime = true;
var detections;
var landmarks;

Promise.all([
	faceapi.nets.tinyFaceDetector.loadFromUri("models"),
	faceapi.nets.faceExpressionNet.loadFromUri("models"),
	faceapi.nets.faceLandmark68TinyNet.loadFromUri("models")
]).then(()=>console.log("%c Loaded neural nets ","background-color:black; color:white"));


function start(){
	navigator.getUserMedia = navigator.getUserMedia||navigator.mozGetUserMedia||navigator.oGetUserMedia||navigator.webkitGetUserMedia||navigator.msGetUserMedia;
	if(!navigator.getUserMedia){
		return alert("Sorry, your browser does not support the video over a HTTP connection. Instead, try uploading a picture of yourself.")
	}
	navigator.getUserMedia({
		video: true
	}, stream =>{video.srcObject = stream;}, err=>{console.error(err);});
	firstTime = false;
}

video.addEventListener("play",()=>{
	console.log("begin");
	setInterval(updateCanvas, 100, video);
});

el("upload").onchange = function(){
	var fileList = el("upload").files;
	if(!fileList || fileList.length == 0) return

	el("image").src = URL.createObjectURL(fileList[fileList.length-1]);
	el("image").onload = ()=>{
		el("image").width = 800;
		updateCanvas(el("image"));
		URL.revokeObjectURL(el("image").src);
	}
	el("webcamButton").onclick = ()=>{
		location.reload();
	}
}
el("type").onchange = el("upload").onchange;

function downloadPic(ev){
	var dataURL = canvas.toDataURL('image/png').replace(/^data:image\/[^;]/, 'data:application/octet-stream');
	el("downloadPic").href = dataURL;
}

async function updateCanvas(toRead){
	detections = await faceapi.detectAllFaces(toRead, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks(true);

	if(el("image").width != 0 && el("image").height != 0){
		detections = faceapi.resizeResults(detections, {width: 400, height: el("image").height/2});
		canvas.style.height = el("image").height + "px";
		canvas.height = el("image").height/2;
		invisCanvas.style.height = el("image").height + "px";
		invisCanvas.height = el("image").height/2;
		video.style.height = el("image").height + "px";
		video.height = el("image").height/2;
	}else{
		detections = faceapi.resizeResults(detections, {width: 400, height: 300})
	}
	//console.log(detections.length);

	ctx.clearRect(0,0,400,300);
	realCtx.clearRect(0,0,400,300);
	realCtx.drawImage(toRead,0,0,400,canvas.height);
	for (var i = 0; i < detections.length; i++) {
		landmarks = detections[i].landmarks.positions;
		var type = el("type").value;

		ctx.globalAlpha = 1/4;
		if(type == "Classic Full Beard"){
			normalBeard()
			largeMustache()

		}else if(type == "Goatee and Mustache"){
			normalMustache()
			ctx.beginPath();
			ctx.moveTo((landmarks[49].x+landmarks[3].x)/2, landmarks[3].y);

			ctx.lineTo(landmarks[6].x, landmarks[6].y);
			ctx.lineTo(landmarks[7].x, landmarks[7].y);
			ctx.lineTo(landmarks[8].x, landmarks[8].y);
			ctx.lineTo(landmarks[9].x, landmarks[9].y);
			ctx.lineTo(landmarks[10].x, landmarks[10].y);

			ctx.lineTo((landmarks[53].x+landmarks[13].x)/2, landmarks[13].y);

			ctx.lineTo(landmarks[53].x+3, landmarks[53].y);
			ctx.lineTo(landmarks[54].x+3, landmarks[54].y);
			ctx.lineTo(landmarks[55].x, landmarks[55].y+15);
			ctx.lineTo(landmarks[56].x, landmarks[56].y+15);
			ctx.lineTo(landmarks[56].x, landmarks[56].y+3);
			ctx.lineTo(landmarks[57].x, landmarks[57].y+3);
			ctx.lineTo(landmarks[58].x, landmarks[58].y+3);
			ctx.lineTo(landmarks[58].x, landmarks[58].y+15);
			ctx.lineTo(landmarks[59].x, landmarks[59].y+15);
			ctx.lineTo(landmarks[48].x-3, landmarks[48].y);
			ctx.lineTo(landmarks[49].x-3, landmarks[49].y);
			ctx.fill();

		}else if(type == "Just Mustache"){
			curlyMustache()

		}else if(type == "Imperial"){
			ctx.beginPath();
			ctx.moveTo(landmarks[58].x, landmarks[58].y+3);
			ctx.lineTo(landmarks[57].x, landmarks[57].y+3);
			ctx.lineTo(landmarks[56].x, landmarks[56].y+3);

			ctx.lineTo(landmarks[9].x, landmarks[9].y+5);
			ctx.lineTo(landmarks[8].x, landmarks[8].y+10);
			ctx.lineTo(landmarks[7].x, landmarks[7].y+5);
			ctx.fill();
			
			curlyMustache()
		}else if(type == "Mutton Chops"){
			largeMustache()

			ctx.beginPath();
			ctx.moveTo(landmarks[16].x, landmarks[16].y);
			ctx.lineTo(landmarks[15].x, landmarks[15].y+10);
			ctx.lineTo(landmarks[14].x, landmarks[14].y+10);
			ctx.lineTo(landmarks[13].x, landmarks[13].y+10);
			ctx.lineTo(landmarks[12].x, landmarks[12].y+10);
			ctx.lineTo(landmarks[11].x, landmarks[11].y+10);
			ctx.lineTo(landmarks[10].x, landmarks[10].y+10);
			ctx.lineTo(landmarks[54].x, landmarks[54].y);
			ctx.fill();

			ctx.beginPath();
			ctx.moveTo(landmarks[0].x, landmarks[0].y);
			ctx.lineTo(landmarks[1].x, landmarks[1].y+10);
			ctx.lineTo(landmarks[2].x, landmarks[2].y+10);
			ctx.lineTo(landmarks[3].x, landmarks[3].y+10);
			ctx.lineTo(landmarks[4].x, landmarks[4].y+10);
			ctx.lineTo(landmarks[5].x, landmarks[5].y+10);
			ctx.lineTo(landmarks[6].x, landmarks[6].y+10);
			ctx.lineTo(landmarks[48].x, landmarks[48].y);
			ctx.fill();

		}else if(type == "Bushy"){
			largeMustache()

			ctx.beginPath();
			ctx.moveTo(landmarks[2].x, landmarks[2].y+20);
			for (var j = 3; j <= 14; j++) {
				ctx.lineTo(landmarks[j].x, landmarks[j].y+20);
			}
			ctx.lineTo(landmarks[54].x, landmarks[54].y+3);
			ctx.lineTo(landmarks[55].x, landmarks[55].y+3);
			ctx.lineTo(landmarks[56].x, landmarks[56].y+3);
			ctx.lineTo(landmarks[56].x, landmarks[56].y+3);
			ctx.lineTo(landmarks[57].x, landmarks[57].y+3);
			ctx.lineTo(landmarks[58].x, landmarks[58].y+3);
			ctx.lineTo(landmarks[58].x, landmarks[58].y+3);
			ctx.lineTo(landmarks[59].x, landmarks[59].y+3);
			ctx.lineTo(landmarks[48].x, landmarks[48].y+3);
			ctx.fill()
		}


		realCtx.globalAlpha = 1;
		for (var j = 0; j < 2000; j++) {
			var xPos = landmarks[0].x + randSeed(j)*(landmarks[16].x - landmarks[0].x);
			var yPos = landmarks[0].y + randSeed(2000-1-j)*(landmarks[8].y+20 - landmarks[0].y);
			var spot = ctx.getImageData(xPos, yPos, 1, 1);
			if(spot.data[3] > 30 && spot.data[3] < 200){
				var angle = randSeed(j*3 % 2000)*Math.PI*2;
				var messy = (landmarks[16].x - landmarks[0].x)/40;
				realCtx.strokeWidth = messy/5;
				realCtx.beginPath();
				realCtx.moveTo(xPos, yPos);
				realCtx.lineTo(xPos + Math.cos(angle)*messy, yPos + Math.sin(angle)*messy);

				realCtx.moveTo(xPos+1, yPos-1);
				realCtx.lineTo(xPos + Math.cos(angle+1)*messy, yPos + Math.sin(angle+1)*messy);

				realCtx.moveTo(xPos-1, yPos-1);
				realCtx.lineTo(xPos + Math.cos(angle+2)*messy, yPos + Math.sin(angle+2)*messy);
				realCtx.stroke();
				realCtx.strokeWidth = 1;
			}
		}
	}
}

randomNumbers = [];
for (var i = 0; i < 2000; i++) {
	randomNumbers.push(Math.random());
}
function randSeed(seed){
	return randomNumbers[seed];
}


function normalBeard(){
	ctx.beginPath();
	ctx.moveTo(landmarks[2].x, landmarks[2].y);
	for (var j = 3; j <= 14; j++) {
		ctx.lineTo(landmarks[j].x, landmarks[j].y+4);
	}
	ctx.lineTo(landmarks[54].x, landmarks[54].y+10);
	ctx.lineTo(landmarks[55].x, landmarks[55].y+10);
	ctx.lineTo(landmarks[56].x, landmarks[56].y+10);
	ctx.lineTo(landmarks[56].x, landmarks[56].y+3);
	ctx.lineTo(landmarks[57].x, landmarks[57].y+3);
	ctx.lineTo(landmarks[58].x, landmarks[58].y+3);
	ctx.lineTo(landmarks[58].x, landmarks[58].y+10);
	ctx.lineTo(landmarks[59].x, landmarks[59].y+10);
	ctx.lineTo(landmarks[48].x, landmarks[48].y+10);
	ctx.fill()
}

function largeMustache(){
	ctx.beginPath();
	ctx.moveTo(landmarks[4].x, landmarks[4].y);
	ctx.lineTo(landmarks[31].x, landmarks[31].y);
	ctx.lineTo(landmarks[32].x, landmarks[32].y);
	ctx.lineTo(landmarks[33].x, landmarks[33].y);
	ctx.lineTo(landmarks[34].x, landmarks[34].y);
	ctx.lineTo(landmarks[35].x, landmarks[35].y);

	ctx.lineTo(landmarks[12].x, landmarks[12].y);

	ctx.lineTo(landmarks[54].x, landmarks[54].y);
	ctx.lineTo(landmarks[53].x, landmarks[53].y);
	ctx.lineTo(landmarks[52].x, landmarks[52].y);
	ctx.lineTo(landmarks[51].x, landmarks[51].y);
	ctx.lineTo(landmarks[49].x, landmarks[49].y);
	ctx.lineTo(landmarks[48].x, landmarks[48].y);
	ctx.lineTo(landmarks[4].x, landmarks[4].y);
	ctx.fill();
}

function normalMustache(){
	ctx.beginPath();
	ctx.moveTo((landmarks[49].x+landmarks[3].x)/2, landmarks[3].y);

	ctx.lineTo(landmarks[31].x, landmarks[31].y+2);
	ctx.lineTo(landmarks[32].x, landmarks[32].y+2);
	ctx.lineTo(landmarks[33].x, landmarks[33].y+2);
	ctx.lineTo(landmarks[34].x, landmarks[34].y+2);
	ctx.lineTo(landmarks[35].x, landmarks[35].y+2);

	ctx.lineTo((landmarks[53].x+landmarks[13].x)/2, landmarks[13].y);

	ctx.lineTo(landmarks[54].x, landmarks[54].y-2);
	ctx.lineTo(landmarks[53].x, landmarks[53].y-2);
	ctx.lineTo(landmarks[52].x, landmarks[52].y-2);
	ctx.lineTo(landmarks[51].x, landmarks[51].y-2);
	ctx.lineTo(landmarks[49].x, landmarks[49].y-2);
	ctx.lineTo(landmarks[48].x, landmarks[48].y-2);
	ctx.fill();
}

function curlyMustache(){
	realCtx.beginPath();
	realCtx.lineTo(landmarks[33].x, landmarks[33].y+3);
	realCtx.lineTo(landmarks[53].x, landmarks[53].y+3);
	realCtx.lineTo((landmarks[53].x+landmarks[13].x)/2, landmarks[13].y);
	realCtx.lineTo(landmarks[53].x, landmarks[53].y-3);
	realCtx.lineTo(landmarks[34].x, landmarks[34].y+3);
	realCtx.fill();

	realCtx.beginPath();
	realCtx.lineTo(landmarks[33].x, landmarks[33].y+3);
	realCtx.lineTo(landmarks[49].x, landmarks[49].y+3);
	realCtx.lineTo((landmarks[49].x+landmarks[3].x)/2, landmarks[3].y);
	realCtx.lineTo(landmarks[49].x, landmarks[49].y-3);
	realCtx.lineTo(landmarks[32].x, landmarks[32].y+3);
	realCtx.fill();
}