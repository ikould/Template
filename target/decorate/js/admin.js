var name;
var password;

window.onload = function() {
	measureBg();
}
$(window).resize(function() {
	measureBg();
});

function measureBg() {
	$(".admin_bg").width(window.innerWidth);
	$(".admin_bg").height(window.innerHeight);
	$(".admin_input")
			.css(
					{
						"marginTop" : (window.innerHeight - $(".admin_input")
								.height()) * 8 / 24
					});
}

$(document).ready(function() {
	$("#load_btn").click(function() {
		loadAdmin();
	})
});

function keyLogin() {
	if (event.keyCode == 13) // 回车键的键值为13
		document.getElementById("load_btn").click(); // 调用登录按钮的登录事件
}

function loadAdmin() {
	name = $(".load_name_input").val();
	password = $(".load_password_input").val();
	if (name == "") {
		$(".name_msg").show();
		$(".name_msg").html("请输入用户名");
	}
	if (password == "") {
		$(".password_msg").show();
		$(".password_msg").html("请输入密码");
	}
	if (name == "" || password == "")
		return;
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
			switch (jsonData.code) {
			case 0:
				$(".name_msg").show();
				$(".password_msg").hide();
				$(".name_msg").html("用户名错误");
				break;
			case 1:
				$(".name_msg").hide();
				$(".password_msg").hide();
				loadManager();
				break;
			case 2:
				$(".name_msg").hide();
				$(".password_msg").show();
				$(".password_msg").html("密码错误");
				break;
			}
		}
	});
}

// 跳转管理界面
function loadManager() {
	setCookie("name", name);
	setCookie("password", password);
	window.location.href = "manager.html";
}

// 写cookies
function setCookie(name, value) {
	var exp = new Date();
	exp.setTime(exp.getTime() + 2 * 60 * 60 * 1000);
	document.cookie = name + "=" + escape(value) + ";expires="
			+ exp.toGMTString();
}
