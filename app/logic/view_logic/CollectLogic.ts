import ViewBase from "../../core/ViewBase";
import Core from "../../core/Core";
import EventType from "../../common/EventType";
import ViewConfig from "../../common/ViewConfig";
import Config from "../../common/Config";
import { Net, Api } from "../../common/Net";

export default class CollectLogic extends ViewBase {

    /**是否开始编辑 */
    private edit: boolean = false;
    private articleId;  //文章id
    private roomId;    //场次Id

    async   onEnable() {

        this.setLazyLoad();


        //导航选择
        $('#nav').on('click', 'em', function () {
            let i = $(this).index();
            $(this).addClass('cur').siblings().removeClass('cur');
            $(".itemTab").hide().eq(i).show();
            $("#itemTabCon").find('li').removeClass('edit');
        });

        //返回按钮功能
        $('#goBack').on('click', () => {
            Core.viewManager.openView(ViewConfig.personal);
        });


        //收藏列表
        let favList = await Net.getData(Api.favList)
        this.favArticleList(favList['list']);      

        //删除收藏文章列表
        $("#favArticleList").on("click", '.del-btn', function () {
            $(".sureDialog").show();
            this.articleId = $(this).parent().data('id');
            $(".del").click(async()=> {
                await Net.getData(Api.articleFav, { id: this.articleId, action: 2 });

                $("#favArticleList").find("li").forEach(item => {
                    if($(item).data('id')==this.articleId){
                        $(item).remove();
                    }
                })
                
                $(".sureDialog").hide();
            })
           
        })

        //收藏场次列表
        let favRoomList = await Net.getData(Api.favRoomList)
        this.favRoomList(favRoomList['list']);

        //删除收藏场次列表
        $("#roomList").on("click", '.del-btn', function () {
            $(".sureDialog").show();
            this.roomId= $(this).parent().data('id');
            $(".del").click(async()=> {
                await Net.getData(Api.roomFav, { id: this.roomId, action: 2 });
                $("#roomList").find("li").forEach(item => {
                    if($(item).data('id')==this.roomId){
                        $(item).remove();
                    }
                })
                $(".sureDialog").hide();
            })
        })

        this.setLazyLoad();

    }

    onClick(e: Event) {
        switch (e.target['className']) {
            case 'edit-btn'://编辑功能
                this.setEdit();
                break;
            case 'cancle'://取消删除功能
                this.cancle();
                break;
        }
    }

    /**
     * 收藏文章列表
     */
    private favArticleList(list: any[]) {
        let html = '';
        for (let x = 0; x < list.length; x++) {
            html += ` <li data-id="${list[x]['id']}">
                    <a href="javascirpt:void(0);">
                        <img class="lazy" src="" alt="" data-src="${ Config.imgBase + list[x]['src']}">
                    </a>
                    <div class="right relative">
                        <h3>${list[x]['title']}</h3>
                        <a href="javascript:void(0);" class="btn_red get-btn absolute">立即查看</a>
                    </div>
                    <em class="del-btn absolute">
                        删除
                    </em>
                </li>`
        }
        $("#favArticleList").html(html);

        //立即查看
        $("#favArticleList").on("click", '.btn_red', function () {
            Core.viewManager.openView(ViewConfig.newsContent,$(this).parent().parent().data('id'));
        })
    }

    /**
     * 收藏场次列表
     */
    private favRoomList(list: any) {
        let html='';
        for(let x=0;x<list.length;x++){
            html+=`<li class="roomItem" data-id="${list[x]['id']}">
                    <a href="#game">
                        <img class="lazy" src="" data-src="${ Config.imgBase + list[x]['src']}" alt="">
                    </a>
                    <div class="item-msg">
                        <div class="left">
                            <h3 class="font-clip">${list[x]['title']}</h3>
                            <span class="flex">
                                <em class="price f26">魅力币：${list[x]['low_coin']}</em>
                                <del class="f22">专柜价：￥${list[x]['discount']}</del>
                            </span>
                        </div>
                        <div class="right">
                            <a href="javascript:void(0);" class="btn_red need-btn f26" data-id="${list[x]['id']}" >我要这支</a>
                        </div>
                    </div>
                    <i class="absolute game-status f20 font-clip">
                        2000人游戏中
                    </i>
                    <em class="del-btn absolute">
                        删除
                    </em>
                </li>`
        }
        $("#roomList").html(html);

    }


    /**
     * 取消删除文章
     */
    private cancle() {
        $(".sureDialog").hide();
        this.node.find('li').removeClass('edit');
    }


    /**
     * 设置可编辑状态
     */
    private setEdit() {
       // this.edit = !this.edit;

        this.node.find('li').hasClass("edit") ? this.node.find('li').removeClass('edit') : this.node.find('li').addClass('edit');
        
        // if (this.edit) {
        //     this.node.find('li').addClass('edit');
        // } else {
        //     this.node.find('li').removeClass('edit');
        // }
    }

    /**
     * 设置懒加载 
     */
    private setLazyLoad() {
        lazyload($(".lazy"));
    }
}