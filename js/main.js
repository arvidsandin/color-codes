function changeBackgroundColor(color){
  $('#hex_input').val(color);
  if (isColor(color)) {
    if(color.length === 4){
      color = '#' + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2) + color.charAt(3) + color.charAt(3)
    }
    $('#hex_input').css('background-color', 'rgba(255, 255, 255, 0.5)');
    $("#background").css('background-color', color);
    if (isLightColor(color)) {
      $('#center').css('background-color', 'rgba(0, 0, 0, 0.3)');
    }
    else {
      $('#center').css('background-color', 'rgba(255, 255, 255, 0.3)');
    }
    $('#r_input').val(parseInt(color.substring(1, 3), 16));
    $('#g_input').val(parseInt(color.substring(3, 5), 16));
    $('#b_input').val(parseInt(color.substring(5, 7), 16));
  }
  else {
    $('#hex_input').css('background-color', 'rgba(255, 0, 0, 064)');
  }
}

function isColor(strColor){
  return /^#[0-9A-F]{6}$/i.test(strColor) ||
  /^#([0-9A-F]{3}){1,2}$/i.test(strColor)
}

function isLightColor(color){
  return 128 * 3 < parseInt(color.substring(1, 3), 16) + parseInt(color.substring(3, 5), 16) + parseInt(color.substring(5, 7), 16)
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

  $('#random_color').click(function(){
    var color = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    changeBackgroundColor(color);
  });
  $('#random_red_color').click(function(){
    var red = Math.floor(Math.random()*128+128).toString(16).padStart(2, '0');
    var green = Math.floor(Math.random()*64).toString(16).padStart(2, '0');
    var blue = Math.floor(Math.random()*64).toString(16).padStart(2, '0');
    var color = '#' + red + green + blue;
    changeBackgroundColor(color);
  });
  $('#random_green_color').click(function(){
    var red = Math.floor(Math.random()*64).toString(16).padStart(2, '0');
    var green = Math.floor(Math.random()*128+128).toString(16).padStart(2, '0');
    var blue = Math.floor(Math.random()*64).toString(16).padStart(2, '0');
    var color = '#' + red + green + blue;
    changeBackgroundColor(color);
  });
  $('#random_blue_color').click(function(){
    var red = Math.floor(Math.random()*64).toString(16).padStart(2, '0');
    var green = Math.floor(Math.random()*64).toString(16).padStart(2, '0');
    var blue = Math.floor(Math.random()*128+128).toString(16).padStart(2, '0');
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
