package com.edu.model;

public class UserVo {
	/**姓名*/
	private String name;
	/**年龄*/
	private int age;
	
	public static UserVo valueOf(String name, int age){
		UserVo vo = new UserVo();
		vo.name = name;
		vo.age = age;
		return vo;
	}
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getAge() {
		return age;
	}
	public void setAge(int age) {
		this.age = age;
	}
	
	
	
}
