let points = [];
let erasing = false;
let numPresses = 0;
let wasPressed = false;
let frames = 0;
let isUploading = false;

function setup(){
  createCanvas(1200,800);
  $("canvas").css("margin-left",(windowWidth-1200)/2);
  $("canvas").addClass("border");
  $("canvas").addClass("border-secondary");
  downloadPoints();
}

function draw(){
  frames++;
  background(255);
  if(!mouseIsPressed && wasPressed){
    uploadPoints();
    isUploading=true;
  }else if(!mouseIsPressed && frames%45 == 0 && !isUploading){
    downloadPoints();
  }
  if(mouseIsPressed){
    if(!wasPressed && !erasing){
      numPresses++;
    }
    points.push([mouseX,mouseY,numPresses]);
    wasPressed=true;
  }else{
    wasPressed=false;
  }
  if(erasing){
    noFill();
    circle(mouseX,mouseY,100);
    if(mouseIsPressed){
      let erasedPoints = [];
      for(i=0;i<points.length;i++){
        let dist = Math.pow(Math.pow(mouseX-points[i][0],2)+Math.pow(mouseY-points[i][1],2),0.5);
        if(dist<=50){
          erasedPoints.push(i);
        }
      }
      removeErasedPoints(erasedPoints);
    }
  }
  for(i=0;i<points.length-1;i++){
    if(points[i][2]==points[i+1][2]){
      line(points[i][0],points[i][1],points[i+1][0],points[i+1][1]);
    }
  }
}

function uploadPoints(){
  $.post("uploadBoard.php",{data:points},function(data,success){
    isUploading=false;
  });
}

function downloadPoints(){
  $.getJSON("board.json",function(data){
    points=data;
  });
}

$(document).keydown(function(e){
  if(e.which==27){
    erasing = !erasing;
  }
});

function removeExtraPoints(){
  let rounded = [];
  for(i=0;i<points.length;i++){
    let tempPoint = [];
    for(p=0;p<3;p++){
      tempPoint.push(Math.round(parseFloat(points[i][p])));
    }
    rounded.push(tempPoint);
  }
  let unique = [];
  $.each(rounded,function(i,el){
    if($.inArray(el,unique) === -1) unique.push(el);
  });
  points=unique;
}

function removeErasedPoints(erasedPoints){
    let tempPoints = [];
    for(i=0;i<points.length;i++){
      if(!erasedPoints.includes(i)){
        tempPoints.push(points[i]);
      }
    }
    points=tempPoints;
}
