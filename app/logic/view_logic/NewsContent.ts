import ViewBase from "../../core/ViewBase";
import Core from "../../core/Core";
import EventType from "../../common/EventType";
import ViewConfig from "../../common/ViewConfig";
import Utils from "../../core/Utils";
import { Net, Api } from "../../common/Net";
import Config from "../../common/Config";
let baseUrl = Config.baseUrl;

/**
 * 新闻内容页
 */
export default class NewsContent extends ViewBase {

 private favId: Number;  //1.收藏, 2.取消
 private favNum: Number;

 async  onEnable() {

        this.setLazyLoad();

        //更新底部导航状态
        Core.eventManager.event(EventType.updateBottomNav, { hide: true });

        $('#goBack').on('click', () => {          
            Core.viewManager.openView(ViewConfig.find);
            window.history.pushState(null, '', '#find');//临时用，后期优化
        });

        //获取文章id
        let articleId = this.dataSource;
        let articleInfo = await Net.getData(Api.articleInfo,{id:articleId});
        this.setArticleInfo(articleInfo);
        this.setShopList(articleInfo['advLits']);
        
         //判断当前用户是否收藏该文章
         this.favNum = await Net.getData(Api.articleFav,{id:articleId,action:3});
         $("#fav").find("span").text(this.favNum['count']);
         if(this.favNum['collect']==1){
            $("#fav").addClass("shareCur");
         }
         

         //用户分享文章
         $("#shareA").click(async() =>{
            location.href= baseUrl + '/weiXin/jsdk';
            let share = this.node.find("#shareA");
            share.addClass("shareCur");
            let articleShare = await Net.getData(Api.articleShare,{id:articleId});
         })
                

        this.setLazyLoad();
    }

    onClick(e: Event) {
        switch (e.target['className']) {
            case 'icon collect'://点赞
                this.favVote();
                break
        }
    }

    /**
     * 点赞
     */
    async favVote(){    
        let fav = this.node.find("#fav");
        fav.hasClass("shareCur") ? fav.removeClass("shareCur") : fav.addClass("shareCur");  
        if(fav.hasClass("shareCur")){
            this.favId=1;
        }else{
            this.favId=2;
        }
       let articleFav = await Net.getData(Api.articleFav,{id:this.dataSource,action:this.favId}); 
       fav.find("span").text(articleFav['count']);
    }

    
    /**
     * 文章列表
     */
    private setArticleInfo(articleInfo: any[]){
        let html='';
        let num=`${articleInfo['advCount']}`;  
         
        //文章详情
        html +=` <h1>${articleInfo['title']}</h1>
                <div class="content">${articleInfo['content']}</div>`  

        $("#num").text(num);
        $('#newsC').html(html);
         
    }

    /**
     * 文章商品
     * @param advCount
     */
    private setShopList(advCount: any[]){
        let html ='';
        for(let x=0;x<advCount.length;x++){
            html+=`<li>
                    <a href="javascirpt:void(0);">
                        <img class="lazy" src="" alt="" data-src="${Config.imgBase + advCount[x]['src']}">
                    </a>
                    <div class="right relative">
                        <h3>${advCount[x]['title']}</h3>
                        <em class="price absolute">市场参考价格：￥${advCount[x]['short_title']}</em>
                        <a href="javascript:void(0);" class="btn_red get-btn absolute">${advCount[x]['button_title']}</a>
                    </div>
                </li>`
        }
        
        $("#shopList").html(html);   

        if(!advCount.length){
            return
        }


        //打开文章商品弹窗
        let newsDialog = $(".newsdialCon");
        let num = $("#num");
        
        $("#shopMore").click(function(){
            $(".mask").addClass('fadeIn');
            newsDialog.addClass("fadeInUp");
            newsDialog.show();
            $(".mask").show();
        })

        $("#toggle").click(function(){
            $(".mask").removeClass('fadeIn');
            newsDialog.removeClass("fadeInUp");
            $(".mask").hide();
            newsDialog.hide();
            
        })
       
    }


    /**
     * 设置懒加载 
     */
    private setLazyLoad() {
        lazyload($(".lazy"));
    }



    onRemove() {
        $('#goBack').off();
    }
}