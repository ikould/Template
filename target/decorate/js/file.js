var typeArray; // 所有type信息
var currentType; // 当前Type
var currentSeries; // 当前Series

window.onload = function() {
	init();
}

function init() {
	var str_data = {};
	// 通过ajax传输
	$.ajax({
		type : 'post',
		url : '/decorate/test/file',
		data : str_data,
		// 处理返回的结果
		success : function(data) {
			console.log(data);
			var jsonData = eval("(" + data + ")");
			if (jsonData.code == 200) {
				$("#main_file").text(jsonData.data);
			}
		}
	});
}
