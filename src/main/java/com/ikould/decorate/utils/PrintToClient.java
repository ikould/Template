package com.ikould.decorate.utils;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

public class PrintToClient {

	/**
	 * 回应客户端
	 * 
	 * @param response
	 * @param json
	 * @throws IOException
	 */
	public static void printMsgToClient(HttpServletResponse response,
			JSONObject json) throws IOException {
		JSONObject jsonFrame = new JSONObject();
		jsonFrame.put("code", 200);
		jsonFrame.put("data", json);
		PrintWriter pw = response.getWriter();
		pw.print(jsonFrame.toString());
		pw.flush();
		pw.close();
	}

	/**
	 * 回应请求错误信息给客户端
	 * 
	 * @param response
	 * @param json
	 * @throws IOException
	 */
	public static void printErrorMsgToClient(HttpServletResponse response)
			throws IOException {
		PrintWriter pw = response.getWriter();
		JSONObject json = new JSONObject();
		json.put("code", 207);
		json.put("msg", "请求错误");
		pw.print(json.toString());
		pw.flush();
		pw.close();
	}

	/**
	 * 回应请求成功信息给客户端
	 * 
	 * @param response
	 * @param json
	 * @throws IOException
	 */
	public static void printSuccessMsgToClient(HttpServletResponse response)
			throws IOException {
		PrintWriter pw = response.getWriter();
		JSONObject json = new JSONObject();
		json.put("code", 200);
		json.put("msg", "操作成功");
		pw.print(json.toString());
		pw.flush();
		pw.close();
	}
}
