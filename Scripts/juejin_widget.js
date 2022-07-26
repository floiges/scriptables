// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: fire;
//

// 添加require，是为了vscode中可以正确引入包，以获得自动补全等功能
if (typeof require === 'undefined') require = importModule;
const { ScriptableWidget } = require('./widget');
const { getCurrentPoints, getSignCounts } = require('./juejin');

// @组件代码开始
class Widget extends ScriptableWidget {
	/**
	 * 传递给组件的参数，可以是桌面 Parameter 数据，也可以是外部如 URLScheme 等传递的数据
	 * @param {string} arg 自定义参数
	 */
	constructor(arg) {
		super(arg);
		this.name = '掘金统计';
		this.logo =
			' https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/favicon-32x32.png';
		this.desc = '签到、矿石';
	}

	/**
	 * 渲染函数，函数名固定
	 * 可以根据 this.widgetFamily 来判断小组件尺寸，以返回不同大小的内容
	 */
	async render() {
		const data = await this.getData();
		switch (this.widgetFamily) {
			case 'large':
				return await this.renderLarge(data);
			default:
				return await this.renderMedium(data);
		}
	}

	/**
	 * 渲染小尺寸组件
	 */
	async renderSmall(data) {
		let w = new ListWidget();
		await this.renderHeader(w, this.logo, this.name);
		const t = w.addText(data['hotsearch'][0]['pure_title']);
		t.font = Font.lightSystemFont(16);
		w.addSpacer();
		w.url = this.actionUrl(
			'open-url',
			decodeURIComponent(data['hotsearch'][0]['linkurl']),
		);
		return w;
	}
	/**
	 * 渲染中尺寸组件
	 */
	async renderMedium(data = [], num = 4) {
		let w = new ListWidget();
		await this.renderHeader(w, this.logo, this.name);
		data.map((d, i) => {
			const cell = w.addStack();
			cell.centerAlignContent();
			const idx = cell.addText(d.title);
			idx.font = Font.boldSystemFont(14);
			if (i === 0) {
				idx.textColor = new Color('#fe2d46', 1);
			} else if (i === 1) {
				idx.textColor = new Color('#ff6600', 1);
			} else if (i === 2) {
				idx.textColor = new Color('#faa90e', 1);
			}
			cell.addSpacer(10);
			const cell_text = cell.addText(d.count);
			cell_text.font = Font.lightSystemFont(14);
			cell_text.lineLimit = 1;
			cell.addSpacer();
			w.addSpacer();
		});
		// w.addSpacer()

		// let lbg = new LinearGradient()
		// lbg.locations = [0, 1]
		// lbg.colors = [
		//   Color.dynamic(new Color('#cfd9df', 1), new Color('#09203f', 1)),
		//   Color.dynamic(new Color('#e2ebf0', 1), new Color('#537895', 1))
		// ]
		// w.backgroundGradient = lbg
		return w;
	}
	/**
	 * 渲染大尺寸组件
	 */
	async renderLarge(data) {
		return await this.renderMedium(data, 11);
	}

	/**
	 * 获取数据函数，函数名可不固定
	 */
	async getData() {
		const countRes = await getSignCounts();
		const pointRes = await getCurrentPoints();
		return [
			{
				title: '连续签到',
				count: countRes.cont_count || 0,
			},
			{
				title: '累计签到',
				count: countRes.sum_count || 0,
			},
			{
				title: '累计矿石',
				count: pointRes,
			},
		];
	}

	/**
	 * 自定义注册点击事件，用 actionUrl 生成一个触发链接，点击后会执行下方对应的 action
	 * @param {string} url 打开的链接
	 */
	async actionOpenUrl(url) {
		Safari.openInApp(url, false);
	}
}
// @组件代码结束

const { Testing } = require('./env');
await Testing(Widget);
