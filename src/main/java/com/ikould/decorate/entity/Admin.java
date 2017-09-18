package com.ikould.decorate.entity;

import org.springframework.stereotype.Component;

/**
 * 管理员
 * 
 * @author ikould
 *
 */
@Component
public class Admin {
	// 主键
	private int id;
	// 名称
	private String name;
	// 密码
	private String password;

	public Admin() {
		super();
	}

	public Admin(int id, String name, String password) {
		super();
		this.id = id;
		this.name = name;
		this.password = password;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Override
	public String toString() {
		return "Admin [id=" + id + ", name=" + name + ", password=" + password
				+ "]";
	}
}
