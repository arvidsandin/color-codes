function changeBackgroundColor(color){
  $('#hex_input').val(color);
  if (isColor(color)) {
    if(color.length === 4){
      color = '#' + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2) + color.charAt(3) + color.charAt(3)
    }
    var red = parseInt(color.substring(1, 3), 16);
    var green = parseInt(color.substring(3, 5), 16);
    var blue = parseInt(color.substring(5, 7), 16);
    pushToHistory(color);
    $('#hex_input').css('background-color', '#fff');
    $("#background").css('background-color', color);
    $("#current_color").css('background-color', color);
    $('#current_color_name').first().text(color);
    $('.tint').first().css('background-color', color);
    $('.shade').first().css('background-color', color);
    $('.tint_name').first().text(color);
    $('.shade_name').first().text(color);
    if (isLightColor(color)){
      $('.tint_name').first().css('color',  '#000');
      $('.shade_name').first().css('color',  '#000');
      $('.tone_name').css('color', '#000');
    }
    else {
      $('.tint_name').first().css('color',  '#fff');
      $('.shade_name').first().css('color',  '#fff');
      $('.tone_name').css('color', '#fff');
    }
    //Color the tints
    for (var i = 0; i < $('.tint').length-1; i++) {
      var tempRed = red + Math.round((255 - red)*1/1.2**($('.tint').length - i-1));
      var tempGreen = green + Math.round((255 - green)*1/1.2**($('.tint').length - i-1));
      var tempBlue = blue + Math.round((255 - blue)*1/1.2**($('.tint').length - i-1));
      $('.tint').eq(i+1).css('background-color', 'rgb('+tempRed+','+tempGreen+','+tempBlue+')');
      $('.tint_name').eq(i+1).text('#'+hex(tempRed)+hex(tempGreen)+hex(tempBlue));
    }
    //Color the shades
    for (var i = 0; i < $('.shade').length-1; i++) {
      var tempRed = Math.round(red*1/1.1**(i+1));
      var tempGreen = Math.round(green*1/1.1**(i+1));
      var tempBlue =Math.round(blue*1/1.1**(i+1));
      $('.shade').eq(i+1).css('background-color', 'rgb('+tempRed+','+tempGreen+','+tempBlue+')');
      $('.shade_name').eq(i+1).text('#'+hex(tempRed)+hex(tempGreen)+hex(tempBlue));
    }
    //Color the tones
    for (var i = 0; i < $('.tone').length; i++) {
      var newColor = applySaturationToHexColor(color, (i/$('.tone').length)*100);
      $('.tone').eq(i).css('background-color', newColor);
      $('.tone_name').eq(i).text(newColor);
    }
    $('.rgb_input').css('background-color', '#fff');
    $('#r_input').val(red);
    $('#g_input').val(green);
    $('#b_input').val(blue);
  }
  else {
    $('#hex_input').css('background-color', '#ff6464');
  }
}

function pushToHistory(color){
  //Add to mobile page
  var lastColor = $('.previous_color_bar').first();
  if (rgb2hex(lastColor.css('background-color')) == color) {
    return
  }
  var newLastColor = lastColor.clone();
  newLastColor.css('background-color', color);
  $('#history_icon').after(newLastColor);
  //Add to desktop
  lastColor = $('.previous_color_column').first();
  newLastColor = lastColor.clone();
  newLastColor.css('background-color', color);
  $('#color_history_column').prepend(newLastColor.clone());

  if ($('.previous_color_bar').length > 16){
    $('.previous_color_bar').last().remove();
  }
  if ($('.previous_color_column').length >16){
    $('.previous_color_column').last().remove();
  }
  //Add to storage
  if(localStorage.getItem("history")){
    var history = JSON.parse(localStorage.getItem("history"));
    var i = history.length;
    if (i > 15) {
      i = 15;
    }
    for (i; i > 0; i--) {
      history[i] = history[i-1];
    }
    history[0] = color;
    localStorage.setItem("history", JSON.stringify(history));
  }
  else{
    localStorage.setItem("history", JSON.stringify([color]));
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
  if (x < 0 || x > 255) {
    console.warn("Faulty conversion from decimal to hex");
  }
  return ("0" + parseInt(x).toString(16)).slice(-2);
}
function rgb2hex(rgb) {
  rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(,\s*\d+\.*\d+)?\)$/);
  return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function applySaturationToHexColor(hex, saturationPercent) {
  if (!/^#([0-9a-f]{6})$/i.test(hex)) {
    throw('Unexpected color format');
  }

  if (saturationPercent < 0 || saturationPercent > 100) {
    throw('Unexpected color format');
  }

  var saturationFloat   = saturationPercent / 100,
  rgbIntensityFloat = [
    parseInt(hex.substr(1,2), 16) / 255,
    parseInt(hex.substr(3,2), 16) / 255,
    parseInt(hex.substr(5,2), 16) / 255
  ];

  var rgbIntensityFloatSorted = rgbIntensityFloat.slice(0).sort(function(a, b){ return a - b; }),
  maxIntensityFloat       = rgbIntensityFloatSorted[2],
  mediumIntensityFloat    = rgbIntensityFloatSorted[1],
  minIntensityFloat       = rgbIntensityFloatSorted[0];

  if (maxIntensityFloat == minIntensityFloat) {
    // All colors have same intensity, which means
    // the original color is gray, so we can't change saturation.
    return hex;
  }

  // New color max intensity wont change. Lets find medium and weak intensities.
  var newMediumIntensityFloat,
  newMinIntensityFloat = maxIntensityFloat * (1 - saturationFloat);

  if (mediumIntensityFloat == minIntensityFloat) {
    // Weak colors have equal intensity.
    newMediumIntensityFloat = newMinIntensityFloat;
  }
  else {
    // Calculate medium intensity with respect to original intensity proportion.
    var intensityProportion = (maxIntensityFloat - mediumIntensityFloat) / (mediumIntensityFloat - minIntensityFloat);
    newMediumIntensityFloat = (intensityProportion * newMinIntensityFloat + maxIntensityFloat) / (intensityProportion + 1);
  }

  var newRgbIntensityFloat       = [],
  newRgbIntensityFloatSorted = [newMinIntensityFloat, newMediumIntensityFloat, maxIntensityFloat];

  // We've found new intensities, but we have then sorted from min to max.
  // Now we have to restore original order.
  rgbIntensityFloat.forEach(function(originalRgb) {
    var rgbSortedIndex = rgbIntensityFloatSorted.indexOf(originalRgb);
    newRgbIntensityFloat.push(newRgbIntensityFloatSorted[rgbSortedIndex]);
  });

  var floatToHex = function(val) { return ('0' + Math.round(val * 255).toString(16)).substr(-2); },
  rgb2hex    = function(rgb) { return '#' + floatToHex(rgb[0]) + floatToHex(rgb[1]) + floatToHex(rgb[2]); };

  var newHex = rgb2hex(newRgbIntensityFloat);

  return newHex;
}

var showMobileViewHistory = false;

$(document).ready(function() {
  $('#hex_input').val('#ffffff');
  $('.rgb_input').val(255);
  if(localStorage.getItem("history")){
    var history = JSON.parse(localStorage.getItem("history"));
    localStorage.removeItem('history');
    for (i = history.length-1; i >= 0 ; i--) {
      pushToHistory(history[i]);
    }
    changeBackgroundColor(history[0]);
  }
  else {
    changeBackgroundColor('#ffffff');
  }

  $('#dropdown').on('click', function () {
    showMobileViewHistory = !showMobileViewHistory;
    if (showMobileViewHistory) {
      $('#color_history_bar').css('display', 'flex');
    }
    else {
      $('#color_history_bar').hide();

    }
  });
  $('#color_history_bar').on('click', '.previous_color', function () {
    var hex = rgb2hex($(this).css('background-color'));
    var index = $('.previous_color_bar').index($(this));
    $(this).remove();
    $('.previous_color_column').eq(index).remove();
    changeBackgroundColor(hex);
  });
  $('#color_history_column').on('click', '.previous_color', function () {
    var hex = rgb2hex($(this).css('background-color'));
    var index = $('.previous_color_column').index($(this));
    $(this).remove();
    $('.previous_color_bar').eq(index).remove();
    changeBackgroundColor(hex);
  });

  $('#hex_input').keyup(function() {
    var color = $('#hex_input').val();
    setTimeout(() => {
      //if unchanged after 1.5 s, update page
      if (color == $('#hex_input').val()) {
        if (color.charAt(0) != '#'){
          color = '#' + color;
        }
        changeBackgroundColor(color);
      }
    }, 1500);
  });
  //on Enter keypress
  $('#hex_input').keypress(function(e) {
    if(e.which == 13) {
      var color = $('#hex_input').val();
      if (color.charAt(0) != '#'){
        color = '#' + color;
      }
      changeBackgroundColor(color);
    }
  });

  $('.rgb_input').keyup(function() {
    var rgb = [$('#r_input').val(), $('#g_input').val(), $('#b_input').val()];
    setTimeout(() => {
      //if unchanged after 1.5 s, update page
      if (rgb[0] == $('#r_input').val() && rgb[1] == $('#g_input').val() && rgb[2] == $('#b_input').val()) {
        for (var i = 0; i < 3; i++) {
          if (rgb[i] < 0 || rgb[i] > 255) {
            $('.rgb_input').css('background-color', '#ff6464');
            return
          }
          rgb[i] = hex(Math.floor(rgb[i]));
        }
        $('.rgb_input').css('background-color', '#ffffff');
        changeBackgroundColor('#' + rgb[0] + rgb[1] + rgb[2]);
      }
    }, 1500);
  });
  //on Enter keypress
  $('.rgb_input').keypress(function(e) {
    if(e.which == 13) {
      var red = $('#r_input').val();
      var green = $('#g_input').val();
      var blue = $('#b_input').val();
      var rgb = [red, green, blue];
      for (var i = 0; i < 3; i++) {
        if (rgb[i] < 0 || rgb[i] > 255) {
          $('.rgb_input').css('background-color', 'rgba(255, 0, 0, 0.6)');
          return
        }
        rgb[i] = hex(Math.floor(rgb[i]));
      }
      $('.rgb_input').css('background-color', '#fff');
      changeBackgroundColor('#' + rgb[0] + rgb[1] + rgb[2]);
    }
  });

  $('.tint, .shade, .tone').click(function(){
    var chosenColor = rgb2hex($(this).css('backgroundColor'));
    $('#hex_input').val(chosenColor);
    changeBackgroundColor(chosenColor);
  });

  $('#random_color').click(function(){
    var color = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    changeBackgroundColor(color);
  });
  $('#random_red_color').click(function(){
    var tempRed = Math.floor(Math.random()*192+64)
    var red = hex(tempRed);
    var tempBlue = Math.floor(Math.random()*(tempRed-64));
    var blue = hex(tempBlue);
    var tempGreen = Math.floor(Math.random()*(tempRed-64));
    while (Math.abs(tempBlue - tempGreen) > 32) {
      tempGreen = Math.floor(Math.random()*(tempRed-64));
    }
    var green = hex(tempGreen);
    var color = '#' + red + green + blue;
    changeBackgroundColor(color);
  });
  $('#random_green_color').click(function(){
    var tempGreen = Math.floor(Math.random()*192+64)
    var green = hex(tempGreen);
    var tempBlue = Math.floor(Math.random()*(tempGreen-64));
    var blue = hex(tempBlue);
    var tempRed = Math.floor(Math.random()*(tempGreen-64));
    while (Math.abs(tempBlue - tempRed) > 32) {
      tempRed = Math.floor(Math.random()*(tempGreen-64));
    }
    var red = hex(tempRed);
    var color = '#' + red + green + blue;
    changeBackgroundColor(color);
  });
  $('#random_blue_color').click(function(){
    var tempBlue = Math.floor(Math.random()*192+64);
    var blue = hex(tempBlue);
    //green can be at most the same as blue
    var tempGreen = Math.floor(Math.random()*tempBlue);
    var green = hex(tempGreen);
    //red can be at most the same as green and at most 48 less than blue
    var red = hex(Math.floor(Math.random()*Math.min(tempGreen, tempBlue-48)));
    var color = '#' + red  + green+ blue;
    changeBackgroundColor(color);
  });
  $('#random_yellow_color').click(function(){
    var red = Math.random()*96+160;
    var green = Math.random()*96+160;
    while (Math.abs(red - green) > 32) {
      green = Math.random()*96+160;
    }
    var blue = hex(Math.floor(Math.random()*64));
    var color = '#' + hex(Math.floor(red))  + hex(Math.floor(green)) + blue;
    changeBackgroundColor(color);
  });
});
