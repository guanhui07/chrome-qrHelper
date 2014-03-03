/**
* 根据图片解析 二维码
* @author admin@laoshu133.com
* @date   2014.02.26
*/
;(function(){
	QRHelper.on('config', function(){
		updateConfig();
	});
	updateConfig();

	function updateConfig(configs){
		var configs = QRHelper.getConfig();

		removeContextMenu();
		if(configs['qr_read_enabled']){
			addContextMenu();
		}
	}

	function addContextMenu(){
		chrome.contextMenus.create({
			type: 'normal',
			contexts: ['image'],
			title: '读取二维码',
			onclick: function(info, tab){
				showLoading();
				qrcode.decode(info.srcUrl, function(text, data){
					hideLoading();

					var rurl = /^(?:https?|ftp|file):\/\/\w+/i;
					if(rurl.test(text)){
						chrome.tabs.create({ url:text });
					}
					else{
						setClipboard(text);
						alert('二维码解析成功且已复制，请粘贴使用：\n\n' + text + '');
					}
				}, function(code, msg){
					hideLoading();
					alert(msg);
				});
			}
		});
	}
	
	function removeContextMenu(){
		chrome.contextMenus.removeAll();
	}

	function setClipboard(text){
		var inpId = 'qr_helper_copy_inp', inp = document.getElementById(inpId);
		if(!inp){
			inp = document.createElement('input');
			inp.id = inpId;
			document.body.appendChild(inp);
		}
		inp.value = text;
		inp.select();

		document.execCommand('copy', false, null);
	}
	
	function showLoading(){
		var count = 4, currInx = showLoading.currInx || 0;
		var txt = new Array(currInx+1).join('.') + new Array(count-currInx+1).join(' ');
		chrome.browserAction.setBadgeText({ text:txt });

		showLoading.timer = setTimeout(showLoading, 400);
		showLoading.currInx = ++currInx % count;
	}

	function hideLoading(){
		clearTimeout(showLoading.timer);
		chrome.browserAction.setBadgeText({ text:'' });
	}
})();



/**
* qrcode
*/
;(function(){
	var qrcode = window.qrcode = {
		decodeUrl: 'http://tool.oschina.net/action/qrcode/decode',
		decode: function(url, success, error){
			var self = this;
			this.loadImageByXHR(url, function(blob, xhr){
				self.decodeByFile(blob, success, error);
			}, function(){
				self.throwError(1, error);
			});
		},
		decodeByFile: function(blob, success, error){
			var 
			self = this,
			formData = new FormData(),
			xhr = new XMLHttpRequest();

			xhr.onload = function(){
				var data;
				try{
					data = JSON.parse(xhr.responseText);
				}
				catch(_){
					self.throwError(2, error);
					return;
				}

				if(data && data[0] && data[0].text){
					success && success(data[0].text, data[0]);
				}
				else{
					self.throwError(3, error);
				}
			};
			xhr.onerror = function(){
				self.throwError(2, error);
			};

			formData.append('qrcode', blob);
			xhr.open('POST', this.decodeUrl, true);
			xhr.send(formData);
		},
		loadImageByXHR: function(url, success, error){
			var xhr = new XMLHttpRequest();
			xhr.responseType = 'blob';
			xhr.onload = function(){
				success && success(xhr.response, xhr);
			};
			xhr.onerror = function(){
				error && error(xhr);
			};
			xhr.open('GET', url, true);
			xhr.send(null);
		},
		loadImage: function(url, success, error){
			console.log(url);
			var img = new Image();
			img.onload = function(){
				img.onload = img.onerror = null;
				
				success && success(img.url, img);
			};
			img.onerror = function(){
				img.onload = img.onerror = null;
				
				error && error();
			}
			img.src = url;
		},
		throwError: function(code, callback){
			var errMsgs = [
				'图片加载失败！',
				'网络或者服务器错误，请重试！',
				'解码失败！'
			];

			callback && callback(code, errMsgs[code - 1]);
		}
	};
})();