package com.edu.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.edu.model.UserVo;

@Controller
@RequestMapping("interceptor")
public class InterceptorController {


	@ResponseBody
	@RequestMapping(value="testInterceptor", method = {RequestMethod.GET, RequestMethod.POST})
	public UserVo testInterceptor(){
		System.out.println("Hello Interceptor !!!");
		return UserVo.valueOf("张三", 123);
	}
}
