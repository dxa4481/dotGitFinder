var git_test_request = function(test_url, sub_path){
    fetch(test_url)
        .then(function(response) {
            return response.text();
        })
        .then(function(text) {
            var found = false;
            if (text.startsWith("[core]")){
                found = true;
                alert("Found .git on " + test_url)
            }
            var url_to_set = {};
            url_to_set[test_url] = {
                git:
                    {
                        "observed": new Date().getTime(),
                        "vulnerable": found

                    }
            }
            chrome.storage.local.set(url_to_set, function(){
                return true;
                //alert(test_url);
            });
        })
        .catch(function() {
            var url_to_set = {};
            url_to_set[test_url] = {
               git:
                   {
                       "observed": new Date().getTime(),
                       "vulnerable": false
                   }
            }
            chrome.storage.local.set(url_to_set);
        });
}
var fuckme = "";
var find_git = function(origin, pathname) {

    var paths = pathname.split("/");
    if (paths.length > 1 && paths[paths.length-1] == ""){
        paths = paths.slice(0, paths.length - 1);
    }
    if (pathname == "/" || pathname == "" ){
        paths = [""]
    }
    var sub_path = "";
    for (var path in paths) {
        sub_path += paths[path] + "/";
        var test_url = origin + sub_path + ".git/config";
        chrome.storage.local.get(test_url, function(result) {
            if (result[test_url] == undefined) {
                git_test_request(test_url, sub_path);
                return false;
            }
            if (new Date().getTime() - result[test_url].git.observed > 864000000){
                git_test_request(test_url, sub_path);
                return false;
            }
        });

    }
}



chrome.webRequest.onBeforeRequest.addListener(
        function(details) {
            if (details.tabId == -1){
                return {cancel: false}
            }
            chrome.tabs.get(details.tabId, function(tabDetails) {
                var url = new URL(details.url);
                var tabUrl = new URL(tabDetails.url);
                find_git(url.origin, url.pathname);
                //find_s3(url.host, tabUrl.origin);
            })

            /* lets skip s3 testing for now
            fetch(details.url + "?torrent")
                .then(function(response) {
                    return response.text();
                })
                .then(function(text) {
                    if (text.includes("tracker.amazonaws.com")){
                        //alert("Found a bucket")
                    }
                })
                .catch(function() {
                    console.log("error");
                });
             */
          return false;
        },
        {urls: ["<all_urls>"]},
["blocking"]);