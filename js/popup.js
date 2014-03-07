/**
* 读取页面URL 创建二维码
* @author admin@laoshu133.com
* @date   2014.03.07
*/
 
Zepto(function($){
	var 
	qrUrlTmpl = 'http://qr.liantu.com/api.php?el=m&w=200&m=2&text={url}',
	qrUrlTmpl2 = 'https://chart.googleapis.com/chart?cht=qr&chs=200x200&choe=UTF-8&chld=Q|2&chl={url}';

	var 
	qrImg = $('#popup_qr').removeClass('active'),
	qrIcon = $('#popup_qricon');

	chrome.tabs.getSelected(null, function(tab){
		loadQrImg(tab.url, function(url){
			qrImg.attr('src', url).addClass('active');

			if(tab.favIconUrl && tab.favIconUrl.indexOf('chrome://theme') !== 0){
				qrIcon.css('backgroundImage', 'url('+ tab.favIconUrl +')').show();
			}
		}, function(){
			alert(chrome.i18n.getMessage('generate_qr_error'));
		});
	});

	function loadQrImg(url, success, error, urlTmpl){
		var img = new Image();
		img.onload = function(){
			img.onload = img.onerror = null;
			success && success(img.src, img);
		};
		img.onerror = function(){
			img.onload = img.onerror = null;

			if(!urlTmpl){
				return loadQrImg(url, success, error, qrUrlTmpl2);
			}
			error && error();
		};

		img.src = (urlTmpl || qrUrlTmpl).replace(/\{url\}/g, encodeURIComponent(url));
	}
});