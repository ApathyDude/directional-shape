var DShape = {};
(function() {
/*
 * A 2D point at an angle and distance from a center point
 * PARAM: angle - the rad angle * Math.PI (0 is opposite of 1, .5 is opposite of -.5 and 1.5, 0 equals 2)
 *  DEFAULT: 0
 * PARAM: distance - the distance from the center the point is found
 *  DEFAULT: 1
 */
DShape.Point = function(nangle, ndistance) {
    var angle = (nangle ? nangle : 0);
	var distance = (ndistance ? ndistance : 1);

	return {
		getAngle : function() {
			return angle;
		},
		setAngle : function(newAngle) {
			angle = newAngle;
		},
		getDistance : function() {
			return distance;
		},
		setDistance : function(newDistance) {
			distance = newDistance;
		},
		/*
		 * Get the x coordinate of the point relative to 0 and an angle may be added
		 * PARAM: addAngle - the rad angle * Math.PI to be added to this.angle (0 is opposite of 1, .5 is opposite of -.5 and 1.5, 0 equals 2)
		 *  DEFAULT: 0
		 * RETURN: The x coordinate of the point relative to 0 when an angle is added
		 */
		relativeX : function(addAngle) {
			addAngle = (addAngle ? addAngle : 0);
			return Math.sin((angle + addAngle)*Math.PI)*distance;
		},
		/*
		 * Get the y coordinate of the point relative to 0 and an angle may be added
		 * PARAM: addAngle - the rad angle * Math.PI to be added to this.angle (0 is opposite of 1, .5 is opposite of -.5 and 1.5, 0 equals 2)
		 *  DEFAULT: 0
		 * RETURN: The y coordinate of the point relative to 0 when an angle is added
		 */
		relativeY : function(addAngle) {
			addAngle = (addAngle ? addAngle : 0);
			return Math.cos((angle + addAngle)*Math.PI)*distance;
		}
	};
};
})();
(function() {
/*
 * A 2D shape that has an array of points and can rotate around a point
 * PARAM: points - an array of points for the shape to follow, must be in order of which points are connected to which
 *  DEFAULT: empty array
 * PARAM: style - the canvas.context style to be applied
 *  DEFAULT: "#000000"
 * PARAM: locx - the x coordinate of the central point of the shape
 *  DEFAULT: 0
 * PARAM: locy - the y coordinate of the central point of the shape
 *  DEFAULT: 0
 * PARAM: direction - the rad angle * Math.PI (0 is opposite of 1, .5 is opposite of -.5 and 1.5, 0 equals 2)
 *  DEFAULT: 0
 */
DShape.Shape = function(npoints, nstyle, nlocx, nlocy, ndirection) {
	var points = (npoints ? npoints : []);
	var style = (nstyle ? nstyle : "#000000");
	var locx = (nlocx ? nlocx : 0);
	var locy = (nlocy ? nlocy : 0);
	var direction = (ndirection ? ndirection : 0);
	
	/*
	 * Trace the path of the shape, but don't stroke or fill
	 * PARAM: ctx - a canvas.context to draw to; context must be 2D 
	 */
	var path = function(ctx) {
		ctx.beginPath();
		for(var i = 0; i < points.length; i++) {
			var x = points[i].relativeX(direction);
			var y = points[i].relativeY(direction);
			ctx.lineTo(locx+x, locy+y);
		}
	};
	
	/*
	 * Get the angle of position (x,y) relative to (0,0)
	 * PARAM: x - the x-coordinate of the point
	 * PARAM: y - the y-coordinate of the point
	 * RETURN: the rad angle * Math.PI (0 is opposite of 1, .5 is opposite of -.5 and 1.5, 0 equals 2)
	 */
	var getAngleOfPosition = function(x,y) {
		return calcAngle(0,x,0,y);
	};
	
	/*
	 * Get the distance from (0,0) to (x,y)
	 * PARAM: x - the x-coordinate to get the distance from
	 * PARAM: y - the y-coordinate to get the distance from
	 * RETURN: the distance from (0,0) to (x,y)
	 */
	var getDistanceOfPosition = function(x,y) {
		return Math.sqrt(x*x+y*y);
	}	;
	
	return {
		getPoints : function() {
			return points;
		},
		setPoints : function(newPoints) {
			points = newPoints;
		},
		getStyle : function() {
			return style;
		},
		setStyle : function(newStyle) {
			style = newStyle;
		},
		getX : function() {
			return locx;
		},
		getY : function() {
			return locy;
		},
		setLoc : function(x, y) {
			locx = x;
			locy = y;
		},
		getDirection : function() {
			return direction;
		},
		setDirection : function(newDirection) {
			direction = newDirection;
		},
		/*
		 * Draw the Shape and then call canvas.context.closePath() and canvas.context.fill()
		 * PARAM: ctx - a canvas.context to draw to; context must be 2D
		 */
		closeFill : function(ctx) {
			ctx.fillStyle=style;
			path(ctx);
			ctx.closePath();
			ctx.fill();
		},
		/*
		 * Add a point to the end of the points array
		 * PARAM: x - the x coordinate relative to the center of the Shape
		 * PARAM: y - the y coordinate relative to the center of the Shape
		 */
		addPointByPosition : function(x, y) {
			points[points.length] = new Point(getAngleOfPosition(x,y), getDistanceOfPosition(x,y));
		},
		
		/*
		 * Add a point to the edd of the points array
		 * PARAM: angle - the angle of the point relative to the center of the Shape
		 * PARAM: distance - the distance the point is from the center of the Shape
		 */
		addPointByAngle : function(angle, distance) {
			points[points.length] = new Point(angle, distance);
		},
		
		/*
		 * Add a point to the end of the points array
		 * PARAM: point - the point to be added the end of the array; point must be instance of Point class
		 */
		addPointByPoint : function(point) {
			point = (point instanceof Point ? point : null);
			points[points.length] = point;
		},
		
		/*
		 * Draw the Shape and then call canvas.context.closePath() and canvas.context.stroke()
		 * PARAM: ctx - a canvas.context to draw to; context must be 2D
		 */
		closeStroke : function(ctx) {
			ctx.strokeStyle=style;
			path(ctx);
			ctx.closePath();
			ctx.stroke();
		}
		
	};
	
};
})();
/*
 * Get the angle of position (x1,y1) relative to (x2,y2)
 * PARAM: x1 - the x-coordinate of the point1
 * PARAM: x2 - the x-coordinate of the point1
 * PARAM: y1 - the y-coordinate of the point2
 * PARAM: y2 - the y-coordinate of the point2
 * RETURN: the rad angle * Math.PI (0 is opposite of 1, .5 is opposite of -.5 and 1.5, 0 equals 2)
 */
DShape.calcAngle = function(x1, x2, y1, y2) {
	return Math.atan2(x1-x2,y1-y2)/Math.PI;			
};
