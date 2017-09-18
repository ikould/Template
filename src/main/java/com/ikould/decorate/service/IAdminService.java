package com.ikould.decorate.service;

import com.ikould.decorate.entity.Admin;

public interface IAdminService {

	/**
	 * 检查用户名是否存在
	 * 
	 * @param adminName
	 * @return
	 */
	public Admin getAdminByName(String adminName);
}
