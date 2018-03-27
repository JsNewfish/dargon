export default function PageListModel(options) {
	this.options = $.extend({}, ooptions);
	this.init(this.options);
}


pageListModel.prototype.init(options) {
	this.defaultData = null;
	this.searchModel = null;
	this.list = [];
	this.list = this.list.concat(options.list);
}