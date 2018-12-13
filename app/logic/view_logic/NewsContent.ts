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
        let articleId = Utils.getValueByUrl('id');
        let articleInfo = await Net.getData(Api.articleInfo,{id:articleId});
        this.setArticleInfo(articleInfo);
        this.setShopList(articleInfo['advLits']);
        
         //判断当前用户是否收藏该文章
         this.favNum = await Net.getData(Api.articleFav,{id:articleId,action:3});
         $("#fav").find("span").text(this.favNum['count']);
         if(this.favNum['collect']==1){
            $("#fav").addClass("shareCur");
         }
         await Utils.ajax({
            url: '/src/jweixin-1.4.0.js',
            dataType:'script'
        });

        //微信分享
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
         $("#shareA").click(async() =>{  
             $(".shareDialog").show();      
            let share = this.node.find("#shareA");
            share.addClass("shareCur");
            let articleShare = await Net.getData(Api.articleShare,{id:articleId});
         })

         //关闭分享
         $(".shareDialog").click(function(){
            $(".shareDialog").hide();      
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
       let articleFav = await Net.getData(Api.articleFav,{id:Utils.getValueByUrl('id'),action:this.favId}); 
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