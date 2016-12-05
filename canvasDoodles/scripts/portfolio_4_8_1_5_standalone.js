function Portfolio_4_8_1_5_s(mouseContext) {
    var _canvas, _context, _image, _images = [], _bezier1, _bezier2, _bezier3, _bezier4, _count = 0, _imageW = 30, _imageH = 30, _numImages = 2, _checkForCollision = true, _gotoTarget = false, _imgInPlaceCount = 0, _interval, _canvasW, _canvasH;
    
    _bezier1 = {x:1, y:0, z:Math.random() / 2};//1,0 - this setup keeps bezier points moving in unison up and down the line
    _bezier2 = {x:0, y:1, z:Math.random() / 2};//0,1 - different arrangement causes a circular movement as well as the linera one
    _bezier3 = {x:1, y:0, z:Math.random() / 2};//1,0
    _bezier4 = {x:0, y:1, z:Math.random() / 2};//0,1
    
    if(mouseContext !==  undefined) {
    	_canvas = mouseContext[0];
	_context = _canvas.getContext("2d");
	_canvasW = _canvas.width;
	_canvasH = _canvas.height;
	    
	   _context.fillStyle = "rgba(0,0,0,0.02)";
    }
    else
    {
    	alert("canvas undefined");
    }
    
    this.init = function()
    {
    	this.createImages();
	    	
	    this.createTilePositions(_images, 2, 1, 25, 200);
	    
	    var scope = this;
	    
	    mouseContext.mousedown(function(event)
				    {
					scope.gotoTarget(true);
				    });
    	
    };
    
    this.gotoTarget = function (bool)
    {
    	_gotoTarget = bool;
    };
    // portfolio_2:
    // -- load one image 
    // -- store a column & row reference for each imageObj relating to the part/tile of the one image it should represent - done in createTilePositions()
    // -- loop thru & draw a different part/tile of the one image to the context on each tick, based on the column and row properties of the corresponding imageObj - done in draw()
    //
    // portfolio_3:
    // -- with trails!
    //
    // portfolio_4:
    // -- with dots, not tiles (and trails!)
    // -- keeping the radius based on the old (tiles) width & height gives them a strange, "avoidance" kind of behaviour
    //
    // portfolio_4_5:
    // -- with only 2 dots
    //
    // portfolio_4_6:
    // -- the 2 dots joined by a line
    //
    // portfoilio_4_7:
    // -- dots in pairs, joined by a line
    //
    // portfolio_4_7_1
    // -- line between paired dots has varying thickness depending on distance (keith peter's "node effect")
    //
    // portfolio_4_7_2
    // -- lines form between any dots that pass within certain distance of each other
    //
    // portfolio_4_7_3
    // -- curves drawn between the dots
    //
    // portfolio_4_7_4
    // -- curves only, no dots - but could be better - see portfolio_4_8_2
    //
    // portfolio_4_8
    // -- 2 dots with distance based, jagged, segmented line between them - has potential for lightning effect
    //
    // portfolio_4_8_1
    // -- 2 dots with permanent sinuousy line between them - looks cool!
    //
    // portfolio_4_8_1_5
    // -- 2 dots with more sinousy line
    this.createImages = function()
    {
    	var i, imageObj;
    	
    	for(i = 0; i < _numImages; i++)
        {
    	    
    	    imageObj = {width:_imageW, 
			height:_imageH, 
			radius: Math.sqrt(_imageW * _imageW + _imageH * _imageH) / 2,
			x:Math.random() * _canvasW, 
			y:Math.random() * _canvasH, 
			vx:Math.random() * 6 - 3, 
			vy:Math.random() * 6 - 3, 
			column:-1,
			row:-1,
			targetX:-1,
			targetY:-1,
			inCollision:false,
			inPlace:false,
			cAngleX:0.01,
			cAngleY:0.99
			};
    	    
    	    _images.push(imageObj);
        }
    	var scope = this;
    	
	_interval = setInterval(function(){
				scope.update();
				scope.draw();
	}, 1000/30);
    }
    
    this.update = function()
    {
    	if(_checkForCollision)
	{
	    this.checkForCollision();
	}
    	
    	for(var i = 0; i < _numImages; i++)
	{
	    var img = _images[i];
	    this.move(img);
	}
    }
    
    this.checkForCollision = function()
    {
    	var i, j, img0, img1, dx, dy, dist, minDist, angle, tx, ty, ax, ay, spring = 0.05;
    	
    	for(i = 0; i < _numImages - 1; i++)
	{
	    img0 = _images[i];
	    
	    img0.inCollision = false;
	    
	    for(j = i + 1; j < _numImages; j++)
	    {
		img1 = _images[j];
		
		img1.inCollision = false;
		
		dx = img1.x - img0.x;
		dy = img1.y - img0.y;
		dist = Math.sqrt(dx * dx + dy * dy);
		minDist = img0.radius + img1.radius;
		
		if(dist <= minDist)
		{
		    angle = Math.atan2(dy, dx);
		    tx = img0.x + dx / dist * minDist;
		    ty = img0.y + dy / dist * minDist;
		    ax = (tx - img1.x) * spring;
		    ay = (ty - img1.y) * spring;
		    img0.vx -= ax;
		    img0.vy -= ay;
		    img1.vx += ax;
		    img1.vy += ay;
//					
		    img0.inCollision = true;
		    img1.inCollision = true;
		}
		else
		{
		    img1.inCollision = false;
		}
	    }
	}
    }
    
    this.move = function(img)
    {
    	var i, j, img1, img2, dx, dy, inPlaceCount = 0, easing = 0.08, bounce = -1, rad;
    	
    	if(_gotoTarget)
	{
	    if(img.x < img.targetX + 1 && img.x > img.targetX - 1
		    && img.y < img.targetY + 1 && img.y > img.targetY- 1)
	    {
		img.x = img.targetX;
		img.y = img.targetY;
		img.inPlace = true;
		
		_imgInPlaceCount++;
		
		if(_imgInPlaceCount == _numImages - 4) 
		{
		    _checkForCollision = false;
		    for(i = 0; i < _numImages; i++)
		    {
			img1 = _images[i];
			img1.inCollision = false;
		    }
		}
	    }
	    
	    for(j = 0; j < _numImages; j++)
	    {
		img2 = _images[j];
		if(img2.inPlace) inPlaceCount++;
		if(inPlaceCount == _numImages) 
		{
		    clearInterval(_interval);
		}
	    }
	    
	    if(!img.inCollision)
	    {
		dx = img.targetX - img.x;
		dy = img.targetY - img.y;
	
		img.vx = dx * easing;
		img.vy = dy * easing;
	    }
	}
    	
    	img.x += img.vx;
    	img.y += img.vy;
    	
    	rad = 20;// keep dots in from the border to minimize chance of lines moving outside canvas
    	
    	if(!_gotoTarget)
	{
	    if(img.x + rad > _canvasW)
	    {
		img.x = _canvasW - rad;
		img.vx *= bounce;
	    }
	    else if(img.x - rad < 0)
	    {
		img.x = rad;
		img.vx *= bounce;
	    }
	    if(img.y + rad > _canvasH)
	    {
		img.y = _canvasH - rad;
		img.vy *= bounce;
	    }
	    else if(img.y - rad < 0)
	    {
		img.y = rad;
		img.vy *= bounce;
	    }
	}
    }
    
    this.draw = function()
    {
    	var i, j, img0, img1, dx, dy, dist, max = 600, lineSegs = 50, c1ax, c1ay, c2ax, c2ay, c1x, c1y, c2x, c2y, c3ax, c3ay, c4ax, c4ay, c3x, c3y, c4x, c4y, oscFactor = 8, angleIncr = 0.05;
    	
    	_context.fillRect(0, 0, _canvasW, _canvasH);
    	 
	_context.lineWidth = 1;
	_context.strokeStyle = "rgba(255,255,255, 1)";
	_context.beginPath();
	_context.arc(_images[0].x, _images[0].y, 2, 0, Math.PI * 2, false);
	_context.stroke();
	_context.strokeStyle = "rgba(255,0,0, 1)";
	_context.beginPath();
	_context.arc(_images[1].x, _images[1].y, 2, 0, Math.PI * 2, false);
	_context.stroke();
	 
         //for(i = 0; i < _numImages; i++) 
         //{
         //    img1 = _images[i];
         //    
         //    _context.strokeStyle = "rgba(255,255,255, 1)";
         //    _context.lineWidth = 1;
         //    
         //    _context.beginPath();
         //    _context.arc(img1.x, img1.y, 2, 0, Math.PI * 2, false);
         //    _context.stroke();
         //}   
          
        for(i = 0; i < _numImages - 1; i++)
	{
	    img0 = _images[i];
	    //img0 = _images[0];
	    
	    for(j = i + 1; j < _numImages; j++)
	    {
		img1 = _images[j];
		//img1 = _images[1];
		
		dx = img0.x - img1.x;
		dy = img0.y - img1.y;
		 
		dist = Math.sqrt(dx * dx + dy * dy);
		 
		if(dist < max)
		{
		    _context.strokeStyle = "rgba(255,255,255, 0.2)";
		     
		    _context.beginPath();
		    _context.moveTo(img0.x, img0.y);
		    _context.lineWidth = 1.0;// - dist / max;
			
		    // oscillate bezier points    
		    c1ax = Math.sin(_bezier1.x) * (dx / oscFactor);
		    c1ay = Math.sin(_bezier1.y) * (dy / oscFactor);
		    
		    c2ax = Math.sin(_bezier2.x) * (dx / oscFactor);
		    c2ay = Math.sin(_bezier2.y) * (dy / oscFactor);
		    
		    c3ax = Math.sin(_bezier3.x) * (dx / oscFactor);
		    c3ay = Math.sin(_bezier3.y) * (dy / oscFactor);
		    
		    c4ax = Math.sin(_bezier4.x) * (dx / oscFactor);
		    c4ay = Math.sin(_bezier4.y) * (dy / oscFactor);
		    
		    
		    c1x = (img1.x + dx) + c1ax;
		    c1y = (img0.y - dy / 2) + c1ay;
		    c2x = (img0.x - dx / 2) + c2ax;
		    c2y = (img1.y + dy) + c2ay;
		    
		    c3x = (img1.x + dx / 2) + c3ax;
		    c3y = (img0.y - dy) + c3ay;
		    c4x = (img0.x - dx) + c4ax;
		    c4y = (img1.y + dy / 2) + c4ay;
		    
		    //c1x = (img1.x + dx) + c1ax;
		    //c1y = (img0.y - dy) + c1ay;
		    //c2x = (img0.x - dx) + c2ax;
		    //c2y = (img1.y + dy) + c2ay;
		    
		    //var norm = Math.sin(_count);
		    //if(norm < 0) norm *= -1;
		    //var midPointX = this.lerp(norm, img0.x - dx /4, img1.x + dx /4);
		    //var midPointY = this.lerp(norm, img0.y - dy /4, img1.y + dy /4);
		    
		    //var midPointX = img0.x - dx / 2;
		    //var midPointY = img0.y - dy / 2;
		    
		    // find distance between c2 and c3 bezier points
		    var bdx = c2x - c3x;
		    var bdy = c2y - c3y;
		    
		    // make mid point half way between c2 and c3 bezier points
		    var midPointX = c2x - bdx / 2;
		    var midPointY = c2y - bdy / 2;
		    
		    _context.bezierCurveTo(c1x, c1y, c2x, c2y, midPointX, midPointY);
		    _context.bezierCurveTo(c3x, c3y, c4x, c4y, img1.x, img1.y);
		    
		    //_context.bezierCurveTo(c1x, c1y, c2x, c2y, img1.x, img1.y);
		    
		    _bezier1.x += angleIncr;
		    _bezier1.y += angleIncr;
		    _bezier2.x += angleIncr / 2;// dividing by 2 throws pulse of line out of sync - otherwise pulse moves evenly up and down line
		    _bezier2.y += angleIncr / 2;
		    
		    _bezier3.x += angleIncr / 2;
		    _bezier3.y += angleIncr / 2;
		    _bezier4.x += angleIncr;
		    _bezier4.y += angleIncr;
		    
		    //_count += 0.05
		    
		    _context.stroke();
		}
	    }
		
	}
         
    }
    
//    this.lerp = function(t, a, b)
//    {
//	var min = ( a < b ) ? a : b;
//	var max = ( a > b ) ? a : b;
//	return min + ( max - min ) * t;
//    }
    
    this.createTilePositions = function(pImages, column, row, startX, startY) 
    {  
	var count = 0, j, i, img;
	
	for(j = 0; j < row; j++) 
	{
	    for (i = 0; i < column; i++) 
	    {
		img = pImages[count];
		
		img.targetX = startX + (_imageW * i);
		
		img.targetY = startY + (_imageH * j);
		
		img.column = i;
		img.row = j;
		
		count++;
	    }
	}
    }
}