var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

const circles = [];
const colors = ["#B5EAEA", "#EDF6E5", "#FFBCBC", "#F38BA0"];
// const bgColors = ["#191919", "#2D4263", "#C84B31", "#7A0BC0"];
const bgColors = ["#FFFFFF"];

let bgColor = 0,
	bgCircles = [],
	prevBgColor = 0;

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

class BackgroundCircle {
	constructor(x, y, radius, color, growRate = 5, stroked = true) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		this.growRate = growRate;
		this.stroked = stroked;
	}

	draw() {
		c.fillStyle = this.color;
		c.strokeStyle = this.color;
		c.lineWidth = 10;
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		if (this.stroked) {
			c.stroke();
		} else {
			c.fill();
		}
	}

	isDone() {
		return this.radius <= window.innerHeight * 3;
	}

	animate() {
		if (this.isDone()) {
			this.radius += this.growRate;
		}
	}
}

class Circle {
	constructor(
		x,
		y,
		radius,
		width,
		color,
		directionX = 0,
		directionY = 0,
		moveRate = 5,
		stroked = false
	) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.radius = radius;
		this.color = color;
		this.directionX = directionX;
		this.directionY = directionY;
		this.moveRate = moveRate;
		this.stroked = stroked;
	}

	move(dx, dy) {
		this.x += dx;
		this.y += dy;
	}

	draw() {
		if (this.isVisible()) {
			c.fillStyle = this.color;
			c.strokeStyle = this.color;
			c.beginPath();
			c.lineWidth = this.width;
			c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
			if (this.stroked) {
				c.stroke();
			} else {
				c.fill();
			}
		}
	}

	isVisible() {
		return this.radius > 0;
	}

	animate() {
		if (this.directionX == 0) {
			this.move(this.moveRate, 0);
		} else {
			this.move(-this.moveRate, 0);
		}

		if (this.directionY == 0) {
			this.move(0, this.moveRate);
		} else {
			this.move(0, -this.moveRate);
		}

		if (this.x + this.radius >= canvas.width) {
			this.directionX = 1;
		}
		if (this.x - this.radius <= 0) {
			this.directionX = 0;
		}

		if (this.y + this.radius >= canvas.height) {
			this.directionY = 1;
		}
		if (this.y - this.radius <= 0) {
			this.directionY = 0;
		}

		this.radius -= 0.3;
		this.moveRate -= 0.1;
	}
}

function init() {
	// document.body.style.backgroundColor = bgColors[prevBgColor];

	window.addEventListener("resize", () => {
		canvas.height = window.innerHeight;
		canvas.width = window.innerWidth;
	});

	window.addEventListener("click", fireCircles);
	// window.addEventListener("touchend", fireCircles);

	animate();
}

function fireCircles(e) {
	for (var i = 0; i < 25; i++) {
		const x = e.clientX;
		const y = e.clientY;
		const radius = 25 * Math.random() + 25;
		const width = 5;
		const directionX = Math.round(Math.random() * 1);
		const directionY = Math.round(Math.random() * 1);
		const moveRate = Math.random() * 10 + 5;
		const stroked = Math.round(Math.random());

		circle = new Circle(
			x,
			y,
			radius,
			width,
			colors[Math.round(Math.random() * (colors.length - 1))],
			directionX,
			directionY,
			moveRate,
			stroked
		);

		circles.push(circle);
	}
	prevBgColor = bgColor;
	bgColor = bgColor + 1 >= bgColors.length ? 0 : bgColor + 1;
	bgCircles.push(
		new BackgroundCircle(e.clientX, e.clientY, 0, bgColors[bgColor], 20)
	);
}

function animate() {
	// c.fillStyle = bgColors[prevBgColor];
	// c.fillRect(0, 0, canvas.width, canvas.height);
	c.clearRect(0, 0, canvas.width, canvas.height);

	// if(!bgCircle?.isDone()){
	//     document.body.style.backgroundColor = bgColors[bgColor];
	// }
	for (var i = 0; i < bgCircles.length; i++) {
		bgCircles[i].draw();
		bgCircles[i].animate();
	}

	for (var i = 0; i < circles.length; i++) {
		circles[i].draw();
		circles[i].animate();
	}

	circles.forEach((c) => {
		if (!c.isVisible()) {
			const index = circles.findIndex((ci) => ci == c);
			circles.splice(index, 1);
		}
	});

	requestAnimationFrame(animate);
}

init();
