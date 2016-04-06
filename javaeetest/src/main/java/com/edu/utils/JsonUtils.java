package com.edu.utils;

import java.io.StringWriter;
import java.lang.reflect.Type;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.type.ArrayType;
import org.codehaus.jackson.map.type.TypeFactory;
import org.codehaus.jackson.type.JavaType;
import org.codehaus.jackson.type.TypeReference;
import org.slf4j.helpers.FormattingTuple;
import org.slf4j.helpers.MessageFormatter;


@SuppressWarnings("unchecked")
public final class JsonUtils {

	// private static final Logger logger = LoggerFactory.getLogger(JsonUtils.class);

	private static TypeFactory typeFactory = TypeFactory.defaultInstance();

	private static final ObjectMapper mapper;

	static {
		mapper = new ObjectMapper();
	}

	private JsonUtils() {
		throw new IllegalAccessError("该类不允许实例化");
	}

	/**
	 * 将对象转换为 JSON 的字符串格式
	 * @param object
	 * @return
	 */
	public static String object2String(Object object) {
		StringWriter writer = new StringWriter();
		try {
			mapper.writeValue(writer, object);
		} catch (Exception e) {
			FormattingTuple message = MessageFormatter.format("将对象[{}]转换为JSON字符串时发生异常", object, e);
			throw new RuntimeException(message.getMessage(), e);
		}
		return writer.toString();
	}

	/**
	 * 将 map 转换为 JSON 的字符串格式
	 * @param map
	 * @return
	 */
	public static String map2String(Map<?, ?> map) {
		StringWriter writer = new StringWriter();
		try {
			mapper.writeValue(writer, map);
		} catch (Exception e) {
			FormattingTuple message = MessageFormatter.format("将MAP[{}]转换为JSON字符串时发生异常", map, e);
			throw new RuntimeException(message.getMessage(), e);
		}
		return writer.toString();
	}

	/**
	 * 将 JSON 格式的字符串转换为 map
	 * @param content
	 * @return
	 */
	public static Map<String, Object> string2Map(String content) {
		JavaType type = typeFactory.constructMapType(HashMap.class, String.class, Object.class);
		try {
			return mapper.readValue(content, type);
		} catch (Exception e) {
			FormattingTuple message = MessageFormatter.format("将字符串[{}]转换为Map时出现异常", content);
			throw new RuntimeException(message.getMessage(), e);
		}
	}

	/**
	 * 将 JSON 格式的字符串转换为数组
	 * @param <T>
	 * @param content 字符串
	 * @param clz 数组类型
	 * @return
	 */
	public static <T> T[] string2Array(String content, Class<T> clz) {
		JavaType type = ArrayType.construct(typeFactory.constructType(clz));
		try {
			return (T[]) mapper.readValue(content, type);
		} catch (Exception e) {
			FormattingTuple message = MessageFormatter.format("将字符串[{}]转换为数组时出现异常", content, e);
			throw new RuntimeException(message.getMessage(), e);
		}
	}

	/**
	 * 将 JSON 格式的字符串转换为对象
	 * @param <T>
	 * @param content 字符串
	 * @param clz 对象类型
	 * @return
	 */
	public static <T> T string2Object(String content, Class<T> clz) {
		JavaType type = typeFactory.constructType(clz);
		try {
			return (T) mapper.readValue(content, type);
		} catch (Exception e) {
			FormattingTuple message = MessageFormatter.format("将字符串[{}]转换为对象[{}]时出现异常",
					new Object[] { content, clz.getSimpleName(), e });
			throw new RuntimeException(message.getMessage(), e);
		}
	}
	
	/**
	 * 将 JSON 格式的字符串转换为对象
	 * @param <T>
	 * @param json 字符串
	 * @param type 对象类型
	 * @return json为null时会返回null
	 */
	public static <T> T string2Object(String json, Type type) {
		try {
			if (StringUtils.isBlank(json)) {
				return null;
			}
			JavaType t = typeFactory.constructType(type);
			return (T) mapper.readValue(json, t);
		} catch (Exception e) {
			FormattingTuple message = MessageFormatter.format("将字符串[{}]转换为对象[{}]时出现异常", new Object[] { json, type, e });
			throw new RuntimeException(message.getMessage(), e);
		}
	}

	/***
	 * json 泛型转换 
	 * @param tr 示例 new TypeReference<List<Long>>(){}
	 **/
	public static <T> T string2GenericObject(String json, TypeReference<T> tr) {
		if (StringUtils.isBlank(json)) {
			return null;
		} else {
			try {
				return (T) mapper.readValue(json, tr);
			} catch (Exception e) {
				FormattingTuple message = MessageFormatter.format("将字符串[{}]转换为[{}]时出现异常", new Object[] { json, tr });
				throw new RuntimeException(message.getMessage(), e);
			}
		}
	}
	
	/**
	 * 将 JSON 格式的字符串转换为对象
	 * @param <T>
	 * @param json 字符串
	 * @param type 对象类型
	 * @return json为null时会返回null
	 */
	public static <T> T bytes2Object(byte[] json, Type type) {
		try {
			if (json == null || json.length == 0) {
				return null;
			}
			JavaType t = typeFactory.constructType(type);
			return (T) mapper.readValue(json, t);
		} catch (Exception e) {
			FormattingTuple message = MessageFormatter.format("将字符串[{}]转换为对象[{}]时出现异常", new Object[] { json, type, e });
			throw new RuntimeException(message.getMessage(), e);
		}
	}

	/***
	 * json数组泛型转换
	 * @param tr 示例 new TypeReference<List<Long>>(){}
	 **/
	public static <T> T bytes2GenericObject(byte[] json, TypeReference<T> tr) {
		if (json == null || json.length == 0) {
			return null;
		} else {
			try {
				return (T) mapper.readValue(json, tr);
			} catch (Exception e) {
				FormattingTuple message = MessageFormatter.format("将字符串[{}]转换为[{}]时出现异常", new Object[] { json, tr });
				throw new RuntimeException(message.getMessage(), e);
			}
		}
	}
	
	/**
	 * 将 JSON 格式的字符串转换为集合
	 * @param <T>
	 * @param content 字符串
	 * @param collectionType 集合类型
	 * @param elementType 元素类型
	 * @return
	 */
	public static <C extends Collection<E>, E> C string2Collection(String content, Class<C> collectionType,
			Class<E> elementType) {
		try {
			JavaType type = typeFactory.constructCollectionType(collectionType, elementType);
			return mapper.readValue(content, type);
		} catch (Exception e) {
			FormattingTuple message = MessageFormatter.format("将字符串[{}]转换为集合[{}]时出现异常", new Object[] { content,
				collectionType.getSimpleName(), e });
			throw new RuntimeException(message.getMessage(), e);
		}
	}

	/**
	 * 将字符串转换为{@link HashMap}对象实例
	 * @param content 被转换的字符串
	 * @param keyType 键类型
	 * @param valueType 值类型
	 * @return
	 */
	public static <K, V> Map<K, V> string2Map(String content, Class<K> keyType, Class<V> valueType) {
		JavaType type = typeFactory.constructMapType(HashMap.class, keyType, valueType);
		try {
			return (Map<K, V>) mapper.readValue(content, type);
		} catch (Exception e) {
			FormattingTuple message = MessageFormatter.format("将字符串[{}]转换为Map时出现异常", content);
			throw new RuntimeException(message.getMessage(), e);
		}
	}

	/**
	 * 将字符串转换为特定的{@link Map}对象实例
	 * @param content 被转换的字符串
	 * @param keyType 键类型
	 * @param valueType 值类型
	 * @param mapType 指定的{@link Map}类型
	 * @return
	 */
	public static <M extends Map<K, V>, K, V> M string2Map(String content, Class<K> keyType, Class<V> valueType,
			Class<M> mapType) {
		JavaType type = typeFactory.constructMapType(mapType, keyType, valueType);
		try {
			return mapper.readValue(content, type);
		} catch (Exception e) {
			FormattingTuple message = MessageFormatter.format("将字符串[{}]转换为Map时出现异常", content);
			throw new RuntimeException(message.getMessage(), e);
		}
	}
	
	/**
	 * 将 JSON 对象类型转换
	 * @param <T>
	 * @param value 字符串
	 * @param type 对象类型
	 * @return json为null时会返回null
	 */
	public static <T> T convertObject(Object value, Type type) {
		try {
			if (value == null) {
				return null;
			}
			JavaType t = typeFactory.constructType(type);
			return (T) mapper.convertValue(value, t);
		} catch (Exception e) {
			FormattingTuple message = MessageFormatter.format("将对象[{}]转换为类型[{}]时出现异常", new Object[] { value, type, e });
			throw new RuntimeException(message.getMessage(), e);
		}
	}

	/**
	 * 将 JSON 对象类型转换
	 * @param <T>
	 * @param value 字符串
	 * @param type 对象类型
	 * @return json为null时会返回null
	 */
	public static <T> T convertObject(Object value, TypeReference<T> type) {
		try {
			if (value == null) {
				return null;
			}
			JavaType t = typeFactory.constructType(type);
			return (T) mapper.convertValue(value, t);
		} catch (Exception e) {
			FormattingTuple message = MessageFormatter.format("将对象[{}]转换为类型[{}]时出现异常", new Object[] { value, type, e });
			throw new RuntimeException(message.getMessage(), e);
		}
	}

}
