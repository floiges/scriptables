const FILE_MGR = FileManager[module.filename.includes('Documents/iCloud~') ? 'iCloud' : 'local']();
await Promise.all(
	['widget.js', 'env.js', 'example.js'].map(async (js) => {
		const REQ = new Request(
			`https://raw.githubusercontent.com/floiges/scriptables/v2-dev/Scripts/${encodeURIComponent(
				js,
			)}`,
		);
		const RES = await REQ.load();
		FILE_MGR.write(FILE_MGR.joinPath(FILE_MGR.documentsDirectory(), js), RES);
	}),
);
FILE_MGR.remove(module.filename);
Safari.open('scriptable:///open?scriptName=' + encodeURIComponent('example'));

module.exports = {};