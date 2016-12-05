function Portfolio_4_7_s(mouseContext, aNumImages) {
    var _canvas, _context, _image, _images = [], _count = 0, _imageW = 30, _imageH = 30, _numImages = 60, _checkForCollision = true, _gotoTarget = false, _imgInPlaceCount = 0, _interval, _canvasW, _canvasH;
    
    if(mouseContext !==  undefined) {
    	_canvas = mouseContext[0];
	    _context = _canvas.getContext("2d");
	    _canvasW = _canvas.width;
	    _canvasH = _canvas.height;
	    
	    _context.strokeStyle = "rgb(255,255,255)";
	    _context.fillStyle = "rgba(0,0,0,0.06)";
    }
    else
    {
    	alert("canvas undefined");
    }
    
    if(aNumImages !== undefined)
    {
	_numImages = aNumImages;
    }
    
    this.init = function()
    {
    	this.createImages();
	
	if(aNumImages === undefined) this.createTilePositions(_images, 15, 4, 25, 200);
	
	var scope = this;
	
	mouseContext.mousedown(function(event)
				{
				    scope.gotoTarget(true);
				});
    };
    
    this.gotoTarget = function (bool) {
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
    // --- dots in pairs, joined by a line
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
	    				inPlace:false
	    				};
    	    
    	    _images.push(imageObj);
        }
    	
//    	_image = new Image();
//    	_image.src = "portfolioMotion2_cropped.png";
// 	    
//    	_image.onload = function()
// 	    {
    	var sc = this;
    		_interval = setInterval(function(){
    								sc.update();
    								sc.draw();
    		}, 1000/30);
// 	    };
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
    	
    	rad = 2;
    	
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
    	var i, img1, img2, dx, dy, dist, maxDist = 400;
    	
    	 _context.fillRect(0, 0, _canvasW, _canvasH);
    	 
         for(i = 0; i < _numImages; i+=2) 
         {
             img1 = _images[i];
             img2 = _images[i+1];
             
//             _context.drawImage(_image, img.column * _imageW, img.row * _imageH, _imageW, _imageH, img.x, img.y, _imageW, _imageH);
             
            _context.beginPath();
            _context.arc(img1.x, img1.y, 2, 0, Math.PI * 2, false);
	    _context.moveTo(img2.x, img2.y);
	    _context.arc(img2.x, img2.y, 2, 0, Math.PI * 2, false);
	    _context.stroke();
             
	    dx = img1.x - img2.x;
	    dy = img1.y - img2.y;
		 
	    dist = Math.sqrt(dx * dx + dy * dy);
	     
	    if(!_gotoTarget || dist < maxDist)
	    {
		_context.beginPath();
		_context.moveTo(img1.x, img1.y);
        	_context.lineTo(img2.x, img2.y);
        	_context.stroke();
	    }
         }
    }
    
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