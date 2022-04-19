chrome.app.runtime.onLaunched.addListener(function() {
		chrome.serial.connect("COM3", {bitrate: 9600}, onConnect);
	});
	var stringReceived = '';

	var onConnect = function(connectionInfo) {
		var connectionId = connectionInfo.connectionId;
		console.log("Connection established.");

		var onReceiveCallback = function(info) {
			if (info.connectionId == connectionId) {
				var str = arrayBufferToString(info.data);
				if (str.charAt(str.length-1) === '\r') {
					console.log(stringReceived);
					stringReceived += str.substring(0, str.length-1);
					chrome.runtime.sendMessage('olfipahmcdidhfagdbaopojlfoimfffk', {
						action: 'scanner', data: {
							barcode: stringReceived
						}
					});
					
					stringReceived = '';
				} else {
					stringReceived += str;										
				}				
			}			
		};		
		chrome.serial.onReceive.addListener(onReceiveCallback);
	};

	function arrayBufferToString (buffer) {
		var string = '';
		var bytes = new Uint8Array( buffer );
		var len = bytes.byteLength;
		for (var i = 0; i < len; i++) {
			string += String.fromCharCode( bytes[ i ] )
		}
		return string;
	}