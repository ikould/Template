var typeArray; // 所有type信息
var currentType; // 当前Type
var currentSeries; // 当前Series
var currentMaterialList; // 当前Material列表
var currentMaterial; // 当前Material

window.onload = function() {
	console.log("window.onload");
	checkName();
}

function checkName() {
	name = getCookie("name");
	password = getCookie("password");
	if (!name == "" && !password == "") {
		var str_data = {
			"name" : name,
			"type" : "CHECK_ADMIN",
			"password" : password
		};
		console.log(str_data);
		// 通过ajax传输
		$.ajax({
			type : 'get',
			url : '/decorate/admin/do_admin',
			data : str_data,
			// 处理返回的结果
			success : function(data) {
				console.log(data);
				var jsonData = eval("(" + data + ")");
				if (jsonData.code == 1) {
					initType();
				} else {
					// 返回登陸界面
					window.location.href = "admin.html";
				}
			}
		});
	} else {
		// 返回登陸界面
		window.location.href = "admin.html";
	}
}

// 初始化Type
function initType() {
	// 获取数据
	getTypeData();
}

// 监听事件
function initTypeListener() {
	$("#slide").height(window.innerHeight);

	// =============== type 操作 =============
	// 显示添加Type界面
	$(".add_type").click(function() {
		$("#main").children().hide(); // 隐藏所有
		$("#add_type").show();
	});
	// 添加type内部按钮
	$("#add_type_btn").click(function() {
		addType();
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
		console.log(index);
		$("#slide>ul>li").eq(index).siblings().find(".series").slideUp();
		$("#slide>ul>li").eq(index).find(".series").slideToggle();
	});
	// 编辑Type
	$(".edit_type").click(function() {
		$("#main").children().hide(); // 隐藏所有
		var index = $(this).parents("li").index();
		currentType = typeArray[index];
		$("#edit_type").show();
		// 显示选中信息
		$("#edit_type_name_value").val(currentType.name);
		$("#edit_type_desc_value").val(currentType.msg);

	});
	// 编辑Type保存
	$("#edit_type_save").click(function() {
		saveType();
	});
	// 编辑Type删除
	$("#edit_type_delete").click(function() {
		if (window.confirm('确定要删除吗？')) {
			deleteType();
		}
	});

	// =============== series 操作 =============
	// 添加Series
	$(".add_series").click(function() {
		$("#main").children().hide(); // 隐藏所有
		$("#add_series").show();
	});
	// 编辑Series
	$(".edit_series").click(function() {
		$("#main").children().hide(); // 隐藏所有
		var index = $(this).parent().index();
		console.log(index);
		var series = currentType.series;
		currentSeries = series[index];
		$("#edit_series").show();
		$("#edit_series_name_value").val(currentSeries.name);
		$("#edit_series_desc_value").val(currentSeries.msg);
	});
	// 保存Series修改
	$("#edit_series_save").click(function() {
		saveSeries();
	});
	// 删除Series
	$("#edit_series_delete").click(function() {
		if (window.confirm('确定要删除吗？')) {
			deleteSeries();
		}
	});
	$(".series>li").click(
			function() {
				// 样式
				$(this).parents().find("li").find("li").removeClass(
						"slide_series_choose");
				$(this).addClass("slide_series_choose");
			});
	// 显示系列下的图片
	$(".series>li>p").click(function() {
		var index = $(this).parent().index();
		console.log(index + " : " + currentType.series.length);
		if (index != currentType.series.length) {
			currentSeries = currentType.series[index];
			$("#main").children().hide(); // 隐藏所有
			$(".main_material").show();
			getMaterials();
		}
	})
	// 系列添加内部按钮
	$("#add_series_btn").click(function() {
		addSeries();
	})

	// =============== Material 操作 =============

	$(".add_material").click(function() {
		$("#main").children().hide(); // 隐藏所有
		$("#add_material").show();
	});

	$("#add_material_img_btn").click(function() {
		uploadImg();
	});

	$("#edit_material_img_btn").click(function() {
		var str_data = {
			"name" : "",
			"msg" : ""
		};
		if ($("#edit_material_img").val() == "") {
			alert("请选择图片");
			return;
		}
		console.log($("#add_material_img").val());
		var form = $("#edit_material_img_form");
		var options = {
			cache : true,
			url : '/decorate/upload/file',
			type : 'post',
			timeout : 10000,
			async : true,
			success : function(data) {
				console.log(data);
				var jsonData = eval("(" + data + ")");
				if (jsonData.code == 200) {
					// 刷新页面
					$("#edit_material_img_msg").text(jsonData.data.filePath);
				}
			},
			error : function(request) {
				console.log("error");
			}
		};
		form.ajaxSubmit(options);
	});

	$("#add_material_save").click(function() {
		addMaterial();
	});

	$("#edit_material_save").click(function() {
		saveMaterial();
	});

	$("#edit_material_delete").click(function() {
		if (window.confirm('确定要删除吗？')) {
			deleteMaterial();
		}
	});
}

// Material点击进入编辑
function editMaterialClick(index) {
	console.log(index);
	currentMaterial = currentMaterialList[index];
	console.log("$(this).index() = " + index);
	console.log("currentMaterial.name = " + currentMaterial.title);
	$("#main").children().hide(); // 隐藏所有
	resetEditMaterialMsg();
	$("#edit_material").show();
}

// Material点击进入详情
function showMaterialClick(index) {
	console.log(index);
	currentMaterial = currentMaterialList[index];
	$("#main").children().hide(); // 隐藏所有
	$("#show_material").show();
	// 设置内容
	$("#show_material_title").text(currentMaterial.title);
	$("#show_material_subtitle").text(currentMaterial.subtitle);
	$('#show_material_img').attr('src', currentMaterial.picPath);

	$("#show_material_marketprice").text(currentMaterial.marketValue);
	$("#show_material_sellingprice").text(currentMaterial.sellingValue);
	var str_data = {
		"materialId" : currentMaterial.id,
	};
	// 通过ajax传输
	$.ajax({
		type : 'post',
		url : '/decorate/text/find_text',
		data : str_data,
		// 处理返回的结果
		success : function(data) {
			console.log(data);
			var jsonData = eval("(" + data + ")");
			if (jsonData.code == 200) {
				$("#show_material_text").text(jsonData.data.text);
			}
		}
	});
}

// 重置Material信息
function resetEditMaterialMsg() {
	$("#edit_material_title").val(currentMaterial.title);
	$("#edit_material_subtitle").val(currentMaterial.subtitle);
	$("#edit_material_img_msg").text(currentMaterial.picPath);
	$("#edit_material_market_price").val(currentMaterial.marketValue);
	$("#edit_material_selling_price").val(currentMaterial.sellingValue);
	console.log("marketValue = " + currentMaterial.marketValue
			+ " sellingValue = " + currentMaterial.sellingValue);
	getMaterialText(currentMaterial.id);
}

// 上传图片
function uploadImg() {
	console.log("load");
	var str_data = {
		"name" : "",
		"msg" : ""
	};
	if ($("#add_material_img").val() == "") {
		alert("请选择图片");
		return;
	}
	console.log($("#add_material_img").val());
	var form = $("#add_material_img_form");
	var options = {
		cache : true,
		url : '/decorate/upload/file',
		type : 'post',
		timeout : 10000,
		async : true,
		success : function(data) {
			console.log(data);
			var jsonData = eval("(" + data + ")");
			if (jsonData.code == 200) {
				// 刷新页面
				$("#add_material_img_msg").text(jsonData.data.filePath);
			}
		},
		error : function(request) {
			console.log("error");
		}
	};
	form.ajaxSubmit(options);
}

// 添加type
function addType() {
	var name = $("#add_type_name").val();
	var msg = $("#add_type_msg").val();
	if (name == "") {
		alert("请填写完整信息!");
		return;
	}
	if (msg == "") {
		msg = "无";
	}
	var str_data = {
		"name" : name,
		"msg" : msg
	};
	// 通过ajax传输
	$.ajax({
		type : 'post',
		url : '/decorate/type/add_type',
		data : str_data,
		// 处理返回的结果
		success : function(data) {
			console.log(data);
			var jsonData = eval("(" + data + ")");
			if (jsonData.code == 200)
				location.reload(); // 刷新页面
		}
	});
}

// 修改Type
function saveType() {
	var name = $("#edit_type_name_value").val();
	var msg = $("#edit_type_desc_value").val();

	if (name == "") {
		alert("请填写完整信息!");
		return;
	}
	if (msg == "") {
		msg = "无";
	}
	var str_data = {
		"id" : currentType.id,
		"name" : name,
		"msg" : msg
	};
	console.log("str_data = " + str_data.id);
	// 通过ajax传输
	$.ajax({
		type : 'post',
		url : '/decorate/type/update_type',
		data : str_data,
		// 处理返回的结果
		success : function(data) {
			console.log(data);
			var jsonData = eval("(" + data + ")");
			if (jsonData.code == 200)
				location.reload(); // 刷新页面
		}
	});
}

// 删除Type
function deleteType() {
	var str_data = {
		"id" : currentType.id,
	};
	console.log("str_data.id = " + str_data.id);
	// 通过ajax传输
	$.ajax({
		type : 'post',
		url : '/decorate/type/delete_type',
		data : str_data,
		// 处理返回的结果
		success : function(data) {
			console.log(data);
			var jsonData = eval("(" + data + ")");
			if (jsonData.code == 200)
				location.reload(); // 刷新页面
		}
	});
}

// 添加Series
function addSeries() {
	var name = $("#add_series_name_value").val();
	var msg = $("#add_series_msg_value").val();

	if (name == "") {
		alert("请填写完整信息!");
		return;
	}
	if (msg == "") {
		msg = "无";
	}
	var str_data = {
		"typeId" : currentType.id,
		"name" : name,
		"msg" : msg
	};
	console.log("str_data = " + str_data.typeId);
	// 通过ajax传输
	$.ajax({
		type : 'post',
		url : '/decorate/series/add_series',
		data : str_data,
		// 处理返回的结果
		success : function(data) {
			console.log(data);
			var jsonData = eval("(" + data + ")");
			if (jsonData.code == 200)
				location.reload(); // 刷新页面
		}
	});
}

// 修改Series
function saveSeries() {
	var name = $("#edit_series_name_value").val();
	var msg = $("#edit_series_desc_value").val();

	if (name == "") {
		alert("请填写完整信息!");
		return;
	}
	if (msg == "") {
		msg = "无";
	}
	var str_data = {
		"id" : currentSeries.id,
		"position" : currentSeries.position,
		"typeId" : currentType.id,
		"name" : name,
		"msg" : msg
	};
	console.log("str_data = " + str_data.id);
	// 通过ajax传输
	$.ajax({
		type : 'post',
		url : '/decorate/series/update_series',
		data : str_data,
		// 处理返回的结果
		success : function(data) {
			console.log(data);
			var jsonData = eval("(" + data + ")");
			if (jsonData.code == 200)
				location.reload(); // 刷新页面
		}
	});
}

// 删除Series
function deleteSeries() {
	var str_data = {
		"id" : currentSeries.id,
	};
	// 通过ajax传输
	$.ajax({
		type : 'post',
		url : '/decorate/series/delete_series',
		data : str_data,
		// 处理返回的结果
		success : function(data) {
			console.log(data);
			var jsonData = eval("(" + data + ")");
			if (jsonData.code == 200)
				location.reload(); // 刷新页面
		}
	});
}

// 显示所有素材
function getMaterials() {
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
			console.log(data);
			var jsonData = eval("(" + data + ")");
			if (jsonData.code == 200) {
				console.log(jsonData.data);
				// 显示所有图片
				showMaterials(jsonData.data.materials);
			}
		}
	});
}

// 添加Material
function addMaterial() {
	var title = $("#add_material_title").val();
	var subtitle = $("#add_material_subtitle").val();
	var picPath = $("#add_material_img_msg").text();
	var marketValue = $("#add_material_market_price").val();
	var sellingValue = $("#add_material_selling_price").val();
	var text = $("#add_material_desc").val();

	if (title == "" || subtitle == "" || marketValue == ""
			|| sellingValue == "" || text == "") {
		alert("请填写完整信息！");
		return;
	}
	if (picPath == "") {
		alert("请先上传图片！");
		return;
	}

	var str_data = {
		"typeId" : currentType.id,
		"seriesId" : currentSeries.id,
		"title" : title,
		"subtitle" : subtitle,
		"picPath" : picPath,
		"marketValue" : marketValue,
		"sellingValue" : sellingValue,
		"originalPrice" : "",
		"text" : text
	};
	// 通过ajax传输
	$.ajax({
		type : 'post',
		url : '/decorate/material/add_material',
		data : str_data,
		// 处理返回的结果
		success : function(data) {
			console.log(data);
			var jsonData = eval("(" + data + ")");
			if (jsonData.code == 200) {
				console.log(jsonData.data);
				$("#main").children().hide(); // 隐藏所有
				$(".main_material").show();
				getMaterials();
			}
		}
	});
}

// 修改Material
function saveMaterial() {
	var title = $("#edit_material_title").val();
	var subtitle = $("#edit_material_subtitle").val();
	var picPath = $("#edit_material_img_msg").text();
	var marketValue = $("#edit_material_market_price").val();
	var sellingValue = $("#edit_material_selling_price").val();
	var text = $("#edit_material_desc").val();

	if (title == "" || subtitle == "" || marketValue == ""
			|| sellingValue == "" || text == "") {
		alert("请填写完整信息！");
		return;
	}

	if (picPath == "") {
		alert("请先上传图片！");
		return;
	}

	var str_data = {
		"id" : currentMaterial.id,
		"typeId" : currentType.id,
		"seriesId" : currentSeries.id,
		"title" : title,
		"subtitle" : subtitle,
		"picPath" : picPath,
		"marketValue" : marketValue,
		"sellingValue" : sellingValue,
		"originalPrice" : "",
		"text" : text
	};
	console.log("str_data.id = " + str_data.id);
	// 通过ajax传输
	$.ajax({
		type : 'post',
		url : '/decorate/material/update_material',
		data : str_data,
		// 处理返回的结果
		success : function(data) {
			console.log(data);
			var jsonData = eval("(" + data + ")");
			if (jsonData.code == 200) {
				console.log(jsonData.data);
				$("#main").children().hide(); // 隐藏所有
				$(".main_material").show();
				getMaterials();
			}
		}
	});
}

// 刪除Material
function deleteMaterial() {
	var str_data = {
		"id" : currentMaterial.id,
	};
	// 通过ajax传输
	$.ajax({
		type : 'post',
		url : '/decorate/material/delete_material',
		data : str_data,
		// 处理返回的结果
		success : function(data) {
			console.log(data);
			var jsonData = eval("(" + data + ")");
			if (jsonData.code == 200) {
				$("#main").children().hide(); // 隐藏所有
				$(".main_material").show();
				getMaterials();
			}
		}
	});
}

// 刪除Material
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
			console.log(data);
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
	/*
	 * materials = [{ "id": 1, "typeId": 1, "seriesId": 1, "title": "素材111",
	 * "subtitle": "副标题", "picPath":
	 * "http://scimg.jb51.net/allimg/150819/14-150QZ9194K27.jpg", "marketValue":
	 * "1元", "sellingValue": "2元", "originalPrice": "3元", "textId": 1 }, { "id":
	 * 1, "typeId": 1, "seriesId": 1, "title": "素材222", "subtitle": "副标题",
	 * "picPath": "http://scimg.jb51.net/allimg/150819/14-150QZ9194K27.jpg",
	 * "marketValue": "1元", "sellingValue": "2元", "originalPrice": "3元",
	 * "textId": 1 }, { "id": 1, "typeId": 1, "seriesId": 1, "title": "素材333",
	 * "subtitle": "副标题", "picPath":
	 * "http://scimg.jb51.net/allimg/150819/14-150QZ9194K27.jpg", "marketValue":
	 * "1元", "sellingValue": "2元", "originalPrice": "3元", "textId": 1 }];
	 */
	var ss = "";
	for (var i = 0; i < materials.length; i++) {
		ss += '<li style="position:relative">' + '<img src="'
				+ materials[i].picPath
				+ '"  onClick="showMaterialClick('
				+ i
				+ ')"/>'
				+ '<div class="materialIndex">'
				+ (i + 1)
				+ '</div>'
				+ '<div class="material_info">'
				+ '<img src="img/ic_edit_black.png" class="materialEditImg"  onClick="editMaterialClick('
				+ i + ')"/>' + '<p class="material_title">'
				+ materials[i].title + '</p>' + '<p class="material_subtitle">'
				+ materials[i].subtitle + '</p>'
				+ '<div class="price clearfix">' + '<p>'
				+ '<label>市场价</label><span class="market_price">'
				+ materials[i].marketValue + '</span>' + '</p>' + '<p>'
				+ '<label>销售价</label><span class="selling_price">'
				+ materials[i].sellingValue + '</span>' + '</p>' + '</div>'
				+ '</div>' + '</li>'
	}
	$("#main_material").html("");
	$("#main_material").append(ss);
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
			console.log(data);
			var jsonData = eval("(" + data + ")");
			if (jsonData.code == 200) {
				console.log(jsonData.data);
				refreshTypeView(jsonData.data.types);
				initTypeListener();
			}
		}
	});
}

function refreshTypeView(types) {
	console.log("types = " + types);
	// 模拟
	/*
	 * types = [{ "id": 1, "name": "素材1", "msg": "无", "series": [{ "id": 1,
	 * "name": "系列1", "typeId": 1, "position": 1, "msg": "无" }, { "id": 2,
	 * "name": "系列2", "typeId": 1, "position": 2, "msg": "无" }] }, { "id": 2,
	 * "name": "素材2", "msg": "无", "series": [{ "id": 3, "name": "系列1", "typeId":
	 * 2, "position": 1, "msg": "无" }, { "id": 4, "name": "系列2", "typeId": 2,
	 * "position": 2, "msg": "无" }, { "id": 5, "name": "系列3", "typeId": 2,
	 * "position": 3, "msg": "无" }] }, { "id": 3, "name": "素材3", "msg": "无",
	 * "series": [] }];
	 */

	if (types != null) {
		typeArray = types;
		$(".slide_type").html("");
		var length = types.length;
		console.log("length = " + length);
		for (var i = 0; i < types.length; i++) {
			createTypeView(types[i]);
		}
		$(".slide_type").append('<li><p class = "add_type"> + 添加类型 </p> </li>');
	}
}

// 刷新Type视图
function createTypeView(type) {
	console.log("dsafdasfd");
	var length = type.series.length;
	var series = "";
	for (var i = 0; i < length; i++) {
		series += '<li>'
				+ '<p>'
				+ '<span>'
				+ type.series[i].name
				+ '</span>'
				+ '</p>'
				+ '<img src="img/ic_edit.png" align="right" class="edit_series" />'
				+ '</li>';
	}
	;
	// 添加'添加系列'
	series += '<li class = "add_series" style = "background: #9b7b2e !important">+ 添加系列</li>';
	$(".slide_type")
			.append(
					'<li>'
							+ '<p class="type_name">'
							+ '<span>'
							+ type.name
							+ '</span>'
							+ '</p>'
							+ '<img src="img/ic_edit.png" align="right" class="edit_type" />'
							+ '<ul class="series clearfix">' + series + '</ul>'
							+ '</li>')
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
