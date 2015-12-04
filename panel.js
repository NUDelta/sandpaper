var runInPage = function (fn, callback) {
  var args = Array.prototype.slice.call(arguments, 2);
  var evalCode = "(" + fn.toString() + ").apply(this, " + JSON.stringify(args) + ");";
  console.log(evalCode);
  chrome.devtools.inspectedWindow.eval(evalCode, {}, function(res, exceptionInfo) {
    console.log(res);
    console.log(exceptionInfo);
  });
};

function requestDisable(functionName) {
  console.log("This is from the dom");
  window[functionName] = null;
}

$(document).ready(function () {
  var tabId = chrome.devtools.inspectedWindow.tabId;
  var panelPort = chrome.extension.connect({name: "gravelpanel"});
  panelPort.postMessage({
    name: "identification",
    data: tabId
  });

  panelPort.onMessage.addListener(function (message) {
    if (message && message.target == "page" && message.name == "JSTrace") {
      console.log("message received");
      console.log(message);

      $('.functions').empty();
      for (var i = 0; i < message.data.length; i++) {
        $('<input/>', {
          type: 'checkbox',
          id: 'cb'+i,
          value: message.data[i],
          "checked": "checked"
        }).appendTo($('.functions'));

        $('<label/>', {
          for: 'cb'+i,
          text: message.data[i]
        }).appendTo($('.functions'));

        $('<br/>').appendTo($('.functions'));

        $('#cb' + i + ":checkbox").change(function(e) {
          console.log(e.target.value);
          // chrome.devtools.inspectedWindow.eval("console.log('wow');");
          // runInPage(console.log("wow"), null);
          runInPage(requestDisable, null, e.target.value);
        });
      }
    }
  });
});
