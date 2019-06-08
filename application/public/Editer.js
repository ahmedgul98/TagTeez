
        var canvas = new fabric.Canvas('canvas');
            // var picture=document.getElementById("inp");
            // picture.addEventListener("onload",function(){
            // fabric.Image.fromURL(picture.event.target.result, function(myImg) {
			        	//  myImg.scaleToWidth(500);
			        	//  myImg.scaleToHeight(450);
			    	    //  canvas.add(myImg)
			        	//  	});
            // })
//{left: 0, top: 0, angle: 0,width:, height:100}
		  document.getElementById('fileImg').addEventListener("change", function (e) {
		  var file = e.target.files[0];
		  var reader = new FileReader();
		  reader.onload = function (f) {
		   var data = f.target.result;                    
		    fabric.Image.fromURL(data, function (img) {
		      var oImg = img.set().scale(0.9);
		      canvas.add(oImg).renderAll();
		      var a = canvas.setActiveObject(oImg);
		      var dataURL = canvas.toDataURL({format: 'png', quality: 0.8});
		    });
		  };
		  reader.readAsDataURL(file);
		});
      
        var color=document.getElementById("chng");

        var remove=document.getElementById("clear");
        remove.addEventListener("click",function(){
        	canvas.remove(canvas.getActiveObject());
        }) 
      
        var circle=document.getElementById("Circle");
        circle.addEventListener("click",function(){
        canvas.add(new fabric.Circle({ radius: 30, fill:color.value,top: 100, left: 100 }));
        })
        var rectangle=document.getElementById("Rect");
        rectangle.addEventListener("click",function(){
        canvas.add(new fabric.Rect({ left:10,top:10,width:10,height:30,fill:color.value}))
        })
        var triangle=document.getElementById("Tri");
        triangle.addEventListener("click",function(){
        	canvas.add(new fabric.Triangle({width: 20, height: 30, fill: color.value, left: 50, top: 50}))
        })
        var ellipse=document.getElementById("Ecllipse");
        ellipse.addEventListener("click",function(){
        	canvas.add(new fabric.Ellipse({ left: 50, top: 50,strokeWidth:1,stroke:'black',fill: color.value,selectable: true,
            originX: 'center', originY: 'center',rx: 5,ry: 5 }))
        })
        var line=document.getElementById("line");
        line.addEventListener("click",function(){
        	canvas.add(new fabric.Line([100, 100, 30, 30],{left: 10, top: 10,stroke: color.value}))
        })
        // var polygon=document.getElementById("Polygon");
        // polygon.addEventListener("click",function(){
        // 	canvas.add(new fabric.Polygon({ left: 10,top: 10,height:30,width:30,fill: color.value}))	
        // })
        // var polyline=document.getElementById("Polyline");
        // polyline.addEventListener("click",function(){
        // 	canvas.add(new fabric.Polyline({}))
        // })

		//   document.getElementById('inp').onchange = function(e) {
		//   var img = new Image();
		//   img.onload = draw;
		//   img.onerror = failed;

		// };
		// function draw() {
		//   ctx.drawImage(img, 10,20,100,100);
		// }
		// function failed() {
		//   console.error("The provided file couldn't be loaded as an Image media");
		// }

   //      $(function () {
   //      $(":file").change(function () {
   //      if (this.files && this.files[0]) {
   //          var reader = new FileReader();
   //          reader.onload = imageIsLoaded;
   //          reader.readAsDataURL(this.files[0]);
   //       }
   //      });
   //    });

		 // function imageIsLoaded(e) {
		 // $('#myImg').attr('src', e.target.result);
		 // };

       // canvas.selectionColor = 'rgba(0,255,0,0.3)';
        //canvas.selectionBorderColor = 'red';
        //canvas.selectionLineWidth = 5;

// "add" rectangle onto canvas
/*var canvas = document.getElementById('mycanvas');
var ctx = canvas.getContext('2d');

var button=document.querySelector("button");
button.addEventListener("click",function(){
    ctx.fillStyle = 'red' ;
	ctx.fillRect(0,0,100,100);

})

//line
ctx.beginPath();
ctx.moveTo(1,1);
ctx.lineTo(1,10);
ctx.strokeStyle='blue';
ctx.stroke();

//arc circle
ctx.beginPath();
ctx.arc(50,50,6,0,Math.PI * 2,false);
ctx.strokeStyle='purple';
ctx.stroke();

*/
var image;
var imgEl = document.createElement('img');
imgEl.crossOrigin = 'anonymous';
imgEl.onload = function() {
  image = new fabric.Image(imgEl);
  image.filters = [new fabric.Image.filters.HueRotation()]
		image.selectable=false;
		image.scaleToWidth(500);
		image.scaleToHeight(450);
  canvas.add(image);
}
imgEl.src = 'https://i.imgur.com/28kU1bo.png';
document.getElementById('hue').onclick= function() {
  image.filters[0].rotation = prompt("Enter hue value")/Math.PI; 
  //2 * Math.random() - 1;
  //image.filters[0].rotation=//kk.hue.value; 
  console.log(image.filters[0].rotation);
  image.applyFilters();
  canvas.requestRenderAll();
};
//
///
// 
//
var fonts = ["Pacifico", "VT323", "Quicksand", "Inconsolata","Output Sans"];
var text=document.getElementById("text");
text.addEventListener("click",function(){
canvas.add(new fabric.IText('Tap and Type', { 
  left: 100, 
  top: 100 ,
  fill:colour.value,
  fontStyle:'bold'
}));})
var colour=document.getElementById("textcolor");

// var textbox = new fabric.Textbox('Lorum ipsum dolor sit amet', {
//   left: 50,
//   top: 50,
//   width: 150,
//   fontSize: 20
// });
// canvas.add(textbox).setActiveObject(textbox);
// fonts.unshift('Times New Roman')
// var select = document.getElementById("font-family");
// fonts.forEach(function(font) {
//   var option = document.createElement('option');
//   option.innerHTML = font;
//   option.value = font;
//   select.appendChild(option);
// });


document.getElementById('font-family').onchange = function() {
  if (this.value !== 'Times New Roman') {
    loadAndUse(this.value);
  }
   else {
    canvas.getActiveObject().set("fontFamily", this.value);
    canvas.requestRenderAll();
  }
};

function loadAndUse(font) {
  var myfont = new FontFaceObserver(font)
  myfont.load()
    .then(function() {
      // when font is loaded, use it.
      canvas.getActiveObject().set("fontFamily", font);
      canvas.requestRenderAll();
    }).catch(function(e) {
      console.log(e)
      alert('font loading failed ' + font);
    });
}
  //  var brush=document.getElementById("Brush");
  //  brush.addEventListener("click",function(){ var vLinePatternBrush = new fabric.PatternBrush(canvas);
  //   vLinePatternBrush.getPatternSrc = function() {

  //     var patternCanvas = fabric.document.createElement('canvas');
  //     patternCanvas.width = patternCanvas.height = 10;
  //     var ctx = patternCanvas.getContext('2d');

  //     ctx.strokeStyle = this.color;
  //     ctx.lineWidth = 5;
  //     ctx.beginPath();
  //     ctx.moveTo(0, 5);
  //     ctx.lineTo(10, 5);
  //     ctx.closePath();
  //     ctx.stroke();

  //     return patternCanvas;}})
  // 
   $("#save").click(function(){
  	$("#canvas").get(0).toBlob(function(blob){
              saveAs(blob,"myImage.png");
  	});
  });