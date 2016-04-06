package com.edu.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.edu.model.UserVo;

@Controller
@RequestMapping("interceptor")
public class InterceptorController {

	@ResponseBody
	@RequestMapping(value = "testInterceptor", method = { RequestMethod.GET, RequestMethod.POST }, produces = {
			"application/text" })
	public UserVo testInterceptor() {
		System.out.println("Hello Interceptor !!!");
		UserVo vo = UserVo.valueOf("张三", 123);
		// TODO
		return vo;
	}

	// 10 TODO 公用的处理方式 PlayerVo , AccountVo
}
