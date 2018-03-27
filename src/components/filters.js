export function centToDollar(data, fixed) {
	if (data != undefined) {
		if (fixed) {
			return Number((parseFloat(data) / 100)).toFixed(fixed);
		} else {
			return (parseFloat(data) / 100);
		}
	}
}
export function prizeType(value) {
	var result = "";
	switch (value) {
		case 'coupon_shop':
			{
				result = '元店铺优惠券';
				break;
			}
		case 'coupon_goods':
			{
				result = "元商品优惠券";
				break;
			}
		case 'small_flow':
			{
				result = 'M小流量';
				break;
			}
		case 'flow_packet':
			{
				result = "M流量包";
				break;
			}
		case 'shop_goods':
			{
				result = '本店商品';
				break;
			}
		case 'double_ball':
			{
				result = "元双色球";
				break;
			}
		case 'point':
			{
				result = window.unit;
				break;
			}
		case 'flow':
			{
				result = "M流量包";
				break;
			}
	}
	return result;
}

export function relationType(value) {
	var result = "";
	switch (value) {
		case 'follow_shop':
			{
				result = '关注店铺有礼';
				break;
			}
		case 'store_item':
			{
				result = "收藏宝贝有礼";
				break;
			}
		case 'shopping_car':
			{
				result = '加购有礼';
				break;
			}
		case 'coupon_shop':
			{
				result = "好评有礼";
				break;
			}
		case 'draw':
			{
				result = '抽奖';
				break;
			}
		case 'sign':
			{
				result = "签到";
				break;
			}
		case 'force_follow':
			{
				result = "首页红包";
				break;
			}
	}
	return result;
}

export function ruleFormat(value) {
	if (value) {
		return value.replace(/[\r\n]/ig, "<br>")
	}
}

export function unitFormat(value) {
	if (value) {
		return value.replace(/积分/ig,window.unit);
	}
}