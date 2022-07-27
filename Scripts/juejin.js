// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: code-branch;

const config = {
	getCountsUrl: 'https://api.juejin.cn/growth_api/v1/get_counts', // 连续签到次数
	currentPointsUrl: 'https://api.juejin.cn/growth_api/v1/get_cur_point', // 当前矿石总数
	signInUrl: `https://api.juejin.cn/growth_api/v1/check_in`, //签到接口
	freeCheckUrl: `https://api.juejin.cn/growth_api/v1/lottery_config/get`, //免费抽奖次数查询
	drawUrl: `https://api.juejin.cn/growth_api/v1/lottery/draw`, //抽奖接口
	headers: {
		Referer: 'https://juejin.cn/',
		'Upgrade-Insecure-Requests': 1,
		'User-Agent':
			'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
		cookie: `_ga=GA1.2.389726999.1606803038; MONITOR_WEB_ID=f8206ba6-3d9d-4696-bfc2-8946d7e78d8e; __tea_cookie_tokens_2608=%7B%22user_unique_id%22%3A%226901166487929112077%22%2C%22web_id%22%3A%226901166487929112077%22%2C%22timestamp%22%3A1640747644777%7D; n_mh=h2mcv-yYgGGKdAktKXV0-9I1UjBsChFP5IRxa2LV12s; sid_guard=9e17a0b1387c53b90321f9cbfd19ed91|1652430319|31536000|Sat,+13-May-2023+08:25:19+GMT; uid_tt=37723cdecefe5c071704e0e13543ba30; uid_tt_ss=37723cdecefe5c071704e0e13543ba30; sid_tt=9e17a0b1387c53b90321f9cbfd19ed91; sessionid=9e17a0b1387c53b90321f9cbfd19ed91; sessionid_ss=9e17a0b1387c53b90321f9cbfd19ed91; sid_ucp_v1=1.0.0-KGZiM2UzZDdiNGZiZjcwN2VlYThkZDFiNmVjYzVlYTdkYzIyMTdhODYKFwjehYG-_fW1AxDvq_iTBhiwFDgCQO8HGgJsZiIgOWUxN2EwYjEzODdjNTNiOTAzMjFmOWNiZmQxOWVkOTE; ssid_ucp_v1=1.0.0-KGZiM2UzZDdiNGZiZjcwN2VlYThkZDFiNmVjYzVlYTdkYzIyMTdhODYKFwjehYG-_fW1AxDvq_iTBhiwFDgCQO8HGgJsZiIgOWUxN2EwYjEzODdjNTNiOTAzMjFmOWNiZmQxOWVkOTE; _tea_utm_cache_2608={"utm_source":"gold_browser_extension"}; _gid=GA1.2.1426166690.1658709949`, //用自己的
	}, //相关请求头
};

/**
 * 掘金自动签到 请求方法
 */
const hacpaiSignRequest = async () => {
	console.log(`\n\n------ 开始签到------\n`);
	const { headers, signInUrl } = config; //签到相关参数
	let req = new Request(signInUrl);
	req.method = 'POST';
	req.headers = headers;
	const res = await req.loadJSON();
	if (res && res.data) {
		console.log(
			`\n ${JSON.stringify(res.data)} \n \n ------ 签到成功 ------\n`,
		);
		//签到成功后推送消息
		if (res.data.err_no == 0) {
			pushNotification(
				`掘金签到结果`,
				`获得: ${res.data.incr_point}矿石;\n 总计: ${res.data.sum_point}矿石`,
			);
		} else {
			pushNotification(`掘金签到失败`);
		}
		//签到成功后，30s内查询免费抽奖次数
		setTimeout(() => {
			freeCheck();
		}, Math.random() * 30 * 1000);
	} else {
		console.log(res);
		console.log(`\n ------ 签到失败 ------ \n`);
		pushNotification(`掘金签到结果`); //签到成功后推送消息
	}
};

/**
 * 查询还有几次免费抽奖的机会
 */
const freeCheck = async () => {
	console.log(`\n------开始查询抽奖次数 ------`);
	const { headers, freeCheckUrl } = config; //查询免费次数相关参数
	let req = new Request(freeCheckUrl);
	req.headers = headers;
	const res = await req.loadJSON();
	if (res && res.data) {
		console.log(
			`\n------ 获得免费抽奖次数：${res.data.free_count || 0} ------\n`,
		);
		if (res.data.free_count > 0) {
			//如果有免费抽奖次数直接开始抽奖
			luckDraw();
		}
	} else {
		console.log(res);
		console.log(`\n------ 查询抽奖次数失败 ------\n`);
	}
	return res;
};

/**
 * 掘金抽奖函数方法
 */
const luckDraw = async () => {
	console.log(`\n------ 开始抽奖 ------`);
	const { headers, drawUrl } = config; //抽奖相关参数
	let req = new Request(drawUrl);
	req.method = 'POST';
	req.headers = headers;
	const res = await req.loadJSON();
	if (res && res.data) {
		console.log(`\n ------ 抽奖成功，获得：${res.data.lottery_name} ------\n`);
		pushNotification('抽奖成功', res.data.lottery_name);
	} else {
		console.log(res);
		console.log(`\n ------ 抽奖失败 ------ \n`);
		pushNotification('抽奖失败');
	}
};

/**
 * 获取连续签到次数
 */
const getSignCounts = async () => {
	const { headers, getCountsUrl } = config; //抽奖相关参数
	let req = new Request(getCountsUrl);
	req.method = 'GET';
	req.headers = headers;
	const res = await req.loadJSON();
	console.log('🚀 ~ file: juejin.js ~ line 107 ~ getSignCounts ~ res', res);
	if (res && res.data) {
		return res.data;
	}

	return {};
};

/**
 * 获取矿石总数
 */
const getCurrentPoints = async () => {
	const { headers, currentPointsUrl } = config; //抽奖相关参数
	let req = new Request(currentPointsUrl);
	req.method = 'GET';
	req.headers = headers;
	const res = await req.loadJSON();
	console.log('🚀 ~ file: juejin.js ~ line 123 ~ getCurrentPoints ~ res', res);
	if (res && res.data) {
		return res.data;
	}

	return 0;
};

const pushNotification = (title, body = '无') => {
	const n = new Notification();
	n.title = title;
	n.body = `「Scriptable」${body}！`;
	n.schedule();
};

module.exports = {
	hacpaiSignRequest,
	getCurrentPoints,
	getSignCounts,
};
