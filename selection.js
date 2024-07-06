$(document).ready(function () {
  $('body').append('<div id="ec-bubble"><pre id="ec-bubble-text"></pre></div>');

  $(document).click(function () {
    hideBubble();
  });

  $('#ec-bubble').click(function (event) {
    event.stopPropagation();
  });

  $(document).dblclick(function (e) {
    processSelection(e);
  });

  $(document).bind('mouseup', function (e) {
    processSelection(e);
  });

});

function processSelection(e) {
  let text = getSelectedText();

  if ($.isNumeric(text) && [10, 13].includes(text.length)) {
    if (text.length == 10) {  // Handle millisecond timestamps
      text = text + "000";
    }
    console.log("Epoch Converter found timestamp: " + text);
    const date = timestampToDate(text);
    const localStr = getLocalString(date);
    const utcStr = getUTCString(date);
    console.log("Converted local timestamp: " + localStr);
    console.log("Converted UTC timestamp: " + utcStr);
    showBubble(e, localStr, utcStr);
  }
}

function getSelectedText() {
  var text = "";

  if (window.getSelection) {
    text = window.getSelection().toString();
  } else if (document.selection && document.selection.type !== 'Control') {
    text = document.selection.createRange().text;
  }

  return text;
}

function timestampToDate(text) {
  ts = parseInt(text)
  return new Date(ts);
}

function getLocalString(date) {
  tz = date.getTimezoneOffset()
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)} GMT${tz < 0 ? '+' : '-'}${pad(Math.floor(tz / 60))}:${pad(tz % 60)}`
}

function getUTCString(date) {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}.${pad(date.getMilliseconds(), 3)} GMT`
}

function pad(v, length=2) {
  return v.toString().padStart(length, '0')
}

function showBubble(e, localDateStr, utcDateStr) {
  $('#ec-bubble').css('top', e.pageY + 20 + "px");
  $('#ec-bubble').css('left', e.pageX - 85 + "px");
  $('#ec-bubble-text').html(localDateStr + '<br/>' + utcDateStr);
  $('#ec-bubble').css('visibility', 'visible');
}

function hideBubble() {
  $('#ec-bubble').css('visibility', 'hidden');
  $('#ec-bubble-text').html('');
}
