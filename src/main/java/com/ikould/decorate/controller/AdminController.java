package com.ikould.decorate.controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONException;
import net.sf.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ikould.decorate.entity.Admin;
import com.ikould.decorate.service.IAdminService;

/**
 * 登陆控制
 * 
 * @author ikould
 */
@Controller
@RequestMapping(value = "/admin")
public class AdminController {
	/**
	 * 检查Admin
	 */
	public static final String CHECK_ADMIN = "CHECK_ADMIN";

	@Autowired
	IAdminService adminService;

	@RequestMapping(value = "/do_admin")
	public void main(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String questType = request.getParameter("type");
		switch (questType) {
		case CHECK_ADMIN:
			String name = request.getParameter("name");
			String password = request.getParameter("password");
			System.out.println("=======================");
			System.out.println("questType = " + questType);
			String sysPath = System.getProperty("user.dir"); 
			System.out.println("sysPath = " + sysPath);
			System.out.println("name = " + name);
			System.out.println("password = " + password);
			JSONObject json = checkAdmin(name, password);
			System.out.println("json = " + json.toString());
			System.out.println("=======================");
			printMsgToClient(response, json);
			break;
		}
	}

	/**
	 * 检查用户名和密码
	 */
	private JSONObject checkAdmin(String name, String password) {
		Admin admin = adminService.getAdminByName(name);
		System.out.println("admin = " + admin);
		int code = 0;
		String result = "用户名错误";
		if (admin != null) {
			boolean isPsdTrue = password.equals(admin.getPassword());
			if (isPsdTrue) {
				result = "success";
				code = 1;
			} else {
				code = 2;
				result = "密码错误";
			}
		}
		JSONObject json = new JSONObject();
		try {
			json.put("code", code);
			json.put("result", result);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return json;
	}

	/**
	 * 回应客户端
	 * 
	 * @param response
	 * @param json
	 * @throws IOException
	 */
	public void printMsgToClient(HttpServletResponse response, JSONObject json)
			throws IOException {
		PrintWriter pw = response.getWriter();
		pw.print(json.toString());
		pw.flush();
		pw.close();
	}
}
