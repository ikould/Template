var typeArray; // 所有type信息
var currentType; // 当前Type
var currentSeries; // 当前Series
var currentMaterialList; // 当前Material列表
var currentMaterial; // 当前Material

window.onload = function() {
	init();
}

// 初始化
function init() {
	initData();
	initSlide();
}

// 初始化左侧Slide
function initSlide() {
	$("#slide").height(window.innerHeight);
}

var isOut = false;
// 滑动
function slideToggle() {
	if (!isOut) {
		isOut = true;
		// slide 滑出来
		$("#slide").animate({
			left : '0px',
			opacity : '1',
		}, 300);
		// main 右滑
		$("#main").animate({
			left : '90px',
		}, 300);
		console.log("type_list click");
	} else {
		isOut = false;
		$("#slide").animate({
			left : '-90px',
			opacity : '0',
		}, 300);
		$("#main").animate({
			left : '0px',
		}, 300);
	}
}

// =========================================

// 加载数据
function initData() {
	getTypeData();
}

// 监听事件
function initListener() {
	$("#type_list").click(function() {
		slideToggle();
	});
	$("#slide>ul>li").click(function() {
		// 样式
		$(this).addClass("slide_type_choose");
		$(this).siblings().removeClass("slide_type_choose");
	});
	$("#slide>ul>li>p").click(function() {
		var parent = $(this).parent();
		var index = parent.index();
		currentType = typeArray[index];
		console.log("#slide>ul>li>p index = " + index);
		$("#slide>ul>li").eq(index).siblings().find(".series").slideUp();
		$("#slide>ul>li").eq(index).find(".series").slideToggle();
	});

	// 显示系列下的素材
	$(".series>li").click(
			function() {
				var index = $(this).index();
				// 样式
				$(this).parents().find("li").find("li").removeClass(
						"slide_series_choose");
				$(this).addClass("slide_series_choose");
				console.log(".series>li index = " + index);
				console.log("currentType.series.length = "
						+ currentType.series.length);
				if (index < currentType.series.length) {
					currentSeries = currentType.series[index];
					console.log(".series>li currentSeries = " + currentSeries);
					getMaterials();
				}
			})
}

// Material点击进入详情
function showMaterialClick(index) {
	console.log("showMaterialClick index = " + index);
	currentMaterial = currentMaterialList[index];
	setCookie("materialId",currentMaterial.id);
	window.location.href = "inner.html";
}

// 刷新Type数据
function getTypeData() {
	var str_data = {};
	// 通过ajax传输
	$.ajax({
		type : 'post',
		url : '/decorate/type/find_type',
		data : str_data,
		// 处理返回的结果
		success : function(data) {
			console.log("getTypeData data = " + data);
			var jsonData = eval("(" + data + ")");
			if (jsonData.code == 200) {
				console.log("getTypeData = jsonData.data = " + jsonData.data);
				refreshTypeView(jsonData.data.types);
				initListener();
			}
		}
	});
}

// 刷新Type信息
function refreshTypeView(types) {
	console.log("types = " + types);
	if (types != null) {
		typeArray = types;
		// 加载左侧栏信息
		$("#slide_type").html("");
		var length = types.length;
		console.log("length = " + length);
		for (var i = 0; i < types.length; i++) {
			createTypeView(types[i]);
		}
		// 初始化信息
		if (typeArray.length > 0) {
			currentType = typeArray[0];
			if (currentType.series.length > 0) {
				currentSeries = currentType.series[0];
				// 默认加载第一条数据
				getMaterials();
				// UI同步
				$("#slide>ul>li").eq(0).addClass("slide_type_choose");
				$("#slide>ul>li").eq(0).find(".series").slideToggle();
				$("#slide>ul>li li").eq(0).addClass("slide_series_choose");
			}
		}
	}
}

// 刷新Type视图
function createTypeView(type) {
	var length = type.series.length;
	var series = "";
	for (var i = 0; i < length; i++) {
		series += '<li>' + type.series[i].name + '</li>';
	}
	$("#slide_type").append(
			'<li>' + '<p class="type_name">' + '<span>' + type.name + '</span>'
					+ '</p>' + '<ul class="series clearfix">' + series
					+ '</ul>' + '</li>')
}

// 获取系列下的所有素材
function getMaterials() {
	$("#title").text(currentSeries.name);
	var str_data = {
		"seriesId" : currentSeries.id
	};
	console.log("str_data = " + str_data.seriesId);
	// 通过ajax传输
	$.ajax({
		type : 'get',
		url : '/decorate/material/find_material',
		data : str_data,
		// 处理返回的结果
		success : function(data) {
			console.log("getMaterials data = " + data);
			var jsonData = eval("(" + data + ")");
			if (jsonData.code == 200) {
				// 显示所有图片
				showMaterials(jsonData.data.materials);
			}
		}
	});
}

// 获取Mateial
function getMaterialText(materialId) {
	var str_data = {
		"materialId" : materialId,
	};
	// 通过ajax传输
	$.ajax({
		type : 'post',
		url : '/decorate/text/find_text',
		data : str_data,
		// 处理返回的结果
		success : function(data) {
			console.log(" getMaterialText data = " + data);
			var jsonData = eval("(" + data + ")");
			if (jsonData.code == 200) {
				$("#edit_material_desc").val(jsonData.data.text);
			}
		}
	});
}

// 显示json数据下的所有素材
function showMaterials(materials) {
	currentMaterialList = materials;
	var ss = "";
	for (var i = 0; i < materials.length; i++) {
		ss += '<li style="position:relative" onClick="showMaterialClick(' + i
				+ ')">' + '<img src="' + materials[i].picPath + '"/>'
				+ '<div class="material_info">'
				+ '<p class="material_subtitle">' + materials[i].subtitle
				+ '</p>' + '<div class="price clearfix">' + '<p>'
				+ '<label>市场价</label><span class="market_price">'
				+ materials[i].marketValue + '</span>' + '</p>' + '<p>'
				+ '<label>销售价</label><span class="selling_price">'
				+ materials[i].sellingValue + '</span>' + '</p>' + '</div>'
				+ '</div>' + '</li>'
	}
	$("#main_material").html(ss);
}

//写cookies
function setCookie(name, value) {
	var exp = new Date();
	exp.setTime(exp.getTime() + 2 * 60 * 60 * 1000);
	document.cookie = name + "=" + escape(value) + ";expires="
			+ exp.toGMTString();
}

// 读取cookies
function getCookie(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

	if (arr = document.cookie.match(reg))

		return unescape(arr[2]);
	else
		return null;
}