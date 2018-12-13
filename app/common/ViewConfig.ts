import IndexLogic from "../logic/view_logic/IndexLogic";
import AlertLogic from "../logic/view_logic/AlertLogic";
import GameLogic from "../logic/view_logic/GameLogic";
import FindLogic from "../logic/view_logic/FindLogic";
import NewsContent from "../logic/view_logic/NewsContent";
import CollectLogic from "../logic/view_logic/CollectLogic";
import RechargeLogic from "../logic/view_logic/RechargeLogic";
import RechargeSuccess from "../logic/view_logic/RechargeSuccess";
import RechargeRecordLogic from "../logic/view_logic/RechargeRecordLogic";
import IntegralLogic from "../logic/view_logic/IntegralLogic";
import OrderDetail from "../logic/view_logic/OrderDetail";
import IntegralDetail from "../logic/view_logic/IntegralDetail";
import AwardsBox from "../logic/view_logic/AwardsBox";
import PersonalLogic from "../logic/view_logic/PersonalLogic";
import GameInner from '../logic/view_logic/GameInner'
import EmailLogic from "../logic/view_logic/EmailLogic";
import NewsInfo from "../logic/view_logic/newsInfo";
import MyOrder from "../logic/view_logic/MyOrder";
import AddressesLogic from "../logic/view_logic/AddressesLogic";
import AddressLogic from "../logic/view_logic/AddressLogic";
import Logistics from "../logic/view_logic/Logistics";
import Customer from "../logic/view_logic/Customer";
import MyShare from "../logic/view_logic/MyShare";
import MySign from "../logic/view_logic/MySign";
import UpdateAddress from "../logic/view_logic/UpdateAddress";
import OrderSubmit from "../logic/view_logic/OrderSubmit";
import FriendRecharge from "../logic/view_logic/FriendRecharge";

/**
 * 界面配置，路径，对应的类等等
 */
export default class ViewConfig {
    /**首页 */
    static index: viewConfig = { name: 'index', class: IndexLogic, skin: 'view/main.html', closePre: true };
    /**发布 */
    static find: viewConfig = { name: 'find', class: FindLogic, skin: 'view/find.html', closePre: true };
    /**文章内容 */
    static newsContent: viewConfig = { name: 'newsContent', class: NewsContent, skin: 'view/news-content.html', closePre: true };
    /**文件收藏 */
    static collect: viewConfig = { name: 'collect', class: CollectLogic, skin: 'view/collect.html', closePre: true };
    /**游戏 */
    static game: viewConfig = { name: 'game', class: GameLogic, skin: 'view/game.html', closePre: false };
    /**测试页 */
    static alert: viewConfig = { name: 'alert', class: AlertLogic, skin: 'view/alert.html', closePre: true };
    /**充值 */
    static recharge: viewConfig = { name: 'recharge', class: RechargeLogic, skin: 'view/recharge.html', closePre: true };
    /**充值成功 */
    static rechargeSuccess: viewConfig = { name: 'rechargeSuccess', class: RechargeSuccess, skin: 'view/rechargeSuccess.html', closePre: true };
    /**充值记录 */
    static rechargeRecord: viewConfig = { name: 'rechargeRecord', class: RechargeRecordLogic, skin: 'view/rechargeRecord.html', closePre: false };
    /**好友代充 */
    static friendRecharge: viewConfig = { name: 'friendRecharge', class: FriendRecharge, skin: 'view/friendRecharge.html', closePre: true };
    /**积分兑 */
    static integral: viewConfig = { name: 'integral', class: IntegralLogic, skin: 'view/integral.html', closePre: true };
    /**我的订单*/
    static myOrder: viewConfig = { name: 'myOrder', class: MyOrder, skin: 'view/myOrder.html', closePre: true };
    /**订单详细 */
    static orderDetail: viewConfig = { name: 'orderDetail', class: OrderDetail, skin: 'view/orderDetail.html', closePre: true };
    /**提交订单 */
    static orderSubmit: viewConfig = { name: 'orderSubmit', class: OrderSubmit, skin: 'view/orderSubmit.html', closePre: true };
    /**积分兑详细 */
    static integralDetail: viewConfig = { name: 'integralDetail', class: IntegralDetail, skin: 'view/integralDetail.html', closePre: true };
    /**奖品柜 */
    static awardsBox: viewConfig = { name: 'awardsBox', class: AwardsBox, skin: 'view/awardsBox.html', closePre: true };
    /**我的 */
    static personal: viewConfig = { name: 'personal', class: PersonalLogic, skin: 'view/personal.html', closePre: true };
    /**第三关内页 */
    static gameInner: viewConfig = { name: 'gameInner', class: GameInner, skin: 'view/gameInner.html', closePre: true };
    /**邮件 */
    static email: viewConfig = { name: 'email', class: EmailLogic, skin: 'view/email.html', closePre: true };
    /**消息详情*/
    static newsInfo: viewConfig = { name: 'newsInfo', class: NewsInfo, skin: 'view/newsInfo.html', closePre: true };
    /**收货地址 */
    static addresses: viewConfig = { name: 'addresses', class: AddressesLogic, skin: 'view/addresses.html', closePre: true };
    /**地址编辑 */
    static updateAddress: viewConfig = { name: 'updateAddress', class: UpdateAddress, skin: 'view/updateAddress.html', closePre: true  };
    /**新增收货地址 */
    static address: viewConfig = { name: 'address', class: AddressLogic, skin: 'view/address.html', closePre: true };
    /**物流信息*/
    static logistics: viewConfig = { name: 'logistics', class: Logistics, skin: 'view/logistics.html', closePre: true };
    /**客服 */
    static customer: viewConfig = { name: 'customer', class: Customer, skin: 'view/customer.html', closePre: true };
    /**我的分享 */
    static myShare: viewConfig = { name: 'myShare', class: MyShare, skin: 'view/myShare.html', closePre: true  };
    /**我的签到 */
    static mySign: viewConfig = { name: 'mySign', class: MySign, skin: 'view/mySign.html', closePre: true  };

}