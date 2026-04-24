const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let circles = [];
let selectedCircle = null;
let isDragging = false;

// DRAW ALL CIRCLES
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    circles.forEach(function(circle) {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle === selectedCircle ? "red" : "blue";
        ctx.fill();
        ctx.closePath();
    });
}

// CHECK IF CLICK INSIDE CIRCLE
function getCircle(x, y) {
    return circles.find(function(circle) {
        const dx = x - circle.x;
        const dy = y - circle.y;
        return Math.sqrt(dx * dx + dy * dy) <= circle.radius;
    });
}

// MOUSE DOWN
canvas.addEventListener("mousedown", function(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const found = getCircle(x, y);

    if (found) {
        selectedCircle = found;
        isDragging = true;
    } else {
        const newCircle = { x: x, y: y, radius: 20 };
        circles.push(newCircle);
        selectedCircle = newCircle;
    }

    draw();
});

// MOUSE MOVE (DRAG)
canvas.addEventListener("mousemove", function(e) {
    if (isDragging && selectedCircle) {
        const rect = canvas.getBoundingClientRect();
        selectedCircle.x = e.clientX - rect.left;
        selectedCircle.y = e.clientY - rect.top;
        draw();
    }
});

// MOUSE UP
canvas.addEventListener("mouseup", function() {
    isDragging = false;
});

// DELETE KEY
document.addEventListener("keydown", function(e) {
    if (e.key === "Delete" && selectedCircle) {
        circles = circles.filter(function(c) {
            return c !== selectedCircle;
        });
        selectedCircle = null;
        draw();
    }
});

// SCROLL TO RESIZE
canvas.addEventListener("wheel", function(e) {
    if (selectedCircle) {
        e.preventDefault();

        if (e.deltaY < 0) {
            selectedCircle.radius += 5;
        } else {
            selectedCircle.radius -= 5;
        }

        if (selectedCircle.radius < 5) {
            selectedCircle.radius = 5;
        }

        draw();
    }
});
