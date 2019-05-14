/*
chrome.storage.sync.set({key: {"potato":123}}, function() {
  alert('Value is set to potato');
});

chrome.storage.sync.get(['key'], function(result) {
  alert('Value currently is ' + result.key.potato);
});

chrome.storage.sync.get(['key2'], function(result) {
  alert('Value currently is ' + result.key);
});
*/