function changeBackgroundColor(color){
  $('#hex_input').val(color);
  if (isColor(color)) {
    if(color.length === 4){
      color = '#' + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2) + color.charAt(3) + color.charAt(3)
    }
    var red = parseInt(color.substring(1, 3), 16);
    var green = parseInt(color.substring(3, 5), 16);
    var blue = parseInt(color.substring(5, 7), 16);
    $('#hex_input').css('background-color', '#fff');
    $("#background").css('background-color', color);
    $("#current_color").css('background-color', color);
    $('.tint')[0].style.backgroundColor = color;
    $('.shade')[0].style.backgroundColor = color;
    $('.tint_name')[0].innerHTML = color;
    $('.shade_name')[0].innerHTML = color;
    if (isLightColor(color)){
        $('.tint_name')[0].style.color = ('#000');
        $('.shade_name')[0].style.color = ('#000');
    }
    else {
      $('.tint_name')[0].style.color = ('#fff');
      $('.shade_name')[0].style.color = ('#fff');
    }
    for (var i = 0; i < $('.tint').length-1; i++) {
      var tempRed = red + Math.round((255 - red)*1/1.2**($('.tint').length - i-1));
      var tempGreen = green + Math.round((255 - green)*1/1.2**($('.tint').length - i-1));
      var tempBlue = blue + Math.round((255 - blue)*1/1.2**($('.tint').length - i-1));
      $('.tint')[i+1].style.backgroundColor = 'rgb('+tempRed+','+tempGreen+','+tempBlue+')';
      $('.tint_name')[i+1].innerHTML = '#'+hex(tempRed)+hex(tempGreen)+hex(tempBlue);
    }
    for (var i = 0; i < $('.shade').length-1; i++) {
      var tempRed = Math.round(red*1/1.1**(i+1));
      var tempGreen = Math.round(green*1/1.1**(i+1));
      var tempBlue =Math.round(blue*1/1.1**(i+1));
      $('.shade')[i+1].style.backgroundColor = 'rgb('+tempRed+','+tempGreen+','+tempBlue+')';
      $('.shade_name')[i+1].innerHTML = '#'+hex(tempRed)+hex(tempGreen)+hex(tempBlue);
    }
    $('#r_input').val(red);
    $('#g_input').val(green);
    $('#b_input').val(blue);
  }
  else {
    $('#hex_input').css('background-color', '#ff4747');
  }
}

function isColor(strColor){
  return /^#[0-9A-F]{6}$/i.test(strColor) ||
  /^#([0-9A-F]{3}){1,2}$/i.test(strColor)
}

function isLightColor(color){
  return 128 * 3 < parseInt(color.substring(1, 3), 16) + parseInt(color.substring(3, 5), 16) + parseInt(color.substring(5, 7), 16)
}

function hex(x) {
  return ("0" + parseInt(x).toString(16)).slice(-2);
}
function rgb2hex(rgb) {
   rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(,\s*\d+\.*\d+)?\)$/);
   return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
  }

$(document).ready(function() {
  $('#hex_input').val('#ffffff');
  $('.rgb_input').val(255);
  changeBackgroundColor('#ffffff');

  $('#hex_input').keyup(function() {
    var color = $('#hex_input').val();
    if (color.charAt(0) != '#'){
      color = '#' + color;
    }
    changeBackgroundColor(color);
  });

  $('.rgb_input').keyup(function() {
    var red = $('#r_input').val();
    var green = $('#g_input').val();
    var blue = $('#b_input').val();
    var rgb = [red, green, blue];
    for (var i = 0; i < 3; i++) {
      if (rgb[i] < 0 || rgb[i] > 255) {
        $('.rgb_input').css('background-color', 'rgba(255, 0, 0, 0.6)');
        return
      }
      rgb[i] = Math.floor(rgb[i]).toString(16).padStart(2, '0')
    }
    $('.rgb_input').css('background-color', 'rgba(255, 255, 255, 0.5)');
    changeBackgroundColor('#' + rgb[0] + rgb[1] + rgb[2]);
  });

  $('.tint, .shade').click(function(){
    var chosenColor = rgb2hex($(this).css('backgroundColor'))
    $('#hex_input').val(chosenColor);
    changeBackgroundColor(chosenColor);
  });

  $('#random_color').click(function(){
    var color = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    changeBackgroundColor(color);
  });
  $('#random_red_color').click(function(){
    var tempRed = Math.floor(Math.random()*192+64)
    var red = tempRed.toString(16).padStart(2, '0');
    var tempBlue = Math.floor(Math.random()*(tempRed-64));
    var blue = tempBlue.toString(16).padStart(2, '0');
    var tempGreen = Math.floor(Math.random()*(tempRed-64));
    while (Math.abs(tempBlue - tempGreen) > 32) {
      tempGreen = Math.floor(Math.random()*(tempRed-64));
    }
    var green = tempGreen.toString(16).padStart(2, '0');
    var color = '#' + red + green + blue;
    changeBackgroundColor(color);
  });
  $('#random_green_color').click(function(){
    var tempGreen = Math.floor(Math.random()*192+64)
    var green = tempGreen.toString(16).padStart(2, '0');
    var tempBlue = Math.floor(Math.random()*(tempGreen-64));
    var blue = tempBlue.toString(16).padStart(2, '0');
    var tempRed = Math.floor(Math.random()*(tempGreen-64));
    while (Math.abs(tempBlue - tempRed) > 32) {
      tempRed = Math.floor(Math.random()*(tempGreen-64));
    }
    var red = tempRed.toString(16).padStart(2, '0');
    var color = '#' + red + green + blue;
    changeBackgroundColor(color);
  });
  $('#random_blue_color').click(function(){
    var tempBlue = Math.floor(Math.random()*192+64);
    var blue = tempBlue.toString(16).padStart(2, '0');
    //green can be at most the same as blue
    var tempGreen = Math.floor(Math.random()*tempBlue);
    var green = tempGreen.toString(16).padStart(2, '0');
    //red can be at most the same as green
    var red = Math.floor(Math.random()*tempGreen).toString(16).padStart(2, '0');
    var color = '#' + red  + green+ blue;
    changeBackgroundColor(color);
  });
  $('#random_yellow_color').click(function(){
    var red = Math.random()*96+160;
    var green = Math.random()*96+160;
    while (Math.abs(red - green) > 32) {
      green = Math.random()*96+160;
    }
    var blue = Math.floor(Math.random()*64).toString(16).padStart(2, '0');
    var color = '#' + Math.floor(red).toString(16).padStart(2, '0')  + Math.floor(green).toString(16).padStart(2, '0') + blue;
    changeBackgroundColor(color);
  });
});
