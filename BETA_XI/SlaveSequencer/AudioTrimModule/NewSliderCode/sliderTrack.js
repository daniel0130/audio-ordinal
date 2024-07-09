const leftSlider = document.querySelector('.slider.left');
const rightSlider = document.querySelector('.slider.right');
const track = document.querySelector('.slider-track');
let leftSliderPosition = 0;
let rightSliderPosition = track.offsetWidth - rightSlider.offsetWidth;

leftSlider.onmousedown = function(event) {
    let shiftX = event.clientX - leftSlider.getBoundingClientRect().left;

    document.onmousemove = function(event) {
        let newLeft = event.clientX - shiftX - track.getBoundingClientRect().left;
        if (newLeft < 0) {
            newLeft = 0;
        }
        let rightEdge = track.offsetWidth - leftSlider.offsetWidth;
        if (newLeft > rightEdge) {
            newLeft = rightEdge;
        }
        if (newLeft > rightSliderPosition - leftSlider.offsetWidth) {
            newLeft = rightSliderPosition - leftSlider.offsetWidth;
        }
        leftSliderPosition = newLeft;
        leftSlider.style.left = newLeft + 'px';
    };

    document.onmouseup = function() {
        document.onmousemove = null;
        leftSlider.onmouseup = null;
    };
};

leftSlider.ondragstart = function() {
    return false;
};

rightSlider.onmousedown = function(event) {
    let shiftX = event.clientX - rightSlider.getBoundingClientRect().left;

    document.onmousemove = function(event) {
        let newRight = event.clientX - shiftX - track.getBoundingClientRect().left;
        let leftEdge = rightSlider.offsetWidth;
        if (newRight < leftEdge) {
            newRight = leftEdge;
        }
        if (newRight < leftSliderPosition + rightSlider.offsetWidth) {
            newRight = leftSliderPosition + rightSlider.offsetWidth;
        }
        rightSliderPosition = newRight;
        rightSlider.style.left = newRight + 'px';
    };

    document.onmouseup = function() {
        document.onmousemove = null;
        rightSlider.onmouseup = null;
    };
};

rightSlider.ondragstart = function() {
    return false;
};
