package com.edu.convertor;

import java.io.IOException;
import java.nio.charset.Charset;

import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.AbstractHttpMessageConverter;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;

import com.edu.model.UserVo;

public class SnHttpMessageConvertor extends AbstractHttpMessageConverter<UserVo> {
	public SnHttpMessageConvertor() {
		super(new MediaType("application", "text", Charset.forName("UTF-8")));
	}

	@Override
	protected boolean supports(Class<?> clazz) {
		return UserVo.class.isAssignableFrom(clazz);
	}

	@Override
	protected UserVo readInternal(Class<? extends UserVo> clazz, HttpInputMessage inputMessage)
			throws IOException, HttpMessageNotReadableException {
		// TODO Auto-generated method stub
		return UserVo.valueOf("李四", 100);
	}

	@Override
	protected void writeInternal(UserVo t, HttpOutputMessage outputMessage)
			throws IOException, HttpMessageNotWritableException {

		String out = "hello:" + t.getName() + "-" + t.getAge();
		outputMessage.getBody().write(out.getBytes());

	}

}
