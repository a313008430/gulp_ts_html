import ViewBase from "../../core/ViewBase";
import Core from "../../core/Core";
import Utils from "../../core/Utils";
import { Net, Api } from "../../common/Net";
import ViewConfig from "../../common/ViewConfig";
import Config from "../../common/Config";
import Slider from "../component/Slider";
import UserData from "../../common/UserData";


/**
 * 场次详情
 */
export default class GameInner extends ViewBase {

    /**轮播图组件*/
    private slide: Slider;
    private favId: Number;  //1.收藏, 2.取消
    private favNum: Number;

    async onEnable() {
        $('#goBack').on('click', () => {
            if (Core.preView) {
                // history.pushState(null, null, '#' + Core.preView.name);
                // Core.viewManager.openView(Core.preView);
                window.history.go(-1);
            } else {
                location.href = '#';
            }
        });

        //获取场次id
        // let roomId = this.dataSource;
        let roomId = Utils.getValueByUrl('id');
        let roomInfo = await Net.getData(Api.roomInfo, { id: roomId });//获取房间详情
        this.setItemList(roomInfo['goodsList']);
        this.setBanner(roomInfo['bannerList']);

        let userInfo = await Net.getData(Api.userInfo, {
            roomId: roomId,
            game: 1
        });//获取用户信息

        $('#gameStartBtn').text(userInfo['ticketInfo']['id'] == 15 ? '直通挑战第3关' : '闯关');
        $('#gameStartBtn').on('click', async () => {
            let data = await Net.getData(Api.gameStart, {
                gid: userInfo['gameInfo']['gid'],
                roomId: roomId,
                sign: userInfo['gameInfo']['sign'],
                apiKey: userInfo['gameInfo']['apiKey']
            });
            UserData.preset = data['reStatus'];
            Core.viewManager.openView(ViewConfig.game, {
                gid: userInfo['gameInfo']['gid'],//游戏id
                apiKey: userInfo['gameInfo']['apiKey'],
                sign: userInfo['gameInfo']['sign'],//签名
                roomId: roomId,//场次id
                goodsId: userInfo['gameInfo']['goodsId'],//道具id， 目前是 15， 直通第三关道具
                sn: data['sn'],//订单号
                coin: data['coin'],//剩余积分
                progress: userInfo['ticketInfo']['id'] == 15 ? 3 : 1,//进度默认为1
            });
        })

        //判断当前用户是否收藏该场次
        this.favNum = await Net.getData(Api.roomFav, { id: roomId, action: 3 });
        if (this.favNum['collect'] == 1) {
            $("#fav").addClass("shareCur");
        }

         //微信分享
         await Utils.ajax({
            url: '/src/jweixin-1.4.0.js',
            dataType:'script'
        });
         let wxJsdk = await Net.getData(Api.wxJsdk);  
         let href=window.location.href;

         wx.config({
            //debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: wxJsdk['appId'], // 必填，公众号的唯一标识
            timestamp:wxJsdk['timestamp'], // 必填，生成签名的时间戳
            nonceStr:wxJsdk['nonceStr'], // 必填，生成签名的随机串
            signature: wxJsdk['signature'],// 必填，签名
            jsApiList: ['updateAppMessageShareData'] // 必填，需要使用的JS接口列表
        })

        wx.ready(function () {   
            wx.updateAppMessageShareData({ 
                title: '11', // 分享标题
                desc: '111', // 分享描述
                link: href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: 'http://img.okwan.com/kaixinwan/2018/06/04abff6207f2584c4f43e22e296520a3.png', // 分享图标
                success: function () {
                    // 设置成功
                    $(".shareDialog").hide();
                }
            })
        })
    


        //用户分享文章
        $("#shareA").click(async () => {
            $(".shareDialog").show();    
            let share = this.node.find("#shareA");
            share.addClass("shareCur");
            let roomShare = await Net.getData(Api.roomShare, { id: roomId });
        })
         //关闭分享
         $(".shareDialog").click(function(){
            $(".shareDialog").hide();    
            $("#shareA").removeClass("shareCur"); 
         })  


    }

    /**
     * 设置banner
     */
    private setBanner(list: any[]) {
        let html = '';
        for (let x = 0, l = list.length; x < l; x++) {
            if (!list[x]['src']) continue;
            html += `<em><a href="javascript:void(0);" lazy="${Config.imgBase + list[x]['src']}"></a></em>`
        }
        $('#banner').html(Core.utils.replaceData('banner', $('#banner').html(), html));

        this.slide = new Slider('#banner');

    }

    /**
     * 添加色号展示
     */
    private setItemList(list: any[]) {
        let html: string = '';
        for (let x = 0, l = list.length; x < l; x++) {
            html += `<li class="item">
            <img class="lazy" data-src="${Config.imgBase + list[x]['src']}" alt="">
            <p>${list[x]['title']}</p>
        </li>`
        }
        $('#contBox').html(html);
        lazyload($(".lazy"));
    }

    /**
    * 点赞
    */
    async favVote() {
        let fav = this.node.find("#fav");
        fav.hasClass("shareCur") ? fav.removeClass("shareCur") : fav.addClass("shareCur");
        if (fav.hasClass("shareCur")) {
            this.favId = 1;
        } else {
            this.favId = 2;
        }
        let roomFav = await Net.getData(Api.roomFav, { id: Utils.getValueByUrl('id'), action: this.favId });
    }


    onClick(e: Event) {
        switch (e.target['className']) {
            case 'icon shareFavico'://点赞
                this.favVote();
                break
        }
    }

    onRemove() {
        $('#gameStartBtn').off();
        this.slide.clearTime();
        this.slide = null;
    }
}   