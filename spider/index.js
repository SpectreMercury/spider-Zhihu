var fs = require('fs');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
	var https = require('https');

  var requrl = 'https://www.zhihu.com/question/31996563';
  request(requrl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log('================='); 
    console.log('================='); 
    console.log('================='); 
    console.log('=================');    //返回请求页面的HTML
	requireImg(body);
    }
  });


function requireImg(data) {
  var $ = cheerio.load(data);
  var imgs = $('.zm-item-answer').find('.zm-item-rich-text').find('.zm-editable-content').find('img').toArray();
	console.log(imgs.length);
	var len = imgs.length;
	var imgContainer = [];
 for(var j = 0; j < len; j++) {
	 var obj = imgs[j].attribs;
	 var url = imgs[j].attribs['data-actualsrc'];
	 if (url == undefined && obj['src']) {
		 url = obj['src'];
		 console.log(j + ' successful with src' + url);
	 } else if (url == undefined && obj['data-original']) {
		 url = obj['data-original'];
		 console.log(j + ' successful with data-original' + url);
	 } else {
		 url = imgs[j].attribs['data-actualsrc'];
	 }
	 //console.log(url + " " + j + " " + "done");
	 var filename = parseUrlForFileName(url);
	 downloadImg(url, filename, function() {
		 console.log(filename + 'done');
	 });
  }
	console.log(imgContainer);
}

function parseUrlForFileName(address) {
  var filename = path.basename(address);
  return filename;
}

function downloadImg(uri,fileName,callback) {
	request.head(uri, function(err,res,body) {
	  if(err) {
	  	console.log('err: ' + err);
	  	return false;
	  }
	  request(uri).pipe(fs.createWriteStream('img/' + fileName)).on('close', callback);
	});
}
