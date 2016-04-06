package com.edu.convertor;

import org.springframework.core.convert.converter.Converter;

import com.edu.model.UserVo;

public class SnConvertor implements Converter<UserVo, UserVo> {

	@Override
	public UserVo convert(UserVo source) {
		return UserVo.valueOf("李四", 120);
	}

}
