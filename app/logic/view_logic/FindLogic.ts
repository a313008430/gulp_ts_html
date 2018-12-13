import ViewBase from "../../core/ViewBase";
import Slider from "../component/Slider";
import Core from "../../core/Core";
import EventType from "../../common/EventType";
import ViewConfig from "../../common/ViewConfig";
import Config from "../../common/Config";
import { Net, Api } from "../../common/Net";
import UserData from "../../common/UserData";


/**
 * 发现模板
 */
export default class FindLogic extends ViewBase {
    /**轮播图组件 */
    private slide: Slider;

    onCreate() {
        this.setBanner();
    }


    /**
     * 发现banner数据
     */
    private setBanner() {
        let banner: any[] = this.data['bannerList'],
            html = '';
        for (let x in banner) {
            if (!banner[x]['src']) return;
            html += `<em><a href="#alert" lazy="${Config.imgBase + banner[x]['src']}"></a></em>`
        }
        this.template = Core.utils.replaceData('banner', this.template, html);

    }


    async onEnable() {
        this.slide = new Slider('#banner');
        this.setLazyLoad();

        //充值按钮绑定
        this.node.on('click', '.rechargeBtn', () => {
            Core.viewManager.openView(ViewConfig.recharge);
        });

        //更新底部导航状态
        Core.eventManager.event(EventType.updateBottomNav, { type: 'find' });

        //用户信息
        let coin: any =  UserData.coin ;
        $(".rechargeBtn em").text(coin);


        //发现列表
        let findList = await Net.getData(Api.findList)
        this.setFindList(findList['list']);

        this.setLazyLoad();
    }

    /**
     * 发现列表
     * @param list
     */
    private setFindList(list: any[]) {
        let html = '';
        for (let x = 0; x < list.length; x++) {
            html += `<li data-id="${list[x]['id']}" >
                    <a href="javascript:void(0);">
                    <img class="lazy" src="" data-src="${Config.imgBase + list[x]['src']}" alt="">
                        <h3 class="${x%2==1 ? 'font-clipLine flexH' : 'font-clip'}">${list[x]['title']}</h3>
                        <span class="hot-status f18"><i class="icon"></i><em>${list[x]['browse']}</em></span>
                    </a>
                </li>`
        }
        $('#findList').html(html);

        //打开发现列表详情
        $('#findList').on('click', 'li', function () {
            location.href = '#newsContent?id=' + $(this).data('id');
        })
    }

    /**
     * 设置懒加载 
     */
    private setLazyLoad() {
        lazyload($(".lazy"));
    }

    onClick(e: MouseEvent) {
        // console.log(e.target);
    }

    onUpdate() {
        // console.log(this.node)
    }

    onRemove() {
        console.log('find界面关闭');
        this.slide.clearTime();
        this.slide = null;
    }
}