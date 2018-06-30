
var dappAddress = "n1esk5zeMDrDrdM2vizqPMTCjAH8m3uaXFn";
$(function() {
	
	
		var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
		var nebpay = new NebPay();


	$("#allrr").click(function() {
		$("#detailTitle").text("All -全部");

		var to = dappAddress;
		var value = "0";
		var callFunction = "getPort";
		var callArgs = "[]";
		nebpay.simulateCall(to, value, callFunction, callArgs, {
			listener: function(resp) {
				//console.log(JSON.stringify(resp.result));
				if(resp.result == ""){
					$("#searchresult").html('<div class="panel-body" >没有记录</div>');
					return;
				}
				var res = JSON.parse(resp.result);
				if(res.length == 0){
					$("#searchresult").html('<div class="panel-body">没有记录</div>');
					return;
				}

				var tempStr = "";

				for (var i = 0; i < res.length; i++) {
			
					tempStr += '<div class="col-md-4"><div class="card mb-4 box-shadow"><div class="card-body"><p class="card-text text-center">' +
					res[i].name +
					'</p><div class="d-flex justify-content-between align-items-center"><small class="text-muted" data-toggle="popover">' +
					res[i].author.substr(3,5) + '<a class="btn" href="javascript:void(0)" id="like" onclick="addMy('+
					res[i].index + ')">查看详细信息</a></small></div></div></div></div>';
				}
				console.log(tempStr);
				$("#searchresult").html(tempStr);
			}
		});

	});
	$("#allrr").click();

	$("#my").click(function() {
		$("#detailTitle").text("My -收藏");



		var to = dappAddress;
		var value = "0";
		var callFunction = "getMy";
		var callArgs = "[]";
		nebpay.simulateCall(to, value, callFunction, callArgs, {
			listener: function(resp) {
				//console.log(JSON.stringify(resp.result));
				if(resp.result == ""){
					$("#searchresult").html('<div class="panel-body">没有记录</div>');
					return;
				}
				var res = JSON.parse(resp.result);
				if(res.length == 0){
					$("#searchresult").html('<div class="panel-body">没有记录</div>');
					return;
				}
				

				var tempStr = "";

				for (var i = 0; i < res.length; i++) {
					if (i % 2 == 0) {
						tempStr += '<div class="panel-body"> ';
					} else {
						tempStr += '<div class="panel-footer">';
					}

					//					
					tempStr += '<p>';
					tempStr += res[i].name;
					tempStr += '</p>';
					tempStr += '<p>';
					tempStr += res[i].content;
					tempStr += '</p>';
					tempStr += '<p>';
					tempStr += '<small><cite>' + '提交ID:' + res[i].author + '  保证金:'+ res[i].value/1e15 +'</cite></small>';
					tempStr += '<br>';
					tempStr += '<a class="btn" href="#" id="unMy" onclick="unMy(';
					tempStr += res[i].index;
					tempStr += ')">移除</a>';
					
					tempStr += '</p> </div> ';
				}
				console.log(tempStr);
				$("#searchresult").html(tempStr);
			}
		});

	});


});

function addMy(index){
	var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
	var nebpay = new NebPay();
		var to = dappAddress;
		var value = "0.000001";
		var callFunction = "adMy";
		var callArgs = "[\"" + index + "\"]";
		nebpay.call(to, value, callFunction, callArgs, {
			listener: function(resp) {
				console.log(JSON.stringify(resp.result));
			}
		});
};

function unMy(index){
	var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
	var nebpay = new NebPay();
		var to = dappAddress;
		var value = "0";
		var callFunction = "unMy";
		var callArgs = "[\"" + index + "\"]";
		nebpay.call(to, value, callFunction, callArgs, {
			listener: function(resp) {
				console.log(JSON.stringify(resp.result));
			}
		});
};

function save(){
	var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
	var nebpay = new NebPay();
		var content = $("#content").val();
		var name = $("#name").val();
		var bal = $("#bals").val();
		if (content == "") {
			alert("请输入谜。");
			return;
		}
		if (name == "") {
			alert("请输入。");
			return;
		}
		if (bal == "") {
			alert("请输入保证金。");
			return;
		}
		content= content.replace(/\n/g,"<br>"); 
		name= name.replace(/\n/g,"<br>"); 
		var to = dappAddress;
		var value = bal;
		var callFunction = "save";
		var callArgs = "[\"" + name + '","' + content + "\"]";
		nebpay.call(to, value, callFunction, callArgs, {
			listener: function Push(resp) {
				console.log("response of push: " + JSON.stringify(resp))
				var respString = JSON.stringify(resp);
				if(respString.search("rejected by user") !== -1){
					alert("关闭交易,取消上传谜题")
				}else if(respString.search("txhash") !== -1){
					alert("上传Hash: " + resp.txhash+"请等待交易确认,如果上传失败请检查内容是否含有特殊字符")
				}
			}
		});
	
};