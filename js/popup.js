/**
* 读取页面URL 创建二维码
* @author admin@laoshu133.com
* @date   2014.02.26
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

			if(tab.favIconUrl){
				qrIcon.css('backgroundImage', 'url('+ tab.favIconUrl +')');
			}
		}, function(){
			alert('二维码创建失败，请检查网络连接或与管理员联系。');
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