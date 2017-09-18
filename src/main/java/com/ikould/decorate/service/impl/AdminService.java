package com.ikould.decorate.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ikould.decorate.entity.Admin;
import com.ikould.decorate.mapper.AdminMapper;
import com.ikould.decorate.service.IAdminService;

@Service("adminService")
public class AdminService implements IAdminService {

	@Autowired
	AdminMapper adminMapper;

	/**
	 * 检查用户名是否存在
	 * 
	 * @param adminName
	 * @return
	 */
	public Admin getAdminByName(String adminName) {
		return adminMapper.selectByName(adminName);
	}
}
