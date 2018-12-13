import ViewBase from "../../core/ViewBase";
import Core from "../../core/Core";
import ViewConfig from "../../common/ViewConfig";
import Slider from "../component/Slider";
import EventType from "../../common/EventType";
import Config from "../../common/Config";
import { Net, Api } from "../../common/Net";
import Data from "../../common/Data";
import UserData from "../../common/UserData";

export default class IndexLogic extends ViewBase {

    /**轮播图组件*/
    private slide: Slider;

    onAwake() {
        Core.eventManager.on(EventType.error, this, this.onError);
    }

    onCreate() {
        if (!this.data) return;
        this.setBanner();
        this.setBrand();
    }

    /**
     * 设置banner数据
     */
    private setBanner() {
        let banner: any[] = this.data['bannerList'],
            html = '';
        for (let x = 0, l = banner.length; x < l; x++) {
            if (!banner[x]['src']) continue;
            html += `<em><a href="javascript:void(0);" lazy="${Config.imgBase + banner[x]['src']}"></a></em>`
        }
        this.template = Core.utils.replaceData('banner', this.template, html);
    }

    /**
     * 设置品牌
     */
    private setBrand() {
        let brandList: any[] = this.data['themeList'],
            html = '';
        for (let x = 0, l = brandList.length; x < l; x++) {
            html += `<a><img class="lazy" data-src="${Config.imgBase + brandList[x]['src']}" alt=""><em>${brandList[x]['title']}</em></a> `
        }

        this.template = Core.utils.replaceData('itemList', this.template, html);
    }


    async onEnable() {
        this.slide = new Slider('#banner');

        this.setLazyLoad();
        //更新底部导航状态
        Core.eventManager.event(EventType.updateBottomNav, { type: 'index' });

        //充值按钮绑定
        this.node.on('click', '.rechargeBtn', () => {
            Core.viewManager.openView(ViewConfig.recharge);
        });

        //用户信息
         let coin: any =  UserData.coin ;
        $(".rechargeBtn em").text(coin);

        //设置房间列表
        let roomList = await Net.getData(Api.roomList, { themeId: 0, page: 0 })
        this.setRoomList(roomList['list']);

        //我的签到
        let sign = await Net.getData(Api.signature);
        //按照Id倒序排序
        let signOrder = sign['list'].sort(function (a, b) {
            return a.id - b.id;
        });
        this.getSignList(signOrder, sign['dayList']);

        //点击签到
        $(".sinBtn").click(async () => {
            let sign = await Net.getData(Api.signature, { action: 1 });
            let goodInfo = sign['goodsInfo'];
            //签到成功操作
            if (sign) {
                $('#signDialog').find(".signCon").remove();
                let html = ` <div class="mask"></div>
                            <div class="signSucess">
                                <div class="monGet">
                                    <span class="icon"></span>
                                    <span class="num">x10</span>
                                </div>
                                <p class="tips">恭喜您${goodInfo['title']}</p>
                                <div class="okayBtn">确定</div>
                            </div>`
                $('#signDialog').append(html);
                $('#signDialog').find(".mask").show();
                $('#signDialog').find(".signSucess").addClass("slideInDown");

            }
        })

        //签到成功关闭
        $("#signDialog").on("click", '.okayBtn', function () {
            $('#signDialog').find(".mask").hide();
            $('#signDialog').find(".signSucess").remove();
        })

        this.setLazyLoad();
    }

    /**
     * 设置房间列表 
     * @param list 
     */
    private setRoomList(list: any[]) {
        let html = '';
        for (let x = 0, l = list.length; x < l; x++) {
            if (!list[x]['src']) continue;
            html += `<li>
            <a href="javascript:void(0);" class="room-info" data-id="${list[x]['id']}">
                <img class="lazy"  data-src="${Config.imgBase + list[x]['src']}" alt="">
            </a>
            <div class="item-msg">
                <div class="left">
                    <h3 class="font-clip">${list[x]['title']}</h3>
                    <span class="flex">
                        <em class="price f26">魅力币：${list[x]['low_coin']}</em>
                        <del class="f22">专柜价：&yen;${list[x]['discount']}</del>
                    </span>
                </div>
                <div class="right">
                    <a href="javascript:void(0);" class="btn_red need-btn f26 room-info" data-id="${list[x]['id']}" >我要这支</a>
                </div>
            </div>
            <i class="absolute game-status f20 font-clip">
                ${list[x]['player']}人游戏中
            </i>
        </li>`;
        }
        $('#roomList').html(html);
        //打开场次详情
        $('#roomList').on('click', '.room-info', function () {
            location.href = '#gameInner?id=' + $(this).data('id');
        });
    }

    /**
     * 签到弹窗显示
     */
    private setSignDialog() {
        $('#signDialog').find(".mask").show();
        $('#signDialog').find(".signCon").addClass('slideInDown');

    }

    /**
     * 我的签到
     * @param list 
     * @param dayList 已经签到列表
     */
    private getSignList(list: any, dayList: any[]) {
        let html = '';
        let num;
        if(dayList.length>0 && dayList[0]['num']){
            num =parseInt(dayList[0]['num']);
        }
        for (let x = 0; x < list.length; x++) {
            
            html += `<li class="days-small ${num>0 ? 'days-disable' : ''}" data-id="${list[x]['id']}">
                        <div class="t">第${x + 1}天</div>  
                        <div class="${num>0  ? 'complete' : ''}"></div>                      
                        <p class="signicon"></p>
                        <p class="money">${list[x]['title']}</p>
                    </li>`;
            num--;
        }

        $("#mySignDays").html(html);
        $("#mySignDays").children("li").eq(2).addClass("days-big");
        $("#mySignDays").children("li").eq(6).addClass("days-big");


        //判断当天是否有签到
        let myDate = new Date();
        let year = myDate.getFullYear();
        let month = (myDate.getMonth() + 1).toString().replace(/^(\d)$/, "0$1");
        let date = myDate.getDate().toString().replace(/^(\d)$/, "0$1");
        let nowTime = Date.parse(year + '-' + month + '-' + date);
        if (dayList.length == 0) { this.setSignDialog(); return; }
        for (let x = 0; x < dayList.length; x++) {
            let time = Date.parse(dayList[x]['c_date']);
            if (time == nowTime) {
                $('#signDialog').find(".mask").hide();
                $(".signCon").remove();
                break;
            } else {
                this.setSignDialog();

            }
        }

    }


    /**
    * 错误弹窗显示
    * @param data  错误提示信息
    */

    private onError(data: any) {
        switch (data['api']) {
            case Api.signature.name:
                this.errorDialog(data['data']['mes']);
                this.errorTip();
                break;
        }
    }

    /**
     * 错误提示HTML
     */
    private errorDialog(txt: any) {
        let html = `<div id="toast" class="toast"  style="bottom:20%;">
                    ${txt}
                 </div>`
        $("#index").append(html);
        $('#signDialog').find(".mask").hide();
        $(".signCon").remove();
    }

    /**
     * 错误提示弹窗隐藏
     */
    private errorTip() {
        setTimeout(() => {
            $("#toast").remove();
        }, 1000);
    }


    /**
     * 设置懒加载 
     */
    private setLazyLoad() {   
        lazyload($(".lazy"));
    }

    onClick(e: MouseEvent) {

    }

    onUpdate() {
        // console.log(this.node)
    }

    onRemove() {
        console.log('删除首页');
        this.slide.clearTime();
        this.slide = null;
    }


}