
window.onload = function() {
	init();
}

// 初始化
function init() {
	initData();
}

// 加载数据
function initData() {
	var materialId = getCookie("materialId");
	getMaterialInfo(materialId);
}

// 获取系列下的所有素材
function getMaterialInfo(materialId) {
	var str_data = {
		"id" : materialId
	};
	// 通过ajax传输
	$.ajax({
		type : 'get',
		url : '/decorate/material/find_material_by_id',
		data : str_data,
		// 处理返回的结果
		success : function(data) {
			console.log("getMaterialInfo data = " + data);
			var jsonData = eval("(" + data + ")");
			if (jsonData.code == 200) {
				// 显示所有图片
				showMaterial(jsonData.data);
			}
		}
	});
}

//显示内容
function showMaterial(material) {
	// 设置内容
	$("#title").text(material.title);
	$("#show_material_subtitle").text(material.subtitle);
	$('#show_material_img').attr('src', material.picPath);
	$("#show_material_marketprice").text(material.marketValue);
	$("#show_material_sellingprice").text(material.sellingValue);
	$("#show_material_text").text(material.text);
}

// 读取cookies
function getCookie(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg))
		return unescape(arr[2]);
	else
		return null;
}